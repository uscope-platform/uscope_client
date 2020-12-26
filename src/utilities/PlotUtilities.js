let plot_palette = [
    "rgb(161, 201,244)",
    "rgb(141, 229,161)",
    "rgb(255, 159,155)",
    "rgb(208, 187,255)",
    "rgb(255, 254,163)",
    "rgb(185, 242,240)",
]

export let create_plot_channel = (ch) =>{
    return({
        x: Array.from(Array(1024).keys()),
        y:  Array(1024).fill(0),
        type: 'scatter',
        mode: 'lines',
        name: ch.name,
        visible: ch.enabled,
        spec:ch
    })
}

export let get_channels_from_group = (group, channels) => {
    let channels_list = []
    for(let ch of group.channels) {
        let selected_ch = channels.filter((item) => {
            return item.id === ch.value;
        })
        channels_list.push(selected_ch[0])
    }
    return channels_list;
 }

export let get_channel_number_from_id = (id, channels) => {
    for(let item of channels){
        if(item.spec.id === id) return item.spec.number
    }
}


export let get_channel_mux_from_id = (id, channels) => {
    for(let item of channels){
        if(item.spec.id === id) return item.spec.mux_setting;
    }
}