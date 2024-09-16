import Dropdown from '@/components/Dropdown/Dropdown';
import Toggle from '@/components/Toggle/Toggle';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.scss';

const Navbar = ({ onToggleFullWidth, isFullWidth }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className={styles.navbar}>
      <h4>{currentTime}</h4>

      <Dropdown
        items={[
          {
            title: 'Full Width',
            label: (
              <>
                <span>Full width</span>
                <Toggle
                  isChecked={isFullWidth}
                />
              </>

            ),
          },
        ]}
        onItemClick={(item) => onToggleFullWidth(!isFullWidth)}
      />
    </nav>
  );
};

export default Navbar;
