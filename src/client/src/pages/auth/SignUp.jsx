import React from "react";
import { loginWithGoogle } from "../../services/authService";

import Layout from "./../../components/Layout";
import { Authenticated, Unauthenticated } from "../../contexts/AuthContext";


export default function SignUp() {
  return (
    <Layout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm p-8">
          <h1 className="text-xl font-semibold mb-6">Create account</h1>
          <button
            onClick={() => loginWithGoogle()}
            className="w-full btn btn-primary"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </Layout>
  );
}
