import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import { Send, Trash2 } from 'lucide-react';

const YorumAlani = ({ tarifId, yorumlar, onYorumEklendi, onYorumSilindi, tarifYazariId }) => {
  const { kullanici, token } = useContext(OturumBaglami);
  const [icerik, setIcerik] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const yorumGonderHandler = async (e) => {
    e.preventDefault();
    setHata('');

    if (icerik.trim().length < 2) {
      setHata('Yorum en az 2 karakter olmalıdır.');
      return;
    }

    try {
      setYukleniyor(true);
      
      const yanit = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/yorumlar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tarifId,
          icerik: icerik.trim()
        })
      });

      const veri = await yanit.json();

      if (veri.basarili) {
        setIcerik('');
        onYorumEklendi(veri.yorum); // Üst bileşene yeni yorumu ekletme
      } else {
        setHata(veri.mesaj);
      }
    } catch (hata) {
      setHata('Sunucuyla bağlantı kurulamadı.');
    } finally {
      setYukleniyor(false);
    }
  };

  const yorumSilHandler = async (yorumId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const yanit = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/yorumlar/${yorumId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const veri = await yanit.json();

      if (veri.basarili) {
        onYorumSilindi(yorumId); // Üst bileşenden silme
      }
    } catch (hata) {
      console.error('Yorum silinirken hata:', hata);
    }
  };

  // Tarih biçimlendirme fonksiyonu
  const tarihBicimlendir = (tarihString) => {
    const tarih = new Date(tarihString);
    return tarih.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="yorum-grubu">
      <h3 className="panel-baslik">Yorumlar ({yorumlar.length})</h3>

      {/* Yorum Ekleme Formu */}
      {kullanici ? (
        <form onSubmit={yorumGonderHandler} style={{ marginBottom: '2rem' }}>
          <div className="form-grubu" style={{ marginBottom: '0.8rem' }}>
            <textarea
              placeholder="Tarif hakkında ne düşünüyorsunuz? Yorumunuzu yazın..."
              rows={3}
              value={icerik}
              onChange={(e) => setIcerik(e.target.value)}
              disabled={yukleniyor}
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>
          {hata && <p style={{ color: 'var(--renk-hata)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{hata}</p>}
          <button type="submit" className="btn-ana" disabled={yukleniyor} style={{ width: 'auto' }}>
            <Send size={16} /> {yukleniyor ? 'Gönderiliyor...' : 'Yorum Gönder'}
          </button>
        </form>
      ) : (
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: 'var(--yarıcap-buton)', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--renk-yazi-ikincil)' }}>
            Yorum yazabilmek için <Link to="/giris" className="oturum-link">Giriş Yapmalısınız</Link>.
          </p>
        </div>
      )}

      {/* Yorum Listesi */}
      <div className="yorumlar-kapsayici">
        {yorumlar.length === 0 ? (
          <p style={{ color: 'var(--renk-yazi-ikincil)', textAlign: 'center', fontStyle: 'italic' }}>
            Henüz yorum yapılmamış. İlk yorumu siz yapın!
          </p>
        ) : (
          yorumlar.map((yorum) => {
            // Yetki kontrolü: Yorum yazarı, tarif sahibi veya admin silebilir
            const silmeYetkisi = kullanici && (
              kullanici._id === yorum.yazar._id || 
              kullanici._id === tarifYazariId || 
              kullanici.rol === 'admin'
            );

            return (
              <div key={yorum._id} className="yorum-oge">
                <div className="yorum-ust">
                  <div className="yorum-yazar-alanı">
                    <img src={yorum.yazar.profilResmi} alt={yorum.yazar.isim} className="yorum-yazar-avatar" />
                    <div>
                      <span className="yorum-yazar-isim">{yorum.yazar.isim}</span>
                      <div className="yorum-tarih">{tarihBicimlendir(yorum.createdAt)}</div>
                    </div>
                  </div>

                  {silmeYetkisi && (
                    <button 
                      onClick={() => yorumSilHandler(yorum._id)} 
                      className="btn-sil-kucuk"
                      title="Yorumu Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="yorum-metni">{yorum.icerik}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default YorumAlani;
