import React from "react";

import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <header className="text-center">
        <div className="p-4">
          {/* <img
            src="/assets/logo-transparent.png"
            alt="zoilerplate logo"
            className="mb-4"
          /> */}
          <h1 className="text-4xl font-semibold">lessonwizard.studio</h1>
          <p className="mt-4 text-lg text-gray-600">
            A free and open-source lesson planning tool for teachers, by teachers.
          </p>
        </div>
      </header>
      <section>
        <div className="p-4">
          <p>Content</p>
        </div>
      </section>
    </Layout>
  );
}
