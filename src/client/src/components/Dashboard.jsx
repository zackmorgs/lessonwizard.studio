import React from "react";

import Layout from "../components/Layout";
import TodayView from "./TodayView";

export default function Dashboard() {
    return (
        <>
            <header className="dashboard-header p-4">
                <h1>Dashboard</h1>
            </header>
            <TodayView />
        </>
    );
}

