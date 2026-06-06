import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Kullanıcı bilgilerini belirlediğimiz şablon (Schema)
const KullaniciSema = new mongoose.Schema(
  {
    isim: {
      type: String,
      required: [true, 'Lütfen adınızı yazınız.'],
      trim: true // Başındaki ve sonundaki boşlukları temizler
    },
    eposta: {
      type: String,
      required: [true, 'Lütfen e-posta adresinizi yazınız.'],
      unique: true, // Aynı e-posta ile sadece 1 kişi kaydolabilir
      lowercase: true, // E-postayı küçük harfe çevirir
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Lütfen geçerli bir e-posta adresi yazınız.'
      ]
    },
    sifre: {
      type: String,
      required: [true, 'Lütfen bir şifre yazınız.'],
      minlength: [6, 'Şifreniz en az 6 karakter olmalıdır.']
    },
    rol: {
      type: String,
      enum: ['kullanici', 'admin'],
      default: 'kullanici' // Standart olarak herkes 'kullanici' olarak kaydolur
    },
    profilResmi: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' // Varsayılan profil resmi URL'si
    },
    favoriler: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarif' // Kullanıcının beğendiği tarifleri Tarif modeline bağladık (Modeller arası ilişki)
      }
    ]
  },
  {
    timestamps: true // Oluşturulma (createdAt) ve Güncellenme (updatedAt) tarihlerini otomatik ekler
  }
);

// Şifreyi veritabanına kaydetmeden ÖNCE otomatik olarak şifreliyoruz (hash)
// Bu Mongoose ara yazılımı (middleware) veritabanına kayıt yapılmadan hemen önce çalışır
KullaniciSema.pre('save', async function (sonraki) {
  // Eğer şifre alanı değiştirilmediyse şifreleme yapmadan geç
  if (!this.isModified('sifre')) {
    return sonraki();
  }

  try {
    // Şifreyi karıştırmak için tuz (salt) üretiyoruz
    const tuz = await bcrypt.genSalt(10);
    // Şifreyi tuz kullanarak karıştırıyoruz (şifreliyoruz)
    this.sifre = await bcrypt.hash(this.sifre, tuz);
    sonraki();
  } catch (hata) {
    sonraki(hata);
  }
});

// Giriş yaparken kullanıcının yazdığı şifre ile veritabanındaki şifreli şifreyi karşılaştıran fonksiyonumuz
KullaniciSema.methods.sifreKarsilastir = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

const Kullanici = mongoose.model('Kullanici', KullaniciSema);
export default Kullanici;
