import React, { useState, useRef } from 'react';
import { Upload, FileText, Users, Download, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './Certificate.css';
// Import certificate template images
import c1 from '../certificates/c1.png';
import c2 from '../certificates/c2.png';
import c3 from '../certificates/c3.png';
import c4 from '../certificates/c4.png';
import charusatLogo from '../certificates/logo.png';

const CertificateGenerator = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [subject, setSubject] = useState('');
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [faculty1Name, setFaculty1Name] = useState('');
  const [faculty1Designation, setFaculty1Designation] = useState('');
  const [faculty2Name, setFaculty2Name] = useState('');
  const [faculty2Designation, setFaculty2Designation] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    // Check if a template was selected from Template.jsx
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        return template.id;
      } catch (error) {
        console.error('Error parsing saved template:', error);
      }
    }
    return 0;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [parseError, setParseError] = useState('');
  const [generatedCertificates, setGeneratedCertificates] = useState([]);

  const fileInputRef = useRef(null);
  const signature1Ref = useRef(null);
  const signature2Ref = useRef(null);

  // Helper function to generate PDF from HTML - Alternative Method
  const generatePDFFromHTML = async (htmlContent, studentName) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      // Create temporary container for rendering
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '0';
      tempDiv.style.left = '0';
      tempDiv.style.width = '1056px';
      tempDiv.style.height = '816px';
      tempDiv.style.margin = '0';
      tempDiv.style.padding = '0';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.visibility = 'hidden';
      document.body.appendChild(tempDiv);
      
      return new Promise((resolve, reject) => {
        // Allow time for fonts and images to load
        setTimeout(async () => {
          try {
            // Convert HTML to canvas with high DPI for better quality
            const canvas = await html2canvas(tempDiv, {
              scale: 4,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: 1056,
              height: 816,
              logging: false,
              imageTimeout: 5000,
              windowHeight: 816,
              windowWidth: 1056,
              ignoreElements: (element) => {
                return false; // Include all elements
              }
            });
            
            // Create PDF with proper dimensions
            // A4 Landscape: 297mm x 210mm
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'px',
              format: [1056, 816],
              compress: true
            });
            
            // Convert canvas to image
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Add image to PDF (full page, no margins)
            pdf.addImage(imgData, 'PNG', 0, 0, 1056, 816);
            
            // Get PDF blob
            const pdfBlob = pdf.output('blob');
            
            // Cleanup
            document.body.removeChild(tempDiv);
            
            resolve(pdfBlob);
          } catch (error) {
            console.error('Canvas rendering error:', error);
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
            }
            reject(error);
          }
        }, 1000); // Increased delay for better rendering
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  // Helper function to generate certificate HTML
  const generateCertificateHTML = (student, templateId) => {
    // Template 1 - Blue Wave Design
    const template1HTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            html {
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Times New Roman', serif;
                background: white;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }
            .certificate-container {
                width: 1056px;
                height: 816px;
                background: white;
                position: relative;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }
            .wave-top {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 150px;
                background: linear-gradient(135deg, #1e303b 0%, #3d7fa6 100%);
                clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
                z-index: 1;
            }
            .wave-bottom {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 150px;
                background: linear-gradient(135deg, #2c5f7f 0%, #3d7fa6 100%);
                clip-path: polygon(0 30%, 100% 0, 100% 100%, 0 100%);
                z-index: 1;
            }
            .wave-accent-top {
                position: absolute;
                top: 50px;
                left: 0;
                right: 0;
                height: 80px;
                background: linear-gradient(90deg, #f4d19b 0%, #e6c58a 100%);
                clip-path: polygon(0 30%, 100% 0, 100% 70%, 0 100%);
                z-index: 2;
            }
            .wave-accent-bottom {
                position: absolute;
                bottom: 50px;
                left: 0;
                right: 0;
                height: 80px;
                background: linear-gradient(90deg, #e6c58a 0%, #f4d19b 100%);
                clip-path: polygon(0 0, 100% 30%, 100% 100%, 0 70%);
                z-index: 2;
            }
            .corner-decoration {
                position: absolute;
                width: 100px;
                height: 100px;
                z-index: 3;
            }
            .corner-top-right {
                top: 50px;
                right: 50px;
                border-top: 3px solid #d4af37;
                border-right: 3px solid #d4af37;
            }
            .corner-bottom-left {
                bottom: 50px;
                left: 50px;
                border-bottom: 3px solid #d4af37;
                border-left: 3px solid #d4af37;
            }
            .medal {
                position: absolute;
                top: 120px;
                left: 80px;
                width: 100px;
                height: 140px;
                z-index: 5;
            }
            .medal-circle {
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, #f4d03f 0%, #c9a227 100%);
                border-radius: 50%;
                border: 4px solid #b8941f;
                position: relative;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
            .medal-circle::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: conic-gradient(from 45deg, #f4d03f, #e6c029, #f4d03f);
                border-radius: 50%;
            }
            .medal-ribbon {
                width: 40px;
                height: 60px;
                background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
            }
            .content {
                position: relative;
                z-index: 4;
                padding: 180px 100px 100px 220px;
            }
            .certificate-title {
                text-align: center;
                margin-bottom: 20px;
            }
            .title-main {
                font-size: 56px;
                font-weight: bold;
                color: #2c5f7f;
                letter-spacing: 8px;
                margin-bottom: 5px;
            }
            .title-sub {
                font-size: 22px;
                color: #2c5f7f;
                letter-spacing: 4px;
                text-transform: uppercase;
            }
            .presented-text {
                text-align: center;
                font-size: 16px;
                color: #333;
                margin-bottom: 15px;
            }
            .student-name-section {
                text-align: center;
                margin-bottom: 20px;
                min-height: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .student-name {
                font-size: 40px;
                font-weight: bold;
                color: #2c5f7f;
                font-family: 'Brush Script MT', cursive;
                padding: 8px 30px;
                border-bottom: 3px solid #2c5f7f;
                display: inline-block;
                line-height: 1.2;
            }
            .message-section {
                text-align: center;
                margin: 20px auto 30px;
                max-width: 750px;
                min-height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .custom-message {
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                font-style: italic;
            }
            .signatures-section {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
                padding: 0 50px;
            }
            .signature-block {
                text-align: center;
                width: 280px;
            }
            .signature-image {
                height: 60px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .signature-image img {
                max-width: 200px;
                max-height: 60px;
                object-fit: contain;
            }
            .signature-line {
                width: 100%;
                height: 2px;
                background: #333;
                margin-bottom: 8px;
            }
            .faculty-name {
                font-size: 18px;
                font-weight: bold;
                color: #2c5f7f;
                margin-bottom: 5px;
            }
            .faculty-designation {
                font-size: 16px;
                color: #666;
                font-style: italic;
            }
            .logo-section {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 800px;
                height: 100px;
                text-align: center;
                align-items: center;
                justify-content: center;
                display: flex;
                z-index: 10;
                background: transparent;
            }
            .university-logo {
              width: 90%;
              max-width: 900px;
              height: auto;
              object-fit: contain;
              margin: 0;
              padding: 0;
              background: transparent;
            }
        </style>
    </head>
    <body>
        <div class="certificate-container">
            <div class="wave-top"></div>
            <div class="wave-bottom"></div>
            <div class="wave-accent-top"></div>
            <div class="wave-accent-bottom"></div>
            <div class="corner-decoration corner-top-right"></div>
            <div class="corner-decoration corner-bottom-left"></div>
            <div class="medal">
                <div class="medal-circle"></div>
                <div class="medal-ribbon"></div>
            </div>
            <div class="logo-section">
                <img src="${charusatLogo}" alt="CHARUSAT Logo" class="university-logo" id="universityLogo">
            </div>
            <div class="content">
                <div class="certificate-title">
                    <div class="title-main">CERTIFICATE</div>
                    <div class="title-sub">OF PARTICIPATION</div>
                </div>
                <div class="presented-text">
                    This certificate is proudly presented to
                </div>
                <div class="student-name-section">
                    <div class="student-name">${student.name}</div>
                </div>
                <div class="message-section">
                    <div class="custom-message">${subject}</div>
                </div>
                <div class="signatures-section">
                    <div class="signature-block">
                        ${signature1 ? `<div class="signature-image"><img src="${signature1}" alt="Signature 1"></div>` : '<div class="signature-image"></div>'}
                        <div class="signature-line"></div>
                        <div class="faculty-name">${faculty1Name || 'Faculty Name'}</div>
                        <div class="faculty-designation">${faculty1Designation || 'Designation'}</div>
                    </div>
                    <div class="signature-block">
                        ${signature2 ? `<div class="signature-image"><img src="${signature2}" alt="Signature 2"></div>` : '<div class="signature-image"></div>'}
                        <div class="signature-line"></div>
                        <div class="faculty-name">${faculty2Name || 'Faculty Name'}</div>
                        <div class="faculty-designation">${faculty2Designation || 'Designation'}</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    // Template 2 - Green Design
    const template2HTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; background: white; margin: 0; padding: 0; width: 100%; height: 100%; }
            .certificate-container { width: 1056px; height: 816px; background: white; position: relative; overflow: hidden; }
            .green-section { position: absolute; top: 0; left: 0; width: 40%; height: 100%; background: linear-gradient(135deg, #0d5e4a 0%, #1a7a5e 50%, #0d5e4a 100%); clip-path: polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%); z-index: 1; }
            .decorative-circle { position: absolute; width: 200px; height: 200px; border: 4px solid rgba(255,255,255,0.3); border-radius: 50%; z-index: 2; }
            .circle-1 { top: -50px; left: -50px; }
            .circle-2 { bottom: -75px; right: -75px; }
            .content { position: relative; z-index: 4; padding: 50px 60px; margin-left: 250px; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { width: 90%; max-width: 900px; height: auto; object-fit: contain; margin: 0; padding: 0; background: transparent; }
            .badge { font-size: 14px; letter-spacing: 3px; color: #0d5e4a; text-transform: uppercase; margin-bottom: 15px; }
            .title { font-size: 58px; font-weight: bold; color: #0d5e4a; letter-spacing: 6px; margin-bottom: 10px; }
            .subtitle { font-size: 15px; color: #666; letter-spacing: 2px; }
            .presented { text-align: center; font-size: 15px; color: #333; margin: 25px 0; }
            .student-name { text-align: center; font-size: 44px; font-weight: bold; color: #0d5e4a; font-family: 'Brush Script MT', cursive; margin: 15px 0; padding: 12px; border-bottom: 3px solid #0d5e4a; }
            .message { text-align: center; font-size: 15px; color: #333; line-height: 1.8; margin: 20px 0 30px 0; font-style: italic; }
            .signatures { display: flex; justify-content: center; gap: 80px; margin-top: 35px; margin-bottom: 60px; }
            .signature-block { text-align: center; }
            .sig-image { height: 50px; margin-bottom: 10px; }
            .sig-image img { max-height: 50px; max-width: 150px; object-fit: contain; }
            .sig-line { width: 150px; height: 2px; background: #333; margin: 10px auto; }
            .sig-name { font-size: 16px; font-weight: bold; color: #0d5e4a; margin-top: 10px; }
            .sig-title { font-size: 14px; color: #666; margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class="certificate-container">
            <div class="green-section"></div>
            <div class="decorative-circle circle-1"></div>
            <div class="decorative-circle circle-2"></div>
            <div class="content">
                <div class="header">
                   <img src="${charusatLogo}" alt="CHARUSAT Logo" class="logo">
                    <div class="badge">Certificate</div>
                    <div class="title">APPRECIATION</div>
                    <div class="subtitle">OF ACHIEVEMENT</div>
                </div>
                <div class="presented">This is to certify that</div>
                <div class="student-name">${student.name}</div>
                <div class="message">${subject}</div>
                <div class="signatures">
                    <div class="signature-block">
                        ${signature1 ? `<div class="sig-image"><img src="${signature1}" alt="Signature 1"></div>` : '<div class="sig-image"></div>'}
                        <div class="sig-line"></div>
                        <div class="sig-name">${faculty1Name || 'Faculty Name'}</div>
                        <div class="sig-title">${faculty1Designation || 'Designation'}</div>
                    </div>
                    <div class="signature-block">
                        ${signature2 ? `<div class="sig-image"><img src="${signature2}" alt="Signature 2"></div>` : '<div class="sig-image"></div>'}
                        <div class="sig-line"></div>
                        <div class="sig-name">${faculty2Name || 'Faculty Name'}</div>
                        <div class="sig-title">${faculty2Designation || 'Designation'}</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    // Template 3 - Classic Design
    const template3HTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; background: white; margin: 0; padding: 0; width: 100%; height: 100%; }
            .certificate { width: 1056px; height: 816px; position: relative; background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); padding: 32px; margin: 0; }
            .cert-inner { position: relative; width: 100%; height: 100%; background: linear-gradient(to bottom right, #fdfcfb 0%, #ffffff 50%, #e2d1c3 100%); border-radius: 15px; padding: 50px 60px; border: 4px solid #8b7355; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
            .border-design { position: absolute; width: 100%; height: 100%; pointer-events: none; }
            .border-line { position: absolute; background: #d4af37; }
            .border-top { top: 20px; left: 20px; right: 20px; height: 2px; }
            .border-bottom { bottom: 20px; left: 20px; right: 20px; height: 2px; }
            .border-left { top: 20px; left: 20px; width: 2px; bottom: 20px; }
            .border-right { top: 20px; right: 20px; width: 2px; bottom: 20px; }
            .content { position: relative; z-index: 2; }
            .template-logo { width: 90%; max-width: 900px; height: auto; object-fit: contain; margin: 0; padding: 0; background: transparent; margin-bottom: 12px; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { font-size: 55px; color: #8b4513; font-weight: bold; letter-spacing: 4px; margin-bottom: 10px; }
            .subtitle { font-size: 17px; color: #333; letter-spacing: 3px; }
            .presented { text-align: center; font-size: 16px; color: #666; margin: 30px 0; }
            .student-name { text-align: center; font-size: 36px; color: #8b4513; font-weight: bold; font-family: 'Brush Script MT', cursive; padding: 15px; margin: 15px 0; border-top: 2px solid #8b7355; border-bottom: 2px solid #8b7355; }
            .message { text-align: center; font-size: 14px; color: #333; line-height: 1.8; margin: 20px 0; font-style: italic; }
            .signatures { display: flex; justify-content: center; gap: 100px; margin-top: 20px; padding: 0 40px; }
            .signature-block { text-align: center; }
            .sig-image { height: 50px; margin-bottom: 15px; }
            .sig-image img { max-height: 50px; max-width: 150px; object-fit: contain; }
            .sig-line { width: 140px; height: 2px; background: #333; margin: 10px auto; }
            .sig-name { font-size: 15px; font-weight: bold; color: #333; margin-top: 10px; }
            .sig-title { font-size: 13px; color: #666; }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="cert-inner">
                <div class="border-design">
                    <div class="border-line border-top"></div>
                    <div class="border-line border-bottom"></div>
                    <div class="border-line border-left"></div>
                    <div class="border-line border-right"></div>
                </div>
                <div class="content">
                      <div class="header">
                        <img src="${charusatLogo}" alt="CHARUSAT Logo" class="template-logo">
                        <div class="title">CERTIFICATE</div>
                        <div class="subtitle">OF EXCELLENCE</div>
                      </div>
                    <div class="presented">This is proudly presented to</div>
                    <div class="student-name">${student.name}</div>
                    <div class="message">${subject}</div>
                    <div class="signatures">
                        <div class="signature-block">
                            ${signature1 ? `<div class="sig-image"><img src="${signature1}" alt="Signature 1"></div>` : '<div class="sig-image"></div>'}
                            <div class="sig-line"></div>
                            <div class="sig-name">${faculty1Name || 'Faculty Name'}</div>
                            <div class="sig-title">${faculty1Designation || 'Designation'}</div>
                        </div>
                        <div class="signature-block">
                            ${signature2 ? `<div class="sig-image"><img src="${signature2}" alt="Signature 2"></div>` : '<div class="sig-image"></div>'}
                            <div class="sig-line"></div>
                            <div class="sig-name">${faculty2Name || 'Faculty Name'}</div>
                            <div class="sig-title">${faculty2Designation || 'Designation'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    // Template 4 - Modern Design
    const template4HTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { margin: 0; padding: 0; }
            body { font-family: 'Arial', sans-serif; background: white; margin: 0; padding: 0; width: 100%; height: 100%; }
            .certificate { width: 1056px; height: 816px; position: relative; background: white; overflow: hidden; display: flex; flex-direction: column; margin: 0; padding: 0; }
            .corner-top-left { position: absolute; top: 0; left: 0; width: 380px; height: 300px; background: linear-gradient(135deg, #1a4d3c 0%, #2d7d5f 100%); clip-path: polygon(0 0, 100% 0, 35% 100%, 0 85%); z-index: 1; }
            .corner-top-left::before { content: ''; position: absolute; width: 200px; height: 200px; border: 2px solid rgba(255,255,255,0.1); border-radius: 50%; top: -50px; left: -50px; }
            .corner-bottom-right { position: absolute; bottom: 0; right: 0; width: 380px; height: 300px; background: linear-gradient(315deg, #1a4d3c 0%, #2d7d5f 100%); clip-path: polygon(100% 100%, 0 100%, 65% 0, 100% 15%); z-index: 1; }
            .circle { position: absolute; border-radius: 50%; border: 2px solid rgba(26,77,60,0.2); z-index: 0; }
            .circle-1 { width: 300px; height: 300px; top: 50%; left: 50%; transform: translate(-50%, -50%); }
            .content { position: relative; z-index: 3; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 80px; text-align: center; }
            .template-logo { width: 90%; max-width: 900px; height: auto; object-fit: contain; margin: 0; padding: 0; background: transparent; margin-bottom: 12px; }
            .badge { display: inline-block; padding: 8px 20px; background: #1a4d3c; color: white; border-radius: 20px; font-size: 12px; letter-spacing: 2px; margin-bottom: 30px; }
            .title { font-size: 52px; color: #1a4d3c; font-weight: bold; letter-spacing: 3px; margin-bottom: 5px; }
            .subtitle { font-size: 15px; color: #666; letter-spacing: 2px; margin-bottom: 40px; }
            .presented { font-size: 14px; color: #333; margin-bottom: 12px; }
            .student-name { font-size: 40px; color: #1a4d3c; font-weight: bold; font-family: 'Brush Script MT', cursive; margin: 12px 0; padding: 12px 0; border-bottom: 3px solid #1a4d3c; }
            .message { font-size: 14px; color: #333; line-height: 1.8; margin: 20px 0 30px 0; max-width: 700px; font-style: italic; }
            .signatures { display: flex; justify-content: center; gap: 150px; margin-top: 40px; margin-bottom: 60px; }
            .signature-block { text-align: center; min-width: 180px; }
            .sig-image { height: 50px; margin-bottom: 15px; }
            .sig-image img { max-height: 50px; max-width: 140px; object-fit: contain; }
            .sig-line { width: 120px; height: 2px; background: #333; margin: 10px auto; }
            .sig-name { font-size: 14px; font-weight: bold; color: #1a4d3c; margin-top: 8px; }
            .sig-title { font-size: 12px; color: #666; margin-top: 4px; }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="corner-top-left"></div>
            <div class="corner-bottom-right"></div>
            <div class="circle circle-1"></div>
            <div class="content">
              <img src="${charusatLogo}" alt="CHARUSAT Logo" class="template-logo">
              <div class="badge">Certificate</div>
                <div class="title">HONOR</div>
                <div class="subtitle">ACHIEVEMENT & EXCELLENCE</div>
                <div class="presented">This is presented to</div>
                <div class="student-name">${student.name}</div>
                <div class="message">${subject}</div>
                <div class="signatures">
                    <div class="signature-block">
                        ${signature1 ? `<div class="sig-image"><img src="${signature1}" alt="Signature 1"></div>` : '<div class="sig-image"></div>'}
                        <div class="sig-line"></div>
                        <div class="sig-name">${faculty1Name || 'Faculty Name'}</div>
                        <div class="sig-title">${faculty1Designation || 'Designation'}</div>
                    </div>
                    <div class="signature-block">
                        ${signature2 ? `<div class="sig-image"><img src="${signature2}" alt="Signature 2"></div>` : '<div class="sig-image"></div>'}
                        <div class="sig-line"></div>
                        <div class="sig-name">${faculty2Name || 'Faculty Name'}</div>
                        <div class="sig-title">${faculty2Designation || 'Designation'}</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    // Return the correct template based on templateId
    switch(templateId) {
      case 0:
      case 1:
        return template1HTML;
      case 2:
        return template2HTML;
      case 3:
        return template3HTML;
      case 4:
        return template4HTML;
      default:
        return template1HTML;
    }
  };

  // Real certificate templates (thumbnails + file path)
  const certificateTemplates = [
    { id: 1, name: 'Template 1', thumb: c1, file: '/certificates/c1.html' },
    { id: 2, name: 'Template 2', thumb: c2, file: '/certificates/c2.html' },
    { id: 3, name: 'Template 3', thumb: c3, file: '/certificates/c3.html' },
    { id: 4, name: 'Template 4', thumb: c4, file: '/certificates/c4.html' },
  ];

  // File parsing function for both Excel and CSV
  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              reject(new Error('CSV parsing error: ' + results.errors[0].message));
            } else {
              resolve(results.data);
            }
          },
          error: (error) => {
            reject(new Error('CSV parsing error: ' + error.message));
          }
        });
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Convert to object format with headers
            if (jsonData.length > 0) {
              const headers = jsonData[0];
              const rows = jsonData.slice(1);
              const result = rows.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                  obj[header] = row[index] || '';
                });
                return obj;
              });
              resolve(result);
            } else {
              reject(new Error('Excel file is empty'));
            }
          } catch (error) {
            reject(new Error('Excel parsing error: ' + error.message));
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file format. Please upload CSV or Excel files.'));
      }
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setParseError('');
    setFile(file);

    try {
      const data = await parseFile(file);
      
      // Validate that the data has required columns
      if (data.length === 0) {
        throw new Error('File is empty');
      }

      // Check for required columns (name and email)
      const firstRow = data[0];
      const hasName = Object.keys(firstRow).some(key => 
        key.toLowerCase().includes('name') || 
        key.toLowerCase().includes('student')
      );
      const hasEmail = Object.keys(firstRow).some(key => 
        key.toLowerCase().includes('email') || 
        key.toLowerCase().includes('mail')
      );

      if (!hasName || !hasEmail) {
        throw new Error('File must contain columns with "name" and "email" (or similar variations)');
      }

      // Normalize the data structure
      const normalizedData = data.map((row, index) => {
        const nameKey = Object.keys(row).find(key => 
          key.toLowerCase().includes('name') || 
          key.toLowerCase().includes('student')
        );
        const emailKey = Object.keys(row).find(key => 
          key.toLowerCase().includes('email') || 
          key.toLowerCase().includes('mail')
        );
        
        return {
          id: index + 1,
          name: row[nameKey] || '',
          email: row[emailKey] || '',
          rollNo: row['Roll No'] || row['RollNo'] || row['roll_no'] || row['rollno'] || '',
          ...row // Include all other columns
        };
      }).filter(student => student.name && student.email); // Filter out empty rows

      setStudentData(normalizedData);
    } catch (error) {
      setParseError(error.message);
      setStudentData([]);
    }
  };

  const handleSignatureUpload = (event, signatureNumber) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (signatureNumber === 1) {
          setSignature1(e.target.result);
        } else {
          setSignature2(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateFontSize = (text, maxSize = 24, minSize = 12) => {
    const length = text.length;
    if (length <= 50) return maxSize;
    if (length <= 100) return maxSize - 4;
    if (length <= 150) return maxSize - 8;
    return Math.max(minSize, maxSize - 12);
  };

  const handleGenerate = async () => {
    if (!file || !subject || selectedTemplate === null || studentData.length === 0) {
      alert('Please fill all required fields and upload student data');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate certificates for each student with PDFs
      const certificatesWithPDF = [];
      
      for (let index = 0; index < studentData.length; index++) {
        const student = studentData[index];
        
        // Generate HTML for this certificate
        const htmlContent = generateCertificateHTML(student, selectedTemplate);
        
        // Generate PDF from HTML
        const pdfBlob = await generatePDFFromHTML(htmlContent, student.name);
        
        certificatesWithPDF.push({
          id: `CERT-${Date.now()}-${index + 1}`,
          studentName: student.name,
          studentEmail: student.email,
          studentRollNo: student.rollNo,
          subject: subject,
          templateId: selectedTemplate,
          faculty1Name: faculty1Name,
          faculty1Designation: faculty1Designation,
          faculty2Name: faculty2Name,
          faculty2Designation: faculty2Designation,
          signature1: signature1,
          signature2: signature2,
          generatedAt: new Date().toISOString(),
          certificateNumber: `CERT-${String(index + 1).padStart(3, '0')}`,
          pdfBlob: pdfBlob,
          htmlContent: htmlContent
        });
      }

      // Create ZIP file with all certificates
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      certificatesWithPDF.forEach((cert) => {
        const fileName = `Certificate_${cert.studentName.replace(/\s+/g, '_')}.pdf`;
        zip.file(fileName, cert.pdfBlob);
      });
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Store the generated certificates in localStorage for Library page
      const projectData = {
        id: `PROJECT-${Date.now()}`,
        name: `${subject} - Certificate Project`,
        subject: subject,
        templateUsed: `Template ${selectedTemplate + 1}`,
        certificates: certificatesWithPDF,
        studentData: studentData,
        faculty1Name: faculty1Name,
        faculty1Designation: faculty1Designation,
        faculty2Name: faculty2Name,
        faculty2Designation: faculty2Designation,
        signature1: signature1,
        signature2: signature2,
        createdAt: new Date().toISOString(),
        totalCertificates: certificatesWithPDF.length,
        zipBlob: null // Don't store blob directly - it will be regenerated on download
      };

      // Save to localStorage
      const existingProjects = JSON.parse(localStorage.getItem('certificateProjects') || '[]');
      existingProjects.push(projectData);
      localStorage.setItem('certificateProjects', JSON.stringify(existingProjects));

      setGeneratedCertificates(certificatesWithPDF);
      
      // Show success message
      alert(`Successfully generated ${certificatesWithPDF.length} certificates! Redirecting to Library...`);
      
      // Navigate to Library page
      navigate('/library');
      
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Error generating certificates. Please try again. ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTemplateColors = (color) => {
    const colors = {
      blue: {
        primary: '#3B82F6',
        secondary: '#DBEAFE',
        light: '#EFF6FF',
        dark: '#1E40AF'
      },
      green: {
        primary: '#10B981',
        secondary: '#D1FAE5',
        light: '#ECFDF5',
        dark: '#047857'
      },
      purple: {
        primary: '#8B5CF6',
        secondary: '#E9D5FF',
        light: '#F3E8FF',
        dark: '#6B21A8'
      },
      red: {
        primary: '#EF4444',
        secondary: '#FECACA',
        light: '#FEF2F2',
        dark: '#B91C1C'
      },
      orange: {
        primary: '#F97316',
        secondary: '#FED7AA',
        light: '#FFF7ED',
        dark: '#C2410C'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="container">
      <div className="content">
        <div className="header">
          <h1 className="title">E-Certificate Generator</h1>
          <p className="subtitle">Generate professional certificates for your students with ease</p>
        </div>

        <div className="main-layout">
          {/* Left Panel - Certificate Details */}
          <div className="left-panel">
            <div className="sections">
              {/* File Upload Section */}
              <div className="section csv-section">
                <div className="section-header">
                  <FileText size={24} color="#2563EB" />
                  <h3 className="section-title">Upload Student Data</h3>
                </div>
            <input
              type="file"
                  accept=".csv,.xlsx,.xls"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden-input"
            />
            <button
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-button"
                >
                  <Upload size={20} />
                  <span className="button-text">
                    {file ? file.name : 'Choose CSV/Excel File'}
                  </span>
            </button>
                <p className="file-hint">
                  Supported formats: CSV, Excel (.xlsx, .xls)<br/>
                  Required columns: Name (or Student Name), Email
                </p>
                {parseError && (
                  <div className="error-message">
                    <span style={{ color: '#EF4444' }}>Error: {parseError}</span>
              </div>
            )}
                {studentData.length > 0 && (
                  <div className="success-message">
                    <Users size={16} />
                    <span>{studentData.length} students loaded successfully</span>
              </div>
            )}
          </div>

              {/* Subject Section */}
              <div className="section subject-section">
                <h3 className="section-title">Certificate Subject</h3>
                <textarea
              value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter the subject or message for the certificate..."
                  className="textarea"
                  style={{ fontSize: `${calculateFontSize(subject)}px` }}
                />
                <p className="font-size-info">
                  Font size adjusts automatically: {calculateFontSize(subject)}px
                </p>
          </div>

              {/* Signature Upload Section */}
              <div className="signature-grid">
          {/* Faculty 1 */}
                <div className="section signature-section signature1">
                  <div className="section-header">
                    <Upload size={20} color="#7C3AED" />
                    <h3 className="section-title-small">Faculty 1</h3>
                  </div>
                  <input
                    type="file"
                    accept=".png"
                    ref={signature1Ref}
                    onChange={(e) => handleSignatureUpload(e, 1)}
                    className="hidden-input"
                  />
                  <button
                    onClick={() => signature1Ref.current?.click()}
                    className="signature-button signature1-button"
                  >
                    <Upload size={16} />
                    Upload Signature
                  </button>
                  {signature1 && (
                    <img src={signature1} alt="Signature 1" className="signature-preview" />
                  )}
              <input
                type="text"
                    value={faculty1Name}
                    onChange={(e) => setFaculty1Name(e.target.value)}
                placeholder="Faculty Name"
                    className="input"
                  />
              <input
                type="text"
                value={faculty1Designation}
                    onChange={(e) => setFaculty1Designation(e.target.value)}
                    placeholder="Designation"
                    className="input"
                  />
          </div>

          {/* Faculty 2 */}
                <div className="section signature-section signature2">
                  <div className="section-header">
                    <Upload size={20} color="#EA580C" />
                    <h3 className="section-title-small">Faculty 2</h3>
                  </div>
                  <input
                    type="file"
                    accept=".png"
                    ref={signature2Ref}
                    onChange={(e) => handleSignatureUpload(e, 2)}
                    className="hidden-input"
                  />
                  <button
                    onClick={() => signature2Ref.current?.click()}
                    className="signature-button signature2-button"
                  >
                    <Upload size={16} />
                    Upload Signature
                  </button>
                  {signature2 && (
                    <img src={signature2} alt="Signature 2" className="signature-preview" />
                  )}
              <input
                type="text"
                    value={faculty2Name}
                    onChange={(e) => setFaculty2Name(e.target.value)}
                placeholder="Faculty Name"
                    className="input"
                  />
              <input
                type="text"
                value={faculty2Designation}
                    onChange={(e) => setFaculty2Designation(e.target.value)}
                    placeholder="Designation"
                    className="input"
                  />
            </div>
          </div>

          {/* Generate Button */}
          <button
                onClick={handleGenerate}
                disabled={!file || !subject || selectedTemplate === null || isGenerating || studentData.length === 0}
                className={`generate-button ${(!file || !subject || selectedTemplate === null || isGenerating || studentData.length === 0) ? 'disabled' : ''}`}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    <span className="button-text">Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={24} />
                    <span className="button-text">Generate Certificates</span>
                  </>
                )}
          </button>
            </div>
        </div>

          {/* Right Panel - 40% */}
          <div className="right-panel">
            <div className="templates-header">
              <div className="section-header">
                <Image size={24} color="#4F46E5" />
                <h3 className="section-title-large">Certificate Templates</h3>
        </div>
              <div className="template-count">
                {certificateTemplates.length} Professional Templates Available
      </div>
    </div>
            
            <div className="templates-container">
              <div className="templates-grid">
                {certificateTemplates.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`template-card ${isSelected ? 'selected' : ''}`}
                    >
                      <img src={template.thumb} alt={template.name} className="template-img" />
                      <div className="template-info">
                        <div className="template-title"><h6>{template.name}</h6></div>
                        <button
                          className="select-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template.id);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Use This Template'}
                        </button>
                </div>
              </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;