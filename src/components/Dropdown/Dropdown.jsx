import React, { useState, useEffect, useRef } from 'react';
import styles from './Dropdown.module.scss';

const Dropdown = ({ items, onItemClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Fermer le dropdown si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
                className='tertiary tertiary_square'
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-controls='dropdown-menu'
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" /></svg>
            </button>
            {dropdownOpen && (
                <div id='dropdown-menu' className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>Actions</div>
                    {items.map((item, index) => (
                        <button
                            className='tertiary'
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                onItemClick(item);
                                setDropdownOpen(false);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
