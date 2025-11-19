import React from 'react';
import { useGetContactByIdQuery } from '../services/contactApi';
import { useNavigate } from 'react-router-dom';
import'./ContactDetail.css'
interface ContactDetailProps {
  id: string;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const { data: apiResponse, error, isLoading } = useGetContactByIdQuery(id);

  if (isLoading) {
    return <div className="contact-detail-container">Loading contact details...</div>;
  }

  if (error) {
    console.error("Error fetching contact details:", error);
    return <div className="contact-detail-container">Error loading contact details: {JSON.stringify(error)}</div>;
  }

  const contact = apiResponse?.data;

  if (!contact) {
    return <div className="contact-detail-container">No contact found.</div>;
  }

  return (
    <div className="contact-detail-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>
      <h2 className="contact-detail-header">Contact Details</h2>
      <div className="contact-detail-card">
        <div className="detail-item">
          <strong>Name:</strong> {contact.name}
        </div>
        <div className="detail-item">
          <strong>Email:</strong> {contact.email}
        </div>
        <div className="detail-item">
          <strong>Phone:</strong> {contact.phone}
        </div>
        <div className="detail-item">
          <strong>Business:</strong> {contact.business}
        </div>
        <div className="detail-item">
          <strong>Address:</strong> {contact.address}
        </div>
        <div className="detail-item">
          <strong>Subject:</strong> {contact.subject}
        </div>
        <div className="detail-item">
          <strong>Message:</strong> {contact.message}
        </div>
        <div className="detail-item">
          <strong>How did you hear about us:</strong> {contact.howDidYouHearAboutUs}
        </div>
        <div className="detail-item">
          <strong>Created At:</strong> {new Date(contact.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
