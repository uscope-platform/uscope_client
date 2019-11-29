import React from 'react';

import {Card, Col, Image, ListGroup, Row} from "react-bootstrap";


let AppCreatorPeripheralsDisplay  = props => {
    return(
        <Card style={{ width: '18rem' }}>
            <ListGroup variant="flush">
                {
                    props.peripherals.map((peripheral) => (
                        <ListGroup.Item>
                            <div onClick={() => props.onClick(peripheral[props.id_field])}>
                                <Row>
                                     <Col>
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
                                     </Col>
                                    <Col md={4}>
                                        <Image name={peripheral['name']} src='assets/Icons/remove.svg' className='remove_registers_image'  onClick={(e) => {props.remove(peripheral[props.id_field]); e.stopPropagation()}}/>
                                    </Col>
                                </Row>
                            </div>
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>
        </Card>

    );


};

export default AppCreatorPeripheralsDisplay;
