import { useEffect, useState } from "react";
import axios from "axios";
import "../ManageClients/ManageClients.css";

function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setTeams(res.data.teams);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelection = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;

    if (!window.confirm("Delete selected teams?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            ids: selected,
          },
        }
      );

      setSelected([]);

      loadTeams();
    } catch (err) {
      console.error(err);

      alert("Unable to delete teams.");
    }
  };

  const handleSave = async () => {
    if (!teamName.trim()) {
      return alert("Enter team name.");
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/teams",
        {
          team_name: teamName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeamName("");
      setShowAdd(false);

      loadTeams();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to save.");
    }
  };

  return (
    <div className="manage-card">
      <h3>Manage Teams</h3>

      <div className="client-list">
        {teams.map((team) => (
          <label
            key={team.id}
            className="client-item"
          >
            <input
              type="checkbox"
              checked={selected.includes(team.id)}
              onChange={() => toggleSelection(team.id)}
            />

            {team.team_name}
          </label>
        ))}
      </div>

      <div className="client-actions">
        <button
          className="delete-btn"
          disabled={selected.length === 0}
          onClick={handleDelete}
        >
          Delete Selected
        </button>

        <button
          className="add-btn"
          onClick={() => setShowAdd(!showAdd)}
        >
          + Add Team
        </button>
      </div>

      {showAdd && (
        <div className="add-client">
          <input
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageTeams;