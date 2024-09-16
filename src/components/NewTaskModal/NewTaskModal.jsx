import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './NewTaskModal.module.scss';

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

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h1>{taskToEdit ? 'Edit Task' : 'Create a new task'}</h1>
                <br />
                <form onSubmit={handleSaveTask}>
                    <label>
                        Task Title:
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Status:
                        <select
                            value={taskStatus}
                            onChange={(e) => setTaskStatus(e.target.value)}
                            required
                        >
                            <option value="To start">To start</option>
                            <option value="In progress">In progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </label>

                    <label>
                        Deadline:
                        <input
                            type="date"
                            value={taskDeadline}
                            onChange={(e) => setTaskDeadline(e.target.value)}
                        />
                    </label>

                    <button type="submit">Save Task</button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <br />
                <button onClick={onClose} className="secondary">Cancel</button>
            </div>
        </div>
    );
};

export default NewTaskModal;
