import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    roomNumber: '',
    category: 'Standard',
    price: '',
    status: 'available'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to fetch rooms.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const res = await API.post('/rooms', {
        ...formData,
        price: Number(formData.price)
      });
      setMessage({ type: 'success', text: `Room ${res.data.roomNumber} created successfully!` });
      setFormData({
        roomNumber: '',
        category: 'Standard',
        price: '',
        status: 'available'
      });
      fetchRooms();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to add room.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Admin Panel</h2>
      <p className="text-muted mb-4">Manage hotel inventory and create new rooms</p>

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

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Add New Room</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddRoom}>
                <div className="mb-3">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    className="form-control"
                    placeholder="e.g. 401"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Price per Night ($)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="150"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Room'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Room Inventory ({rooms.length})</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={fetchRooms}>
                Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Room Number</th>
                        <th>Category</th>
                        <th>Price / Night</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => (
                        <tr key={room._id}>
                          <td className="fw-semibold">Room {room.roomNumber}</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {room.category}
                            </span>
                          </td>
                          <td className="fw-bold">${room.price}</td>
                          <td>
                            <span
                              className={`badge ${
                                room.status === 'available' ? 'bg-success' : 'bg-secondary'
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {rooms.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">
                            No rooms found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
