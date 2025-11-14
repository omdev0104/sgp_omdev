import React, { useState, useEffect } from 'react';
import './Library.css';
import { Mail, Users, Calendar, FileText, Archive, Trash2 } from 'lucide-react';
import { saveAs } from 'file-saver';

const Library = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState({});

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('certificateProjects') || '[]');
    setProjects(savedProjects);
  }, []);

  const deleteProject = (projectId) => {
    if (!projectId) return;
    const confirmDelete = window.confirm('Delete this project and its history?');
    if (!confirmDelete) return;

    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    localStorage.setItem('certificateProjects', JSON.stringify(updated));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
      setIsModalOpen(false);
    }
  };

  const clearAllProjects = () => {
    const confirmDelete = window.confirm('Delete all certificate history?');
    if (!confirmDelete) return;
    setProjects([]);
    localStorage.setItem('certificateProjects', JSON.stringify([]));
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleSendEmail = async () => {
    if (!selectedProject) return;

    setIsSending(true);
    setEmailStatus({});

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        alert('Please log in first to send emails');
        setIsSending(false);
        return;
      }

      // Prepare email data with student information
      const emailPromises = selectedProject.certificates.map(async (certificate, index) => {
        try {
          // Simulate API call with delay
          await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
          
          // In a real application, this would be sent to your backend:
          // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-email`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${authToken}`
          //   },
          //   body: JSON.stringify({
          //     to: certificate.studentEmail,
          //     studentName: certificate.studentName,
          //     subject: `Your Certificate - ${selectedProject.subject}`,
          //     message: customMessage,
          //     certificateData: certificate
          //   })
          // });
          
          // For now, simulate success (90% success rate)
          const success = Math.random() > 0.1;
          
          console.log(`Email ${success ? 'sent' : 'failed'} to ${certificate.studentEmail}`);
          
          return {
            certificateId: certificate.id,
            studentEmail: certificate.studentEmail,
            studentName: certificate.studentName,
            success: success,
            message: success ? 'Email sent successfully' : 'Failed to send email',
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error sending to ${certificate.studentEmail}:`, error);
          return {
            certificateId: certificate.id,
            studentEmail: certificate.studentEmail,
            studentName: certificate.studentName,
            success: false,
            message: error.message,
            timestamp: new Date().toISOString()
          };
        }
      });

      const results = await Promise.all(emailPromises);
      
      // Update email status
      const statusMap = {};
      results.forEach(result => {
        statusMap[result.certificateId] = result;
      });
      setEmailStatus(statusMap);

      // Show summary
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;
      
      const summary = `Email sending completed!\n✅ Successfully sent: ${successCount}\n❌ Failed: ${failCount}`;
      alert(summary);
      
      // Optionally close modal after successful sending
      if (failCount === 0) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Error sending emails. Please try again. ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  // Function to download individual certificate as PDF
  const downloadCertificate = (certificate) => {
    if (certificate.pdfBlob) {
      const fileName = `Certificate_${certificate.studentName.replace(/\s+/g, '_')}.pdf`;
      saveAs(certificate.pdfBlob, fileName);
    } else {
      // Fallback: Generate PDF from HTML content
      generatePDFFromHTML(certificate.htmlContent, certificate.studentName);
    }
  };

  // Function to generate PDF from HTML (fallback)
  const generatePDFFromHTML = async (htmlContent, studentName) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'mm', 'a4');
          
          const imgWidth = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          const fileName = `Certificate_${studentName.replace(/\s+/g, '_')}.pdf`;
          pdf.save(fileName);
          
          document.body.removeChild(tempContainer);
        } catch (error) {
          document.body.removeChild(tempContainer);
          console.error('Error generating PDF:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error loading PDF libraries:', error);
    }
  };

  // Function to download all certificates as ZIP
  const downloadAllCertificates = async (project) => {
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      
      // Use project.zipBlob if available, otherwise generate from certificates
      if (project.zipBlob && project.zipBlob instanceof Blob) {
        // Direct download if zipBlob exists and is a valid Blob
        const fileName = `${project.name.replace(/\s+/g, '_')}_Certificates.zip`;
        saveAs(project.zipBlob, fileName);
      } else if (project.certificates && project.certificates.length > 0) {
        // Generate ZIP from individual certificate PDFs
        let hasValidPDF = false;
        
        for (const certificate of project.certificates) {
          if (certificate.pdfBlob && certificate.pdfBlob instanceof Blob) {
            const fileName = `Certificate_${certificate.studentName.replace(/\s+/g, '_')}.pdf`;
            zip.file(fileName, certificate.pdfBlob);
            hasValidPDF = true;
          } else if (certificate.htmlContent) {
            // Fallback: Generate PDF from HTML if blob not available
            try {
              const { default: html2canvas } = await import('html2canvas');
              const { default: jsPDF } = await import('jspdf');
              
              const tempContainer = document.createElement('div');
              tempContainer.innerHTML = certificate.htmlContent;
              tempContainer.style.position = 'absolute';
              tempContainer.style.left = '-9999px';
              tempContainer.style.width = '1056px';
              tempContainer.style.height = '816px';
              document.body.appendChild(tempContainer);
              
              const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 1056,
                height: 816
              });
              
              document.body.removeChild(tempContainer);
              
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF('landscape', 'mm', 'a4');
              const imgWidth = 297;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
              
              const pdfBlob = pdf.output('blob');
              const fileName = `Certificate_${certificate.studentName.replace(/\s+/g, '_')}.pdf`;
              zip.file(fileName, pdfBlob);
              hasValidPDF = true;
            } catch (pdfError) {
              console.error(`Error generating PDF for ${certificate.studentName}:`, pdfError);
            }
          }
        }
        
        if (hasValidPDF) {
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          
          // Verify zipBlob is a valid Blob
          if (zipBlob instanceof Blob && zipBlob.size > 0) {
            const fileName = `${project.name.replace(/\s+/g, '_')}_Certificates.zip`;
            saveAs(zipBlob, fileName);
          } else {
            throw new Error('Generated ZIP file is invalid');
          }
        } else {
          alert('No valid certificates found to download. Please regenerate certificates.');
        }
      } else {
        alert('No certificates found in this project.');
      }
    } catch (error) {
      console.error('Error downloading certificates:', error);
      alert(`Error downloading ZIP file: ${error.message}\n\nTry regenerating certificates or downloading individual PDFs.`);
    }
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>Certificate Library</h1>
        <p>Manage and send your generated certificates</p>
        {projects.length > 0 && (
          <button className="action-button secondary" onClick={clearAllProjects} style={{ marginLeft: 'auto' }}>
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} color="#9CA3AF" />
          <h3>No Certificate Projects Found</h3>
          <p>Generate certificates first to see them here.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3 className="project-title">{project.name}</h3>
                <div className="project-badge">
                  <FileText size={16} />
                  <span>{project.totalCertificates} Certificates</span>
                </div>
              </div>
              
              <div className="project-details">
                <div className="detail-item">
                  <Users size={16} color="#6B7280" />
                  <span>{project.studentData.length} Students</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} color="#6B7280" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <FileText size={16} color="#6B7280" />
                  <span>{project.templateUsed}</span>
                </div>
              </div>

              <div className="project-subject">
                <strong>Subject:</strong> {project.subject}
              </div>

                                <div className="project-actions">
                                    <button
                                        className="action-button primary"
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <Mail size={16} />
                                        Send Emails
                                    </button>
                                    <button
                                        className="action-button secondary"
                                        onClick={() => downloadAllCertificates(project)}
                                    >
                                        <Archive size={16} />
                                        Download ZIP
                                    </button>
                    <button
                        className="action-button secondary"
                        onClick={() => deleteProject(project.id)}
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                                </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {isModalOpen && selectedProject && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Send Certificates via Email</h2>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="project-summary">
                <h4>{selectedProject.name}</h4>
                <p><strong>Students:</strong> {selectedProject.studentData.length}</p>
                <p><strong>Subject:</strong> {selectedProject.subject}</p>
              </div>

              <div className="email-preview">
                <h4>Email Preview</h4>
                <div className="email-template">
                  <p><strong>Subject:</strong> Your Certificate - {selectedProject.subject}</p>
                  <div className="email-body">
                    <p>Dear Student,</p>
                    <p>Congratulations! Your certificate for <strong>{selectedProject.subject}</strong> is ready.</p>
                    <p>Please find your certificate attached to this email.</p>
                    {customMessage && (
                      <div className="custom-message">
                        <p><strong>Additional Message:</strong></p>
                        <p>{customMessage}</p>
                      </div>
                    )}
                    <p>Best regards,<br/>Certificate Team</p>
                  </div>
                </div>
              </div>

              <div className="custom-message-section">
                <label htmlFor="customMessage">Custom Message (Optional):</label>
                <textarea
                  id="customMessage"
                  placeholder="Add a custom message to include in all emails..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="email-status">
                {Object.keys(emailStatus).length > 0 && (
                  <div className="status-list">
                    <h4>Email Status:</h4>
                    {selectedProject.certificates.map(certificate => {
                      const status = emailStatus[certificate.id];
                      return (
                        <div key={certificate.id} className={`status-item ${status?.success ? 'success' : 'error'}`}>
                          <span>{certificate.studentName} ({certificate.studentEmail})</span>
                          <span>{status?.message}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="send-button"
                  onClick={handleSendEmail}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <div className="spinner"></div>
                      Sending Emails...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Send to All Students
                    </>
                  )}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSending}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;