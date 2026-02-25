import { Property } from '../models/Property.js';
import { Agent } from '../models/Agent.js';
import { connectDB, disconnectDB } from '../config/database.js';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Property.deleteMany({});
    await Agent.deleteMany({});

    // Create agents
    const agents = await Agent.insertMany([
      {
        name: 'Sarah Al-Farsi',
        email: 'sarah@estateflow.com',
        phone: '+971501234567',
        salesCount: 12,
        totalRevenue: 18500000,
        rating: 4.8,
      },
      {
        name: 'James Mitchell',
        email: 'james@estateflow.com',
        phone: '+971501234568',
        salesCount: 8,
        totalRevenue: 9200000,
        rating: 4.6,
      },
      {
        name: 'Omar Hassan',
        email: 'omar@estateflow.com',
        phone: '+971501234569',
        salesCount: 6,
        totalRevenue: 5800000,
        rating: 4.4,
      },
      {
        name: 'Layla Khan',
        email: 'layla@estateflow.com',
        phone: '+971501234570',
        salesCount: 9,
        totalRevenue: 12100000,
        rating: 4.7,
      },
    ]);

    console.log(`Created ${agents.length} agents`);

    // Create properties
    const properties = await Property.insertMany([
      {
        title: 'Marina Heights Penthouse',
        category: 'luxury',
        status: 'available',
        price: 12500000,
        location: 'Dubai Marina',
        bedrooms: 5,
        bathrooms: 6,
        area: 8500,
        agent: 'Sarah Al-Farsi',
        publishedPortals: ['bayut', 'property_finder'],
      },
      {
        title: 'Downtown Studio Apartment',
        category: 'rental',
        status: 'rented',
        price: 85000,
        location: 'Downtown Dubai',
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        agent: 'James Mitchell',
        publishedPortals: ['dubizzle'],
      },
      {
        title: 'Palm Villa with Private Beach',
        category: 'luxury',
        status: 'reserved',
        price: 28000000,
        location: 'Palm Jumeirah',
        bedrooms: 7,
        bathrooms: 8,
        area: 15000,
        agent: 'Sarah Al-Farsi',
        publishedPortals: ['bayut', 'property_finder', 'dubizzle'],
      },
      {
        title: 'JBR 2-Bed Sea View',
        category: 'sale',
        status: 'available',
        price: 2800000,
        location: 'JBR',
        bedrooms: 2,
        bathrooms: 2,
        area: 1400,
        agent: 'Omar Hassan',
        publishedPortals: ['bayut'],
      },
      {
        title: 'Business Bay Office Space',
        category: 'rental',
        status: 'available',
        price: 120000,
        location: 'Business Bay',
        bedrooms: 0,
        bathrooms: 2,
        area: 2200,
        agent: 'James Mitchell',
        publishedPortals: ['property_finder'],
      },
      {
        title: 'Creek Harbour 3-Bed',
        category: 'sale',
        status: 'sold',
        price: 3500000,
        location: 'Dubai Creek Harbour',
        bedrooms: 3,
        bathrooms: 3,
        area: 2100,
        agent: 'Layla Khan',
        publishedPortals: ['bayut', 'dubizzle'],
      },
      {
        title: 'Emirates Hills Mansion',
        category: 'luxury',
        status: 'available',
        price: 45000000,
        location: 'Emirates Hills',
        bedrooms: 9,
        bathrooms: 12,
        area: 25000,
        agent: 'Sarah Al-Farsi',
        publishedPortals: ['bayut', 'property_finder'],
      },
      {
        title: 'Silicon Oasis 1-Bed',
        category: 'rental',
        status: 'available',
        price: 45000,
        location: 'Dubai Silicon Oasis',
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        agent: 'Omar Hassan',
        publishedPortals: ['dubizzle'],
      },
      {
        title: 'Jumeirah Golf Estates Villa',
        category: 'sale',
        status: 'available',
        price: 7200000,
        location: 'Jumeirah Golf Estates',
        bedrooms: 4,
        bathrooms: 5,
        area: 5500,
        agent: 'Layla Khan',
        publishedPortals: ['bayut', 'property_finder'],
      },
      {
        title: 'DIFC Luxury Loft',
        category: 'luxury',
        status: 'reserved',
        price: 8900000,
        location: 'DIFC',
        bedrooms: 3,
        bathrooms: 3,
        area: 3200,
        agent: 'James Mitchell',
        publishedPortals: ['property_finder', 'dubizzle'],
      },
    ]);

    console.log(`Created ${properties.length} properties`);
    console.log('Database seeded successfully!');
    await disconnectDB();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
