import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row, Form, Button, Container } from "react-bootstrap";
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

    //=========================AXIOS API TO BE UPDATED ================================\\
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
            
            for(let i = 0; i < exercise.length; i++){
                exercise[i].forEach((item2,index2)=>{
                    let obj = {}
                    let key = "exercise"
                    obj[key] = item2
                    exercise_arr.push(obj)
                    
                })
            }
            
            for(let i = 0; i < reps.length; i++){
                reps[i].forEach((item2,index2)=>{
                    let obj = {}
                    let key = "reps"
                    obj[key] = item2
                    reps_arr.push(obj)
                    
                })
            }
         
            for(let i = 0; i < target.length; i++){
                target[i].forEach((item2,index2)=>{
                    let obj = {}
                    let key = "target"
                    obj[key] = item2
                    target_arr.push(obj)
                    
                })
            }
            
            for(let i = 0; i < results.length; i++){
                results[i].forEach((item2,index2)=>{
                    let obj = {}
                    let key = "results"
                    obj[key] = item2
                    results_arr.push(obj)
                    
                })
            }
            
            for(let i = 0; i < rests.length; i++){
                rests[i].forEach((item2,index2)=>{
                    let obj = {}
                    let key = "rests"
                    obj[key] = item2
                    rests_arr.push(obj)
                    
                })
            }
    
            let new_arr1 = exercise_arr.map((item,index)=>Object.assign({},item,reps_arr[index]))
            let new_arr2 = new_arr1.map((item,index)=>Object.assign({},item,target_arr[index]))
            let new_arr3 = new_arr2.map((item,index)=>Object.assign({},item,results_arr[index]))
            let new_arr4 = new_arr3.map((item,index)=>Object.assign({},item,rests_arr[index]))
    
            let divisor = new_arr4.length/exercise.length;
            
            let final_arr = [];
            for (let i = 0; i < new_arr4.length; i += divisor ){
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

    
    useEffect(() => {
        getWorkout();
    }, [])
    return (
        <Container className="bg-contrast px-4">
            <Row className="">
                <Col md={12} className="mt-5">
                    <h4 className="title">{workout.workout_name}</h4>
                </Col>
                <Col md={12} className="my-3 py-3 outer_form">
                    <Form>
                        {/* ------------------- EACH SET ------------------- */}
                        {formState.sets.map((item,index)=>(
                        <div key={index}>
                            <Form.Group>
                            <Row className="no-gutters">
                                        <Col md={12} className="my-3">
                                            <h4>SET {index + 1}</h4>
                                        </Col>
                                
                                    <Col md={4} >
                                        <Form.Label className="font-weight-bold ">Exercises</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Reps</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Rest</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Target</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Input Results</Form.Label>
                                    </Col>
                            </Row>
                                {/* ------------------- EACH EXERCISE LINE ------------------- */}
                            {item.map((item2,index2)=>(
                                <Row key={index2} className="my-2">
                                    <Col md="auto" className="my-3 no-gutters d-flex align-items-center" >
                                                {index2.exercise == "" ?  "" : `${index2 + 1}:`}
                                    </Col>
                                    <Col md={4} className="my-3 no-gutters d-flex align-items-center">
                                        {item2.exercise}            
                                    </Col >
                                    <Col className="my-3 no-gutters d-flex align-items-center">
                                        {item2.reps}
                                    </Col >
                                    <Col className="my-3 no-gutters d-flex align-items-center">
                                        {item2.rests}
                                    </Col>
                                    <Col className="my-3 no-gutters d-flex align-items-center">
                                        {item2.target}
                                    </Col>
                                    <Col>
                                {/* ------------------- EDIT SWITCH ------------------- */}
                                    {resultState === undefined ? <>Loading...</> : resultState === true ?
                                        <Row className="my-3 no-gutters d-flex align-items-center" key={index2}>
                                        <Col>
                                            {item2.results}
                                        </Col>
                                        <Col>
                                            <Button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setResultState(false)}
                                            >Edit</Button>
                                        </Col>
                                    </Row> :
                                     
                                    <div key={index2} md={2} className="d-flex align-items-center my-2 d-flex align-items-center">
                                        <Form.Control
                                            id={`${index}-${index2}`}
                                            min={1}
                                            name={`${item2}-exerindex${index2}-${index}`}
                                            onChange={(e) => resultsHandler(e, index, index2)}
                                            placeholder="Results" />
                                    </div>}
                                    </Col>
                                </Row>
                            ))}
                            </Form.Group>
                        </div>
                        ))}
                        <Row >
                        <Col md={12} className="d-flex flex-row-reverse align-items-center my-3">
                            <Button
                                onClick={saveResults}
                            >Save Results</Button>
                        </Col>
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
                        <Col md={6} className="d-flex flex-row align-items-center my-2">
                            <h4>Enter Workout Comments</h4>
                        </Col>
                        <Col md={6} className="d-flex flex-row align-items-center my-2">

                        </Col>
                        <Col md={0} className="d-flex flex-row align-items-center my-2">
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
                            <Button
                                onClick={saveComments}
                            >Add a Comment</Button>
                        </Col>
                    </Row>


                        
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default ViewWorkOut





/* {workout.exercise === undefined ? <><div>Loading...</div></> : workout.exercise.map((item, index) => (
                            <Form.Group className="my-3 py-3 form_set" key={index}>
 
                                <Row>
                                    <Col md={4} >
                                        <Form.Label className="font-weight-bold">Exercises</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Reps</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Rest</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Target</Form.Label>
                                    </Col>
                                    <Col md={2} >
                                        <Form.Label className="font-weight-bold">Input Results</Form.Label>
                                    </Col>
                                </Row>

                                <Row className="my-2">
                                    <Col md={4}>
                                        {workout.exercise === undefined ? <><div>Loading...</div></> : workout.exercise[index].map((item2, index2) => (
                                            <div key={index2} md={4} className="d-flex align-items-center my-3">
                                                {item2}
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md={2}>
                                        {workout.reps === undefined ? <><div>Loading...</div></> : workout.reps[index].map((item2, index2) => (
                                            <div key={index2} md={2} className="d-flex align-items-center my-3">
                                                {item2}
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md={2}>
                                        {workout.rests === undefined ? <><div>Loading...</div></> : workout.rests[index].map((item2, index2) => (
                                            <Col key={index2} md={2} className="d-flex align-items-center my-3">
                                                {item2}
                                            </Col>
                                        ))}
                                    </Col >
                                    <Col md={2}>
                                        {workout.target === undefined ? <><div>Loading...</div></> : workout.target[index].map((item2, index2) => (
                                            <div key={index2} md={2} className="d-flex align-items-center my-3">
                                                {item2}
                                            </div>

                                        ))}
                                    </Col >
                                    <Col md={2}>
                                        {workout.results === undefined ? <>Loading...</> :

                                            resultState === true ?
                                                workout.results[index].map((item2, index2) => (
                                                    <Row className="my-3 no-gutters d-flex align-items-center" key={index2}>
                                                        <Col>
                                                            {item2}
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => setResultState(false)}
                                                            >Edit</Button>
                                                        </Col>
                                                    </Row>
                                                )) :
                                                workout.exercise[index].map((item2, index2) => (
                                                    <div key={index2} md={2} className="d-flex align-items-center my-2 d-flex align-items-center">
                                                        <Form.Control
                                                            id={`${index}-${index2}`}
                                                            min={1}
                                                            name={`${item2}-exerindex${index2}-${index}`}
                                                            onChange={(e) => resultsHandler(e, index, index2)}
                                                            placeholder="Results" />
                                                    </div>

                                                ))}
                                    </Col>
                                </Row>
                            </Form.Group>
                        ))} */





























