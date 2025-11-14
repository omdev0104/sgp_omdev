# E-Certificate System - Testing Checklist

## Pre-Testing Setup

### ✅ Installation Check
- [ ] Node.js installed (`node -v` shows v14+)
- [ ] npm installed (`npm -v` shows v6+)
- [ ] Backend dependencies: Run `cd server && npm install`
- [ ] Frontend dependencies: Run `npm install` in project root
- [ ] MongoDB connection verified (check server logs)

### ✅ Environment Setup
- [ ] `.env` file exists in `/server` directory
- [ ] `MONGODB_URI` is configured
- [ ] `JWT_SECRET` is set
- [ ] `PORT` is 5000

## Feature Testing

### Test 1: CSV/Excel File Upload ✅

**Objective**: Verify student data can be imported from CSV/Excel files

**Test Cases**:

#### 1.1 CSV Upload with Standard Columns
```
Steps:
1. Use test_students.csv from project root
2. Navigate to Certificate Generator page
3. Click "Choose CSV/Excel File"
4. Select test_students.csv
5. Verify: "10 students loaded successfully" message appears
```
**Expected Result**: Green success message with student count

#### 1.2 Excel Upload (.xlsx)
```
Steps:
1. Create test_students.xlsx with columns: Name, Email, Roll No
2. Upload the file
3. Verify same success message
```
**Expected Result**: Same as above

#### 1.3 Missing Email Column
```
Steps:
1. Create a CSV with only Name and Roll No (no Email)
2. Try to upload
3. Verify error message
```
**Expected Result**: Error message: "File must contain columns with 'name' and 'email'"

#### 1.4 Empty File
```
Steps:
1. Upload empty CSV file
2. Verify error handling
```
**Expected Result**: Error message: "File is empty"

---

### Test 2: Certificate Template Selection ✅

**Objective**: Verify templates can be selected and displayed

**Test Cases**:

#### 2.1 Template Selection from Template Page
```
Steps:
1. Navigate to /template page
2. Click "Use This Template" on Template 1
3. Should redirect to Certificate Generator
4. Verify Template 1 is selected (highlighted) in right panel
```
**Expected Result**: Redirects and shows selected template

#### 2.2 Template Selection from Certificate Page
```
Steps:
1. In Certificate Generator, click on different templates in right panel
2. Verify selection changes
3. Click "Use This Template" button
4. Verify selection updates
```
**Expected Result**: Selection updates immediately

#### 2.3 All 4 Templates Available
```
Steps:
1. Check right panel shows 4 template cards
2. Count: Template 1, 2, 3, 4
3. Each shows thumbnail image
```
**Expected Result**: 4 templates visible with images

---

### Test 3: Faculty Information Input ✅

**Objective**: Verify faculty details can be added

**Test Cases**:

#### 3.1 Faculty Name Input
```
Steps:
1. Scroll to Faculty 1 section
2. Enter name: "Dr. Sarah Johnson"
3. Verify text appears in input field
4. Repeat for Faculty 2
```
**Expected Result**: Text appears in both fields

#### 3.2 Faculty Designation Input
```
Steps:
1. Enter Designation: "Course Coordinator"
2. Verify text appears
3. Repeat for Faculty 2
```
**Expected Result**: Text appears correctly

#### 3.3 Signature Upload (PNG)
```
Steps:
1. Click "Upload Signature" for Faculty 1
2. Select a PNG image file
3. Verify preview image appears below button
4. Repeat for Faculty 2
```
**Expected Result**: Image preview shows for both signatures

#### 3.4 Invalid Signature Format
```
Steps:
1. Try to upload JPG file as signature
2. Verify only PNG files are accepted
```
**Expected Result**: File picker filters to PNG only, or error if attempting JPG

---

### Test 4: Certificate Generation ✅ [NEW - PDF GENERATION]

**Objective**: Verify certificates are generated as PDFs

**Test Cases**:

#### 4.1 Complete Generation Workflow
```
Steps:
1. Upload test_students.csv (10 students)
2. Enter Subject: "Outstanding Performance Recognition"
3. Select Template 1
4. Enter Faculty Info:
   - Faculty 1: "Dr. John Smith", "Department Head"
   - Faculty 2: "Prof. Sarah Wilson", "Course Instructor"
5. Upload 2 signature images
6. Click "Generate Certificates"
7. Wait for completion (should take 10-30 seconds for 10 students)
```
**Expected Result**: 
- Loading spinner shows
- Success alert: "Successfully generated 10 certificates! Redirecting to Library..."
- Redirects to Library page

