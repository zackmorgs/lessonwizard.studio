import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import GlobalSearch from "../components/GlobalSearch";
import TodayView from "./TodayView";
import CalendarDatePicker from "../components/CalendarDatePicker";
import StudentList from "../components/StudentList";
import Tags from "../components/Tags";
import SongList from "../components/SongList";
import DocumentsList from "../components/DocumentsList";

import { useAuth } from "../contexts/AuthContext";
import { getStudents } from "../services/studentService";
import { todaysLessons } from "../services/lessonService";
import { getLessonDaysInMonth } from "../services/lessonService";
import { getSongs } from "../services/songService";
import { getDocuments } from "../services/documentService";
// let students_list = [
//   {
//     id: "1",
//     name: "John Doe",
//   },
//   {
//     id: "2",
//     name: "Jane Doe",
//   },
//   {
//     id: "3",
//     name: "Emily Davis",
//   },
//   {
//     id: "4",
//     name: "Bob Brown",
//   },
//   {
//     id: "4",
//     name: "Mary Smith",
//   },
//   {
//     id: "4",
//     name: "Alice Johnson",
//   },
// ];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.displayName?.split(" ")[0];

  const [students, setStudents] = useState([]);
  const [todaysLessonsList, setTodaysLessonsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    todaysLessons()
      .then(setTodaysLessonsList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const [songs, setSongs] = useState([]);
  useEffect(() => {
    getSongs()
      .then(setSongs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    getDocuments()
      .then(setDocuments)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="md:max-w-md lg:max-w-full mx-auto">
        <header className="dashboard-header p-4 mx-auto">
          <h1 className="h1 flex items-center justify-left gap-2 lg:justify-center lg:text-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.5em"
              viewBox="0 -960 960 960"
              width="1.5em"
              fill="#999"
            >
              <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
            </svg>
            <span>{name ? `${name}'s` : "My"} Dashboard</span>
          </h1>
        </header>
        <div className="lg:max-w-xl mx-auto">
          <GlobalSearch />
        </div>
        <div className="lg:max-w-4xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 items-start">
            <TodayView todaysLessons={todaysLessonsList} defaultOpen={true} />
            <CalendarDatePicker
              getLessonDaysInMonth={getLessonDaysInMonth}
              defaultOpen={true}
            />
          </div>
        </div>
        <div className="lg:max-w-4xl mx-auto">
          <div className="lg:grid lg:grid-cols-2">
            <StudentList studentList={students} defaultOpen={false} />
            <SongList songList={songs} defaultOpen={false} />
          </div>
        </div>
        <div className="lg:max-w-4xl mx-auto">
          <DocumentsList documents={documents} defaultOpen={false} showControls={false} />
        </div>
        <div className="lg:max-w-4xl mx-auto">
          <Tags defaultOpen={false} />
        </div>
      </div>
    </>
  );
}
