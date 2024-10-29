import React from 'react';
import styles from './Events.module.scss';

const Events = ({ events, onEventClick, onDeleteEvent }) => {
    const formatTimeAndDate = (date) => {
        if (!date) return ''; // Return empty if date is null
        const eventDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };

        // Check if the event is today
        if (eventDate.toDateString() === today.toDateString()) {
            return eventDate.toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        // Check if the event is tomorrow
        else if (eventDate.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow, ${eventDate.toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true })}`;
        }

        return eventDate.toLocaleString('en-US', options);
    };

    const groupEventsByDate = (events) => {
        const groupedEvents = {
            today: [],
            upcoming: [],
            noDeadline: []
        };

        events.forEach(event => {
            if (event.start_time) {
                const eventDate = new Date(event.start_time);
                if (eventDate.toDateString() === new Date().toDateString()) {
                    groupedEvents.today.push(event);
                } else {
                    groupedEvents.upcoming.push(event);
                }
            } else {
                groupedEvents.noDeadline.push(event);
            }
        });

        // Sort events by start_time
        groupedEvents.today.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        groupedEvents.upcoming.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        return groupedEvents;
    };

    const groupedEvents = groupEventsByDate(events);

    return (
        <div className={styles.eventsContainer}>
            {groupedEvents.today.length > 0 && (
                <div className={styles.eventsgroup}>
                    <small className='smalltitle'>Today</small>
                    {groupedEvents.today.map(event => (
                        <div key={event.id} className={styles.event} onClick={() => onEventClick(event)}>
                            <p>{event.title}</p>
                            <p className={styles.time}>{formatTimeAndDate(event.start_time)}</p>
                        </div>
                    ))}
                </div>
            )}

            {groupedEvents.upcoming.length > 0 && (
                <div className={styles.eventsgroup}>
                    <small className='smalltitle'>Upcoming Events</small>
                    {groupedEvents.upcoming.map(event => (
                        <div key={event.id} className={styles.event} onClick={() => onEventClick(event)}>
                            <p>{event.title}</p>
                            <p className={styles.time}>{formatTimeAndDate(event.start_time)}</p>
                        </div>
                    ))}
                </div>
            )}

            {groupedEvents.noDeadline.length > 0 && (
                <div className={styles.eventsgroup}>
                    <small className='smalltitle'>No Deadline 🌴</small>
                    {groupedEvents.noDeadline.map(event => (
                        <div key={event.id} className={styles.event} onClick={() => onEventClick(event)}>
                            <p>{event.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
