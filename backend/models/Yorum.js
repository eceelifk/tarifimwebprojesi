import mongoose from 'mongoose';


const YorumSema = new mongoose.Schema(
  {
    tarif: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tarif', // Yorumun yapıldığı tarif 
      required: [true, 'Yorumun hangi tarife yapıldığı belirtilmelidir.']
    },
    yazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici', // Yorumu yapan kullanıcı 
      required: [true, 'Yorumun yazarı belirtilmelidir.']
    },
    icerik: {
      type: String,
      required: [true, 'Yorum içeriği boş olamaz.'],
      trim: true,
      minlength: [2, 'Yorumunuz çok kısa. En az 2 karakter olmalıdır.']
    }
  },
  {
    timestamps: true // Oluşturulma tarihi icin
  }
);

const Yorum = mongoose.model('Yorum', YorumSema);
export default Yorum;
