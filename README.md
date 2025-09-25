# Aarogyam - Unified Healthcare Platform

Aarogyam is a modern, unified healthcare platform designed to connect patients, doctors, and government health schemes through a single, intuitive interface. Built with a focus on user experience and data security, it aims to streamline healthcare management for everyone.

## Technologies Used

This project is built with a modern, robust stack:

- **Vite**: For a lightning-fast development experience.
- **React**: For building a dynamic and responsive user interface.
- **TypeScript**: For type safety and improved code quality.
- **shadcn/ui**: For a beautiful and accessible component library.
- **Tailwind CSS**: For a utility-first CSS framework that allows for rapid UI development.
- **React Router DOM**: for handling routing within the application.

## Core Features

- **Role-Based Dashboards**: Separate, tailored dashboards for patients and doctors.
- **QR Code & NFC Integration**: For quick identification and seamless authentication.
- **Family Management**: Allows users to manage the health records of their family members.
- **Recent Visits**: A comprehensive history of all medical consultations.

## Access Control Features

To ensure data privacy and security, Aarogyam implements the following access control rules:

- **Family Member Access**: When a family member's ABHA ID is added, the primary user gains permanent view access to their records. This access is revoked only when the family member is deleted from the user's profile.

- **Doctor Access (NFC/QR)**: When a doctor logs in by scanning a patient's QR code or NFC card, they are granted temporary access to the patient's records. This access is automatically revoked once the medical history for that visit is submitted, ensuring the session is closed securely.

- **Citizen Self-Access (NFC/QR)**: When a citizen scans their own QR code or taps their NFC card, they are granted a temporary 5-minute session to view their own medical data. This is a security measure to prevent unauthorized access on public or shared devices.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Installation

1. Clone the repo
   ```sh
   git clone <YOUR_PROJECT_GIT_URL>
   ```
2. Navigate to the project directory
   ```sh
   cd Aarogyam
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Start the development server
   ```sh
   npm run dev
   ```

