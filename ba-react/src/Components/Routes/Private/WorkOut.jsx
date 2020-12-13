import React, { useState, useEffect } from 'react'
import { Fragment } from 'react'
import { Col, Row, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";

function WorkOut({ name }) {
    const [athletes, setAthletes] = useState([])
    const [inputForm, setForm] = useState(
        {
            athletes: [],
            sets: [
                    {
                        set: "",
                        data: [
                                {
                                    exercise: "",
                                    reps: "",
                                    rest: "",
                                    target: ""
                                }
                        ]   
                    }
                ]
        })

    
    function AddSet(){
        let new_form = {...inputForm}
        new_form.sets.push({
                set: "",
                data: [
                    {
                        exercise: "",
                        reps: "",
                        rest: "",
                        target: ""
                    }
                ]
            })
        setForm(new_form)
    }

    function RemoveSet(i){
        let obj = {...inputForm};
        obj.sets.splice(i,1)
        setForm(obj)
    }

    function AddInput(i) {
        let input = {...inputForm}
        let new_form = input.sets[i].data
        new_form.push({
            exercise: "",
            reps: "",
            rest: "",
            target: ""
        })
        setForm(input)
    }

    function RemoveInput(i, ii) {
        let input = {...inputForm};
        let list_data = input.sets[i].data;
        list_data.splice(ii, 1);
        setForm(input)
    }

    function repeatSet(i) {
        let repeat_set = {...inputForm};
        let new_obj = {
            set: repeat_set.sets[i].set + 1,
            data: repeat_set.sets[i].data
        }
        repeat_set.sets.push(new_obj)
        setForm(repeat_set)

    }

    function ChangeHandler(e, i, ii) {
        let { name, value } = e.target;
        let form_data = {...inputForm};

        if (name == "athletes"){
            form_data.athletes.push(value)
        } else if (name != "athletes"){
            form_data.sets[i].set = i+1;
            form_data.sets[i].data[ii][name] = value;
        }
        
        setForm(form_data)
    }
    console.log(inputForm)



    // =========================== TO UPDATE AXIOS ONCE API ROUTES FINALISED ================================\\
    /**
     * @POST = send data from INPUT FORM STATE TO DJANGO DB
     * @reminder = to check data format, convert obj to array to send to back using another set state for submitworkout func
     */
    async function submitWorkout(){
        try {
            let response = await axios.post(process.env.REACT_APP_LOCALHOST + `/`, inputForm);
        } catch (error) {
            return error
        }
    }

    /**
     * @GET = retrieve Athlete data and populate in drop down list
     */

    async function getAthletes(){
        try {
            let response = await axios.get(process.env.REACT_APP_LOCALHOST+ `/`);
            setAthletes(response.data) // response.data? or smtg less, check it later
        }catch(error){
            return error
        }
    }

    useEffect(() => {
        getAthletes();
    }, [])

    return (
        <Fragment>
            <Row className="">
                <Col md={12} className="border pt-3">
                    <h4>SETS</h4>
                </Col>
                <Col md={12} className="my-3 py-3 outer_form">
                <Form>
                <DropdownButton 
                id="dropdown-basic-button" 
                variant="info" 
                title="Dropdown button" 
                className="d-flex justify-content-end"
                onChange={(e)=>ChangeHandler(e)}
                >
                    <Dropdown.Item >
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Select One" name="athletes" value={1}/>
                        </Form.Group>
                    </Dropdown.Item>
                    {athletes.map((item,index)=>(
                        <Dropdown.Item key={index} >
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label={item} value={item}/>
                            </Form.Group>
                        </Dropdown.Item>
                    ))}

                </DropdownButton>
                    {inputForm.sets.map((item, index) => (
                        <Form.Group className="my-3 py-3 form_set" key={index}>
                            <Row className="no-gutters">
                                <Col md={8} className="">
                                    <h4>SET {index + 1}</h4>
                                </Col>
                                <Col md={1} className="d-flex justify-content-center" >{inputForm.sets.length !== 1 &&
                                    <Button className="px-3"
                                        onClick={() => RemoveSet(index)}
                                        variant="outline-danger"> - </Button>}
                                </Col>
                                <Col md={1} className="d-flex justify-content-center">
                                    {inputForm.sets.length - 1 === index &&
                                        <Button
                                            onClick={AddSet}
                                            variant="outline-secondary"> + </Button>}
                                </Col>
                                <Col md={2} className="d-flex justify-content-center">
                                        <Button
                                            onClick={()=>repeatSet(index)}
                                            variant="secondary"> Repeat Set </Button>
                                </Col>
                            </Row>
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


                            {inputForm.sets[index].data.map((item2, index2) => (

                                <Row key={index} className="my-2">
                                    <Col md={4} >
                                        <Form.Control
                                            name="exercise"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.exercise}
                                            placeholder="Workout" />
                                    </Col>
                                    <Col md={2} >
                                        <Form.Control
                                            name="reps"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.reps}
                                            placeholder="Reps" />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            name="rest"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.rest}
                                            placeholder="Rest" />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            name="target"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.target}
                                            placeholder="Target" />
                                    </Col>
                                    <Col md={2}>
                                        <Row>
                                            <Col>{inputForm.sets[index].data.length !== 1 &&
                                                <Button key={index} className="mr10"
                                                    onClick={() => RemoveInput(index, index2)}
                                                    variant="outline-danger"> - </Button>}
                                            </Col>
                                            <Col>
                                                {inputForm.sets[index].data.length - 1 === index2 &&
                                                    <Button
                                                        key={index}
                                                        onClick={()=>AddInput(index)}
                                                        variant="outline-secondary"> + </Button>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            ))}

                        </Form.Group>
                    ))}
                    </Form>

                    <Row >
                        <Col md={12} className="d-flex flex-row-reverse">
                            <Button 
                            variant="warning" 
                            type="submit"
                            onClick={submitWorkout}
                            >Add Exercise</Button>
                        </Col>
                    </Row>
                </Col>


            </Row>
        </Fragment>
    )
}

export default WorkOut
