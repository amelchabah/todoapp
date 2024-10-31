import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { StatusIcon, CalendarIcon, AnglesRightIcon, TrashIcon } from '@/assets/icons';
import { gsap } from 'gsap';
// import styles from './NewEventModal.module.scss';

import styles from '../../styles/modal.module.scss';

const NewEventModal = ({ onClose, fetchEvents, userId, eventToEdit }) => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartTime, setEventStartTime] = useState('');
    const [eventEndTime, setEventEndTime] = useState('');
    const [error, setError] = useState('');
    const [formModified, setFormModified] = useState(false);
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
        gsap.fromTo(modalRef.current,
            { opacity: 0, x: '100%' },
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

        const startTime = eventStartTime || null;
        const endTime = eventEndTime || null;

        // Validate end time is not before start time
        if (startTime && endTime && new Date(endTime) < new Date(startTime)) {
            setError('End time cannot be earlier than start time.');
            return;
        }

        try {
            if (eventToEdit) {
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
            setFormModified(false);
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

    const handleFieldChange = (setter) => (e) => {
        setter(e.target.value);
        setFormModified(true);
    };

    return (
        <div className={styles.modal} onClick={handleClose}>
            <div className={styles.modalContent} ref={modalRef} onClick={(e) => e.stopPropagation()} >
                <button
                    onClick={handleClose}
                    className={formModified ? 'tertiary tertiary_square disabled' : 'tertiary tertiary_square'}
                    disabled={formModified} 
                    title={formModified ? 'Please save changes before closing' : ''}
                >
                    <AnglesRightIcon />
                </button>
                <br />
                <form onSubmit={handleSaveEvent}>
                    <input
                        className={styles.objectTitleInput}
                        type="text"
                        value={eventTitle}
                        onChange={handleFieldChange(setEventTitle)}
                        placeholder='Untitled event'
                        required
                    />
                    <div className={styles.objectProperties}>
                        <div className={styles.objectPropertyInput}>
                            <label htmlFor='Start time'>
                                <CalendarIcon />
                                Start time
                            </label>
                            <input
                                id='Start time'
                                type="datetime-local"
                                value={eventStartTime}
                                onChange={(e) => {
                                    handleFieldChange(setEventStartTime)(e);
                                    if (eventEndTime && new Date(eventEndTime) < new Date(e.target.value)) {
                                        setEventEndTime('');
                                    }
                                }}
                            />
                        </div>

                        <div className={styles.objectPropertyInput}>
                            <label htmlFor='Deadline'>
                                <CalendarIcon />
                                End time
                            </label>
                            <input
                                id='Deadline'
                                type="datetime-local"
                                value={eventEndTime}
                                onChange={handleFieldChange(setEventEndTime)}
                                min={eventStartTime}
                            />
                        </div>
                    </div>
                    <textarea
                        className={styles.objectTextarea}
                        value={eventDescription}
                        onChange={handleFieldChange(setEventDescription)}
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
