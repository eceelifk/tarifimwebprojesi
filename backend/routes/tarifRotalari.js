import express from 'express';
import {
  tarifleriGetir,
  tarifGetir,
  tarifEkle,
  tarifGuncelle,
  tarifSil,
  tarifePuanVer,
  tarifFavoriToggle
} from '../controllers/tarifKontrolcu.js';
import { kimlikDogrula } from '../middleware/kimlikDogrulama.js';

const router = express.Router();

// Tariflerin listelenmesi ve tek bir tarifin getirilmesi herkese 
router.get('/', tarifleriGetir);
router.get('/:id', tarifGetir);

// Tarif ekleme, güncelleme, silme işlemleri giriş yapmayı gerektirir (kimlikDogrula)
router.post('/', kimlikDogrula, tarifEkle);
router.put('/:id', kimlikDogrula, tarifGuncelle);
router.delete('/:id', kimlikDogrula, tarifSil);

// Puan verme ve favorilere ekleme/çıkarma - korumalı
router.post('/:id/puan', kimlikDogrula, tarifePuanVer);
router.post('/:id/favori', kimlikDogrula, tarifFavoriToggle);

export default router;
