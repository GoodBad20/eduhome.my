# Eduhome — Product Requirements Document (PRD)

## 1️⃣ Overview

**Project Name:** Eduhome  
**Type:** EdTech Platform (Web + Mobile)  
**Goal:** To create a digital platform that connects parents, tutors, and students — enabling seamless online learning management, progress tracking, and communication.  

Eduhome aims to make private tutoring more transparent and measurable for parents while simplifying lesson management for tutors.

---

## 2️⃣ Problem Statement

Parents often spend on private tuition without clear visibility into:
- What lessons are actually taught
- Whether the student is improving
- How tutors manage their schedule

Tutors also struggle with managing multiple students, tracking assignments, and communicating updates manually (via WhatsApp or spreadsheets).

---

## 3️⃣ Solution Summary

Eduhome provides a centralized dashboard for all stakeholders:
- **Parents:** Track progress, attendance, and payments.
- **Tutors:** Manage lesson plans, assignments, and student updates.
- **Students:** View tasks, complete assignments, and track their own learning goals.

---

## 4️⃣ Core Features (MVP Scope)

### 🧩 Parent Dashboard
- **Child Management:** Add, edit, and manage student accounts for children
- View child's performance and lesson history
- Track payment status and lesson credits
- Receive notifications on progress or upcoming lessons
- Messaging system with tutor

### 🧑‍🏫 Tutor Dashboard
- Create and assign lessons
- Upload learning materials and track student submission
- Update student progress and remarks
- Manage class schedules and attendance
- Dashboard overview of all active students

### 👩‍🎓 Student Interface (Parent-Managed)
- Access assigned lessons and materials (no independent login required)
- Submit homework/assignments online
- View tutor feedback and grades
- Track progress badges / learning milestones
- Simple interface accessible via parent account or student login (managed by parent)

### 👶 Child Account Creation (Parent Feature)
- Parents can create student accounts for their children
- No independent student signup - all student accounts are parent-managed
- Parents control login credentials and access
- Children can access their learning through parent-approved methods

### 📊 Student Progress Tracking
- Visual progress graph for each subject
- Weekly and monthly performance summaries
- Feedback log (tutor comments, parent remarks)

### 📅 Lesson Assignment System
- Tutors can assign lessons to one or multiple students
- Attach documents or links (e.g. Google Docs, YouTube)
- Auto-notify students and parents upon assignment
- Deadline and reminder notifications  

---

## 5️⃣ Technical Overview

### Tech Stack (Proposed)
| Layer | Technology |
|-------|-------------|
| Frontend | Next.js (React), TailwindCSS |
| Backend | Node.js + Express |
| Database | PostgreSQL (via Supabase / Prisma ORM) |
| Auth | Supabase Auth / Firebase Auth |
| Hosting | Vercel (frontend) + Supabase (backend & DB) |
| File Uploads | Supabase Storage / Firebase Storage |

---

## 6️⃣ User Flow

### Parent Flow
1. **Signup/Login** → Create parent account
2. **Add Children** → Create student accounts for children (name, grade, subjects)
3. **Find & Assign Tutors** → Browse tutors and schedule lessons
4. **Track Progress** → Monitor child's performance and attendance
5. **Manage Payments** → View upcoming payments and transaction history
6. **Communicate** → Message tutors and receive updates

### Tutor Flow
1. **Signup/Login** → Create tutor profile with qualifications
2. **Dashboard Overview** → View all assigned students and schedule
3. **Create Lessons** → Design lessons and assignments for students
4. **Track Progress** → Update student progress and provide feedback
5. **Manage Schedule** → Accept/reject lesson requests and manage calendar

### Student Flow (Parent-Managed)
1. **Access Learning** → Login with parent-provided credentials or access via parent account
2. **View Assignments** → See lessons and homework from tutors
3. **Complete Work** → Submit assignments and view feedback
4. **Track Progress** → See grades and learning achievements

### Child Account Creation Flow (Parent Feature)
1. **Parent Dashboard** → Click "Add Child" button
2. **Child Information** → Enter child's name, grade level, date of birth
3. **Account Setup** → Create login credentials for child
4. **Subject Selection** → Choose subjects the child needs help with
5. **Tutor Matching** → Get matched with qualified tutors
6. **Lesson Scheduling** → Book first lesson and begin learning journey

---

## 7️⃣ Product Demo Sections (for Pitch Deck)

### A. Parent Dashboard
- Overview: Student progress chart, next lesson schedule
- Tabs: Performance / Attendance / Payments / Chat

### B. Tutor Page
- List of active students
- Quick actions: Assign Lesson / Add Progress / Upload Material
- Calendar view for upcoming lessons

### C. Student Progress
- Visual bar chart or radar chart per subject
- Milestone badges (Gamification)
- “Last Updated by Tutor” timestamp

### D. Lesson Assignment
- Form to create lessons with attachments
- Notification preview: “New Assignment from Mr. Azlan”
- Student-side submission status (“Pending”, “Submitted”, “Reviewed”)

---

## 8️⃣ Monetization Strategy

- **Freemium Model:**  
  Tutors can onboard for free with limited students.  
  Premium tiers unlock more features (advanced analytics, automated reminders, unlimited students).

- **Revenue Streams:**
  - Subscription from tutors (monthly)
  - Transaction fee (for integrated payment system)
  - Institutional packages (for tuition centers)

---

## 9️⃣ Success Metrics (MVP KPIs)

| Metric | Target |
|---------|--------|
| Monthly Active Users | 500+ within 3 months |
| Tutor Retention Rate | 70% after 3 months |
| Average Session Duration | 5+ minutes per session |
| Parent Satisfaction Rating | ≥ 4.5 / 5 |

---

## 🔒 Disclaimer (for Pitch Deck / Investor Sharing)

This document and any accompanying materials are confidential and intended solely for internal review or investor evaluation purposes.  
Redistribution or public disclosure of this document without prior consent from the Eduhome team is strictly prohibited.

---

## 💬 Closing Statement

Eduhome is designed to transform home-based learning into a measurable, transparent, and rewarding experience for parents, tutors, and students.  
Let’s be the pioneer in redefining home education management.

---