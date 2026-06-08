# Desain Website **WaroengMAMA**

## 1. Gambaran Umum

**WaroengMAMA** adalah website full-stack bertema e-commerce yang dirancang khusus untuk warung, toko kelontong, dan retail skala kecil hingga menengah. Website ini dibuat untuk membantu pengguna membeli kebutuhan sehari-hari secara online dengan tampilan yang modern, mudah digunakan, dan responsif di berbagai ukuran layar.

Platform ini tidak hanya berfungsi sebagai etalase produk, tetapi juga sebagai sistem transaksi yang lengkap. Pengguna dapat melihat produk, menambahkan ke keranjang, melakukan checkout, memilih metode pembayaran, hingga memantau status pesanan. Di sisi lain, admin dapat mengelola produk, kategori, pesanan, dan data pengguna melalui dashboard khusus.

## 2. Tujuan Website

Website ini dibuat dengan beberapa tujuan utama:

1. Memudahkan pelanggan berbelanja kebutuhan warung dan kelontong secara online.
2. Membantu pemilik usaha kecil memiliki sistem penjualan digital yang rapi dan modern.
3. Menyediakan pengalaman belanja yang cepat, sederhana, dan nyaman.
4. Menampilkan portofolio full-stack project yang realistis dan layak dipresentasikan di GitHub maupun LinkedIn.
5. Menunjukkan kemampuan pengembangan frontend, backend, autentikasi, database, dan integrasi payment gateway.

## 3. Konsep Desain

Konsep visual WaroengMAMA mengusung gaya:

* **Modern**: tampilan bersih, rapi, dan profesional.
* **Friendly**: mudah dipahami oleh pengguna umum.
* **Komersial**: fokus pada produk, promo, dan transaksi.
* **Responsive**: optimal di desktop, tablet, dan smartphone.
* **Trustworthy**: menampilkan elemen yang memberi rasa aman saat berbelanja.

Warna, tipografi, dan layout dibuat agar terasa hangat seperti brand toko lokal, tetapi tetap terlihat premium seperti platform e-commerce modern.

## 4. Target Pengguna

Website ini ditujukan untuk:

* Pembeli umum yang ingin belanja kebutuhan harian.
* Pelanggan warung atau toko kelontong.
* Pemilik toko yang ingin memasarkan produk secara online.
* Admin toko yang mengelola data produk dan pesanan.

## 5. Struktur Halaman

Website WaroengMAMA dibangun dengan beberapa halaman utama, yaitu:

### a. Halaman Beranda

Halaman awal yang menampilkan identitas brand, banner utama, produk unggulan, kategori populer, dan testimoni.

### b. Halaman Produk

Menampilkan daftar seluruh produk dengan fitur pencarian, filter kategori, dan navigasi antar halaman.

### c. Halaman Detail Produk

Berisi informasi lengkap produk seperti nama, harga, stok, deskripsi, gambar, dan tombol tambah ke keranjang.

### d. Halaman Keranjang

Menampilkan daftar produk yang sudah dipilih pengguna sebelum checkout.

### e. Halaman Checkout

Pengguna mengisi data pembeli, alamat, metode pembayaran, dan melanjutkan transaksi.

### f. Halaman Login dan Register

Digunakan untuk autentikasi pengguna agar bisa masuk ke akun masing-masing.

### g. Halaman Pesanan

Menampilkan riwayat pesanan dan status transaksi pengguna.

### h. Dashboard Admin

Area khusus admin untuk mengelola produk, pesanan, pengguna, dan data toko.

## 6. Fitur Utama

Fitur utama yang tersedia dalam WaroengMAMA meliputi:

### a. Autentikasi Pengguna

* Login dan register akun.
* Proteksi halaman tertentu agar hanya pengguna terdaftar yang bisa mengakses.
* Pemisahan akses antara user biasa dan admin.

### b. Manajemen Produk

* Menampilkan daftar produk.
* Detail produk lengkap.
* Tambah, edit, dan hapus produk melalui admin dashboard.
* Upload gambar produk.

### c. Keranjang Belanja

* Menambahkan produk ke keranjang.
* Mengubah jumlah item.
* Menghapus item dari keranjang.
* Perhitungan total belanja secara otomatis.

### d. Checkout

* Form data pembeli.
* Ringkasan pesanan.
* Validasi sebelum transaksi.
* Proses order ke sistem backend.

### e. Payment Gateway

* Integrasi dengan Midtrans.
* Mendukung proses pembayaran secara online.
* Sistem transaksi dibuat lebih realistis dan profesional.

### f. Dashboard Admin

* Melihat ringkasan data.
* Mengelola produk dan kategori.
* Mengelola pesanan.
* Melihat daftar pengguna.

