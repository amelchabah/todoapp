// src/components/NewTaskModal/NewTaskModal.jsx

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './NewTaskModal.module.scss';
import { BackIcon, StatusIcon, CalendarIcon, EditIcon } from '@/assets/icons';

const NewTaskModal = ({ onClose, fetchTasks, userId, taskToEdit }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskDeadline, setTaskDeadline] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (taskToEdit) {
            setTaskTitle(taskToEdit.title);
            setTaskStatus(taskToEdit.status);
            setTaskDeadline(taskToEdit.deadline || '');
        }
    }, [taskToEdit]);

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
                    .update({ title: taskTitle, status: taskStatus, deadline })
                    .eq('id', taskToEdit.id);

                if (error) {
                    setError(error.message);
                } else {
                    onClose();
                    fetchTasks(userId);
                }
            } else {
                // Création de la tâche
                const { error } = await supabase
                    .from('tasks')
                    .insert([{ title: taskTitle, status: taskStatus, deadline, user_id: userId }]);

                if (error) {
                    setError(error.message);
                } else {
                    setTaskTitle('');
                    setTaskStatus('To start');
                    setTaskDeadline('');
                    onClose();
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
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className="tertiary tertiary_square"><BackIcon /></button>
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
                                <option value="To start">📅 To start</option>
                                <option value="In progress">🕒 In progress</option>
                                <option value="Done">✅ Done</option>
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

                    <button type="submit">Save Task</button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default NewTaskModal;
