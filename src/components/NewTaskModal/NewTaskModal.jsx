import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { StatusIcon, CalendarIcon, AnglesRightIcon, TrashIcon } from '@/assets/icons';
import { gsap } from 'gsap';
import styles from './NewTaskModal.module.scss';
import EmojiPicker from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';
import { useTheme } from '@/context/ThemeContext';

const NewTaskModal = ({ onClose, fetchTasks, userId, taskToEdit }) => {
    const { isDarkMode } = useTheme();
    const [taskTitle, setTaskTitle] = useState('');
    const [taskStatus, setTaskStatus] = useState('To start');
    const [taskDeadline, setTaskDeadline] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [error, setError] = useState('');
    const [formModified, setFormModified] = useState(false);
    const modalRef = useRef(null);
    const [icon, setIcon] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        if (taskToEdit) {
            setTaskTitle(taskToEdit.title);
            setTaskStatus(taskToEdit.status);
            setTaskDeadline(taskToEdit.deadline || '');
            setTaskDescription(taskToEdit.description || '');
            setIcon(taskToEdit.icon || '');
        }
    }, [taskToEdit]);

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

    const handleSaveTask = async (event) => {
        event.preventDefault();
        setError('');

        if (!userId) {
            setError('User is not authenticated.');
            return;
        }

        try {
            const deadline = taskDeadline || null;

            if (taskToEdit) {
                const { error } = await supabase
                    .from('tasks')
                    .update({
                        title: taskTitle, status: taskStatus, deadline, description: taskDescription, icon
                    })
                    .eq('id', taskToEdit.id);

                if (error) {
                    setError(error.message);
                } else {
                    handleClose();
                    fetchTasks(userId);
                }
            } else {
                const { error } = await supabase
                    .from('tasks')
                    .insert([{
                        title: taskTitle, status: taskStatus, deadline,
                        description: taskDescription, icon,
                        user_id: userId
                    }]);

                if (error) {
                    setError(error.message);
                } else {
                    setTaskTitle('');
                    setTaskStatus('To start');
                    setTaskDeadline('');
                    setTaskDescription('');
                    setIcon('');
                    handleClose();
                    fetchTasks(userId);
                }
            }
            setFormModified(false);

        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskToEdit.id);
            if (error) {
                setError(error.message);
            } else {
                handleClose();
                fetchTasks(userId);
            }
        }
    };

    const handleOutsideClick = (event) => {
        // setpickeropen to false if click is outside emoji picker
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setIsPickerOpen(false);
        }
    };

    useEffect(() => {
        if (isPickerOpen) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isPickerOpen]);

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

    const handleFieldChange = (setter) => (e) => {
        setter(e.target.value);
        setFormModified(true);
    };

    return (
        <div className={styles.modal}>
            <div
            onClick={handleOutsideClick}
                className={styles.modalContent}
                ref={modalRef}
                // onClick={(e) => e.stopPropagation()} // Prevent click on modal content from closing modal
            >
                <button onClick={handleClose}
                    className={formModified ? 'tertiary tertiary_square disabled' : 'tertiary tertiary_square'}
                    disabled={formModified}
                    title={formModified ? 'Please save changes before closing' : ''}
                ><AnglesRightIcon /></button>
                <br />
                <form onSubmit={handleSaveTask}>
                    <div className={styles.iconPicker}>
                        <label htmlFor="Icon" hidden>Icon</label>
                        <div className={styles.taskIcon} onClick={(e) => {
                            e.stopPropagation(); // Prevent modal close on icon click
                            setIsPickerOpen(!isPickerOpen);
                        }}>
                            {icon ? <span>{icon}</span> : <button type="button" className='tertiary'>Add icon</button>}
                        </div>
                        {isPickerOpen && (
                            <div ref={emojiPickerRef} className={`${styles.emojiPicker} emojiPicker`}>
                                <EmojiPicker
                                    onEmojiClick={(emojiObject) => {
                                        setIcon(emojiObject.emoji);
                                        setIsPickerOpen(false);
                                        handleFieldChange(setIcon)({ target: { value: emojiObject.emoji } });
                                    }}
                                    theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                                />
                            </div>
                        )}
                    </div>

                    <input
                        className={styles.taskTitleInput}
                        type="text"
                        value={taskTitle}
                        onChange={handleFieldChange(setTaskTitle)}
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
                                onChange={handleFieldChange(setTaskStatus)}
                                className={getStatusSelectClass(taskStatus)}
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
                                onChange={handleFieldChange(setTaskDeadline)}
                            />
                        </div>
                    </div>

                    <textarea
                        className={styles.taskTextarea}
                        value={taskDescription}
                        onChange={handleFieldChange(setTaskDescription)}
                        placeholder='Add a description'
                    />

                    <div className={styles.actions}>
                        {taskToEdit && (
                            <button
                                type="button"
                                className='tertiary tertiary_square'
                                onClick={handleDeleteTask}
                                title='Delete task'
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

export default NewTaskModal;