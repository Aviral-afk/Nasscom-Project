import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import RoomsPage from './pages/RoomsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import StaffPage from './pages/StaffPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/rooms" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/rooms" element={<RoomsPage />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>
      </main>
      <footer className="bg-white py-3 border-top text-center text-muted small">
        &copy; {new Date().getFullYear()} HotelPro Management System. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
