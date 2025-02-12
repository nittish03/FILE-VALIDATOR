'use client'
import React, { useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "AlphaBots",
    email: "AlphaBots@gmail.com",
    profilePic: "/user.jpg",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({ email: "", passwordMatch: "" });

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({ ...prev, email: emailRegex.test(value) ? "" : "Invalid email format" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({ ...prev, [id]: value }));

    if (id === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        passwordMatch: value === passwords.newPassword ? "" : "Passwords do not match",
      }));
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!errors.passwordMatch) {
      alert("Password updated successfully!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </header>

      {/* Profile Section */}
      <section className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div>
            <img
              id="profile-pic"
              src={profile.profilePic}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              id="upload-pic-btn"
              className="mt-2 text-blue-500 hover:underline"
              onClick={() => document.getElementById("upload-pic-input").click()}
            >
              Change Picture
            </button>
            <input
              type="file"
              id="upload-pic-input"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={handleProfilePicChange}
            />
          </div>

          {/* User Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-800" id="user-name">
              {profile.username}
            </h2>
            <p className="text-gray-600" id="user-email">
              {profile.email}
            </p>
          </div>
        </div>
      </section>

      {/* Edit Profile Section */}
      <section className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
        <form id="edit-profile-form" className="space-y-4" onSubmit={handleSaveProfile}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.username}
              onChange={handleProfileChange}
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={profile.email}
              onChange={handleProfileChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
        <form id="change-password-form" className="space-y-4" onSubmit={handleUpdatePassword}>
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.passwordMatch ? "border-red-500" : "border-gray-300"
              }`}
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            {errors.passwordMatch && <p className="text-red-500 text-sm">{errors.passwordMatch}</p>}
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update Password
          </button>
        </form>
      </section>
    </div>
  );
}
