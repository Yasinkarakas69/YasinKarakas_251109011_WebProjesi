var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');

var app = express();
var PORT = 3000;
//  express-session özelliğini kullandım
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'gedik_food_gizli_anahtar',
    resave: false,
    saveUninitialized: false
}));
// Veritabanı bağlantısını burada kuruyoruz projeyi test edebilmek için
mongoose.connect('mongodb://127.0.0.1:27017/gedik_food_db')
  .then(() => console.log("Veritabanına başarıyla bağlanıldı!"))
  .catch(err => console.log("Veritabanı hatası:", err));

/* Kullandığımız modeller bu kısımdadır */
var KullaniciSchema = new mongoose.Schema({
    kullaniciAdi: { type: String, required: true },
    sifre: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});
// Öğrenci numarama göre gruplandırmayı yaptım 
var Kullanici = mongoose.model('Kullanici', KullaniciSchema, '251109011_kullanicilar');

var YemekSchema = new mongoose.Schema({
    isim: String,
    icerik: String,
    fiyat: Number,
    gorselUrl: String,
    kategori: String 
});
var Yemek = mongoose.model('Yemek', YemekSchema, '251109011_yemekler');

var SiparisSchema = new mongoose.Schema({
    musteriAdi: { type: String, required: true },
    anaYemek: { type: mongoose.Schema.Types.ObjectId, ref: 'Yemek' }, 
    tatli: { type: mongoose.Schema.Types.ObjectId, ref: 'Yemek' },    
    icecek: { type: mongoose.Schema.Types.ObjectId, ref: 'Yemek' },   
    porsiyon: { type: String, required: true },
    tarih: { type: Date, default: Date.now }
});
var Siparis = mongoose.model('Siparis', SiparisSchema, '251109011_siparisler');

/* REST API kontrolü burada yapılıyor */
function yetkiKontrolu(req, res, next) {
    if (req.session.kullanici && req.session.kullanici.isAdmin) {
        next();
    } else {
        res.status(403).json({ mesaj: "Hata: Bu sayfayı görmeye yetkiniz yok!" });
    }
}

// (POST, GET, PUT, DELETE) kısımları buradadır 
app.get('/api/251109011/yemekler', async (req, res) => {
    try {
        var yemekler = await Yemek.find();
        res.json(yemekler);
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});
// Admin panelindeki formdan gelen verileri burada POST isteğiyle alıp veritabanına kaydediyoruz
app.post('/api/251109011/yemekler', yetkiKontrolu, async (req, res) => {
    try {
        var yeniYemek = new Yemek({
            isim: req.body.isim,
            icerik: req.body.icerik,
            fiyat: req.body.fiyat,
            gorselUrl: req.body.gorselUrl,
            kategori: req.body.kategori
        });
        await yeniYemek.save();
        res.status(201).json({ mesaj: "Yemek başarıyla eklendi!" });
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

app.put('/api/251109011/yemekler/:id', yetkiKontrolu, async (req, res) => {
    try {
        await Yemek.findByIdAndUpdate(req.params.id, {
            isim: req.body.isim,
            icerik: req.body.icerik,
            fiyat: req.body.fiyat,
            gorselUrl: req.body.gorselUrl,
            kategori: req.body.kategori
        });
        res.json({ mesaj: "Yemek başarıyla güncellendi!" });
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

app.delete('/api/251109011/yemekler/:id', yetkiKontrolu, async (req, res) => {
    try {
        await Yemek.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Yemek başarıyla silindi!" });
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

// Siparişlerin API kısımları buradadır
app.post('/api/251109011/siparisler', async (req, res) => {
    try {
        var yeniSiparis = new Siparis({
            musteriAdi: req.body.musteriAdi,
            anaYemek: req.body.anaYemek || null,
            tatli: req.body.tatli || null,
            icecek: req.body.icecek || null,
            porsiyon: req.body.porsiyon
        });
        await yeniSiparis.save();
        res.status(201).json({ basarili: true, mesaj: "Siparişiniz başarıyla alındı!" });
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

app.get('/api/251109011/admin/siparisler', yetkiKontrolu, async (req, res) => {
    try {
        var siparisler = await Siparis.find()
            .populate('anaYemek')
            .populate('tatli')
            .populate('icecek');
        res.json(siparisler);
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

// Kullanıcı girişi kısmı buradadır
app.post('/api/251109011/giris', async (req, res) => {
    var kullaniciAdi = req.body.kullaniciAdi;
    var sifre = req.body.sifre;
    var user = await Kullanici.findOne({ kullaniciAdi: kullaniciAdi, sifre: sifre });
    
    if (user) {
        req.session.kullanici = user;
        res.json({ basarili: true, isAdmin: user.isAdmin, mesaj: "Giriş başarılı" });
    } else {
        res.status(401).json({ basarili: false, mesaj: "Kullanıcı adı veya şifre hatalı!" });
    }
});

app.post('/api/251109011/kayit', async (req, res) => {
    try {
        var yeniKullanici = new Kullanici({
            kullaniciAdi: req.body.kullaniciAdi,
            sifre: req.body.sifre,
            isAdmin: false 
        });
        await yeniKullanici.save();
        res.status(201).json({ basarili: true, mesaj: "Kayıt başarıyla tamamlandı!" });
    } catch (err) {
        console.log("Kayıt Sırasında Oluşan Veritabanı Hatası:", err.message); 
        res.status(500).json({ hata: err.message });
    }
});

app.listen(PORT, () => {
    console.log("Sunucu http://localhost:" + PORT + " adresinde çalışıyor...");
});