import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const setDay = day => setState({ ...state, day });// state object helper setter function

  useEffect(() => {
    // http://localhost:8001 prefix added as proxy in package.json
    const getDaysURL = '/api/days';
    const getAppointmentsURL = '/api/appointments';
    // const getInterviewersURL = '/api/interviewers';

    Promise.all([
      axios.get(getDaysURL),
      axios.get(getAppointmentsURL)
      // axios.get(getInterviewersURL)
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}))
    });
    
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const scheduleArray = dailyAppointments.map((appointment) => (
    <Appointment
      key={appointment.id}
      {...appointment}
    />
  ));

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
        {scheduleArray}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
