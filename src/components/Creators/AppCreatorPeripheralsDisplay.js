import React from 'react';

import {Card, Col, Image, ListGroup, Row} from "react-bootstrap";


let AppCreatorPeripheralsDisplay  = props => {

    return(
        <Card style={{ width: '18rem' }}>
            <ListGroup variant="flush">
                {
                props.peripherals.map((peripheral) => (
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                {peripheral['name']}
                            </Col>
                            <Col md={4}>
                                <Image name={peripheral['name']} src='assets/Icons/remove.svg' className='remove_registers_image'  onClick={props.remove}/>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))
                }
            </ListGroup>
        </Card>

    );


};

export default AppCreatorPeripheralsDisplay;
