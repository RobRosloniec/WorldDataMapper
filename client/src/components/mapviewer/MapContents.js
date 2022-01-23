import React            from 'react';
import MapHeader        from './MapHeader';
import MapList          from './MapList';

const MapContents = (props) => {
    return (
        <>
            <MapHeader 
                auth={props.auth} createNewMap={props.createNewMap} activeid={props.activeid}
            />
            <MapList
                activeid={props.activeid} handleSetActive={props.handleSetActive}
                listIDs={props.listIDs} createNewList={props.createNewList}
                updateRegionField={props.updateRegionField}
                deleteMap={props.deleteMap} globeImage={props.globeImage}
            />
        </>
    );
};

export default MapContents;