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

  function updateSpots(id, appointments) {
    const spotsPerDay = 5;
    const daysPerWeek = 5;
    
    const modifiedDayIndex = Math.floor(id/daysPerWeek);
    const modifiedDay = state.days[modifiedDayIndex];
    
    // calculate spots from num of null interview appointments
    let spots = 0; 
    for (let i = 1; i <= modifiedDay.appointments.length; i++) {
      const appointment = appointments[(modifiedDayIndex * spotsPerDay) + i];
      if (!appointment.interview) {
        spots++;
      }
    }

    // A Days array to save back into state
    const updatedDays = Object.assign(
      [], 
      { ...state.days, [modifiedDayIndex]: { ...state.days[modifiedDayIndex], spots: spots } }
    )

    return updatedDays;
  }
  
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
            const updatedDays = updateSpots(id, appointments);
            
            setState(prev => ({ 
              ...prev, 
              appointments, 
              days: updatedDays  
            }));
          } else {
            return Promise.reject(); // when unexpected response status received from api trigger appointment error visual mode
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
            const updatedDays = updateSpots(id, appointments);

            setState(prev => ({ 
              ...prev, 
              appointments, 
              days: updatedDays 
            }));
          } else {
            return Promise.reject();
          }
        })
    );
  }
  
  return { state, setDay, bookInterview, cancelInterview };
}
