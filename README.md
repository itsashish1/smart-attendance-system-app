<div align="center">

#  Unified College Interaction System

**A centralized web platform bridging the gap between students, clubs, faculty, and administration.**

[![Academic Project](https://img.shields.io/badge/Purpose-Academic-blue?style=flat-square)](.)
[![Stack](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)](.)
[![Team](https://img.shields.io/badge/Team-Shadow-purple?style=flat-square)](.)
[![License](https://img.shields.io/badge/License-Academic%20Use%20Only-orange?style=flat-square)](.)

</div>

---

## Overview

The **Unified College Interaction System** is a full-stack web platform designed to centralize all college-related information and interactions into a single, organized digital hub. It aims to eliminate the fragmentation caused by scattered communication channels — WhatsApp groups, physical notice boards, and informal messages — and replace them with a structured, reliable, and accessible solution for students, faculty, and administrators.

---

## Problem Statement

In most colleges, critical information is spread across multiple unofficial channels, leading to:

- Missed event deadlines and late registrations
- Difficulty finding verified faculty contact details
- No structured platform for academic discussions
- Inefficient, informal announcement methods
- Poor visibility into club activities and college happenings

There is a strong need for a **unified system** that organizes and simplifies these interactions in one place.

---

## Solution

The **Unified College Interaction System** provides:

- A centralized hub for clubs, events, announcements, and faculty details
- Digital event management with online registration and participant tracking
- A structured discussion forum for academic and general queries
- Role-based access for students, club admins, faculty, and system admins
- A scalable and practical platform suited for real-world college deployment

---

## Key Features

| Module | Description |
|---|---|
| **Clubs & Societies** | Browse all college clubs, view descriptions, coordinators, and activities |
| **Event Management** | Create, publish, and manage events with one-click student registration |
| **Discussion Forum** | Structured Q&A-based academic and general discussions |
| **Faculty Directory** | Searchable database with verified contact details and department info |
| **Announcements** | Centralized digital notice board for official updates and deadlines |
| **Global Search** | Search across clubs, events, faculty, and forum posts in one place |
| **Support Tickets** | Users can raise support tickets; admins can manage and reply |

---

## User Roles

### Student
- Browse clubs, events, and announcements
- Register for events online
- Participate in discussion forums
- Access verified faculty contact information
- Raise support tickets

### Club Admin / Authorized User
- Create and manage club events
- Post club-related updates and announcements

### Faculty / System Admin
- Publish official announcements
- Manage faculty directory entries
- Handle support tickets and platform moderation

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│      User Interface · Role-based Views           │
│      Event Registration · Forum · Dashboard      │
└───────────────────┬─────────────────────────────┘
                    │ REST API (HTTP/JSON)
┌───────────────────▼─────────────────────────────┐
│              Backend (Node.js + Express)          │
│   Auth · Role-based Access · Business Logic       │
│   Event Handling · Forum · Support Tickets        │
└───────────────────┬─────────────────────────────┘
                    │ Mongoose ODM
┌───────────────────▼─────────────────────────────┐
│                  Database (MongoDB)               │
│  Users · Clubs · Events · Posts · Registrations  │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens) |
| **Version Control** | Git & GitHub |

---

## Project Documents

| Document | Link |
|---|---|
| Synopsis Report | [`docs/synopsis_report.pdf`](docs/synopsis_report.pdf) |
| Presentation (PDF) | [`docs/presentation_ppt.pdf`](docs/presentation_ppt.pdf) |
| Presentation (PPT) | [`docs/presentation.pptx`](docs/presentation.pptx) |

---

## Future Enhancements

- [ ] Email & push notification alerts for events and announcements
- [ ] Mobile application (Android / iOS)
- [ ] Advanced analytics dashboard for event participation trends
- [ ] Internship and placement opportunity board
- [ ] AI-powered forum answer suggestions
- [ ] Calendar integration for event reminders

---

## Academic Relevance

This project is well-suited for academic evaluation as it:

- Solves a **real and recurring problem** in college environments
- Demonstrates **full-stack development** skills (MERN stack)
- Applies **system design principles** including role-based access control
- Is **practical, scalable**, and straightforward to explain during viva
- Promotes a **digital and collaborative campus culture**

---

## Project Team — Shadow

| S.No | Name | Email ID | Role |
|:----:|------|----------|------|
| 1 | **Harshit Jaiswal** | 2301010397@krmu.edu.in | Leader |
| 2 | Ashish Yadav | 2301010413@krmu.edu.in | Member |
| 3 | Chetan Parmar | 2301010384@krmu.edu.in | Member |
| 4 | Harsh Deo | 2301010386@krmu.edu.in | Member |

---

## License

This project is developed solely for **academic purposes**. All rights reserved by Team Shadow, KRMU.

---

<div align="center">
Made with love by <strong>Team Shadow</strong> · K.R. Mangalam University
</div>
