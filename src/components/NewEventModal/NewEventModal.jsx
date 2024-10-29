import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { StatusIcon, CalendarIcon, AnglesRightIcon, TrashIcon } from '@/assets/icons';
import { gsap } from 'gsap';
import styles from './NewEventModal.module.scss';

const NewEventModal = ({ onClose, fetchEvents, userId, eventToEdit }) => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartTime, setEventStartTime] = useState('');
    const [eventEndTime, setEventEndTime] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        if (eventToEdit) {
            setEventTitle(eventToEdit.title);
            setEventDescription(eventToEdit.description);
            setEventStartTime(eventToEdit.start_time ? new Date(eventToEdit.start_time).toISOString().slice(0, 16) : '');
            setEventEndTime(eventToEdit.end_time ? new Date(eventToEdit.end_time).toISOString().slice(0, 16) : '');
        }
    }, [eventToEdit]);

    useEffect(() => {
        // Animation d'ouverture
        gsap.fromTo(modalRef.current,
            { opacity: 0, x: '100%' }, // Position initiale hors écran à droite
            { opacity: 1, x: '0%', duration: 0.3, ease: "power2.out" }
        );
    }, []);

    const handleClose = () => {
        gsap.to(modalRef.current,
            { opacity: 0, x: '100%', duration: 0.3, ease: "power2.in", onComplete: onClose }
        );
    };

    const handleSaveEvent = async (event) => {
        event.preventDefault();
        setError('');

        if (!userId) {
            setError('User is not authenticated.');
            return;
        }

        const startTime = eventStartTime || null; // Convert empty string to null
        const endTime = eventEndTime || null; // Convert empty string to null

        // Validate end time is not before start time
        if (startTime && endTime && new Date(endTime) < new Date(startTime)) {
            setError('End time cannot be earlier than start time.');
            return;
        }

        try {
            if (eventToEdit) {
                // Update event
                const { error } = await supabase
                    .from('events')
                    .update({
                        title: eventTitle,
                        description: eventDescription,
                        start_time: startTime,
                        end_time: endTime
                    })
                    .eq('id', eventToEdit.id);

                if (error) {
                    setError(error.message);
                } else {
                    handleClose();
                    fetchEvents(userId);
                }
            } else {
                // Create new event
                const { error } = await supabase
                    .from('events')
                    .insert([{
                        title: eventTitle,
                        description: eventDescription,
                        start_time: startTime,
                        end_time: endTime,
                        user_id: userId
                    }]);
                if (error) {
                    setError(error.message);
                } else {
                    setEventTitle('');
                    setEventDescription('');
                    setEventStartTime('');
                    setEventEndTime('');
                    handleClose();
                    fetchEvents(userId);
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteEvent = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventToEdit.id);
            if (error) {
                setError(error.message);
            }
            else {
                handleClose();
                fetchEvents(userId);
            }
        }
    }

    return (
        <div className={styles.modal} onClick={handleClose}>
            <div className={styles.modalContent} ref={modalRef} onClick={(e) => e.stopPropagation()} >
                <button onClick={handleClose} className="tertiary tertiary_square"><AnglesRightIcon /></button>
                <br />
                <form onSubmit={handleSaveEvent}>
                    <input
                        className={styles.eventTitleInput}
                        type="text"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder='Untitled event'
                        required
                    />
                    <div className={styles.taskProperties}>
                        <div className={styles.eventPropertyInput}>
                            <label htmlFor='Start time'>
                                <CalendarIcon />
                                Start time
                            </label>
                            <input
                                type="datetime-local"
                                value={eventStartTime}
                                onChange={(e) => {
                                    setEventStartTime(e.target.value);
                                    // Reset end time if start time is changed
                                    if (eventEndTime && new Date(eventEndTime) < new Date(e.target.value)) {
                                        setEventEndTime('');
                                    }
                                }}
                                // required
                            />
                        </div>

                        <div className={styles.eventPropertyInput}>
                            <label htmlFor='Deadline'>
                                <CalendarIcon />
                                End time
                            </label>
                            <input
                                type="datetime-local"
                                value={eventEndTime}
                                onChange={(e) => setEventEndTime(e.target.value)}
                                min={eventStartTime} // Disable past dates
                                // required
                            />
                        </div>
                    </div>
                    <textarea
                        className={styles.eventTextarea}
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder='Add a description'
                    />

                    <div className={styles.actions}>
                        {eventToEdit && (
                            <button
                                type="button"
                                className='tertiary tertiary_square'
                                onClick={handleDeleteEvent}
                                title='Delete event'
                            >
                                <TrashIcon />
                            </button>
                        )}
                        <button type="submit">🪄  Save changes</button>
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default NewEventModal;
