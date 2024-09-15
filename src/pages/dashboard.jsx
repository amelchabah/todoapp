// src/pages/dashboard.jsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { addTask } from '../lib/todo';
import { supabase } from '../lib/supabaseClient';
import styles from '@/styles/dashboard.module.scss';
import Link from 'next/link';
import Head from 'next/head';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar'

const Dashboard = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                fetchTasks(user.id);
            } else {
                router.push('/login'); // Redirection si l'utilisateur n'est pas connecté
            }
        };

        fetchUser();
    }, [router]);

    const fetchTasks = async (userId) => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            setError(error.message);
        } else {
            setTasks(data);
        }
    };

    const handleAddTask = async (event) => {
        event.preventDefault();
        setError('');

        if (!user) {
            setError('User is not authenticated.');
            return;
        }

        try {
            await addTask(user.id, taskTitle);
            setTaskTitle('');
            fetchTasks(user.id); // Met à jour la liste des tâches après ajout
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <>
            <Sidebar />
            <div className={styles.dashboardpage}>
                <Navbar />
                <div className={styles.dashboardpage_content}>
                    <h1>welcome to your dashboard</h1>

                    <form onSubmit={handleAddTask}>
                        <label>
                            Task Title:
                            <input
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Add Task</button>
                    </form>
                    {error && <p>{error}</p>}
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </div>

            </div>

        </>

    );
};

export default Dashboard;
