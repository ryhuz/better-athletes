import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row, Form, Button} from "react-bootstrap";
import axios from "axios";

function ViewWorkOut() {
    const [workout, setWorkout] = useState({results:[]})
    const [results, setResults] = useState({})
    const [axiosErr, setAxiosErr] = useState(false)
    const [comments, setComments] = useState({})  
    const [showComments, setshowComments] = useState()
    const [resultState, setResultState] = useState(false)

    // to updated ID to use params once route is done
    // let { id } = useParams()
    //params are WorkoutResults ID
    let {id} = useParams()
    console.log(id)
    


    function resultsHandler(e, i, ii){
        let {name, value, id} = e.target;
        let obj = {...results, [name]: value}
        setResults(obj)
    }

    function commentHandler(e){
        let { name, value} = e.target
        let obj = {...comments, [name]: value}
        setComments(obj)
    }
    
  //=========================AXIOS API TO BE UPDATED ================================\\
    async function saveComments(){
            
        try{
            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json"
                }
            }// workoutResult ID
            let data = await axios.post(`http://localhost:8000/api/singleworkout/comment/${id}`,comments, headToken)
            getWorkout();
        } catch (error){
            console.log(error)
            setAxiosErr(true)
        }

    }
    

    async function saveResults(){

        try {        
                let max_length_counter = 0;
                let obj = {...results}
                let arr = []
                let django_results = {
                    results: [],
                }
             
                
                workout.exercise.forEach((item,index)=>{
                    arr.push([])
                })


                for (const property in obj){
                    let key = property.charAt(property.length-1);
                    arr[Number(key)].push(obj[property])
                }
               

                arr.forEach((item,index)=>{
                    if (item.length > max_length_counter) {
                        max_length_counter = item.length
               
                    }
                })
                
                arr.forEach((item,index)=>{
                    if (item.length< max_length_counter){
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
                let data = await axios.post(`http://localhost:8000/api/singleworkout/${id}`,django_results, headToken)
                
                getWorkout();
                setResultState(true);

            } catch(error) {
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
            resultSetting(); 

        }
        catch (e) {
            console.log(e)
            setAxiosErr(true)
        }
    }

   function resultSetting(){
    
       if (workout.results.length === 0){
            setResultState(false)
       } else {
            setResultState(true)
       }
   }
   
   

    
   
//    {(workout.length && workout.lengthaa )? <></> : result.length ? workout.length2 ? <></> : result.length2}
   
   
   useEffect(() => {
    
        getWorkout();  
        
    },[])

    return (
        <Fragment>
            <Row className="">
                <Col md={12} className="border pt-3">
                    <h4>SETS</h4>
                </Col>
                <Col md={12} className="my-3 py-3 outer_form">
                    <Form>
                        <Row className="no-gutters">
                            <Col md={10}>
                                <h5>{ workout.workout_name === undefined ? <><div>Loading...</div></> : workout.workout_name}</h5>
                            </Col>
                            <Col md={2} className="d-flex justify-content-center">
                            </Col>
                        </Row>
                         { workout.exercise === undefined ? <><div>Loading...</div></> :  workout.exercise.map((item, index) => (
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

                                <Row  className="my-2">
                                    <Col md={4}>
                                  { workout.exercise === undefined ? <><div>Loading...</div></> : workout.exercise[index].map((item2, index2) => (
                                        <div key={index2} md={4} className="d-flex align-items-center my-3">
                                            {item2}
                                        </div>
                                        ))}
                                    </Col>
                                    <Col md={2}>
                                    { workout.reps === undefined ? <><div>Loading...</div></> : workout.reps[index].map((item2, index2) => (
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
                                            workout.results[index].map((item2,index2)=>(
                                                <Row className="my-3 no-gutters d-flex align-items-center">
                                                    <Col>
                                                        {item2}
                                                    </Col>
                                                    <Col>
                                                        <Button 
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={()=>setResultState(false)}
                                                        >Edit</Button>
                                                    </Col>
                                                </Row>
                                            )) : 
                                            workout.exercise[index].map((item2, index2) => (                                  
                                            <div key={index2} md={2} className="d-flex align-items-center my-2 d-flex align-items-center">
                                                <Form.Control
                                                id={index}
                                                min={1}
                                                name={`${item2}-exerindex${index2}-${index}`}
                                                onChange={(e) => resultsHandler(e,index, index2)}
                                                placeholder="Results"/>
                                            </div>
                            
                                        ))} 
                                        </Col>
                                </Row>
                            </Form.Group>
                        ))} 
                    </Form>

                    <Row >
                        <Col md={12} className="d-flex flex-row-reverse align-items-center my-3">
                            <Button
                            onClick={saveResults}
                            >Save Results</Button>
                        </Col>
                        <Col md={12} className="d-flex flex-row align-items-center my-3">
                            <div>
                            {showComments == undefined ? <>Loading ... </> :showComments.map((item,index)=>(
                                <div className="my-3">
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
                            onChange={(e)=>commentHandler(e)}
                            />
                        </Col>
                        <Col md={12} className="my-2">
                            <Button
                            onClick={saveComments}
                            >Add a Comment</Button>
                        </Col>
                    </Row>
                </Col>


            </Row>
        </Fragment>
    )
}

export default ViewWorkOut



































