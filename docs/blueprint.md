# **App Name**: MediPort

## Core Features:

- Patient Profile Management: Securely store and manage patient information, including personal details, medical history, and emergency contacts. Patients control data visibility.
- Medical History & Report Upload: Enable verified doctors/labs to upload medical reports (PDF/Image), categorized as recent or archived.
- Medication & Prescription Hub: Maintain a record of current and past prescriptions with dosage history and basic auto conflict-checking tool based on heart/brain conditions, allergies, pregnancy status, and reproductive health.
- Surgeries & Procedures Log: Log past surgeries and upcoming procedures with notes and reminder flags.
- Emergency QR Access: Generate a QR code that displays blood group, critical allergies, life-threatening conditions, life-saving medications/devices, and emergency contacts for emergency responders without requiring a login.
- Role-Based Access Control: Implement role-based access control using Firebase Security Rules with field-level restrictions. Each patient must have a globally unique Medical Portfolio ID (MPI).
- Audit Logging: Track data access, modifications, and approvals in audit logs to ensure compliance. Patients must approve or revoke access at any time.

## Style Guidelines:

- Primary color: Deep blue (#2962FF) to inspire trust and stability within a clinical context.
- Background color: Light blue (#E0F7FA), a desaturated hue of the primary to promote calmness.
- Accent color: A teal-ish green (#388E3C) for notifications and important actions.
- Body font: 'PT Sans' for a warm, modern, highly-readable feel.
- Headline font: 'Space Grotesk', matched with 'PT Sans', for a contemporary feel.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use universally-recognized healthcare icons from a library like Font Awesome.
- Maintain a clean, consistent layout with a focus on readability and ease of navigation. Use a grid-based system for responsive design.
- Employ subtle animations for transitions and feedback to improve user experience. Use animations to highlight changes or confirmations.