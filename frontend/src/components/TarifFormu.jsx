import React, { useState, useEffect } from 'react';
import { Plus, Trash, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TarifFormu = ({ ilkDegerler, onSubmit, yukleniyor, baslikEtiketi }) => {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kategori, setKategori] = useState('Diğer');
  const [hazirlamaSuresi, setHazirlamaSuresi] = useState(15);
  const [pisirmeSuresi, setPisirmeSuresi] = useState(20);
  const [kisiSayisi, setKisiSayisi] = useState(4);
  const [resimUrl, setResimUrl] = useState('');

  // Dinamik Liste Durumları (Malzemeler ve Hazırlanış)
  const [malzemeler, setMalzemeler] = useState([]);
  const [yeniMalzeme, setYeniMalzeme] = useState('');
  
  const [hazirlanis, setHazirlanis] = useState([]);
  const [yeniAdim, setYeniAdim] = useState('');

  const [formHata, setFormHata] = useState('');

  const resimSecHandler = (e) => {
    const dosya = e.target.files[0];
    if (dosya) {
      if (dosya.size > 2 * 1024 * 1024) {
        setFormHata('Tarif resmi boyutu 2MB\'dan küçük olmalıdır.');
        return;
      }
      const okuyucu = new FileReader();
      okuyucu.onloadend = () => {
        setResimUrl(okuyucu.result);
      };
      okuyucu.readAsDataURL(dosya);
    }
  };

  // Eğer güncelleme modundaysak (ilkDegerler doluysa) form alanlarını doldur
  useEffect(() => {
    if (ilkDegerler) {
      setBaslik(ilkDegerler.baslik || '');
      setAciklama(ilkDegerler.aciklama || '');
      setKategori(ilkDegerler.kategori || 'Diğer');
      setHazirlamaSuresi(ilkDegerler.hazirlamaSuresi || 15);
      setPisirmeSuresi(ilkDegerler.pisirmeSuresi || 20);
      setKisiSayisi(ilkDegerler.kisiSayisi || 4);
      setResimUrl(ilkDegerler.resimUrl || '');
      setMalzemeler(ilkDegerler.malzemeler || []);
      setHazirlanis(ilkDegerler.hazirlanis || []);
    }
  }, [ilkDegerler]);

  // Yeni malzeme ekleme
  const malzemeEkleHandler = (e) => {
    e.preventDefault();
    if (yeniMalzeme.trim()) {
      setMalzemeler([...malzemeler, yeniMalzeme.trim()]);
      setYeniMalzeme('');
    }
  };

  // Malzeme silme
  const malzemeSilHandler = (index) => {
    const yeniListe = malzemeler.filter((_, i) => i !== index);
    setMalzemeler(yeniListe);
  };

  // Yeni hazırlanış adımı ekleme
  const adimEkleHandler = (e) => {
    e.preventDefault();
    if (yeniAdim.trim()) {
      setHazirlanis([...hazirlanis, yeniAdim.trim()]);
      setYeniAdim('');
    }
  };

  // Adım silme
  const adimSilHandler = (index) => {
    const yeniListe = hazirlanis.filter((_, i) => i !== index);
    setHazirlanis(yeniListe);
  };

  // Form gönderme
  const formSubmitHandler = (e) => {
    e.preventDefault();
    setFormHata('');

    // Validasyon Kontrolleri
    if (!baslik.trim() || !aciklama.trim()) {
      setFormHata('Lütfen tarif başlığını ve açıklamasını doldurunuz.');
      return;
    }

    if (malzemeler.length === 0) {
      setFormHata('Lütfen en az 1 adet malzeme ekleyiniz.');
      return;
    }

    if (hazirlanis.length === 0) {
      setFormHata('Lütfen en az 1 adet hazırlanış adımı ekleyiniz.');
      return;
    }

    if (hazirlamaSuresi < 0 || pisirmeSuresi < 0 || kisiSayisi < 1) {
      setFormHata('Lütfen süreleri ve kişi sayısını geçerli değerler giriniz.');
      return;
    }

    // Gönderilecek veri paketini hazırla
    const tarifVerisi = {
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      kategori,
      hazirlamaSuresi: Number(hazirlamaSuresi),
      pisirmeSuresi: Number(pisirmeSuresi),
      kisiSayisi: Number(kisiSayisi),
      malzemeler,
      hazirlanis
    };

    // Eğer resim URL girilmişse ekle, girilmemişse backend varsayılanı kullanır
    if (resimUrl.trim()) {
      tarifVerisi.resimUrl = resimUrl.trim();
    }

    onSubmit(tarifVerisi);
  };

  return (
    <div className="form-kartı">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to={ilkDegerler ? `/tarif/${ilkDegerler._id}` : '/'} style={{ color: 'var(--renk-yazi-ikincil)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h2>{baslikEtiketi}</h2>
      </div>

      {formHata && (
        <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '1rem', borderRadius: 'var(--yarıcap-buton)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {formHata}
        </div>
      )}

      <form onSubmit={formSubmitHandler}>
        {/* Tarif Başlığı */}
        <div className="form-grubu">
          <label htmlFor="baslik">Tarif Adı *</label>
          <input
            type="text"
            id="baslik"
            placeholder="Örn: Ev Yapımı Lazanya"
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            required
            disabled={yukleniyor}
          />
        </div>

        {/* Tarif Açıklaması */}
        <div className="form-grubu">
          <label htmlFor="aciklama">Kısa Açıklama *</label>
          <textarea
            id="aciklama"
            placeholder="Tarif hakkında kısa, iştah açıcı bir açıklama yazın..."
            rows={3}
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            required
            disabled={yukleniyor}
          />
        </div>

        {/* Tarif Görseli (Dosya Seç veya URL Yapıştır) */}
        <div className="form-grubu">
          <label>Tarif Görseli (Dosya Seçin veya İnternet Bağlantısı Yapıştırın)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input
              type="file"
              accept="image/*"
              onChange={resimSecHandler}
              disabled={yukleniyor}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--renk-yazi-ikincil)', minWidth: '40px' }}>veya URL:</span>
              <input
                type="url"
                id="resimUrl"
                placeholder="Örn: https://images.unsplash.com/photo-..."
                value={resimUrl.startsWith('data:') ? '' : resimUrl}
                onChange={(e) => setResimUrl(e.target.value)}
                disabled={yukleniyor}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          {resimUrl && (
            <div style={{ marginTop: '0.8rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--renk-yazi-ikincil)', marginBottom: '0.4rem' }}>Görsel Önizleme:</p>
              <img 
                src={resimUrl} 
                alt="Tarif Önizleme" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--yarıcap-buton)', border: '1px solid var(--renk-kenarlik)' }} 
              />
            </div>
          )}
        </div>

        {/* Kategori, Süre ve Kişi Sayısı Satırı */}
        <div className="satir-grubu">
          <div className="form-grubu">
            <label htmlFor="kategori">Kategori *</label>
            <select
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              disabled={yukleniyor}
            >
              <option value="Çorba">Çorba</option>
              <option value="Ana Yemek">Ana Yemek</option>
              <option value="Tatlı">Tatlı</option>
              <option value="Fit & Glutensiz">Fit & Glutensiz</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div className="form-grubu">
            <label htmlFor="hazirlamaSuresi">Hazırlama (dk) *</label>
            <input
              type="number"
              id="hazirlamaSuresi"
              min="0"
              value={hazirlamaSuresi}
              onChange={(e) => setHazirlamaSuresi(e.target.value)}
              required
              disabled={yukleniyor}
            />
          </div>

          <div className="form-grubu">
            <label htmlFor="pisirmeSuresi">Pişirme (dk) *</label>
            <input
              type="number"
              id="pisirmeSuresi"
              min="0"
              value={pisirmeSuresi}
              onChange={(e) => setPisirmeSuresi(e.target.value)}
              required
              disabled={yukleniyor}
            />
          </div>
        </div>

        <div className="satir-grubu" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-grubu">
            <label htmlFor="kisiSayisi">Kaç Kişilik? *</label>
            <input
              type="number"
              id="kisiSayisi"
              min="1"
              value={kisiSayisi}
              onChange={(e) => setKisiSayisi(e.target.value)}
              required
              disabled={yukleniyor}
            />
          </div>
        </div>

        {/* MALZEMELER LİSTESİ DİNAMİK ALANI */}
        <div className="form-grubu">
          <label>Malzemeler *</label>
          <div className="liste-giris-alanı">
            <input
              type="text"
              placeholder="Örn: 2 adet yumurta"
              value={yeniMalzeme}
              onChange={(e) => setYeniMalzeme(e.target.value)}
              disabled={yukleniyor}
            />
            <button type="button" onClick={malzemeEkleHandler} className="btn-ekle-kucuk" disabled={yukleniyor}>
              <Plus size={18} /> Ekle
            </button>
          </div>

          {/* Eklenen Malzemelerin Listesi */}
          <div className="liste-ogeleri">
            {malzemeler.length === 0 ? (
              <p style={{ color: 'var(--renk-yazi-ikincil)', fontSize: '0.85rem', fontStyle: 'italic' }}>Henüz malzeme eklemediniz.</p>
            ) : (
              malzemeler.map((malzeme, index) => (
                <div key={index} className="liste-oge-satir">
                  <span className="liste-oge-metin">{malzeme}</span>
                  <button type="button" onClick={() => malzemeSilHandler(index)} className="btn-sil-kucuk" title="Sil" disabled={yukleniyor}>
                    <Trash size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HAZIRLANIŞ ADIMLARI DİNAMİK ALANI */}
        <div className="form-grubu">
          <label>Hazırlanış Adımları *</label>
          <div className="liste-giris-alanı">
            <input
              type="text"
              placeholder="Örn: Yumurta ve şekeri köpürene kadar çırpın."
              value={yeniAdim}
              onChange={(e) => setYeniAdim(e.target.value)}
              disabled={yukleniyor}
            />
            <button type="button" onClick={adimEkleHandler} className="btn-ekle-kucuk" disabled={yukleniyor}>
              <Plus size={18} /> Ekle
            </button>
          </div>

          {/* Eklenen Adımların Listesi */}
          <div className="liste-ogeleri">
            {hazirlanis.length === 0 ? (
              <p style={{ color: 'var(--renk-yazi-ikincil)', fontSize: '0.85rem', fontStyle: 'italic' }}>Henüz hazırlanış adımı eklemediniz.</p>
            ) : (
              hazirlanis.map((adim, index) => (
                <div key={index} className="liste-oge-satir">
                  <span className="liste-oge-metin">
                    <strong>{index + 1}.</strong> {adim}
                  </span>
                  <button type="button" onClick={() => adimSilHandler(index)} className="btn-sil-kucuk" title="Sil" disabled={yukleniyor}>
                    <Trash size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kaydet Butonu */}
        <button type="submit" className="btn-ana" disabled={yukleniyor} style={{ marginTop: '2rem' }}>
          <Save size={18} /> {yukleniyor ? 'Kaydediliyor...' : 'Tarifi Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default TarifFormu;
