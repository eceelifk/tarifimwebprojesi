import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { OturumSaglayici } from './context/OturumBaglami';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnaSayfa from './pages/AnaSayfa';
import TarifDetay from './pages/TarifDetay';
import GirisKayit from './pages/GirisKayit';
import Profil from './pages/Profil';
import TarifEkleDuzenle from './pages/TarifEkleDuzenle';
import Bildirim from './components/Bildirim';
import './App.css';

// Rota ve Düzen Yönetimi için Alt Bileşen (useLocation kullanabilmek için BrowserRouter altında olmalı)
function UygulamaIcerigi() {
  const konum = useLocation();
  const [bildirim, setBildirim] = useState({ acik: false, mesaj: '', tip: 'basari' });

  // Sayfalar arası yönlendirmede gönderilen durum mesajlarını (Tarif silindi gibi) 
  // yakalayıp ekranın sağ altında Toast bildirim olarak gösteren mekanizma
  useEffect(() => {
    if (konum.state && konum.state.bildirimMesaj) {
      setBildirim({
        acik: true,
        mesaj: konum.state.bildirimMesaj,
        tip: konum.state.bildirimTip || 'basari'
      });
      // Mesajı okuduktan sonra sayfanın URL'indeki state bilgisini temizle sayfa yenilendiğinde tekrar açılmasın
      window.history.replaceState({}, document.title);
    }
  }, [konum]);

  const bildirimKapat = () => setBildirim({ ...bildirim, acik: false });

  return (
    <div className="uygulama">
      {/* Üst Menü Çubuğu */}
      <Navbar />

      {/* Sayfa İçeriklerinin Eklendiği Alan */}
      <main className="icerik-alani">
        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/tarif/:id" element={<TarifDetay />} />
          <Route path="/giris" element={<GirisKayit tip="giris" />} />
          <Route path="/kayit" element={<GirisKayit tip="kayit" />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/tarif-ekle" element={<TarifEkleDuzenle />} />
          <Route path="/tarif-duzenle/:id" element={<TarifEkleDuzenle />} />
        </Routes>
      </main>

      {/* Alt Bilgi Bandı */}
      <Footer />

      {/* Global Bildirim Bileşeni */}
      {bildirim.acik && (
        <Bildirim mesaj={bildirim.mesaj} tip={bildirim.tip} onClose={bildirimKapat} />
      )}
    </div>
  );
}

// Ana App Bileşeni: Tüm uygulamayı Sağlayıcılarla (Context ve Router) kaplama
function App() {
  return (
    <OturumSaglayici>
      <BrowserRouter>
        <UygulamaIcerigi />
      </BrowserRouter>
    </OturumSaglayici>
  );
}

export default App;
