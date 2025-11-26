import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getWallet,
  addFunds,
  withdrawFunds,
  deductFunds,
} from '../services/walletService';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const wallet = await getWallet(req.user.id);
    res.json(wallet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add-funds', authenticate, async (req, res) => {
  try {
    const { amount, description, referenceId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const transaction = await addFunds(req.user.id, amount, description, referenceId);
    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/withdraw', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const transaction = await withdrawFunds(req.user.id, amount);
    res.json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
