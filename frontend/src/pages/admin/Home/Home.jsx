import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import ManageClients from "../../../components/ManageClients/ManageClients";
import ManageTeams from "../../../components/ManageTeams/ManageTeams";

import {
  FaUsers,
  FaUserTie,
  FaUserFriends,
  FaBuilding,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const Home = () => {
  const getCurrentWeekRange = () => {
    const today = new Date();

    const currentDay = today.getDay(); // Sunday=0 ... Saturday=6

    let friday = new Date(today);

    if (currentDay >= 5) {
      // Friday, Saturday
      friday.setDate(today.getDate() - (currentDay - 5));
    } else {
      // Sunday to Thursday
      friday.setDate(today.getDate() - (currentDay + 2));
    }

    const thursday = new Date(friday);
    thursday.setDate(friday.getDate() + 6);

    const format = (date) => {
      return date.toISOString().split("T")[0];
    };

    return {
      from: format(friday),
      to: format(thursday),
    };
  };
  const openCurrentWeekReports = () => {
    const { from, to } = getCurrentWeekRange();

    navigate(`/admin/weekly-reports?from=${from}&to=${to}`);
  };
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    contractors: 0,
    employees: 0,
    clients: 0,
    submitted: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setDashboard(response.data.dashboard);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };
  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: <FaUsers />,
      color: "#2563eb",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Contractors",
      value: dashboard.contractors,
      icon: <FaUserTie />,
      color: "#16a34a",
      onClick: () => navigate("/admin/users?role=Contractor"),
    },
    {
      title: "Employees",
      value: dashboard.employees,
      icon: <FaUserFriends />,
      color: "#9333ea",
      onClick: () => navigate("/admin/users?role=Employee"),
    },
    {
      title: "Clients",
      value: dashboard.clients,
      icon: <FaBuilding />,
      color: "#f97316",
      onClick: () => navigate("/admin/users?role=Client"),
    },
    {
      title: "Reports Submitted",
      value: dashboard.submitted,
      icon: <FaClipboardList />,
      color: "#0ea5e9",
      onClick: openCurrentWeekReports,
    },
    // {
    //   title: "Pending Reports",
    //   value: dashboard.pending,
    //   icon: <FaClock />,
    //   color: "#ef4444",
    //   onClick: () => navigate("/admin/weekly-reports?status=Pending"),
    // },
    // {
    //   title: "Overdue Reports",
    //   value: dashboard.overdue,
    //   icon: <FaExclamationTriangle />,
    //   color: "#dc2626",
    //   onClick: () => navigate("/admin/overdue-reports"),
    // },
  ];

  return (
    <div className="admin-home">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>
          Welcome back! Here's an overview of your workspace and contractor
          activities.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div
            className="stat-card"
            key={index}
            onClick={item.onClick}
            style={{ cursor: "pointer" }}
          >
            <div className="stat-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>

            <div className="stat-content">
              <h2>{item.value}</h2>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Manage Data</h3>

          <ManageClients />

          <hr className="manage-divider" />

          <ManageTeams />
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>

          <button onClick={() => navigate("/admin/users?action=add")}>
            Add New User
          </button>

          <button onClick={() => navigate("/admin/weekly-reports")}>
            View Weekly Reports
          </button>

          <button onClick={() => navigate("/admin/users")}>
            Manage Employees
          </button>

          <button onClick={() => navigate("/admin/weekly-reports")}>
            Export Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
