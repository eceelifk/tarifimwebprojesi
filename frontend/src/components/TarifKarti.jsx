import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import { Clock, Users, Star, Heart } from 'lucide-react';

const TarifKarti = ({ tarif, onFavoriDurumuDegisti }) => {
  const { kullanici, token, favoriGuncelle } = useContext(OturumBaglami);
  const navigate = useNavigate();
  const [favoriYukleniyor, setFavoriYukleniyor] = useState(false);

  // Bu tarif giriş yapmış kullanıcının favorilerinde var mı? (Geriye dönük uyumluluk ve güvenli okuma için)
  const favorideMi = (kullanici && kullanici.favoriler) ? kullanici.favoriler.includes(tarif._id) : false;

  const favoriTiklaHandler = async (e) => {
    e.preventDefault(); // Kartın detay sayfasına gitmesini engelle
    e.stopPropagation();

    if (!kullanici) {
      // Giriş yapmamışsa giriş sayfasına yönlendir
      navigate('/giris');
      return;
    }

    if (favoriYukleniyor) return;

    try {
      setFavoriYukleniyor(true);
      
      // Backend'e istek gönderip favorilere ekle/çıkar yapıyoruz
      const yanit = await fetch(`http://localhost:5000/api/tarifler/${tarif._id}/favori`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const veri = await yanit.json();

      if (veri.basarili) {
        // Yerel state'i güncelle (Context vasıtasıyla)
        favoriGuncelle(tarif._id);
        if (onFavoriDurumuDegisti) {
          // Eğer profil sayfasında favoriler sekmesindeysek kartı anında kaldırmak için callback'i tetikle
          onFavoriDurumuDegisti(tarif._id, veri.favoride);
        }
      }
    } catch (hata) {
      console.error('Favori güncellenirken hata oluştu:', hata);
    } finally {
      setFavoriYukleniyor(false);
    }
  };

  // Toplam süreyi hesapla (Hazırlama + Pişirme)
  const toplamSure = tarif.hazirlamaSuresi + tarif.pisirmeSuresi;

  return (
    <div className="tarif-karti">
      <Link to={`/tarif/${tarif._id}`}>
        {/* Resim ve Rozetler */}
        <div className="tarif-kart-resim-alani">
          <img src={tarif.resimUrl} alt={tarif.baslik} className="tarif-kart-resim" />
          <span className="tarif-kart-kategori">{tarif.kategori}</span>
          
          {/* Kalp (Favori) Butonu */}
          <button 
            onClick={favoriTiklaHandler} 
            className={`btn-favori-kart ${favorideMi ? 'aktif' : ''}`}
            disabled={favoriYukleniyor}
            title={favorideMi ? 'Favorilerimden Çıkar' : 'Favorilerime Ekle'}
          >
            <Heart size={20} fill={favorideMi ? '#e53e3e' : 'none'} />
          </button>
        </div>

        {/* Tarif İçeriği */}
        <div className="tarif-kart-icerik">
          <h3 className="tarif-kart-baslik">{tarif.baslik}</h3>
          <p className="tarif-kart-aciklama">{tarif.aciklama}</p>
          
          {/* Kart Bilgileri */}
          <div className="tarif-kart-bilgi">
            <div className="tarif-kart-detay">
              <Clock size={16} />
              <span>{toplamSure} dk</span>
            </div>
            <div className="tarif-kart-detay">
              <Users size={16} />
              <span>{tarif.kisiSayisi} Kişilik</span>
            </div>
            
            {/* Puan Durumu */}
            <div className="tarif-kart-puan">
              <Star size={16} fill="#dd6b20" />
              <span>{tarif.ortalamaPuan > 0 ? tarif.ortalamaPuan : 'Yeni'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TarifKarti;
