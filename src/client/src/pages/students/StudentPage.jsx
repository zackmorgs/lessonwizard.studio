import React from "react";

import Layout from "../../components/Layout";

import { getStudents } from "../../services/studentService";

// note: is individual student page

export default function StudentPage() {
    console.log(getStudents());
    return (    
        <Layout>
            <h1>Student Page</h1>
        </Layout>
    );
}

