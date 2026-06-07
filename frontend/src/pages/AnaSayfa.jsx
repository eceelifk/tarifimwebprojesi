import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import TarifKarti from '../components/TarifKarti';
import YuklenmeBelirteci from '../components/YuklenmeBelirteci';
import Bildirim from '../components/Bildirim';

const AnaSayfa = () => {
  const [tarifler, setTarifler] = useState([]);
  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hataMesajı, setHataMesajı] = useState('');
  const [bildirim, setBildirim] = useState({ acik: false, mesaj: '', tip: 'basari' });

  // Kategoriler Listesi
  const kategoriler = ['Tümü', 'Çorba', 'Ana Yemek', 'Tatlı', 'Fit & Glutensiz', 'Diğer'];

  // Arama metni veya seçili kategori değiştiğinde tarifleri çek
  useEffect(() => {
    const tarifleriCek = async () => {
      try {
        setYukleniyor(true);
        
        // Arama ve Kategori filtrelerini URL'e ekliyoruz
        let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tarifler?`;
        if (aramaMetni) url += `arama=${encodeURIComponent(aramaMetni)}&`;
        if (seciliKategori) url += `kategori=${encodeURIComponent(seciliKategori)}`;

        const yanit = await fetch(url);
        const veri = await yanit.json();

        if (veri.basarili) {
          setTarifler(veri.tarifler);
        } else {
          setHataMesajı(veri.mesaj || 'Tarifler yüklenirken bir sorun oluştu.');
        }
      } catch (hata) {
        setHataMesajı('Sunucuyla bağlantı kurulamadı.');
      } finally {
        setYukleniyor(false);
      }
    };

    // Arama yaparken hemen her tuş basımında istek atmamak için debounce uygulayabiliriz.
    // Ancak basitlik açısından 300ms gecikmeli istek tetikliyoruz.
    const zamanlayici = setTimeout(() => {
      tarifleriCek();
    }, 300);

    return () => clearTimeout(zamanlayici);
  }, [aramaMetni, seciliKategori]);

  const bildirimKapat = () => setBildirim({ ...bildirim, acik: false });

  return (
    <div className="ana-sayfa-konteyner">
      {/* Üst Karşılama Alanı */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1a202c' }}>Mutfaktaki Yeni İlhamınız</h1>
        <p style={{ color: 'var(--renk-yazi-ikincil)', fontSize: '1.1rem' }}>
          Her öğünü ziyafete dönüştürecek en leziz ve pratik tarifler.
        </p>
      </div>

      {/* Arama ve Filtreleme Paneli */}
      <div className="arama-filtre-alani">
        <div className="arama-kutusu">
          <Search size={20} />
          <input
            type="text"
            placeholder="Yemek tarifi veya kelime ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
          />
        </div>

        {/* Kategori Butonları */}
        <div className="kategoriler">
          {kategoriler.map((kat) => (
            <button
              key={kat}
              className={`btn-kategori ${seciliKategori === kat ? 'aktif' : ''}`}
              onClick={() => setSeciliKategori(kat)}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* Tarif Listesi Gösterimi */}
      {yukleniyor ? (
        <YuklenmeBelirteci mesaj="Leziz tarifler aranıyor..." />
      ) : hataMesajı ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--renk-hata)', fontWeight: 600 }}>
          {hataMesajı}
        </div>
      ) : tarifler.length === 0 ? (
        <div className="bos-durum">
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Hiç tarif bulunamadı.</p>
          <p>Arama kelimenizi değiştirmeyi veya farklı bir kategori seçmeyi deneyin.</p>
        </div>
      ) : (
        <div className="tarif-izgara">
          {tarifler.map((tarif) => (
            <TarifKarti key={tarif._id} tarif={tarif} />
          ))}
        </div>
      )}

      {/* Toast Bildirimi */}
      {bildirim.acik && (
        <Bildirim mesaj={bildirim.mesaj} tip={bildirim.tip} onClose={bildirimKapat} />
      )}
    </div>
  );
};

export default AnaSayfa;
