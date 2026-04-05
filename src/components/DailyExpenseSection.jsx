import { useEffect, useState } from "react";
import { dailyExpenseApi } from "../api";
import {
  formatCurrency,
  formatDate,
  getDefaultDateForMonth,
  getMonthDateBounds,
} from "../utils";

const getEmptyEntry = (month) => ({
  date: getDefaultDateForMonth(month),
  amount: "",
});

const DailyExpenseSection = ({ month }) => {
  const [record, setRecord] = useState({ targetAmount: 0, entries: [], summary: { totalSpent: 0 } });
  const [targetAmount, setTargetAmount] = useState(0);
  const [entryForm, setEntryForm] = useState(getEmptyEntry(month));
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { minDate, maxDate } = getMonthDateBounds(month);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dailyExpenseApi.getByMonth(month);
      setRecord(data);
      setTargetAmount(data.targetAmount || 0);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEntryForm(getEmptyEntry(month));
    setEditingId("");
    loadRecord();
  }, [month]);

  const handleTargetSave = async (event) => {
    event.preventDefault();

    try {
      await dailyExpenseApi.updateTarget(month, { targetAmount: Number(targetAmount) });
      loadRecord();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleEntrySubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...entryForm,
      amount: Number(entryForm.amount),
    };

    try {
      if (editingId) {
        await dailyExpenseApi.updateEntry(month, editingId, payload);
      } else {
        await dailyExpenseApi.createEntry(month, payload);
      }

      setEntryForm(getEmptyEntry(month));
      setEditingId("");
      loadRecord();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEntryForm({
      date: entry.date,
      amount: entry.amount,
    });
  };

  const handleDelete = async (entryId) => {
    try {
      await dailyExpenseApi.removeEntry(month, entryId);
      loadRecord();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-label">Daily Expense</p>
          <h2>Daily spending target</h2>
        </div>
        <div className="stat-card soft">
          <span>Total daily spend</span>
          <strong>{formatCurrency(record.summary?.totalSpent)}</strong>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleTargetSave}>
        <label className="field">
          <span>Target amount for this month</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            required
          />
        </label>

        <button type="submit">Save target</button>
      </form>

      <form className="grid-form" onSubmit={handleEntrySubmit}>
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={entryForm.date}
            min={minDate}
            max={maxDate}
            onChange={(event) => setEntryForm({ ...entryForm, date: event.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Total spend for day</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={entryForm.amount}
            onChange={(event) => setEntryForm({ ...entryForm, amount: event.target.value })}
            placeholder="0.00"
            required
          />
        </label>

        <div className="actions">
          <button type="submit">{editingId ? "Update daily spend" : "Add daily spend"}</button>
          {editingId ? (
            <button
              className="secondary"
              type="button"
              onClick={() => {
                setEditingId("");
                setEntryForm(getEmptyEntry(month));
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="feedback error">{error}</p> : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading daily expenses...</td>
              </tr>
            ) : record.entries?.length ? (
              record.entries.map((entry) => {
                const isOverTarget = Number(entry.amount) > Number(record.targetAmount || 0);

                return (
                  <tr key={entry._id} className={isOverTarget ? "over-target" : ""}>
                    <td>{formatDate(entry.date)}</td>
                    <td>{formatCurrency(entry.amount)}</td>
                    <td>
                      <span className={`status-pill ${isOverTarget ? "danger" : "safe"}`}>
                        {isOverTarget ? "Over target" : "Within target"}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button className="ghost" type="button" onClick={() => handleEdit(entry)}>
                        Edit
                      </button>
                      <button
                        className="ghost danger"
                        type="button"
                        onClick={() => handleDelete(entry._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No daily spend entries for this month yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DailyExpenseSection;
