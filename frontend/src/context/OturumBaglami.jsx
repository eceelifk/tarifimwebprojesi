import React, { createContext, useState, useEffect } from 'react';

// Oturum Baglamı (AuthContext) Bu sayede tüm sayfa ve bileşenler 
// giriş yapmış kullanıcının bilgilerine kolayca erişebilecek.
export const OturumBaglami = createContext();

export const OturumSaglayici = ({ children }) => {
  // Kullanıcı ve token durumlarını (state) tutuyoruz.
  // İlk açılışta tarayıcı hafızasında (localStorage) kayıtlı token ve kullanıcı var mı bakıyoruz.
  const [kullanici, setKullanici] = useState(null);
  const [token, setToken] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    // Sayfa ilk yüklendiğinde tarayıcı hafızasına bakma
    try {
      const kayıtlıKullanici = localStorage.getItem('tarifim_kullanici');
      const kayıtlıToken = localStorage.getItem('tarifim_token');

      if (kayıtlıKullanici && kayıtlıToken && kayıtlıKullanici !== 'undefined') {
        setKullanici(JSON.parse(kayıtlıKullanici));
        setToken(kayıtlıToken);
      }
    } catch (hata) {
      console.error('Tarayıcı hafızası okunurken hata oluştu, temizleniyor:', hata);
      localStorage.removeItem('tarifim_kullanici');
      localStorage.removeItem('tarifim_token');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Giriş yapıldığında çalışacak fonksiyon
  const giris = (kullaniciVerisi, tokenVerisi) => {
    setKullanici(kullaniciVerisi);
    setToken(tokenVerisi);
    
    // Tarayıcı hafızasına bilgileri kaydet (Sayfa yenilense de çıkış yapmasın diye)
    localStorage.setItem('tarifim_kullanici', JSON.stringify(kullaniciVerisi));
    localStorage.setItem('tarifim_token', tokenVerisi);
  };

  // Çıkış yapıldığında çalışacak fonksiyon
  const cikis = () => {
    setKullanici(null);
    setToken(null);
    
    // Tarayıcı hafızasını temizle
    localStorage.removeItem('tarifim_kullanici');
    localStorage.removeItem('tarifim_token');
  };

  // Kullanıcı bir tarifi favoriye eklediğinde veya çıkardığında arayüzün anında 
  // güncellenmesi için yerel kullanıcı durumundaki favoriler dizisini güncelleyen fonksiyon
  const favoriGuncelle = (tarifId) => {
    if (!kullanici) return;

    let yeniFavoriler = [...kullanici.favoriler];
    const index = yeniFavoriler.indexOf(tarifId);

    if (index > -1) {
      yeniFavoriler.splice(index, 1); // Zaten favoriyse listeden çıkar
    } else {
      yeniFavoriler.push(tarifId); // Değilse listeye ekle
    }

    const guncelKullanici = { ...kullanici, favoriler: yeniFavoriler };
    setKullanici(guncelKullanici);
    localStorage.setItem('tarifim_kullanici', JSON.stringify(guncelKullanici));
  };

  return (
    // Baglamı (Context) dışarıya aç
    <OturumBaglami.Provider value={{ kullanici, token, yukleniyor, giris, cikis, favoriGuncelle }}>
      {children}
    </OturumBaglami.Provider>
  );
};
