import express from 'express';
import { yorumEkle, yorumSil } from '../controllers/yorumKontrolcu.js';
import { kimlikDogrula } from '../middleware/kimlikDogrulama.js';

const router = express.Router();

// Yorum ekleme (Private)
router.post('/', kimlikDogrula, yorumEkle);

// Yorum silme (Private)
router.delete('/:id', kimlikDogrula, yorumSil);

export default router;
