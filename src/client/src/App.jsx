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

import Lessons from "./pages/lessons/Index";
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

import CalendarIndex from './pages/calendar/CalendarIndex';

import TagsIndex from './pages/tags/TagsIndex';
import TagPage from './pages/tags/TagPage';

export default function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/login"
          element={
            <UnauthorizedView>
              <Login />
            </UnauthorizedView>
          }
        />
        <Route
          path="/signup"
          element={
            <UnauthorizedView>
              <SignUp />
            </UnauthorizedView>
          }
        />
        <Route
          path="/account"
          element={
            <AuthorizedView>
              <Account />
            </AuthorizedView>
          }
        />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/lessons"
          element={
            <AuthorizedView>
              <Lessons />
            </AuthorizedView>
          }
        />
        <Route
          path="/lessons/new"
          element={
            <AuthorizedView>
              <NewLesson />
            </AuthorizedView>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <AuthorizedView>
              <LessonById />
            </AuthorizedView>
          }
        />
        <Route
          path="/lessons/:id/edit"
          element={
            <AuthorizedView>
              <EditLesson />
            </AuthorizedView>
          }
        />

        <Route
          path="/songlists"
          element={
            <AuthorizedView>
              <SongLists />
            </AuthorizedView>
          }
        />
        <Route
          path="/songlists/:id"
          element={
            <AuthorizedView>
              <SongListById />
            </AuthorizedView>
          }
        />

        <Route
          path="/songs"
          element={
            <AuthorizedView>
              <Songs />
            </AuthorizedView>
          }
        />
        <Route
          path="/songs/new"
          element={
            <AuthorizedView>
              <NewSong />
            </AuthorizedView>
          }
        />
        <Route
          path="/songs/:id"
          element={
            <AuthorizedView>
              <SongById />
            </AuthorizedView>
          }
        />

        <Route
          path="/students"
          element={
            <AuthorizedView>
              <Students />
            </AuthorizedView>
          }
        />
        <Route
          path="/tags"
          element={
            <AuthorizedView>
              <TagsIndex />
            </AuthorizedView>
          }
        />
         <Route
          path="/tags/:name"
          element={
            <AuthorizedView>
              <TagPage /> 
            </AuthorizedView>
          }
        />
        <Route
          path="/students/new"
          element={
            <AuthorizedView>
              <NewStudent />
            </AuthorizedView>
          }
        />
        <Route
          path="/students/:id"
          element={
            <AuthorizedView>
              <StudentPage />
            </AuthorizedView>
          }
        />

        <Route
          path="/schedule/:year/:month/:day"
          element={
            <AuthorizedView>
              <LessonsOnDate />
            </AuthorizedView>
          }
        />
        <Route
          path="/calendar/:year/:month/:day"
          element={
            <AuthorizedView>
              <LessonsOnDate />
            </AuthorizedView>
          }
        />

        <Route
          path="/tags"
          element={
            <AuthorizedView>
              <LessonsOnDate />
            </AuthorizedView>
          }
        />

        <Route
          path="/calendar"
          element={
            <AuthorizedView>
              <CalendarIndex />
            </AuthorizedView>
          }
        />
      </Route>
    </Routes>
  );
}
