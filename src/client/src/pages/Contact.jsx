import React from "react";
import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="md:max-w-4xl mx-auto">
        <header className="header">
          <div className="p-4">
            <h1 className="text-4xl font-semibold text-center">Contact</h1>
          </div>
        </header>
        <section className="section">
          <div className="panel">
            <p>
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
          </div>
        </section>
      </div>
    </Layout>
  );
}
