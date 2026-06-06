import mongoose from 'mongoose';
import Kullanici from '../models/Kullanici.js';
import Tarif from '../models/Tarif.js';

// Verileri tohumlama (Seed Data) fonksiyonu
const verileriTohumla = async () => {
  try {
    const tarifSayisi = await Tarif.countDocuments();
    if (tarifSayisi > 0) {
      // Zaten tarifler varsa, eski/çalışmayan resim adreslerini güncelliyoruz
      await Tarif.updateOne(
        { baslik: 'Geleneksel Mercimek Çorbası' },
        { $set: { resimUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800' } }
      );
      await Tarif.updateOne(
        { baslik: 'Fırında Anne Köftesi ve Patates' },
        { $set: { resimUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800' } }
      );
      await Tarif.updateOne(
        { baslik: 'San Sebastian Cheesecake' },
        { $set: { resimUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800' } }
      );
      await Tarif.updateOne(
        { baslik: 'Glutensiz Avokadolu Fit Salata' },
        { $set: { resimUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' } }
      );
      console.log('Mevcut hazır tarif görselleri güncel çalışan linklerle güncellendi.');
      return;
    }

    console.log('Veritabanı boş. Hazır tarifler ve varsayılan örnek Şef kullanıcısı oluşturuluyor...');

    // Örnek bir Şef kullanıcısı oluştur (Tariflerin yazarı olması için)
    let sef = await Kullanici.findOne({ eposta: 'sef@tarifim.com' });
    if (!sef) {
      sef = await Kullanici.create({
        isim: 'Sistem Şefi',
        eposta: 'sef@tarifim.com',
        sifre: '123456',
        rol: 'admin',
        profilResmi: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150'
      });
    }

    // Hazır tarifleri tanımla (Çalışan, yüksek kaliteli görsel adresleriyle)
    const hazirTarifler = [
      {
        baslik: 'Geleneksel Mercimek Çorbası',
        aciklama: 'Kış aylarının vazgeçilmezi, limon eşliğinde sunulan sıcacık kıvamlı mercimek çorbası.',
        kategori: 'Çorba',
        malzemeler: [
          '1 su bardağı kırmızı mercimek',
          '1 adet kuru soğan',
          '1 adet havuç',
          '1 adet patates',
          '1 yemek kaşığı tereyağı',
          '1 yemek kaşığı un',
          '6 su bardağı sıcak su',
          'Tuz, karabiber, kimyon'
        ],
        hazirlanis: [
          'Soğanı yemeklik doğrayıp tencerede tereyağı ile pembeleşene kadar kavurun.',
          'Unu ekleyip kokusu çıkana kadar 1-2 dakika daha kavurun.',
          'Küp doğranmış patates, havuç ve yıkanmış mercimeği ekleyin.',
          'Sıcak suyu ekleyip sebzeler yumuşayana kadar pişmeye bırakın.',
          'Pişen çorbayı pürüzsüz olana kadar blenderdan geçirin. Tuz ve baharatlarını ekleyip bir taşım kaynatın ve sıcak servis yapın.'
        ],
        hazirlamaSuresi: 10,
        pisirmeSuresi: 25,
        kisiSayisi: 4,
        resimUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.8,
        puanlar: [
          { kullanici: sef._id, puan: 5 }
        ]
      },
      {
        baslik: 'Fırında Anne Köftesi ve Patates',
        aciklama: 'Fırında hafifçe pişen, tam kıvamında yumuşacık patatesli anne köftesi.',
        kategori: 'Ana Yemek',
        malzemeler: [
          '500 gram orta yağlı kıyma',
          '1 adet rendelenmiş kuru soğan',
          '1 çay bardağı galeta unu',
          '1 adet yumurta',
          'Yarım demet ince kıyılmış maydanoz',
          '4 adet orta boy patates',
          '1 yemek kaşığı domates salçası',
          'Tuz, kimyon, karabiber, kekik'
        ],
        hazirlanis: [
          'Kıyma, soğan, galeta unu, yumurta, maydanoz ve baharatları derin bir kapta 10 dakika yoğurun ve şekillendirip köfteleri hazırlayın.',
          'Patatesleri elma dilimi şeklinde doğrayın.',
          'Fırın tepsisine köfteleri ve patatesleri dizin.',
          'Salçayı sıcak suda açıp sos haline getirin ve tepsiye dökün.',
          'Önceden ısıtılmış 200 derece fırında üzerleri kızarana kadar yaklaşık 35 dakika pişirin.'
        ],
        hazirlamaSuresi: 20,
        pisirmeSuresi: 35,
        kisiSayisi: 5,
        resimUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.9,
        puanlar: [
          { kullanici: sef._id, puan: 5 }
        ]
      },
      {
        baslik: 'San Sebastian Cheesecake',
        aciklama: 'Dışı karamelize olmuş, içi ise yumuşacık ve akışkan kıvamıyla meşhur cheesecake.',
        kategori: 'Tatlı',
        malzemeler: [
          '600 gram labne peyniri',
          '400 gram taze krema',
          '4 adet yumurta',
          '1.5 su bardağı toz şeker',
          '2 yemek kaşığı un',
          '1 paket vanilya'
        ],
        hazirlanis: [
          'Labne peyniri ve toz şekeri derin bir kapta şeker tamamen eriyene kadar mikserle çırpın.',
          'Kremayı ekleyip karıştırmaya devam edin.',
          'Yumurtaları teker teker ekleyin, her yumurtadan sonra kısa süre çırpın.',
          'Elekten geçirilmiş un ve vanilyayı ekleyip spatula ile pürüzsüz olana kadar karıştırın.',
          'Kalıba yağlı kağıt serip harcı dökün ve 210 derece fırında üzeri koyu kahverengi olana kadar 25-30 dakika pişirin. Oda sıcaklığında soğuttuktan sonra servis yapın.'
        ],
        hazirlamaSuresi: 15,
        pisirmeSuresi: 30,
        kisiSayisi: 8,
        resimUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.7,
        puanlar: [
          { kullanici: sef._id, puan: 4 }
        ]
      },
      {
        baslik: 'Glutensiz Avokadolu Fit Salata',
        aciklama: 'Hem doyurucu hem de çok sağlıklı, avokado ve cevizle zenginleştirilmiş fit salata.',
        kategori: 'Fit & Glutensiz',
        malzemeler: [
          '1 adet olgun avokado',
          '1 demet taze roka ve marul',
          '1 çay bardağı haşlanmış kinoa veya karabuğday',
          '5-6 adet ceviz içi',
          '1 yemek kaşığı sızma zeytinyağı',
          'Yarım limonun suyu',
          'Tuz'
        ],
        hazirlanis: [
          'Yeşillikleri güzelce yıkayıp süzdükten sonra iri parçalar halinde doğrayın.',
          'Avokadoyu küp küp doğrayıp yeşilliklerin üzerine ekleyin.',
          'Haşlanmış kinoayı ve kırılmış ceviz içlerini ilave edin.',
          'Zeytinyağı, limon suyu ve tuzu küçük bir kasede çırpıp salatanın üzerine gezdirin, nazikçe karıştırıp servis edin.'
        ],
        hazirlamaSuresi: 10,
        pisirmeSuresi: 0,
        kisiSayisi: 2,
        resimUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        yazar: sef._id,
        ortalamaPuan: 5.0,
        puanlar: [
          { kullanici: sef._id, puan: 5 }
        ]
      }
    ];

    await Tarif.insertMany(hazirTarifler);
    console.log('Örnek hazır yemek tarifleri başarıyla veritabanına yüklendi!');
  } catch (hata) {
    console.error('Hazır tarif yükleme hatası:', hata.message);
  }
};

// MongoDB veritabanına bağlanmak için bir fonksiyon oluşturuyoruz
const veritabaninaBaglan = async () => {
  try {
    const baglantiAdresi = process.env.MONGODB_URI;
    const baglanti = await mongoose.connect(baglantiAdresi);
    
    console.log(`\n=========================================`);
    console.log(`MongoDB Bağlantısı Başarılı! \nSunucu: ${baglanti.connection.host}`);
    console.log(`Veritabanı: ${baglanti.connection.name}`);
    console.log(`=========================================\n`);

    // Tohumlama fonksiyonunu çalıştırıyoruz
    await verileriTohumla();
  } catch (hata) {
    console.error(`MongoDB Bağlantı Hatası: ${hata.message}`);
    process.exit(1);
  }
};

export default veritabaninaBaglan;
