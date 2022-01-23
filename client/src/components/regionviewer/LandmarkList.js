import React from 'react';
import LandmarkEntry from './LandmarkEntry'

const LandmarkList = (props) => {

    let landmarks = props.landmarks;
    let editableIndex = landmarks.length - 1;
    landmarks = landmarks.concat(props.childLandmarks)


    return(
        landmarks.length > 0 ? <div className=' landmark-entries container-primary'>
            {
                landmarks.map((landmark, index) => (
                    <LandmarkEntry id={props.id} landmark={landmark} index={index} maxEditIndex={editableIndex}
                    delete={props.deleteLandmark} edit={props.editLandmark}/>
                ))
            }
        </div>
        :
        <div></div>
    );
}

export default LandmarkList;