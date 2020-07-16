import React from 'react';


import {
    SidebarContentLayout
} from "../../UI_elements";

import EnablesProperties from "./EnablesProperties";
import CaptureProperties from "./CaptureProperties";
import {useSelector} from "react-redux";

let  PlotSidebar = props =>{

    const settings = useSelector(state => state.settings);

    let on_capture_start = (capture_length) => {
        settings.server.plot_proxy.setCapture(capture_length);
        setTimeout(on_capture_end, 500);
    };


    let on_capture_end = () => {
        settings.server.plot_proxy.get_captured_data().then((res) => {
            if(res['elapsed'] !== 0){
                setTimeout(on_capture_end, 1000);
            } else {
                let hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(res['data']);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'data.csv';
                hiddenElement.click();
            }
        });
    };

    return (
        <SidebarContentLayout peripheral>
            <EnablesProperties/>
            <CaptureProperties done={on_capture_start} />
        </SidebarContentLayout>
    );

};

export default PlotSidebar;
