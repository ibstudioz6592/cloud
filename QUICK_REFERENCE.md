# 🚀 AJ STUDIOZ - Quick Reference Card

## ⚡ Instant Start (3 Commands)

```bash
# 1. Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 2. Generate secret
openssl rand -base64 32
# Add to .env.local as NEXTAUTH_SECRET

# 3. Run
npm run dev
```

---

## 🔑 Essential Environment Variables

```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
```

**Optional:**
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 📍 Routes Reference

### Public Routes
- `/` - Landing page (guest upload)
- `/login` - Login page
- `/register` - Registration page
- `/verify/:docId` - Document verification

### Protected Routes
- `/dashboard` - User dashboard (requires login)

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/signin` - Login
- `GET /api/auth/signout` - Logout

### Files
- `POST /api/upload` - Guest upload (24h)
- `POST /api/upload-auth` - User upload (permanent)
- `GET /api/user/docs` - Get user files
- `DELETE /api/delete/:id` - Delete file
- `PUT /api/rename` - Rename file

### Public
- `GET /api/verify/:docId` - Verify document
- `GET /api/doc/:id` - Get public doc

---

## 🎯 User Journeys

### Guest Flow
```
Homepage → Upload → Get Link/QR → Share
(Expires in 24h)
```

### User Flow
```
Register → Login → Dashboard → Upload → Manage
(Permanent storage)
```

### Verification Flow
```
Scan QR → Verification Page → View/Download
```

---

## 🗄️ Database Collections

### `users`
- User info
- Nested files array
- Storage tracking

### `files` (guest uploads)
- Temporary storage
- TTL: 24 hours

---

## 🎨 Key Features

**For Everyone:**
- File upload (100MB limit)
- QR code generation
- Link shortening
- Responsive design

**For Registered Users:**
- Personal dashboard
- Persistent storage (5GB)
- Search & filter
- File management
- Storage tracking
- Document verification

---

## 📦 Dependencies Added

```json
{
  "next-auth": "^4.x",
  "qrcode": "^1.x",
  "bcryptjs": "^2.x",
  "nanoid": "^5.x"
}
```

---

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT sessions
- User file ownership
- Public/private access
- Secure URLs
- Unique doc IDs

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "No secret" | Add NEXTAUTH_SECRET |
| MongoDB error | Check MONGODB_URI |
| OAuth fails | Check redirect URIs |
| Upload fails | Check Cloudinary keys |
| QR missing | Install qrcode package |

---

## 📁 File Structure (Quick View)

```
Key Directories:
├── src/app/          → Frontend pages
├── pages/api/        → Backend APIs
├── models/           → Database schemas
├── libs/             → Utilities
└── public/           → Static files

New Pages:
├── /dashboard        → User dashboard
├── /login           → Login page
├── /register        → Registration
└── /verify/:id      → Verification
```

---

## ⚙️ npm Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Lint code
```

---

## 🚀 Deployment Checklist

- [ ] Push to GitHub
- [ ] Import to Vercel
- [ ] Add env variables
- [ ] Update NEXTAUTH_URL
- [ ] Update OAuth redirects
- [ ] Test deployment
- [ ] ✅ Live!

---

## 📖 Documentation Files

- `README.md` - Overview & features
- `SETUP.md` - Detailed setup guide
- `DOCUMENTATION.md` - Technical docs
- `PROJECT_SUMMARY.md` - Transformation summary
- `.env.example` - Environment template

---

## 💡 Quick Commands

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test guest upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@yourfile.pdf"

# Generate secret
openssl rand -base64 32

# Build for production
npm run build
```

---

## 🎯 Testing URLs

```
Homepage:      http://localhost:3000
Login:         http://localhost:3000/login
Register:      http://localhost:3000/register
Dashboard:     http://localhost:3000/dashboard
Verify:        http://localhost:3000/verify/[docId]
```

---

## 📊 Storage Limits

- **Guest Users**: No limit (24h expiry)
- **Registered Users**: 5GB default
- **File Size**: 100MB per file
- **Change Limit**: Edit `models/User.js`

---

## 🔧 Customization Points

### Change Storage Limit
```javascript
// models/User.js
storageLimit: { type: Number, default: 5368709120 }
// Change 5368709120 to desired bytes
```

### Change Expiry Time
```javascript
// models/mongo.js
expires: 86400  // 24 hours in seconds
// Change to desired duration
```

### Add File Types
```javascript
// pages/api/upload-auth.js
const typeMap = {
  '.pdf': 'PDF',
  // Add more types here
}
```

---

## ✅ Pre-Launch Checklist

**Environment:**
- [ ] .env.local created
- [ ] All variables set
- [ ] Secret generated

**Database:**
- [ ] MongoDB connected
- [ ] Collections created

**Storage:**
- [ ] Cloudinary configured
- [ ] Test upload works

**Auth:**
- [ ] Can register
- [ ] Can login
- [ ] Session persists

**Features:**
- [ ] Dashboard loads
- [ ] Files upload
- [ ] QR generates
- [ ] Verification works
- [ ] Delete works

---

## 🎊 You're Ready!

**Start**: `npm run dev`  
**Test**: http://localhost:3000  
**Deploy**: Push to Vercel  

---

**Quick Help**: Check SETUP.md  
**Full Docs**: Check DOCUMENTATION.md  
**Overview**: Check README.md

---

**Built for AJ STUDIOZ** 🚀
