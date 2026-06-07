import express from 'express';
import { yorumEkle, yorumSil } from '../controllers/yorumKontrolcu.js';
import { kimlikDogrula } from '../middleware/kimlikDogrulama.js';

const router = express.Router();

// Yorum ekle (Private)
router.post('/', kimlikDogrula, yorumEkle);

// Yorum sil (Private)
router.delete('/:id', kimlikDogrula, yorumSil);

export default router;
