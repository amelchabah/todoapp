import React from 'react';
import styles from './DataTable.module.scss';
import { formatDate } from '../../utils/dateUtils';
import Dropdown from '../Dropdown/Dropdown';
import { CalendarIcon, StatusIcon, LetterAIcon, DotsIcon, OpenIcon } from '@/assets/icons';

const DataTable = ({ tasks, onTaskClick, onDeleteTask, getStatusBadgeClass }) => {
    const handleDropdownItemClick = (item, taskId) => {
        if (item.action === 'delete') {
            onDeleteTask(taskId);
        }
        // Ajoutez d'autres actions ici si nécessaire
    };

    const dropdownItems = [
        { label: 'Delete', action: 'delete' },
        // Ajoutez d'autres éléments de menu ici si nécessaire
    ];

    return (
        <table className={styles.dataTable}>
            <thead>
                <tr>
                    <th width="50%">
                        <div><LetterAIcon /> Task</div></th>
                    <th width="25%"><div><StatusIcon /> Status</div></th>
                    <th width="25%"><div><CalendarIcon /> Deadline</div></th>
                    <th width="10%"><div className={styles.mini}><DotsIcon /></div></th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>
                            <div className={styles.titleContainer}>
                                <span>{task.title}</span>
                                <button
                                    className={`${styles.open} tertiary`}
                                    onClick={() => onTaskClick(task)}
                                >
                                    <OpenIcon/> Open
                                </button>
                            </div>
                        </td>
                        <td>
                            <span className={getStatusBadgeClass(task.status)}>
                                {task.status === 'To start' ? '📅  to start' :
                                    task.status === 'In progress' ? '🕒  in progress' :
                                        task.status === 'Done' ? '✅  done' : task.status.toLowerCase()}
                            </span>
                        </td>
                        <td>
                            {
                                task.deadline && <span className='small'>
                                    {formatDate(task.deadline)}</span>
                            }

                        </td>
                        <td>
                            <Dropdown
                                items={dropdownItems}
                                onItemClick={(item) => handleDropdownItemClick(item, task.id)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;