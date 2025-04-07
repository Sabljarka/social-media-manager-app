const express = require('express');
const router = express.Router();
const { auth, checkPermission } = require('../middleware/auth');
const SocialAccount = require('../models/SocialAccount');

// Get all social accounts for current user
router.get('/accounts', auth, async (req, res) => {
  try {
    const accounts = await SocialAccount.find({ userId: req.user.id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new social account
router.post('/accounts', auth, async (req, res) => {
  try {
    const { platform, accountId, accountName, accessToken, refreshToken, tokenExpiresAt, permissions } = req.body;

    // Check if account already exists
    const existingAccount = await SocialAccount.findOne({
      userId: req.user.id,
      platform,
      accountId
    });

    if (existingAccount) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    const account = new SocialAccount({
      platform,
      accountId,
      accountName,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      permissions,
      userId: req.user.id
    });

    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update social account
router.put('/accounts/:id', auth, async (req, res) => {
  try {
    const account = await SocialAccount.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    Object.assign(account, req.body);
    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete social account
router.delete('/accounts/:id', auth, async (req, res) => {
  try {
    const account = await SocialAccount.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Platform-specific routes
router.get('/facebook/pages', auth, checkPermission('facebook'), async (req, res) => {
  // Implement Facebook pages fetching
  res.json({ message: 'Facebook pages endpoint' });
});

router.get('/instagram/accounts', auth, checkPermission('instagram'), async (req, res) => {
  // Implement Instagram accounts fetching
  res.json({ message: 'Instagram accounts endpoint' });
});

router.get('/tiktok/accounts', auth, checkPermission('tiktok'), async (req, res) => {
  // Implement TikTok accounts fetching
  res.json({ message: 'TikTok accounts endpoint' });
});

router.get('/youtube/channels', auth, checkPermission('youtube'), async (req, res) => {
  // Implement YouTube channels fetching
  res.json({ message: 'YouTube channels endpoint' });
});

module.exports = router; 