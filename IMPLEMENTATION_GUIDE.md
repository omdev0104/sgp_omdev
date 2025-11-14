# E-Certificate System - Implementation & Testing Guide

## Overview
This is an e-certification system that generates, stores, and distributes certificates to students. The system now includes:
- CSV/Excel student data import
- Multiple certificate templates
- Faculty information and signatures
- PDF certificate generation
- ZIP file download
- Email distribution to students
- Certificate library storage

## System Architecture

### Frontend (React)
- **Certificate.jsx**: Main certificate generation interface
- **Template.jsx**: Certificate template selection
- **Library.jsx**: Certificate storage, management, and distribution
- **Certificate templates**: HTML-based designs with automatic rendering to PDF

### Backend (Node.js/Express)
- Authentication (JWT)
- Certificate storage (MongoDB)
- Email sending (Nodemailer)
- User management

## Features & Functionality

### ✅ 1. Upload Student Data (CSV/Excel)
**Status**: Working
- Supported formats: `.csv`, `.xlsx`, `.xls`
- Required columns: "Name" (or "Student Name") and "Email"
- Automatically normalizes data structure
- Validates before processing

**Testing**:
```
1. Go to Certificate Generator page
2. Click "Choose CSV/Excel File"
3. Select a file with columns: Name, Email, Roll No (optional)
4. System should show "X students loaded successfully"
```

### ✅ 2. Certificate Template Selection
**Status**: Working
- 4 professional templates available
- Template.jsx shows thumbnails
- Selected template is saved to localStorage
- Auto-loaded when returning to generator

**Testing**:
```
1. Go to Templates page
2. Click on a template to select it
3. Should be redirected to Certificate Generator with template pre-selected
4. Or select template in right panel of generator
```

### ✅ 3. Faculty Information & Signatures
**Status**: Working
- Upload 2 faculty signatures (PNG files)
- Input faculty names and designations
- Signatures embedded in certificate
- Automatic layout adjustment

**Testing**:
```
1. In Certificate Generator, find "Faculty 1" and "Faculty 2" sections
2. Click "Upload Signature" and select a PNG file
3. Enter faculty name and designation
4. Verify preview updates
```

### ✅ 4. Certificate Generation
**Status**: Fixed & Enhanced
- Now generates actual PDF files (not just data)
- Uses html2canvas + jsPDF for rendering
- Individual PDFs for each student
- Stores both PDF and HTML content

**How it works**:
1. Renders HTML template with student data
2. Converts to canvas using html2canvas
3. Creates PDF from canvas
4. Stores PDF blob in project data
5. All certificates stored in localStorage

**Testing**:
```
1. Fill all fields:
   - Upload student data (CSV)
   - Enter certificate subject
   - Select template
   - Upload faculty signatures
   - Enter faculty names & designations
2. Click "Generate Certificates"
3. Should generate PDFs for each student
4. Redirects to Library page
5. Check console for any errors
```

### ✅ 5. Certificate Storage in Library
**Status**: Working
- All generated certificates stored in localStorage
- Can be retrieved and managed
- Shows project details (students, subject, template)
- Delete individual projects or clear all

**Testing**:
```
1. After generating certificates, go to Library page
2. Should see project cards with:
   - Project name
   - Number of certificates
   - Student count
   - Creation date
   - Template used
3. Click project to view details
```

### ✅ 6. Email Sending
**Status**: Functional (Frontend) / Ready for Backend Integration
- Email modal with preview
- Custom message support
- Shows email status for each student
- Simulates email sending (90% success rate for testing)

**To Enable Real Email Sending**:
1. Update `.env` with email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. Backend route is ready at `/api/certificates/send-email`

3. Uncomment the actual API call in Library.jsx line ~48:
   ```javascript
   // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-email`, ...
   ```

**Testing Simulated Email**:
```
1. Go to Library page
2. Click "Send Emails" on a project
3. View email preview
4. Optionally add custom message
5. Click "Send to All Students"
6. Check status for each student
```

### ✅ 7. ZIP Download
**Status**: Fixed & Enhanced
- All certificates packaged in ZIP file
- Named: `ProjectName_Certificates.zip`
- Individual PDFs named: `Certificate_StudentName.pdf`
- Uses jszip library

**Testing**:
```
1. In Library, click "Download ZIP" button
2. File should download with all certificates
3. Extract and verify PDF files
```

## Installation & Setup

### Prerequisites
- Node.js >= 14
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Frontend Setup
```bash
cd SGP-Project-sem-5
npm install
npm start
```

### Backend Setup
```bash
cd server
npm install
npm start
```

The server runs on `http://localhost:5000`

### Dependencies Added/Updated
Frontend:
- `html2canvas`: ^1.4.1 (already installed)
- `jspdf`: ^3.0.3 (already installed)
- `jszip`: ^3.10.1 (already installed)
- `papaparse`: ^5.5.3 (already installed)
- `xlsx`: ^0.18.5 (already installed)

