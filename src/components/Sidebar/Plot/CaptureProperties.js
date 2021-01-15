import React, {useState} from "react";
import {
    Button, FormLayout,
    InputField,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";

let CaptureProperties = props =>{
    const settings = useSelector(state => state.settings);
    const channels = useSelector(state => state.plot);
    const [n_buffers, set_n_buffers] = useState("");

    let handle_change = (event) =>{
        set_n_buffers(event.target.value);
    };

    let handle_close = (event) =>{
        let data = channels.data.map((ch)=>{
            return ch.y;
        });
        let csv_content = `time,${channels.data[0].name},${channels.data[1].name},${channels.data[2].name},${channels.data[3].name},${channels.data[4].name},${channels.data[5].name}\n`
        for(let i = 0; i<data[0].length; i++){

            csv_content += `${channels.data[0].x[i]/settings.sampling_period},${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
        }

        let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
        let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
        let filename = settings.default_ch_group.group_name.replace(' ', '_')+ '_'+ day+month+year+hour+minute+second;

        var encodedUri = encodeURI('data:text/csv;charset=utf-8,'+ csv_content);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        link.setAttribute("id", "csv_download_link");
        document.body.appendChild(link);

        link.click();
        link.remove();

    };

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Capture Settings"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <InputField inline name='n_buffers' onChange={handle_change} label="Number of buffers"/>
                <Button onClick={handle_close}>Submit changes</Button>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default CaptureProperties;