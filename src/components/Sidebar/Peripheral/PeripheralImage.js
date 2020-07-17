import React, {useState} from "react";

import {Image} from "../../UI_elements";


let  PeripheralImage = props =>{

    // Local state image is needed because the component is used both with remote server images (when editing) and with
    // local client images that need to be read from file
    const [image, set_image] = useState(props.image);


    let handleEditImage = (event) =>{
        props.done(event.target.files[0]);
        // READ IMAGE FOR LOCAL DISPLAY
        let reader = new FileReader();
        reader.onload = (e) => {
            set_image(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    let render_image = () => {
        if(props.image)
            return(<Image src={props.image} id="addImage" fluid/>);
        else
            return(<Image src={image} id="addImage" fluid/>);
    }

    return(
        <div>
            <label htmlFor="image_choice">
                {image || props.image
                    ? render_image()
                    : <Image src="assets/Icons/add_peripheral_img.svg" alt='add tab image' id="addImage" fluid/>
                }
            </label>
            <input id="image_choice" type="file" style={{display: "none"}} onInput={handleEditImage}/>
        </div>
    );
};

export default PeripheralImage;