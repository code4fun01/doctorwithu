require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const defaultDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const doctorsData = [
  // Cardiologist (10+)
  { name: 'Dr. Arjun Mehta', category: 'Cardiologist', experience: 15, fee: 800, desc: 'Expert in interventional cardiology and heart failure management.' },
  { name: 'Dr. Priya Sharma', category: 'Cardiologist', experience: 12, fee: 750, desc: 'Specialist in preventive cardiology and cardiac rehabilitation.' },
  { name: 'Dr. Rohit Verma', category: 'Cardiologist', experience: 18, fee: 900, desc: 'Senior consultant for complex cardiac procedures.' },
  { name: 'Dr. Neha Kapoor', category: 'Cardiologist', experience: 10, fee: 700, desc: 'Focus on arrhythmia and electrophysiology.' },
  { name: 'Dr. Rajiv Malhotra', category: 'Cardiologist', experience: 22, fee: 1000, desc: 'Pioneer in non-invasive cardiac imaging.' },
  { name: 'Dr. Anjali Desai', category: 'Cardiologist', experience: 14, fee: 800, desc: 'Pediatric and adult congenital heart disease.' },
  { name: 'Dr. Vikram Singh', category: 'Cardiologist', experience: 16, fee: 850, desc: 'Interventional cardiology and coronary care.' },
  { name: 'Dr. Kavita Reddy', category: 'Cardiologist', experience: 11, fee: 720, desc: 'Hypertension and lifestyle-related heart care.' },
  { name: 'Dr. Sanjay Nair', category: 'Cardiologist', experience: 20, fee: 950, desc: 'Cardiac surgery and critical care.' },
  { name: 'Dr. Meera Iyer', category: 'Cardiologist', experience: 13, fee: 780, desc: 'Heart failure and transplant evaluation.' },
  // Orthopaedic (10+)
  { name: 'Dr. Karthik Pillai', category: 'Orthopaedic', experience: 17, fee: 750, desc: 'Joint replacement and arthroscopy specialist.' },
  { name: 'Dr. Divya Menon', category: 'Orthopaedic', experience: 9, fee: 650, desc: 'Sports medicine and rehabilitation.' },
  { name: 'Dr. Amit Patel', category: 'Orthopaedic', experience: 19, fee: 850, desc: 'Spine surgery and spinal disorders.' },
  { name: 'Dr. Shalini Gupta', category: 'Orthopaedic', experience: 12, fee: 700, desc: 'Pediatric orthopaedics and fractures.' },
  { name: 'Dr. Rakesh Joshi', category: 'Orthopaedic', experience: 21, fee: 900, desc: 'Hip and knee replacement surgery.' },
  { name: 'Dr. Pooja Krishnan', category: 'Orthopaedic', experience: 10, fee: 680, desc: 'Hand and wrist surgery.' },
  { name: 'Dr. Manish Agarwal', category: 'Orthopaedic', experience: 15, fee: 780, desc: 'Trauma and fracture care.' },
  { name: 'Dr. Sneha Rao', category: 'Orthopaedic', experience: 8, fee: 620, desc: 'Shoulder and elbow surgery.' },
  { name: 'Dr. Suresh Babu', category: 'Orthopaedic', experience: 24, fee: 950, desc: 'Complex joint revision surgery.' },
  { name: 'Dr. Nidhi Chopra', category: 'Orthopaedic', experience: 11, fee: 690, desc: 'Foot and ankle surgery.' },
  // ENT (10+)
  { name: 'Dr. Aditya Bhat', category: 'ENT', experience: 14, fee: 600, desc: 'Ear, nose and throat disorders and surgeries.' },
  { name: 'Dr. Ritu Saxena', category: 'ENT', experience: 11, fee: 580, desc: 'Hearing loss and cochlear implants.' },
  { name: 'Dr. Varun Khanna', category: 'ENT', experience: 16, fee: 650, desc: 'Sinus and allergy treatment.' },
  { name: 'Dr. Preeti Nanda', category: 'ENT', experience: 9, fee: 550, desc: 'Pediatric ENT and adenoid issues.' },
  { name: 'Dr. Rahul Oberoi', category: 'ENT', experience: 18, fee: 700, desc: 'Head and neck oncology.' },
  { name: 'Dr. Swati Mishra', category: 'ENT', experience: 12, fee: 590, desc: 'Vertigo and balance disorders.' },
  { name: 'Dr. Nikhil Dutta', category: 'ENT', experience: 13, fee: 610, desc: 'Sleep apnea and snoring surgery.' },
  { name: 'Dr. Anjana Venkatesh', category: 'ENT', experience: 10, fee: 560, desc: 'Voice and swallowing disorders.' },
  { name: 'Dr. Karan Sethi', category: 'ENT', experience: 15, fee: 640, desc: 'Rhinoplasty and facial plastic surgery.' },
  { name: 'Dr. Tanvi Arora', category: 'ENT', experience: 8, fee: 540, desc: 'General ENT and ear care.' },
  // General Physician (10+)
  { name: 'Dr. Sonali Banerjee', category: 'General Physician', experience: 14, fee: 500, desc: 'General health check-ups and chronic disease management.' },
  { name: 'Dr. Mohit Chawla', category: 'General Physician', experience: 11, fee: 480, desc: 'Diabetes, thyroid and metabolic disorders.' },
  { name: 'Dr. Aarti Sinha', category: 'General Physician', experience: 16, fee: 550, desc: 'Infectious diseases and travel medicine.' },
  { name: 'Dr. Deepak Kumar', category: 'General Physician', experience: 20, fee: 600, desc: 'Internal medicine and geriatric care.' },
  { name: 'Dr. Rashmi Tiwari', category: 'General Physician', experience: 9, fee: 450, desc: 'Preventive care and wellness.' },
  { name: 'Dr. Gaurav Saxena', category: 'General Physician', experience: 12, fee: 490, desc: 'Hypertension and cardiovascular prevention.' },
  { name: 'Dr. Lakshmi Venkat', category: 'General Physician', experience: 18, fee: 580, desc: 'Rheumatology and autoimmune conditions.' },
  { name: 'Dr. Abhishek Roy', category: 'General Physician', experience: 10, fee: 470, desc: 'Respiratory and allergy management.' },
  { name: 'Dr. Pallavi Deshmukh', category: 'General Physician', experience: 13, fee: 510, desc: 'Gastrointestinal and liver care.' },
  { name: 'Dr. Rohan Bhatia', category: 'General Physician', experience: 7, fee: 430, desc: 'Family medicine and acute care.' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const existingDoctors = await Doctor.countDocuments();
    if (existingDoctors > 0) {
      console.log('Doctors already exist. Skipping seed. Delete doctors and users if you want to re-seed.');
      process.exit(0);
      return;
    }

    for (const d of doctorsData) {
      const email = d.name.replace(/\s+/g, '').replace('Dr.', '').toLowerCase() + '@doctorwithu.com';
      const existingUser = await User.findOne({ email });
      if (existingUser) continue;

      const user = await User.create({
        name: d.name,
        email,
        password: 'Doctor@123',
        role: 'doctor',
        isVerified: true,
      });
      await Doctor.create({
        userId: user._id,
        name: d.name,
        category: d.category,
        experience: d.experience,
        consultationFee: d.fee,
        description: d.desc,
        availableDays: defaultDays,
        availableSlots: defaultSlots,
      });
      console.log('Created:', d.name, d.category);
    }

    console.log('Seed completed. Total doctors:', await Doctor.countDocuments());
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
