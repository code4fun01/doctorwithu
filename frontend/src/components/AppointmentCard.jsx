import { format } from '../utils/date';

export default function AppointmentCard({ appointment, onCancel, showCancel = false }) {
  const doctor = appointment.doctorId;
  const patient = appointment.patientId;
  const name = doctor?.name || patient?.name || '—';
  const sub = doctor ? doctor.category : patient?.email;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{sub}</p>
          <p className="text-sm text-gray-500 mt-1">
            {format(appointment.appointmentDate)} · {appointment.appointmentTime}
          </p>
          <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${
            appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {appointment.status}
          </span>
        </div>
        {showCancel && appointment.status === 'scheduled' && (
          <button
            onClick={() => onCancel(appointment._id)}
            className="text-red-600 text-sm font-medium hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
