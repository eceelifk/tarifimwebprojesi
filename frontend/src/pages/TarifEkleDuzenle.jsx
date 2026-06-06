import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import TarifFormu from '../components/TarifFormu';
import YuklenmeBelirteci from '../components/YuklenmeBelirteci';
import Bildirim from '../components/Bildirim';

const TarifEkleDuzenle = () => {
  const { id } = useParams(); // URL'de id varsa düzenleme modundayız demektir
  const navigate = useNavigate();
  const { kullanici, token } = useContext(OturumBaglami);

  const [ilkDegerler, setİlkDegerler] = useState(null);
  const [sayfaYukleniyor, setSayfaYukleniyor] = useState(false);
  const [formYukleniyor, setFormYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [bildirim, setBildirim] = useState({ acik: false, mesaj: '', tip: 'basari' });

  const duzenlemeModu = !!id;

  // Giriş yapılmamışsa giriş sayfasına yönlendir
  useEffect(() => {
    if (!kullanici) {
      navigate('/giris');
    }
  }, [kullanici, navigate]);

  // Düzenleme modundaysak mevcut tarif bilgilerini çek
  useEffect(() => {
    const tarifiCek = async () => {
      if (!duzenlemeModu) return;

      try {
        setSayfaYukleniyor(true);
        const yanit = await fetch(`http://localhost:5000/api/tarifler/${id}`);
        const veri = await yanit.json();

        if (veri.basarili) {
          // Yetki Kontrolü: Tarifi sadece kendi yazarı veya admin düzenleyebilir
          if (veri.tarif.yazar._id !== kullanici._id && kullanici.rol !== 'admin') {
            navigate('/', { state: { bildirimMesaj: 'Bu tarifi düzenlemek için yetkiniz yok.', bildirimTip: 'hata' } });
            return;
          }
          setİlkDegerler(veri.tarif);
        } else {
          setHata(veri.mesaj);
        }
      } catch (hata) {
        setHata('Tarif detayları çekilirken sunucu hatası oluştu.');
      } finally {
        setSayfaYukleniyor(false);
      }
    };

    tarifiCek();
  }, [id, duzenlemeModu, kullanici, navigate]);

  // Form Gönderme İşlemi (Ekleme veya Güncelleme API çağrısı)
  const formSubmitHandler = async (tarifVerisi) => {
    try {
      setFormYukleniyor(true);
      const url = duzenlemeModu 
        ? `http://localhost:5000/api/tarifler/${id}`
        : 'http://localhost:5000/api/tarifler';
      
      const metod = duzenlemeModu ? 'PUT' : 'POST';

      const yanit = await fetch(url, {
        method: metod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tarifVerisi)
      });

      const veri = await yanit.json();

      if (veri.basarili) {
        // Başarılı ise detay sayfasına veya ana sayfaya yönlendir ve bildirim göster
        const redirectUrl = duzenlemeModu ? `/tarif/${id}` : `/tarif/${veri.tarif._id}`;
        navigate(redirectUrl, { 
          state: { 
            bildirimMesaj: duzenlemeModu ? 'Tarifiniz başarıyla güncellendi!' : 'Yeni tarifiniz başarıyla paylaşıldı!',
            bildirimTip: 'basari'
          }
        });
      } else {
        setBildirim({ acik: true, mesaj: veri.mesaj || 'İşlem başarısız.', tip: 'hata' });
      }
    } catch (hata) {
      setBildirim({ acik: true, mesaj: 'İşlem sırasında sunucu hatası oluştu.', tip: 'hata' });
    } finally {
      setFormYukleniyor(false);
    }
  };

  const bildirimKapat = () => setBildirim({ ...bildirim, acik: false });

  if (sayfaYukleniyor) {
    return <YuklenmeBelirteci mesaj="Tarif verileri getiriliyor..." />;
  }

  if (hata) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--renk-hata)' }}>
        <p>{hata}</p>
      </div>
    );
  }

  return (
    <div className="tarif-ekle-duzenle-sayfasi" style={{ padding: '1rem 0' }}>
      <TarifFormu
        ilkDegerler={ilkDegerler}
        onSubmit={formSubmitHandler}
        yukleniyor={formYukleniyor}
        baslikEtiketi={duzenlemeModu ? 'Tarifi Güncelle' : 'Yeni Yemek Tarifi Ekle'}
      />

      {/* Bildirim Toast */}
      {bildirim.acik && (
        <Bildirim mesaj={bildirim.mesaj} tip={bildirim.tip} onClose={bildirimKapat} />
      )}
    </div>
  );
};

export default TarifEkleDuzenle;
