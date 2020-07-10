import React, {useState} from 'react';


import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector} from "react-redux"

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

    const [selected, set_selected] = useState(null);
    const [peripherals, set_peripherals] = useState(()=>{
        return  Object.values(peripherals_redux);
    });

    let handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            set_selected(selection.selectedRows[0].peripheral_name);
            dispatch(setSetting(["current_peripheral", selection.selectedRows[0].peripheral_name]))
        } else if(selection.selectedCount===0) {
            set_selected(null);
        }
    };


    let handleRemoveRow = (event) =>{
        peripherals.splice(peripherals.findIndex(item => item.peripheral_name === selected), 1);
        settings.server.creator_proxy.removePeripheral(selected);
        this.setState({selected:null});
    };

    let handleExport = (event) =>{
        if(selected===null){
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

    let handle_create = () =>{
        dispatch(setSetting(["edit_peripheral_mode", false]))
        dispatch(setSetting(["edit_peripheral_name", null]))
    };

    let handleEdit = () => {
        dispatch(setSetting(["edit_peripheral_mode", true]))
        dispatch(setSetting(["edit_peripheral_name", selected]))
    };

    let is_editable = () =>{
        return selected !== null;
    };

    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <LinkContainer to="/peripheral_creator">
                    <Button onClick={handle_create}> Create Peripheral</Button>
                </LinkContainer>
                <Button onClick={handleRemoveRow}> Remove Peripheral</Button>
                <Button onClick={handleImport}>Import peripheral</Button>
                <Button onClick={handleExport}>Export peripheral</Button>
                <LinkContainer isActive={is_editable} to="/peripheral_creator">
                    <Button onClick={handleEdit} >Edit peripheral</Button>
                </LinkContainer>
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
