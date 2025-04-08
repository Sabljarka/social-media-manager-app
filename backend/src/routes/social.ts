import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Dodavanje novog socijalnog naloga
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { platform, accountId, accountName, accessToken, permissions } = req.body;
    const userId = req.user?.id;

    const socialAccount = await prisma.socialAccount.create({
      data: {
        platform,
        accountId,
        accountName,
        accessToken,
        permissions,
        userId
      }
    });

    res.status(201).json(socialAccount);
  } catch (error) {
    console.error('Error adding social account:', error);
    res.status(500).json({ message: 'Greška pri dodavanju socijalnog naloga' });
  }
});

// Preuzimanje svih socijalnih naloga korisnika
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const socialAccounts = await prisma.socialAccount.findMany({
      where: {
        userId
      }
    });

    res.json(socialAccounts);
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    res.status(500).json({ message: 'Greška pri preuzimanju socijalnih naloga' });
  }
});

// Brisanje socijalnog naloga
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!socialAccount) {
      return res.status(404).json({ message: 'Socijalni nalog nije pronađen' });
    }

    await prisma.socialAccount.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({ message: 'Socijalni nalog je uspešno obrisan' });
  } catch (error) {
    console.error('Error deleting social account:', error);
    res.status(500).json({ message: 'Greška pri brisanju socijalnog naloga' });
  }
});

// Ažuriranje socijalnog naloga
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { accountName, accessToken, permissions } = req.body;

    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!socialAccount) {
      return res.status(404).json({ message: 'Socijalni nalog nije pronađen' });
    }

    const updatedAccount = await prisma.socialAccount.update({
      where: {
        id: parseInt(id)
      },
      data: {
        accountName,
        accessToken,
        permissions
      }
    });

    res.json(updatedAccount);
  } catch (error) {
    console.error('Error updating social account:', error);
    res.status(500).json({ message: 'Greška pri ažuriranju socijalnog naloga' });
  }
});

export default router; 