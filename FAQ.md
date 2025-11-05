# AJ STUDIOZ - Frequently Asked Questions (FAQ)

## 🎯 General Questions

### Q: What is AJ STUDIOZ?
**A:** AJ STUDIOZ is a complete file storage and verification system that allows users to upload files, generate QR codes for verification, and manage documents securely. It supports both guest uploads (temporary) and authenticated user storage (permanent).

### Q: What's the difference between guest and user uploads?
**A:**
- **Guest Uploads**: No account required, files expire in 24 hours, perfect for one-time shares
- **User Uploads**: Requires registration, files stored permanently (within 5GB limit), full dashboard access

### Q: Is this the same as the original file-sharing app?
**A:** Yes and no! Your original guest upload feature is still there and works exactly the same. We've added a complete user management system on top of it, so now you have TWO modes of operation.

---

## 🔧 Setup & Installation

### Q: What do I need to get started?
**A:** You need:
1. MongoDB database (free tier on MongoDB Atlas works great)
2. Cloudinary account (for file storage)
3. Node.js 18+ installed
4. (Optional) Google OAuth credentials for social login

### Q: How do I generate NEXTAUTH_SECRET?
**A:** Run this command in your terminal:
```bash
openssl rand -base64 32
```
Then copy the output to your `.env.local` file.

### Q: Do I need Google OAuth?
**A:** No, it's optional. Email/password authentication works without it. Google OAuth just provides an additional sign-in method.

### Q: Where do I get Cloudinary credentials?
**A:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, and API Secret
4. Add them to `.env.local`

### Q: How do I set up MongoDB?
**A:**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all IPs)
5. Get connection string
6. Replace `<password>` with your password
7. Add to `.env.local` as `MONGODB_URI`

---

## 🚀 Usage Questions

### Q: Can guest users still upload files like before?
**A:** Yes! The homepage (`/`) still works exactly like your original app. No account needed, upload files instantly, get links and QR codes, files expire in 24 hours.

### Q: What's the file size limit?
**A:** 100MB per file for both guest and authenticated users.

### Q: What's the storage limit for registered users?
**A:** Default is 5GB total storage. You can change this in `models/User.js`.

### Q: How long do files last?
**A:**
- Guest uploads: 24 hours (auto-deleted)
- User uploads: Permanent (until manually deleted)

### Q: Can I share my files publicly?
**A:** Yes! When uploading as an authenticated user, you can set files as "public" and anyone with the verification link can view them.

### Q: What file types are supported?
**A:** All file types! PDFs, images, documents, videos, archives, etc. The system auto-detects the file type.

---

## 🔐 Authentication Questions

### Q: Is my password secure?
**A:** Yes! Passwords are hashed using bcrypt with 12 salt rounds before storage. We never store plain text passwords.

### Q: Can I use Google to sign in?
**A:** Yes, if you've configured Google OAuth in your environment variables. Otherwise, use email/password.

### Q: How long does my session last?
**A:** Sessions are managed by NextAuth.js with JWT tokens. They persist until you log out or the token expires (default: 30 days).

### Q: Can I change my password?
**A:** Not yet, but you can add a password change feature by creating a new API route. Check the DOCUMENTATION.md for guidance.

### Q: What if I forget my password?
**A:** Password reset isn't implemented yet, but you can add it. For now, create a new account or contact the admin.

---

## 📱 Features Questions

### Q: How do QR codes work?
**A:** Each uploaded file gets a unique ID and a QR code is generated that links to `/verify/:fileId`. Anyone can scan the QR to verify the document's authenticity.

### Q: Can I organize files into folders?
**A:** The folder schema is ready in the database, but the UI isn't built yet. You can add this feature or keep using the `folder` field when uploading.

### Q: Can I search my files?
**A:** Yes! The dashboard has a search bar that searches by filename, file type, and tags.

### Q: Can I rename files?
**A:** Yes! Use the rename API endpoint. The UI button isn't added yet, but the backend is ready.

### Q: Can I share files with other users?
**A:** Not yet, but the access control system is in place. You can build this feature using the public/private access levels.

### Q: Can I download my files?
**A:** Yes! Click the "View" button on any file card to open/download it.

---

## 🐛 Troubleshooting

### Q: I get "No secret" error
**A:** Add `NEXTAUTH_SECRET` to your `.env.local` file. Generate it with `openssl rand -base64 32`.

### Q: MongoDB connection fails
**A:** Check:
1. Is your `MONGODB_URI` correct?
2. Is your password encoded (special characters need URL encoding)?
3. Is your IP whitelisted in MongoDB Atlas?
4. Is your cluster running?

