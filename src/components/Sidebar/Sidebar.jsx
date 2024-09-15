import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleToggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        }
    };

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <button className={`${styles.toggleButton} secondary`} onClick={handleToggleSidebar}>
                {/* {isOpen ? '✕' : '☰'} */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" /></svg>
            </button>
            <div className={styles.content}>
                <div className={styles.buttons}>

                    <button onClick={() => router.push('/dashboard')}>
                        🏠  Dashboard
                    </button>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        ✌🏼  Log out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Sidebar;
