# lessonwizard.studio

A student management and curriculum planning platform built specifically for private music teachers.

# Progress Videos
- [Day 2 - Overall Design, Dashboard Progress](https://youtu.be/BanQRwQe-3o)

## Overview

lessonwizard.studio.studio helps music instructors organize students, track lesson progress, manage song assignments, and build structured learning paths. It is designed around the realities of private music education, where teachers need quick access to student history, assigned material, and lesson planning tools.

## Core Goals

- Track student progress over time
- Record songs, exercises, and concepts taught
- Reduce lesson preparation time
- Create reusable teaching resources
- Maintain consistent curriculum pathways
- Improve communication between lessons

---

# Features

## Student Management

Each student has a dedicated profile containing:

### Student Information

- Name
- Instrument(s)
- Age
- Notes

### Lesson History

Every lesson can be recorded with:

- Date
- Notes
    - Concepts covered
- Songs worked on

---

## Song Tracking

One of the most common challenges for music teachers is remembering which songs have been used with which students.

lessonwizard.studio solves this by tracking:

- Lessons model contains this information
    - Songs currently being learned
    - Songs previously completed
    - Songs attempted but abandoned
    - Date assigned
    - Date completed
    - Difficulty level
    - Associated techniques

### Benefits

Before assigning a song, teachers can immediately see:

- Whether the student has played it before


---

## Song Library

A centralized catalog of songs that can be reused across all students.

Each song may include:

- Title
- Artist
- Difficulty rating
- Genre
- Instrument
- Tuning
- Techniques covered
- Notes
- External resources
- Tabs or sheet music references
- Tags
- Files (PDF)
- has swearing boolean (useful for younger students)

Example:
- Seven Nation Army 
    - #beginner
    - #rock

- Viva la Vida
    - #beginner
    - #open-chords
    - #pop


- Creep - Radiohead
    - #intermediate-beginner
    - #barre-chords
    - #indie


### Custom Lists

Teachers can create query tags to get lists of songs.

Ex. #rock, #barre, #metal, #jazz

---

## Lesson Planning

Create lesson plans in advance using the user interface. 

See Models.md for Lesson attributes.

---

## Search and Recommendations

Quickly find songs using tags:

- Songs by difficulty
- Songs by technique
- Songs by tuning
- Songs by genre
- Songs used with specific students

---

# Technology Stack

## Backend

- .NET
- ASP.NET Core
- MongoDB

## Frontend

- React
- VanillaJS
- Tailwind CSS

## Authentication

- Google Authentication only


---

# Vision

lessonwizard.studio.studio aims to become the central operating system for lesson-based music teachers, combining student management, curriculum planning, lesson organization, and song tracking into a single platform that improves the execution and organization of the teaching experience.

# Developement Notes
## Routes
-  /dashboard 

- /students 
- /students/new 
- /students/:studentId 

- /lessons 
- /lessons/new 
- /lessons/:lessonId 

- /songs 
- /songs/new 
- /songs/:songId 

- /song-lists 
- /song-lists/:listId 

- /settings