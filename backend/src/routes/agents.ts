import { Router, Request, Response } from 'express';
import { Agent } from '../models/Agent.js';
import { Property } from '../models/Property.js';

export const agentRoutes = Router();

// GET all agents
agentRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const agents = await Agent.find().sort({ totalRevenue: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// GET single agent by ID
agentRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// GET agent performance metrics
agentRoutes.get('/:id/performance', async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({
      agent,
      totalSales: agent.salesCount,
      totalRevenue: agent.totalRevenue,
      averageRating: agent.rating,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

// GET agent's properties
agentRoutes.get('/:id/properties', async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const properties = await Property.find({ agent: agent.name });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// POST create agent
agentRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const agent = new Agent(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create agent' });
  }
});

// PATCH update agent
agentRoutes.patch('/:id', async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update agent' });
  }
});
