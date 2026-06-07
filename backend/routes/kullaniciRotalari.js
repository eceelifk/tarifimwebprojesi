import express from 'express';
import { kayitOl, girisYap, profilGetir } from '../controllers/kullaniciKontrolcu.js';
import { kimlikDogrula } from '../middleware/kimlikDogrulama.js';

const router = express.Router();

// Yeni kullanıcı kaydı (Herkese)
router.post('/kayit', kayitOl);

// Kullanıcı girişi (Herkese)
router.post('/giris', girisYap);

// Kullanıcı profil bilgileri (Sadece giriş yapmış kullanıcılar)
router.get('/profil', kimlikDogrula, profilGetir);

export default router;
