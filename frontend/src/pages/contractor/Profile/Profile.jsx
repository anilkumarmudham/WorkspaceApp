import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    team_name: "",
    designation: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleSave = async () => {
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        alert("Please fill all password fields.");
        return;
      }

      if (
        passwordData.newPassword !== passwordData.confirmPassword
      ) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        await axios.put(
          "https://workspace-backend-anil-gae9cbh0gnb9cfce.southindia-01.azurewebsites.net/api/auth/change-password",
          {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Password updated successfully.");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Unable to change password."
        );
      }
    } else {
      alert("Nothing to update.");
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value={profile.role}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Team</label>
            <input
              type="text"
              value={profile.team_name}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              value={profile.designation}
              disabled
            />
          </div>
        </div>

        <hr />

        <h2>Change Password</h2>

        <div className="profile-grid">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Profile;