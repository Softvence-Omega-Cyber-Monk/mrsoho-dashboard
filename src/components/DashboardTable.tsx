import React, { useState, useMemo } from 'react';
import './DashboardTable.css';
import { useGetContactsQuery, useDeleteContactMutation } from '../services/contactApi';
import { useNavigate } from 'react-router-dom';

const DashboardTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10; // No longer a state as setItemsPerPage is not used
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data: apiResponse, error, isLoading, refetch } = useGetContactsQuery({ page: currentPage, limit: itemsPerPage });
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id).unwrap();
      alert('Contact deleted successfully!');
      refetch(); // Refetch contacts after successful deletion
    } catch (err) {
      console.error('Failed to delete contact:', err);
      alert('Failed to delete contact.');
    }
  };

  const contacts = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  const filteredData = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(item => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.business.toLowerCase().includes(search) ||
        item.phone.includes(search);

      return matchesSearch;
    });
  }, [contacts, searchTerm]);

  const totalPages = pagination?.pages || 1;
  const paginatedData = filteredData; // filteredData is already paginated by the API

  const truncate = (text: string, length: number) =>
    text.length > length ? text.substring(0, length) + '...' : text;

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'Advertisement': '#e3f2fd',
      'Friend': '#f3e5f5',
      'Online Search': '#e8f5e9',
      'Social Media': '#fff3e0',
      'Referral': '#fce4ec',
    };
    return colors[source] || '#f5f5f5';
  };

  if (isLoading) {
    return <div className="dashboard-modern">Loading contacts...</div>;
  }

  if (error) {
    console.error("Error details:", error);
    return <div className="dashboard-modern">Error loading contacts: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="dashboard-modern">
      <div className="dashboard-header-modern">
        <div>
          <h1>Contact Submissions</h1>
          <p className="subtitle">Manage and review all incoming contact form submissions</p>
        </div>
      </div>

      <div className="controls-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name, email, business..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>

      <div className="table-container">
        {paginatedData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No submissions found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Business</th>
                <th>Subject</th>
                <th>Source</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row._id} className="table-row" onClick={() => navigate(`/contact/${row._id}`)}>
                  <td className="name-cell">
                    <strong>{row.name}</strong>
                  </td>
                  <td>
                    <a href={`mailto:${row.email}`} className="email-link" onClick={(e) => e.stopPropagation()}>
                      {row.email}
                    </a>
                  </td>
                  <td>{row.phone}</td>
                  <td>{truncate(row.business, 20)}</td>
                  <td className="subject-cell">{truncate(row.subject, 30)}</td>
                  <td>
                    <span
                      className="source-badge"
                      style={{ backgroundColor: getSourceColor(row.howDidYouHearAboutUs) }}
                    >
                      {row.howDidYouHearAboutUs}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(row.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td>
                    <button
                      className="delete-btn-modern"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        if (window.confirm(`Delete submission from ${row.name}?`)) {
                          handleDelete(row._id);
                        }
                      }}
                      disabled={isDeleting} // Disable button while deleting
                      title="Delete submission"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-modern">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage > totalPages - 3) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  className={currentPage === pageNum ? 'active' : ''}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && <span>...</span>}
            {totalPages > 5 && currentPage < totalPages - 3 && (
              <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
            )}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;