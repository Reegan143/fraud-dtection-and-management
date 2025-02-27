import React from 'react';

function DisputeHeader({ count, isPolling }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>
        Associated Disputes ({count})
        {isPolling && (
          <small className="ms-2 text-muted">
            <i className="fas fa-sync fa-spin"></i>
          </small>
        )}
      </h2>
    </div>
  );
}

export default DisputeHeader;