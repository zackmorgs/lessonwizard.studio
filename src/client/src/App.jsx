import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Account from './pages/auth/Account';

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
      </Route>
    </Routes>
  );
}

