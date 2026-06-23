import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthorizedView from "./components/AuthorizedView";
import UnauthorizedView from "./components/UnauthorizedView";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Account from "./pages/auth/Account";
import Logout from "./pages/auth/Logout";

import LessonsIndex from "./pages/lessons/LessonsIndex";
import LessonById from "./pages/lessons/LessonById";
import NewLesson from "./pages/lessons/NewLesson";
import EditLesson from "./pages/lessons/EditLesson";

import SongLists from "./pages/song-lists/Index";
import SongListById from "./pages/song-lists/SongListById";

import Songs from "./pages/songs/SongsIndex";
import SongById from "./pages/songs/SongById";
import NewSong from "./pages/songs/NewSong";

import Students from "./pages/students/StudentsIndex";
import NewStudent from "./pages/students/NewStudent";
import StudentPage from "./pages/students/StudentPage";
import LessonsOnDate from "./pages/calendar/LessonsOnDate";

import CalendarIndex from "./pages/calendar/CalendarIndex";

import DocumentsIndex from "./pages/documents/DocumentsIndex";
import NewDocumentFromImages from "./pages/documents/AddDocumentFromImages";
import AddDocumentFromCamera from "./pages/documents/AddDocumentsFromCamera";
import AddDocumentToSong from "./pages/documents/AddDocumentToSong";
import DocumentById from "./pages/documents/DocumentById";

import TagsIndex from "./pages/tags/TagsIndex";
import TagPage from "./pages/tags/TagPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/logout" element={<Logout />} />

      {/* Guest-only routes */}
      <Route element={<UnauthorizedView />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AuthorizedView />}>
        <Route path="/account" element={<Account />} />

        <Route path="/lessons" element={<LessonsIndex />} />
        <Route path="/lessons/new" element={<NewLesson />} />
        <Route path="/lessons/:id" element={<LessonById />} />
        <Route path="/lessons/:id/edit" element={<EditLesson />} />

        <Route path="/songlists" element={<SongLists />} />
        <Route path="/songlists/:id" element={<SongListById />} />

        <Route path="/songs" element={<Songs />} />
        <Route path="/songs/new" element={<NewSong />} />
        <Route path="/songs/:id" element={<SongById />} />

        <Route path="/students" element={<Students />} />
        <Route path="/students/new" element={<NewStudent />} />
        <Route path="/students/:id" element={<StudentPage />} />

        <Route path="/documents" element={<DocumentsIndex />} />
        <Route
          path="/documents/new/from-images"
          element={<NewDocumentFromImages />}
        />
        <Route
          path="/documents/new/from-camera"
          element={<AddDocumentFromCamera />}
        />
        <Route
          path="/documents/new/for-song"
          element={<AddDocumentToSong />}
        />

        <Route path="/documents/:id" element={<DocumentById />} />

        <Route path="/tags" element={<TagsIndex />} />
        <Route path="/tags/:name" element={<TagPage />} />

        <Route path="/schedule/:year/:month/:day" element={<LessonsOnDate />} />
        <Route path="/calendar" element={<CalendarIndex />} />
        <Route path="/calendar/:year/:month/:day" element={<LessonsOnDate />} />
      </Route>
    </Routes>
  );
}
