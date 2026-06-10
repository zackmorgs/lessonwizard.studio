import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "../../services/authService";

import Layout from "./../../components/Layout";

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle token delivered via Google OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/account");
    }

    getMe()
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!user) return <p className="p-8 text-sm text-gray-500">Loading…</p>;

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-16 p-8">
      <h1 className="text-xl font-semibold mb-6">Account</h1>

      <dl className="text-sm flex flex-col gap-2">
        {user.displayName && (
          <>
            <dt className="text-gray-500">Name</dt>
            <dd>{user.displayName}</dd>
          </>
        )}
        <dt className="text-gray-500">Email</dt>
        <dd>{user.email}</dd>
        <dt className="text-gray-500">Sign-in methods</dt>
        <dd className="flex gap-2">
          {user.hasPassword && (
            <span className="border rounded px-2 py-0.5 text-xs">Password</span>
          )}
          {user.hasGoogle && (
            <span className="border rounded px-2 py-0.5 text-xs">Google</span>
          )}
        </dd>
      </dl>

      <button
        onClick={handleLogout}
        className="mt-8 w-full border rounded px-4 py-2 text-sm"
      >
        Sign out
      </button>
    </div>
    </Layout>
  );
}
