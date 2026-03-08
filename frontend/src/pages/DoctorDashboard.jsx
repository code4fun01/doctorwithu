import { useState, useEffect } from 'react';
import { appointmentAPI, doctorAPI } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';

export default function DoctorDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFee, setEditFee] = useState(false);
  const [newFee, setNewFee] = useState('');
  const [editSlots, setEditSlots] = useState(false);
  const [days, setDays] = useState([]);
  const [slots, setSlots] = useState('');
  const [error, setError] = useState('');

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    Promise.all([doctorAPI.getMyProfile(), appointmentAPI.getDoctorUpcoming()])
      .then(([p, a]) => {
        setProfile(p.data);
        setAppointments(a.data || []);
        setNewFee(String(p.data?.consultationFee ?? ''));
        setDays(p.data?.availableDays || []);
        setSlots((p.data?.availableSlots || []).join(', '));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (day) => {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const saveFee = () => {
    const num = parseInt(newFee, 10);
    if (isNaN(num) || num < 0) return;
    setError('');
    doctorAPI
      .updateConsultationFee({ consultationFee: num })
      .then((res) => {
        setProfile((p) => (p ? { ...p, consultationFee: num } : null));
        setEditFee(false);
      })
      .catch((err) => setError(err.message));
  };

  const saveAvailability = () => {
    const slotList = slots.split(',').map((s) => s.trim()).filter(Boolean);
    setError('');
    doctorAPI
      .updateAvailability({ availableDays: days, availableSlots: slotList })
      .then((res) => {
        setProfile((p) => (p ? { ...p, availableDays: days, availableSlots: slotList } : null));
        setEditSlots(false);
      })
      .catch((err) => setError(err.message));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage your profile and view upcoming appointments.</p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {profile && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">{profile.name}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Consultation fee (₹):</span>
              {editFee ? (
                <>
                  <input
                    type="number"
                    min="0"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <button onClick={saveFee} className="text-primary-600 font-medium">Save</button>
                  <button onClick={() => setEditFee(false)} className="text-gray-500">Cancel</button>
                </>
              ) : (
                <>
                  <span className="font-medium">{profile.consultationFee}</span>
                  <button onClick={() => setEditFee(true)} className="text-primary-600 text-sm">Edit</button>
                </>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">Availability (days & slots):</span>
                <button onClick={() => setEditSlots(!editSlots)} className="text-primary-600 text-sm">{editSlots ? 'Cancel' : 'Edit'}</button>
              </div>
              {editSlots ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {dayOptions.map((d) => (
                      <label key={d} className="flex items-center gap-1">
                        <input type="checkbox" checked={days.includes(d)} onChange={() => toggleDay(d)} />
                        <span className="text-sm">{d}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={slots}
                    onChange={(e) => setSlots(e.target.value)}
                    placeholder="09:00 AM, 10:00 AM, ..."
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                  <button onClick={saveAvailability} className="bg-primary-600 text-white px-3 py-1 rounded text-sm">Save</button>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  Days: {profile.availableDays?.join(', ') || '—'} · Slots: {profile.availableSlots?.join(', ') || '—'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <h2 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          appointments.map((apt) => <AppointmentCard key={apt._id} appointment={apt} />)
        )}
      </div>
    </div>
  );
}
