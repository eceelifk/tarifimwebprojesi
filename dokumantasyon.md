# UML ve Tasarım Dokümantasyonu - "tarifim"

Bu dosya projenin Use-Case, Activity, ER (Veritabanı) ve Bileşen İlişkileri diyagramlarını içerir. Diyagramlar görsel olarak render edilebilmesi için Mermaid formatında hazırlanmıştır.

---

## 1. Use-Case (Kullanım Senaryosu) Diyagramı

Use-Case diyagramı, sisteme erişen kullanıcı türlerini (Misafir ve Giriş Yapmış Kullanıcı) ve yapabilecekleri temel eylemleri gösterir.

```mermaid
left-to-right-direction
actor "Misafir Kullanıcı" as Misafir
actor "Giriş Yapmış Kullanıcı" as Uye

rectangle "Tarifim Sistemi" {
  usecase "Tarifleri Listele / Ara" as UC_Listele
  usecase "Tarif Detayını Oku" as UC_Detay
  usecase "Yorumları Oku" as UC_YorumOku
  usecase "Kayıt Ol / Giriş Yap" as UC_Giris
  
  usecase "Tarif Paylaş (Ekle)" as UC_TarifEkle
  usecase "Kendi Tarifini Güncelle / Sil" as UC_TarifDuzenle
  usecase "Tarife Puan Ver (1-5 Yıldız)" as UC_PuanVer
  usecase "Tarife Yorum Ekle / Kendi Yorumunu Sil" as UC_YorumEkle
  usecase "Tarifi Favorilere Ekle / Çıkar" as UC_Favori
  usecase "Kendi Profilini Görüntüle" as UC_Profil
}

Misafir --> UC_Listele
Misafir --> UC_Detay
Misafir --> UC_YorumOku
Misafir --> UC_Giris

Uye --> UC_Listele
Uye --> UC_Detay
Uye --> UC_YorumOku
Uye --> UC_TarifEkle
Uye --> UC_TarifDuzenle
Uye --> UC_PuanVer
Uye --> UC_YorumEkle
Uye --> UC_Favori
Uye --> UC_Profil
```

---

## 2. Activity (Aktivite) Diyagramı

Aşağıdaki aktivite diyagramı, bir kullanıcının sisteme yeni bir tarif ekleme sürecindeki iş akışını (validasyonlar ve sunucu doğrulaması dahil) gösterir.

```mermaid
stateDiagram-v2
    [*] --> TarifEkleTikla : Kullanıcı 'Tarif Ekle' butonuna basar
    
    state GirişKontrolü <<choice>>
    TarifEkleTikla --> GirişKontrolü : Giriş durumu kontrol edilir
    
    GirişKontrolü --> GirişSayfasıYönlendir : Giriş Yapılmamış
    GirişSayfasıYönlendir --> GirişYap : Kullanıcı giriş yapar
    GirişYap --> FormuGörüntüle
    
    GirişKontrolü --> FormuGörüntüle : Giriş Yapılmış
    
    FormuGörüntüle --> BilgileriDoldur : Kullanıcı form alanlarını doldurur
    BilgileriDoldur --> KaydetButonu : 'Tarif Kaydet' butonuna basar
    
    state İstemciValidasyonu <<choice>>
    KaydetButonu --> İstemciValidasyonu : Bilgiler doğrulanır (Ad, Malzemeler, Adımlar vb.)
    
    İstemciValidasyonu --> HataGöster : Eksik veya Hatalı Veri var
    HataGöster --> BilgileriDoldur : Formu düzelt
    
    İstemciValidasyonu --> API_Istegi : Veriler geçerli
    
    state SunucuYanıtı <<choice>>
    API_Istegi --> SunucuYanıtı : API isteği backend'e gider ve işlenir
    
    SunucuYanıtı --> VeritabanıHata : DB Kayıt başarısız (500/400)
    VeritabanıHata --> HataGöster
    
    SunucuYanıtı --> BasariliKayit : DB Kayıt başarılı (201 Created)
    BasariliKayit --> DetaySayfasıYönlendir : Kullanıcı yeni tarifin detay sayfasına aktarılır
    DetaySayfasıYönlendir --> BaşarıMesajı : Toast bildirim gösterilir ("Tarif başarıyla paylaşıldı")
    
    BaşarıMesajı --> [*]
```

