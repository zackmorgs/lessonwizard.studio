import React from "react";

import Layout from "../../components/Layout";
import CalendarDatePicker from "../../components/CalendarDatePicker";

export default function CalendarIndex() {
  return (
    <Layout>
      {/* <header className="header">
                <h1 className="h1">Calendar</h1>
            </header> */}
      <div className="mt-4">
        <CalendarDatePicker defaultOpen={true} />
      </div>
    </Layout>
  );
}