### Q: Files won't upload
**A:** Check:
1. Are your Cloudinary credentials correct?
2. Is the file under 100MB?
3. Check browser console for errors
4. Check server logs for detailed error messages

### Q: Google OAuth doesn't work
**A:** Verify:
1. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
3. OAuth consent screen is configured
4. Google+ API is enabled

### Q: QR codes don't generate
**A:** Make sure `qrcode` package is installed:
```bash
npm install qrcode
```

### Q: Session doesn't persist
**A:** Check:
1. `NEXTAUTH_URL` matches your domain
2. `NEXTAUTH_SECRET` is set
3. Clear browser cookies and try again
4. Check if cookies are enabled in browser

### Q: Dashboard shows "Loading..." forever
**A:** Check:
1. Is MongoDB connected?
2. Are you logged in? (check session)
3. Check browser console for errors
4. Try logout and login again

---

## 🗄️ Database Questions

### Q: Where are files stored?
**A:**
- **File data (binary)**: Cloudinary
- **File metadata**: MongoDB
- Guest uploads: `files` collection
- User uploads: `users` collection → `files` array

### Q: Why two storage locations?
**A:** Guest uploads are temporary and use a separate collection with TTL (time-to-live) index for auto-deletion. User uploads are nested in the user document for permanent storage.

### Q: How do I view my database?
**A:** Use MongoDB Compass (free desktop app) or the MongoDB Atlas web interface.

### Q: Can I backup my database?
**A:** Yes! MongoDB Atlas has automatic backups. You can also use `mongodump` for manual backups.

### Q: What happens to files in Cloudinary if MongoDB document is deleted?
**A:** They remain in Cloudinary. The delete API route removes them from both places, but if you manually delete from MongoDB, you should also delete from Cloudinary.

---

## 🚀 Deployment Questions

### Q: Can I deploy this for free?
**A:** Yes!
- **Frontend**: Vercel (free tier)
- **Database**: MongoDB Atlas (free tier - 512MB)
- **Storage**: Cloudinary (free tier - 25GB/month)

### Q: How do I deploy to Vercel?
**A:**
1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

See SETUP.md for detailed instructions.

### Q: Do I need to change anything for production?
**A:** Yes:
1. Update `NEXTAUTH_URL` to your production domain
2. Update Google OAuth redirect URIs (if using OAuth)
3. Make sure all environment variables are set in Vercel
4. Test thoroughly before going live

### Q: Can I use a custom domain?
**A:** Yes! Vercel allows custom domains on the free tier.

### Q: How do I handle large traffic?
**A:** The stack is built for scale:
- Vercel Edge Network (global CDN)
- MongoDB Atlas (auto-scaling)
- Cloudinary (CDN delivery)

For very large scale, consider upgrading to paid tiers.

---

## 💰 Cost Questions

### Q: Is this free to run?
**A:** Yes, with generous free tiers:
- Vercel: 100GB bandwidth/month
- MongoDB Atlas: 512MB storage
- Cloudinary: 25GB storage, 25GB bandwidth/month
- NextAuth: Free (open source)

### Q: When do I need to upgrade?
**A:**
- Vercel: >100GB traffic/month
- MongoDB: >512MB data
- Cloudinary: >25GB storage or >25GB bandwidth/month

### Q: What happens if I exceed free tier?
**A:**
- Vercel: Site may slow down or stop
- MongoDB: Read-only mode
- Cloudinary: Upload limits

Monitor your usage dashboards!

---

## 🔧 Customization Questions

### Q: Can I change the storage limit?
**A:** Yes! Edit `models/User.js`:
```javascript
storageLimit: { type: Number, default: 5368709120 } // 5GB in bytes
```

### Q: Can I change the 24-hour expiry?
**A:** Yes! Edit `models/mongo.js`:
```javascript
expires: 86400 // seconds (86400 = 24 hours)
```

### Q: Can I add more file types?
**A:** Yes! Edit `pages/api/upload-auth.js`:
```javascript
const typeMap = {
  '.pdf': 'PDF',
  '.xyz': 'Your Type', // Add here
}
```

### Q: Can I change the branding?
**A:** Yes! Search for "AJ STUDIOZ" and replace with your brand. Update:
- Page titles
- Headers
- Footer
- Metadata
- README

### Q: Can I add dark mode?
**A:** Yes! Tailwind has built-in dark mode. Add `dark:` classes to components or use a theme provider.

---

## 🎨 UI/UX Questions

### Q: Can I change colors?
**A:** Yes! Edit `tailwind.config.js` or use Tailwind's color utilities in components.

### Q: Is it mobile responsive?
**A:** Yes! All pages are built with mobile-first responsive design using Tailwind CSS.

### Q: Can I add more pages?
**A:** Yes! Create new files in `src/app/` following Next.js App Router conventions.

