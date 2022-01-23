import React, { useState, useEffect } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {
    const { data } = props;

    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks;

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    
    const disabledButton = () => {}

    useEffect(() => {
        if(editingName === false && editingCapital === false && editingLeader === false){
            if(props.activeIndex === props.index){
                if(props.nameActive){
                    toggleNameEdit(!editingName)
                    props.toggleNameActive(true)
                    props.toggleCapitalActive(false)
                    props.toggleLeaderActive(false)
                }
                if(props.capitalActive){
                    toggleCapitalEdit(!editingCapital)
                    props.toggleNameActive(false)
                    props.toggleCapitalActive(true)
                    props.toggleLeaderActive(false)
                }
                if(props.leaderActive){
                    toggleLeaderEdit(!editingLeader)
                    props.toggleNameActive(false)
                    props.toggleCapitalActive(false)
                    props.toggleLeaderActive(true)
                }
            }
        }
    })

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'No Name';
        const prevName = name;
        if(newName !== prevName) {
            props.editItem(data._id, 'name', newName, prevName);
        }
        props.setActiveIndex(-1)
    }

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCap = e.target.value ? e.target.value : 'No Capital';
        const prevCap = capital;
        if(newCap !== prevCap) {
            props.editItem(data._id, 'capital', newCap, prevCap);
        }
        props.setActiveIndex(-1)
    }

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'No Leader';
        const prevLeader = leader;
        if(newLeader !== prevLeader) {
            props.editItem(data._id, 'leader', newLeader, prevLeader);
        }
        props.setActiveIndex(-1)
    }

    const handleNameArrowKeys = (e, code) => {
        handleNameEdit(e);
        if(code === 39){
            toggleCapitalEdit(!editingCapital)
            props.toggleNameActive(false)
            props.toggleCapitalActive(true)
            props.toggleLeaderActive(false)
        }
        if(code === 38){
            toggleNameEdit(false)
            props.setActiveIndex(props.index - 1)
        }
        if(code === 40){
            toggleNameEdit(false)
            props.setActiveIndex(props.index + 1)
        }
    }

    const handleCapitalArrowKeys = (e, code) => {
        handleCapitalEdit(e);
        if(code === 37){
            toggleNameEdit(!editingName)
            props.toggleNameActive(true)
            props.toggleCapitalActive(false)
            props.toggleLeaderActive(false)
        }
        if (code === 39){
            toggleLeaderEdit(!editingLeader)
            props.toggleNameActive(false)
            props.toggleCapitalActive(false)
            props.toggleLeaderActive(true)
        }
        if(code === 38){
            toggleCapitalEdit(false)
            props.setActiveIndex(props.index - 1)
        }
        if(code === 40){
            toggleCapitalEdit(false)
            props.setActiveIndex(props.index + 1)
        }
    }

    const handleLeaderArrowKeys = (e, code) => {
        handleLeaderEdit(e)
        if(code === 37){
            toggleCapitalEdit(!editingCapital)
            props.toggleNameActive(false)
            props.toggleCapitalActive(true)
            props.toggleLeaderActive(false)
        }
        if(code === 38){
            toggleLeaderEdit(false)
            props.setActiveIndex(props.index - 1)
        }
        if(code === 40){
            toggleLeaderEdit(false)
            props.setActiveIndex(props.index + 1)
        }
    }

    const activateName = () => {
        toggleNameEdit(!editingName)
        props.toggleNameActive(true)
        props.toggleCapitalActive(false)
        props.toggleLeaderActive(false)
    }

    const activateCapital = () => {
        toggleCapitalEdit(!editingCapital)
        props.toggleNameActive(false)
        props.toggleCapitalActive(true)
        props.toggleLeaderActive(false)
    }

    const activateLeader = () => {
        toggleLeaderEdit(!editingLeader)
        props.toggleNameActive(false)
        props.toggleCapitalActive(false)
        props.toggleLeaderActive(true)
    }

    return (
        <WRow className='table-entry'>
            <WCol size="2">
                {
                    editingName || name === ''
                        ? <WInput
                            className='table-input' 
                            onBlur={handleNameEdit}
                            onKeyDown={(e) => {if(e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) handleNameArrowKeys(e, e.keyCode)}}
                            autoFocus={true} defaultValue={name} type='text'
                            inputClass="table-input-class"
                        />
                        : <> 
                        <div className="table-name"
                            onClick={() => props.setActiveRegion(props.data._id)}
                        >{name}   
                        </div>
                        <div>
                            <i className="material-icons edit-icon" onClick={() => activateName()}>create</i>
                        </div>
                        </>
                }

                
            </WCol>

            <WCol size="2">
                {
                    editingCapital || capital === ''
                        ? <WInput
                            className='table-input' 
                            onBlur={handleCapitalEdit}
                            onKeyDown={(e) => {if(e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) handleCapitalArrowKeys(e, e.keyCode)}}
                            autoFocus={true} defaultValue={capital} type='text'
                            inputClass="table-input-class"
                        />
                        : <div className="table-text"
                          onClick={() => activateCapital()}   
                        >{capital}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader || leader === ''
                        ? <WInput
                            className='table-input' 
                            onBlur={handleLeaderEdit}
                            onKeyDown={(e) => {if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) handleLeaderArrowKeys(e, e.keyCode)}}
                            autoFocus={true} defaultValue={leader} type='text'
                            inputClass="table-input-class"
                        />
                        : <div className="table-text"
                        onClick={() => activateLeader()} 
                        >{leader}
                        </div>
                }
            </WCol>

            <WCol size="2">
                
                <div>
                    <img src={props.findFlag(name)} alt=" " className="flag"></img>
                </div>
                
            </WCol>
            <WCol size="2">
            
                <div className={'table-text'} style={{color: "lightblue"}} onClick={() => props.changeRoute(props.data._id)}>
                    {landmarks.toString()}
                </div>
                
            </WCol>
            <WCol size="2">
                <div className='button-group'>
                    <WButton className="table-entry-buttons" wType="texted" onClick={() => props.changeRoute(props.data._id)}>
                        <i className="material-icons">zoom_in</i>
                    </WButton>
                    <WButton className="table-entry-buttons" wType="texted" onClick={() => props.deleteItem(data, props.index)}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>
        </WRow>
    );
};

export default TableEntry;