import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {
    const clickDisabled = () => { };
    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    
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

    return (
        <WRow className="table-header">
            <WCol size="2">
                <WButton onClick={props.disabled ? () => {} : () => props.sort('name') } className='table-header-section' wType="texted" >Name</WButton>
                {/* <WButton  className='table-header-section' wType="texted" >Name</WButton> */}
            </WCol>

            <WCol size="2">
                <WButton onClick={props.disabled ? () => {} : () => props.sort('capital') } className='table-header-section' wType="texted">Capital</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={props.disabled ? () => {} : () => props.sort('leader') } className='table-header-section' wType="texted" >Leader</WButton>
            </WCol>
            <WCol size="2">
                <WButton className='table-header-section' wType="texted" >Flag</WButton>
            </WCol>
            <WCol size="2">
                <WButton className='table-header-section' wType="texted" >Landmarks</WButton>
            </WCol>

            <WCol size="2">
                <div className="table-header-buttons">
                    <WButton {...undoOptions}>
                            <i className="material-icons">undo</i>
                    </WButton>
                    <WButton  {...redoOptions}>
                            <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.addRegion(props.activeRegion._id)} wType="texted" className={`${buttonStyle}`} clickAnimation={props.disabled ? "" : "ripple-light" }>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={() => props.changeRoute(0)} wType="texted" className={`${buttonStyle}`} clickAnimation={props.disabled ? "" : "ripple-light" }>
                        <i className="material-icons">home</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;