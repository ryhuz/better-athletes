import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DatePicker from 'react-modern-calendar-datepicker';
import { Col, Row, Form, Button, Container } from "react-bootstrap";
import axios from "axios";

function WorkOut() {
    const [selectedOption, setSelectedOption] = useState(null);

    const [athletes, setAthletes] = useState([])
    const [date, setDate] = useState(null)
    const [inputForm, setForm] = useState(
        {
            athletes: [],
            workout_name: "",
            sets: [
                [
                    {
                        exercise: "",
                        reps: "",
                        rests: "",
                        targets: "",
                        units: "",
                        comments: "",
                        results: ""
                    }
                ]
            ]
        })

    const animatedComponents = makeAnimated();
    // console.log(selectedOption)

    function AddSet(i, item = [{
        exercise: "",
        reps: "",
        rests: "",
        targets: "",
        units: "",
        comments: "",
        results: ""
    }]) {
        let temp = { ...inputForm }
        
        // let repeated = []
        // repeated.push(item[0])
        console.log(item)
        let arr = []
        item.forEach((itemA,index)=>{
            arr.push([
                {
                    exercise: "",
                    reps: "",
                    rests: "",
                    targets: "",
                    units: "",
                    comments: "",
                    results: ""
                }
            ])
        })
        item.forEach((itemB,indexB)=>{
        console.log(arr[0])
           arr[indexB].exercise = itemB.exercise
           arr[indexB].reps = itemB.reps
           arr[indexB].rests = itemB.rests
           arr[indexB].targets = itemB.targets
           arr[indexB].units = itemB.units
           arr[indexB].comments = itemB.comments
           arr[indexB].results = itemB.results
        })
        console.log(item)
        console.log(arr)

        temp.sets.splice(i + 1, 0, arr)
        setForm(temp)
    }


    function RemoveSet(i) {
        let obj = { ...inputForm };
        obj.sets.splice(i, 1)
        setForm(obj)
    }

    function AddInput(i, ii) {
        let temp = { ...inputForm }
        temp.sets[i].splice(ii + 1, 0, {
            exercise: "",
            reps: "",
            rests: "",
            targets: "",
            units: "",
            comments: "",
            results: ""
        })
        setForm(temp)
    }

    function RemoveInput(i, ii) {
        let temp = { ...inputForm };
        temp.sets[i].splice(ii, 1);
        setForm(temp)
    }

    function ChangeHandler(e, i, ii) {
        
        let { name, value } = e.target;
        let temp = { ...inputForm };
        if (name === "athletes") {
            temp.athletes.push(value)
        } else if (name === "workout_name") {
            temp.workout_name = value
        } else if (name !== "athletes") {
            temp.sets[i][ii][name] = value
        }

        setForm(temp)
    }
    console.log(inputForm)


    // =========================== TO UPDATE AXIOS ONCE API ROUTES FINALISED ================================\\
    /**
     * @POST = send data from INPUT FORM STATE TO DJANGO DB
     * @reminder = to check data format, convert obj to array to send to back using another set state for submitworkout func
     */
    async function submitWorkout() {
        let maxLength = 0;
        inputForm.sets.forEach(set => {
            if (set.length > maxLength) maxLength = set.length
        })
        console.log(maxLength)
        let djangoFormVersion = {
            athletes: selectedOption,
            workout_name: inputForm.workout_name,
            workout_date: "",
            exercises: [],
            reps: [],
            rests: [],
            targets: [],
            units: [],
            comments: [],
            results: []
        }


        if (date === null) {
            djangoFormVersion.workout_date = ""
        } else {
            let formated_date = date.year + "-" + date.month + "-" + date.day
            djangoFormVersion.workout_date = formated_date
        }

        inputForm.sets.forEach(set => {
            let exerciseSet = []
            let repSet = []
            let restSet = []
            let targetsSet = []
            let unitsSet = []
            let commentsSet = []
            let resultsSet = []

            set.forEach(ex => {
                exerciseSet.push(ex.exercise)
                repSet.push(ex.reps)
                restSet.push(ex.rests)
                targetsSet.push(ex.targets)
                unitsSet.push(ex.units)
                commentsSet.push(ex.comments)
                resultsSet.push(ex.results)
            })
            if (exerciseSet.length < maxLength) {
                for (let i = 0; i <= maxLength - exerciseSet.length; i++) {
                    exerciseSet.push("")
                    repSet.push(0)
                    restSet.push("")
                    targetsSet.push("")
                    unitsSet.push("")
                    commentsSet.push("")
                    resultsSet.push("")
                }
            }
            djangoFormVersion.exercises.push(exerciseSet)
            djangoFormVersion.reps.push(repSet)
            djangoFormVersion.rests.push(restSet)
            djangoFormVersion.targets.push(targetsSet)
            djangoFormVersion.units.push(unitsSet)
            djangoFormVersion.comments.push(commentsSet)
            djangoFormVersion.results.push(resultsSet)
        })
        try {
            let response = await axios.post("http://localhost:8000/api/workouts", djangoFormVersion, {
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

    useEffect(() => {
        async function getAthletes() {
            try {
                let response = await axios.get("http://localhost:8000/api/workouts", {
                    headers: {
                        'Authorization': "JWT " + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                        'accept': "application/json"
                    }
                });
                setAthletes(response.data.athletes)
            } catch (error) {
                return error
            }
        }

        getAthletes();

    }, [])

    console.log(athletes)
    return (
        <Container className="p-5">
            <Row className="mb-3">
                <Col>
                    <h4>New Workout</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col md={12} className="outer_form">
                    <Form>
                        <Row className="no-gutters">
                            <Col md={6} className="mr-4">
                                <Form.Control
                                    name="workout_name"
                                    onChange={(e) => ChangeHandler(e)}
                                    placeholder="Workout Name"
                                />
                            </Col>
                            <Col className="text-center">
                                <DatePicker
                                    value={date}
                                    onChange={setDate}
                                    inputPlaceholder="Workout Day"
                                    shouldHighlightWeekends
                                />
                            </Col>
                            <Col>

                                <Select
                                    isMulti
                                    name="colors"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    // value={athletes.name}
                                    placeholder="Athletes"
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    options={athletes}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.name}
                                    onChange={setSelectedOption}
                                />
                            </Col>
                        </Row>
                        {/* ------------------- EACH SET ------------------- */}
                        {inputForm.sets.map((item, index) => (
                            <div key={index}>
                                <hr />
                                <Form.Group className="my-5 form_set" >
                                    <Row className="no-gutters">
                                        <Col md="auto">
                                            <h4>SET {index + 1}</h4>
                                        </Col>
                                        <Col md="auto" className="ml-5">{inputForm.sets.length !== 1 &&
                                            <Button className="px-3" size='sm'
                                                onClick={() => RemoveSet(index)}
                                                variant="outline-danger"> Remove Set </Button>}
                                        </Col>
                                    </Row>
                                    {/* ------------------- EACH EXERCISE LINE ------------------- */}
                                    {item.map((item2, index2) => (
                                        <Row key={index2} className="my-2">
                                            <Col md="auto">
                                                {index2 + 1}:
                                            </Col>
                                            <Col md={4} >
                                                <Form.Control
                                                    name="exercise"
                                                    onChange={(e) => ChangeHandler(e, index, index2)}
                                                    id={`${index}-${index2}`}
                                                    value={item2.exercise}
                                                    placeholder="Exercise type" />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    name="reps"
                                                    onChange={(e) => ChangeHandler(e, index, index2)}
                                                    id={index2}
                                                    value={item2.reps}
                                                    placeholder="Reps" />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    name="rests"
                                                    onChange={(e) => ChangeHandler(e, index, index2)}
                                                    id={index2}
                                                    value={item2.rests}
                                                    placeholder="Rest" />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    name="targets"
                                                    onChange={(e) => ChangeHandler(e, index, index2)}
                                                    id={index2}
                                                    value={item2.targets}
                                                    placeholder="Target" />
                                            </Col>
                                            {/* ------------------- Add and Remove Exercise Line Button ------------------- */}
                                            <Col md={2}>
                                                <Row>
                                                    <Col>{inputForm.sets[index].length !== 1 &&
                                                        <Button key={index} block className="mr10"
                                                            onClick={() => RemoveInput(index, index2)}
                                                            variant="outline-danger"> - </Button>}
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            key={index} block
                                                            onClick={() => AddInput(index, index2)}
                                                            variant="outline-secondary"> + </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    ))}
                                    {/* ------------------- Add and Repeat Set Button ------------------- */}
                                    <Row className="my-4">
                                        <Col md={3} className="ml-auto">
                                            <Button block size='sm'
                                                onClick={() => AddSet(index)}
                                                variant="outline-secondary"> Add Set </Button>
                                        </Col>
                                        <Col md={3}>
                                            <Button block size='sm'
                                                onClick={() => AddSet(index, item)}
                                                variant="secondary"> Repeat Set </Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </div>
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
        </Container>
    )
}

export default WorkOut



// async function getData() {
//     try {
//         let response = await axios.get("http://localhost:8000/api/workouts", {
//             headers: {
//                 'Authorization': "JWT " + localStorage.getItem('token'),
//                 'Content-Type': 'application/json',
//                 'accept': "application/json"
//             }

//         });
//         console.log(response)
//     } catch (error) {
//         return error
//     }
// }
// getData();

{/* <DropdownButton
                                    id="dropdown-basic-button"
                                    variant="info"
                                    title="Athletes"
                                    className="d-flex justify-content-end"
                                    onChange={(e) => ChangeHandler(e)}
                                >
                                    <Dropdown.Item >
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="Select One" name="athletes" value={1} />
                                        </Form.Group>
                                    </Dropdown.Item>
                                    {athletes.map((item, index) => (
                                        <Dropdown.Item key={index} >
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" name={item.name} label={item.name} value={item.name} />
                                            </Form.Group>
                                        </Dropdown.Item>
                                    ))}

                                </DropdownButton> */}