### g. Responsif di Semua Layar

* Tampilan desktop.
* Tampilan tablet.
* Tampilan mobile.

## 7. Alur Pengguna

### Alur Customer

1. Pengguna membuka halaman beranda.
2. Pengguna melihat daftar produk.
3. Pengguna memilih produk tertentu.
4. Produk dimasukkan ke keranjang.
5. Pengguna masuk ke halaman checkout.
6. Pengguna mengisi data dan memilih pembayaran.
7. Sistem memproses pesanan.
8. Pengguna melihat status pesanan.

### Alur Admin

1. Admin login ke sistem.
2. Admin masuk ke dashboard.
3. Admin menambah atau mengubah produk.
4. Admin memantau pesanan masuk.
5. Admin mengelola data pengguna dan kategori.

## 8. Struktur Frontend

Frontend dibuat sebagai antarmuka utama yang digunakan pengguna. Komponen frontend disusun secara modular agar mudah dikembangkan dan dipelihara.

Contoh komponen penting:

* Navbar
* Hero
* ProductCard
* ProductSection
* Footer
* Modal
* Form login/register
* Checkout form
* Admin layout

Frontend juga memakai routing agar perpindahan halaman terasa cepat dan terstruktur.

## 9. Struktur Backend

Backend berfungsi sebagai pusat logika aplikasi, pengolahan data, autentikasi, dan transaksi. Backend menangani komunikasi antara frontend, database, dan payment gateway.

Komponen backend utama:

* Controller
* Route
* Model
* Middleware
* Service
* Seeder
* Upload handler

Backend dibuat agar aplikasi memiliki pondasi yang rapi, scalable, dan mudah dikembangkan ke tahap berikutnya.

## 10. Database dan Data yang Disimpan

Beberapa data utama yang dikelola sistem:

* Data pengguna
* Data admin
* Data produk
* Data kategori
* Data pesanan
* Data item pesanan
* Data pembayaran

Struktur database dibuat supaya hubungan antar data tetap jelas, misalnya satu pesanan dapat memiliki banyak item, dan satu produk berada dalam satu kategori tertentu.

## 11. Integrasi Midtrans

Midtrans digunakan sebagai payment gateway agar proses pembayaran terlihat profesional dan realistis. Integrasi ini memberi pengalaman transaksi yang lebih lengkap, karena sistem tidak hanya berhenti pada keranjang, tetapi benar-benar memiliki alur pembayaran.

Keamanan integrasi dijaga dengan menyimpan key sensitif di file environment, bukan langsung di source code.

## 12. Sistem Keamanan

Beberapa langkah keamanan yang diterapkan:

* Menyimpan secret key di `.env`.
* Mengabaikan file `.env` lewat `.gitignore`.
* Membatasi akses halaman admin.
* Menggunakan proteksi route untuk user yang belum login.
* Memisahkan hak akses user dan admin.

## 13. Tampilan UI/UX

UI/UX WaroengMAMA dibuat agar:

* Mudah dipahami.
* Tidak terlalu ramai.
* Nyaman dibaca.
* Menonjolkan produk.
* Memberikan kesan bersih dan profesional.

Elemen desain yang diperhatikan:

* Spasi antar komponen.
* Konsistensi warna.
* Ukuran tombol yang jelas.
* Gambar produk yang menonjol.
* Informasi penting ditempatkan di posisi mudah terlihat.

## 14. Kelebihan Website

Beberapa kelebihan dari proyek ini:

* Memiliki konsep bisnis yang jelas.
* Cocok untuk portofolio full-stack.
* Menunjukkan kemampuan membuat sistem ecommerce sederhana namun nyata.
* Menampilkan integrasi frontend dan backend secara lengkap.
* Relevan dengan kebutuhan toko kecil dan warung modern.

## 15. Pengembangan Selanjutnya

Website ini masih bisa dikembangkan lagi ke tahap berikutnya, misalnya:

* Integrasi ongkir otomatis.
* Fitur voucher dan diskon.
* Notifikasi email atau WhatsApp.
* Riwayat transaksi yang lebih detail.
* Dashboard analytics yang lebih lengkap.
* Upload produk melalui cloud storage.
* Fitur review dan rating produk.

## 16. Penutup

WaroengMAMA adalah website full-stack e-commerce untuk warung dan toko kelontong yang dirancang sebagai solusi digital sederhana, modern, dan fungsional. Proyek ini menggabungkan tampilan UI yang menarik, alur transaksi yang jelas, serta struktur backend yang rapi.

Secara keseluruhan, WaroengMAMA bukan hanya sekadar tampilan website, tetapi juga representasi kemampuan membangun aplikasi web end-to-end, mulai dari frontend, backend, database, autentikasi, hingga payment gateway.
