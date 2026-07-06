require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('./models/Faq');

const sampleFaqs = [
  {
    keywords: ['leave', 'vacation', 'holiday', 'paid leave'],
    answer:
      'Employees ko saal mein 18 paid leaves milti hain. Leave apply karne ke liye HRMS portal use karein, manager approval ke baad leave confirm hoti hai.',
    category: 'HR',
  },
  {
    keywords: ['working hours', 'office time', 'shift timing'],
    answer:
      'Office hours subah 9:30 AM se shaam 6:30 PM tak hain, Monday se Friday. 1 hour lunch break included hai.',
    category: 'HR',
  },
  {
    keywords: ['salary', 'payroll', 'payslip', 'salary date'],
    answer:
      'Salary har mahine ki 1st tareek ko credit hoti hai. Payslip HRMS portal se download kar sakte hain.',
    category: 'HR',
  },
  {
    keywords: ['laptop', 'it setup', 'email id', 'system access'],
    answer:
      'Joining ke pehle din IT team aapko laptop aur company email ID provide karegi. Koi issue ho to IT helpdesk (it-support@synergylabs.com) contact karein.',
    category: 'IT',
  },
  {
    keywords: ['dress code', 'attire', 'what to wear'],
    answer:
      'Office mein smart-casual dress code follow kiya jata hai. Client meetings ke din formal attire recommended hai.',
    category: 'General',
  },
  {
    keywords: ['id card', 'access card', 'badge'],
    answer:
      'Aapka ID card joining ke pehle din Admin team se mil jayega. Ye office entry ke liye mandatory hai.',
    category: 'General',
  },
  {
    keywords: ['probation', 'confirmation period'],
    answer:
      'Probation period 3 months ka hota hai, jiske baad performance review hokar confirmation diya jata hai.',
    category: 'HR',
  },
  {
    keywords: ['hr contact', 'hr email', 'hr number'],
    answer:
      'HR team se contact karne ke liye hr@synergylabs.com par email karein ya extension 101 par call karein.',
    category: 'HR',
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Purana data clear karo, fresh seed daalo
    await Faq.deleteMany({});
    await Faq.insertMany(sampleFaqs);

    console.log(`✅ ${sampleFaqs.length} FAQs seeded successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedDB();