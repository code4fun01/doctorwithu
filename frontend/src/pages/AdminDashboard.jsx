import { useState, useEffect } from 'react';
import { adminAPI, doctorAPI } from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', category: '', experience: '', consultationFee: '', description: '' });

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([adminAPI.getUsers(), adminAPI.getAppointments(), doctorAPI.getAll()])
      .then(([u, a, d]) => {
        setUsers(u.data || []);
        setAppointments(a.data || []);
        setDoctors(d.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const { name, email, password, category, experience, consultationFee, description } = addForm;
    if (!name || !email || !password || !category) {
      setError('Name, email, password and category required.');
      return;
    }
    setError('');
    adminAPI
      .addDoctor({
        name,
        email,
        password,
        category,
        experience: parseInt(experience, 10) || 0,
        consultationFee: parseInt(consultationFee, 10) || 0,
        description: description || '',
      })
      .then(() => {
        setAddForm({ name: '', email: '', password: '', category: '', experience: '', consultationFee: '', description: '' });
        load();
      })
      .catch((err) => setError(err.message));
  };

  const handleDeleteDoctor = (id) => {
    if (!window.confirm('Delete this doctor? This will remove their user and appointments.')) return;
    adminAPI
      .deleteDoctor(id)
      .then(() => load())
      .catch((err) => setError(err.message));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage users, appointments and doctors.</p>
      <div className="flex gap-2 mb-6">
        {['users', 'appointments', 'doctors', 'addDoctor'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {t === 'addDoctor' ? 'Add Doctor' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
        </div>
      )}
      {!loading && tab === 'users' && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 font-medium text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && tab === 'appointments' && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments.</p>
          ) : (
            appointments.map((a) => (
              <div key={a._id} className="bg-white border rounded-lg p-4 flex flex-wrap justify-between gap-2">
                <span>{a.patientId?.name} → {a.doctorId?.name}</span>
                <span className="text-gray-500">{new Date(a.appointmentDate).toLocaleDateString()} {a.appointmentTime} · {a.status}</span>
              </div>
            ))
          )}
        </div>
      )}
      {!loading && tab === 'doctors' && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 font-medium text-gray-700">Fee</th>
                <th className="px-4 py-3 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="px-4 py-3">{d.name}</td>
                  <td className="px-4 py-3">{d.category}</td>
                  <td className="px-4 py-3">₹{d.consultationFee}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteDoctor(d._id)} className="text-red-600 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && tab === 'addDoctor' && (
        <form onSubmit={handleAddDoctor} className="bg-white border rounded-xl p-6 max-w-lg space-y-4">
          <input
            placeholder="Name"
            value={addForm.name}
            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={addForm.email}
            onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={addForm.password}
            onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <select
            value={addForm.category}
            onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Category</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Orthopaedic">Orthopaedic</option>
            <option value="ENT">ENT</option>
            <option value="General Physician">General Physician</option>
          </select>
          <input
            type="number"
            placeholder="Experience (years)"
            value={addForm.experience}
            onChange={(e) => setAddForm((f) => ({ ...f, experience: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Consultation fee (₹)"
            value={addForm.consultationFee}
            onChange={(e) => setAddForm((f) => ({ ...f, consultationFee: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Description"
            value={addForm.description}
            onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
          />
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium">Add Doctor</button>
        </form>
      )}
    </div>
  );
}
