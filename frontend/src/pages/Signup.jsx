import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Doctor-specific fields
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [description, setDescription] = useState('');

  const adminName = 'Kartik Jaiswal';
  const predefinedCategories = ['Cardiologist', 'Orthopaedic', 'ENT', 'General Physician'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let finalName = name;
    let doctorInfo = undefined;

    if (role === 'admin') {
      finalName = adminName;
    } else if (role === 'doctor') {
      // Validate doctor fields
      if (!name || !email || !password || !category || !experience || !consultationFee) {
        setError('Please fill all required fields.');
        setLoading(false);
        return;
      }

      const finalCategory = category === 'Other' ? customCategory : category;
      if (!finalCategory) {
        setError('Please specify your specialty.');
        setLoading(false);
        return;
      }

      finalName = name;
      doctorInfo = {
        category: finalCategory,
        experience: parseInt(experience),
        consultationFee: parseInt(consultationFee),
        description: description,
      };
    }

    try {
      await authAPI.signup({ 
        name: finalName, 
        email, 
        password, 
        role, 
        ...(doctorInfo && { doctorInfo })
      });
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setName('');
    setEmail('');
    setPassword('');
    setCategory('');
    setCustomCategory('');
    setExperience('');
    setConsultationFee('');
    setDescription('');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create account</h1>
        <p className="text-gray-600 text-center mb-6">Register to access DoctorWithU</p>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => handleRoleChange('patient')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${role === 'patient' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Patient
          </button>
          <button
            onClick={() => handleRoleChange('doctor')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${role === 'doctor' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Doctor
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${role === 'admin' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-h-[85vh] overflow-y-auto">
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            {role === 'admin' ? (
              <input
                type="text"
                value={adminName}
                readOnly
                className="w-full border border-gray-300 bg-gray-50 text-gray-500 rounded-lg px-3 py-2 cursor-not-allowed"
              />
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={role !== 'admin'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={role === 'doctor' ? 'Dr. Your Name' : 'Your name'}
              />
            )}
          </div>
          
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="you@example.com"
            />
          </div>
          
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Min 6 characters"
            />
          </div>

          {/* Doctor-Specific Fields */}
          {role === 'doctor' && (
            <>
              {/* Category Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty/Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a specialty</option>
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other (Enter Custom)</option>
                </select>
              </div>

              {/* Custom Category Input */}
              {category === 'Other' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Specialty *</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Dermatologist, Neurologist"
                  />
                </div>
              )}

              {/* Experience */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 10"
                />
              </div>

              {/* Consultation Fee */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 500"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Brief Bio/Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell patients about your expertise and experience..."
                  rows={3}
                />
              </div>
            </>
          )}

          {role !== 'doctor' && <div className="mb-6"></div>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
