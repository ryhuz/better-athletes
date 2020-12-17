import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row, Form, Button, Container, Accordion } from "react-bootstrap";
import axios from "axios";

function ViewWorkOut() {
    const [workout, setWorkout] = useState({ results: [] })
    const [results, setResults] = useState({})
    const [axiosErr, setAxiosErr] = useState(false)
    const [comments, setComments] = useState({})
    const [showComments, setshowComments] = useState()
    const [resultState, setResultState] = useState(false)
    const [formState, setFormState] = useState({
        sets: []
    })

    let { id } = useParams()

    function resultsHandler(e, i, ii) {
        let { name, value, id } = e.target;
        let obj = { ...results, [name]: value }
        setResults(obj)
    }
    function commentHandler(e) {
        let { name, value } = e.target
        let obj = { ...comments, [name]: value }
        setComments(obj)
    }

    async function saveComments() {
        try {
            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json"
                }
            }// workoutResult ID
            let data = await axios.post(`http://localhost:8000/api/singleworkout/comment/${id}`, comments, headToken)
            getWorkout();
        } catch (error) {
            console.log(error)
            setAxiosErr(true)
        }

    }
    async function saveResults() {
        try {
            let max_length_counter = 0;
            let obj = { ...results }
            let arr = []
            let django_results = {
                results: [],
            }


            workout.exercise.forEach((item, index) => {
                arr.push([])
            })


            for (const property in obj) {
                let key = property.charAt(property.length - 1);
                arr[Number(key)].push(obj[property])
            }


            arr.forEach((item, index) => {
                if (item.length > max_length_counter) {
                    max_length_counter = item.length

                }
            })

            arr.forEach((item, index) => {
                if (item.length < max_length_counter) {
                    arr[index].push("")
                }
            })
            django_results.results = arr


            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json"
                }
            }
            // to update workoutResult ID
            await axios.post(`http://localhost:8000/api/singleworkout/${id}`, django_results, headToken)

            getWorkout();
            setResultState(true);

        } catch (error) {
            console.log(error)
            setAxiosErr(true)
        }
    }

    async function getWorkout() {
        try {
            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json",

                }
            }// to update workoutResult ID
            let data = await axios.get(`http://localhost:8000/api/singleworkout/${id}`, headToken)
            setWorkout(data.data.result)
            setshowComments(data.data.all_comments)
            setResultState(data.data.result.completed);
            /** CREATE FORM IN OBJ FORM*/
            let exercise = data.data.result.exercise;
            let reps = data.data.result.reps;
            let target = data.data.result.target;
            let results = data.data.result.results;
            let rests = data.data.result.rests;

            let exercise_arr = []
            let reps_arr = []
            let target_arr = []
            let results_arr = []
            let rests_arr = []

            for (let i = 0; i < exercise.length; i++) {
                exercise[i].forEach((item2, index2) => {
                    let obj = {}
                    let key = "exercise"
                    obj[key] = item2
                    exercise_arr.push(obj)

                })
            }

            for (let i = 0; i < reps.length; i++) {
                reps[i].forEach((item2, index2) => {
                    let obj = {}
                    let key = "reps"
                    obj[key] = item2
                    reps_arr.push(obj)

                })
            }

            for (let i = 0; i < target.length; i++) {
                target[i].forEach((item2, index2) => {
                    let obj = {}
                    let key = "target"
                    obj[key] = item2
                    target_arr.push(obj)

                })
            }

            for (let i = 0; i < results.length; i++) {
                results[i].forEach((item2, index2) => {
                    let obj = {}
                    let key = "results"
                    obj[key] = item2
                    results_arr.push(obj)

                })
            }

            for (let i = 0; i < rests.length; i++) {
                rests[i].forEach((item2, index2) => {
                    let obj = {}
                    let key = "rests"
                    obj[key] = item2
                    rests_arr.push(obj)

                })
            }

            let new_arr1 = exercise_arr.map((item, index) => Object.assign({}, item, reps_arr[index]))
            let new_arr2 = new_arr1.map((item, index) => Object.assign({}, item, target_arr[index]))
            let new_arr3 = new_arr2.map((item, index) => Object.assign({}, item, results_arr[index]))
            let new_arr4 = new_arr3.map((item, index) => Object.assign({}, item, rests_arr[index]))

            let divisor = new_arr4.length / exercise.length;

            let final_arr = [];
            for (let i = 0; i < new_arr4.length; i += divisor) {
                let x = new_arr4.slice(i, i + divisor)
                final_arr.push(x)
            }

            let form_obj = {
                workout_name: data.data.result.workout_name,
                sets: final_arr
            }

            setFormState(form_obj)

        }
        catch (e) {
            console.log(e)
            setAxiosErr(true)
        }
    }
    console.log(formState)
    console.log(workout)

    function displayExercise(exercise, i) {
        let line = []
        if (exercise.exercise) {
            for (let r = 0; r < Number(exercise.reps); r++) {
                if (r === 0) {
                    line.push(
                        <tr>
                            <td className="text-center" width="1%">
                                {i + 1}
                            </td>
                            <td width="40%">
                                {exercise.exercise}
                            </td>
                            <td className="text-center">
                                {exercise.reps}
                            </td>
                            <td className="text-center">
                                {exercise.rests}
                            </td>
                            <td className="text-center">
                                {exercise.target}
                            </td>
                            <td className="text-center" width="1%">{r + 1}</td>
                            <td width="5%">
                                {workout.results === undefined ? <>Loading...</> :
                                    resultState === true ?
                                        <Row className="my-3 no-gutters d-flex align-items-center">
                                            <Col>
                                                {exercise.results[r]}
                                            </Col>
                                            <Col>
                                                <Button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setResultState(false)}
                                                >Edit</Button>
                                            </Col>
                                        </Row>
                                        :
                                        <Form.Control size="sm" id={`${i}-${r}`} name={`${exercise.exercise}-exerindex${i}-${r}`}
                                            onChange={(e) => resultsHandler(e, i, r)} placeholder="Results" />
                                }
                            </td>
                        </tr>
                    )
                } else {
                    line.push(
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="text-center">{r + 1}</td>
                            <td>
                                {workout.results === undefined ? <>Loading...</> :
                                    resultState === true ?
                                        <Row className="my-3 no-gutters d-flex align-items-center">
                                            <Col>
                                                {exercise.results[r]}
                                            </Col>
                                            <Col>
                                                <Button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setResultState(false)}
                                                >Edit</Button>
                                            </Col>
                                        </Row>
                                        :
                                        <Form.Control size="sm" id={`${i}-${r}`} name={`${exercise.exercise}-exerindex${i}-${r}`}
                                            onChange={(e) => resultsHandler(e, i, r)} placeholder="Results" />
                                }
                            </td>
                        </tr>
                    )
                }
            }
        }
        return line;
    }

    useEffect(() => {
        getWorkout();
    }, [])
    return (
        <Container className="bg-contrast px-4">
            {/* ---------------- Heading -------------------- */}
            <Row className="my-5">
                <Col md={12}>
                    <h4 className="title display-5">{workout.workout_name}</h4>
                </Col>
                <Col md={12}>
                    <h4 className="display-6">{workout.athlete_name}</h4>
                </Col>
                <Col md={12}>
                    <h4 className="display-6">{workout.workout_date}</h4>
                </Col>
            </Row>
            <Form>
                {/* ------------------- EACH SET ------------------- */}
                {formState.sets.map((item, index) => (
                    <Form.Group key={index}>
                        <Container>
                            <Accordion key={index} defaultActiveKey={index+1}>

                                {/* ------------------- SET Headings ------------------- */}
                                <Accordion.Toggle as={Row} eventKey={index+1} className="no-gutters">
                                    <Col md={12}>
                                        <h5>SET {index + 1}</h5>
                                    </Col>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={index+1}>
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <Form.Label className="font-weight-bold ">Exercises</Form.Label>
                                                </td>
                                                <td className="text-center">
                                                    <Form.Label className="font-weight-bold">Reps</Form.Label>
                                                </td>
                                                <td className="text-center">
                                                    <Form.Label className="font-weight-bold">Rest</Form.Label>
                                                </td>
                                                <td className="text-center">
                                                    <Form.Label className="font-weight-bold">Target</Form.Label>
                                                </td>
                                                <td className="text-center">
                                                    <Form.Label className="font-weight-bold">Rep No.</Form.Label>
                                                </td>
                                                <td>
                                                    <Form.Label className="font-weight-bold">Input Results</Form.Label>
                                                </td>
                                            </tr>
                                        </thead>
                                        {/* ------------------- EACH EXERCISE LINE ------------------- */}
                                        <tbody className="bigger-text2">
                                            {item.map((item2, index2) => (
                                                <>
                                                    {displayExercise(item2, index2)}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </Accordion.Collapse>
                            </Accordion>
                        </Container>
                    </Form.Group>
                ))}
                <Col md={12}>
                    <Button variant="main" onClick={saveResults} block>
                        Save Results
                    </Button>
                </Col>
            </Form>
            {/* ------------------- COMMENTS ------------------- */}
            <Form>
                <Row >
                    <Col md={12} className="d-flex flex-row align-items-center my-3">
                        <div>
                            {showComments == undefined ? <>Loading ... </> : showComments.map((item, index) => (
                                <div className="my-3" key={index}>
                                    <div>
                                        <h6>{item.user}</h6>
                                    </div>
                                    <div>
                                        {item.comment}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </Col>
                    <Col md={6} className="d-flex flex-row align-items-center my-2 title">
                        <h4>Enter Workout Comments</h4>
                    </Col>
                    <Col md={12} className="my-2">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="comment"
                            onChange={(e) => commentHandler(e)}
                        />
                    </Col>
                    <Col md={12} className="my-2">
                        <Button onClick={saveComments} variant="main">
                            Add a Comment
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default ViewWorkOut
