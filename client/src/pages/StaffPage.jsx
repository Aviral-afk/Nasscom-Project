import { useState, useEffect } from 'react';
import API from '../api/axios';

const StaffPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to fetch bookings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleCheckIn = async (id) => {
    setActionId(id);
    setMessage({ type: '', text: '' });
    try {
      await API.put(`/bookings/${id}/checkin`);
      setMessage({ type: 'success', text: 'Guest checked in successfully.' });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'checked-in' } : b))
      );
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Check-in failed.'
      });
    } finally {
      setActionId(null);
    }
  };

  const handleCheckOut = async (id) => {
    setActionId(id);
    setMessage({ type: '', text: '' });
    try {
      await API.put(`/bookings/${id}/checkout`);
      setMessage({ type: 'success', text: 'Guest checked out successfully.' });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'checked-out' } : b))
      );
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Check-out failed.'
      });
    } finally {
      setActionId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary';
      case 'checked-in':
        return 'bg-info text-dark';
      case 'checked-out':
        return 'bg-secondary';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-light text-dark';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-0">Staff Dashboard</h2>
          <p className="text-muted">Manage guest bookings, check-ins, and check-outs</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchAllBookings}>
          Refresh
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 text-center text-muted">
          <h5>No bookings available.</h5>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="fw-semibold">{b.user?.name || 'Unknown'}</div>
                      <small className="text-muted">{b.user?.email || '-'}</small>
                    </td>
                    <td className="fw-semibold">
                      {b.room ? `Room ${b.room.roomNumber}` : 'N/A'}
                    </td>
                    <td>{b.room?.category || '-'}</td>
                    <td>
                      <small>
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </small>
                    </td>
                    <td className="fw-bold">${b.totalPrice}</td>
                    <td>
                      {b.paid ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Unpaid</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(b.status)} text-capitalize`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          disabled={b.status !== 'confirmed' || actionId === b._id}
                          onClick={() => handleCheckIn(b._id)}
                        >
                          Check-In
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          disabled={b.status !== 'checked-in' || actionId === b._id}
                          onClick={() => handleCheckOut(b._id)}
                        >
                          Check-Out
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
