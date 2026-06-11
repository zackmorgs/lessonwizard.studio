import React from "react";
import { loginWithGoogle } from "../../services/authService";

import Layout from "./../../components/Layout";

import { Authenticated, Unauthenticated } from "../../contexts/AuthContext";

export default function Login() {
  return (
    <Layout>
      <Unauthenticated>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm p-8">
            <h1 className="text-xl font-semibold mb-6">Sign in</h1>
            <button
              onClick={() => loginWithGoogle()}
              className="w-full border rounded px-4 py-2 text-sm"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <header className="header">
          <div className="p-4">
            <h1 className="text-2xl font-bold">You are already signed in</h1>
          </div>
        </header>
      </Authenticated>
    </Layout>
  );
}
