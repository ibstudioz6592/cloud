# AJ STUDIOZ - Complete File Storage & Verification System

## 🌟 Overview

**AJ STUDIOZ** is a modern file storage and verification system that combines cloud file management with QR-based document verification. Users can upload, organize, and share files securely while generating unique QR codes for verification purposes.

### 🆕 New Features

- **User Authentication**: Register/Login with email/password or Google OAuth
- **Personal Dashboard**: Manage all your files in one place with search and filters
- **QR Code Generation**: Each uploaded file gets a unique QR code for verification
- **Document Verification**: Public verification page with security watermark
- **Storage Management**: Track your storage usage (5GB default limit)
- **File Organization**: Organize files by folders and tags
- **Access Control**: Set files as public or private
- **Persistent Storage**: Authenticated users' files don't expire (vs. 24-hour expiry for guests)

---

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **React 18.3** for UI components
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Framer Motion** for animations
- **QRCode.react** for QR generation

### Backend
- **Next.js API Routes** (Pages Router for API)
- **MongoDB + Mongoose** for database
- **Cloudinary** for file storage
- **bcryptjs** for password hashing
- **nanoid** for unique IDs

---

## 📁 Project Structure

```
nextShare/
├── src/
│   └── app/
│       ├── page.jsx                    # Landing page (guest uploads)
│       ├── layout.js                   # Root layout with auth provider
│       ├── providers.jsx               # NextAuth SessionProvider
│       ├── dashboard/
│       │   └── page.jsx               # User dashboard
│       ├── login/
│       │   └── page.jsx               # Login page
│       ├── register/
│       │   └── page.jsx               # Registration page
│       ├── verify/
│       │   └── [docId]/
│       │       └── page.jsx           # Public document verification
│       ├── file-upload.jsx            # File upload component
│       ├── background-beams.jsx       # Background animation
│       └── globals.css                # Global styles
├── pages/
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth].js       # NextAuth configuration
│       │   └── register.js            # User registration API
│       ├── user/
│       │   └── docs.js                # Get user documents
│       ├── delete/
│       │   └── [id].js                # Delete file API
│       ├── verify/
│       │   └── [docId].js             # Verify document API
│       ├── doc/
│       │   └── [id].js                # Get public document
│       ├── upload.js                  # Guest upload (24h expiry)
│       ├── upload-auth.js             # Authenticated upload (permanent)
│       └── rename.js                  # Rename file API
├── models/
│   ├── User.js                        # User schema with nested files
│   └── mongo.js                       # File schema (for guest uploads)
├── libs/
│   ├── mongodb.js                     # MongoDB connection
│   ├── cloudinary.js                  # Cloudinary configuration
│   └── utils.js                       # Utility functions
├── .env.example                       # Environment variables template
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account for file storage
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd nextShare
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aj-studioz
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Generate NextAuth secret**
```bash
openssl rand -base64 32
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  image: String,
  provider: "credentials" | "google",
  storageUsed: Number (bytes),
  storageLimit: Number (default: 5GB),
  files: [
    {
      id: String (unique),
      name: String,
      url: String (Cloudinary URL),
      publicId: String,
      type: "PDF" | "DOC" | "Image" | "ZIP" | etc.,
      size: String ("240KB"),
      uploadedAt: Date,
      qrUrl: String,
      qrCode: String (base64),
      access: "public" | "private",
      status: "verified" | "pending" | "expired",
      folder: String,
      tags: [String],
      expiresAt: Date (optional)
    }
  ],
  folders: [
    { name: String, createdAt: Date }
  ],
  createdAt: Date,
  lastLogin: Date
}
```

### File Collection (Guest Uploads)
```javascript
{
  _id: ObjectId,
  url: String,
  public_id: String,
  createdAt: Date,
  expiresAt: Date (TTL index: 24 hours)
}
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `GET /api/auth/signout` - Sign out

### File Management
- `POST /api/upload` - Guest upload (24h expiry)
- `POST /api/upload-auth` - Authenticated upload (permanent)
- `GET /api/user/docs` - Get user's files (with search/filter)
- `DELETE /api/delete/:id` - Delete file
- `PUT /api/rename` - Rename file

### Public Access
- `GET /api/verify/:docId` - Verify document authenticity
- `GET /api/doc/:id` - Get public document details

---

## 🎨 Features Breakdown

### 1. **Landing Page** (`/`)
- Guest file upload (24-hour expiry)
- Link shortening integration
- QR code generation for uploaded files
- Navigation to Login/Register or Dashboard

### 2. **Authentication** (`/login`, `/register`)
- Email/password authentication
- Google OAuth integration
- Auto-redirect to dashboard after login

### 3. **Dashboard** (`/dashboard`)
- File grid view with icons
- Search and filter functionality
- Sort by name, date, or type
- Storage usage tracking
- Upload new files
- View QR codes
- Delete files
- Download files

### 4. **Document Verification** (`/verify/:docId`)
- Public verification page
- Document details display
- Security watermark
- Verification status indicator
- Download/view document

---

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: JWT-based with NextAuth
- **File Access Control**: User-based file ownership
- **Public/Private Files**: Access level control
- **Secure URLs**: Cloudinary signed URLs
- **QR Verification**: Unique document IDs
- **Auto Expiry**: Guest uploads expire in 24 hours

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Ensure all API keys are production-ready
- Update Google OAuth redirect URIs

---

## 🛠️ Development Tips

### Adding New File Types
Edit `getFileType()` function in `/pages/api/upload-auth.js`

### Customizing Storage Limits
Modify `storageLimit` in User schema (`models/User.js`)

### Changing Expiry Time
Update TTL in File schema (`models/mongo.js`)

### Adding New Folders
Implement folder CRUD operations in dashboard

---

## 📝 Todo / Future Enhancements

- [ ] Folder management (create, rename, delete)
- [ ] File sharing with other users
- [ ] Email notifications
- [ ] File version history
- [ ] Bulk file operations
- [ ] Advanced search with filters
- [ ] File preview (PDF, images)
- [ ] Dark/Light mode toggle
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **Next.js** for the framework
- **MongoDB** for the database
- **Cloudinary** for file storage
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling

---

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ by AJ STUDIOZ**
