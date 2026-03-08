import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = () => {
    appointmentAPI
      .getMy()
      .then((res) => setAppointments(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchAppointments(), []);

  const handleCancel = (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    appointmentAPI
      .cancel(id)
      .then(() => fetchAppointments())
      .catch((err) => setError(err.message));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
      <p className="text-gray-600 mb-8">View and manage your booked appointments.</p>
      <Link to="/doctors" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 mb-8">
        Book a Doctor
      </Link>
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
        </div>
      )}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet. <Link to="/doctors" className="text-primary-600 hover:underline">Book one</Link>.</p>
          ) : (
            appointments.map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt} onCancel={handleCancel} showCancel />
            ))
          )}
        </div>
      )}
    </div>
  );
}
