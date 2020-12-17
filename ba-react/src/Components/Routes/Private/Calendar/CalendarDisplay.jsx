import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import moment from 'moment'
import DisplayMonth from './DisplayMonth'
import DisplayWeek from './DisplayWeek'
import { axiosInstance } from '../../../../func/axiosApi'
import { useParams } from 'react-router-dom'

function CalendarDisplay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',]
    const [retrieved, setRetrieved] = useState(false)
    const [workouts, setWorkouts] = useState({
        workouts: [],
        message: "Loading workouts..."
    })
    const [calendar, setCalendar] = useState({
        today: 0,
        prevWeek: [],
        currWeek: [],
        nextWeek: []
    })
    let { id } = useParams();
    useEffect(() => {
        function getCalendar() {
            let prev = []
            let curr = []
            let next = []
            for (let d = calendar.today - 7; d < calendar.today; d++) {
                prev.push(moment().day(d))
            }
            for (let d = calendar.today; d < calendar.today + 7; d++) {
                curr.push(moment().day(d))
            }
            for (let d = calendar.today + 7; d < calendar.today + 14; d++) {
                next.push(moment().day(d))
            }
            setCalendar({
                ...calendar,
                prevWeek: prev,
                currWeek: curr,
                nextWeek: next
            })
        }
        async function getWorkouts() {
            try {
                let temp = await axiosInstance(`getworkouts/${id}`)
                setWorkouts({
                    workouts: temp.data,
                })
            } catch (e) {
                console.log(e);
                setWorkouts({
                    workouts: [],
                    message: "Error getting workouts"
                })
            }
        }
        getCalendar()
        getWorkouts()
        setRetrieved(true)
    }, [calendar.today])

    function changeWeek(x) {
        setRetrieved(false)
        if (x === 'prev') {
            setCalendar({
                ...calendar,
                today: calendar.today - 7
            })
        } else {
            setCalendar({
                ...calendar,
                today: calendar.today + 7
            })
        }
    }

    return (
        <div className="bg-contrast cal-container mb-5">
            {retrieved ?
                <>
                    <h4 className="display-4 text-center py-4">Your Training Calendar</h4>
                    {!workouts && <div>{workouts.message}</div>}
                    <div className="btn btn-sm btn-block btn-main my-2" onClick={() => changeWeek('prev')}>
                        Previous Week
                    </div>
                    <div className="mx-3">
                        <DisplayMonth mth={calendar.prevWeek[2].format('MMMM')} days={days} />
                        <DisplayWeek workouts={workouts.workouts} week={calendar.prevWeek} relative="prev" />
                        {calendar.prevWeek[2].format("MM") !== calendar.currWeek[2].format("MM") &&
                            <DisplayMonth mth={calendar.currWeek[2].format('MMMM')} days={days} />}
                        <DisplayWeek workouts={workouts.workouts} week={calendar.currWeek} relative="curr" />
                        {calendar.currWeek[2].format("MM") !== calendar.nextWeek[2].format("MM") &&
                            <DisplayMonth mth={calendar.nextWeek[2].format('MMMM')} days={days} />}
                        <DisplayWeek workouts={workouts.workouts} week={calendar.nextWeek} relative="next" />
                    </div>
                    <div className="btn btn-sm btn-block btn-main my-2" onClick={() => changeWeek('next')}>
                        Next Week
                    </div>
                </> :
                <>
                    Loading...
                </>}
        </div>
    )
}

export default CalendarDisplay
