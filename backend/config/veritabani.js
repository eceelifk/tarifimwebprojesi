import mongoose from 'mongoose';
import Kullanici from '../models/Kullanici.js';
import Tarif from '../models/Tarif.js';

// Verileri tohumlama (Seed Data) fonksiyonu
const verileriTohumla = async () => {
  try {
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
        resimUrl: 'https://images.unsplash.com/photo-1547592165-e1d17f8e07cb?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.8,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
      },
      {
        baslik: 'Kremalı Domates Çorbası',
        aciklama: 'Taze domatesler, fırınlanmış sarımsak ve kaşar peyniri rendesi ile sunulan nefis kıvamlı domates çorbası.',
        kategori: 'Çorba',
        malzemeler: [
          '5 adet olgun domates',
          '1 yemek kaşığı tereyağı',
          '2 yemek kaşığı un',
          '1 yemek kaşığı domates salçası',
          '1 çay bardağı süt veya sıvı krema',
          '4 su bardağı sıcak su',
          'Tuz, karabiber',
          'Servis için rendelenmiş kaşar peyniri'
        ],
        hazirlanis: [
          'Tencerede tereyağını eritip unu kokusu çıkana kadar kavurun.',
          'Salçayı ekleyip 1 dakika karıştırın, ardından rendelenmiş veya robottan geçirilmiş domatesleri ekleyin.',
          'Sıcak suyu ilave edip çorba kaynayana kadar karıştırarak pişirin.',
          'Çorba piştikten sonra blenderdan geçirin. Sütü yavaşça ekleyip karıştırın ve tuz/baharatını ekleyin.',
          'Kaşar peyniri rendesi ile sıcak servis yapın.'
        ],
        hazirlamaSuresi: 15,
        pisirmeSuresi: 20,
        kisiSayisi: 4,
        resimUrl: 'https://images.unsplash.com/photo-1547592165-e1d17f8e07cb?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.6,
        puanlar: [{ kullanici: sef._id, puan: 4 }]
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
        resimUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.9,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
      },
      {
        baslik: 'Sebzeli Tavuk Sote',
        aciklama: 'Renkli biberler ve mantarla sotelenmiş, lokum gibi yumuşacık tavuk göğsü.',
        kategori: 'Ana Yemek',
        malzemeler: [
          '500 gram tavuk göğsü',
          '1 adet kuru soğan',
          '1 adet kırmızı kapya biber',
          '2 adet yeşil biber',
          '200 gram mantar',
          '2 yemek kaşığı zeytinyağı',
          '1 yemek kaşığı domates salçası',
          'Tuz, karabiber, kekik, kırmızı toz biber'
        ],
        hazirlanis: [
          'Tavuk göğsünü küp küp doğrayın ve zeytinyağında suyunu salıp çekene kadar soteleyin.',
          'Doğranmış soğanları ekleyip tavuklarla birlikte kavurun.',
          'Sırasıyla biberleri ve mantarları ekleyip sotelemeye devam edin.',
          'Salçayı ve baharatları ekleyip yarım çay bardağı sıcak su ilave edin ve kapağını kapatıp sebzeler yumuşayana kadar pişirin.'
        ],
        hazirlamaSuresi: 15,
        pisirmeSuresi: 20,
        kisiSayisi: 4,
        resimUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.7,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
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
        puanlar: [{ kullanici: sef._id, puan: 4 }]
      },
      {
        baslik: 'Çikolatalı Islak Kek',
        aciklama: 'Bol çikolata soslu, içi nemli ve yumuşacık klasik ev yapımı ıslak kek.',
        kategori: 'Tatlı',
        malzemeler: [
          '3 adet yumurta',
          '1.5 su bardağı toz şeker',
          '1 su bardağı süt',
          '1 su bardağı sıvı yağ',
          '1 paket vanilya',
          '1 paket kabartma tozu',
          '3 yemek kaşığı kakao',
          '1.5 su bardağı un',
          'Sosu için: 1 su bardağı süt, yarım su bardağı şeker, yarım çay bardağı sıvı yağ, 2 yemek kaşığı kakao'
        ],
        hazirlanis: [
          'Yumurta ve şekeri köpürene kadar iyice çırpın.',
          'Süt, sıvı yağ, vanilya ve kakaoyu ekleyip çırpmaya devam edin.',
          'Elenmiş un ve kabartma tozunu spatula ile yavaşça karıştırarak harca yedirin.',
          'Yağlanmış borcama döküp 180 derece fırında 30-35 dakika pişirin.',
          'Kek pişerken sos malzemelerini sos tenceresinde bir taşım kaynatıp ılık hale getirin.',
          'Fırından çıkan sıcak keki dilimleyin ve ılık sosu üzerine gezdirip sosu çekmesini bekleyin.'
        ],
        hazirlamaSuresi: 15,
        pisirmeSuresi: 30,
        kisiSayisi: 10,
        resimUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.8,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
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
        puanlar: [{ kullanici: sef._id, puan: 5 }]
      },
      {
        baslik: 'Fırında Sebzeli Kinoa Mücveri',
        aciklama: 'Unsuz, yağsız fırında pişen ve bol protein içeren fit mücver tarifi.',
        kategori: 'Fit & Glutensiz',
        malzemeler: [
          '1 su bardağı haşlanmış kinoa',
          '2 adet orta boy kabak',
          '1 adet havuç',
          '2 adet yumurta',
          'Yarım demet taze dereotu',
          '100 gram lor peyniri',
          'Tuz, pul biber, karabiber'
        ],
        hazirlanis: [
          'Kabakları ve havucu ince rendeleyip sularını elinizle iyice sıkın.',
          'Derin bir kapta yumurtaları çırpın, ardından kinoa, rendelenmiş sebzeler, ince kıyılmış dereotu ve lor peynirini ekleyin.',
          'Baharatları ilave edip spatula ile iyice karıştırın.',
          'Yağlı kağıt serili fırın tepsisine kaşık yardımıyla yuvarlak porsiyonlar halinde dökün.',
          'Önceden ısıtılmış 180 derece fırında üzerleri altın sarısı olana kadar yaklaşık 25 dakika pişirin.'
        ],
        hazirlamaSuresi: 15,
        pisirmeSuresi: 25,
        kisiSayisi: 4,
        resimUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.9,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
      },
      {
        baslik: 'Yulaflı Muzlu Fit Kurabiye',
        aciklama: 'Şekersiz, unsuz, sadece 3 ana malzeme ile çay saatlerinizin vazgeçilmezi olacak sağlıklı kurabiyeler.',
        kategori: 'Fit & Glutensiz',
        malzemeler: [
          '2 adet olgun muz',
          '1 su bardağı yulaf ezmesi',
          '1 yemek kaşığı kakao',
          '1 yemek kaşığı süzme bal (isteğe bağlı)',
          '2 yemek kaşığı damla çikolata'
        ],
        hazirlanis: [
          'Muzları derin bir kasede çatal yardımıyla püre haline getirene kadar iyice ezin.',
          'Üzerine yulaf ezmesini ve kakaoyu ekleyip spatula ile kıvam alana kadar karıştırın.',
          'Son olarak damla çikolatayı ekleyip nazikçe karıştırın.',
          'Fırın tepsisine kaşıkla yuvarlak şekiller vererek aralıklı olarak dizin.',
          '180 derece önceden ısıtılmış fırında 15 dakika pişirip oda sıcaklığında soğumaya bırakın.'
        ],
        hazirlamaSuresi: 10,
        pisirmeSuresi: 15,
        kisiSayisi: 6,
        resimUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.8,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
      },
      {
        baslik: 'Fırında Baharatlı Tatlı Patates',
        aciklama: 'Biberiye ve zeytinyağı ile harmanlanmış, çıtır fırınlanmış fit tatlı patates dilimleri.',
        kategori: 'Fit & Glutensiz',
        malzemeler: [
          '2 adet orta boy tatlı patates',
          '2 yemek kaşığı sızma zeytinyağı',
          '1 çay kaşığı toz sarımsak',
          '1 tatlı kaşığı kurutulmuş biberiye',
          'Tuz, karabiber, tatlı toz biber'
        ],
        hazirlanis: [
          'Tatlı patatesleri güzelce yıkayıp kabuklarını soyun ve elma dilimi şeklinde doğrayın.',
          'Derin bir kapta zeytinyağı, sarımsak, biberiye ve baharatları karıştırın.',
          'Patates dilimlerini bu sosla iyice harmanlayın.',
          'Yağlı kağıt serili tepsiye üst üste gelmeyecek şekilde dizin.',
          'Önceden ısıtılmış 200 derece fırında dışı çıtırlaşana kadar yaklaşık 25-30 dakika pişirin.'
        ],
        hazirlamaSuresi: 10,
        pisirmeSuresi: 25,
        kisiSayisi: 3,
        resimUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.6,
        puanlar: [{ kullanici: sef._id, puan: 4 }]
      },
      {
        baslik: 'Köz Patlıcanlı Meze',
        aciklama: 'Sarımsaklı süzme yoğurt ve zeytinyağlı köz patlıcanın nefis birleşimi.',
        kategori: 'Diğer',
        malzemeler: [
          '3 adet kemer patlıcan',
          '1 su bardağı süzme yoğurt',
          '2 diş ezilmiş sarımsak',
          '2 yemek kaşığı sızma zeytinyağı',
          'Tuz',
          'Üzeri için: pul biber ve ceviz içi'
        ],
        hazirlanis: [
          'Patlıcanları birkaç yerinden delip fırında veya ocakta közleyin.',
          'Közlenen patlıcanların kabuklarını soyup bıçakla ince ince kıyın.',
          'Süzme yoğurt, sarımsak ve tuzu karıştırıp patlıcanları ekleyin.',
          'Servis tabağına alıp üzerine zeytinyağı gezdirin, pul biber ve ceviz ile süsleyin.'
        ],
        hazirlamaSuresi: 20,
        pisirmeSuresi: 15,
        kisiSayisi: 4,
        resimUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800',
        yazar: sef._id,
        ortalamaPuan: 4.7,
        puanlar: [{ kullanici: sef._id, puan: 5 }]
      }
    ];

    // Her tarif için veritabanını kontrol edip eksik olanları ekliyoruz / var olanları güncelliyoruz
    for (const tarif of hazirTarifler) {
      const mevcutTarif = await Tarif.findOne({ baslik: tarif.baslik });
      if (!mevcutTarif) {
        await Tarif.create(tarif);
        console.log(`Yeni hazır tarif eklendi: "${tarif.baslik}"`);
      } else {
        // Var olan tarifin resim linkini güncel ve çalışan linkle eşleştiriyoruz
        await Tarif.updateOne({ _id: mevcutTarif._id }, { $set: { resimUrl: tarif.resimUrl } });
      }
    }
    console.log('Örnek hazır yemek tarifleri başarıyla kontrol edildi ve tohumlandı!');
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
