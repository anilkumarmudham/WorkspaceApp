import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({
  role = "contractor",
  isOpen = false,
  onClose,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const handleNavigation = () => {
    /*
      Close sidebar automatically after
      selecting a menu item on mobile.
    */
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
    >

      {/* ========================================
          LOGO
      ======================================== */}

      <div className="sidebar-logo">

        <div className="sidebar-brand">
          <h2>APTIMIZED</h2>
          <span>Internal Portal</span>
        </div>

        {/* Mobile close button */}
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
          type="button"
        >
          ×
        </button>

      </div>


      {/* ========================================
          MENU
      ======================================== */}

      <nav className="sidebar-menu">

        <NavLink
          to={
            role === "admin"
              ? "/admin/home"
              : "/contractor/home"
          }
          className="menu-item"
          onClick={handleNavigation}
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
          onClick={handleNavigation}
        >
          📝 Weekly Reports
        </NavLink>


        {role === "contractor" && (
          <NavLink
            to="/contractor/profile"
            className="menu-item"
            onClick={handleNavigation}
          >
            👤 Profile
          </NavLink>
        )}


        {role === "admin" && (
          <NavLink
            to="/admin/users"
            className="menu-item"
            onClick={handleNavigation}
          >
            👥 Users
          </NavLink>
        )}

      </nav>


      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="sidebar-footer">

        <button
          className="logout-btn"
          onClick={handleLogout}
          type="button"
        >
          🚪 Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;