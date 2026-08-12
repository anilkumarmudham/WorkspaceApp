import { useEffect, useState } from "react";
import axios from "axios";
import "../ManageClients/ManageClients.css";

function ManageClients() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5001/api/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setClients(res.data.clients);
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

    if (!window.confirm("Delete selected clients?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5001/api/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: selected,
        },
      });

      setSelected([]);

      loadClients();
    } catch (err) {
      console.error(err);
      alert("Unable to delete clients.");
    }
  };

  const handleSave = async () => {
    if (!clientName.trim()) {
      return alert("Enter client name.");
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/admin/clients",
        {
          client_name: clientName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setClientName("");
      setShowAdd(false);

      loadClients();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to save.");
    }
  };

  return (
    <div className="manage-card">
      <h3>Manage Clients</h3>

      <div className="client-list">
        {clients.map((client) => (
          <label key={client.id} className="client-item">
            <input
              type="checkbox"
              checked={selected.includes(client.id)}
              onChange={() => toggleSelection(client.id)}
            />

            {client.client_name}
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

        <button className="add-btn" onClick={() => setShowAdd(!showAdd)}>
          + Add Client
        </button>
      </div>

      {showAdd && (
        <div className="add-client">
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageClients;
