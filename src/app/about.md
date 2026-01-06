# About MediPort

This document provides a high-level overview of the MediPort project, including its purpose, technical requirements, and operational procedures.

## 1. Project Abstract

MediPort is a modern, secure, and user-centric digital health identity platform designed to centralize and manage a patient's complete medical data. The core mission is to empower patients with full ownership and control over their health records while providing a secure, auditable channel for healthcare professionals—such as doctors, chemists, and lab technicians—to access this information based on their role.

The platform is built on a robust role-based access control (RBAC) system, ensuring that data is only accessible to authorized individuals. Key features include tailored dashboards for each user role, comprehensive patient profiles, secure prescription management, an AI-powered medication conflict checker, and a unique Emergency QR Access system for first responders. By leveraging modern web technologies and a secure cloud backend, MediPort aims to create a unified, transparent, and efficient healthcare data ecosystem.

## 2. Software Requirement Specification

To run, develop, and deploy the MediPort application, the following software and services are required:

- **Development Environment**:
  - **Node.js**: Version 18.0 or later.
  - **Package Manager**: `npm` (version 9.x or later) or a compatible alternative like `yarn` or `pnpm`.
  - **Operating System**: macOS, Windows (with WSL), or a Linux distribution.
  - **Code Editor**: Visual Studio Code (recommended) or any other modern text editor.

- **Technology Stack**:
  - **Framework**: Next.js 15 (App Router)
  - **Language**: TypeScript
  - **UI Library**: React 19, Shadcn/UI
  - **Styling**: Tailwind CSS
  - **Backend Services**:
    - **Firebase Authentication**: For user registration, login, and role management.
    - **Firebase Firestore**: As the primary NoSQL database for storing all application data (patient profiles, prescriptions, reports, etc.).
  - **Generative AI**: Google Genkit for the AI Medication Conflict Checker.

- **Cloud Services**:
  - **Firebase Project**: A configured Firebase project is necessary to connect the application to its backend services.

## 3. Methodology

1.  Implemented a centralized data model for a unified patient digital identity.
2.  Developed a patient-centric system with Role-Based Access Control (RBAC).
3.  Integrated an AI service to check for medication conflicts automatically.
4.  Created an Emergency QR feature for instant access to life-saving information.
5.  Secured all data using Firebase Authentication and granular Firestore Security Rules.
