import React , { useState }      from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {

    const [activeIndex, setActiveIndex] = useState(-1)
    const [nameActive, toggleNameActive] = useState(false)
    const [capitalActive, toggleCapitalActive] = useState(false)
    const [leaderActive, toggleLeaderActive] = useState(false)


    let entries = props.activeRegion ? props.activeRegion.regions : null;
    let entryCount = 0;
    if(entries) {
        entries = entries.filter(entry => entry !== null);
        entryCount = entries.length
    } 
    let entryRegions = [];
    for(let i = 0;i < entries.length;i++){
        let e = props.regions.find(reg => reg._id === entries[i])
        if(e !== undefined){
            entryRegions.push(e)
        }
    }

    const setActiveIndexWrapper = (index) => {
        if(index >= entryRegions.length){
            setActiveIndex(-1)
        }
        else{
            setActiveIndex(index)
        }
    }
    
    return (
        entries !== undefined && entries.length > 0 ? <div className=' table-entries container-primary'>
            {
                entryRegions.map((entry, index) => (
                    <TableEntry
                        data={entry} key={entry._id} index={index} entryCount={entryCount}
                        deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                        editItem={props.editItem} setActiveRegion={props.setActiveRegion}
                        changeRoute={props.changeRoute} 
                        activeIndex={activeIndex} setActiveIndex={setActiveIndexWrapper}
                        nameActive={nameActive} toggleNameActive={toggleNameActive}
                        capitalActive={capitalActive} toggleCapitalActive={toggleCapitalActive}
                        leaderActive={leaderActive} toggleLeaderActive={toggleLeaderActive}
                        findFlag={props.findFlag}
                    />
                ))
            }

            </div>
            : <div className='container-primary' >
                {
                    props.activeRegion._id ? <h2 className="nothing-msg"></h2> : <></> 
                }               
                
            </div>
    );
};

export default TableContents;