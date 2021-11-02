import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {
      "1": {
        id: 1,
        time: "12pm",
        interview: null
      }
    },
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });// state object helper setter function

  useEffect(() => {
    // http://localhost:8001 prefix added as proxy in package.json
    const getDaysURL = '/api/days';
    const getAppointmentsURL = '/api/appointments';
    const getInterviewersURL = '/api/interviewers';

    Promise.all([
      axios.get(getDaysURL),
      axios.get(getAppointmentsURL),
      axios.get(getInterviewersURL)
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    });

  }, []);

  function bookInterview(id, interview) {
    const dbAppointmentUpdateURL = `/api/appointments/${id}`;
    return (
      axios.put(dbAppointmentUpdateURL, { interview }).then((response) => {
        if (response.status === 204) {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          setState(prev => ({ ...prev, appointments }));
        }
      })
    );

  }

  function cancelInterview(id) {
    const dbAppointmentDeleteURL = `/api/appointments/${id}`;
    return (
      axios.delete(dbAppointmentDeleteURL).then((response) => {
        if (response.status === 204) {
          const appointment = {
            ...state.appointments[id],
            interview: null
          }
          const appointments = {
            ...state.appointments,
            [id]: appointment
          }
          setState(prev => ({...prev, appointments}));
        }
      })
    );

  }

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
