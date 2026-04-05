import { useEffect, useState } from "react";
import { expenseApi } from "../api";
import { formatCurrency } from "../utils";

const getEmptyForm = (month) => ({
  itemName: "",
  category: "",
  amount: "",
  month,
});

const ExpenseSection = ({ month }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, count: 0 });
  const [form, setForm] = useState(getEmptyForm(month));
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await expenseApi.getByMonth(month);
      setExpenses(data.expenses);
      setSummary(data.summary);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm((currentForm) => ({ ...currentForm, month }));
    setEditingId("");
    loadExpenses();
  }, [month]);

  const resetForm = () => {
    setForm(getEmptyForm(month));
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
      month,
    };

    try {
      if (editingId) {
        await expenseApi.update(editingId, payload);
      } else {
        await expenseApi.create(payload);
      }

      resetForm();
      loadExpenses();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      itemName: expense.itemName,
      category: expense.category,
      amount: expense.amount,
      month: expense.month,
    });
  };

  const handleDelete = async (id) => {
    try {
      await expenseApi.remove(id);
      loadExpenses();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-label">Expense Table</p>
          <h2>Monthly expenses</h2>
        </div>
        <div className="stat-card">
          <span>Total this month</span>
          <strong>{formatCurrency(summary.totalAmount)}</strong>
        </div>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Item name</span>
          <input
            type="text"
            value={form.itemName}
            onChange={(event) => setForm({ ...form, itemName: event.target.value })}
            placeholder="Groceries"
            required
          />
        </label>

        <label className="field">
          <span>Category</span>
          <input
            type="text"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            placeholder="Food"
            required
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            placeholder="0.00"
            required
          />
        </label>

        <div className="actions">
          <button type="submit">{editingId ? "Update expense" : "Add expense"}</button>
          {editingId ? (
            <button className="secondary" type="button" onClick={resetForm}>
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
              <th>Item</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading expenses...</td>
              </tr>
            ) : expenses.length ? (
              expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.itemName}</td>
                  <td>{expense.category}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{new Date(expense.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="row-actions">
                    <button className="ghost" type="button" onClick={() => handleEdit(expense)}>
                      Edit
                    </button>
                    <button
                      className="ghost danger"
                      type="button"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No expenses added for this month yet.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <strong>Monthly total</strong>
              </td>
              <td>
                <strong>{formatCurrency(summary.totalAmount)}</strong>
              </td>
              <td colSpan="2">{summary.count} item(s)</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default ExpenseSection;
