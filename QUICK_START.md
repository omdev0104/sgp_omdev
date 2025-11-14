# Quick Start Guide - E-Certificate System

## What's New

### ✅ Enhanced Features
1. **PDF Generation** - Certificates are now generated as real PDFs (not just data)
2. **ZIP Download** - Download all certificates as a single ZIP file
3. **Better Email** - Improved email sending structure with real backend support
4. **Error Handling** - Better error messages and debugging

## Running the System

### Terminal 1 - Start Backend
```bash
cd server
npm install  # Only first time
npm start
```
Should show: `Server running on port 5000`

### Terminal 2 - Start Frontend
```bash
cd SGP-Project-sem-5
npm install  # Only first time
npm start
```
Should open: `http://localhost:3000`

## Testing Workflow

### 1. Prepare Test Data
Create a `test_students.csv`:
```
Name,Email,Roll No
John Doe,john@example.com,001
Jane Smith,jane@example.com,002
Mike Johnson,mike@example.com,003
```

### 2. Generate Certificates
1. Go to **Certificate Generator** page
2. Upload `test_students.csv`
3. Enter subject: "Outstanding Performance Recognition"
4. Select a template from right panel
5. For Faculty fields (optional):
   - Faculty 1: Prof. John Smith, Dean
   - Faculty 2: Dr. Sarah Johnson, Coordinator
6. Click **Generate Certificates** button
7. Wait for PDF generation (1-3 seconds per certificate)
8. Should redirect to **Library** page

### 3. View in Library
- See generated project with student count
- View project details
- See email status if emails were sent

### 4. Download Certificates
- Click **Download ZIP** to get all PDFs
- Or send emails to students

## Common Issues & Quick Fixes

### "Students loaded successfully" not showing
- Check CSV has columns named exactly: "Name" and "Email"
- Or use: "Student Name" instead of "Name"

### Generation takes forever or fails
- Check browser console (F12 > Console)
- Make sure student count is not too high (>100)
- Try with smaller student list first

### ZIP download doesn't work
- Ensure generation completed without errors
- Check browser's download folder
- Try clearing browser cache

### No signatures showing in certificate
- Upload PNG files only (not JPG)
- Keep file size under 100KB

## Testing Features

### Feature 1: CSV Upload
✅ Working - Supports .csv, .xlsx, .xls files

### Feature 2: Template Selection
✅ Working - Select from 4 templates before generation

### Feature 3: Faculty Information
✅ Working - Add names, designations, signatures

### Feature 4: PDF Generation
✅ Fixed - Now generates real PDFs for each student

### Feature 5: Library Storage
✅ Working - Stores all projects in localStorage

### Feature 6: ZIP Download
✅ Fixed - All certificates packaged in ZIP

### Feature 7: Email Sending
⚠️ Simulated - Ready for backend integration
- Currently simulates email sending
- Can be enabled with real SMTP configuration

## Database Setup (Optional)

If using backend MongoDB:

1. Already configured in `server/.env`
2. Backend is ready for real certificate storage
3. Currently system uses localStorage (browser storage)

To use backend:
- Uncomment API calls in Certificate.jsx
- Update auth token handling
- Implement proper session management

## File Size Warnings

If certificates are taking too long to generate:
- Reduce signature image sizes
- Limit student count in one batch
- Use hardware acceleration in browser settings

## Next Steps

1. **For Testing Only**:
   - Generate test certificates
   - Download and view PDFs
   - Test email feature (simulated)

2. **For Production**:
   - Set up real email (Gmail SMTP)
   - Configure cloud storage for PDFs
   - Set up MongoDB backup
   - Implement user authentication

## Success Indicators

✅ After "Generate Certificates":
- Alert shows: "Successfully generated X certificates"
- Redirects to Library page
- Project appears with all students

✅ When downloading:
- ZIP file contains PDF files
- PDFs have readable content
- Filenames match student names

✅ Email simulation:
- Status shows for each student
- 90% success rate (for testing)
- Can customize message

## Support

- Check **IMPLEMENTATION_GUIDE.md** for detailed documentation
- Browser console (F12) shows detailed error logs
- Server terminal shows backend errors
- Each component logs important events

---
**Remember**: First generate 2-3 certificates with your real data to test the system before bulk generation!
