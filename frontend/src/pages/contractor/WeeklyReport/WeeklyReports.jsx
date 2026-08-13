import { useState, useEffect } from "react";
import axios from "axios";
import "./WeeklyReports.css";

function WeeklyReports() {
  const today = new Date();

  const formatDate = (date) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ===============================
  // Get Current Reporting Week
  // Friday → Thursday
  // ===============================
  const formatDisplayDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getWeekDates = () => {
    const current = new Date();

    const day = current.getDay();

    let daysFromFriday;

    switch (day) {
      case 0:
        daysFromFriday = 2;
        break;

      case 1:
        daysFromFriday = 3;
        break;

      case 2:
        daysFromFriday = 4;
        break;

      case 3:
        daysFromFriday = 5;
        break;

      case 4:
        daysFromFriday = 6;
        break;

      case 5:
        daysFromFriday = 0;
        break;

      case 6:
        daysFromFriday = 1;
        break;

      default:
        daysFromFriday = 0;
    }

    const weekFrom = new Date(current);

    weekFrom.setDate(current.getDate() - daysFromFriday);

    const weekTo = new Date(weekFrom);

    weekTo.setDate(weekFrom.getDate() + 6);

    return {
      weekFrom: formatDate(weekFrom),

      weekTo: formatDate(weekTo),
    };
  };
  const [clients, setClients] = useState([]);
  useEffect(() => {
    console.log("Clients state updated:", clients);
  }, [clients]);
  const initialDates = getWeekDates();

  const [reportingDate, setReportingDate] = useState(formatDate(today));

  const [weekFrom, setWeekFrom] = useState(initialDates.weekFrom);

  const [weekTo, setWeekTo] = useState(initialDates.weekTo);

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const [editingReport, setEditingReport] = useState(null);

  const [formData, setFormData] = useState({
    client: "",

    clientSpoc: "",

    team: "",

    project: "",

    workDetails: "",
  });

  // ===============================
  // Input Handlers
  // ===============================

  const handleReportingDateChange = (e) => {
    setReportingDate(e.target.value);
  };

  const handleWeekFromChange = (e) => {
    const selectedDate = new Date(e.target.value);

    const endDate = new Date(selectedDate);

    endDate.setDate(selectedDate.getDate() + 6);

    setWeekFrom(formatDate(selectedDate));

    setWeekTo(formatDate(endDate));
  };

  const handleWeekToChange = (e) => {
    setWeekTo(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // Submit Report
  // ===============================
  const loadClients = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/clients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
      console.log("Clients:", response.data.clients);
      if (response.data.success) {
        setClients(response.data.clients);
      }
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  };

  const loadMyReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/reports/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadClients();
    loadMyReports();
  }, []);
  const handleEdit = (report) => {
    console.log(report);
    console.log("week_from =", report.week_from);
    console.log("week_to =", report.week_to);
    setEditingReport(report);

    const reporting =
      report.last_edited_at || report.updated_at || report.created_at;

    const reportingDate = formatDate(reporting);

    const weekFrom = formatDate(report.week_from);

    const weekTo = formatDate(report.week_to);

    setReportingDate(reportingDate);

    setWeekFrom(weekFrom);

    setWeekTo(weekTo);

    setFormData({
      client: report.client_name,
      clientSpoc: report.client_spoc,
      team: report.team,
      project: report.project_name,
      workDetails: report.work_details,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");

      window.location.href = "/";

      return;
    }

    try {
      setLoading(true);

      let response;

      if (editingReport) {
        response = await axios.put(
          `https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/reports/${editingReport.id}`,
          {
            reporting_date: reportingDate,
            week_from: weekFrom,
            week_to: weekTo,

            client_name: formData.client,
            team: formData.team,
            client_spoc: formData.clientSpoc,
            project_name: formData.project,
            work_details: formData.workDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        response = await axios.post(
          "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/reports",
          {
            reporting_date: reportingDate,
            week_from: weekFrom,
            week_to: weekTo,
            status: "Submitted",
            client_name: formData.client,
            team: formData.team,
            client_spoc: formData.clientSpoc,
            project_name: formData.project,
            work_details: formData.workDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      alert(response.data.message);

      await loadMyReports();

      const dates = getWeekDates();

      setReportingDate(formatDate(new Date()));
      setWeekFrom(dates.weekFrom);
      setWeekTo(dates.weekTo);

      setFormData({
        client: "",
        clientSpoc: "",
        team: "",
        project: "",
        workDetails: "",
      });

      setEditingReport(null);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        alert("Session expired. Please login again.");

        window.location.href = "/";

        return;
      }

      alert(error.response?.data?.message || "Unable to submit weekly report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <div className="page-header">
        <h1>Weekly Reports</h1>

        <p>Submit your weekly work report.</p>
      </div>

      <div className="report-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reporting Date</label>

            <input
              type="date"
              name="reporting_date"
              value={reportingDate}
              onChange={handleReportingDateChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Week From</label>

              <input
                type="date"
                name="week_from"
                value={weekFrom}
                onChange={handleWeekFromChange}
              />
            </div>

            <div className="form-group">
              <label>Week To</label>

              <input
                type="date"
                name="week_to"
                value={weekTo}
                onChange={handleWeekToChange}
              />
            </div>
          </div>

          <div className="report-note">
            <strong>Reminder:</strong> Please submit your weekly report by the
            end of every Thursday.
          </div>

          <div className="form-group">
            <label>Client Name</label>

            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
            >
              <option value="">Select Client</option>

              {clients.map((client) => (
                <option key={client.id} value={client.client_name}>
                  {client.client_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Client SPOC</label>

            <input
              type="text"
              name="clientSpoc"
              placeholder="Enter Client SPOC"
              value={formData.clientSpoc}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Team</label>

            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              placeholder="Enter Team"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Name</label>

            <input
              type="text"
              name="project"
              placeholder="Enter Project Name"
              value={formData.project}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Weekly Work Details</label>

            <textarea
              rows="7"
              name="workDetails"
              placeholder="Describe your weekly work..."
              value={formData.workDetails}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : editingReport
                ? "Update Report"
                : "Submit Report"}
          </button>
        </form>
      </div>
      <div className="updated-reports">
        <h2>Updated Reports</h2>

        {reports.length === 0 ? (
          <p>No reports submitted yet.</p>
        ) : (
          reports.map((report) => (
            <div className="updated-report-card" key={report.id}>
              <p>
                <strong>Submitted :</strong>{" "}
                {formatDisplayDate(report.reporting_date)}
              </p>
              <p>
                <strong>Week :</strong> {formatDisplayDate(report.week_from)} -{" "}
                {formatDisplayDate(report.week_to)}
              </p>

              <p>
                <strong>Client :</strong> {report.client_name}
              </p>

              <p>
                <strong>Project :</strong> {report.project_name}
              </p>

              <p>
                <strong>Last Edited :</strong>{" "}
                {report.last_edited_at
                  ? formatDisplayDate(report.last_edited_at)
                  : "-"}
              </p>

              <button
                className="edit-report-btn"
                onClick={() => handleEdit(report)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WeeklyReports;
