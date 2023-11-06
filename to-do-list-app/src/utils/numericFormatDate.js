function numericFormatDate (timestamp) {
    const date = timestamp.toDate();

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });    
};

export default numericFormatDate;