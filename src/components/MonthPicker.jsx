const MonthPicker = ({ label = "Month", value, onChange }) => {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="month" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
};

export default MonthPicker;
