import { useEffect, useState } from "react";
import axios from "axios";
import "./UserModal.css";

function UserModal({ isOpen, onClose, user, onUserCreated }) {
  const isEdit = !!user;

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    team_id: "",
    phone: "",
    designation: "",
    status: "Active",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    loadTeams();

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (user) {
      const names = user.name.split(" ");

      setFormData({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" "),
        email: user.email || "",
        role: user.role || "",
        team_id: user.team_id || "",
        phone: user.phone || "",
        designation: user.designation || "",
        status: user.status || "Active",

        // Always blank
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const loadTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setTeams(response.data.teams);
      }
    } catch (error) {
      console.error("Unable to load teams", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Current Form Data:");
    console.log(formData);

    if (isEdit) {
      try {
        const token = localStorage.getItem("token");

        const payload = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: formData.role,
          team_id: Number(formData.team_id),
          phone: formData.phone,
          designation: formData.designation,
          status: formData.status,
        };
        if (formData.password || formData.confirmPassword) {
          if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
          }

          payload.password = formData.password;
        }

        console.log("========== UPDATE PAYLOAD ==========");
        console.log(payload);
        console.log("team_id:", payload.team_id);
        console.log("typeof:", typeof payload.team_id);
        console.log("===================================");

        await axios.put(
          `https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/users/${user.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("User updated successfully.");
        setFormData(emptyForm);

        if (onUserCreated) {
          onUserCreated();
        }

        onClose();
        return;
      } catch (error) {
        console.error(error);

        alert(error.response?.data?.message || "Unable to update user.");
        return;
      }
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role ||
      !formData.team_id ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        team_id: Number(formData.team_id),
        phone: formData.phone,
        designation: formData.designation,
        status: formData.status,
      };

      console.log("========== CREATE PAYLOAD ==========");
      console.log(payload);
      console.log("===================================");

      await axios.post("https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/users", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User created successfully.");
      setFormData(emptyForm);

      if (onUserCreated) {
        onUserCreated();
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to create user.");
    }
  };

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <div>
            <h2>{isEdit ? "Edit User" : "Add New User"}</h2>
            <p>{isEdit ? "Update user details." : "Create a new user."}</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="user-form" autoComplete="off">
          <div className="form-group">
            <label>First Name *</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Register As *</label>

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="contractor">Contractor</option>
              <option value="client">Client</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Team *</label>

            <select
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
            >
              <option value="">Select Team</option>

              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <>
            <div className="form-group">
              <label>{isEdit ? "New Password" : "Password *"}</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder=""
              />
            </div>

            <div className="form-group">
              <label>
                {isEdit ? "Confirm New Password" : "Confirm Password *"}
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder=""
              />
            </div>
          </>
        </div>

        <div className="user-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="create-btn" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
