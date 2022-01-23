import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {

    const [editingLandmark, toggleEditingLandmark] = useState(false)

    const handleLandmarkEdit = (e) => {
        toggleEditingLandmark(false);
        const newLandmark = e.target.value ? e.target.value : 'Landmark';
        const prevLandmark = props.landmark;
        if(newLandmark !== prevLandmark) {
            props.edit(props.id, newLandmark, prevLandmark, props.index);
        }
    }

    return(
        <WRow>
            {
                props.index <= props.maxEditIndex ?
                <WCol size="10">
                    <WButton className="landmark-entry-button" onClick={() => props.delete(props.id, props.landmark ,props.index)}>
                        <i className="material-icons">
                            close
                        </i>
                    </WButton>
                        {
                        editingLandmark ? 
                        <WInput  className="landmark-item-input" onBlur={handleLandmarkEdit}
                        onKeyDown={(e) => {if(e.keyCode === 13) handleLandmarkEdit(e)}}
                        autoFocus={true} defaultValue={props.landmark} wType="outlined"
                        inputClass="landmark-input-class"/>
                        :
                        <div className="landmark-entry" style={{color:"white"}} onDoubleClick={() => toggleEditingLandmark(!editingLandmark)}>
                        {props.landmark}
                        </div>
                    }
                    </WCol>
                :
                <WCol size = "10">
                    <div className="landmark-entry" style={{color:"gray"}}>
                            {props.landmark}
                    </div>
                </WCol>
            }
        </WRow>
    )
}

export default LandmarkEntry;