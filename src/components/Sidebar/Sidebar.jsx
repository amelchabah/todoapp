import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import NewTaskModal from '../NewTaskModal/NewTaskModal';
import NewEventModal from '../NewEventModal/NewEventModal';
import styles from './Sidebar.module.scss';
import { BackIcon, ListIcon } from '@/assets/icons';

const Sidebar = ({ fetchTasks, fetchEvents, userId }) => {
    const [isOpen, setIsOpen] = useState(false);  // On ne définit plus comme ouvert par défaut
    const [isInitialized, setIsInitialized] = useState(false); // État pour savoir si l'initialisation est terminée
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const router = useRouter();

    // Charger l'état de la sidebar depuis le localStorage
    useEffect(() => {
        const savedSidebarState = localStorage.getItem('sidebarState');
        if (savedSidebarState !== null) {
            setIsOpen(savedSidebarState === 'open');
        } else {
            setIsOpen(true);  // Ouvert par défaut si rien n'est trouvé
        }
        setIsInitialized(true); // Initialisation terminée
    }, []);

    const handleToggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        // Sauvegarder l'état de la sidebar dans le localStorage
        localStorage.setItem('sidebarState', newState ? 'open' : 'closed');
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        }
    };

    const handleNewTask = () => {
        setIsModalOpen(true);
    };

    const handleNewEvent = () => {
        setIsEventModalOpen(true);
    }

    if (!isInitialized) {
        // Masquer la sidebar tant que l'initialisation n'est pas terminée
        return null;
    }

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <button className={`${styles.toggleButton} secondary secondary_square`} onClick={handleToggleSidebar}>
                { isOpen ? <BackIcon/> : <ListIcon/> }
            </button>
            <div className={styles.content}>
                <div className={styles.buttons}>
                    <button onClick={() => router.push('/dashboard')}>
                        🏠  Dashboard
                    </button>
                    <button onClick={handleNewTask}>📋 New task</button>
                    <button onClick={handleNewEvent}>📅 New Event</button>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        ✌🏼  Log out
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <NewTaskModal
                    onClose={() => setIsModalOpen(false)}
                    fetchTasks={fetchTasks}
                    userId={userId}
                />
            )}

            {isEventModalOpen && (
                <NewEventModal
                    onClose={() => setIsEventModalOpen(false)}
                    fetchEvents={fetchEvents}
                    userId={userId}
                />
            )}
        </div>
    );
};

export default Sidebar;
