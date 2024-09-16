export const formatDate = (dateString) => {
    if (!dateString) return { formattedDate: '', className: '' }; // Renvoie des valeurs par défaut si la date est null ou vide

    const today = new Date();
    const date = new Date(dateString);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let className = '';
    let formattedDate = '';

    if (diffDays === 0) {
        formattedDate = 'Today';
    } else if (diffDays === 1) {
        formattedDate = 'Tomorrow';
    } else {
        formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    if (diffDays < 0) { // Si la date est dans le passé
        className = 'old';
    }

    return { formattedDate, className };
};
