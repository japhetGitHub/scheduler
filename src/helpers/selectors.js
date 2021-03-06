export function getAppointmentsForDay(state, day) {
  let selectedDayAppointments = [];
  const selectedDay = state.days.find(stateDayItem => stateDayItem.name === day);

  if (selectedDay) {
    selectedDayAppointments = selectedDay.appointments.map(appointment => state.appointments[appointment]);
  }
  return selectedDayAppointments;
}

export function getInterviewersForDay(state, day) {
  let selectedDayInterviewers = [];
  const selectedDay = state.days.find(stateDayItem => stateDayItem.name === day);

  if (selectedDay) {
    selectedDayInterviewers = selectedDay.interviewers.map(interviewer => state.interviewers[interviewer]);
  }
  return selectedDayInterviewers;
}

export function getInterview(state, interview) {
  if (interview && interview.interviewer) {
    return {
      "student": interview.student,
      "interviewer": {
        "id": state.interviewers[interview.interviewer].id,
        "name": state.interviewers[interview.interviewer].name,
        "avatar": state.interviewers[interview.interviewer].avatar
      }
    };
  } else {
    return null;
  }
}