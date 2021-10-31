
export function getAppointmentsForDay(state, day) {
  let selectedDayAppointments = [];
  const selectedDay = state.days.find(stateDayItem => stateDayItem.name === day);

  if (selectedDay) {
    selectedDayAppointments = selectedDay.appointments.map(appointment => state.appointments[appointment]);
  }
  return selectedDayAppointments;
}