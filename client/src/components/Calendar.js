import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';

const Calendar = ({ events }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="calendar">
      <h2>{format(today, 'MMMM yyyy')}</h2>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {daysInMonth.map(day => {
          const dayEvents = events.filter(event => 
            isSameDay(new Date(event.date), day)
          );
          
          return (
            <div 
              key={day.toString()} 
              className={`calendar-day ${isToday(day) ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
            >
              <div className="day-number">{format(day, 'd')}</div>
              {dayEvents.length > 0 && (
                <div className="day-events-indicator">
                  {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;