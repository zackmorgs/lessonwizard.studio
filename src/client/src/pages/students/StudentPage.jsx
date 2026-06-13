import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";
import InstrumentPicker from "../../components/InstrumentPicker";
import LessonList from "../../components/LessonList";

import { getStudentById, getStudentLessons, updateStudent, deleteStudent } from "../../services/studentService";

export default function StudentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([getStudentById(id), getStudentLessons(id)])
            .then(([studentData, lessonData]) => {
                setStudent(studentData);
                setLessons(lessonData);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm(`Delete ${student.name}? This cannot be undone.`)) return;
        try {
            await deleteStudent(id);
            navigate("/students");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Layout>
                <p className="p-6 text-sm text-gray-500">Loading...</p>
            </Layout>
        );
    }

    if (error || !student) {
        return (
            <Layout>
                <p className="p-6 text-sm text-red-600">{error ?? "Student not found."}</p>
            </Layout>
        );
    }

    console.log(student);

    return (
        <Layout>
            <div className="panel max-w-2xl mx-auto mt-8 flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link to="/students" className="text-sm text-blue-600 hover:underline">&larr; All Students</Link>
                        <h1 className="text-3xl font-semibold mt-1">{student.name}</h1>
                        {student.age > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">Age {student.age}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to={`/students/${id}/edit`}
                            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Instruments */}
                <div className="">
                    <InstrumentPicker
                        value={student.instruments ?? []}
                        onChange={async (instruments) => {
                            const updated = { ...student, instruments };
                            setStudent(updated);
                            try {
                                await updateStudent(id, updated);
                            } catch (err) {
                                setError(err.message);
                            }
                        }}
                    />
                </div>

                {/* Goals */}
                {student.goals && (
                    <div className="bg-white">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Goals</h2>
                        <div
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: student.goals }}
                        />
                    </div>
                )}

                {/* Lessons */}
                <div className="bg-white ">
                    <LessonList lessons={lessons} studentId={student.id} />
                    {/* <Link to={`/lessons/new?studentId=${id}`} className="btn btn-success mt-4">
                        Add Lesson
                    </Link> */}
                </div>

            </div>
        </Layout>
    );
}

