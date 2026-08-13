import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Users.css";
import UserModal from "../../../components/UserModal/UserModal";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";

function Users() {
  const [searchParams] = useSearchParams();

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const role = searchParams.get("role");

    setRoleFilter(role ? role.toLowerCase() : "");
  }, [searchParams]);

  useEffect(() => {
    const action = searchParams.get("action");

    if (action === "add") {
      setSelectedUser(null);
      setShowModal(true);
    }
  }, [searchParams]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const formattedUsers = response.data.users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user.role || "").toLowerCase(),

          team: user.team_name || "-",
          team_id: user.team_id,

          status: user.status,
          phone: user.phone || "",
          designation: user.designation || "",
        }));

        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatusToggle = async (id) => {
    const selected = users.find((u) => u.id === id);

    if (!selected) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        selected.status === "Active" ? "deactivate" : "activate"
      } ${selected.name}?`,
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/admin/users/${id}`,
        {
          name: selected.name,
          email: selected.email,
          role: selected.role,
          team_id: selected.team_id,
          phone: selected.phone,
          designation: selected.designation,
          status: selected.status === "Active" ? "Inactive" : "Active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await loadUsers();

      alert(
        `User ${
          selected.status === "Active" ? "deactivated" : "activated"
        } successfully.`,
      );
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to update user status.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "" || user.role === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All Status" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage Employees, Contractors, Clients and Vendors.</p>
        </div>

        <button className="add-user-btn" onClick={handleAddUser}>
          <FaPlus />
          Add User
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="employee">Employee</option>
          <option value="contractor">Contractor</option>
          <option value="client">Client</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Team</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </td>

                  <td>{user.team}</td>

                  <td>
                    <span
                      className={
                        user.status === "Active"
                          ? "badge active"
                          : "badge inactive"
                      }
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-btn edit"
                      onClick={() => handleEditUser(user)}
                    >
                      <FaEdit />
                    </button>

                    {user.status === "Active" ? (
                      <button
                        className="icon-btn deactivate"
                        onClick={() => handleStatusToggle(user.id)}
                      >
                        <FaUserSlash />
                      </button>
                    ) : (
                      <button
                        className="icon-btn activate"
                        onClick={() => handleStatusToggle(user.id)}
                      >
                        <FaUserCheck />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#777",
                  }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserCreated={() => {
          loadUsers();
          setShowModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default Users;
