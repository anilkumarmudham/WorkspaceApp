import "./MainLayout.css";
import { useMemo, useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function MainLayout({
  children,
  title = "Home",
  role = "contractor",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loggedInUser = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.name || "";
    } catch {
      return "";
    }
  }, []);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">

      {/* Mobile sidebar */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
        />
      )}

      <div className="layout-content">

        <Header
          title={title}
          user={loggedInUser}
          onMenuClick={handleOpenSidebar}
        />

        <main className="layout-main">
          {children}
        </main>

      </div>
    </div>
  );
}

export default MainLayout;