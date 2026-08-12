import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role = "contractor" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>APTIMIZED</h2>
        <span>Internal Portal</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to={role === "admin" ? "/admin/home" : "/contractor/home"}
          className="menu-item"
        >
          🏠 Home
        </NavLink>

        <NavLink
          to={
            role === "admin"
              ? "/admin/weekly-reports"
              : "/contractor/weekly-reports"
          }
          className="menu-item"
        >
          📝 Weekly Reports
        </NavLink>

        {role === "contractor" && (
          <NavLink to="/contractor/profile" className="menu-item">
            👤 Profile
          </NavLink>
        )}

        {role === "admin" && (
          <NavLink to="/admin/users" className="menu-item">
            👥 Users
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
