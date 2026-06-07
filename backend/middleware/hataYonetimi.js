// Uygulama içinde oluşabilecek tüm hataları yakalayıp düzgün bir JSON formatında istemciye gönderen middleware
const hataYakalayici = (hata, req, res, sonraki) => {
  console.error('Sistem Hatası Yakalandı:', hata.stack || hata.message);

  let durumKodu = res.statusCode === 200 ? 500 : res.statusCode;
  let mesaj = hata.message || 'Sunucuda bilinmeyen bir hata oluştu.';

  // MongoDB'de olmayan ID hatası (CastError)
  if (hata.name === 'CastError') {
    durumKodu = 400;
    mesaj = 'Geçersiz veri formatı (Örn: Yanlış ID formatı).';
  }

  // MongoDB'de benzersiz olması gereken bir alanın (Örn: eposta) tekrar kaydedilmeye çalışılması hatası (Duplicate Key)
  if (hata.code === 11000) {
    durumKodu = 400;
    // Hangi alanın çakıştığını bulup dinamik hata verme
    const alan = Object.keys(hata.keyValue)[0];
    mesaj = `Bu ${alan === 'eposta' ? 'e-posta adresi' : alan} zaten kullanımda. Lütfen başka bir değer giriniz.`;
  }

  // Mongoose doğrulama (validation) 
  if (hata.name === 'ValidationError') {
    durumKodu = 400;
    // Tüm doğrulama hatalarını birleştirip tek bir mesaj haline getirme
    mesaj = Object.values(hata.errors)
      .map((oge) => oge.message)
      .join(' | ');
  }

  // Yanıtı gönderme
  res.status(durumKodu).json({
    basarili: false,
    mesaj: mesaj,

    hataDetay: process.env.NODE_ENV === 'production' ? null : hata.stack
  });
};

export default hataYakalayici;
