import React from "react";

import { Link } from "react-router-dom";

import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <header id="header_main" className="text-center">
        <div className="p-4">
          {/* <img
            src="/assets/logo-transparent.png"
            alt="zoilerplate logo"
            className="mb-4"
          /> */}
          <h1 className="title text-4xl font-semibold mb-4">lessonwizard.studio</h1>
          <p className="mt-2 mb-4 text-lg">
            A free and open-source lesson planning tool for teachers, by
            teachers.
          </p>
          <Link
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
          </Link>
          <Link
            to="/signup"
            className="btn btn-primary btn-lg mt-6"
            alt="Sign Up button"
          >
            <img
              src="/assets/svg/icon-signup.svg"
              alt="Sign Up Icon"
              className="icon"
            />
            <span className="btn-text">Sign Up</span>
          </Link>
        </div>
      </header>
    </Layout>
  );
}
