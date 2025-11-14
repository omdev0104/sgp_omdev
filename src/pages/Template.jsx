import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Template.css';

// Import your certificate screenshot thumbnails
import c1 from '../certificates/c1.png';
import c2 from '../certificates/c2.png';
import c3 from '../certificates/c3.png';
import c4 from '../certificates/c4.png';

const Template = () => {
  const navigate = useNavigate();

  // Array of certificate templates
  const certificateTemplates = [
    { id: 1, name: 'Template 1', thumb: c1, description: 'Classic blue and gold design with waves and medal' },
    { id: 2, name: 'Template 2', thumb: c2, description: 'Modern green geometric design with laurel wreath' },
    { id: 3, name: 'Template 3', thumb: c3, description: 'Elegant brown and gold with corner decorations' },
    { id: 4, name: 'Template 4', thumb: c4, description: 'Professional green and gold with geometric patterns' },
  ];

  const handleTemplateSelect = (template) => {
    // Store selected template in localStorage with all necessary information
    const templateData = {
      id: template.id,
      name: template.name,
      thumb: template.thumb,
      description: template.description,
      selectedAt: new Date().toISOString()
    };
    localStorage.setItem('selectedTemplate', JSON.stringify(templateData));
    // Navigate to certificate page
    navigate('/certificate');
  };

  return (
    <div className="template-page">
      <div className="template-header">
        <h1 className="template-title">Certificate Templates</h1>
        <p className="template-subtitle">Choose from our professional certificate designs</p>
      </div>

      <div className="template-grid">
        {certificateTemplates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="template-image-container">
              <img src={template.thumb} alt={template.name} className="template-img" />
              <div className="template-overlay">
                <button className="select-template-button">
                  Use This Template
                </button>
              </div>
            </div>
            <div className="template-info">
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template;
