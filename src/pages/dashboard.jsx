// src/pages/dashboard.jsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import styles from '@/styles/dashboard.module.scss';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import NewTaskModal from '@/components/NewTaskModal/NewTaskModal';
import { formatDate } from '../utils/dateUtils'; // Importez la fonction utilitaire

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);  // Gérer la tâche à éditer
    const router = useRouter();
    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'gallery'


    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                fetchTasks(user.id);
            } else {
                router.push('/login');
            }
        };

        fetchUser();
    }, [router]);

    const fetchTasks = async (userId) => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('status', { ascending: true })  // Tri par statut
            .order('deadline', { ascending: true });  // Tri par deadline

        if (error) {
            setError(error.message);
        } else {
            setTasks(data);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'To start':
                return styles.badge + ' ' + styles.toStart;
            case 'In progress':
                return styles.badge + ' ' + styles.inProgress;
            case 'Done':
                return styles.badge + ' ' + styles.done;
            default:
                return styles.badge; // Valeur par défaut si le statut n'est pas reconnu
        }
    };

    const handleTaskClick = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) {
                setError(error.message);
            } else {
                fetchTasks(user.id); // Recharger les tâches après la suppression
            }
        }
    };

    return (
        <>
            <Sidebar fetchTasks={fetchTasks} userId={user?.id} />
            <div className={styles.dashboardpage}>
                <Navbar />
                <div className={styles.dashboardpage_content}>

                    {
                        tasks && tasks.length > 0 ? <>
                            <h1>
                                You have {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} today 🗒️</h1>
                        </> : <><h1>
                            Nothing to do today. 🛌</h1>
                        </>
                    }


                    {error && <p>{error}</p>}




                    {tasks && tasks.length > 0 ?

                        <>
                            <div className={styles.viewSwitcher}>
                                <button
                                    className={viewMode === 'list' ? styles.active : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    List View
                                </button>
                                <button
                                    className={viewMode === 'gallery' ? styles.active : ''}
                                    onClick={() => setViewMode('gallery')}
                                >
                                    Gallery View
                                </button>
                            </div>

                            {viewMode === 'list' ? (
                                <table className={styles.taskTable}>
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                            <th>Actions</th> {/* Ajouter une colonne pour les actions */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id} onClick={() => handleTaskClick(task)}>
                                                <td>{task.title}</td>
                                                <td>
                                                    <span className={getStatusBadgeClass(task.status)}>
                                                        {task.status === 'To start' ? '📅  to start' :
                                                            task.status === 'In progress' ? '🔄  in progress' :
                                                                task.status === 'Done' ? '✅  done' : task.status.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td>{formatDate(task.deadline)}</td>
                                                <td>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className={styles.gallery}>
                                    {tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={styles.galleryItem}
                                            onClick={() => handleTaskClick(task)}
                                        >
                                            <h3>{task.title}</h3>
                                            <span className={getStatusBadgeClass(task.status)}>
                                                {task.status === 'To start' ? '📅  to start' :
                                                    task.status === 'In progress' ? '🔄  in progress' :
                                                        task.status === 'Done' ? '✅  done' : task.status.toLowerCase()}
                                            </span>
                                            <p>{formatDate(task.deadline)}</p>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </>
                        :
                        null

                    }

                </div>
            </div>

            {isModalOpen && (
                <NewTaskModal
                    onClose={() => setIsModalOpen(false)}
                    fetchTasks={fetchTasks}
                    userId={user?.id}
                    taskToEdit={taskToEdit}  // Passer la tâche à éditer
                />
            )}
        </>
    );
};

export default Dashboard;
