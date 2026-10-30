import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBadgeClass = (role) => {
    if (role === 'admin') return 'bg-danger';
    if (role === 'staff') return 'bg-warning text-dark';
    return 'bg-info text-dark';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/rooms">
          🏨 HotelPro
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/rooms">
                Rooms
              </Link>
            </li>

            {user?.role === 'guest' && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-bookings">
                  My Bookings
                </Link>
              </li>
            )}

            {(user?.role === 'staff' || user?.role === 'admin') && (
              <li className="nav-item">
                <Link className="nav-link" to="/staff">
                  Staff Page
                </Link>
              </li>
            )}

            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin Page
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-light me-3">
                  {user.name}{' '}
                  <span className={`badge ${getBadgeClass(user.role)} ms-1 text-uppercase`}>
                    {user.role}
                  </span>
                </span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
