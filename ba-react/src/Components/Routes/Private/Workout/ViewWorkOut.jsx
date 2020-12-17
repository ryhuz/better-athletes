import React, { useState, useEffect, Fragment } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { Col, Row, Form, Button, Container, Accordion, Modal } from "react-bootstrap";
import axios from "axios";

function ViewWorkOut() {
    const [showEmpty, setShowEmpty] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isSubmit, setisSubmit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [workout, setWorkout] = useState({ results: [] })
    const [results, setResults] = useState({})
    const [axiosErr, setAxiosErr] = useState(false)
    const [comments, setComments] = useState({})
    const [showComments, setshowComments] = useState()
    const [resultState, setResultState] = useState(false)
    const [formState, setFormState] = useState({
        sets: []
    })
    const handleClose = () => setShowEmpty(false);
    const handleShow = () => setShowEmpty(true);
    const handleCloseError = () => setShowError(false);
    const handleShowError = () => setShowError(true);

    let { id } = useParams()

    function anyEmptyInputs() {
        let allInputs = document.querySelectorAll('input');
        let any = false
        allInputs.forEach(x => {
            if (!x.value) {
                x.classList.add('empty');
                x.addEventListener('click', () => x.classList.remove('empty'));
                any = true;
            }
        })
        return any;
    }

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
    console.log(showComments)
    
    async function saveResults() {
    if (anyEmptyInputs()) {
            handleShow()
        } else {
            setSaving(true)
        try {
            let max_length_counter = 0;
            let obj = { ...results }
            let resultsSet = []
            let django_results = {
                results: [],
            }
            let max_rectangular_len = 0


            formState.sets.forEach(set => {
                set.forEach(ex => {
                    if (Number(ex.reps) > max_rectangular_len){
                        max_rectangular_len = Number(ex.reps)
                    }
                })
            })
            console.log(max_rectangular_len)

            formState.sets.forEach(set => {
                let result_arr = []
                set.forEach(ex => {
                    result_arr.push(new Array(max_rectangular_len).fill(""))  
                })
            resultsSet.push(result_arr)
            })

            console.log(resultsSet)
        

            for (const property in obj){
                let key = property.split("-")
                let zero = Number(key[0])
                let one = Number(key[1])
                let two = Number(key[2])-1 < 0 ? Number(key[2]) : Number(key[2])-1
                resultsSet[zero][one][two] = obj[property]
                
            }
            console.log(resultsSet)

            let clone = [...resultsSet]
            // console.log(clone)
            clone.forEach(cloneset =>{
                cloneset.forEach(item => {
                    if(item.length < max_rectangular_len){
                        for (let i = 0; i <= max_rectangular_len; i++){
                            item.push("")
                        }
                    }
                })
            })
            console.log(clone)
            django_results.results = clone;



            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json"
                }
            }
            console.log(django_results)
            // to update workoutResult ID
            let response = await axios.post(`http://localhost:8000/api/singleworkout/${id}`, django_results, headToken)

            if (response) {
                setisSubmit(true);
            }
            getWorkout();
            setResultState(true);

        } catch (error) {
            handleShowError()
            setSaving(false)
            setAxiosErr(true)
        }
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
            setisSubmit(false);
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

    function displayExercise(exercise, i, ii) {
        let line = []
        if (exercise.exercise) {
            for (let r = 0; r < Number(exercise.reps); r++) {
                if (r === 0) {
                    line.push(
                        <tr key={`${ii}${r}`}>
                            <td className="text-center align-middle" width="1%">
                                {ii + 1}
                            </td>
                            <td width="40%" className="align-middle">
                                {exercise.exercise}
                            </td>
                            <td className="text-center align-middle">
                                {exercise.reps}
                            </td>
                            <td className="text-center align-middle">
                                {exercise.rests}
                            </td>
                            <td className="text-center align-middle">
                                {exercise.target}
                            </td>
                            <td className="text-center align-middle" width="1%">{r + 1}</td>
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
                                        <Form.Control size="sm" id={`${ii}-${r}`} name={`${i}-${ii}-${ii}`}
                                            onChange={(e) => resultsHandler(e, ii, r)} placeholder="Results" />
                                }
                            </td>
                        </tr>
                    )
                } else {
                    line.push(
                        <tr key={`${ii}${r}`}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="text-center align-middle">{r + 1}</td>
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
                                        <Form.Control size="sm" id={`${ii}-${r}`} name={`${i}-${ii}-${ii+r}`}
                                            onChange={(e) => resultsHandler(e, ii, r)} placeholder="Results" />
                                }
                            </td>
                        </tr>
                    )
                }
            }
        }
        return line;
    }
console.log(results)
    useEffect(() => {
        getWorkout();
    }, [])
    
    if (isSubmit) {
        return <Redirect to="/betterathletes/dashboard" />
    }


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
                            <Accordion key={index} defaultActiveKey={index + 1}>
                                {/* ------------------- SET Headings ------------------- */}
                                <Accordion.Toggle as={Row} eventKey={index + 1} className="no-gutters">
                                    <Col md={12}>
                                        <h5>SET {index + 1}</h5>
                                    </Col>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={index + 1}>
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
                                        {item.map((item2, index2) => (
                                            <tbody className="bigger-text2" key={index2}>
                                                {displayExercise(item2, index, index2)}
                                            </tbody>
                                        ))}
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
             {/* Any empty fields modal */}
             <Modal show={showEmpty} onHide={handleClose} centered >
                <Modal.Header className="bg-dark">
                    <Modal.Title>Oops</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark bigger-text2">Please make sure you fill in all fields before saving the workout</Modal.Body>
                <Modal.Footer className="bg-dark">
                    <Button variant="main" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Add error */}
            <Modal show={showError} onHide={handleCloseError} centered >
                <Modal.Header className="bg-dark">
                    <Modal.Title>Something went wrong</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark bigger-text2">We could not save this workout</Modal.Body>
                <Modal.Footer className="bg-dark">
                    <Button variant="main" onClick={handleCloseError}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default ViewWorkOut
