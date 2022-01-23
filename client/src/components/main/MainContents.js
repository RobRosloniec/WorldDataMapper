import React            from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    return (
        <div className='table ' >
            <TableHeader
                disabled={!props.activeRegion._id}        addRegion={props.addRegion}
                undo={props.undo} redo={props.redo}     canUndo={props.canUndo} 
                canRedo={props.canRedo}                 setShowDelete={props.setShowDelete}
                setActiveRegion={props.setActiveRegion}     sort={props.sort}
                changeRoute={props.changeRoute} activeRegion={props.activeRegion}
            />
            <TableContents
                key={props.activeRegion._id}      activeRegion={props.activeRegion}
                deleteItem={props.deleteItem}   reorderItem={props.reorderItem}
                editItem={props.editItem} regions={props.regions}
                setActiveRegion={props.setActiveRegion} changeRoute={props.routeViewer}
                findFlag={props.findFlag}
            />
        </div>
    );
};

export default MainContents;