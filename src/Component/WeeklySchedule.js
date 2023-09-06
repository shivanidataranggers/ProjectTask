import React, { Component } from 'react';
import {
  addDays,
  format,
  isToday,
} from 'date-fns';

class WeekSchedule extends Component {
  constructor() {
    super();
    this.state = {
      currentDate: new Date(),
      schedule: this.generateWeekSchedule(new Date()),
    };
  }

  generateWeekSchedule(startDate) {
    const schedule = [];
    // setHours functions sets the time as hours minutes seconds and miliseconds
    const startTime = new Date().setHours(8, 0, 0, 0);
    const endTime = new Date().setHours(23, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        //For 7 days loop
      const currentDate = addDays(startDate, i);
      const slots = [];

      let currentTime = startTime;
      while (currentTime <= endTime) {
        const time = format(new Date(currentTime), 'h:mm a');// hours and minutes and am/pm
        slots.push({ time, checked: false });
        currentTime += 30 * 60000; // 30 minutes are converted into miliseconds by this formula
      }

      schedule.push({
        date: currentDate,
        slots,
      });
    }
    return schedule;
  }

  handleCheckboxChange = (dayIndex, slotIndex) => {
    // copy of and current schedule
    const updatedSchedule = [...this.state.schedule];
    // if checkbox is true set false otherwise if it is false set true
    updatedSchedule[dayIndex].slots[slotIndex].checked = !updatedSchedule[dayIndex].slots[slotIndex].checked;

    this.setState({ schedule: updatedSchedule });
  };

  navigateToPreviousWeek = () => {
    this.setState((prevState) => ({
      currentDate: addDays(prevState.currentDate, -7),
      schedule: this.generateWeekSchedule(addDays(prevState.currentDate, -7)),
    }));
  };

  navigateToNextWeek = () => {
    this.setState((prevState) => ({
      currentDate: addDays(prevState.currentDate, 7),
      schedule: this.generateWeekSchedule(addDays(prevState.currentDate, 7)),
    }));
  };

  render() {
    return (
        <div>
        <h1>Calendar</h1>
        <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 100px' }}>
            <button onClick={this.navigateToPreviousWeek}>Previous</button>
            <h2>{format(this.state.currentDate, 'EEEE, MMM d')}</h2>
            <button onClick={this.navigateToNextWeek}>Next</button>
        </div>

        <div>
            <label htmlFor="timeZoneSelect"> Time Zone:</label>
            <select
              id="timeZoneSelect">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Asia/Kolkata">Indian Standard Time (IST)</option>
            </select>
          </div>

  <table>
  <tbody>
    {this.state.schedule.map((day, dayIndex) => (
      <tr
        key={dayIndex}
        style={{
          height: '100px', 
        }}
      >
        <td
          className={isToday(day.date) ? 'today' : ''}
          style={{
            width: '110px',
            textAlign: 'center',
            backgroundColor: isToday(day.date) ? 'yellow' : 'transparent',
          }}
        >
          <div>{format(day.date, 'EEE')}</div>
          <div>{format(day.date, 'd ,MMM')}</div>
        </td>

        {day.slots.reduce((rows, slot, slotIndex) => {
            //first and second row should be upto 5:00pm
          const rowIndex = slotIndex < 8 ? 0 : slotIndex < 19 ? 1 : 2;
  
          //third row should start with 7:00pm
          if (rowIndex === 2) {
            if (slotIndex >= 22) {
              rows[rowIndex] = rows[rowIndex] || [];
              rows[rowIndex].push(
                <td
                  key={slotIndex}
                  className={`${isToday(day.date) ? 'today' : ''} slot-cell`}
                >
                  <div className="slot-content">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={slot.checked}
                      onChange={() => this.handleCheckboxChange(dayIndex, slotIndex)}
                      // calling handelcheckbox function to set checkbox true or false
                    />
                    <span className="time">{slot.time}</span>
                  </div>
                </td>
              );
            }
          } else {
            // For the first and second rows
            rows[rowIndex] = rows[rowIndex] || [];
            rows[rowIndex].push(
              <td
                key={slotIndex}
                className={`${isToday(day.date) ? 'today' : ''} slot-cell`}
              >
                <div className="slot-content">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={slot.checked}
                    onChange={() => this.handleCheckboxChange(dayIndex, slotIndex)}
                  />
                  <span className="time">{slot.time}</span>
                </div>
              </td>
            );
          }
          return rows;
        }, []).map((row, rowIndex) => (
          <tr key={rowIndex}>{row}</tr>
        ))}
      </tr>
    ))}
  </tbody>
</table>

</div>

      
    );
  }
}

export default WeekSchedule;
