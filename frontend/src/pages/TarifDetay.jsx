import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import { Clock, Users, Star, Heart, Edit2, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import YuklenmeBelirteci from '../components/YuklenmeBelirteci';
import YorumAlani from '../components/YorumAlani';
import Modal from '../components/Modal';
import Bildirim from '../components/Bildirim';

const TarifDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kullanici, token, favoriGuncelle } = useContext(OturumBaglami);

  const [tarif, setTarif] = useState(null);
  const [yorumlar, setYorumlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hataMesajı, setHataMesajı] = useState('');
  
  // Puanlama, Favori, Silme ve Bildirim State'leri
  const [kullaniciPuani, setKullaniciPuani] = useState(0);
  const [puanYukleniyor, setPuanYukleniyor] = useState(false);
  const [favoriYukleniyor, setFavoriYukleniyor] = useState(false);
  const [silmeModalAcik, setSilmeModalAcik] = useState(false);
  const [silmeYukleniyor, setSilmeYukleniyor] = useState(false);
  const [bildirim, setBildirim] = useState({ acik: false, mesaj: '', tip: 'basari' });

  useEffect(() => {
    const tarifDetayCek = async () => {
      try {
        setYukleniyor(true);
        const yanit = await fetch(`http://localhost:5000/api/tarifler/${id}`);
        const veri = await yanit.json();

        if (veri.basarili) {
          setTarif(veri.tarif);
          setYorumlar(veri.yorumlar);

          // Kullanıcının daha önce verdiği puan varsa yıldızları doldur
          if (kullanici && veri.tarif.puanlar) {
            const eskiPuanObj = veri.tarif.puanlar.find(
              (p) => p.kullanici.toString() === kullanici._id.toString()
            );
            if (eskiPuanObj) {
              setKullaniciPuani(eskiPuanObj.puan);
            }
          }
        } else {
          setHataMesajı(veri.mesaj || 'Tarif detayları yüklenemedi.');
        }
      } catch (hata) {
        setHataMesajı('Sunucuyla bağlantı kurulamadı.');
      } finally {
        setYukleniyor(false);
      }
    };

    tarifDetayCek();
  }, [id, kullanici]);

  // Favorilere Ekleme/Çıkarma Handler'ı
  const favoriTiklaHandler = async () => {
    if (!kullanici) {
      navigate('/giris');
      return;
    }

    if (favoriYukleniyor) return;

    try {
      setFavoriYukleniyor(true);
      const yanit = await fetch(`http://localhost:5000/api/tarifler/${tarif._id}/favori`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const veri = await yanit.json();

      if (veri.basarili) {
        favoriGuncelle(tarif._id);
        setBildirim({
          acik: true,
          mesaj: veri.mesaj,
          tip: 'basari'
        });
      }
    } catch (hata) {
      console.error(hata);
    } finally {
      setFavoriYukleniyor(false);
    }
  };

  // Puan Verme Handler'ı
  const puanVerHandler = async (yeniPuan) => {
    if (!kullanici) {
      navigate('/giris');
      return;
    }

    if (puanYukleniyor) return;

    try {
      setPuanYukleniyor(true);
      const yanit = await fetch(`http://localhost:5000/api/tarifler/${tarif._id}/puan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ puan: yeniPuan })
      });
      const veri = await yanit.json();

      if (veri.basarili) {
        setKullaniciPuani(yeniPuan);
        // Tarif state'ini güncel ortalama puanla güncelle
        setTarif({
          ...tarif,
          ortalamaPuan: veri.ortalamaPuan
        });
        setBildirim({
          acik: true,
          mesaj: `Tarife ${yeniPuan} puan verdiniz!`,
          tip: 'basari'
        });
      } else {
        setBildirim({ acik: true, mesaj: veri.mesaj, tip: 'hata' });
      }
    } catch (hata) {
      setBildirim({ acik: true, mesaj: 'Puan kaydedilirken hata oluştu.', tip: 'hata' });
    } finally {
      setPuanYukleniyor(false);
    }
  };

  // Tarifi Silme Handler'ı
  const tarifSilHandler = async () => {
    try {
      setSilmeYukleniyor(true);
      const yanit = await fetch(`http://localhost:5000/api/tarifler/${tarif._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const veri = await yanit.json();

      if (veri.basarili) {
        navigate('/', { state: { bildirimMesaj: 'Tarif başarıyla silindi.' } });
      } else {
        setBildirim({ acik: true, mesaj: veri.mesaj, tip: 'hata' });
        setSilmeModalAcik(false);
      }
    } catch (hata) {
      setBildirim({ acik: true, mesaj: 'Tarif silinirken bir hata oluştu.', tip: 'hata' });
      setSilmeModalAcik(false);
    } finally {
      setSilmeYukleniyor(false);
    }
  };

  // Yorum Ekleme Callback
  const yorumEklendiHandler = (yeniYorum) => {
    setYorumlar([yeniYorum, ...yorumlar]);
    setBildirim({ acik: true, mesaj: 'Yorumunuz eklendi.', tip: 'basari' });
  };

  // Yorum Silme Callback
  const yorumSilindiHandler = (yorumId) => {
    setYorumlar(yorumlar.filter((y) => y._id !== yorumId));
    setBildirim({ acik: true, mesaj: 'Yorum silindi.', tip: 'basari' });
  };

  const bildirimKapat = () => setBildirim({ ...bildirim, acik: false });

  if (yukleniyor) {
    return <YuklenmeBelirteci mesaj="Tarif detayları hazırlanıyor..." />;
  }

  if (hataMesajı) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--renk-hata)' }}>
        <h2>Hata</h2>
        <p>{hataMesajı}</p>
        <Link to="/" className="btn-ana" style={{ display: 'inline-flex', marginTop: '1.5rem', width: 'auto' }}>
          Geri Dön
        </Link>
      </div>
    );
  }

  if (!tarif) return null;

  // Yazar ve favori kontrolleri
  const tarifYazariMi = kullanici && tarif.yazar && kullanici._id === tarif.yazar._id;
  const favorideMi = kullanici && kullanici.favoriler && kullanici.favoriler.includes(tarif._id);

  return (
    <div className="detay-sayfasi">
      {/* Ekmek Kırıntısı Navigasyon (Breadcrumbs) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--renk-yazi-ikincil)' }}>
        <Link to="/">Tarifler</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--renk-yazi-ana)', fontWeight: 500 }}>{tarif.baslik}</span>
      </div>

      {/* Üst Kart (Görsel ve Ana Bilgiler) */}
      <div className="detay-header">
        <div className="detay-resim-alani">
          <img src={tarif.resimUrl} alt={tarif.baslik} className="detay-resim" />
        </div>

        <div className="detay-ana-bilgi">
          <div className="detay-kategori-alani">
            <span className="tarif-kart-kategori" style={{ position: 'static' }}>{tarif.kategori}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#dd6b20', fontWeight: 'bold' }}>
              <Star size={18} fill="#dd6b20" />
              <span>{tarif.ortalamaPuan > 0 ? `${tarif.ortalamaPuan} / 5` : 'Puanlanmamış'}</span>
            </div>
          </div>

          <h1 className="detay-baslik">{tarif.baslik}</h1>
          
          <p style={{ color: 'var(--renk-yazi-ikincil)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            {tarif.aciklama}
          </p>

          {/* Yazar Bilgisi */}
          <div className="detay-yazar">
            <img src={tarif.yazar?.profilResmi} alt={tarif.yazar?.isim} className="detay-yazar-avatar" />
            <div>
              <div className="detay-yazar-isim">{tarif.yazar?.isim}</div>
              <div className="detay-yazar-tarih">
                {new Date(tarif.createdAt).toLocaleDateString('tr-TR')} tarihinde paylaşıldı
              </div>
            </div>
          </div>

          {/* Özellikler Tablosu (Süre ve Kişi) */}
          <div className="detay-ozellikler">
            <div className="ozellik-kart">
              <span className="ozellik-sayi">{tarif.hazirlamaSuresi}</span>
              <span className="ozellik-etiket">Hazırlama (dk)</span>
            </div>
            <div className="ozellik-kart">
              <span className="ozellik-sayi">{tarif.pisirmeSuresi}</span>
              <span className="ozellik-etiket">Pişirme (dk)</span>
            </div>
            <div className="ozellik-kart">
              <span className="ozellik-sayi">{tarif.kisiSayisi}</span>
              <span className="ozellik-etiket">Kişilik</span>
            </div>
          </div>

          {/* Aksiyon Butonları (Düzenle, Sil, Favori) */}
          <div className="detay-aksiyonlar">
            <button 
              onClick={favoriTiklaHandler} 
              className={`btn-ikincil ${favorideMi ? 'aktif' : ''}`}
              disabled={favoriYukleniyor}
              style={{ flex: 1, borderColor: favorideMi ? '#e53e3e' : '', color: favorideMi ? '#e53e3e' : '' }}
            >
              <Heart size={18} fill={favorideMi ? '#e53e3e' : 'none'} />
              {favorideMi ? 'Favorilerimde' : 'Favorilerime Ekle'}
            </button>

            {/* Sadece Tarif Yazarı veya Admin Düzenleme/Silme Yapabilir */}
            {(tarifYazariMi || (kullanici && kullanici.rol === 'admin')) && (
              <>
                <Link to={`/tarif-duzenle/${tarif._id}`} className="btn-ikincil" title="Tarifi Düzenle">
                  <Edit2 size={18} /> Düzenle
                </Link>
                <button 
                  onClick={() => setSilmeModalAcik(true)} 
                  className="btn-ikincil" 
                  style={{ color: 'var(--renk-hata)', borderColor: 'rgba(229, 62, 98, 0.2)' }}
                  title="Tarifi Sil"
                >
                  <Trash2 size={18} /> Sil
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bölüm (Malzemeler ve Adımlar) */}
      <div className="detay-icerik-izgara">
        {/* Sol Panel: Malzemeler */}
        <div className="detay-panel">
          <h3 className="panel-baslik">Malzemeler</h3>
          <ul className="malzeme-listesi">
            {tarif.malzemeler.map((malzeme, index) => (
              <li key={index}>
                <CheckCircle2 size={18} />
                <span>{malzeme}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ Panel: Hazırlanış ve Yorumlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="detay-panel">
            <h3 className="panel-baslik">Nasıl Hazırlanır?</h3>
            <ol className="adim-listesi">
              {tarif.hazirlanis.map((adim, index) => (
                <li key={index} className="adim-kart">
                  <span className="adim-no">{index + 1}</span>
                  <div className="adim-icerik">{adim}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* İnteraktif Puanlama Yıldızları */}
          <div className="puanlama-paneli">
            <h4 style={{ fontSize: '1.1rem' }}>Bu tarifi nasıl buldunuz?</h4>
            <div className="yıldızlar">
              {[1, 2, 3, 4, 5].map((yildiz) => (
                <button
                  key={yildiz}
                  onClick={() => puanVerHandler(yildiz)}
                  className={`yıldız-buton ${kullaniciPuani >= yildiz ? 'dolu' : ''}`}
                  title={`${yildiz} Puan Ver`}
                >
                  <Star size={28} fill={kullaniciPuani >= yildiz ? '#dd6b20' : 'none'} />
                </button>
              ))}
            </div>
            {!kullanici && <p style={{ fontSize: '0.8rem', color: 'var(--renk-yazi-ikincil)' }}>Puan vermek için giriş yapmalısınız.</p>}
          </div>

          {/* Yorumlar Alanı Bileşeni */}
          <div className="detay-panel">
            <YorumAlani 
              tarifId={tarif._id} 
              yorumlar={yorumlar}
              onYorumEklendi={yorumEklendiHandler}
              onYorumSilindi={yorumSilindiHandler}
              tarifYazariId={tarif.yazar?._id}
            />
          </div>
        </div>
      </div>

      {/* Silme Onay Modali */}
      <Modal
        acikMi={silmeModalAcik}
        baslik="Tarifi Sil?"
        icerik={`"${tarif.baslik}" tarifini silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tarife bağlı tüm yorumlar da silinecektir.`}
        onOnay={tarifSilHandler}
        onIptal={() => setSilmeModalAcik(false)}
      />

      {/* Bildirim Toast */}
      {bildirim.acik && (
        <Bildirim mesaj={bildirim.mesaj} tip={bildirim.tip} onClose={bildirimKapat} />
      )}
    </div>
  );
};

export default TarifDetay;
