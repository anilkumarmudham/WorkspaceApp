import "./Home.css";
import { FiFileText, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [lastReport, setLastReport] = useState(null);

  useEffect(() => {
    loadLastReport();
  }, []);

  const loadLastReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5001/api/reports/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.reports.length > 0) {
        setLastReport(response.data.reports[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome Back 👋</h1>

        <p>
          Welcome to the APTIMIZED Internal Workspace Portal.
        </p>
      </div>

      <div className="dashboard-cards">

        <div
          className="dashboard-card clickable"
          onClick={() => navigate("/contractor/weekly-reports")}
        >
          <FiFileText className="card-icon" />

          <h3>Submit Weekly Report</h3>

          <p>Create and submit your weekly work report.</p>
        </div>

        <div className="dashboard-card">

          <FiClock className="card-icon" />

          <h3>Last Submission</h3>

          {lastReport ? (
            <>
              <p>{formatDate(lastReport.reporting_date)}</p>

              <span className="status submitted">
                {lastReport.status}
              </span>
            </>
          ) : (
            <>
              <p>No reports submitted yet.</p>

              <span className="status pending">
                Pending
              </span>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Home;