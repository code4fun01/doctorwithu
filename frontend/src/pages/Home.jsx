import { Link } from 'react-router-dom';

const categories = [
  { name: 'Cardiologist', desc: 'Heart and cardiovascular care' },
  { name: 'Orthopaedic', desc: 'Bones, joints and muscles' },
  { name: 'ENT', desc: 'Ear, nose and throat' },
  { name: 'General Physician', desc: 'General health and wellness' },
];

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Health, <span className="text-primary-600">Our Priority</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Book appointments with trusted doctors. Simple, fast, and secure.
          </p>
          <Link
            to="/doctors"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-md"
          >
            Find a Doctor
          </Link>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/doctors?category=${encodeURIComponent(cat.name)}`}
                className="block p-6 rounded-xl border border-gray-200 bg-white hover:border-primary-300 hover:shadow-md transition text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold mb-3">
                  {cat.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <span className="text-3xl font-bold text-primary-600">1</span>
              <h3 className="font-semibold text-gray-900 mt-2">Find a doctor</h3>
              <p className="text-gray-600 text-sm mt-1">Browse by category and choose your doctor.</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-primary-600">2</span>
              <h3 className="font-semibold text-gray-900 mt-2">Book a slot</h3>
              <p className="text-gray-600 text-sm mt-1">Pick a convenient date and time.</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-primary-600">3</span>
              <h3 className="font-semibold text-gray-900 mt-2">Visit or consult</h3>
              <p className="text-gray-600 text-sm mt-1">Show up for your appointment.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
