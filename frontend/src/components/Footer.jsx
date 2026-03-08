import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">DoctorWithU</h3>
            <p className="text-sm">Book appointments with trusted doctors. Your health, our priority.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition">Home</Link></li>
              <li><Link to="/doctors" className="hover:text-primary-400 transition">Find Doctors</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-primary-400 transition">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>Cardiologist</li>
              <li>Orthopaedic</li>
              <li>ENT</li>
              <li>General Physician</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} DoctorWithU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
