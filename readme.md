# MediCare HMS - Advanced Hospital Management System

**MediCare HMS** is a modern, full-stack Hospital Management System (HMS) built with the MERN stack (MongoDB, Express.js, React, Node.js). It is designed to be a comprehensive, scalable, and user-friendly platform that digitizes and streamlines all aspects of hospital operations, from patient registration and electronic health records to billing, pharmacy, and advanced administrative controls.

The system features distinct, secure portals for Administrators, Doctors, and Patients, each tailored with role-specific functionalities to ensure a seamless and efficient healthcare delivery process.

## Table of Contents

1.  [Project Vision](#project-vision)
2.  [Core Features](#core-features)
    *   [Phase 1: Foundation & Clinical Core](#phase-1-foundation--clinical-core)
    *   [Phase 2: Management & Operations](#phase-2-management--operations)
    *   [Phase 3: Integration & Advanced Modules](#phase-3-integration--advanced-modules)
3.  [Technology Stack](#technology-stack)
4.  [Project Structure](#project-structure)
5.  [Setup and Installation](#setup-and-installation)
6.  [Running the Application](#running-the-application)
7.  [API Endpoints Overview](#api-endpoints-overview)
8.  [Contribution Guidelines](#contribution-guidelines)

## Project Vision

The goal of MediCare HMS is to create a single, unified digital ecosystem for healthcare facilities. By replacing fragmented, paper-based workflows with an intelligent, integrated system, we aim to:
*   **Enhance Patient Care:** Provide doctors with instant access to comprehensive patient data, enabling better and faster clinical decisions.
*   **Improve Operational Efficiency:** Automate routine administrative and operational tasks, reducing manual effort and minimizing errors.
*   **Empower Patients:** Give patients secure access to their own health records, appointments, and communication channels.
*   **Ensure Data-Driven Management:** Equip administrators with powerful analytics and reporting tools for strategic decision-making.
*   **Maintain Security & Compliance:** Build a secure, robust, and compliant platform that adheres to healthcare data standards like HIPAA and ABDM.

## Core Features

The development of MediCare HMS is planned in three major phases, progressively building out the system's capabilities.

### Phase 1: Foundation & Clinical Core (In Progress / Partially Complete)

This phase establishes the foundational architecture and core clinical functionalities.

*   ✅ **Role-Based Access Control (RBAC):**
    *   Secure, JWT-based authentication for different user roles (Admin, Doctor, Patient).
    *   Dedicated dashboards and navigation for each role.
    *   Dynamic permission management system for creating custom roles with granular access levels.

*   ✅ **User Management (Admin Portal):**
    *   Add, view, and manage profiles for Doctors, Patients, and other Staff.
    *   Search and filter user lists.
    *   Auto-generation of unique IDs for all users to prevent manual errors.

*   ✅ **Electronic Medical Records (EMR) / Electronic Health Records (EHR):**
    *   **Patient EMR Hub (Doctor Portal):** A central, tabbed interface for viewing a patient's complete medical history.
    *   **Patient Demographics:** Comprehensive patient profiles with family linking capabilities based on a shared phone number.
    *   **Appointment History:** Chronological list of all past and upcoming appointments.
    *   **Medical Records:** Secure storage and retrieval of documents like lab reports and scans.

*   ✅ **Critical Care (ICU) Flow Chart:**
    *   A highly detailed, interactive digital flow sheet for intensive care monitoring.
    *   Hourly tracking of vital signs, GCS, ventilator settings, intake/output, and nursing care.
    *   Dynamic tables for managing IV fluids, medications, and blood products.
    *   **Voice Command Integration:** Hands-free data entry for key parameters.

*   ✅ **Appointment & Scheduling Management:**
    *   **Doctor Schedule Management:** An interface for doctors to define their weekly working hours, breaks, and consultation slot durations.
    *   **Dynamic Availability:** The system calculates real-time appointment slot availability based on the doctor's defined schedule.
    *   **Admin/Receptionist Booking:** A sophisticated modal for searching patients and booking them into available slots.
    *   Status tracking (Scheduled, Completed, Cancelled).

*   ✅ **Department Management:**
    *   Admins can create and manage hospital departments.
    *   Dashboard view showing statistics (doctor and patient count) for each department.

---

### Phase 2: Management & Operations (Planned)

This phase focuses on the business and operational aspects of the hospital.

*   🚧 **Billing and Invoicing:**
    *   Creation and management of billable services (consultations, lab tests, room charges).
    *   Automated invoice generation for patient encounters.
    *   Payment tracking (full, partial), balance management, and receipt generation.
    *   Integration with EMR to automatically add charges for services rendered.

*   🚧 **Pharmacy Management:**
    *   Inventory management for medications (stock levels, expiry dates, supplier info).
    *   E-prescription integration from the EMR.
    *   Dispensing workflow with barcode verification.
    *   Automated stock alerts and reorder management.

*   🚧 **Laboratory Information System (LIS):**
    *   Test order management from the EMR.
    *   Sample tracking (collection, processing, analysis).
    *   Interface with lab equipment for automated result capture.
    *   Result entry, validation, and automated report generation.
    *   Seamless delivery of reports to the patient's EMR.

*   🚧 **Radiology Information System (RIS):**
    *   Similar to LIS but for imaging tests (X-ray, CT, MRI).
    *   Scheduling for imaging equipment.
    *   Integration with PACS (Picture Archiving and Communication System).
    *   Radiologist workflow for reporting.

*   🚧 **Ward / In-Patient Department (IPD) Management:**
    *   Admission, Discharge, and Transfer (ADT) management.
    *   Bed allocation and real-time bed status dashboard.
    *   Ward-specific nursing workflows and documentation.
    *   Dietary management and request integration.

*   🚧 **Human Resources (HR) Management:**
    *   Employee database for all staff.
    *   Duty roster and shift management.
    *   Leave management and payroll integration hooks.

---

### Phase 3: Integration & Advanced Modules (Planned)

This phase extends the system's capabilities with external integrations and specialized modules.

*   ⏳ **Third-Party Administrator (TPA) Management:**
    *   Management of insurance panels and patient insurance details.
    *   Pre-authorization request and approval tracking.
    *   Streamlined billing and claims submission for insured patients.

*   ⏳ **Data Analytics and Reporting:**
    *   Dashboards with Key Performance Indicators (KPIs) like bed occupancy, patient wait times, and revenue per department.
    *   Custom report generator for financial, clinical, and operational data.

*   ⏳ **Integrations:**
    *   **Financial Accounting:** Integration with popular accounting software (e.g., Tally, QuickBooks).
    *   **Communication:** SMS, WhatsApp, and Email integration for appointment reminders, notifications, and reports.
    *   **ABDM (Ayushman Bharat Digital Mission):** Compliance with India's digital health ecosystem standards for health ID and data sharing.

*   ⏳ **Specialized Modules:**
    *   **Blood Bank Management:** Donor management, inventory tracking of blood units, cross-matching, and issuance workflow.
    *   **Ambulance Management:** Fleet tracking, dispatch system, and trip logging.
    *   **Biomedical Waste Management:** Tracking and reporting of waste generation as per regulatory standards.
    *   **Online Consultation:** A dedicated module for video consultations, integrated with scheduling and billing.

## Technology Stack

*   **Frontend:** React, Vite, Tailwind CSS, Framer Motion
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT)
*   **File Storage:** Local storage with Multer (can be upgraded to cloud storage like S3)
*   **Real-time Communication (Planned):** Socket.IO or WebSockets

## Project Structure

```
/
├── backend/
│   ├── controllers/        # Business logic for routes
│   ├── middlewares/        # Custom middleware (auth, error handling)
│   ├── models/             # Mongoose schemas and models
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper functions (ID generators, loggers)
│   ├── .env                # Environment variables (DB URI, JWT Secret)
│   ├── index.js            # Main Express server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/         # Static assets (images, fonts)
    │   ├── components/     # Reusable UI components (layout, forms, etc.)
    │   ├── contexts/       # React contexts (e.g., AuthContext)
    │   ├── hooks/          # Custom React hooks
    │   ├── layouts/        # Page layout components (e.g., DashboardLayout)
    │   ├── pages/          # Top-level page components for each role
    │   ├── services/       # API service layer (api.js)
    │   ├── App.jsx         # Main application component with routing
    │   └── main.jsx        # Application entry point
    ├── .env                # Frontend environment variables
    └── package.json
```

