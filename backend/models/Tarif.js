import mongoose from 'mongoose';

// Yemek Tarifinin şablonu 
const TarifSema = new mongoose.Schema(
  {
    baslik: {
      type: String,
      required: [true, 'Lütfen tarif başlığını yazınız.'],
      trim: true
    },
    aciklama: {
      type: String,
      required: [true, 'Lütfen tarif hakkında kısa bir açıklama yazınız.']
    },
    kategori: {
      type: String,
      required: [true, 'Lütfen tarif kategorisini seçiniz.'],
      enum: {
        values: ['Çorba', 'Ana Yemek', 'Tatlı', 'Fit & Glutensiz', 'Diğer'],
        message: 'Lütfen geçerli bir kategori seçiniz.'
      },
      default: 'Diğer'
    },
    malzemeler: {
      type: [String], //  ["2 adet yumurta", "1 bardak un"])
      required: [true, 'Lütfen tarif malzemelerini ekleyiniz.'],
      validate: {
        validator: function (deger) {
          return deger.length > 0;
        },
        message: 'Tarifte en az 1 malzeme olmalıdır.'
      }
    },
    hazirlanis: {
      type: [String], // ["Malzemeleri karıştırın", "Fırına verin"])
      required: [true, 'Lütfen tarifin hazırlanış adımlarını yazınız.'],
      validate: {
        validator: function (deger) {
          return deger.length > 0;
        },
        message: 'Tarifte en az 1 hazırlanış adımı olmalıdır.'
      }
    },
    hazirlamaSuresi: {
      type: Number, // Dakika bazında
      required: [true, 'Lütfen hazırlama süresini dakika olarak yazınız.'],
      min: [0, 'Süre 0\'dan küçük olamaz.']
    },
    pisirmeSuresi: {
      type: Number, // Dakika bazında
      required: [true, 'Lütfen pişirme süresini dakika olarak yazınız.'],
      min: [0, 'Süre 0\'dan küçük olamaz.']
    },
    kisiSayisi: {
      type: Number, 
      required: [true, 'Lütfen yemeğin kaç kişilik olduğunu yazınız.'],
      min: [1, 'En az 1 kişilik olmalıdır.']
    },
    resimUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800' // Varsayılan güzel bir yemek resmi
    },
    yazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici',
      required: true
    },
    puanlar: [
      {
        kullanici: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Kullanici',
          required: true
        },
        puan: {
          type: Number,
          required: true,
          min: [1, 'Puan en az 1 olabilir.'],
          max: [5, 'Puan en fazla 5 olabilir.']
        }
      }
    ],
    ortalamaPuan: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // Oluşturulma ve güncellenme tarihlerini tutar
  }
);

// Tarifin ortalama puanını puanlar güncellendikçe hesaplayan fonk
TarifSema.methods.ortalamaPuanHesapla = function () {
  if (this.puanlar.length === 0) {
    this.ortalamaPuan = 0;
    return 0;
  }
  
  const toplamPuan = this.puanlar.reduce((toplam, oge) => toplam + oge.puan, 0);
  this.ortalamaPuan = Math.round((toplamPuan / this.puanlar.length) * 10) / 10; // Virgülden sonra tek hane (Örn: 4.3)
  return this.ortalamaPuan;
};

const Tarif = mongoose.model('Tarif', TarifSema);
export default Tarif;
