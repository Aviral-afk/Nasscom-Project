import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);

  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRooms = async (selectedCat = category) => {
    setLoading(true);
    try {
      const url = selectedCat ? `/rooms?category=${selectedCat}` : '/rooms';
      const res = await API.get(url);
      setRooms(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to load rooms.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [category]);

  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 0;
  };

  const nights = calculateNights();

  const handleBook = async (room) => {
    setMessage({ type: '', text: '' });

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'guest') {
      setMessage({ type: 'warning', text: 'Only guest accounts can create personal bookings.' });
      return;
    }

    if (nights <= 0) {
      setMessage({ type: 'danger', text: 'Check-out date must be after check-in date.' });
      return;
    }

    setBookingLoading(room._id);
    try {
      const res = await API.post('/bookings', {
        room: room._id,
        checkIn,
        checkOut
      });
      setMessage({
        type: 'success',
        text: `Room ${room.roomNumber} successfully booked! Total: $${res.data.totalPrice} for ${nights} night(s).`
      });
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to book room.'
      });
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Available Rooms</h2>
          <p className="text-muted mb-0">Browse and reserve hotel rooms</p>
        </div>

        <div className="btn-group mt-2 mt-sm-0" role="group">
          {['', 'Standard', 'Deluxe', 'Suite'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body">
          <h5 className="card-title mb-3">Select Stay Dates</h5>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold">Check-In Date</label>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                min={todayStr}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold">Check-Out Date</label>
              <input
                type="date"
                className="form-control"
                value={checkOut}
                min={checkIn || todayStr}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2 text-md-center">
              <span className="badge bg-secondary p-2 d-block">
                {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : 'Invalid dates'}
              </span>
            </div>
          </div>
        </div>
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
      ) : (
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0">Room {room.roomNumber}</h5>
                    <span
                      className={`badge ${
                        room.status === 'available' ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <span className="badge bg-light text-dark border align-self-start mb-3">
                    {room.category}
                  </span>

                  <div className="mb-3">
                    <span className="fs-4 fw-bold text-primary">${room.price}</span>
                    <span className="text-muted"> / night</span>
                    {nights > 0 && (
                      <div className="text-muted small mt-1">
                        Total for stay: <strong>${nights * room.price}</strong>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      className="btn btn-primary w-100"
                      disabled={bookingLoading === room._id || nights <= 0}
                      onClick={() => handleBook(room)}
                    >
                      {bookingLoading === room._id
                        ? 'Booking...'
                        : !user
                        ? 'Login to Book'
                        : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rooms.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              No rooms found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
