import React, { useState, useEffect, Fragment } from 'react'
import { Col, Row, Form, Button} from "react-bootstrap";
import axios from "axios";

function ViewWorkOut() {
    const [workout, setWorkout] = useState("")
    const [results, setResults] = useState({})
    const [exerciseList, setExerciseList] = useState([])
    const [axiosErr, setAxiosErr] = useState(false)
    const [indexSet, setIndexSet] = useState(0)
    const [comments, setComments] = useState({})  
    const [exerciseSelection, setExerciseSelection] = useState([])

    function resultsHandler(e, i, ii){
        let {name, value, id} = e.target;
        let obj = {...results, [name]: value}
        setResults(obj)
    }

    function getExerciseList(){
        let arr = []
            
         workout.exercise.forEach((item,index)=>{
            item.forEach((item2,index2)=>{
                arr.push(item2+": Exer-"+index2+"-"+index)
            })
        })
        setExerciseList(arr)
    }

    function commentHandler(e){
        let { name, value} = e.target
        let obj = {...comments, [name]: value}
        setComments(obj)
    }
    console.log(comments)

  //=========================AXIOS API TO BE UPDATED ================================\\
    async function saveComments(){
            
        try{
            let max_length_counter = 0;
            let comment = {...comments}
            let arr = []
            let django_comments = {
                comments: [],
            }

            workout.exercise.forEach((item,index)=>{
                arr.push([])
            })
            
            let str = comment.Exercise;
            console.log(str)
            let index_of_set = Number(str.substr(str.lastIndexOf('-')+1))
            let str_arr = str.split("-",2)
            let index_of_exe = Number(str_arr.pop())
            console.log(index_of_exe)
            // console.log(index_of_exe,index_of_set)
            // arr[index].push(comment.comment)
            
            arr[index_of_set].push(comment.comment)

            // arr.forEach((item,index)=>{
                
            //     if (item.length == index_of_exe) {
            //         arr[index_of_set].push(comment.comment)
            //         console.log(item.length)
            //     } 
            //     else if (item.length < index_of_exe){
                    
            //         arr[index_of_set].push("")
            //         console.log(item.length)
            //     } 
            //     else if (item.length > index_of_exe){
            //         arr[index_of_set].push("")
            //         console.log(item.length)
            //     }
            // })

            console.log(arr)
            arr.forEach((item,index)=>{
                if (item.length > max_length_counter) {
                    max_length_counter = item.length
                    
                }
            })
            
            arr.forEach((item,index)=>{
                if (item.length < max_length_counter){
                    console.log(item.length)
                    arr[index].push("")
                }
            })
            console.log(arr)
            console.log(max_length_counter)

            django_comments.comments = arr
            console.log(django_comments)

            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json"
                }
            }
            let data = await axios.post(`http://localhost:8000/api/singleworkout/comment/${3}`,django_comments, headToken)
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
                console.log(arr)
                
                workout.exercise.forEach((item,index)=>{
                    arr.push([])
                })


                for (const property in obj){
                    // property = property.charAt(property.length-1)
                    let key = property.charAt(property.length-1);
                    console.log(property)
                    arr[Number(key)].push(obj[property])
                }
                console.log(arr)

                arr.forEach((item,index)=>{
                    if (item.length > max_length_counter) {
                        max_length_counter = item.length
                        console.log(max_length_counter)
                    }
                })
                
                arr.forEach((item,index)=>{
                    if (item.length< max_length_counter){
                        arr[index].push("")
                    }
                })
                django_results.results = arr
                console.log(django_results)
  
                let headToken = {
                    headers: {
                        'Authorization': "JWT " + localStorage.getItem('token'),
                        'Content-Type': "application/json",
                        'accept': "application/json"
                    }
                }

                let data = await axios.post(`http://localhost:8000/api/singleworkout/${3}`,django_results, headToken)

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
            }
            let data = await axios.get(`http://localhost:8000/api/singleworkout/3`, headToken)
            setWorkout(data.data.result)
            
        }
        catch (e) {
            console.log(e)
            setAxiosErr(true)
        }
    }

   


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
                                  { workout.exercise === undefined ? <><div>Loading...</div></> : workout.exercise[index].map((item2, index2) => (
                                    <>
                                    
                                        <Col key={index2} md={4} className="d-flex align-items-center my-2">
                                            <div >
                                                {item2}
                                            </div>  
                                        </Col>
                                    </>
                                        ))}

                                    { workout.reps === undefined ? <><div>Loading...</div></> : workout.reps[index].map((item2, index2) => (
                                    <>
                                    
                                        <Col key={index2} md={2} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2}
                                            </div>  
                                        </Col>
                                    </>
                                        ))}
                                    {workout.rests === undefined ? <><div>Loading...</div></> : workout.rests[index].map((item2, index2) => (
                                    <>
                                        <Col key={index2} md={2} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2}
                                            </div>  
                                        </Col>
                                    </>
                                        ))}

                                    {workout.target === undefined ? <><div>Loading...</div></> : workout.target[index].map((item2, index2) => (
                                    <>
                                    
                                        <Col key={index2} md={2} className="d-flex align-items-center my-2">
                                            <div>
                                                {item2}
                                            </div>  
                                        </Col>
                                    </>
                                        ))}
                                        {workout.exercise === undefined ? <><div>Loading...</div></> : workout.exercise[index].map((item2, index2) => (
                                    <>
                                    
                                        <Col key={index2} md={2} className="d-flex align-items-center my-2">
                                            <Form.Control
                                            id={index}
                                            name={`${item2}-exerindex${index2}-${index}`}
                                            onChange={(e) => resultsHandler(e,index, index2)}
                                            placeholder="Results"/>
                                        </Col>
                                    </>
                                        ))}   
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
                        <Col md={6} className="d-flex flex-row align-items-center my-2">
                            <h4>Enter Workout Comments</h4>
                        </Col>
                        <Col md={6} className="d-flex flex-row align-items-center my-2">
                            <Form>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Exercise - SET</Form.Label>
                                    <Form.Control 
                                    as="select" 
                                    defaultValue="Choose..."
                                    // onChange={(e)=>{
                                    //     commentHandler(e);
                                    //     selectionHandler(e)
                                    // }} 
                                    onChange={(e)=>commentHandler(e)}
                                    onClick={getExerciseList}
                                    name="Exercise"
                                    >
                                    {exerciseList === undefined ? <>Loading...</> : exerciseList.map((item,index)=>(
                                            <option
                                            key={index}
                                            name={index}
                                            value={item}                                   
                                            >{item}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
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
                            >Submit Comment</Button>
                        </Col>
                    </Row>
                </Col>


            </Row>
        </Fragment>
    )
}

export default ViewWorkOut


/* <Col md={2} className="d-flex align-items-center my-2">
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
                                        </Col> */

                                        // <option
                                        //     key={index}
                                        //     name={index}
                                        //     value={item}                                   
                                        //     >Exercise {index+1}</option>    // // console.log(django_wrapper)
    // function selectionHandler(e){
    //     let {name, value} = e.target;
    //     let obj = {...results, value}
    //     // setResults(obj)


     
    //     // setExerciseSelection(workout1[Number(value)-1].data)
    // }
    // console.log(results)
    // function commentHandler(e){
    //     let {name, value} = e.target;
    //     setNewComments({...newComments, [name]: value})
    // }

    // console.log(indexSet)
    // console.log(exerciseSelection)
    // console.log(newComments)