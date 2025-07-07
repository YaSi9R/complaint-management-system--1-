
Live-Link : https://complaint-management-system-1.vercel.app/


# Complaint Management System
A full-stack web application built with Next.js, MongoDB, and React that allows users to submit complaints and administrators to manage them efficiently.

## Features

### User Features
- Submit complaints with title, description, category, and priority
- Responsive design for mobile and desktop
- Real-time form validation
- Success notifications

### Admin Features
- View all complaints in a comprehensive dashboard
- Filter complaints by status and priority
- Update complaint status (Pending, In Progress, Resolved)
- View detailed complaint information
- Delete complaints
- Real-time statistics dashboard

### Email Notifications
- Automatic email notifications to admins when new complaints are submitted
- Email notifications when complaint status is updated
- HTML formatted emails with complete complaint details

## Authentication & Security

### User Management
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Separate user and admin roles
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **Protected Routes**: Client-side route protection based on authentication status
- **Session Management**: Automatic token refresh and logout functionality

### User Roles
- **Users**: Can submit complaints and view their own complaints
- **Admins**: Can view all complaints, update status, and manage the system

### Demo Accounts
For testing purposes, you can use these demo accounts:
- **Admin**: yasirali9720@gmail.com / 123123
- **User**: yasir.mohd9720@gmail.com / 123123

### Security Features
- HTTP-only cookies for token storage
- Password minimum length requirements
- Input validation and sanitization
- Protected API endpoints
- Automatic logout on token expiration

### Environment Variables
Add these additional environment variables to your `.env.local`:



### Authentication Flow
1. **Registration**: Users can register as either 'user' or 'admin'
2. **Login**: Secure login with email and password
3. **Token Storage**: JWT tokens stored in HTTP-only cookies
4. **Route Protection**: Automatic redirection for unauthorized access
5. **Logout**: Secure logout with token cleanup

## Tech Stack

- **Frontend**: React, Next.js 14, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Email**: Nodemailer
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Gmail account (for email notifications) or other SMTP service

### 1. Clone the Repository
\`\`\`bash
git clone <https://github.com/YaSi9R/complaint-management-system--1->
cd complaint-management-system (1)
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

\`\`\`env
# MongoDB Connection
MONGODB_URI=<"use your dummy>

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Complaint System <noreply@example.com>

# Admin Email for notifications
ADMIN_EMAIL=admin@example.com

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
\`\`\`

### 4. Gmail Setup (for email notifications)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SMTP_PASS`

### 5. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/complaint-system`



### 6. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the application.

## Usage

### For Users
1. Navigate to the home page
2. Fill out the complaint form with:
   - Complaint title
   - Detailed description
   - Category (Product, Service, Support, Billing, Technical)
   - Priority (Low, Medium, High)
3. Submit the complaint
4. Admin will receive an email notification

### For Administrators
1. Navigate to `/admin` or click "Access Admin Dashboard"
2. View all complaints in the table
3. Use filters to sort by status or priority
4. Click the eye icon to view full complaint details
5. Update status using the dropdown (triggers email notification)
6. Delete complaints if necessary

## API Endpoints

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get all complaints
- `PUT /api/complaints/[id]` - Update complaint status
- `DELETE /api/complaints/[id]` - Delete complaint

## Database Schema

### Complaint Model
\`\`\`javascript
{
  title: String (required),
  description: String (required),
  category: String (enum: ['Product', 'Service', 'Support', 'Billing', 'Technical']),
  priority: String (enum: ['Low', 'Medium', 'High']),
  status: String (enum: ['Pending', 'In Progress', 'Resolved']),
  dateSubmitted: Date (default: now),
  timestamps: true
}
\`\`\`

## Email Templates

The system sends HTML formatted emails for:
1. **New Complaint Notification**: Sent to admin when user submits complaint
2. **Status Update Notification**: Sent to admin when complaint status changes

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Development

### Project Structure
\`\`\`
├── app/
│   ├── api/complaints/          # API routes
│   ├── admin/                   # Admin dashboard
│   └── page.tsx                 # Home page
├── lib/
│   ├── mongodb.ts              # Database connection
│   ├── models/                 # Mongoose models
│   └── email.ts                # Email service
├── components/ui/              # UI components
└── README.md
\`\`\`

### Adding New Features
1. Create new API routes in `app/api/`
2. Add new pages in `app/`
3. Create reusable components in `components/`
4. Update database models in `lib/models/`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Ensure network access for MongoDB Atlas

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check Gmail app password setup
   - Ensure less secure app access is enabled

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

This project is created to complete my assignment 
