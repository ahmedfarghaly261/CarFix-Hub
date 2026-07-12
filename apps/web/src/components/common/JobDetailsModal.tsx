import React, { useState } from "react";
import "./JobDetailsModal.css";
import {
  AlertTriangle,
  Calendar,
  Car,
  Cog,
  FileText,
  Phone,
  Send,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const JobDetailsModal = ({ isOpen, onClose, job, onStartWork, onSendUpdate }) => {
  const [updateMessage, setUpdateMessage] = useState("");

  if (!isOpen || !job) return null;

  const handleSendUpdate = () => {
    if (updateMessage.trim()) {
      onSendUpdate?.(job.id, updateMessage);
      setUpdateMessage("");
    }
  };

  return (
    <div className="job-modal-overlay">
      <div className="job-modal">
        <div className="job-modal-header">
          <div className="job-modal-title-section">
            <h2 className="job-modal-title">{job.title}</h2>
            <div className="job-modal-badges">
              <span className={`job-badge priority priority-${job.priority}`}>{job.priority} priority</span>
              <span className={`job-badge status status-${job.status}`}>{job.status?.replace("-", " ")}</span>
            </div>
            <p className="job-modal-request-id">Request #{job.id}</p>
          </div>
          <button className="job-modal-close" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="job-modal-body">
          <div className="job-modal-section">
            <h3 className="job-modal-section-title">
              <UserRound size={18} className="section-icon" /> Customer
            </h3>
            <div className="job-modal-customer">
              <div>
                <p className="job-modal-label">Name</p>
                <p className="job-modal-value">{job.customer}</p>
              </div>
              <div>
                <p className="job-modal-label">
                  <Phone size={16} /> Contact
                </p>
                <p className="job-modal-value">{job.phone || "+1 (555) 123-4567"}</p>
              </div>
            </div>
          </div>

          <div className="job-modal-section">
            <h3 className="job-modal-section-title">
              <Car size={18} className="section-icon" /> Vehicle
            </h3>
            <div className="job-modal-grid">
              <div>
                <p className="job-modal-label">Vehicle</p>
                <p className="job-modal-value">{job.car}</p>
              </div>
              <div>
                <p className="job-modal-label">License Plate</p>
                <p className="job-modal-value accent">{job.plate}</p>
              </div>
              <div>
                <p className="job-modal-label">Mileage</p>
                <p className="job-modal-value">{job.mileage || "45,230 miles"}</p>
              </div>
            </div>
          </div>

          <div className="job-modal-section">
            <h3 className="job-modal-section-title">
              <Wrench size={18} className="section-icon" /> Service Description
            </h3>
            <p className="job-modal-description">
              {job.description ||
                "Regular maintenance - oil change with synthetic 5W-30 and new filter. Customer also mentioned a slight engine noise."}
            </p>
          </div>

          <div className="job-modal-section">
            <h3 className="job-modal-section-title">
              <Calendar size={18} className="section-icon" /> Timeline
            </h3>
            <div className="job-modal-grid">
              <div>
                <p className="job-modal-label">Assigned Date</p>
                <p className="job-modal-value">{job.date || "Nov 25, 2025"}</p>
              </div>
              <div>
                <p className="job-modal-label">Time</p>
                <p className="job-modal-value">{job.time || "9:00 AM"}</p>
              </div>
              <div>
                <p className="job-modal-label">Estimated Duration</p>
                <p className="job-modal-value">{job.duration || "1 hour"}</p>
              </div>
            </div>
          </div>

          <div className="job-modal-section">
            <h3 className="job-modal-section-title">
              <Cog size={18} className="section-icon" /> Parts Required
            </h3>
            <ul className="job-modal-parts-list">
              {(job.parts || ["Oil Filter", "Synthetic Oil 5W-30 (5 quarts)"]).map((part, idx) => (
                <li key={idx} className="job-modal-part-item">
                  <input type="checkbox" />
                  <span>{part}</span>
                </li>
              ))}
            </ul>
          </div>

          {job.notes && (
            <div className="job-modal-section notes-section">
              <h3 className="job-modal-section-title">
                <AlertTriangle size={18} className="section-icon" /> Important Notes
              </h3>
              <div className="job-modal-notes">{job.notes}</div>
            </div>
          )}

          <div className="job-modal-section">
            <h3 className="job-modal-section-title">
              <FileText size={18} className="section-icon" /> Work Updates
            </h3>
            <p className="job-modal-update-info">Updates are sent to admin and customer</p>
            <div className="job-modal-update-input">
              <textarea
                placeholder="Add progress update (e.g., 'Replaced oil filter, checking for leaks...')"
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
              />
              <button className="job-modal-send-btn" onClick={handleSendUpdate} disabled={!updateMessage.trim()} type="button">
                <Send size={18} />
                Send Update
              </button>
            </div>
          </div>
        </div>

        <div className="job-modal-footer">
          <button className="job-modal-btn secondary" onClick={onClose} type="button">
            Close
          </button>
          <button className="job-modal-btn primary" onClick={() => onStartWork?.(job.id)} type="button">
            Start Work
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
