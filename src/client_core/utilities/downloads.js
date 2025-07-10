// Copyright 2021 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


export let download_json = (content, filename) =>{

    let blob = new Blob([JSON.stringify(content, null, 4)], {type: "application/json"});
    let url  = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export let download_plot = (channels, file_name) => {
    let data = channels.map((ch)=>{
        return ch.y;
    });
    let csv_content = "";

    csv_content = `${channels[0].name},${channels[1].name},${channels[2].name},${channels[3].name},${channels[4].name},${channels[5].name}\n`
    for(let i = 0; i<data[0].length; i++){

        csv_content += `${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
    }


    let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
    let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
    let filename = file_name.replace(' ', '_')+ '_'+ day+month+year+hour+minute+second;

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv_content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    link.setAttribute("id", "csv_download_link");
    document.body.appendChild(link);

    link.click();
    link.remove();
}


export let download_bitstream = (content, filename) =>{

    let link = document.createElement('a');
    link.href =  "data:image/png;base64," + content;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export let download_text = (content, filename) => {
    let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

