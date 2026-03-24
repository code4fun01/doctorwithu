import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const email = location.state?.email || user?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP({ email, otp });
      if (res.token && res.user) {
        login(res.token, res.user);
      }
      setSuccess('Verified! Redirecting...');
      setTimeout(() => navigate('/dashboard/patient'), 1000);
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError('');
    setResendLoading(true);
    try {
      await authAPI.resendOTP({ email });
      setSuccess('OTP resent. Check your email (or Mailtrap inbox in development).');
    } catch (err) {
      setError(err.message || 'Resend failed.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify your email</h1>
        <p className="text-gray-600 text-center mb-8">We've logged the OTP in the server console (simulated). Enter it below.</p>
        <form onSubmit={handleVerify} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
          <p className="text-sm text-gray-600 mb-4">{email}</p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP (6 digits)</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full mt-3 text-primary-600 font-medium text-sm hover:underline disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
          <p className="text-center text-sm text-gray-600 mt-6">
            <Link to="/" className="text-primary-600 font-medium hover:underline">Back to Home</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
