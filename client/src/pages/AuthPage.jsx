import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.role);
      }
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-center mb-4">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`btn ${!isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>

              <h4 className="card-title text-center mb-3">
                {isLogin ? 'Sign In to HotelPro' : 'Create an Account'}
              </h4>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="guest">Guest</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
