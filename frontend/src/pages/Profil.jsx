import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import { User, Heart, BookOpen, Plus } from 'lucide-react';
import TarifKarti from '../components/TarifKarti';
import YuklenmeBelirteci from '../components/YuklenmeBelirteci';

const Profil = () => {
  const { kullanici: girisYapanKullanici, token } = useContext(OturumBaglami);
  const navigate = useNavigate();

  const [profilVerisi, setProfilVerisi] = useState(null);
  const [kendiTariflerim, setKendiTariflerim] = useState([]);
  const [aktifSekme, setAktifSekme] = useState('tariflerim'); // 'tariflerim' veya 'favorilerim'
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  // Giriş yapılmamışsa giriş sayfasına gönder
  useEffect(() => {
    if (!girisYapanKullanici) {
      navigate('/giris');
    }
  }, [girisYapanKullanici, navigate]);

  useEffect(() => {
    const profilVeTarifleriGetir = async () => {
      if (!token) return;

      try {
        setYukleniyor(true);
        setHata('');

        // 1. Kullanıcı profilini ve favorilerini çek
        const profilYanit = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/kullanici/profil`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const profilVeri = await profilYanit.json();

        // 2. Tüm tarifleri çekip kullanıcının kendi tariflerini filtrele
        const tariflerYanit = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tarifler`);
        const tariflerVeri = await tariflerYanit.json();

        if (profilVeri.basarili && tariflerVeri.basarili) {
          setProfilVerisi(profilVeri.kullanici);
          
          // Kendi tariflerini filtrele
          const yazarinTarifleri = tariflerVeri.tarifler.filter(
            (t) => t.yazar && t.yazar._id === girisYapanKullanici._id
          );
          setKendiTariflerim(yazarinTarifleri);
        } else {
          setHata('Bilgiler getirilirken bir hata oluştu.');
        }
      } catch (hata) {
        setHata('Sunucuyla bağlantı kurulamadı.');
      } finally {
        setYukleniyor(false);
      }
    };

    profilVeTarifleriGetir();
  }, [token, girisYapanKullanici]);

  // Favorilerden çıkarıldığında kartı ekrandan anında kaldırmak için callback
  const favoriDegisimHandler = (tarifId, favorideMi) => {
    if (!favorideMi && profilVerisi) {
      const yeniFavoriler = profilVerisi.favoriler.filter((t) => t._id !== tarifId);
      setProfilVerisi({
        ...profilVerisi,
        favoriler: yeniFavoriler
      });
    }
  };

  if (yukleniyor) {
    return <YuklenmeBelirteci mesaj="Profil sayfanız yükleniyor..." />;
  }

  if (hata) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--renk-hata)' }}>
        <p>{hata}</p>
      </div>
    );
  }

  if (!profilVerisi) return null;

  return (
    <div className="profil-konteyner">
      {/* Üst Profil Kartı */}
      <div className="profil-ust-bilgi">
        <img src={profilVerisi.profilResmi} alt={profilVerisi.isim} className="profil-buyuk-avatar" />
        <div className="profil-detaylar">
          <h2>{profilVerisi.isim}</h2>
          <p>{profilVerisi.eposta}</p>
          <span className={`profil-rozeti ${profilVerisi.rol === 'admin' ? 'admin' : ''}`}>
            {profilVerisi.rol === 'admin' ? 'Yönetici (Admin)' : 'Şef (Kullanıcı)'}
          </span>
        </div>
      </div>

      {/* Sekme Menüsü */}
      <div className="sekme-menusu">
        <button
          className={`btn-sekme ${aktifSekme === 'tariflerim' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('tariflerim')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} /> Tariflerim ({kendiTariflerim.length})
          </span>
        </button>
        <button
          className={`btn-sekme ${aktifSekme === 'favorilerim' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('favorilerim')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={18} /> Favorilerim ({profilVerisi.favoriler ? profilVerisi.favoriler.length : 0})
          </span>
        </button>
      </div>

      {/* Sekme İçerikleri */}
      <div className="sekme-icerik">
        {aktifSekme === 'tariflerim' ? (
          kendiTariflerim.length === 0 ? (
            <div className="bos-durum">
              <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Henüz bir yemek tarifi paylaşmadınız.</p>
              <p>Hemen ilk leziz tarifinizi ekleyip insanlarla paylaşın!</p>
              <Link to="/tarif-ekle" className="btn-ana" style={{ display: 'inline-flex', width: 'auto', marginTop: '1rem' }}>
                <Plus size={18} /> Yeni Tarif Ekle
              </Link>
            </div>
          ) : (
            <div className="tarif-izgara">
              {kendiTariflerim.map((tarif) => (
                <TarifKarti key={tarif._id} tarif={tarif} />
              ))}
            </div>
          )
        ) : (
          // Favorilerim sekmesi
          !profilVerisi.favoriler || profilVerisi.favoriler.length === 0 ? (
            <div className="bos-durum">
              <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Favorileriniz boş.</p>
              <p>Beğendiğiniz tariflerin üzerindeki kalp simgesine tıklayarak buraya ekleyebilirsiniz.</p>
              <Link to="/" className="btn-ana" style={{ display: 'inline-flex', width: 'auto', marginTop: '1rem' }}>
                Tarifleri Keşfet
              </Link>
            </div>
          ) : (
            <div className="tarif-izgara">
              {profilVerisi.favoriler.map((tarif) => (
                <TarifKarti key={tarif._id} tarif={tarif} onFavoriDurumuDegisti={favoriDegisimHandler} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profil;
