// Uygulama içinde oluşabilecek tüm hataları yakalayıp düzgün bir JSON formatında istemciye gönderen middleware
const hataYakalayici = (hata, req, res, sonraki) => {
  console.error('Sistem Hatası Yakalandı:', hata.stack || hata.message);

  let durumKodu = res.statusCode === 200 ? 500 : res.statusCode;
  let mesaj = hata.message || 'Sunucuda bilinmeyen bir hata oluştu.';

  // MongoDB'de bulunamayan ID hatası (CastError)
  if (hata.name === 'CastError') {
    durumKodu = 400;
    mesaj = 'Geçersiz veri formatı (Örn: Yanlış ID formatı).';
  }

  // MongoDB'de benzersiz olması gereken bir alanın (Örn: eposta) tekrar kaydedilmeye çalışılması hatası (Duplicate Key)
  if (hata.code === 11000) {
    durumKodu = 400;
    // Hangi alanın çakıştığını bulup dinamik hata veriyoruz
    const alan = Object.keys(hata.keyValue)[0];
    mesaj = `Bu ${alan === 'eposta' ? 'e-posta adresi' : alan} zaten kullanımda. Lütfen başka bir değer giriniz.`;
  }

  // Mongoose doğrulama (validation) hataları (Örn: Şifrenin 6 karakterden kısa olması veya boş bırakılan alanlar)
  if (hata.name === 'ValidationError') {
    durumKodu = 400;
    // Tüm doğrulama hatalarını birleştirip tek bir mesaj haline getiriyoruz
    mesaj = Object.values(hata.errors)
      .map((oge) => oge.message)
      .join(' | ');
  }

  // Yanıtı gönderiyoruz
  res.status(durumKodu).json({
    basarili: false,
    mesaj: mesaj,
    // Geliştirme ortamındaysak hatanın detayını da (stack trace) gönderelim ki hatayı bulmak kolay olsun
    hataDetay: process.env.NODE_ENV === 'production' ? null : hata.stack
  });
};

export default hataYakalayici;
