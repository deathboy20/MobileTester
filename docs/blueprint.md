# **App Name**: MobileTester

## Core Features:

- APK Upload and Processing: Allow users to upload an Android APK and a README.md file. Store these files in Firebase Cloud Storage and associate them with a new job in Firestore.
- Firebase Test Lab Integration: Trigger tests on Firebase Test Lab for the uploaded APK across a selection of virtual Android devices.
- Real-time Test Status Monitoring: Monitor the status of running tests in real-time using Firestore listeners.
- AI-Powered Report Generation: Generate comprehensive PDF reports summarizing test results and suggesting bug fixes, leveraging the Groq API tool to analyze logs and provide actionable insights. Include embedded emulator screenshots and videos.
- Device Selection: Enable users to select a subset of the top 20 Android devices for testing.
- Authentication: Allow users to authenticate via email/password and Google OAuth.
- Responsive UI: Create a responsive user interface, suitable for browsing the site, and monitoring and operating tests within Android emulator environments.

## Style Guidelines:

- Primary color: Indigo (#6366F1) to align with Material Design 3's palette.
- Background color: Light gray (#F9FAFB), a desaturated version of the primary color, creating a clean and modern look.
- Accent color: Violet (#8B5CF6), to create a subtle contrast and highlight key elements.
- Headline font: 'Space Grotesk', a proportional sans-serif, is used for headlines, providing a computerized, techy, and scientific feel. Body font: 'Inter', a grotesque-style sans-serif.
- Lucide React icons will represent actions, status, and file types.
- Use a grid-based layout with responsive columns that adapt to different screen sizes (emulators and desktop).
- Employ subtle fade-in and scale animations using Framer Motion for UI transitions.