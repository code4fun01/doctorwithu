import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-primary-600 font-medium text-sm mt-1">{doctor.category}</p>
          </div>
          <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded">{doctor.experience} yrs exp</span>
        </div>
        {doctor.description && (
          <p className="text-gray-600 text-sm mt-3 line-clamp-2">{doctor.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-gray-900 font-semibold">₹{doctor.consultationFee}</span>
          <Link
            to={`/doctors/${doctor._id}`}
            className="text-primary-600 font-medium text-sm hover:underline"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
