import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Col, Row, Form, Button, Container, Modal } from "react-bootstrap";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { axiosInstance } from "../../../../func/axiosApi"

function WorkOut({ isAuth }) {
    const [showEmpty, setShowEmpty] = useState(false);
    const [showError, setShowError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmit, setisSubmit] = useState(false);
    const [athletes, setAthletes] = useState([{
        name: ""
    }])
    const [date, setDate] = useState(null);
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
    const handleClose = () => setShowEmpty(false);
    const handleShow = () => setShowEmpty(true);
    const handleCloseError = () => setShowError(false);
    const handleShowError = () => setShowError(true);

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
        let arr = []
        item.forEach((itemA, index) => {
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
        item.forEach((itemB, indexB) => {
            arr[indexB].exercise = itemB.exercise
            arr[indexB].reps = itemB.reps
            arr[indexB].rests = itemB.rests
            arr[indexB].targets = itemB.targets
            arr[indexB].units = itemB.units
            arr[indexB].comments = itemB.comments
            arr[indexB].results = itemB.results
        })
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
        } else if (name === "reps" && value === "") {

            temp.sets[i][ii][name] = 0;
        } else if (name !== "athletes") {
            temp.sets[i][ii][name] = value
        }

        setForm(temp)
    }

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

    /**
     * @POST = send data from INPUT FORM STATE TO DJANGO DB
     * @reminder = to check data format, convert obj to array to send to back using another set state for submitworkout func
     */
    async function submitWorkout() {
        if (false) {
            handleShow()
        } else {
            setSaving(true)
            let maxLength = 0;
            inputForm.sets.forEach(set => {
                if (set.length > maxLength) maxLength = set.length
            })
            let djangoFormVersion = {
                athletes: selectedOption,
                workout_name: inputForm.workout_name,
                workout_date: date,
                exercises: [],
                reps: [],
                rests: [],
                targets: [],
                units: [],
                comments: [],
                results: []
            }

            let max_rectangular_len = 0

            /* rectangularisation of every key except results (
             for results, please refer to separate loop, due to setting the max_rectangular_length
             in the first loop) 
            */
            inputForm.sets.forEach(set => {
                let exerciseSet = []
                let repSet = []
                let restSet = []
                let targetsSet = []
                let unitsSet = []
                let commentsSet = []

                set.forEach(ex => {
                    exerciseSet.push(ex.exercise)
                    repSet.push(ex.reps)
                    restSet.push(ex.rests)
                    targetsSet.push(ex.targets)
                    unitsSet.push(ex.units)
                    commentsSet.push(ex.comments)

                    if (Number(ex.reps) > max_rectangular_len) {
                        max_rectangular_len = Number(ex.reps)
                    }

                })

                /* Rectangularising data */
                if (exerciseSet.length < maxLength) {
                    for (let i = 0; i <= maxLength - exerciseSet.length; i++) {
                        exerciseSet.push("")
                        repSet.push("")
                        restSet.push("")
                        targetsSet.push("")
                        unitsSet.push("")
                        commentsSet.push("")
                    }
                }
                djangoFormVersion.exercises.push(exerciseSet)
                djangoFormVersion.reps.push(repSet)
                djangoFormVersion.rests.push(restSet)
                djangoFormVersion.targets.push(targetsSet)
                djangoFormVersion.units.push(unitsSet)
                djangoFormVersion.comments.push(commentsSet)
            })

            /** Rectangularisation of results based on number of reps captured
             *  (for all others, please refer to above loop)
             */

            inputForm.sets.forEach(set => {
                let resultsSet = []
                set.forEach(ex => {
                    resultsSet.push(new Array(max_rectangular_len).fill(""))
                })
                /* Rectangularising data */
                if (resultsSet.length < maxLength) {
                    for (let i = 0; i <= maxLength - resultsSet.length; i++) {
                        resultsSet.push(new Array(max_rectangular_len).fill(""))
                    }
                }
                djangoFormVersion.results.push(resultsSet)
            })
            console.log(djangoFormVersion)
            try {
                let response = await axiosInstance.post("workouts", djangoFormVersion)
                if (response) {
                    setisSubmit(true);
                }
            } catch (error) {
                handleShowError()
                setSaving(false)
            }
        }
    }

    /**
     * @GET = retrieve Athlete data and populate in drop down list
     */
    useEffect(() => {
        async function getAthletes() {
            try {
                let response = await axiosInstance.get("workouts");
                setAthletes(response.data.athletes)
                !isAuth.coach && setSelectedOption([response.data.athletes[0]])
                setisSubmit(false);
            } catch (error) {
                return error
            }
        }
        getAthletes();
        /* Get date from URL */
        if (window.location.search) {
            
            let params = window.location.search.split('?').slice(1)
            let dateFromURL = {}
            params.forEach(x => {
                let temp = x.split('=')
                dateFromURL[temp[0]] = Number(temp[1])
            })
            setDate(`${dateFromURL.year}-${dateFromURL.month}-${dateFromURL.day}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (isSubmit) {
        return <Redirect to="/betterathletes/dashboard" />
    }

    function dateHandler(e){
        setDate(e.target.value);
    }

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
                            {/* Workout Name */}
                            <Col md={6} className="mx-4">
                                <Form.Control
                                    name="workout_name"
                                    onChange={(e) => ChangeHandler(e)}
                                    placeholder="Workout Name"
                                />
                            </Col>
                            {/* Select Date */}
                            <Col className="text-center" md='auto'>
                                <Form.Control
                                    value={date}
                                    onChange={dateHandler}
                                    inputPlaceholder="Workout Day"
                                    type='date'/>
                            </Col>
                            {/* Select Athlete to assign */}
                            <Col className="px-3">
                                {isAuth.coach ?
                                    <Select
                                        isMulti
                                        name="athletes"
                                        classNamePrefix="select no-shadow"
                                        value={athletes.name}
                                        placeholder="Athletes"
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        options={athletes}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.user_id}
                                        onChange={setSelectedOption}
                                    /> :
                                    <><Form.Control
                                        className="mx-4"
                                        disabled
                                        type="select"
                                        name="athletes"
                                        value={athletes[0].name}
                                    /></>}
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
                                                    type="number"
                                                    min={1}
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
                                                            variant="danger"> - </Button>}
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            key={index} block
                                                            onClick={() => AddInput(index, index2)}
                                                            variant="success"> + </Button>
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
                                                variant="main"><b>Add Set</b></Button>
                                        </Col>
                                        <Col md={3}>
                                            <Button block size='sm'
                                                onClick={() => AddSet(index, item)}
                                                variant="secondary"><b>Repeat Set</b></Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </div>
                        ))}
                    </Form>
                    <Row>
                        <Col md={12} className="d-flex flex-row-reverse">
                            <Button variant="warning" type="submit" onClick={submitWorkout} disabled={saving}>
                                    {saving ? "Saving..." : "Save Exercise" }
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
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

export default WorkOut
