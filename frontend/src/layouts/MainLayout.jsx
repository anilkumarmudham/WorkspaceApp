import "./MainLayout.css";
import { useMemo } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function MainLayout({
  children,
  title = "Home",
  role = "contractor",
}) {
  const loggedInUser = useMemo(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.name || "";
  });

  return (
    <div className="layout">
      <Sidebar role={role} />

      <div className="layout-content">
        <Header
          title={title}
          user={loggedInUser}
        />

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;