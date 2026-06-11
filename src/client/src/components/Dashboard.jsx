import React from "react";

import Layout from "../components/Layout";
import TodayView from "./TodayView";
import CalendarDatePicker from "../components/CalendarDatePicker";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.displayName?.split(" ")[0];

  return (
    <>
      <header className="dashboard-header p-4">
        <h1 className="h1">{name ? `${name}'s` : "My"} Dashboard</h1>
      </header>
      <TodayView />
      <CalendarDatePicker />
    </>
  );
}
