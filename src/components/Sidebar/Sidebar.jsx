import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import NewTaskModal from '../NewTaskModal/NewTaskModal';
import styles from './Sidebar.module.scss';

const Sidebar = ({ fetchTasks, userId }) => {
    const [isOpen, setIsOpen] = useState(false);  // On ne définit plus comme ouvert par défaut
    const [isInitialized, setIsInitialized] = useState(false); // État pour savoir si l'initialisation est terminée
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    if (!isInitialized) {
        // Masquer la sidebar tant que l'initialisation n'est pas terminée
        return null;
    }

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <button className={`${styles.toggleButton} secondary secondary_square`} onClick={handleToggleSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M0 96C0 78.3 14.3 64 32 64h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z" />
                </svg>
            </button>
            <div className={styles.content}>
                <div className={styles.buttons}>
                    <button onClick={() => router.push('/dashboard')}>
                        🏠  Dashboard
                    </button>
                    <button onClick={handleNewTask}>➕  New task</button>
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
        </div>
    );
};

export default Sidebar;
