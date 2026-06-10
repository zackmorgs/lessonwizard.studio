import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, loginWithGoogle } from "../../services/authService";

import Layout from "./../../components/Layout";

export default function SignUp() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, displayName);
      navigate("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-xl font-semibold mb-6">Create account</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <button
          onClick={() => loginWithGoogle()}
          className="w-full mt-3 border rounded px-4 py-2 text-sm"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </Layout>
  );
}
