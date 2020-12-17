import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Modal, Button, Form} from 'react-bootstrap'
import CoachDashItems from './CoachDashItems'
import { NavLink } from 'react-router-dom'
import { axiosInstance } from '../../../../func/axiosApi'

function CoachDash() {
    const title = ["Pending Your Review", "Today's Agenda", "Workouts Pending Athlete's Results", 'Recently Completed']
    const keys = ['pending_coach_review', 'today', 'pending_athlete', 'recent_completed']
    const empty = ["You're all caught up!", "Nothing on today!", "Your athletes are on the ball!", "No workout records"]
    const [dashData, setDashData] = useState({})
    const [axiosErr, setAxiosErr] = useState(false)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [note, setNote] = useState({
        tracked_id: null,
        note: "",
    })

    useEffect(() => {
        retrieve()
    }, [])

    async function retrieve() {
        try {
            let headToken = {
                headers: {
                    'Authorization': "JWT " + localStorage.getItem('token'),
                    'Content-Type': "application/json",
                    'accept': "application/json"
                }
            }
            let data = await axios.get(`http://localhost:8000/api/dashboard`, headToken)
            setDashData(data.data)
        }
        catch (e) {
            setAxiosErr(true)
        }
    }

    function handleShow(e){
        setNote({
            tracked_id: dashData.tracked_athletes[e.target.id].id,
            note: dashData.tracked_athletes[e.target.id].notes });
        setShow(true);
    }

    function changeHandler(e) {
        setNote({...note,note:e.target.value});
    }

    async function submit(e){
        e.preventDefault();
        try {
            setShow(false);
            let resp = await axiosInstance.put(`track/${note.tracked_id}`,note.note);
            if(resp){
                retrieve();
            }
        } catch (error) {
            alert("Error has occured");
        }
    }
    return (
        <>
            {axiosErr ?
                <Col>
                    <div className="border border-danger m-3">
                        <div className="h6 mt-2 mx-2 text-center">
                            Error fetching data
                    </div>
                    </div>
                </Col> :
                <>
                <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Notes</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control onChange={changeHandler} name="notes" type="text" placeholder="Notes" value={note.note}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={submit}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>          
                    <Col xs={12} md={12}>
                            <div className="border m-3 dash-card">
                                <div className="h4 py-3 px-2 text-center border">
                                    Tracked Athletes
                                </div>
                                <Row xs={1} className="px-4 pt-3">
                                    <Col>
                                        <Row>
                                            <Col className="col-3"><h6 className="title display-7"><b>Athlete Name</b></h6></Col>
                                            <Col className="col-2"><h6 className="title display-7"><b>Age</b></h6></Col>
                                            <Col className="col-2"><h6 className="title display-7"><b>Gender</b></h6></Col>
                                            <Col className="col-3"><h6 className="title display-7"><b>Notes</b></h6></Col>
                                            <Col></Col>
                                        </Row>
                                    </Col>
                                    {Object.keys(dashData).length ?
                                    <>
                                        <Col>
                                            <Row xs={1}>
                                                {dashData.tracked_athletes.map((el,index) => (
                                                    <Col key={el.athlete_id}>
                                                        <Row className="text-left">
                                                            <Col className="px-0 col-3">
                                                                <NavLink className="h6 nav-link" to={`profile/${el.athlete_id}`}>
                                                                    {el.athlete_name}
                                                                </NavLink>
                                                            </Col>
                                                            <Col className="px-0 col-2">
                                                                <h6 className="pt-2">{el.athlete_age} y.o.</h6>
                                                            </Col>
                                                            <Col className="px-0 col-2">
                                                                <h6 className="pt-2">{el.athlete_gender==="F"?"Female":el.athlete_gender==="M"?"Male":"Prefer not to Say"}</h6>
                                                            </Col>
                                                            <Col className="px-0 col-3">
                                                                <h6 className="pt-2">{el.notes}</h6>
                                                            </Col>
                                                            <Col md='auto' className="px-3 text-center">
                                                                <div id={index} onClick={handleShow} className="btn btn-main btn-sm mt-1">Add/Edit Notes</div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </> : <>Loading....</>}
                                </Row>
                            </div>
                    </Col>
                    {keys.map((card, index) => (
                        <Col xs={12} md={6} key={index}>
                            <div className={`border m-3 dash-card ${(card==="today" || card==="pending_athlete") && 'dash-card-scroll'}`}>
                                <div className="h4 py-3 px-2 text-center border">
                                    {title[index]}
                                </div>
                                <Row xs={1} className="px-4 pt-3">
                                    {Object.keys(dashData).length ?
                                        <CoachDashItems data={dashData[card]} empty={empty[index]} key={card}/> :
                                        <>Loading....</>
                                    }
                                </Row>
                            </div>
                        </Col>
                    ))}
                </>
            }
        </>
    )
}

export default CoachDash
