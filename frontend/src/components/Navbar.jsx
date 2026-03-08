import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const dashLink = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">DoctorWithU</span>
            </Link>
            <div className="hidden md:flex ml-10 gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition">Home</Link>
              <Link to="/doctors" className="text-gray-600 hover:text-primary-600 transition">Find Doctors</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to={dashLink} className="text-gray-600 hover:text-primary-600 hidden sm:inline">Dashboard</Link>
                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium"
                  >
                    {user.name}
                    <span className="text-xs bg-primary-200 px-2 py-0.5 rounded">{user.role}</span>
                  </button>
                  {open && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                      <div className="absolute right-0 mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border z-20">
                        <Link to={dashLink} className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setOpen(false)}>Dashboard</Link>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
