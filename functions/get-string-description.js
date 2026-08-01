const getStringDescription = (item) => {
  if (typeof item !== "object" || item === null) {
    throw new Error("Input must be a non-null object");
  }
  const { name, price, inStock } = item;
  return `Товар: ${name}, Ціна: ${price} грн, В наявності: ${inStock ? "Так" : "Ні"}`;
};

// console.log(
//   getStringDescription({ name: "Телефон", price: 10000, inStock: true }),
// );
