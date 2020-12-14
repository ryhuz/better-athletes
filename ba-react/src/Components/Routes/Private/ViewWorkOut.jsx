import React, { useState, useEffect, Fragment } from 'react'
import { Col, Row, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";



function ViewWorkOut() {
    const [indexSet, setIndexSet] = useState(0)
    const [newComments, setNewComments] = useState({})
    /**
     * @WORKOUT - updatethis this when api data obtained
     */
    const [workout, setWorkout] = useState(
        [
            {
                set: "1",
                data: [
                    {
                        exercise: "Lunges",
                        reps: "10",
                        rest: "2",
                        target: "10min",
                        result: "",
                        comments: [{username: "ABC", comment: "nice stuff there"},{username: "Coach A", comment: "good stuff there"}]
                    },                    
                    {
                        exercise: "Burpees",
                        reps: "10",
                        rest: "2min",
                        target: "12min",
                        result: "",
                        comments: [{}]
                    }
                ]
            },            
            {
                set: "2",
                data: [
                    {
                        exercise: "Swimming",
                        reps: "2",
                        rest: "2min",
                        target: "250m",
                        result: "",
                        comments: [{}]
                    },                    
                    {
                        exercise: "Sprinting",
                        reps: "100m",
                        rest: "1min",
                        target: "30s",
                        result: "",
                        comments: [{}]
                    }
                ]
            }
        ]
    )
    const [exerciseSelection, setExerciseSelection] = useState([])
    
    
    function selectionHandler(e){
        let {value} = e.target;
        console.log(value)
        setExerciseSelection(workout[Number(value)-1].data)
    }
    
    function commentHandler(e){
        let {name, value} = e.target;
        setNewComments({...newComments, [name]: value})
    }

    console.log(indexSet)
    console.log(exerciseSelection)
    console.log(newComments)
    //=========================AXIOS API TO BE UPDATED ================================\\

    async function getWorkout() {
        try {
            let response = await axios.get(process.env.REACT_APP_LOCALHOST + `/`)
            // setWorkout(response.data) to update once API confirmed
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        getWorkout();
    }, [])

    return (
        <Fragment>
            <Row className="">
                <Col md={12} className="border pt-3">
                    <h4>SETS</h4>
                </Col>
                <Col md={12} className="my-3 py-3 outer_form">
                    <Form>
                        <Row className="no-gutters">
                            <Col md={10}></Col>
                            <Col md={2} className="d-flex justify-content-center">
                            </Col>
                        </Row>
                        {workout.map((item, index) => (
                            <Form.Group className="my-3 py-3 form_set" key={index}>
                                <Row className="no-gutters">
                                    <Col md={8} className="">
                                        <h4>SET {index + 1}</h4>
                                    </Col>
                                    <Col md={1} className="d-flex justify-content-center" >
                                    </Col>
                                    <Col md={1} className="d-flex justify-content-center">
                                    </Col>
                                    <Col md={2} className="d-flex justify-content-center">
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4} >
                                        <Form.Label class="font-weight-bold">Exercises</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label class="font-weight-bold">Reps</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label class="font-weight-bold">Rest</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label class="font-weight-bold">Target</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label class="font-weight-bold">Input Results</Form.Label>
                                    </Col>
                                </Row>


                                {item.data.map((item2, index2) => (
                                    
                                    <Row key={index2} className="my-2">
                                        <Col md={4} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2.exercise}
                                            </div>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2.reps}
                                            </div>

                                        </Col>
                                        <Col md={2} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2.rest}
                                            </div>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2.target}
                                            </div>

                                        </Col>
                                        <Col md={2} className="d-flex align-items-center my-2">
                                            <Form.Control
                                            name="results"
                                            // onChange={(e) => ChangeHandler(e,index, index2)}
                                            placeholder="Results"/>
                                        </Col>
                                        <Col md={12} className="d-flex align-items-center my-2 no-gutters">
                                           <Col md={12} className="border">
                                                {item2.comments.map((item3,index)=>(
                                                    <div key={index}>
                                                        {item3.username == null ? <text style={{fontWeight: 'bold'}}> No comments</text> : <p><text style={{fontWeight: 'bold'}}>{item3.username}</text><br/>{item3.comment}</p> }
                                                    </div>
                                                ))}
                                           </Col>
                                        </Col>
                                    </Row>
                                ))}

                            </Form.Group>
                        ))}
                    </Form>

                    <Row >
                        <Col md={12} className="d-flex flex-row-reverse align-items-center my-3">
                            <Button>Add Results</Button>
                        </Col>
                        <Col md={6} className="d-flex flex-row align-items-center my-2">
                            <h4>Enter Workout Comments</h4>
                        </Col>
                        <Col md={3} className="d-flex flex-row align-items-center my-2">
                            <Form>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>SET</Form.Label>
                                    <Form.Control 
                                    as="select" 
                                    defaultValue="Choose..."
                                    onChange={(e)=>{
                                        commentHandler(e);
                                        selectionHandler(e)
                                    }} 
                                    name="set"
                                    >
                                    {workout.map((item,index)=>(
                                            <option
                                            key={index} 
                                            value={item.set}                                   
                                            >SET {item.set}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col md={3} className="d-flex flex-row align-items-center my-2">
                        <Form>
                            <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Exercise</Form.Label>
                                    <Form.Control 
                                    as="select" 
                                    defaultValue="Choose..."
                                    onChange={(e)=>commentHandler(e)} 
                                    name="exercise"
                                    >
                                    {exerciseSelection.map((item,index)=>(
                                            <option
                                            key={index} 
                                            onClick={()=>setIndexSet(index)} 
                                            value={item.set}                                   
                                            >Exercise {item.exercise}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                                                    
                        <Col md={12} className="my-2">
                            <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="comment"
                            onChange={(e)=>commentHandler(e)}
                            />
                        </Col>
                    </Row>
                </Col>


            </Row>
        </Fragment>
    )
}

export default ViewWorkOut