---

## 3. ER (Entity-Relationship) Diyagramı

ER diyagramı veritabanımızdaki 3 ana tablonun (Kullanici, Tarif, Yorum) yapısını ve aralarındaki ilişkileri gösterir.

```mermaid
erDiagram
    Kullanici ||--o{ Tarif : "paylasir (1-N)"
    Kullanici ||--o{ Yorum : "yazar (1-N)"
    Tarif ||--o{ Yorum : "sahiptir (1-N)"
    Kullanici }o--o{ Tarif : "favorilere_ekler (N-N)"

    Kullanici {
        ObjectId _id PK
        String isim "Zorunlu"
        String eposta "Benzersiz, Zorunlu"
        String sifre "Zorunlu (Şifreli)"
        String rol "kullanici / admin"
        String profilResmi "Varsayılan URL"
        ObjectIdArray favoriler FK "Tarif Referansları"
        Date createdAt
    }

    Tarif {
        ObjectId _id PK
        String baslik "Zorunlu"
        String aciklama "Zorunlu"
        String kategori "Çorba/Ana Yemek/Tatlı/Fit/Diğer"
        StringArray malzemeler "Zorunlu Dizi"
        StringArray hazirlanis "Zorunlu Dizi"
        Number hazirlamaSuresi "Dakika"
        Number pisirmeSuresi "Dakika"
        Number kisiSayisi "Kişi sayısı"
        String resimUrl "Görsel adresi"
        ObjectId yazar FK "Kullanici Referansı, Zorunlu"
        ObjectArray puanlar "kullaniciId ve puan (1-5) dizisi"
        Number ortalamaPuan "Hesaplanan ortalama"
        Date createdAt
    }

    Yorum {
        ObjectId _id PK
        ObjectId tarif FK "Tarif Referansı, Zorunlu"
        ObjectId yazar FK "Kullanici Referansı, Zorunlu"
        String icerik "Zorunlu metin"
        Date createdAt
    }
```

---

## 4. Bileşen (Component) İlişkileri Diyagramı

React frontend mimarimizin bileşen yapısını, durum yönetimini (Context) ve sayfaların hiyerarşisini gösterir.

```mermaid
graph TD
    subgraph Context
        OB[OturumBaglami - AuthContext]
    end

    App[App.jsx - BrowserRouter] --> OB
    OB --> Navbar[Navbar.jsx]
    OB --> Footer[Footer.jsx]
    OB --> Routes[Routes Sayfalar]
    
    subgraph Sayfalar
        Routes --> AnaSayfa[AnaSayfa.jsx]
        Routes --> TarifDetay[TarifDetay.jsx]
        Routes --> GirisKayit[GirisKayit.jsx]
        Routes --> Profil[Profil.jsx]
        Routes --> TarifEkleDuzenle[TarifEkleDuzenle.jsx]
    end

    subgraph Bileşenler
        AnaSayfa --> TK1[TarifKarti.jsx]
        Profil --> TK2[TarifKarti.jsx]
        
        TarifDetay --> YA[YorumAlani.jsx]
        TarifDetay --> Modal[Modal.jsx - Silme Onayı]
        
        TarifEkleDuzenle --> TF[TarifFormu.jsx]
    end

    subgraph Ortak Arayüz Parçaları
        AnaSayfa -.-> YB[YuklenmeBelirteci.jsx]
        TarifDetay -.-> YB
        Profil -.-> YB
        TarifEkleDuzenle -.-> YB
        
        App -.-> Toast[Bildirim.jsx - Toast mesaj]
        AnaSayfa -.-> Toast
        TarifDetay -.-> Toast
    end

    classDef contextStyle fill:#e6f4ea,stroke:#137333,stroke-width:2px;
    classDef pageStyle fill:#fef7e0,stroke:#b06000,stroke-width:2px;
    classDef componentStyle fill:#e8f0fe,stroke:#1a73e8,stroke-width:2px;
    
    class OB contextStyle;
    class AnaSayfa,TarifDetay,GirisKayit,Profil,TarifEkleDuzenle pageStyle;
    class Navbar,Footer,TK1,TK2,YA,Modal,TF,YB,Toast componentStyle;
```
