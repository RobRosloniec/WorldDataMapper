const ObjectId = require('mongoose').Types.ObjectId;
const Region   = require('../models/region-model');
const Sorting  = require('../utils/sorting')

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
		getAllRegions: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const regions = await Region.find({owner: _id}).sort({updatedAt: 'descending'});
			if(regions) {
				return (regions);
			} 

		},
		// /** 
		//  	@param 	 {object} args - a todolist id
		// 	@returns {object} a todolist on success and an empty object on failure
		// **/
		// getTodoById: async (_, args) => {
		// 	const { _id } = args;
		// 	const objectId = new ObjectId(_id);
		// 	const region = await Region.findOne({_id: objectId});
		// 	if(region) return region;
		// 	else return ({});
		// },
	},
	Mutation: {

        addMap: async(_, args) => {
            const { region:map } = args
			const objectId = new ObjectId();
			
			const { _id, owner, name, capital, leader, parentregion, landmarks, regions, sortRule, sortDirection} = map
			const newMap = new Region({
				_id: objectId,
				owner: owner,
				name: name,
				capital: capital,
				leader: leader,
				parentregion: parentregion,
				landmarks: landmarks,
				regions: regions,
				sortRule: sortRule,
				sortDirection: sortDirection,
			});
			const updated = await newMap.save();
			if(updated) {
				return newMap
			}
        },
		updateRegionField: async(_,args) => {
			const { _id, field, value} = args;
			const objectId = new ObjectId(_id);
	 		const updated = await Region.updateOne({_id: objectId}, {[field]: value});
			if(updated) {return value}
			else return ""
		},
		deleteRegion: async(_,args) => {
			console.log("DELETE")
			const { _id } = args;
			const regionID = new ObjectId(_id);
			const region = await Region.findOne({_id: regionID});

			if(region.parentregion === 'None'){
				const deleted = await Region.deleteOne({_id: regionID});
				if(deleted) return true;
				else return false;
			}
			else{
				const parentRegionID = new ObjectId(region.parentregion);
				const parentRegion = await Region.findOne({_id: parentRegionID});
				let parentRegions = parentRegion.regions;
				parentRegions = parentRegions.filter(region => region !== _id)
				const updated = await Region.updateOne({_id: parentRegionID}, { regions: parentRegions });
				const deleted = await Region.deleteOne({_id: regionID});
				if(deleted) return true;
				else return false;
			}
		},
		addRegion: async(_,args) => {
			const {region: newRegion} = args;
			const {_id, index} = args;

			const regionID = new ObjectId(_id);
			const objectID = new ObjectId();
			const found = await Region.findOne({_id: regionID});
			if(!found) return ('Region not found');
	 		if(newRegion._id === '') newRegion._id = objectID;

			let regionList = found.regions;
			if(index < 0) regionList.push(newRegion._id);
			else regionList.splice(index, 0, newRegion._id);

			const updated = await Region.updateOne({_id: regionID}, { regions: regionList});

			const { id, owner, name, capital, leader, parentregion, landmarks, regions, sortRule, sortDirection} = newRegion
			const newReg = new Region({
				_id: newRegion._id,
				owner: owner,
				name: name,
				capital: capital,
				leader: leader,
				parentregion: parentregion,
				landmarks: landmarks,
				regions: regions,
				sortRule: sortRule,
				sortDirection: sortDirection,
			});

			const updated2 = await newReg.save();

			if(updated) return (newRegion._id);
			else return ('Could not add region');

		},
		
		sortRegions: async(_, args) => {
			const { _id, criteria } = args;
			const regionID = new ObjectId(_id)
			const region = await Region.findOne({_id: regionID})
			let regionIDList = region.regions;
			let regionsList = [];
			for(let i = 0; i < regionIDList.length; i++){
				let tempID = new ObjectId(regionIDList[i])
				let found = await Region.findOne({_id: tempID})
				regionsList.push(found);
			}
			let newDirection = region.sortDirection === 1 ? -1 : 1; 

			let sortedRegions = [];
			switch(criteria){
				case 'name':
					sortedRegions = Sorting.byName(regionsList, newDirection);
					break;
				case 'capital':
					sortedRegions = Sorting.byCapital(regionsList, newDirection);
					break;
				case 'leader':
					sortedRegions = Sorting.byLeader(regionsList, newDirection);
					break;
				default:
					sortedRegions = regionsList;
			}

			let sortedIDs = [];
			for(let i = 0;i < sortedRegions.length;i++){
				sortedIDs.push(sortedRegions[i]._id)
			}
			const updated = await Region.updateOne({_id: regionID}, { regions: sortedIDs, sortRule: criteria, sortDirection: newDirection })
			return sortedIDs;
		},
		addLandmark: async(_,args) => {
			const { _id, landmark, index} = args;
			const regionID = new ObjectId(_id)
			const region = await Region.findOne({_id: regionID})
			let landmarks = region.landmarks
			if(index === -1){
				landmarks.push(landmark)
			}
			else{
				landmarks.splice(index, 0, landmark);
			}
			const updated = await Region.updateOne({_id: regionID}, {landmarks: landmarks})
			return landmarks;
		},
		deleteLandmark: async(_,args) => {
			const { _id, index } = args;
			const regionID = new ObjectId(_id)
			const region = await Region.findOne({_id: regionID})
			let landmarks = region.landmarks
			landmarks.splice(index, 1)
			const updated = await Region.updateOne({_id: regionID}, {landmarks: landmarks})
			return landmarks;
		},
		editLandmark: async(_, args) => {
			const { _id, landmark ,index } = args;
			const regionID = new ObjectId(_id)
			const region = await Region.findOne({_id: regionID})
			let landmarks = region.landmarks
			landmarks[index] = landmark;
			const updated = await Region.updateOne({_id: regionID}, {landmarks: landmarks})
			return landmarks;
		},
		changeParent: async(_, args) => {
			const { name, _id ,currentParent, user} = args;
			const tempParents = await Region.find({name: name})
			const potentialParents = tempParents.filter(p => p.owner === user)
			if(potentialParents.length > 1 || potentialParents.length === 0){
				if(potentialParents.length > 1){
					return "error1"
				}
				if(potentialParents.length === 0 || potentialParents.length === -1){
					return "error2"
				}
			}
			else{
				const parentID = new ObjectId(currentParent)
				const parent = await Region.findOne({_id: parentID})
				const newParent = potentialParents[0];
				const newParentID = new ObjectId(newParent._id)
				let pregions = parent.regions;
				let childIndex = pregions.findIndex((id) => id === _id);
				pregions.splice(childIndex, 1)
				const update = await Region.updateOne({_id: parentID}, {regions: pregions})

				let newpregions = newParent.regions;
				newpregions.push(_id)
				const update2 = await Region.updateOne({_id: newParentID}, {regions: newpregions})

				const childID = new ObjectId(_id)
				const child = await Region.findOne({_id: childID})
				let newID = newParent._id
				const update3 = await Region.updateOne({_id: childID}, {parentregion: newID})
				return newID

			}
		}
	// 	/** 
	// 	 	@param 	 {object} args - a todolist id and an empty item object
	// 		@returns {string} the objectID of the item or an error message
	// 	**/
	// 	addItem: async(_, args) => {
	// 		const { _id, item , index } = args;
	// 		const listId = new ObjectId(_id);
	// 		const objectId = new ObjectId();
	// 		const found = await Todolist.findOne({_id: listId});
	// 		if(!found) return ('Todolist not found');
	// 		if(item._id === '') item._id = objectId;
	// 		let listItems = found.items;
	// 		if(index < 0) listItems.push(item);
	// 		else listItems.splice(index, 0, item);
			
			
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems });

	// 		if(updated) return (item._id)
	// 		else return ('Could not add item');
	// 	},
	// 	/** 
	// 	 	@param 	 {object} args - an empty todolist object
	// 		@returns {string} the objectID of the todolist or an error message
	// 	**/
	// 	addTodolist: async (_, args) => {
	// 		const { todolist } = args;
	// 		const objectId = new ObjectId();
	// 		const { id, name, owner, items , sortRule, sortDirection} = todolist;
	// 		const newList = new Todolist({
	// 			_id: objectId,
	// 			name: name,
	// 			owner: owner,
	// 			items: items,
	// 			sortRule: sortRule,
	// 			sortDirection: sortDirection,
	// 		});
	// 		const updated = await newList.save();
	// 		if(updated) {
	// 			console.log(newList)
	// 			return newList;
	// 		}
	// 	},
	// 	/** 
	// 	 	@param 	 {object} args - a todolist objectID and item objectID
	// 		@returns {array} the updated item array on success or the initial 
	// 						 array on failure
	// 	**/
	// 	deleteItem: async (_, args) => {
	// 		const  { _id, itemId } = args;
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
	// 		listItems = listItems.filter(item => item._id.toString() !== itemId);
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
	// 		if(updated) return (listItems);
	// 		else return (found.items);

	// 	},
	// 	/** 
	// 	 	@param 	 {object} args - a todolist objectID 
	// 		@returns {boolean} true on successful delete, false on failure
	// 	**/
	// 	deleteTodolist: async (_, args) => {
	// 		const { _id } = args;
	// 		const objectId = new ObjectId(_id);
	// 		const deleted = await Todolist.deleteOne({_id: objectId});
	// 		if(deleted) return true;
	// 		else return false;
	// 	},
	// 	/** 
	// 	 	@param 	 {object} args - a todolist objectID, field, and the update value
	// 		@returns {boolean} true on successful update, false on failure
	// 	**/
	// 	updateTodolistField: async (_, args) => {
	// 		const { field, value, _id } = args;
	// 		const objectId = new ObjectId(_id);
	// 		const updated = await Todolist.updateOne({_id: objectId}, {[field]: value});
	// 		if(updated) return value;
	// 		else return "";
	// 	},
	// 	/** 
	// 		@param	 {object} args - a todolist objectID, an item objectID, field, and
	// 								 update value. Flag is used to interpret the completed 
	// 								 field,as it uses a boolean instead of a string
	// 		@returns {array} the updated item array on success, or the initial item array on failure
	// 	**/
	// 	updateItemField: async (_, args) => {
	// 		const { _id, itemId, field,  flag } = args;
	// 		let { value } = args
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
	// 		if(flag === 1) {
	// 			if(value === 'complete') { value = true; }
	// 			if(value === 'incomplete') { value = false; }
	// 		}
	// 		listItems.map(item => {
	// 			if(item._id.toString() === itemId) {	
					
	// 				item[field] = value;
	// 			}
	// 		});
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
	// 		if(updated) return (listItems);
	// 		else return (found.items);
	// 	},
	// 	/**
	// 		@param 	 {object} args - contains list id, item to swap, and swap direction
	// 		@returns {array} the reordered item array on success, or initial ordering on failure
	// 	**/
	// 	reorderItems: async (_, args) => {
	// 		const { _id, itemId, direction } = args;
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
	// 		const index = listItems.findIndex(item => item._id.toString() === itemId);
	// 		// move selected item visually down the list
	// 		if(direction === 1 && index < listItems.length - 1) {
	// 			let next = listItems[index + 1];
	// 			let current = listItems[index]
	// 			listItems[index + 1] = current;
	// 			listItems[index] = next;
	// 		}
	// 		// move selected item visually up the list
	// 		else if(direction === -1 && index > 0) {
	// 			let prev = listItems[index - 1];
	// 			let current = listItems[index]
	// 			listItems[index - 1] = current;
	// 			listItems[index] = prev;
	// 		}
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
	// 		if(updated) return (listItems);
	// 		// return old ordering if reorder was unsuccessful
	// 		listItems = found.items;
	// 		return (found.items);

	// 	},

	// 	sortItems: async (_, args) => {
	// 		const { _id, criteria } = args;
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let newDirection = found.sortDirection === 1 ? -1 : 1; 
	// 		console.log(newDirection, found.sortDirection);
	// 		let sortedItems;

	// 		switch(criteria) {
	// 			case 'task':
	// 				sortedItems = Sorting.byTask(found.items, newDirection);
	// 				break;
	// 			case 'due_date':
	// 				sortedItems = Sorting.byDueDate(found.items, newDirection);
	// 				break;
	// 			case 'status':
	// 				sortedItems = Sorting.byStatus(found.items, newDirection);
	// 				break;
	// 			case 'assigned_to':
	// 				sortedItems = Sorting.byAssignedTo(found.items, newDirection);
	// 				break;
	// 			default:
	// 				return found.items;
	// 		}
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: sortedItems, sortRule: criteria, sortDirection: newDirection })
	// 		if(updated) return (sortedItems);

	// 	}

	// }
    }
}