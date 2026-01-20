import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getApplications, 
  getPoliceStations, 
  getCategories,
  updateApplicationStatus,
  updateApplicationFeedback 
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Phone, 
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  FileText,
  Calendar,
  MapPin,
  User as UserIcon,
  Clock,
  Tag
} from 'lucide-react';

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [policeStations, setPoliceStations] = useState([]);
  const [selectedPS, setSelectedPS] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchMetadata();
  }, [statusFilter, selectedPS, selectedCategory, search]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (selectedPS) params.police_station = selectedPS;
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;

      const data = await getApplications(params);
      setApplications(data. results || data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [psData, catData] = await Promise.all([
        getPoliceStations(),
        getCategories()
      ]);
      setPoliceStations(psData);
      setCategories(catData);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleFeedbackUpdate = async (id, feedback) => {
    try {
      await updateApplicationFeedback(id, feedback, '');
      fetchApplications();
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('Failed to update feedback');
    }
  };

  const handleCall = (contact) => {
    window.location.href = `tel:${contact}`;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'PENDING': 'status-pending',
      'HEARD': 'status-heard',
      'REFERRED': 'status-referred',
      'CLOSED': 'status-closed'
    };
    return classes[status] || 'status-pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h2>Open Court Applications</h2>
          <p>Total:  {applications.length} applications</p>
        </div>
        <button onClick={fetchApplications} className="refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, dairy no, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="HEARD">Heard</option>
          <option value="REFERRED">Referred</option>
          <option value="CLOSED">Closed</option>
        </select>

        {user?. role === 'ADMIN' && (
          <select 
            value={selectedPS} 
            onChange={(e) => setSelectedPS(e.target.value)}
            className="filter-select"
          >
            <option value="">All Police Stations</option>
            {policeStations.map((ps, idx) => (
              <option key={idx} value={ps}>{ps}</option>
            ))}
          </select>
        )}

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No Applications Found</h3>
          <p>Try adjusting your filters or upload data from Excel</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              {/* Header */}
              <div className="app-card-header">
                <div>
                  <h3>{app.name}</h3>
                  <p className="dairy-no">
                    <strong>Dairy No:</strong> {app.dairy_no}
                  </p>
                  <p className="sr-no">Sr.  No: {app.sr_no}</p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {/* Body - All Columns */}
              <div className="app-card-body">
                {/* Row 1 */}
                <div className="info-row">
                  <Phone size={16} />
                  <span className="label">Contact:</span>
                  <span className="value">{app.contact || 'N/A'}</span>
                </div>

                {/* Row 2 */}
                <div className="info-row">
                  <MapPin size={16} />
                  <span className="label">Police Station:</span>
                  <span className="value">{app. police_station || 'N/A'}</span>
                </div>

                {/* Row 3 */}
                <div className="info-row">
                  <MapPin size={16} />
                  <span className="label">Division:</span>
                  <span className="value">{app.division || 'N/A'}</span>
                </div>

                {/* Row 4 */}
                <div className="info-row">
                  <Tag size={16} />
                  <span className="label">Category: </span>
                  <span className="value">{app.category || 'N/A'}</span>
                </div>

                {/* Row 5 */}
                <div className="info-row">
                  <UserIcon size={16} />
                  <span className="label">Marked To:</span>
                  <span className="value">{app.marked_to || 'N/A'}</span>
                </div>

                {/* Row 6 */}
                <div className="info-row">
                  <UserIcon size={16} />
                  <span className="label">Marked By:</span>
                  <span className="value">{app.marked_by || 'N/A'}</span>
                </div>

                {/* Row 7 */}
                <div className="info-row">
                  <Calendar size={16} />
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(app.date)}</span>
                </div>

                {/* Row 8 */}
                <div className="info-row">
                  <Clock size={16} />
                  <span className="label">Timeline:</span>
                  <span className="value">{app.timeline || 'N/A'}</span>
                </div>

                {/* Row 9 */}
                <div className="info-row">
                  <Clock size={16} />
                  <span className="label">Days: </span>
                  <span className="value">{app.days !== null ? `${app.days} days` : 'N/A'}</span>
                </div>

                {/* Row 10 */}
                <div className="info-row">
                  <Tag size={16} />
                  <span className="label">Dairy PS:</span>
                  <span className="value">{app. dairy_ps || 'N/A'}</span>
                </div>

                {/* Row 11 - Feedback */}
                <div className="info-row">
                  <span className="label">Feedback:</span>
                  <span className={`feedback-badge feedback-${app.feedback.toLowerCase()}`}>
                    {app.feedback}
                  </span>
                </div>

                {/* Remarks if any */}
                {app.remarks && (
                  <div className="info-row-full">
                    <strong>Remarks:</strong>
                    <p className="remarks-text">{app.remarks}</p>
                  </div>
                )}
              </div>

              {/* Footer - Actions */}
              <div className="app-card-footer">
                {user?.role === 'ADMIN' && (
                  <>
                    <button 
                      onClick={() => handleCall(app.contact)}
                      className="action-btn btn-call"
                      title="Call Applicant"
                    >
                      <Phone size={16} />
                      Call
                    </button>

                    {app.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'HEARD')}
                          className="action-btn btn-success"
                        >
                          Mark Heard
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'REFERRED')}
                          className="action-btn btn-warning"
                        >
                          Refer
                        </button>
                      </>
                    )}

                    {app.feedback === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleFeedbackUpdate(app.id, 'POSITIVE')}
                          className="action-btn btn-positive"
                          title="Positive Feedback"
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <button 
                          onClick={() => handleFeedbackUpdate(app.id, 'NEGATIVE')}
                          className="action-btn btn-negative"
                          title="Negative Feedback"
                        >
                          <ThumbsDown size={16} />
                        </button>
                      </>
                    )}
                  </>
                )}

                {user?.role === 'STAFF' && (
                  <button 
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="action-btn btn-primary"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;