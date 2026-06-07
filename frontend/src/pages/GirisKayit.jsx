import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import { LogIn, UserPlus } from 'lucide-react';
import Bildirim from '../components/Bildirim';

const GirisKayit = ({ tip = 'giris' }) => {
  const { giris, kullanici } = useContext(OturumBaglami);
  const navigate = useNavigate();

  // Form State'leri
  const [isim, setIsim] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [profilResmi, setProfilResmi] = useState('');

  // Yardımcı State'ler
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const resimYukleHandler = (e) => {
    const dosya = e.target.files[0];
    if (dosya) {
      if (dosya.size > 2 * 1024 * 1024) {
        setHata('Profil resmi boyutu 2MB\'dan küçük olmalıdır.');
        return;
      }
      const okuyucu = new FileReader();
      okuyucu.onloadend = () => {
        setProfilResmi(okuyucu.result);
      };
      okuyucu.readAsDataURL(dosya);
    }
  };
  const [bildirim, setBildirim] = useState({ acik: false, mesaj: '', tip: 'basari' });

  // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (kullanici) {
      navigate('/');
    }
  }, [kullanici, navigate]);

  // Sayfa modu değiştikçe hataları temizle
  useEffect(() => {
    setHata('');
  }, [tip]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setHata('');

    // İstemci Tarafı Validasyonları (Form Doğrulama)
    if (tip === 'kayit') {
      if (!isim.trim() || !eposta.trim() || !sifre.trim()) {
        setHata('Lütfen tüm alanları doldurunuz.');
        return;
      }
      if (sifre.length < 6) {
        setHata('Şifreniz en az 6 karakter olmalıdır.');
        return;
      }
      if (sifre !== sifreTekrar) {
        setHata('Şifreler uyuşmuyor.');
        return;
      }
    } else {
      if (!eposta.trim() || !sifre.trim()) {
        setHata('Lütfen e-posta ve şifrenizi giriniz.');
        return;
      }
    }

    try {
      setYukleniyor(true);
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/kullanici/${tip === 'kayit' ? 'kayit' : 'giris'}`;
      
      const istekGovdesi = tip === 'kayit' 
        ? { isim: isim.trim(), eposta: eposta.trim(), sifre, profilResmi }
        : { eposta: eposta.trim(), sifre };

      const yanit = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(istekGovdesi)
      });

      const veri = await yanit.json();

      if (veri.basarili) {
        // Oturum context'ini doldur ve ana sayfaya yönlendir
        giris(veri.kullanici, veri.token);
        navigate('/');
      } else {
        setHata(veri.mesaj || 'Giriş/Kayıt sırasında bir hata oluştu.');
      }
    } catch (hata) {
      setHata('Sunucuyla bağlantı kurulamadı. Lütfen sunucunun açık olduğunu kontrol edin.');
    } finally {
      setYukleniyor(false);
    }
  };

  const bildirimKapat = () => setBildirim({ ...bildirim, acik: false });

  return (
    <div className="oturum-sayfasi-konteyner">
      <div className="oturum-karti">
        <h2 className="oturum-baslik">
          {tip === 'kayit' ? 'Yemek Dünyasına Katıl' : 'Hoş Geldiniz'}
        </h2>
        <p className="oturum-alt-baslik">
          {tip === 'kayit' 
            ? 'Yeni tarifler keşfetmek ve paylaşmak için hemen üye olun.' 
            : 'Enfes tarifleri favorilerinize eklemek ve puanlamak için giriş yapın.'
          }
        </p>

        {hata && (
          <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '0.8rem', borderRadius: 'var(--yarıcap-buton)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {hata}
          </div>
        )}

        <form onSubmit={formSubmitHandler}>
          {/* Kayıt Modunda İsim Alanı */}
          {tip === 'kayit' && (
            <div className="form-grubu">
              <label htmlFor="isim">Ad Soyad</label>
              <input
                type="text"
                id="isim"
                placeholder="Örn: Ahmet Yılmaz"
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
                disabled={yukleniyor}
              />
            </div>
          )}

          {/* E-posta Alanı */}
          <div className="form-grubu">
            <label htmlFor="eposta">E-posta Adresi</label>
            <input
              type="email"
              id="eposta"
              placeholder="Örn: ahmet@gmail.com"
              value={eposta}
              onChange={(e) => setEposta(e.target.value)}
              disabled={yukleniyor}
            />
          </div>

          {/* Şifre Alanı */}
          <div className="form-grubu">
            <label htmlFor="sifre">Şifre</label>
            <input
              type="password"
              id="sifre"
              placeholder="••••••"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              disabled={yukleniyor}
            />
          </div>

          {/* Kayıt Modunda Şifre Tekrar Alanı */}
          {tip === 'kayit' && (
            <div className="form-grubu">
              <label htmlFor="sifreTekrar">Şifre Tekrar</label>
              <input
                type="password"
                id="sifreTekrar"
                placeholder="••••••"
                value={sifreTekrar}
                onChange={(e) => setSifreTekrar(e.target.value)}
                disabled={yukleniyor}
              />
            </div>
          )}

          {/* Kayıt Modunda Profil Fotoğrafı Yükleme */}
          {tip === 'kayit' && (
            <div className="form-grubu">
              <label htmlFor="profilResmi">Profil Fotoğrafı Seç</label>
              <input
                type="file"
                id="profilResmi"
                accept="image/*"
                onChange={resimYukleHandler}
                disabled={yukleniyor}
              />
              {profilResmi && (
                <div style={{ marginTop: '0.8rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--renk-yazi-ikincil)', marginBottom: '0.4rem' }}>Önizleme:</p>
                  <img 
                    src={profilResmi} 
                    alt="Önizleme" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--renk-birincil)', margin: '0 auto' }} 
                  />
                </div>
              )}
            </div>
          )}

          {/* Gönder Butonu */}
          <button type="submit" className="btn-ana" disabled={yukleniyor}>
            {tip === 'kayit' ? (
              <>
                <UserPlus size={18} /> {yukleniyor ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </>
            ) : (
              <>
                <LogIn size={18} /> {yukleniyor ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </>
            )}
          </button>
        </form>

        {/* Alt Bilgi ve Yönlendirme Linki */}
        <div className="oturum-link-alani">
          {tip === 'kayit' ? (
            <p>
              Zaten hesabınız var mı?{' '}
              <Link to="/giris" className="oturum-link">
                Giriş Yapın
              </Link>
            </p>
          ) : (
            <p>
              Hesabınız yok mu?{' '}
              <Link to="/kayit" className="oturum-link">
                Kayıt Olun
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Bildirim Toast */}
      {bildirim.acik && (
        <Bildirim mesaj={bildirim.mesaj} tip={bildirim.tip} onClose={bildirimKapat} />
      )}
    </div>
  );
};

export default GirisKayit;
