import { Router, Request, Response } from 'express';
import { Property } from '../models/Property.js';

export const propertyRoutes = Router();

// GET all properties with pagination and filtering
propertyRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10, type, city, status } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limit = parseInt(pageSize as string) || 10;
    const skip = (pageNum - 1) * limit;

    // Build filter
    const filter: any = {};
    if (type) filter.category = type;
    if (city) filter.location = new RegExp(city as string, 'i');
    if (status) filter.status = status;

    const properties = await Property.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.json({
      data: properties,
      total,
      page: pageNum,
      pageSize: limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET single property by ID
propertyRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST create new property
propertyRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create property' });
  }
});

// PATCH update property
propertyRoutes.patch('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update property' });
  }
});

// DELETE property
propertyRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// POST save draft changes to property
propertyRoutes.post('/:id/draft-changes', async (req: Request, res: Response) => {
  try {
    const { changes, editedBy } = req.body;
    
    if (!changes || Object.keys(changes).length === 0) {
      return res.status(400).json({ error: 'No changes provided' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        pendingChanges: changes,
        editedBy,
        editedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Draft saved', property });
  } catch (error) {
    res.status(400).json({ error: 'Failed to save draft changes' });
  }
});

// POST submit property for approval
propertyRoutes.post('/:id/submit-approval', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (!property.pendingChanges || Object.keys(property.pendingChanges).length === 0) {
      return res.status(400).json({ error: 'No pending changes to submit' });
    }

    property.approvalStatus = 'pending';
    await property.save();

    res.json({ message: 'Property submitted for approval', property });
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit for approval' });
  }
});

// PATCH approve property edits
propertyRoutes.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.approvalStatus !== 'pending') {
      return res.status(400).json({ error: 'Property is not pending approval' });
    }

    if (!property.pendingChanges) {
      return res.status(400).json({ error: 'No pending changes to approve' });
    }

    // Merge pending changes into property
    const mergedData = {
      ...property.toObject(),
      ...property.pendingChanges,
      approvalStatus: 'approved',
      pendingChanges: null,
      rejectionReason: null,
    };

    delete mergedData._id; // Remove _id from update object
    delete mergedData.createdAt; // Keep original createdAt

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      mergedData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Property approved', property: updatedProperty });
  } catch (error) {
    res.status(400).json({ error: 'Failed to approve property' });
  }
});

// PATCH reject property edits
propertyRoutes.patch('/:id/reject', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason required' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'rejected',
        rejectionReason: reason,
        pendingChanges: null,
      },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property rejected', property });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reject property' });
  }
});

// GET pending property approvals
propertyRoutes.get('/approvals/pending', async (req: Request, res: Response) => {
  try {
    const pendingProperties = await Property.find({ approvalStatus: 'pending' })
      .sort({ editedAt: -1 });

    res.json({
      data: pendingProperties,
      total: pendingProperties.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// GET search properties
propertyRoutes.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const properties = await Property.find({
      $or: [
        { title: new RegExp(q as string, 'i') },
        { location: new RegExp(q as string, 'i') },
      ],
    }).limit(20);

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});
