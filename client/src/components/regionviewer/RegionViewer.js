import React, { useState } from 'react';
import LandmarkList from './LandmarkList'
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const RegionViewer = (props) => {

    const [addingLandmark, toggleAddingLandmark] = useState(false);
    const [changingParent, toggleChangeParent]   = useState(false);

    const clickDisabled = () => { };

    const handleAddLandmark = (e) => {
        toggleAddingLandmark(false);
        const landmark = e.target.value;
        props.addLandmark(props.activeRegion._id, landmark, -1);
    }

    const handleChangeParent = (e) => {
        toggleChangeParent(false);
        const newParent = e.target.value ? e.target.value : props.parent.name;
        const prevParent = props.parent.name;
        if(newParent !== prevParent) {
            props.changeParent(newParent, prevParent, props.parent._id);
        }
    }

    const undoOptions = {
        className: props.disabled || !props.canUndo ? ' table-header-button-disabled ' : 'table-header-button',
        onClick: props.disabled || !props.canUndo  ? clickDisabled : props.undo,
        wType: "texted", 
        clickAnimation: props.disabled || !props.canUndo ? "" : "ripple-light",  
        shape: "rounded"
    }

    const redoOptions = {
        className: props.disabled || !props.canRedo ? ' table-header-button-disabled ' : 'table-header-button ',
        onClick: props.disabled || !props.canRedo   ? clickDisabled : props.redo, 
        wType: "texted", 
        clickAnimation: props.disabled || !props.canRedo ? "" : "ripple-light" ,
        shape: "rounded"
    }


    return(
        <div>
            <br></br>
            <WButton {...undoOptions}>
                            <i className="material-icons">undo</i>
                    </WButton>
            <WButton  {...redoOptions}>
                            <i className="material-icons">redo</i>
            </WButton>
            <br></br>
            <WRow>
                <WCol size="5">
                    <div style={{color:"white"}}>
                        <img src={props.findFlag(props.activeRegion.name)} alt=" "></img>
                    </div>
                    <div className="regionviewer-text-element">
                        <div className="landmark-link"style={{color:"white"}}>
                            Region Name: 
                        </div>
                        <div className="landmark-link landmark-link-text" onClick={() => props.goToSpread(props.activeRegion._id)}>
                            {props.activeRegion.name}
                        </div>
                    </div>
                    <br></br>
                    <div className="regionviewer-text-element">
                        <div className="landmark-link"style={{color:"white"}}>
                            Region Parent: 
                        </div>
                            {
                            changingParent ? 
                                <WInput  className="landmark-link" onBlur={handleChangeParent}
                                onKeyDown={(e) => {if(e.keyCode === 13) handleChangeParent(e)}}
                                autoFocus={true} placeholderText={props.parent.name} wType="outlined"
                                />
                            :
                                <div className="landmark-link landmark-link-text" onClick={() => props.goToSpread(props.parent._id)}>
                                    {props.parent.name}
                                </div>
                            }
                        <div className="material-icons landmark-parent-edit landmark-link" onClick={() => toggleChangeParent(!changingParent)}>
                            create
                        </div>
                    </div>
                    <br></br>
                    <div className="regionviewer-text-element" style={{color:"white"}}>
                        Region Capital: {props.activeRegion.capital}
                    </div>
                    <div className="regionviewer-text-element" style={{color:"white"}}>
                        Region Leader: {props.activeRegion.leader}
                    </div>
                    <div className="regionviewer-text-element" style={{color:"white"}}>
                        # of Sub Regions: {props.activeRegion.regions.length}
                    </div>
                </WCol>
                <WCol size="5">
                    <div style={{color:"white"}}>
                        Region Landmarks: 
                    </div>
                    <div className="landmark-viewer">
                        <LandmarkList id={props.activeRegion._id} landmarks={props.activeRegion.landmarks} deleteLandmark={props.deleteLandmark}
                        editLandmark={props.editLandmark} childLandmarks={props.getChildLandmarks(props.activeRegion._id)}
                        />
                    </div>
                    <div style={{backgroundColor: "gray"}}>
                        <WButton className="landmark-button">
                            <i className="material-icons landmark-button">
                                add_circle
                            </i>
                        </WButton>
                        {
                            addingLandmark ? 
                            <WInput  className="landmark-input" onBlur={handleAddLandmark}
                            onKeyDown={(e) => {if(e.keyCode === 13) handleAddLandmark(e)}}
                            autoFocus={true} placeholderText="Add Landmark" wType="outlined"
                            />
                            :
                            <div className="landmark-input" onClick={() => toggleAddingLandmark(!addingLandmark)}>
                                Add Landmark
                            </div>
                        }
                    </div>
                </WCol>
            </WRow>
            
			
		</div>
    );
}

export default RegionViewer;