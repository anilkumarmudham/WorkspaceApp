import "./WeeklyReportViewModal.css";

function WeeklyReportViewModal({ isOpen, report, onClose }) {
  if (!isOpen || !report) return null;
  const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB");
};

  return (
    <div className="weekly-report-overlay">
      <div className="weekly-report-modal">
        <div className="weekly-report-header">
          <h2>Weekly Report Details</h2>
          <p>Contractor Weekly Report</p>
        </div>

        <div className="weekly-report-body">
  <div className="report-grid">

    <div className="field">
      <label>Contractor Name</label>
      <div className="field-value">
        {report.employee || "-"}
      </div>
    </div>

    <div className="field">
      <label>Email</label>
      <div className="field-value">
        {report.email || "-"}
      </div>
    </div>

            <div className="field">
              <label>Reporting Date</label>
              <div className="field-value">
                {formatDate(report.reportingDate)}
              </div>
            </div>

            <div className="field">
              <label>Reporting Week</label>
              <div className="field-value">
                {formatDate(report.weekFrom)} to {formatDate(report.weekTo)}
              </div>
            </div>

            <div className="field">
              <label>Client</label>
              <div className="field-value">
                {report.client}
              </div>
            </div>

            <div className="field">
              <label>Client SPOC</label>
              <div className="field-value">
                {report.spoc}
              </div>
            </div>

            <div className="field">
              <label>Team</label>
              <div className="field-value">
                {report.team}
              </div>
            </div>

            <div className="field">
              <label>Project</label>
              <div className="field-value">
                {report.project}
              </div>
            </div>

            <div className="field full-width">
              <label>Weekly Work Summary</label>
              <div className="field-value textarea-view">
                {report.work || "No work submitted."}
              </div>
            </div>

            

          </div>
        </div>

        <div className="weekly-report-footer">
          <button
            className="close-report-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReportViewModal;