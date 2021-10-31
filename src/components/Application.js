import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  // state object helper setter functions
  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days })); //using prev fixes useEffect setDays dependency error 

  const dailyAppointments = []; // will hold a list of appointments for given day

  const scheduleArray = dailyAppointments.map((appointment) => (
    <Appointment
      key={appointment.id}
      {...appointment}
    />
  ))

  useEffect(() => {
    const url = `/api/days`; // http://localhost:8001 prefix added as proxy in package.json
    axios.get(url).then((response) => {
      setDays([...response.data]);
    });
  }, []);

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
