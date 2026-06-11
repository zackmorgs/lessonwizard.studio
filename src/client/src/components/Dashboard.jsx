import React from "react";

import Layout from "../components/Layout";
import TodayView from "./TodayView";
import CalendarDatePicker from "../components/CalendarDatePicker";
import StudentList from "../components/StudentList";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.displayName?.split(" ")[0];

  return (
    <>
      <header className="dashboard-header p-4">
        <h1 className="h1 flex items-center justify-left gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#999"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
          <span>{name ? `${name}'s` : "My"} Dashboard</span>
        </h1>
      </header>
      <TodayView />
      <CalendarDatePicker />
      <StudentList />
    </>
  );
}
