import Logo 							from '../navbar/Logo';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import Update 							from '../modals/Update';
import MainContents 					from '../main/MainContents';
import RegionViewer                     from '../regionviewer/RegionViewer';
import CreateAccount 					from '../modals/CreateAccount';
import NavbarOptions 					from '../navbar/NavbarOptions';
import * as mutations 					from '../../cache/mutations';
import MapContents 					    from '../mapviewer/MapContents';
import { GET_DB_TODOS } 				from '../../cache/queries';
import { GET_DB_REGIONS }                  from '../../cache/queries';
import React, { useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	SortItems_Transaction,
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction, 
	EditRegion_Transaction,
	UpdateRegions_Transaction,
	SortRegions_Transaciton,
	UpdateLandmarkList_Transaction,
	EditLandmark_Transaction,
	ChangeParent_Transaction} 				from '../../utils/jsTPS';

const Homescreen = (props) => {

	const keyCombination = (e, callback) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

	const auth = props.user === null ? false : true;
	let todolists 	= [];
	let SidebarData = [];
	let maps = [];
	let regions = [];
	const [regionSiblings, setRegionSiblings] 			= useState([])
	const [currentRegionIndex, setCurrentRegionIndex] 	= useState(0);
	const globeImage 									= require('../images/globe.png')
	const [sortRule, setSortRule] 						= useState('unsorted'); // 1 is ascending, -1 desc
	const [activeList, setActiveList] 					= useState({});
	const [activeRegion, setActiveRegion]   			= useState({});
	const [viewerRegion, setViewRegion]     			= useState({});
	const [showDelete, toggleShowDelete] 				= useState(false);
	const [showLogin, toggleShowLogin] 					= useState(false);
	const [showCreate, toggleShowCreate] 				= useState(false);
	const [showUpdate, toggleShowUpdate]    			= useState(false);
	const [showDeleteRegion, toggleDeleteRegion]		= useState(false);
	const [routeState, toggleRoute]         			= useState(0);
	const [regionToDelete, setDelete]       			= useState("");
	const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());

	const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
		if(loading) {console.log(loading, 'loading');}
		if(error) {console.log(error, 'error')}
		if(data) {
			for(let region of data.getAllRegions) {
				regions.push(region)
				if(region.parentregion === "None"){
					maps.push(region)
				}
			}

		}

	// NOTE: might not need to be async
	const reloadList = async () => {
		if (activeList._id) {
			let tempID = activeList._id;
			let list = todolists.find(list => list._id === tempID);
			setActiveList(list);
		}
	}

	const reloadRegion = async () => {
		if (typeof activeRegion !== 'undefined' && activeRegion._id) {
			let tempID = activeRegion._id;
			console.log(tempID);
			let list = regions.find(list => (typeof list !=='undefined') && list._id === tempID);
			setActiveRegion(list);
		}
	}

	const loadTodoList = (list) => {
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setActiveList(list);

	}

	const loadMap = () => {
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
	}

	const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		onCompleted: () => reloadRegion()
	}

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS, mutationOptions);
	const [sortTodoItems] 		= useMutation(mutations.SORT_ITEMS, mutationOptions);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD, mutationOptions);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD, mutationOptions);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM, mutationOptions);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM, mutationOptions);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);

	const [AddMap]                  = useMutation(mutations.ADD_MAP, mutationOptions);
	const [UpdateRegionField]       = useMutation(mutations.UPDATE_REGION_FIELD, mutationOptions);
	const [DeleteRegion]            = useMutation(mutations.DELETE_REGION, mutationOptions);
	const [AddRegion]               = useMutation(mutations.ADD_REGION, mutationOptions);
	const [SortRegions]             = useMutation(mutations.SORT_REGIONS, mutationOptions);
	const [AddLandmark]             = useMutation(mutations.ADD_LANDMARK, mutationOptions);
	const [DeleteLandmark]          = useMutation(mutations.DELETE_LANDMARK, mutationOptions);
	const [EditLandmark]            = useMutation(mutations.EDIT_LANDMARK, mutationOptions);
	const [ChangeParent]          = useMutation(mutations.CHANGE_PARENT, mutationOptions);


	
	const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const updateTPS = () => {
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
	}

	const addRegion = async (_id) => {
		const newRegion = {
			_id: '',
			owner: props.user._id,
			name: 'Untitled',
			capital: 'None',
			leader: 'None',
			parentregion: activeRegion._id,
			landmarks: [],
			regions: [],
			sortRule: 'name',
			sortDirection: 1
		}
		let listID = _id;
		let index = -1;
		let opcode = 1;
		let transaction = new UpdateRegions_Transaction(listID, newRegion, AddRegion, DeleteRegion, index, opcode);
		props.tps.addTransaction(transaction);
		tpsRedo();
		// console.log(newRegion);
		// console.log(listID);
		// console.log(index);
		//const { data } = await AddRegion({ variables: { region: newRegion, _id: listID, index: index}, refetchQueries: [{ query: GET_DB_REGIONS }] });
	}

	const deleteRegion = async (region, index) => {
		let c = window.confirm("Would you like to delete this Region?\n(Deleting this region will make its children unaccessable)")
		if(c === true){
			let regionID = region._id;
			let opcode = 0;
			let tempRegion = {
				_id: 			region._id,
				owner: 			region.owner,
				name: 			region.name,
				capital: 		region.capital,
				leader: 		region.leader,
				parentregion: 	region.parentregion,
				landmarks: 		region.landmarks,
				regions: 		region.regions,
				sortRule: 		region.sortRule,
				sortDirection: 	region.sortDirection
			}
			console.log(tempRegion);
			let transaction = new UpdateRegions_Transaction(regionID, tempRegion, AddRegion, DeleteRegion, index, opcode);
			props.tps.addTransaction(transaction);
			tpsRedo();
			
		}
		else{
			return;
		}
	}

	// const deleteRegionWrapper = (region, index) => {
	// 	setSubDelete(region)
	// 	setSubIndex(index)
	// 	setShowDeleteRegion()
	// }

	const deleteMap = async (_id) =>{
		const x = await DeleteRegion({ variables: { _id: _id} , refetchQueries: [{ query: GET_DB_REGIONS }] });
		console.log(regions);
		setDelete("")
	}

	const deleteMapWrapper = (_id) => {
		setDelete(_id)
		setShowDelete()
	}

	const editRegion = async (regionID, field, value, prev) => {
		let transaction = new EditRegion_Transaction(regionID, field, value, prev, UpdateRegionField)
		props.tps.addTransaction(transaction);
		tpsRedo();
		//const { data } = await UpdateRegionField({ variables : {_id: regionID , field: field, value: value}})
	}

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewMap = async () => {
		const mapName = window.prompt("Enter the new maps name:", "Untitled")
		
		if(mapName !== null){
			let map = {
				_id: '',
				owner: props.user._id,
				name: mapName,
				capital: 'None',
				leader: 'None',
				parentregion: 'None',
				landmarks: [],
				regions: [],
				sortRule: 'name',
				sortDirection: 1
			}
			console.log(map)
			const { data } = await AddMap({ variables: { region: map }, refetchQueries: [{ query: GET_DB_REGIONS }] });
			console.log(maps)
			console.log(regions)
			refetch();
		}
		else{
			return;
		}
	}

	const updateMapField = async(_id, field, value, prev) => {
		const {data} = await UpdateRegionField({ variables: {_id: _id, field: field, value: value}, refetchQueries: [{ query: GET_DB_REGIONS }] });
	}

	const addLandmark = async(_id, landmark, index) => {
		//const data = await AddLandmark({variables: {_id: _id, landmark: landmark, index: index}});
		let opcode = 1;
		let transaction = new UpdateLandmarkList_Transaction(_id, landmark, AddLandmark, DeleteLandmark, index, opcode)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const deleteLandmark = async(_id, landmark ,index) => {
		//const data = await DeleteLandmark({variables: {_id: _id, index: index}})
		let opcode = 0;
		let transaction = new UpdateLandmarkList_Transaction(_id, landmark, AddLandmark, DeleteLandmark, index, opcode)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const editLandmark = async(_id, newLandmark, prevLandmark, index) => {
		let transaction = new EditLandmark_Transaction(_id, newLandmark, prevLandmark, index, EditLandmark)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const changeParent = async(name, prevname, currentParent) => {
		let transaction = new ChangeParent_Transaction(name, prevname, activeRegion._id, currentParent, ChangeParent, props.user._id)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const getChildLandmarks = (_id) => {
		let children = []
		let r = regions.find(reg => reg._id === _id)
		let s = r.regions
		for(let i = 0; i < s.length; i++){
			let x = getChildren(s[i], [])
			children = children.concat(x)
		}
		
		let childLandmarks = []
		for(let i = 0;i < children.length;i++){
			let child = regions.find(r => r._id === children[i])
			let l = child.landmarks
			for(let j = 0; j < l.length; j++){
				childLandmarks.push(l[j] + " - " + child.name)
			}
		}

		return childLandmarks;
	}

	const getChildren = (_id, children) => {
		let c = children
		let r = regions.find(r => r._id === _id)
		let s = r.regions
		c.push(_id)
		if(s.length === 0){
			return c
		}
		else{
			for(let i = 0; i < s.length; i++){
				getChildren(s[i], c)
			}
		}
		return c
	}

	const handleSetActive = (_id) => {
		console.log(_id)
		toggleRoute(1);
		const region = regions.find(reg => reg._id === _id)
		loadRegion(region)
		setRegionSiblings(region.regions)
		props.tps.clearAllTransactions();
		updateTPS();
	}

	const loadRegion = (region) => {
		setActiveRegion(region);
	}

	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleDeleteRegion(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleDeleteRegion(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleDeleteRegion(false);
		toggleShowDelete(!showDelete);
	};

	const setShowUpdate = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(false);
		toggleDeleteRegion(false);
		toggleShowUpdate(!showUpdate);
	}

	const setShowDeleteRegion = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(false);
		toggleShowUpdate(false);
		toggleDeleteRegion(!showDeleteRegion)
	}
	
	const sort = async(criteria) => {
		//const x = await SortRegions({variables: {_id: activeRegion._id, criteria: criteria}});
		let prevSortRule = sortRule;
		console.log(prevSortRule)
		setSortRule(criteria);
		let transaction = new SortRegions_Transaciton(activeRegion._id, criteria, prevSortRule, SortRegions);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const setShowViewer = (_id) => {
		const region = regions.find(reg => reg._id === _id)
		setActiveRegion(region)
		setCurrentRegionIndex(regionSiblings.findIndex((r) => r === _id))
		props.tps.clearAllTransactions();
		updateTPS();
		//handleSetActive(_id)
		toggleRoute(2)
	}

	const noclick = () => { };
	const nextSibling = () => {
		setShowViewer(regionSiblings[currentRegionIndex + 1])
	}
	const prevSibling = () => {
		setShowViewer(regionSiblings[currentRegionIndex - 1])
	}

	const forwardOptions = {
		className: currentRegionIndex === (regionSiblings.length - 1) ? ' table-header-button-disabled material-icons' : 'table-header-button material-icons',
		onClick: currentRegionIndex === (regionSiblings.length - 1) ? noclick : nextSibling
	}

	const backOptions = {
		className: currentRegionIndex === 0 ? ' table-header-button-disabled material-icons' : 'table-header-button material-icons',
		onClick: currentRegionIndex === 0 ? noclick: prevSibling
	}

	const findImage = (name) => {
		let img = ''
		try{
			img = require('../images/' + name + ' Flag.png')
		}
		catch(error){
			img = "nan"
		}
		return img
	}

	let name = "";
	if(auth){
		const user = props.user
		name = user.firstName + " " + user.lastName;
	}

	return (
		<WLayout wLayout="header-lside-rside-footer">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						{
							auth && routeState === 1 && activeRegion.parentregion !== 'None'?
							<i className="material-icons table-entry-buttons" onClick={() => handleSetActive(activeRegion.parentregion)}>arrow_back</i>
							:
							auth && routeState === 2 ?
							<>
							<i {...backOptions}>arrow_back</i>
							<i {...forwardOptions}>arrow_forward</i>
							</>
							:
							<></>
						}
						{
							auth && routeState === 1 ?
							<div>{activeRegion.name}</div>
							:
							<div></div>
						}
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							reloadTodos={refetch} 			setActiveList={loadTodoList}
							setShowUpdate={setShowUpdate}
							user={name}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLMain>
				
					{
						auth && routeState === 0 ? 
						
							<MapContents
								listIDs={maps} 				activeid={activeList._id} auth={auth}
								handleSetActive={handleSetActive} 	createNewMap={createNewMap}
								updateRegionField={updateMapField} 	key={activeList._id}
								deleteMap={deleteMapWrapper} globeImage={globeImage}
							/>
							
						:
						auth && routeState === 1 ?
						
						<MainContents
							addRegion={addRegion} 			deleteItem={deleteRegion}
							editItem={editRegion} 			reorderItem={reorderItem}
							setShowDelete={setShowDelete} 	undo={tpsUndo} redo={tpsRedo}
							activeRegion={activeRegion} 	setActiveRegion={handleSetActive}
							canUndo={canUndo} 				canRedo={canRedo}
							sort={sort}                     changeRoute={toggleRoute}
							regions={regions}               routeViewer={setShowViewer}
							findFlag={findImage}
						/>
						
						:
						auth && routeState === 2 ?
						<RegionViewer changeRoute={toggleRoute} activeRegion={activeRegion} 
						parent={regions.find(reg => reg._id === activeRegion.parentregion)} addLandmark={addLandmark}
						deleteLandmark={deleteLandmark} undo={tpsUndo} redo={tpsRedo} canUndo={canUndo} canRedo={canRedo}
						disabled={!activeRegion._id} editLandmark={editLandmark} goToSpread={handleSetActive} changeParent={changeParent}
						findFlag={findImage} getChildLandmarks={getChildLandmarks}/>
						:
						<>
						<img src={globeImage} alt="globe"></img>
						<div className="logo" style={{color:"white"}}>
                			The World Data Mapper!
            			</div>
						</>
					}
				
			</WLMain>
			{/* <WLMain>
				{
					activeList ? 
					
							<div className="container-secondary">
								<MainContents
									addItem={addItem} 				deleteItem={deleteItem}
									editItem={editItem} 			reorderItem={reorderItem}
									setShowDelete={setShowDelete} 	undo={tpsUndo} redo={tpsRedo}
									activeList={activeList} 		setActiveList={loadTodoList}
									canUndo={canUndo} 				canRedo={canRedo}
									sort={sort}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain> */}

			{
				showDelete && (<Delete deleteList={deleteMap} activeid={regionToDelete} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} reloadTodos={refetch}setShowLogin={setShowLogin} toggleRoute={toggleRoute}/>)
			}

			{
				showUpdate && (<Update fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>)
			}

		</WLayout>
	);
};

export default Homescreen;