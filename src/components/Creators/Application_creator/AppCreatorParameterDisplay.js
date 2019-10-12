import React from 'react';

import {Card, Col, Image, ListGroup, Row} from "react-bootstrap";


let AppCreatorParameterDisplay  = props => {

    return(
        <Card style={{ width: '18rem' }}>
            <ListGroup variant="flush">
                {
                props.parameters.map((param) => (
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                {param['parameter_name']}
                            </Col>
                            <Col md={4}>
                                <Image name={param['parameter_name']} src='assets/Icons/remove.svg' className='remove_registers_image'  onClick={props.remove}/>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))
                }
            </ListGroup>
        </Card>

    );


};

export default AppCreatorParameterDisplay;
