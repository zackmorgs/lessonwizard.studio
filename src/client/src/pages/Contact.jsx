import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="md:max-w-4xl mx-auto">
        <header className="header">
          <div className="p-4">
            <h1 className="text-4xl font-semibold text-center mb-4">Contact</h1>
          </div>
        </header>
        
        <section className="section">
          <div className="panel">
            <p className="text-center">
              This project was created with love by{" "}
              <a
                href="https://www.zackmorgenthaler.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Zack Morgenthaler
              </a>
              .
            </p>
            <div className="items-center flex flex-row justify-center mt-4">
              <Link
                to="mailto:zackmorgenthaler@gmail.com"
                className="btn btn-success mx-auto text-center"
              >
                <img src="/assets/svg/icon-mail.svg" className="icon"/>

                <span className="btn-text">Contact Me</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
