# MobileTester - AI-Powered Android Testing Platform

**Test once, ship confidently.** MobileTester is a production-ready MVP that automates Android APK testing across 20+ devices with AI-powered bug analysis and comprehensive reports.

![MobileTester Dashboard](public/screenshot.png)

## 🚀 Features

- **Parallel Testing**: Test your APK across 20 popular Android devices simultaneously
- **AI-Powered Analysis**: Get intelligent bug detection and fix suggestions using Groq AI
- **Comprehensive Reports**: Download detailed PDF reports with screenshots and videos
- **Real-time Updates**: Monitor test progress with live status updates
- **Free Tier Friendly**: Built with free tiers of Firebase, Vercel, and Groq
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, Firebase, and more

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) with TypeScript |
| Styling | Tailwind CSS + ShadCN UI Components |
| Authentication | Firebase Auth (Email/Password) |
| Database | Firebase Firestore |
| Storage | Vercel Blob (APKs) + Firebase Storage (Reports) |
| Testing | Firebase Test Lab |
| AI Analysis | Groq API (Llama 3 model) |
| PDF Generation | PDF-lib |
| Deployment | Vercel |

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Firebase project with authentication and Firestore enabled
- A Vercel account for blob storage
- A Groq API key for AI analysis
- Git installed

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mobile-tester.git
cd mobile-tester
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.local.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Groq AI Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# Next.js Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-here
NEXTAUTH_URL=http://localhost:9002
NODE_ENV=development
```

### 4. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database in production mode
4. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Use the credentials in your `.env.local`

### 5. Groq API Setup

1. Sign up at [console.groq.com](https://console.groq.com)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file

### 6. Vercel Blob Setup

1. Install Vercel CLI: `npm i -g vercel`
2. Create a blob storage token: `vercel blob create`
3. Add the token to your `.env.local` file

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) to see the application.

## 📁 Project Structure

```
mobile-tester/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (main)/            # Protected pages
│   │   ├── about/             # About page
│   │   ├── api/               # API routes
│   │   └── jobs/[id]/         # Job details pages
│   ├── components/            # React components
│   │   ├── ui/                # ShadCN UI components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── upload/            # Upload components
│   │   └── layout/            # Layout components
│   ├── constants/             # App constants
│   │   └── devices.ts         # Top 20 Android devices
│   ├── lib/                   # Utility libraries
│   │   ├── ai.ts              # Groq AI integration
│   │   ├── blob.ts            # Vercel Blob storage
│   │   ├── testlab.ts         # Firebase Test Lab
│   │   ├── types.ts           # TypeScript types
│   │   └── utils.ts           # Utility functions
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── .env.local.example         # Environment template
└── README.md                  # This file
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload APK and create job |
| POST | `/api/tests/start` | Start testing process |
| GET | `/api/jobs` | Get user's jobs |
| GET | `/api/jobs?id={id}` | Get specific job |
| GET | `/api/jobs/{id}/report` | Download PDF report |
| POST | `/api/jobs` | Cancel job |
| DELETE | `/api/jobs?id={id}` | Delete job |

## 🧪 Testing Flow

1. **Upload**: User uploads APK file with optional README
2. **Queue**: Job is created and queued for processing
3. **Testing**: APK is tested in parallel across 20 Android devices using Firebase Test Lab
4. **Analysis**: AI analyzes test logs and generates bug reports
5. **Report**: Comprehensive PDF report is generated with findings
6. **Download**: User can download the report and view detailed results

## 📱 Supported Devices

The platform tests on 20 popular Android devices including:

- Samsung Galaxy S24, S23, S22 Ultra
- Google Pixel 8 Pro, Pixel 7, Pixel 6a
- OnePlus 11, Xiaomi 13 Pro
- And 12 more popular devices across different manufacturers

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# One-click deploy
vercel --prod
```

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `GROQ_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)

## 🔍 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

### Firebase Emulators (Optional)

For local development with Firebase emulators:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
firebase emulators:start
```

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Authentication Issues**
- Ensure your service account key is properly formatted
- Check that Authentication is enabled in Firebase Console

**2. Groq API Errors**
- Verify your API key is correct
- Check your usage limits on Groq console

**3. File Upload Issues**
- Ensure Vercel Blob token has read/write permissions
- Check file size limits (50MB max)

**4. Build Errors**
- Run `npm run typecheck` to identify TypeScript issues
- Ensure all environment variables are set

## 🗺️ Roadmap

### v1.0 - MVP ✅
- Android APK testing
- AI-powered analysis
- PDF reports
- Real-time updates

### v1.1 - Enhanced Testing
- [ ] iOS app testing support
- [ ] Custom device selection
- [ ] Performance benchmarking
- [ ] Team collaboration features
- [ ] API access for CI/CD

### v2.0 - SaaS Platform
- [ ] Multi-tenant dashboard
- [ ] Advanced analytics
- [ ] White-label solutions
- [ ] Enterprise features
- [ ] Custom pricing tiers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Built with Love in Ghana

MobileTester is crafted by passionate developers who understand the challenges of mobile app testing. We're committed to making quality assurance accessible and efficient for developers worldwide.

---

**Need help?** Open an issue or contact us at [support@mobiletester.dev](mailto:support@mobiletester.dev)

**Visit our website:** [mobiletester.dev](https://mobiletester.dev)
