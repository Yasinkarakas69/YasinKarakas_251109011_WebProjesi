# Gedik Food - Yemek Sipariş Sitesi

Bu proje, Gedik Üniversitesi Bilgisayar Programcılığı bölümü için geliştirilmiş, Full-Stack bir web uygulamasıdır. 

Müşterilerin yemek menüsünü görebildiği ve yetkili (Admin) hesapların veritabanına yeni yemekler ekleyip silebildiği, kayıt/giriş özelliklerine sahip bir yemek sipariş platformudur.

## Kullanılan Teknolojiler

* **Backend (Arka Plan):** Node.js, Express.js
* **Veritabanı:** MongoDB, Mongoose
* **Oturum Yönetimi:** Express-Session
* **Frontend (Ön Plan):** HTML, CSS, JavaScript (Vanilla)

## Proje Özellikleri

* Kullanıcı Kayıt Olma ve Giriş Yapma (Login/Register) sistemi.
* Şifreli Admin yetkilendirme kontrolü.
* MongoDB Compass üzerinden doğrudan veritabanı yönetimi.
* Dinamik REST API mimarisi (Yemeklerin veritabanından anlık çekilmesi).
* Görselli menü listeleme ve ürün ekleme/silme fonksiyonları.

## Projeyi Bilgisayarınızda Çalıştırma

Projeyi kendi bilgisayarınızda test etmek için aşağıdaki adımları izleyebilirsiniz:

1. Bu projeyi bilgisayarınıza indirin.
2. Arka planda MongoDB (mongod.exe) motorunun çalıştığından emin olun.
3. Proje klasöründe bir terminal açın ve gerekli paketleri kurmak için şu komutu yazın:
   `npm install`
4. Sunucuyu başlatmak için şu komutu girin:
   `node server.js`
5. Tarayıcınızdan `http://localhost:3000` adresine giderek projeyi görüntüleyin.

---
**Geliştirici:** Yasin Karakaş - 251109011