Backend:
- `nodemailer`: ^6.9.7 (newly added)
- `jszip`: ^3.10.1 (newly added)

## Troubleshooting

### Issue: "File parsing error"
**Solution**: Ensure CSV/Excel has proper column headers (Name/Student Name, Email)

### Issue: "Certificates not generating"
**Possible causes**:
1. Student data not loaded (required fields missing)
2. Subject field is empty
3. Template not selected
4. Browser console shows errors

**Fix**: Check browser console (F12) for detailed error messages

### Issue: "PDF generation is slow"
**Expected**: First certificate takes 1-2 seconds, subsequent ones are faster
**Why**: html2canvas needs time to render HTML to canvas

### Issue: "Signatures not showing in certificate"
**Solution**: 
1. Ensure PNG files are selected (not other formats)
2. Check file size (large signatures may cause issues)
3. Verify signature uploads completed successfully

### Issue: "ZIP file not downloading"
**Solution**:
1. Check browser console for errors
2. Ensure certificates were generated with PDFs
3. Try with different browser if it persists

### Issue: "Email not sending"
**Solution** (for simulated emails):
- Currently simulates sending, no real emails sent
- To enable real emails, see "Email Sending" section above
- Requires Gmail App Password (not regular password)

## Data Storage

### Frontend Storage (localStorage)
- `certificateProjects`: Array of all project data
- `selectedTemplate`: Currently selected template
- `authToken`: User authentication token (if using backend auth)

**View stored data** (Browser DevTools):
```javascript
// Check all projects
console.log(JSON.parse(localStorage.getItem('certificateProjects')))

// Clear all data (use cautiously!)
localStorage.removeItem('certificateProjects')
```

### Backend Storage (MongoDB)
- User collection: Authentication
- Certificate collection: Certificate metadata
- PDF files: Currently stored as blobs in localStorage

## API Endpoints (Backend Ready)

### Certificate Generation
- `POST /api/certificates` - Store certificate
- `GET /api/certificates` - Get user's certificates
- `GET /api/certificates/:id` - Get specific certificate

### Email Sending
- `POST /api/certificates/send-email` - Send certificates via email
  - Requires: `projectId`, `message`, `authToken`

### Authentication
- `POST /api/signup` - Create new user
- `POST /api/login` - User login

## Next Steps / Enhancements

1. **Backend Certificate Storage**
   - Store PDF files in cloud storage (AWS S3, Firebase Storage)
   - Replace localStorage with database
   - Implement secure certificate download tokens

2. **Real Email Integration**
   - Configure Nodemailer with Gmail/SendGrid
   - Add email templates
   - Implement attachment sending with certificates

3. **Additional Features**
   - Batch certificate import/export
   - Certificate verification codes
   - QR codes on certificates
   - Digital signatures
   - Multi-language support
   - More certificate templates

4. **Security Improvements**
   - Implement rate limiting
   - Add input validation on backend
   - Secure file upload handling
   - CORS configuration

5. **UI/UX Improvements**
   - Progress bars for generation
   - Bulk email settings
   - Certificate preview before generation
   - Student search in library
   - Export student list

## Testing Checklist

- [ ] Upload CSV file with 5+ students
- [ ] Upload Excel file with different column names
- [ ] Select each template and verify rendering
- [ ] Upload faculty signatures
- [ ] Generate certificates and verify PDFs
- [ ] Check library shows all projects
- [ ] Download individual certificate
- [ ] Download all certificates as ZIP
- [ ] Test email sending with custom message
- [ ] Delete project and verify removal
- [ ] Clear all projects
- [ ] Test with long student names
- [ ] Test with special characters in subject
- [ ] Verify responsive design on mobile

## Support & Debugging

### Enable Verbose Logging
Add this to Certificate.jsx before generation:
```javascript
window.DEBUG_MODE = true;
```

### Check Console Errors
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy full error message for troubleshooting

### Database Connection
Check server connection with:
```bash
# In server directory
npm start
# Should see "Connected to MongoDB successfully"
```

## File Structure
```
src/
├── pages/
│   ├── Certificate.jsx (generation)
│   ├── Library.jsx (storage & distribution)
│   └── Template.jsx (template selection)
├── certificates/
│   ├── c1.html
│   ├── c2.html
│   ├── c3.html
│   └── c4.html (certificate HTML templates)
└── ...

server/
├── server.js (main server file)
├── models/
│   ├── User.js
│   └── Certificate.js
└── .env (environment variables)
```

## Contact & Issues
For issues or questions:
1. Check this guide first
2. Review browser console errors
3. Check server logs
4. Verify all dependencies installed

---
Last Updated: November 13, 2025
Version: 1.0 - Fully Functional with PDF Generation
