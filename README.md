# **AJ STUDIOZ** - Complete File Storage & Verification System

**AJ STUDIOZ** is a modern file storage and verification platform built with Next.js 15. Upload files, generate QR codes for verification, and manage your documents securely. Features both guest uploads (24h expiry) and permanent user storage with authentication.

![Screenshot of AJ STUDIOZ](https://github.com/user-attachments/assets/750ef5b4-2d72-4585-bd39-1f3d8dbea207)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
openssl rand -base64 32  # Generate NEXTAUTH_SECRET
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

📖 **Detailed Setup**: See [SETUP.md](./SETUP.md)  
📚 **Full Documentation**: See [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## ✨ Features

### Original Features (Enhanced)
- **File Uploads**: Up to **100MB** per file
- **Cloudinary Integration**: Secure cloud storage
- **Shareable Links**: Generate downloadable links
- **QR Code Generation**: Quick access via QR codes
- **Link Shortening**: Integrated URL shortening
- **Auto Expiry**: Guest uploads expire after 24 hours
- **Responsive Design**: Optimized for all devices

### New Features (Added)
- ✅ **User Authentication**: Email/password + Google OAuth
- ✅ **Personal Dashboard**: Manage all your files in one place
- ✅ **Persistent Storage**: Files don't expire for logged-in users
- ✅ **Search & Filter**: Find files quickly by name, type, or tags
- ✅ **Storage Tracking**: Monitor usage with 5GB default limit
- ✅ **QR Verification**: Public verification page with security watermark
- ✅ **File Management**: Delete, rename, and organize files
- ✅ **Access Control**: Set files as public or private
- ✅ **Document Verification**: Verify authenticity via unique QR codes

---

## 🎯 Two Modes of Operation

### Mode 1: Guest Upload (Quick & Temporary)
- No account required
- Upload files instantly
- Get shareable links + QR codes
- Files expire in 24 hours
- **Perfect for**: One-time shares, temporary files

### Mode 2: User Dashboard (Full Management)
- Register/Login required
- Unlimited uploads (5GB storage limit)
- Files stored permanently
- Search, filter, and organize
- QR verification for all files
- **Perfect for**: Document management, long-term storage

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18.3**
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Framer Motion** for animations
- **QRCode.react** for QR generation

### Backend
- **Next.js API Routes**
- **MongoDB + Mongoose** for database
- **Cloudinary** for file storage
- **bcryptjs** for password hashing
- **nanoid** for unique IDs

### Authentication
- Email/Password (credentials)
- Google OAuth
- JWT session management

---

## � Project Structure

```
nextShare/
├── src/app/                    # Next.js App Router
│   ├── page.jsx               # Landing page (guest upload)
│   ├── dashboard/             # User dashboard
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   └── verify/[docId]/        # Document verification
├── pages/api/                  # API Routes
│   ├── auth/                  # NextAuth + registration
│   ├── user/                  # User file operations
│   ├── verify/                # Document verification
│   └── upload-auth.js         # Authenticated uploads
├── models/                     # MongoDB schemas
│   ├── User.js               # User with nested files
│   └── mongo.js              # Guest file schema
└── libs/                       # Utilities
    ├── mongodb.js            # DB connection
    └── cloudinary.js         # Cloud storage config
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  storageUsed: 1048576,  // bytes
  storageLimit: 5368709120,  // 5GB
  files: [
    {
      id: "unique_id",
      name: "Document.pdf",
      url: "cloudinary_url",
      type: "PDF",
      size: "240KB",
      qrCode: "base64_qr_image",
      qrUrl: "verification_url",
      access: "public" | "private",
      status: "verified"
    }
  ]
}
```

---

## 🔐 Environment Variables

Required variables in `.env.local`:

```env
MONGODB_URI=your-mongodb-connection-string
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=optional-google-client-id
GOOGLE_CLIENT_SECRET=optional-google-secret
NEXT_PUBLIC_API=optional-link-shortener-api
```

See [.env.example](./.env.example) for details.

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy AJ STUDIOZ"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables
- Deploy

3. **Update Settings**
- Set `NEXTAUTH_URL` to your Vercel URL
- Update Google OAuth redirect URIs
- Test authentication

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide with testing checklist
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Full technical documentation
- **[.env.example](./.env.example)** - Environment variables template

---

## 🧪 Testing

### Guest Upload Flow
```bash
1. Visit homepage
2. Upload file
3. Get link + QR code
4. File expires in 24h
```

### User Dashboard Flow
```bash
1. Register account
2. Login
3. Upload files
4. View in dashboard
5. Generate QR codes
6. Test verification page
```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based session management
- ✅ User-based file access control
- ✅ Public/private file settings
- ✅ Secure Cloudinary URLs
- ✅ Unique document verification IDs
- ✅ Auto-expiry for guest uploads

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/auth/signout` - Logout

### File Management
- `POST /api/upload` - Guest upload (24h expiry)
- `POST /api/upload-auth` - User upload (permanent)
- `GET /api/user/docs` - Get user files
- `DELETE /api/delete/:id` - Delete file
- `PUT /api/rename` - Rename file

### Public Access
- `GET /api/verify/:docId` - Verify document
- `GET /api/doc/:id` - Get public document

---

## 🎨 Key Features in Detail

### Dashboard
- Grid view with file type icons
- Real-time search
- Sort by name/date/type
- Storage usage meter
- Upload modal
- QR code viewer

### Verification Page
- Green verified badge
- Document details
- Security watermark notice
- Download button
- Verification timestamp

---

## � Troubleshooting

| Issue | Solution |
|-------|----------|
| NextAuth secret error | Add `NEXTAUTH_SECRET` to `.env.local` |
| MongoDB connection fails | Check `MONGODB_URI` and IP whitelist |
| Google OAuth error | Verify redirect URIs match |
| Upload fails | Check Cloudinary credentials |
| QR not generating | Ensure `qrcode` package installed |

---

## 📜 License

MIT License - See [LICENSE](./LICENSE) for details.

---

## 🙌 Acknowledgments

- **Next.js** for the full-stack framework
- **Cloudinary** for file storage
- **MongoDB** for database
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling
- **qrcode.react** for QR generation
- Link shortener: [Trim-it-url-shortener](https://github.com/AnkitNayak-eth/Trim-it-url-shortener)

---

## 🚀 What's Next?

Potential enhancements:
- [ ] Folder management
- [ ] File sharing between users
- [ ] Email notifications
- [ ] File preview (PDF/images)
- [ ] Bulk operations
- [ ] Dark mode
- [ ] Mobile app

---

**Enjoy managing files securely with AJ STUDIOZ!** 🎉

**Need Help?** Check [SETUP.md](./SETUP.md) for step-by-step instructions.

**Technical Details?** See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete docs.
