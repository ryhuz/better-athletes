import React, { useState, useEffect } from 'react'
import DatePicker from 'react-modern-calendar-datepicker';
import { Fragment } from 'react'
import { Col, Row, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";

function WorkOut() {
    const [athletes, setAthletes] = useState([])
    const [date, setDate] = useState(null)
    const [exer, setExer] = useState([])
    const [inputForm, setForm] = useState(
        {
            athletes: [],
            workout_name: "",
            workout_date:{},
            sets: [
                    {
                        set: "",
                        data: [
                                {   
                                    exercise: "",
                                    reps: "",
                                    rests: "",
                                    targets: ""
                                }
                        ]   
                    }
                ]
        })
    
    const [djangoData, setDjangoData] = useState(
        {
            athletes: [],
            workout_name:"",
            exercise: [[]],
            reps: [],
            targets: [],
            rests: [],
        }
    )
    
    function AddSet(){
        let new_form = {...inputForm}
        new_form.sets.push({
                set: "",
                data: [
                    {
                        exercise: "",
                        reps: "",
                        rests: "",
                        targets: ""
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
            rests: "",
            targets: ""
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
<<<<<<< HEAD:ba-react/src/Components/Routes/Private/AddWorkOut.jsx
        console.log("hello!")
        if (name == "athletes"){
            form_data.athletes.push(value)
        } else if (name == "workout_name") {
            form_data.athletes = value
        } else if (name != "athletes"){
=======

        if (name === "athletes"){
            form_data.athletes.push(value)
        } else if (name !== "athletes"){
>>>>>>> master:ba-react/src/Components/Routes/Private/WorkOut.jsx
            form_data.sets[i].set = i+1;
            form_data.sets[i].data[ii][name] = value;
            form_data.workout_date = date;
        }
        
        setForm(form_data)
        djangoHandler(e,i,ii);
    }

    let newArr = []

    // let obj = {
    //     xxx: [],
    //     sdasda
    // }

    function djangoHandler(e,i,ii){
        let { name, value } = e.target;
        let django_data = {...djangoData};
        
        if (name == "athletes"){
            django_data.athletes.push(value)
        } else if (name == "workout_name"){
            django_data.workout_name = value
        } else if (name == "exercise"){
            
            django_data.exercise[i][ii] = value
        }
        setDjangoData(django_data)
        console.log(djangoData)
        // [[[]],[[[]]]]
    }
    // console.log(newArr)

    // console.log(inputForm)
    // exercise: [],
    //         reps: [],
    //         targets: [],
    //         rests: []

    function djangoConversion(){
        let exercise_arr = new Array(inputForm.sets.length).fill([])
        let reps_arr = new Array(inputForm.sets.length).fill([])
        let targets_arr = new Array(inputForm.sets.length).fill([])
        let rests_arr = new Array(inputForm.sets.length).fill([])
        let count = 0;
        let data = inputForm.sets;
        let arr = []
        let merged = [].concat(arr)

        // console.log(length_of_arr)
        // // data.forEach((item,index)=>{
        // //     arr.push(item.data[index].exercise)
        // // })
        // console.log(arr)
        // console.log(merged)
        // item.data.forEach((item2,index2)=>{
        //     console.log(count)
        //     if (item2["exercise"]){
        //         exercise_arr[count].push(item2["exercise"])
        //     } else if (item2["reps"] && index == index2){
        //         reps_arr[index].push(item2["reps"])
        //     } else if (item2["targets"] && index == index2){
        //         targets_arr[index].push(item2["targets"])
        //     } else if (item2["rests"] && index == index2){
        //         rests_arr[index].push(item2["rests"])
        //     }
            
        // })
        // count += 1
        // console.log(count)
    }
    // djangoConversion();




    // console.log(inputForm)



    // =========================== TO UPDATE AXIOS ONCE API ROUTES FINALISED ================================\\
    /**
     * @POST = send data from INPUT FORM STATE TO DJANGO DB
     * @reminder = to check data format, convert obj to array to send to back using another set state for submitworkout func
     */
    async function submitWorkout(){
        try {
            let response = await axios.post("http://localhost:8000/api/workouts",inputForm, {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'accept': "application/json"
                }
            })
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

    async function getData(){
        try {
            let response = await axios.get("http://localhost:8000/api/workouts", {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'accept': "application/json"
                }
            });
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        // getAthletes();
        getData();
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
                        <Col md={3}>
                        <Form.Control
                            name="workout_name"
                            onChange={(e) => ChangeHandler(e)}
                            placeholder="Designate a workout name" 
                            />
                        </Col>
                        <Col md={1}>

                        </Col>
                        <Col md={3}>
                        <DatePicker
                            value={date}
                            onChange={setDate}
                            inputPlaceholder="Select a day"
                            shouldHighlightWeekends
                            />
                        </Col>
                        <Col md={3}>

                        </Col>
                        <Col md={2} className="d-flex justify-content-center">


                            <DropdownButton 
                            id="dropdown-basic-button" 
                            variant="info" 
                            title="Athletes" 
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
                        </Col>
                    </Row>
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
                                    <Form.Label>Exercise</Form.Label>
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
                            </Row>


                            {inputForm.sets[index].data.map((item2, index2) => (

                                <Row key={index2} className="my-2">
                                    <Col md={4} >
                                        <Form.Control
                                            name="exercise"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.exercise}
                                            placeholder="Exercise type" />
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
                                            name="rests"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.rests}
                                            placeholder="Rest" />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            name="targets"
                                            onChange={(e) => ChangeHandler(e,index, index2)}
                                            value={item2.targets}
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
                            >Save Exercise</Button>
                        </Col>
                    </Row>
                </Col>


            </Row>
        </Fragment>
    )
}

export default WorkOut
