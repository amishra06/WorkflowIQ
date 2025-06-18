import { Router } from 'express';
import { apiService } from './index';
import { workflowEngine } from '../workflowEngine';
import { integrationService } from '../integrations';

const router = Router();

// Middleware to validate API requests
const validateAPIRequest = async (req, res, next) => {
  const isValid = await apiService.validateRequest(req);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid API request' });
  }
  next();
};

// Apply validation middleware to all routes
router.use(validateAPIRequest);

// Workflow routes
router.get('/workflows', async (req, res) => {
  try {
    const { status } = req.query;
    const workflows = await workflowEngine.getWorkflows(status);
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/workflows', async (req, res) => {
  try {
    const workflow = await workflowEngine.createWorkflow(req.body);
    res.status(201).json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/workflows/:id', async (req, res) => {
  try {
    const workflow = await workflowEngine.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Integration routes
router.get('/integrations', async (req, res) => {
  try {
    const integrations = await integrationService.getAvailableIntegrations();
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;