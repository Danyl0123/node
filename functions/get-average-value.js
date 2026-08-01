const getAverageValue = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Input must be a non-empty array");
  }
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
};

// console.log(getAverageValue([1, 2, 3, 4, 5]));
