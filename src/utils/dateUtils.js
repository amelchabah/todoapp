export const formatDate = (dateString) => {
    if (!dateString) return ''; // Renvoie une chaîne vide si la date est null ou vide

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};
