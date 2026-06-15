import React from "react";

import { loginWithGoogle } from "../services/authService";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { Authenticated, Unauthenticated } from "./../contexts/AuthContext";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <Layout>
      <Unauthenticated>
        <header id="header_main" className="text-center relative">
          <div id="header_main_content" className="p-4">
            {/* <img
            src="/assets/logo-transparent.png"
            alt="zoilerplate logo"
            className="mb-4"
          /> */}
            <h1 className="h1 text-4xl font-semibold mb-4">
              Stop Winging It. Start Teaching with a Plan.
            </h1>
            <p className="text-lg"></p>
            <p className="mt-2 mb-4 text-lg">
              A free and open-source lesson planning tool for teachers, by
              teachers.
            </p>
            <div className="flex flex-col items-center justify-center">
              {/* <Link
              to="/login"
              className="btn btn-primary btn-lg mt-8"
              alt="Login button"
            >
              <img
                src="/assets/svg/icon-login.svg"
                alt="Login Icon"
                className="icon"
              />
              <span className="btn-text">Login</span>
            </Link> */}
              <button
                className="btn btn-primary btn-lg mt-6"
                alt="Log In button"
                onClick={() => loginWithGoogle()}
              >
                <img
                  src="/assets/svg/icon-login.svg"
                  alt="Login Icon"
                  className="icon"
                />
                <span className="btn-text">Log In with Google</span>
              </button>
            </div>
          </div>
        </header>
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </Layout>
  );
}
