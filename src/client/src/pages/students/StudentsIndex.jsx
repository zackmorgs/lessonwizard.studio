import React, { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import StudentList from "../../components/StudentList";
import { useAuth } from "../../contexts/AuthContext";
import { getStudents } from "../../services/studentService";

export default function StudentPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getStudents()
            .then(setStudents)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
     
    return (    
        <Layout>
            <header id="user_students">
                <div className="panel">
                    <h2 className="h2">{user?.displayName ? `${user.displayName}'s Students (${students.length})` : "Students"}</h2>
                </div>
            </header>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <StudentList studentList={students} />
            )}
        </Layout>
    );
}

