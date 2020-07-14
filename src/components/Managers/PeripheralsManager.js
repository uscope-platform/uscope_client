import React, {useState} from 'react';

import {useDispatch, useSelector} from "react-redux"

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";

import BlockLayout from "../UI_elements/Layouts/BlockLayout";
import ManagerLayout, {ManagerButtonsLayout} from "../UI_elements/Layouts/ManagerLayout";


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

    const [peripherals, ] = useState(()=>{
        return  Object.values(peripherals_redux);
    });

    let handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            dispatch(setSetting(["current_peripheral", selection.selectedRows[0].peripheral_name]))
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["current_peripheral", null]))
        }
    };


    let handleRemoveRow = (event) =>{
        peripherals.splice(peripherals.findIndex(item => item.peripheral_name === settings.current_peripheral), 1);
        settings.server.creator_proxy.removePeripheral(settings.current_peripheral);
        dispatch(setSetting(["current_peripheral", null]))
    };

    let handleExport = (event) =>{
        let selected = settings.current_peripheral;
        if(settings.current_peripheral===null){
            alert("Please select a peripheral to Export");
            return;
        }
        let peripheral = {[selected]:peripherals[peripherals.findIndex(item => item.peripheral_name === selected)]};
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
                <Button onClick={handleRemoveRow}> Remove Peripheral</Button>
                <Button onClick={handleImport}>Import peripheral</Button>
                <Button onClick={handleExport}>Export peripheral</Button>
            </ManagerButtonsLayout>
            <BlockLayout centered>
                <DataTable
                    title='Peripherals'
                    data={peripherals}
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