### Q: Can I use different animations?
**A:** Yes! The app uses Framer Motion. You can customize animations in the component files.

---

## 📊 Performance Questions

### Q: How fast is file upload?
**A:** Depends on:
- File size
- Your internet speed
- Cloudinary's CDN proximity
- Server location

Typically: 1-5 seconds for most files under 10MB.

### Q: Does it handle concurrent uploads?
**A:** Yes! Both Cloudinary and MongoDB handle concurrent operations well.

### Q: Can multiple users upload at the same time?
**A:** Yes! The system is designed for concurrent users.

### Q: How do I optimize performance?
**A:**
- Use Cloudinary transformations for images
- Implement caching
- Add loading states
- Optimize bundle size
- Use Next.js Image component

---

## 🔒 Security Questions

### Q: Is user data secure?
**A:** Yes:
- Passwords are bcrypt hashed
- MongoDB connection is encrypted
- Cloudinary uses signed URLs
- NextAuth handles session security
- No sensitive data in client-side code

### Q: Can users access other users' files?
**A:** No! The API checks user ownership before returning any files. Users can only see their own files unless explicitly shared as public.

### Q: Are uploads scanned for viruses?
**A:** No, this isn't implemented. Consider adding:
- Client-side file type validation
- Server-side virus scanning
- Cloudinary's moderation features

### Q: Can I add two-factor authentication?
**A:** Yes! NextAuth supports 2FA. You'll need to implement the UI and logic.

### Q: Is the verification system secure?
**A:** Yes! Each document gets a unique ID (nanoid) that's hard to guess. Public documents are intentionally accessible via the verification page.

---

## 🛠️ Development Questions

### Q: Can I contribute to this project?
**A:** Yes! Fork the repo, make changes, and submit a pull request.

### Q: What if I find a bug?
**A:** Open an issue on GitHub with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

### Q: Can I use this for commercial projects?
**A:** Yes! MIT License allows commercial use. See LICENSE file.

### Q: Can I get help with custom features?
**A:** Check the DOCUMENTATION.md file for technical guidance. For specific help, you can:
- Open a GitHub issue
- Check Next.js docs
- Check NextAuth docs
- Search Stack Overflow

### Q: Is there a demo?
**A:** Deploy to Vercel and you'll have a live demo! Or run locally with `npm run dev`.

---

## 📚 Learning Questions

### Q: Do I need to know React to use this?
**A:** To use it: No. To modify it: Yes, React and Next.js knowledge is helpful.

### Q: What should I learn to customize this?
**A:**
- React (UI components)
- Next.js (framework)
- Tailwind CSS (styling)
- MongoDB (database)
- REST APIs (backend)

### Q: Where can I learn more?
**A:**
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [MongoDB Docs](https://docs.mongodb.com)

---

## 🎯 Feature Requests

### Q: Can you add [feature]?
**A:** The codebase is ready for extensions! Check DOCUMENTATION.md for architecture details and add features yourself, or open a feature request issue.

### Q: What features are planned?
**A:** See the "Next Steps" section in README.md for ideas:
- Folder management
- File sharing
- Email notifications
- File preview
- Bulk operations
- Dark mode

### Q: Can I request a feature?
**A:** Yes! Open a GitHub issue with "Feature Request: [Your Feature]" as the title.

---

## 📞 Support

### Q: Where can I get help?
**A:**
1. Check this FAQ first
2. Read SETUP.md for setup issues
3. Check DOCUMENTATION.md for technical details
4. Search GitHub issues
5. Open a new issue if needed

### Q: Is there a community?
**A:** This is an open-source project. You can:
- Star the repo on GitHub
- Share with others
- Contribute improvements
- Report bugs

---

## 🎉 Final Questions

### Q: Is this production-ready?
**A:** Yes! The code includes:
- Error handling
- Authentication
- Security measures
- Responsive design
- Deployment configuration

Test thoroughly before going live!

### Q: What's the best way to get started?
**A:**
1. Read SETUP.md for step-by-step instructions
2. Set up environment variables
3. Run `npm run dev`
4. Test all features
5. Deploy to Vercel
6. Celebrate! 🎉

### Q: Any final tips?
**A:**
- Start with the guest upload feature to test setup
- Create a test account to try user features
- Monitor your usage dashboards (Vercel, MongoDB, Cloudinary)
- Keep your environment variables secure
- Make regular backups
- Test on mobile devices
- Read through all documentation files

---

**Still have questions?**
- Check: SETUP.md, DOCUMENTATION.md, README.md
- Open: GitHub issue
- Review: Architecture diagrams in ARCHITECTURE.md

**Good luck with your AJ STUDIOZ platform!** 🚀
