import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Personal Expense Tracker</p>
          <h1>Track monthly expenses without extra clutter.</h1>
          <p className="hero-text">
            Add monthly expenses, manage your daily spend target, and check the report page for a
            quick month-wise summary.
          </p>
        </div>

        <nav className="nav-tabs">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
