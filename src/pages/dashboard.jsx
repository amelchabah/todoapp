import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import styles from '@/styles/dashboard.module.scss';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import NewTaskModal from '@/components/NewTaskModal/NewTaskModal';
import DataTable from '@/components/DataTable/DataTable';
import Kanban from '@/components/Kanban/Kanban';
import { TableIcon, KanbanIcon } from '@/assets/icons';  // Importer les icônes
import Head from 'next/head';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);  // Gérer la tâche à éditer
    const router = useRouter();
    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'kanban'
    const [activeDropdown, setActiveDropdown] = useState(null); // Pour gérer un seul dropdown à la fois
    const [isSmall, setIsSmall] = useState(true);  // État pour gérer la classe small

    const toggleFullWidth = (isFullWidth) => {
      setIsSmall(!isFullWidth);  // Inverse la classe small selon l'état fullWidth
    };
  
    useEffect(() => {
        const storedViewMode = localStorage.getItem('viewMode');
        if (storedViewMode) {
            setViewMode(storedViewMode);
        }

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

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('viewMode', mode);  // Sauvegarde du mode de vue dans localStorage
    };

    const handleDropdownToggle = (dropdownId) => {
        setActiveDropdown((prev) => (prev === dropdownId ? null : dropdownId));
    };

    return (
        <>
        <Head>
            <title>dashboard</title>
        </Head>
            <Sidebar fetchTasks={fetchTasks} userId={user?.id} />
            <div className={styles.dashboardpage}>
                <Navbar onToggleFullWidth={toggleFullWidth} isFullWidth={!isSmall} />
                <div className={`${styles.dashboardpage_content} ${isSmall ? styles.small : ''}`}>
                    <h2>Hey!</h2>
                    {
                        tasks && tasks.length > 0 ? <>
                            <h1>
                                You have {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} today 🗒️</h1>
                        </> : <><h1>
                            Nothing to do today. 🛌</h1>
                        </>
                    }

                    {error && <p>{error}</p>}
                    <br />

                    {tasks && tasks.length > 0 ?
                        <>
                            <div className={styles.databaseHeader}>

                                <div className={styles.viewSwitcher}>
                                    <button
                                        className={viewMode === 'list' ? 'tertiary active' : 'tertiary'}
                                        onClick={() => handleViewModeChange('list')}  // Changement de mode avec sauvegarde
                                    >
                                        <TableIcon /> Table
                                    </button>
                                    <button
                                        className={viewMode === 'kanban' ? 'tertiary active' : 'tertiary'}
                                        onClick={() => handleViewModeChange('kanban')}  // Changement de mode avec sauvegarde
                                    >
                                       <KanbanIcon /> Kanban
                                    </button>
                                </div>

                                <div className={styles.options}>
                                 
                                </div>
                            </div>

                            {viewMode === 'list' ? (
                                <DataTable
                                    tasks={tasks}
                                    onTaskClick={handleTaskClick}
                                    onDeleteTask={handleDeleteTask}
                                    getStatusBadgeClass={getStatusBadgeClass}
                                />
                            ) : (
                                <Kanban
                                    tasks={tasks}
                                    onTaskClick={handleTaskClick}
                                    onDeleteTask={handleDeleteTask}
                                    getStatusBadgeClass={getStatusBadgeClass}
                                />
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
