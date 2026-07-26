require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');

// Set custom DNS for SRV lookup if needed
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const User = require('./models/User.js');
const Startup = require('./models/Startup.js');
const Investor = require('./models/Investor.js');

const MONGO_URI = process.env.DATABASE_URI || process.env.MONGODB_URI || process.env.CUSTOMCONNSTR_DATABASE_URI;

if (!MONGO_URI) {
  console.error('✖ Database URI not found in .env');
  process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
      authSource: 'admin'
    });

    console.log('✔ Connected to MongoDB for seeding...');

    // Clear existing data option
    if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
      await User.deleteMany();
      await Startup.deleteMany();
      await Investor.deleteMany();
      console.log('🗑 Existing data cleared.');
      if (process.argv[2] === '-d') process.exit(0);
    }

    console.log('🚀 Seeding 10 Startups and 10 Investors...');

    const defaultPassword = 'Password123!';

    // 10 Dummy Startups
    const dummyStartups = [
      {
        userName: 'Amina Bello',
        email: 'startup.payflow@example.com',
        name: 'PayFlow Africa',
        description: 'Next-generation cross-border payment infrastructure for African businesses and freelancers.',
        industry: 'Fintech',
        funding: 'Seed',
        fundingAmount: 250000,
        fundingGoal: 750000,
        founded: '2023',
        location: 'Lagos, Nigeria',
        employees: 14,
        website: 'https://payflow.example.com',
        pitch: 'Solving intra-African trade settlement with 90% lower FX fees and real-time bank transfers.',
        revenueHistory: [
          { date: '2024-01', amount: 15000 },
          { date: '2024-02', amount: 22000 },
          { date: '2024-03', amount: 35000 }
        ]
      },
      {
        userName: 'Kwame Mensah',
        email: 'startup.healthpulse@example.com',
        name: 'HealthPulse',
        description: 'AI-assisted telemedicine and pharmacy fulfillment platform connecting rural clinics to specialist doctors.',
        industry: 'Healthcare',
        funding: 'Pre-seed',
        fundingAmount: 100000,
        fundingGoal: 300000,
        founded: '2024',
        location: 'Accra, Ghana',
        employees: 8,
        website: 'https://healthpulse.example.com',
        pitch: 'Delivering diagnostic tools to 500k underserved patients across West Africa.',
        revenueHistory: [
          { date: '2024-01', amount: 5000 },
          { date: '2024-02', amount: 8000 }
        ]
      },
      {
        userName: 'Wanjiru Kamau',
        email: 'startup.agrigrow@example.com',
        name: 'AgriGrow Solutions',
        description: 'Smart IoT sensors and micro-insurance marketplace for smallholder farmers.',
        industry: 'Agriculture',
        funding: 'Seed',
        fundingAmount: 300000,
        fundingGoal: 600000,
        founded: '2022',
        location: 'Nairobi, Kenya',
        employees: 18,
        website: 'https://agrigrow.example.com',
        pitch: 'Increasing crop yield by 35% through localized climate intelligence.',
        revenueHistory: [
          { date: '2024-01', amount: 12000 },
          { date: '2024-02', amount: 18000 }
        ]
      },
      {
        userName: 'Thabo Mokoena',
        email: 'startup.cleanwatt@example.com',
        name: 'CleanWatt Energy',
        description: 'Pay-as-you-go commercial solar installations for manufacturing SMEs.',
        industry: 'Clean Energy',
        funding: 'Series A',
        fundingAmount: 1200000,
        fundingGoal: 3000000,
        founded: '2021',
        location: 'Cape Town, South Africa',
        employees: 32,
        website: 'https://cleanwatt.example.com',
        pitch: 'Replacing diesel generators with 100% renewable power grids across southern Africa.',
        revenueHistory: [
          { date: '2024-01', amount: 80000 },
          { date: '2024-02', amount: 95000 }
        ]
      },
      {
        userName: 'Jean-Luc Habimana',
        email: 'startup.eduflex@example.com',
        name: 'EduFlex Learning',
        description: 'Gamified digital skills training and tech apprenticeship platform for African youth.',
        industry: 'Education',
        funding: 'Pre-seed',
        fundingAmount: 50000,
        fundingGoal: 200000,
        founded: '2024',
        location: 'Kigali, Rwanda',
        employees: 6,
        website: 'https://eduflex.example.com',
        pitch: 'Trained 10,000 students with an 82% job placement rate in software engineering.',
        revenueHistory: [
          { date: '2024-01', amount: 3000 },
          { date: '2024-02', amount: 6500 }
        ]
      },
      {
        userName: 'Tunde Bakare',
        email: 'startup.logiexpress@example.com',
        name: 'LogiExpress',
        description: 'On-demand last-mile trucking and cold-chain distribution network.',
        industry: 'Logistics',
        funding: 'Seed',
        fundingAmount: 400000,
        fundingGoal: 800000,
        founded: '2023',
        location: 'Lagos, Nigeria',
        employees: 25,
        website: 'https://logiexpress.example.com',
        pitch: 'Cutting perishable food waste in transit by 60% across major commercial corridors.',
        revenueHistory: [
          { date: '2024-01', amount: 45000 },
          { date: '2024-02', amount: 52000 }
        ]
      },
      {
        userName: 'Zainab Ibrahim',
        email: 'startup.shopquick@example.com',
        name: 'ShopQuick',
        description: 'B2B e-commerce platform supplying informal retail kiosks directly from FMCG manufacturers.',
        industry: 'E-commerce',
        funding: 'Seed',
        fundingAmount: 500000,
        fundingGoal: 1000000,
        founded: '2022',
        location: 'Kano, Nigeria',
        employees: 22,
        website: 'https://shopquick.example.com',
        pitch: 'Empowering 12,000 neighborhood shops with inventory credit and guaranteed 24h delivery.',
        revenueHistory: [
          { date: '2024-01', amount: 110000 },
          { date: '2024-02', amount: 135000 }
        ]
      },
      {
        userName: 'Omar El-Sayed',
        email: 'startup.devcloud@example.com',
        name: 'DevCloud Africa',
        description: 'Managed cloud infrastructure and localized developer hosting for African tech teams.',
        industry: 'Software',
        funding: 'Series A',
        fundingAmount: 1500000,
        fundingGoal: 4000000,
        founded: '2021',
        location: 'Cairo, Egypt',
        employees: 40,
        website: 'https://devcloud.example.com',
        pitch: 'Sub-10ms low latency cloud compute tailored to local data sovereignty regulations.',
        revenueHistory: [
          { date: '2024-01', amount: 140000 },
          { date: '2024-02', amount: 165000 }
        ]
      },
      {
        userName: 'Nandi Ndlovu',
        email: 'startup.foodhive@example.com',
        name: 'FoodHive',
        description: 'Dark kitchen network and tech-enabled ghost restaurant operator.',
        industry: 'Food & Beverage',
        funding: 'Pre-seed',
        fundingAmount: 80000,
        fundingGoal: 250000,
        founded: '2023',
        location: 'Johannesburg, South Africa',
        employees: 12,
        website: 'https://foodhive.example.com',
        pitch: 'Operating 8 hyper-efficient cloud kitchens with 3x higher profit margin per sq meter.',
        revenueHistory: [
          { date: '2024-01', amount: 20000 },
          { date: '2024-02', amount: 28000 }
        ]
      },
      {
        userName: 'Fatima Al-Hassan',
        email: 'startup.solargrid@example.com',
        name: 'SolarGrid Tech',
        description: 'Modular microgrid hardware for rural electrification and mini-grids.',
        industry: 'Clean Energy',
        funding: 'Seed',
        fundingAmount: 600000,
        fundingGoal: 1200000,
        founded: '2022',
        location: 'Abuja, Nigeria',
        employees: 19,
        website: 'https://solargrid.example.com',
        pitch: 'Powering 45 remote communities with smart metering and mobile wallet integration.',
        revenueHistory: [
          { date: '2024-01', amount: 30000 },
          { date: '2024-02', amount: 38000 }
        ]
      }
    ];

    // 10 Dummy Investors
    const dummyInvestors = [
      {
        userName: 'Kola Aina',
        email: 'investor.vp@example.com',
        firm: 'Ventures Platform',
        position: 'Founding Partner',
        bio: 'Early-stage VC fund investing in mission-driven founders building market-creating innovations across Africa.',
        location: 'Lagos, Nigeria',
        focus: ['Fintech', 'Software', 'Healthcare'],
        stage: ['Pre-seed', 'Seed'],
        min: 50000,
        max: 500000,
        portfolioSize: 45,
        website: 'https://venturesplatform.example.com'
      },
      {
        userName: 'Iyinoluwa Aboyeji',
        email: 'investor.futureafrica@example.com',
        firm: 'Future Africa Fund',
        position: 'General Partner',
        bio: 'Providing capital, coaching, and community to founders turning Africa’s biggest challenges into business opportunities.',
        location: 'Lagos, Nigeria',
        focus: ['Fintech', 'Agriculture', 'Software'],
        stage: ['Pre-seed', 'Seed', 'Series A'],
        min: 25000,
        max: 250000,
        portfolioSize: 60,
        website: 'https://futureafrica.example.com'
      },
      {
        userName: 'Mbwana Alliy',
        email: 'investor.savannah@example.com',
        firm: 'Savannah Fund',
        position: 'Managing Partner',
        bio: 'Cross-border seed fund specializing in early-stage tech investments in Sub-Saharan Africa.',
        location: 'Nairobi, Kenya',
        focus: ['E-commerce', 'Logistics', 'Fintech'],
        stage: ['Seed', 'Series A'],
        min: 100000,
        max: 1000000,
        portfolioSize: 30,
        website: 'https://savannah.example.com'
      },
      {
        userName: 'Zachariah George',
        email: 'investor.launchafrica@example.com',
        firm: 'Launch Africa Ventures',
        position: 'Managing Partner',
        bio: 'Pan-African B2B early-stage venture capital fund focusing on solving structural market inefficiencies.',
        location: 'Johannesburg, South Africa',
        focus: ['Software', 'Energy', 'Fintech'],
        stage: ['Seed', 'Series A'],
        min: 100000,
        max: 500000,
        portfolioSize: 80,
        website: 'https://launchafrica.example.com'
      },
      {
        userName: 'Yele Bademosi',
        email: 'investor.microtraction@example.com',
        firm: 'Microtraction',
        position: 'General Partner',
        bio: 'Investing in Africa’s most remarkable tech founders at the earliest stage of their development.',
        location: 'Lagos, Nigeria',
        focus: ['Fintech', 'Software', 'AI'],
        stage: ['Pre-seed'],
        min: 25000,
        max: 150000,
        portfolioSize: 38,
        website: 'https://microtraction.example.com'
      },
      {
        userName: 'Tarek Assaad',
        email: 'investor.algebris@example.com',
        firm: 'Algebra Ventures',
        position: 'Senior Partner',
        bio: 'Leading venture capital firm backing high-growth tech startups in North Africa and the Middle East.',
        location: 'Cairo, Egypt',
        focus: ['Fintech', 'E-commerce', 'Software'],
        stage: ['Seed', 'Series A', 'Series B'],
        min: 200000,
        max: 2000000,
        portfolioSize: 25,
        website: 'https://algebra.example.com'
      },
      {
        userName: 'Andrea Bohmert',
        email: 'investor.knife@example.com',
        firm: 'Knife Capital',
        position: 'Partner',
        bio: 'Venture capital fund manager focusing on innovation-driven high-growth African technology businesses.',
        location: 'Cape Town, South Africa',
        focus: ['Software', 'Healthcare', 'Energy'],
        stage: ['Series A', 'Series B', 'Growth'],
        min: 500000,
        max: 5000000,
        portfolioSize: 20,
        website: 'https://knifecap.example.com'
      },
      {
        userName: 'Maya Horgan Famodu',
        email: 'investor.ingress@example.com',
        firm: 'Ingressive Capital',
        position: 'Founder & VC',
        bio: 'Early-stage venture fund backing tech founders in Sub-Saharan Africa pre-Seed to Series A.',
        location: 'Lagos, Nigeria',
        focus: ['Fintech', 'Software', 'Agriculture'],
        stage: ['Pre-seed', 'Seed'],
        min: 50000,
        max: 400000,
        portfolioSize: 35,
        website: 'https://ingressivecapital.example.com'
      },
      {
        userName: 'Wole Regede',
        email: 'investor.afriseed@example.com',
        firm: 'Afriseed Capital',
        position: 'Investment Director',
        bio: 'Bespoke syndicate investing in climate technology, agri-processing, and clean energy startups.',
        location: 'Accra, Ghana',
        focus: ['Agriculture', 'Energy', 'Healthcare'],
        stage: ['Pre-seed', 'Seed'],
        min: 30000,
        max: 300000,
        portfolioSize: 15,
        website: 'https://afriseed.example.com'
      },
      {
        userName: 'Esther Dyson',
        email: 'investor.angelnet@example.com',
        firm: 'Pan-African Angel Network',
        position: 'Lead Angel',
        bio: 'Active angel syndicate backing female founders and high-impact social ventures across Africa.',
        location: 'Nairobi, Kenya',
        focus: ['Education', 'Healthcare', 'Fintech'],
        stage: ['Pre-seed', 'Seed'],
        min: 10000,
        max: 100000,
        portfolioSize: 22,
        website: 'https://paan.example.com'
      }
    ];

    // Seed Startups
    for (const data of dummyStartups) {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({
          name: data.userName,
          email: data.email,
          password: defaultPassword,
          userType: 'startup',
          isVerified: true
        });
      }

      await Startup.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          name: data.name,
          description: data.description,
          industry: data.industry,
          funding: data.funding,
          fundingAmount: data.fundingAmount,
          fundingGoal: data.fundingGoal,
          founded: data.founded,
          location: data.location,
          employees: data.employees,
          website: data.website,
          pitch: data.pitch,
          revenueHistory: data.revenueHistory
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ 10 Startups seeded successfully!');

    // Seed Investors
    for (const data of dummyInvestors) {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({
          name: data.userName,
          email: data.email,
          password: defaultPassword,
          userType: 'investor',
          isVerified: true
        });
      }

      await Investor.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          firm: data.firm,
          position: data.position,
          bio: data.bio,
          location: data.location,
          focus: data.focus,
          stage: data.stage,
          min: data.min,
          max: data.max,
          portfolioSize: data.portfolioSize,
          website: data.website
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ 10 Investors seeded successfully!');

    console.log('\n==========================================');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('Default Password for all accounts:', defaultPassword);
    console.log('Sample Startup Login: startup.payflow@example.com');
    console.log('Sample Investor Login: investor.vp@example.com');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('✖ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