#### 4.2 PDF Generation Quality
```
Steps:
1. After generation, check browser console (F12)
2. Look for any errors related to html2canvas or jsPDF
3. Verify no red error messages
```
**Expected Result**: Console clean, no errors about PDF generation

#### 4.3 Validation - Missing Fields
```
Steps:
1. Try to generate without uploading student file
2. Verify "Generate Certificates" button is disabled
3. Add student file
4. Remove template selection
5. Verify button is disabled again
```
**Expected Result**: Button disabled until all required fields filled

#### 4.4 Large Student Count
```
Steps:
1. Create CSV with 50+ students
2. Try to generate
3. Monitor performance
```
**Expected Result**: 
- Slow but completes (>1 minute expected)
- All certificates generated
- No crashes

---

### Test 5: Certificate Storage in Library ✅

**Objective**: Verify certificates are stored and retrievable

**Test Cases**:

#### 5.1 Project Appears in Library
```
Steps:
1. After generation, go to Library page (/library)
2. Verify project card appears
3. Check project shows:
   - Name: "{Subject} - Certificate Project"
   - Certificate count
   - Student count
   - Creation date
   - Template used
```
**Expected Result**: Project card displays all information

#### 5.2 Multiple Projects
```
Steps:
1. Generate second set of certificates (different subject)
2. Go to Library
3. Verify both projects appear
4. Check order (newest first)
```
**Expected Result**: Both projects visible in grid

#### 5.3 Delete Single Project
```
Steps:
1. Hover over project card
2. Click "Delete" button
3. Confirm deletion
4. Verify project removed from list
```
**Expected Result**: Project deleted and no longer visible

#### 5.4 Clear All Projects
```
Steps:
1. In Library header, click "Clear All" button
2. Confirm deletion
3. Verify empty state shown
```
**Expected Result**: 
- All projects deleted
- "No Certificate Projects Found" message appears

---

### Test 6: ZIP Download ✅ [ENHANCED]

**Objective**: Verify all certificates can be downloaded as ZIP

**Test Cases**:

#### 6.1 ZIP File Download
```
Steps:
1. In Library, click "Download ZIP" button
2. Wait for file download
3. Check Downloads folder
4. Verify file named: "{ProjectName}_Certificates.zip"
```
**Expected Result**: ZIP file downloaded successfully

#### 6.2 ZIP Contents Verification
```
Steps:
1. Extract downloaded ZIP file
2. Verify contains PDF files
3. Count PDFs = Student count
4. Check filenames match student names
5. Open a PDF and verify certificate content
```
**Expected Result**: 
- All certificates present
- Named correctly
- PDFs readable and contain student names

#### 6.3 PDF Quality Check
```
Steps:
1. Open certificate PDF in PDF viewer
2. Verify:
   - All text readable
   - Signatures visible
   - Faculty names correct
   - Student name prominent
   - Template design intact
```
**Expected Result**: Professional-looking certificate with all data

---

### Test 7: Email Sending ✅ [SIMULATED]

**Objective**: Verify email feature works (currently simulated)

**Test Cases**:

#### 7.1 Email Modal Opens
```
Steps:
1. In Library, click "Send Emails" on a project
2. Verify modal opens showing:
   - Project summary
   - Email preview
   - Student list
   - Custom message field
```
**Expected Result**: Modal displays all elements

#### 7.2 Email Preview
```
Steps:
1. In modal, scroll to "Email Preview" section
2. Verify preview shows:
   - Subject with project name
   - Greeting to student
   - Project details
   - Optional custom message
```
**Expected Result**: Preview looks professional

#### 7.3 Custom Message
```
Steps:
1. Type custom message in text area
2. Verify it appears in preview
3. Submit without message
4. Try again with message
```
**Expected Result**: Custom message updates preview

#### 7.4 Email Sending Simulation
```
Steps:
1. Click "Send to All Students"
2. Wait for "Sending Emails..." spinner
3. Verify status shows for each student
4. Check results: X successfully sent, Y failed
```
**Expected Result**: 
- Status appears for all students
- ~90% show success (simulated)
- Completion alert shows summary

#### 7.5 Email Status Details
```
Steps:
1. After sending, scroll to "Email Status" section
2. Verify each student shows:
   - Student name
   - Email address
   - Success/failure status
   - Timestamp
```
**Expected Result**: Complete status for all recipients

---

### Test 8: Data Validation ✅

**Objective**: Verify system handles edge cases

**Test Cases**:

#### 8.1 Special Characters in Names
```
Steps:
1. Create CSV with names like: "José García", "François Müller"
2. Generate certificates
3. Verify names display correctly in PDFs
```
**Expected Result**: Special characters rendered correctly

#### 8.2 Long Student Names
```
Steps:
1. Create CSV with very long names: "Muhammad Abdullah Akhtar Hussain Khan"
2. Generate certificates
3. Verify text auto-fits without breaking layout
```
**Expected Result**: Long names fit within certificate bounds

#### 8.3 Very Long Subject Text
```
Steps:
1. Enter long subject: "This certificate is presented for successfully completing..."
2. Generate and check PDF
3. Verify text size adjusts automatically
```
**Expected Result**: Font size reduces to fit, remains readable

#### 8.4 Duplicate Email Addresses
```
Steps:
1. Create CSV with duplicate emails
2. Generate certificates (should allow)
3. Test email sending
4. Verify emails sent to all instances
```
**Expected Result**: System handles duplicates without error

---

## Performance Testing

### Test 9: Speed & Performance ⏱️

**Objective**: Verify system performance

**Test Cases**:

#### 9.1 Single Certificate Generation Time
```
Expected**: < 2 seconds per certificate
Verify: Console shows generation time
```

#### 9.2 Batch Generation (10 students)
```
Expected**: < 30 seconds total
Test**: Monitor progress in browser
```

#### 9.3 Batch Generation (50 students)
```
Expected**: 2-3 minutes total
Test**: Browser remains responsive
```

#### 9.4 ZIP Creation Time
```
Expected**: < 5 seconds for 10 certificates
Test**: Monitor network tab in DevTools
```

---

## Browser Compatibility

### Test 10: Cross-Browser Testing 🌐

**Test on**:
- [ ] Google Chrome (Latest)
- [ ] Mozilla Firefox (Latest)
- [ ] Microsoft Edge (Latest)
- [ ] Safari (if Mac available)

**Check for**:
- [ ] CSS displays correctly
- [ ] File uploads work
- [ ] PDF generation works
- [ ] Downloads work
- [ ] No console errors

---

## Mobile Responsiveness

### Test 11: Mobile Device Testing 📱

**Test Cases**:

#### 11.1 Tablet View
```
Steps:
1. Open in tablet (iPad or Android tablet view)
2. Test all buttons accessible
3. Verify form fields usable
```

#### 11.2 Mobile View
```
Steps:
1. View on mobile device (375px width)
2. Check layout stacks properly
3. Verify all buttons tappable
```

---

## Error Handling

### Test 12: Error Scenarios ⚠️

**Test Cases**:

#### 12.1 Network Error During Generation
```
Steps:
1. Open DevTools Network tab
2. Set to "Offline" mode
3. Try to generate
4. Verify error message shown
```

#### 12.2 Corrupted File Upload
```
Steps:
1. Try to upload non-CSV/Excel file
2. Verify error message
```

#### 12.3 Missing Image in Signature
```
Steps:
1. Generate without uploading signatures
2. Verify certificate still generates
3. Check signature area is empty (not broken)
```

---

## Final Acceptance Tests

### ✅ Complete Workflow Test

**Scenario**: Admin generates and sends certificates to a class

```
Steps:
1. Prepare student list (CSV)
   - Create test_students.csv with 10 students
   
2. Select template
   - Choose Template 2 from Template page
   
3. Add faculty information
   - Faculty 1: Dr. Ramesh Kumar, Head of Department
   - Faculty 2: Prof. Priya Sharma, Coordinator
   - Upload 2 signature images
   
4. Add subject
   - "Advanced Programming Workshop Completion Certificate"
   
5. Generate certificates
   - Click "Generate Certificates"
   - Wait for completion
   
6. Verify in Library
   - See project created
   - Check student count = 10
   - Template = Template 2
   
7. Download certificates
   - Click "Download ZIP"
   - Extract and verify all 10 PDFs
   - Open one PDF and verify content
   
8. Send emails
   - Click "Send Emails"
   - Review email preview
   - Add custom message
   - Click "Send to All Students"
   - Verify status for all 10 students
   
9. Final check
   - Delete project
   - Library should be empty
```

**Success Criteria**:
- ✅ All steps complete without errors
- ✅ PDFs are readable and well-formatted
- ✅ All student names appear in certificates
- ✅ Faculty information displays correctly
- ✅ Email status shows for all recipients
- ✅ ZIP contains exactly 10 PDFs

---

## Sign-Off

**Tester Name**: ___________________
**Date**: ___________________
**Status**: ☐ All Tests Passed ☐ Some Tests Failed ☐ Testing Incomplete

**Notes**:
```
[Space for notes]
```

---

## Issues Found

| Test # | Issue | Severity | Status |
|--------|-------|----------|--------|
| | | | |

---

**Generated**: 2025-11-13
**System Version**: 1.0 with PDF Generation
