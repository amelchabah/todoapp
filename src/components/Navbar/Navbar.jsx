import { useState, useEffect } from 'react';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Mettre à jour l'heure immédiatement
    updateClock();

    // Mettre à jour l'heure toutes les minutes
    const intervalId = setInterval(updateClock, 60000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className={styles.navbar}>
      <h4>{currentTime}</h4>
    </nav>
  );
};

export default Navbar;
