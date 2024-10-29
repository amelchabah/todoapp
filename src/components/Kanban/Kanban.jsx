import React from 'react';
import styles from './Kanban.module.scss';  // Import des styles spécifiques au Kanban
import { formatDate } from '../../utils/dateUtils';
import Dropdown from '../Dropdown/Dropdown';
import { CalendarIcon, EditIcon } from '@/assets/icons';

const Kanban = ({ tasks, onTaskClick, onDeleteTask, getStatusBadgeClass }) => {
    const columns = [
        { status: 'To start', label: '📅 to start' },
        { status: 'In progress', label: '🕒 in progress' },
        { status: 'Done', label: '✅ done' }
        // { status: '', label: '🛌 no status' }

    ];

    // Catégorisation des tâches par statut
    const categorizedTasks = columns.reduce((acc, { status }) => {
        acc[status] = tasks.filter(task => task.status === status);
        return acc;
    }, {});

    const handleDropdownItemClick = (item, taskId) => {
        if (item.action === 'delete') {
            onDeleteTask(taskId);
        }
        // Ajoutez d'autres actions ici si nécessaire
    };

    const dropdownItems = [
        { label: '🗑️  Delete', action: 'delete' },
        // Ajoutez d'autres éléments de menu ici si nécessaire
    ];

    return (
        <div className={styles.kanban}>
            {columns.map(({ status, label }) => {
                const taskCount = categorizedTasks[status].length;

                return (
                    <div key={status} className={styles.kanbanColumn}>
                        <div className={styles.kanbanHeader}>
                            <span className={getStatusBadgeClass(status)}>
                                {label}
                            </span>
                            <span className='small'>
                                {taskCount}
                            </span>
                        </div>

                        {categorizedTasks[status].map((task) => {

                            const { formattedDate, className } = formatDate(task.deadline);
                            return (
                                <div
                                    key={task.id}
                                    className={styles.kanbanItem}
                                >
                                    <div className={styles.kanbanItemHeader}>
                                        <h4>{task.title}</h4>
                                        <button className='tertiary tertiary_square' onClick={() => onTaskClick(task)}>
                                            <EditIcon />
                                        </button>
                                        <Dropdown
                                            items={dropdownItems}
                                            onItemClick={(item) => handleDropdownItemClick(item, task.id)}
                                        />
                                    </div>
                                    <span className={getStatusBadgeClass(task.status)}>
                                    
                                        {task.status === 'To start' ? <><span>📅</span><span>to start</span></> :
                                            task.status === 'In progress' ? <><span>🕒</span><span>in progress</span></> :
                                                task.status === 'Done' ? <><span>✅</span><span>done</span></> : task.status.toLowerCase()}

                                    </span>

                                    {
                                        task.deadline && <span className='small'>
                                            <CalendarIcon />
                                            {formattedDate}</span>

                                    }
                                </div>
                            )
                        }

                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Kanban;
