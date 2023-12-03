function YearMonthDateFormat(firebaseTimestamp) {
    if (!firebaseTimestamp || typeof firebaseTimestamp.toDate !== 'function') {
        console.error('Invalid timestamp provided to numericFormatDate');
        return '';
    }

    const date = firebaseTimestamp.toDate();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default YearMonthDateFormat;