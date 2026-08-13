import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./WeeklyReports.css";
import { FaSearch, FaFileExcel, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";
import WeeklyReportViewModal from "../../../components/WeeklyReportViewModal/WeeklyReportViewModal";

function WeeklyReports() {
  const [searchParams] = useSearchParams();
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from && to) {
      setFromDate(from);
      setToDate(to);

      fetchReports(from, to);
    } else {
      fetchReports();
    }
  }, [searchParams]);

  const fetchReports = async (from = "", to = "") => {
    try {
      const token = localStorage.getItem("token");

      const params = {};

      if (from) params.from = from;
      if (to) params.to = to;

      const response = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/reports",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
      }

      alert("Unable to load weekly reports.");
    } finally {
      setLoading(false);
    }
  };
  const handleDateChange = (type, value) => {
    if (type === "from") {
      setFromDate(value);

      if (toDate) {
        fetchReports(value, toDate);
      }
    } else {
      setToDate(value);

      if (fromDate) {
        fetchReports(fromDate, value);
      }
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        (report.employee || "").toLowerCase().includes(search.toLowerCase()) ||
        (report.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (report.client || "").toLowerCase().includes(search.toLowerCase()) ||
        (report.project || "").toLowerCase().includes(search.toLowerCase()) ||
        (report.spoc || "").toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [reports, search]);

  const isAllSelected =
    filteredReports.length > 0 &&
    filteredReports.every((report) => selectedRows.includes(report.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
      return;
    }

    setSelectedRows(filteredReports.map((r) => r.id));
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((row) => row !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleExport = () => {
    const rows =
      selectedRows.length > 0
        ? filteredReports.filter((r) => selectedRows.includes(r.id))
        : filteredReports;

    const excelData = rows.map((report) => ({
      Employee: report.employee,

      "Reporting Date": report.reportingDate,

      "Week From": report.weekFrom,

      "Week To": report.weekTo,

      Client: report.client,

      "Client SPOC": report.spoc,

      Team: report.team,

      Project: report.project,

      "Weekly Tasks": report.work,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Reports");

    XLSX.writeFile(workbook, "WeeklyReports.xlsx");
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Loading Weekly Reports...
      </div>
    );
  }

  return (
    <div className="weekly-reports-page">
      <div className="reports-header">
        <div>
          <h1>Weekly Reports</h1>
          <p>Review and manage contractor weekly reports.</p>
        </div>

        <button className="export-btn" onClick={handleExport}>
          <FaFileExcel />

          {selectedRows.length > 0
            ? `Export (${selectedRows.length})`
            : "Export Excel"}
        </button>
      </div>

      <div className="reports-toolbar">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search Contractor, Client, Project or SPOC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="date-filter">
          <label>From</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateChange("from", e.target.value)}
          />
        </div>

        <div className="date-filter">
          <label>To</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateChange("to", e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>

              <th style={{ minWidth: "170px" }}>Contractor</th>
              <th>Reporting Date</th>
              <th>Week</th>
              <th>Client</th>
              <th>Project</th>
              <th style={{ width: "110px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(report.id)}
                      onChange={() => handleRowSelect(report.id)}
                    />
                  </td>

                  <td>
                    <div className="employee-info">
                      <div className="employee-name">{report.employee}</div>

                      <div className="employee-email">{report.email}</div>
                    </div>
                  </td>
                  <td>
                    {formatDate(report.reportingDate)}
                    <br />
                    <small>{formatTime(report.submittedAt)}</small>
                  </td>

                  <td>
                    {formatDate(report.weekFrom)}
                    <br />
                    <small>to {formatDate(report.weekTo)}</small>
                  </td>

                  <td>{report.client}</td>

                  <td>{report.project}</td>

                  <td>
                    <div className="action-wrapper">
                      <button
                        className="icon-btn view"
                        title="View Report"
                        onClick={() => setSelectedReport(report)}
                      >
                        <FaEye />
                      </button>

                      {(report.edited === 1 || report.edited === true) && (
                        <span className="edited-badge">Edited</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "35px",
                  }}
                >
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <WeeklyReportViewModal
        isOpen={!!selectedReport}
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}

export default WeeklyReports;
