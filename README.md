# Alumni Influencer Platform

A full-stack web application designed to connect and showcase alumni. The platform allows users to build comprehensive professional profiles, manage their employment and educational history, and participate in a bidding system to become a "Featured Alumni." It also supports a developer tier with API key management.

## Features

* **User Authentication:** Secure signup, login, password reset, and email verification using JWT and Bcrypt.
* **Rich Profiles:** Users can add and manage their bio, profile image, LinkedIn URL, and detailed history including:
  * Degrees & Universities
  * Certifications & Courses
  * Professional Licences
  * Employment History
* **Bidding System:** Users can place bids to be showcased as the "Featured Alumni" for specific dates.
* **Analytics & Reports:** Data visualization on the frontend (using Recharts) and PDF generation capabilities (using jsPDF and html2canvas).
* **Developer API:** Role-based access control (User vs. Developer) allowing developers to generate and manage API keys to interact with platform data.
* **API Documentation:** Built-in Swagger UI for exploring backend endpoints.

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 19 with Vite
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS v4
* **Data Fetching:** Axios
* **Data Visualization:** Recharts
* **Utilities:** jsPDF, html2canvas, PapaParse

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (using `mysql2`)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Security:** Helmet, Express Rate Limit, csurf, CORS
* **File Uploads:** Multer
* **Email Service:** Nodemailer
* **Documentation:** Swagger UI Express & Swagger JSDoc
* **Task Scheduling:** Node Cron

## Database Schema Overview

The MySQL database (`schema.sql`) consists of the following core tables:
* `users`: Authentication and role management (`user`, `developer`).
* `profiles`: Core user information (bio, social links, profile images).
* `bids` & `featured_alumni`: System for bidding to be featured on the platform.
* `employment_history`, `degrees`, `certifications`, `courses`, `licences`: Professional and academic portfolio tables.
* `api_keys`: Management for developer API access.
* `tokens`: Tables for email verification, password resets, and JWT blacklisting.

## Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* MySQL Server running locally or remotely

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd AlumniPlatform
