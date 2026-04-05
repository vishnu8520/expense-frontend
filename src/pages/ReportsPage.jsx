import { useEffect, useState } from "react";
import { reportApi } from "../api";
import MonthPicker from "../components/MonthPicker";
import { formatCurrency, formatDate, getCurrentMonth } from "../utils";

const ReportsPage = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await reportApi.getByMonth(month);
        setReport(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [month]);

  return (
    <div className="page-grid">
      <section className="panel accent">
        <div className="panel-header">
          <div>
            <p className="section-label">Reports</p>
            <h2>Month-wise summary</h2>
          </div>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </section>

      {error ? <p className="feedback error">{error}</p> : null}

      <section className="report-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Expenses</p>
              <h2>Monthly total</h2>
            </div>
          </div>

          {loading ? (
            <p>Loading report...</p>
          ) : (
            <>
              <div className="report-stat">
                <span>Total expense amount</span>
                <strong>{formatCurrency(report?.expenseSummary?.totalExpenseAmount)}</strong>
              </div>
              <div className="report-stat">
                <span>Total items</span>
                <strong>{report?.expenseSummary?.totalItems || 0}</strong>
              </div>
            </>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Daily Target</p>
              <h2>Daily tracking summary</h2>
            </div>
          </div>

          {loading ? (
            <p>Loading report...</p>
          ) : (
            <>
              <div className="report-stat">
                <span>Target amount</span>
                <strong>{formatCurrency(report?.dailyExpenseSummary?.targetAmount)}</strong>
              </div>
              <div className="report-stat">
                <span>Total daily spend</span>
                <strong>{formatCurrency(report?.dailyExpenseSummary?.totalDailySpent)}</strong>
              </div>
              <div className="report-stat">
                <span>Days over target</span>
                <strong>{report?.dailyExpenseSummary?.overTargetDays || 0}</strong>
              </div>
            </>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-label">Category Breakdown</p>
            <h2>Expense totals by category</h2>
          </div>
        </div>

        {loading ? (
          <p>Loading report...</p>
        ) : Object.keys(report?.expenseSummary?.categoryTotals || {}).length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.expenseSummary.categoryTotals).map(([category, total]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{formatCurrency(total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No expense data available for this month.</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-label">Daily Entries</p>
            <h2>Month daily spend status</h2>
          </div>
        </div>

        {loading ? (
          <p>Loading report...</p>
        ) : report?.dailyExpenseSummary?.entries?.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Spend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.dailyExpenseSummary.entries.map((entry) => {
                  const isOverTarget =
                    Number(entry.amount) > Number(report.dailyExpenseSummary.targetAmount || 0);

                  return (
                    <tr key={entry._id} className={isOverTarget ? "over-target" : ""}>
                      <td>{formatDate(entry.date)}</td>
                      <td>{formatCurrency(entry.amount)}</td>
                      <td>
                        <span className={`status-pill ${isOverTarget ? "danger" : "safe"}`}>
                          {isOverTarget ? "Over target" : "Within target"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No daily spend entries available for this month.</p>
        )}
      </section>
    </div>
  );
};

export default ReportsPage;
