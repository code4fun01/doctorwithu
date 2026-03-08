import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../services/api';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [time, setTime] = useState(searchParams.get('time') || '');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    doctorAPI
      .getById(doctorId)
      .then((res) => setDoctor(res.data))
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const minDate = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) {
      setError('Please select date and time.');
      return;
    }
    setError('');
    setSubmitting(true);
    appointmentAPI
      .book({ doctorId, appointmentDate: date, appointmentTime: time })
      .then(() => navigate('/dashboard/patient'))
      .catch((err) => {
        setError(err.message || 'Booking failed.');
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }
  if (!doctor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Doctor not found.</p>
        <button onClick={() => navigate('/doctors')} className="mt-4 text-primary-600 hover:underline">Back to doctors</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h1>
      <p className="text-primary-600 font-medium mb-6">{doctor.name} · ₹{doctor.consultationFee}</p>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select slot</option>
            {(doctor.availableSlots || []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
