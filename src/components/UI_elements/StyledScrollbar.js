import React from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {ColorTheme} from "./ColorTheme";


export let StyledScrollbar = (props) =>{


    let renderThumb = ({style, ...props}) => {
        const thumbStyle = {
            backgroundColor: ColorTheme.dark_theme.level_1
        };
        return (
            <div
                style={{...style, ...thumbStyle}}
                {...props}/>
        );
    }

    return (
        <Scrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax={400}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            {...props}/>
    );

}

export default StyledScrollbar;