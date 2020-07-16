import React, {useState} from "react";

import {Image} from "../../UI_elements";


let  PeripheralImage = props =>{

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


    return(
        <div>
            <label htmlFor="image_choice">
                {image
                    ? <Image src={image} alt='add tab image' id="addImage" fluid/>
                    : <Image src="assets/Icons/add_peripheral_img.svg" alt='add tab image' id="addImage" fluid/>
                }
            </label>
            <input id="image_choice" type="file" style={{display: "none"}} onInput={handleEditImage}/>
        </div>
    );
};

export default PeripheralImage;