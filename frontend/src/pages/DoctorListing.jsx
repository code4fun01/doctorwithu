import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';

const CATEGORIES = ['Cardiologist', 'Orthopaedic', 'ENT', 'General Physician'];

export default function DoctorListing() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [category, setCategory] = useState(categoryFromUrl);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setCategory(categoryFromUrl || '');
  }, [categoryFromUrl]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    doctorAPI
      .getAll(category || undefined)
      .then((res) => {
        if (!cancelled) setDoctors(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load doctors.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
      <p className="text-gray-600 mb-8">Filter by category and book an appointment.</p>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded-lg font-medium transition ${!category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition ${category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
        </div>
      )}
      {error && <p className="text-red-600 py-4">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length === 0 ? (
            <p className="text-gray-500 col-span-full">No doctors found.</p>
          ) : (
            doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)
          )}
        </div>
      )}
    </div>
  );
}
