import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
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
      axios
        .put(dbAppointmentUpdateURL, { interview })
        .then((response) => {
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
      axios
        .delete(dbAppointmentDeleteURL)
        .then((response) => {
          if (response.status === 204) {
            const appointment = {
              ...state.appointments[id],
              interview: null
            }
            const appointments = {
              ...state.appointments,
              [id]: appointment
            }
            setState(prev => ({ ...prev, appointments }));
          }
        })
    );
  }
  
  return { state, setDay, bookInterview, cancelInterview };
}
