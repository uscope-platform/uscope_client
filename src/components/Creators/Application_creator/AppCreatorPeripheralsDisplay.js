import React from 'react';

import {Trash} from "grommet-icons";
import styled from "styled-components";

const ComponentStyle = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  grid-row-gap: 1em;
  width: 18rem;
  border-radius: 0.3rem;
  justify-content: space-between;
  background-color: #3c3b3b;
  padding: 0 0.5rem;
`

const ListStyle = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-gap: 0.2rem;
`

let AppCreatorPeripheralsDisplay  = props => {
    return(
            <ListStyle>
            {
                props.peripherals.map((peripheral) => (
                    <div onClick={() => props.onClick(peripheral[props.id_field])}>
                        <ComponentStyle>
                            {(() => {
                                if(props.id_field==='name'){
                                    if ('name' in peripheral && peripheral['name'] !== ""){
                                        return peripheral['name'];
                                    } else{
                                        return peripheral['address'];
                                    }
                                }else{
                                    return peripheral[props.id_field];
                                }

                            })()}
                            <Trash color='white' onClick={(e) => {props.remove(peripheral[props.id_field]); e.stopPropagation()}}/>
                        </ComponentStyle>
                    </div>
                ))
            }
            </ListStyle>
    );
};

export default AppCreatorPeripheralsDisplay;
