# TODO - WaroengMAMA UI/Auth Updates

- [ ] Audit & implement background cream+dot di semua halaman (terutama: ProductsPage, ProductDetailPage, CartPage (pastikan konsisten), LoginPage, RegisterPage, dll bila perlu)
- [ ] Proteksi route: /cart, /checkout, /orders, /orders/success/:id (redirect ke /login bila belum login)
- [ ] Tambah validasi login saat klik “Tambah” ke keranjang dari semua entry point (ProductCard, ProductSection, ProductDetailPage)
- [ ] Modal saat “Tambah ke keranjang” tapi belum login (prompt harus login + arahkan ke login)
- [ ] Update tombol di Home/ProdukCard: button Tambah ke keranjang warna hijau (emerald) sesuai permintaan
- [ ] CartPage: tombol “Kosongkan Keranjang” harus membuka modal konfirmasi (bukan langsung clear)
- [ ] ProductsPage: ubah grid agar desktop 1 baris 5 produk dan card tidak memanjang
- [ ] Perbaiki layout ProductDetailPage supaya menu lebih simple/compact
- [ ] LoginPage & RegisterPage: ubah background cream+dot dan tombol hijau -> hitam
- [ ] Pastikan semua halaman responsive di semua ukuran layar
- [ ] Jalankan dev/build & test manual (cek modal, redirect, grid 5 produk, responsive)
