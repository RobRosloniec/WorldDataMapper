import React        from 'react';
import MapEntry from './MapEntry';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const MapList = (props) => {
    let tempID = 0
    return (
        <WRow>
            <WCol size="6">
            {
                props.listIDs &&
                props.listIDs.map(entry => (
                    <MapEntry
                        handleSetActive={props.handleSetActive} activeid={props.activeid}
                        id={tempID++} key={entry._id+props.activeid} name={entry.name} _id={entry._id}
                        updateRegionField={props.updateRegionField} deleteMap={props.deleteMap}
                    />
                ))
            }
            </WCol>
            <WCol size="6">
                <img src={props.globeImage} alt=" "></img>
            </WCol>
        </WRow>
    );
};

export default MapList;