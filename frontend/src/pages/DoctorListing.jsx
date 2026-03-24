import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';

export default function DoctorListing() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [category, setCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    doctorAPI
      .getCategories()
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
      });
  }, []);

  useEffect(() => {
    setCategory(categoryFromUrl || '');
  }, [categoryFromUrl]);

  // Fetch doctors whenever category or search changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    doctorAPI
      .getAll(category || undefined, searchTerm || undefined)
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
  }, [category, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
      <p className="text-gray-600 mb-8">Search and filter by category to book an appointment.</p>
      
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${!category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-600 py-4">{error}</p>}

      {/* Doctors Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">
              {searchTerm || category ? 'No doctors found matching your criteria.' : 'No doctors available.'}
            </p>
          ) : (
            doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)
          )}
        </div>
      )}
    </div>
  );
}
