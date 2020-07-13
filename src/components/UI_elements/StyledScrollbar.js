import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import ColorTheme from "./ColorTheme";


let StyledScrollbar = (props) =>{


    let renderThumb = ({style, ...props}) => {
        const thumbStyle = {
            backgroundColor: ColorTheme.dark_theme.level_3
        };
        return (
            <div
                style={{...style, ...thumbStyle}}
                {...props}/>
        );
    }

    return (
        <Scrollbars
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            {...props}/>
    );

}

export default StyledScrollbar;