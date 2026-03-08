import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';
import BookingModal from '../components/BookingModal';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    doctorAPI
      .getById(id)
      .then((res) => setDoctor(res.data))
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      setShowBooking(false);
      return;
    }
    setShowBooking(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }
  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Doctor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-primary-600 font-medium mt-1">{doctor.category}</p>
              <p className="text-gray-500 text-sm mt-2">{doctor.experience} years of experience</p>
              {doctor.description && (
                <p className="text-gray-600 mt-4">{doctor.description}</p>
              )}
            </div>
            <div className="shrink-0">
              <p className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</p>
              <p className="text-sm text-gray-500">Consultation fee</p>
              {user?.role === 'patient' && (
                <button
                  onClick={handleBook}
                  className="mt-4 w-full md:w-auto bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition"
                >
                  Book Appointment
                </button>
              )}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Available days</h3>
            <p className="text-gray-600">{doctor.availableDays?.length ? doctor.availableDays.join(', ') : '—'}</p>
            <h3 className="font-semibold text-gray-900 mt-4 mb-2">Available time slots</h3>
            <div className="flex flex-wrap gap-2">
              {(doctor.availableSlots || []).map((s) => (
                <span key={s} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm">{s}</span>
              ))}
              {(!doctor.availableSlots || doctor.availableSlots.length === 0) && <span className="text-gray-500">—</span>}
            </div>
          </div>
        </div>
      </div>
      {showBooking && <BookingModal doctor={doctor} onClose={() => setShowBooking(false)} />}
    </div>
  );
}
