import { useState } from "react";
import MonthPicker from "../components/MonthPicker";
import ExpenseSection from "../components/ExpenseSection";
import DailyExpenseSection from "../components/DailyExpenseSection";
import { getCurrentMonth } from "../utils";

const DashboardPage = () => {
  const [month, setMonth] = useState(getCurrentMonth());

  return (
    <div className="page-grid">
      <section className="panel accent">
        <div className="panel-header">
          <div>
            <p className="section-label">Monthly View</p>
            <h2>Choose the month you want to manage</h2>
          </div>
        </div>

        <MonthPicker value={month} onChange={setMonth} />
      </section>

      <ExpenseSection month={month} />
      <DailyExpenseSection month={month} />
    </div>
  );
};

export default DashboardPage;
