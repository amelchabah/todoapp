// src/components/NewTaskModal/NewTaskModal.jsx

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { StatusIcon, CalendarIcon, AnglesRightIcon } from '@/assets/icons';
import { gsap } from 'gsap';
import styles from './NewTaskModal.module.scss';

const NewTaskModal = ({ onClose, fetchTasks, userId, taskToEdit }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskStatus, setTaskStatus] = useState('To start');
    const [taskDeadline, setTaskDeadline] = useState('');
    const [taskDescription, setTaskDescription] = useState(''); // Ajouter état pour description
    const [error, setError] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        if (taskToEdit) {
            setTaskTitle(taskToEdit.title);
            setTaskStatus(taskToEdit.status);
            setTaskDeadline(taskToEdit.deadline || '');
            setTaskDescription(taskToEdit.description || ''); // Charger la description si elle existe
        }
    }, [taskToEdit]);

    useEffect(() => {
        // Animation d'ouverture
        gsap.fromTo(modalRef.current,
            { opacity: 0, x: '100%' }, // Position initiale hors écran à droite
            { opacity: 1, x: '0%', duration: 0.3, ease: "power2.out" }
        );
    }, []);

    const handleClose = () => {
        // Animation de fermeture
        gsap.to(modalRef.current,
            { opacity: 0, x: '100%', duration: 0.3, ease: "power2.in", onComplete: onClose }
        );
    };

    const handleSaveTask = async (event) => {
        event.preventDefault();
        setError('');

        if (!userId) {
            setError('User is not authenticated.');
            return;
        }

        try {
            const deadline = taskDeadline || null; // Convert empty string to null

            if (taskToEdit) {
                // Mise à jour de la tâche
                const { error } = await supabase
                    .from('tasks')
                    .update({
                        title: taskTitle, status: taskStatus, deadline, description: taskDescription // Inclure la description
                    })
                    .eq('id', taskToEdit.id);

                if (error) {
                    setError(error.message);
                } else {
                    handleClose();
                    fetchTasks(userId);
                }
            } else {
                // Création de la tâche
                const { error } = await supabase
                    .from('tasks')
                    .insert([{
                        title: taskTitle, status: taskStatus, deadline,
                        description: taskDescription, // Inclure la description
                        user_id: userId
                    }]);

                if (error) {
                    setError(error.message);
                } else {
                    setTaskTitle('');
                    setTaskStatus('To start');
                    setTaskDeadline('');
                    setTaskDescription(''); // Réinitialiser la description
                    handleClose();
                    fetchTasks(userId);
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusSelectClass = (status) => {
        switch (status) {
            case 'To start':
                return styles.toStart;
            case 'In progress':
                return styles.inProgress;
            case 'Done':
                return styles.done;
            default:
                return '';
        }
    };

    return (
        <div className={styles.modal} onClick={handleClose}>
            <div
                className={styles.modalContent}
                ref={modalRef}
                onClick={(e) => e.stopPropagation()} // Prevent click on modal content from closing modal
            >
                <button onClick={handleClose} className="tertiary tertiary_square"><AnglesRightIcon /></button>
                <br />
                <form onSubmit={handleSaveTask}>
                    <input
                        className={styles.taskTitleInput}
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder='Untitled task'
                        required
                    />

                    <div className={styles.taskProperties}>
                        <div className={styles.taskPropertyInput}>
                            <label htmlFor="Status">
                                <StatusIcon />
                                Status
                            </label>
                            <select
                                value={taskStatus}
                                onChange={(e) => setTaskStatus(e.target.value)}
                                className={getStatusSelectClass(taskStatus)} // Ajouter la classe en fonction du statut
                                required
                            >
                                <option value="To start">📅 to start</option>
                                <option value="In progress">🕒 in progress</option>
                                <option value="Done">✅ done</option>
                            </select>
                        </div>

                        <div className={styles.taskPropertyInput}>
                            <label htmlFor='Deadline'>
                                <CalendarIcon />
                                Deadline
                            </label>
                            <input
                                type="date"
                                value={taskDeadline}
                                onChange={(e) => setTaskDeadline(e.target.value)}
                            />
                        </div>

                    </div>
                    <textarea
                        className={styles.taskTextarea}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder='Add a description'
                    />


                    <button type="submit">🪄  Save changes</button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default NewTaskModal;
