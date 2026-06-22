import React from "react";

import Layout from "../../components/Layout";

import Breadcrumbs from "./../../components/Breadcrumbs";

import CalendarDatePicker from "../../components/CalendarDatePicker";

export default function CalendarIndex() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <Breadcrumbs to="/" label="Dashboard" />
        {/* <header className="header text-center">
        <h1 className="h1">Calendar</h1>
      </header> */}
        <div className="mt-4">
          <CalendarDatePicker defaultOpen={true} />
        </div>
      </div>
    </Layout>
  );
}
