// const byTask = (items, direction) => {
// 	if(direction === 1) items.sort((a,b) => a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1);
// 	else items.sort((a,b) => a.description.toUpperCase() < b.description.toUpperCase() ? 1 : -1);
// 	return items;
// }

// const byDueDate = (items, direction) => {
// 	if(direction === 1) items.sort((a,b) => a.due_date > b.due_date ? 1 : -1);
// 	else items.sort((a,b) => a.due_date < b.due_date ? 1 : -1);
// 	return items;

// }

// const byStatus = (items, direction) => {
// 	if(direction === 1) items.sort((a,b) => a.completed > b.completed ? 1 : -1);
// 	else items.sort((a,b) => a.completed < b.completed ? 1 : -1);
// 	return items;
	
// }

// const byAssignedTo = (items, direction) =>{
// 	if(direction === 1) items.sort((a,b) => a.assigned_to.toUpperCase() > b.assigned_to.toUpperCase() ? 1 : -1);
// 	else items.sort((a,b) => a.assigned_to.toUpperCase() < b.assigned_to.toUpperCase() ? 1 : -1);
// 	return items
	
// }

const byName = (regions, direction) => {
	if (direction === 1) regions.sort((a,b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
	else regions.sort((a,b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : -1);
	return regions;
}

const byCapital = (regions, direction) => {
	if (direction === 1) regions.sort((a,b) => a.capital.toUpperCase() > b.capital.toUpperCase() ? 1 : -1);
	else regions.sort((a,b) => a.capital.toUpperCase() < b.capital.toUpperCase() ? 1 : -1);
	return regions;
}

const byLeader = (regions, direction) => {
	if (direction === 1) regions.sort((a,b) => a.leader.toUpperCase() > b.leader.toUpperCase() ? 1 : -1);
	else regions.sort((a,b) => a.leader.toUpperCase() < b.leader.toUpperCase() ? 1 : -1);
	return regions;
}

module.exports = {byName, byCapital, byLeader};
