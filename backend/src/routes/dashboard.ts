import { Router, Request, Response } from 'express';
import { Property } from '../models/Property.js';
import { Agent } from '../models/Agent.js';

export const dashboardRoutes = Router();

// GET dashboard statistics
dashboardRoutes.get('/stats', async (req: Request, res: Response) => {
  try {
    const [saleRevenue, rentalRevenue, luxuryCount, publishedCount, agentCount] = await Promise.all([
      Property.aggregate([
        { $match: { category: { $in: ['sale', 'luxury'] } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      Property.aggregate([
        { $match: { category: 'rental' } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      Property.countDocuments({ category: 'luxury' }),
      Property.countDocuments({ status: 'available' }),
      Agent.countDocuments(),
    ]);

    res.json({
      totalRevenue: saleRevenue[0]?.total || 0,
      rentalRevenue: rentalRevenue[0]?.total || 0,
      luxuryInventory: luxuryCount,
      publishedListings: publishedCount,
      activeAgents: agentCount,
      totalProperties: await Property.countDocuments(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET revenue data by period
dashboardRoutes.get('/revenue', async (req: Request, res: Response) => {
  try {
    const { period = 'month' } = req.query;

    // Simplified revenue data - in real app would aggregate from actual transactions
    const data = [
      { month: 'Sep', sales: 4200000, rental: 890000 },
      { month: 'Oct', sales: 5100000, rental: 920000 },
      { month: 'Nov', sales: 3800000, rental: 950000 },
      { month: 'Dec', sales: 6200000, rental: 880000 },
      { month: 'Jan', sales: 7500000, rental: 1020000 },
      { month: 'Feb', sales: 5900000, rental: 1100000 },
    ];

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// GET agent performance data
dashboardRoutes.get('/agent-performance', async (req: Request, res: Response) => {
  try {
    const agents = await Agent.find().sort({ totalRevenue: -1 }).limit(10);

    const performanceData = agents.map((agent) => ({
      name: agent.name,
      deals: agent.salesCount,
      revenue: agent.totalRevenue,
      conversionRate: Math.floor(Math.random() * 40) + 10, // Mock data
    }));

    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

// GET portal statistics
dashboardRoutes.get('/portal-stats', async (req: Request, res: Response) => {
  try {
    // Simplified portal stats - in real app would aggregate from actual portal data
    const data = [
      { name: 'Bayut', listings: 42, leads: 128 },
      { name: 'Property Finder', listings: 38, leads: 95 },
      { name: 'Dubizzle', listings: 29, leads: 67 },
    ];

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portal stats' });
  }
});
