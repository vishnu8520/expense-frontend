export const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const getToday = () => new Date().toISOString().slice(0, 10);

export const getDefaultDateForMonth = (month) => {
  const today = getToday();
  return today.startsWith(`${month}-`) ? today : `${month}-01`;
};

export const getMonthDateBounds = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return {
    minDate: `${month}-01`,
    maxDate: `${month}-${String(lastDay).padStart(2, "0")}`,
  };
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const formatDate = (value) => {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};
