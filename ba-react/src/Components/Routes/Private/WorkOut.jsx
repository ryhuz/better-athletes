import React, {useState} from 'react'
import { Fragment } from 'react'
import { Navbar, Col, Row, Form, Nav, Container, Button } from "react-bootstrap";


function WorkOut({name}) {
    const [inputForm, setinputForm] = useState([
        {   
            exercise: "",
            reps: "",
            rest: "",
            target: ""
        }
    ])

    function AddInput(){
        setinputForm([...inputForm, 
            {   
                set: "",
                exercise: "",
                reps: "",
                rest: "",
                target: ""
            }
        ])
    }

    function RemoveInput(i){
        let list = [...inputForm];
        list.splice(i,1);
        setinputForm(list)
    }

    function ChangeHandler(e, i){
        let {name, value} = e.target;
        let list = [...inputForm];
        list[i]["set"] = i +1;
        list[i][name] = value;
        setinputForm(list)
    }

    console.log(inputForm)

    return (
        <Fragment>
            <Row className="border">
                <Col md={12} className="border pt-3">
                    <h4>SETS</h4>
                </Col>
                <Col md={12} className="border my-3 py-3">
                    <Form className="my-3 py-3 border">
                        <Col className="border p-0">
                            <h4>SET 1</h4>
                        </Col>
                        <Row>
                        <Col md={4} >
                        <Form.Label>Exercises</Form.Label>
                        </Col>
                        <Col md={2} >
                        <Form.Label>Reps</Form.Label>
                        </Col>
                        <Col md={2} >
                        <Form.Label>Rest</Form.Label>
                        </Col>
                        <Col md={2} >
                        <Form.Label>Target</Form.Label>
                        </Col>
                        <Col md={2} ></Col>
                        </Row>


                       {inputForm.map((item, index)=>(

                           <Row className="my-2">
                             <Col md={4} >
                                <Form.Control
                                name="exercise"
                                onChange={(e) => ChangeHandler(e,index)}
                                placeholder="Workout" />
                             </Col>
                             <Col md={2} >
                                <Form.Control                                 
                                name="reps"
                                onChange={(e) => ChangeHandler(e,index)}
                                placeholder="Reps" />
                             </Col>
                             <Col md={2}>
                                <Form.Control 
                                name="rest"
                                onChange={(e) => ChangeHandler(e,index)}
                                placeholder="Rest" />
                             </Col>
                             <Col md={2}>
                                <Form.Control 
                                name="target"
                                onChange={(e) => ChangeHandler(e,index)}
                                placeholder="Target" />
                             </Col> 
                             <Col md={2}>
                                <Row>
                                    <Col>{inputForm.length !== 1 && 
                                        <Button className="mr10" 
                                        onClick={()=>RemoveInput(index)}
                                        variant= "outline-danger"> - </Button>}
                                    </Col>
                                    <Col>
                                    {inputForm.length - 1 === index && 
                                        <Button 
                                        onClick={AddInput}
                                        variant="outline-secondary"> + </Button>}
                                    </Col>
                                </Row>                            
                             </Col>
                        </Row> 
                       ))}
  
                    </Form>
                    <Row>
                           <Col>
                                <Button>Add Exercise</Button>
                           </Col>
                           <Col>
                                <Button>Repeat Set</Button>
                           </Col>
                    </Row>
                </Col>

                
            </Row>
        </Fragment>
    )
}

export default WorkOut


{/* <Col md={6} >
<Form.Label>Exercises</Form.Label>
<Form.Control placeholder="Workout" />
</Col>
<Col md={2} >
<Form.Label>Reps</Form.Label>
<Form.Control placeholder="Reps" />
</Col>
<Col md={2}>
<Form.Label>Rest</Form.Label>
<Form.Control placeholder="Rest" />
</Col>
<Col md={2}>
<Form.Label>Target</Form.Label>
<Form.Control placeholder="Target" />
</Col> */}