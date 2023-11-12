function isObject(object) {
  return object != null && typeof object === 'object';
}

export const sanitizeData = (data) => {
    if (Array.isArray(data)) {
      // If it's an array, iterate over each element
      return data.map(item => sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
      // If it's an object (and not null), iterate over each key
      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          data[key] = null; // Replace undefined with null
        } else {
          data[key] = sanitizeData(data[key]); // Recursive call for nested objects/arrays
        }
      });
    }
    return data;
};

export const isObjectsEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !isObjectsEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }

    return true;
}