# E-Certificate Generation System

A comprehensive web-based system for generating, managing, and distributing digital certificates to students. Built with React and Node.js.

## 🚀 Features

### Core Functionality
- ✅ **Student Data Import**: Upload student information from CSV or Excel files
- ✅ **Certificate Templates**: 4 professional certificate designs to choose from
- ✅ **Faculty Management**: Add faculty information and upload digital signatures
- ✅ **PDF Generation**: Automatically convert certificates to professional PDF files
- ✅ **Certificate Library**: Store and manage all generated certificates
- ✅ **ZIP Download**: Download all certificates as a single ZIP file
- ✅ **Email Distribution**: Send certificates to students via email
- ✅ **Data Validation**: Automatic validation of student data and certificate details

## 📋 System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **MongoDB**: Atlas account (or local instance)
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

## 🔧 Installation

### Backend Setup
```bash
cd server
npm install
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup
```bash
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](QUICK_START.md) | Get up and running in 5 minutes |
| [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) | Detailed feature documentation |
| [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) | Complete testing guide |
| [STATUS_REPORT.md](STATUS_REPORT.md) | System status and what was fixed |

## 🎯 Quick Start

### 1. Start Both Servers
```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
npm start
```

### 2. Test with Sample Data
- Use included `test_students.csv` with 10 sample students
- Navigate to Certificate Generator
- Upload the CSV file
- Select a template, add faculty info, and generate certificates

### 3. View Results
- Go to Library page
- Download certificates as ZIP
- Test email feature

## 🎓 How to Use

### Step 1: Prepare Student Data
Create a CSV file with columns:
```
Name, Email, Roll No
John Doe, john@example.com, 001
Jane Smith, jane@example.com, 002
```

### Step 2: Generate Certificates
1. Go to Certificate Generator
2. Upload student data (CSV/Excel)
3. Select a certificate template
4. Add faculty information (optional)
5. Upload faculty signatures (PNG files)
6. Click "Generate Certificates"

### Step 3: Manage Certificates
1. View all projects in Library
2. Download individual or batch certificates
3. Send certificates via email
4. Delete projects as needed

## 🧪 Testing

Comprehensive testing checklist available in [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

Quick test:
```
1. Upload test_students.csv
2. Generate certificates
3. Check Library page
4. Download ZIP file
5. Extract and verify PDFs
```

## 📦 What Was Fixed

### Latest Updates (v1.0)
- ✅ Real PDF generation using html2canvas + jsPDF
- ✅ Proper ZIP file creation with all certificates
- ✅ Enhanced email system with status tracking
- ✅ Better error handling and validation
- ✅ Complete documentation

## 🔐 Configuration

### Environment Variables
Backend (server/.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000
```

## 📊 Performance

| Operation | Time |
|-----------|------|
| Single PDF Generation | 1-2 seconds |
| 10 Certificates | 10-30 seconds |
| 50 Certificates | 2-3 minutes |
| ZIP Creation | < 5 seconds |

## 🐛 Troubleshooting

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed troubleshooting

Quick fixes:
- Check browser console (F12) for errors
- Verify all environment variables set
- Ensure CSV has "Name" and "Email" columns
- Check MongoDB connection logs

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy build/ folder to Vercel, Netlify, or your host
```

### Backend
```bash
# Deploy to Heroku, AWS, DigitalOcean, etc.
npm start
```

## 📄 License

This project is provided for educational and commercial use.

---

**Version**: 1.0  
**Last Updated**: November 13, 2025  
**Status**: ✅ Production Ready

**Start Here**: [QUICK_START.md](QUICK_START.md)
