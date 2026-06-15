import React from "react";

import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <header className="header">
        <div className="p-4 text-center">
          <h1 className="h1 text-4xl">About</h1>
          <p className="subtitle">
            Built for music teachers who are tired of juggling spreadsheets,
            sticky notes, and their brain.
          </p>
        </div>
      </header>
      <section className="section">
        <div className="panel">
          <h2 className="h2 text-2xl mb-4">What It Is</h2>
          <p>
            lessonwizard.studio is a student management and curriculum planning
            platform designed specifically for private music instructors. It
            helps you organize your students, track lesson progress, manage song
            assignments, and build structured learning paths—all in one place.
          </p>
        </div>
        <div className="panel">
          <h2 className="h2 text-2xl mb-4">The Problem We're Solving</h2>
          <p>If you teach privately, you know the struggle</p>
          <ul className="list-disc ml-6">
            <li className="mt-4">
              "Did I work on that exercise with Sarah last time?"
            </li>
            <li className="mt-4">
              "What songs has John already learned? I don't want to repeat
              myself."
            </li>
            <li className="mt-4">
              "Where did I file that guitar tab for 'Seven Nation Army'?"
            </li>
          </ul>
        </div>
        <div className="panel">
          <h2 className="h2 text-2xl mb-4">What It Does</h2>
          <p>If you teach privately, you know the struggle</p>
          <ul className="list-disc ml-6">
            <li className="mt-4">
              <b>Student Management</b> — Every student gets a dedicated profile
              with lesson history, instruments, notes, and everything you need
              at a glance.
            </li>
            <li className="mt-4">
              <b>Song Tracking</b> — Track which songs each student is working
              on, has completed, or abandoned. Never double-book a song again.
              See the full history of what you've taught, for whom, and when.
            </li>
            <li className="mt-4">
              <b>Lesson Planning</b> — Create lesson plans in advance so you're
              never scrambling mid-lesson.
            </li>
          </ul>
        </div>
        <div className="panel">
          <h2 className="h2 text-2xl mb-4">Built for the Way Music Teachers Actually Work</h2>
          <p>This isn't enterprise software dressed up as something friendly. It's built around the real workflow of a private music instructor: juggling 20+ students across multiple instruments, trying to keep lessons progressing while remembering every detail from months ago.</p>
        </div>
      </section>
    </Layout>
  );
}
