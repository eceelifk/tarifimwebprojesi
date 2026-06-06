import express from 'express';
import { kayitOl, girisYap, profilGetir } from '../controllers/kullaniciKontrolcu.js';
import { kimlikDogrula } from '../middleware/kimlikDogrulama.js';

const router = express.Router();

// Yeni kullanıcı kaydı (Herkes erişebilir)
router.post('/kayit', kayitOl);

// Kullanıcı girişi (Herkes erişebilir)
router.post('/giris', girisYap);

// Kullanıcı profil bilgileri (Sadece giriş yapmış kullanıcılar - kimlikDogrula korumalı)
router.get('/profil', kimlikDogrula, profilGetir);

export default router;
