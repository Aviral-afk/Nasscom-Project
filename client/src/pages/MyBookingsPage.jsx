import { useState, useEffect } from 'react';
import API from '../api/axios';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to fetch your bookings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handlePay = async (id) => {
    setActionId(id);
    setMessage({ type: '', text: '' });
    try {
      await API.put(`/bookings/${id}/pay`);
      setMessage({ type: 'success', text: 'Payment processed successfully!' });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, paid: true } : b))
      );
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Payment failed.'
      });
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setActionId(id);
    setMessage({ type: '', text: '' });
    try {
      await API.put(`/bookings/${id}/cancel`);
      setMessage({ type: 'success', text: 'Booking cancelled successfully.' });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel booking.'
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
      <h2 className="fw-bold mb-3">My Bookings</h2>

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
          <h5>No bookings found</h5>
          <p>Explore our rooms and reserve your stay today.</p>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const isCancelled = b.status === 'cancelled';
                  const isCheckedOut = b.status === 'checked-out';

                  return (
                    <tr key={b._id}>
                      <td className="fw-semibold">
                        {b.room ? `Room ${b.room.roomNumber}` : 'N/A'}
                      </td>
                      <td>{b.room?.category || '-'}</td>
                      <td>{formatDate(b.checkIn)}</td>
                      <td>{formatDate(b.checkOut)}</td>
                      <td className="fw-bold">${b.totalPrice}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(b.status)} text-capitalize`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.paid ? (
                          <span className="badge bg-success">Paid</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Unpaid</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {!b.paid && !isCancelled && (
                            <button
                              className="btn btn-outline-success"
                              disabled={actionId === b._id}
                              onClick={() => handlePay(b._id)}
                            >
                              {actionId === b._id ? 'Processing...' : 'Pay'}
                            </button>
                          )}
                          {!isCancelled && !isCheckedOut && (
                            <button
                              className="btn btn-outline-danger"
                              disabled={actionId === b._id}
                              onClick={() => handleCancel(b._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
