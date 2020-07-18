import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux"

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";


let columns = [
    {
        selector: 'peripheral_name',
        name: 'Peripheral Name',
        sort: true,
        grow:2
    },
    {
        selector: 'version',
        name: 'Peripheral Version'
    }
];

let PeripheralsManager = (props)=>{

    const peripherals_redux = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    const [selected_stack, set_selected_stack] = useState([]);

    useEffect(() => {
       return() =>{
           dispatch(setSetting(["current_peripheral", null]));
       }
    },[dispatch]);

    let handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            dispatch(setSetting(["current_peripheral", selection.selectedRows[0].peripheral_name]))
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["current_peripheral", null]))
        } else if(selection.selectedCount>1){
            let selectedRows = selection.selectedRows.map((row)=>{
                return row.peripheral_name;
            });
            let a = 0;
        }
    };


    let handleRemoveRow = (event) =>{
        settings.server.creator_proxy.removePeripheral(settings.current_peripheral);
        dispatch(setSetting(["current_peripheral", null]))
    };

    let handleExport = (event) =>{
        let selected = settings.current_peripheral;
        if(settings.current_peripheral===null){
            alert("Please select a peripheral to Export");
            return;
        }

        let peripheral = {[selected]:peripherals_redux[selected]};
        let blob = new Blob([JSON.stringify(peripheral, null, 4)], {type: "application/json"});
        let url  = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        link.download = selected;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let handleImport = (event) =>{
        let input = document.createElement('input');
        input.type = 'file';
        input.setAttribute('style', 'display:none');
        input.onchange = e => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            reader.onload = readerEvent => {
                let content = readerEvent.target.result; // this is the content!
                addPeripheral(content)
            }
        };
        document.body.appendChild(input);
        input.click();
    };

    let addPeripheral = (content) => {
        settings.server.creator_proxy.createPeripheral(JSON.parse(content), null);
    };

    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}> Remove Peripheral</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleImport}>Import peripheral</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleExport}>Export peripheral</Button>
            </ManagerButtonsLayout>
            <BlockLayout centered>
                <DataTable
                    title='Peripherals'
                    data={Object.values(peripherals_redux)}
                    columns={columns}
                    customStyles={TableStyle}
                    theme="uScopeTableTheme"
                    selectableRows
                    onSelectedRowsChange={handleOnSelect}
                />
            </BlockLayout>
        </ManagerLayout>
    )
}

export default PeripheralsManager;
