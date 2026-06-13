import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Account from './pages/auth/Account';

import Lessons from './pages/lessons/Index';
import LessonById from './pages/lessons/LessonById';
import NewLesson from './pages/lessons/NewLesson';
import EditLesson from './pages/lessons/EditLesson';

import SongLists from './pages/song-lists/Index';
import SongListById from './pages/song-lists/SongListById';

import Songs from './pages/songs/Index';
import SongById from './pages/songs/SongById';
import NewSong from './pages/songs/NewSong';

import Students from './pages/students/Index';
import NewStudent from './pages/students/NewStudent';
import StudentPage from './pages/students/StudentPage';


export default function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />

        <Route path="/lessons" element={<Lessons />} />
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
        <Route path="/students/:id" element={<StudentPage />} />'
      </Route>
    </Routes>
  );
}

