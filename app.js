// DOM Elemanlarını Seçme
const output = document.querySelector('#products'); // Ürünleri gösteren alan
const butonlar = document.querySelector('#btns'); // Kategori butonları
const kategoriler = document.querySelector('#category'); // Seçili kategori başlığı
const aramaKutusu = document.querySelector('#searchInput'); // Arama kutusu
const modalBaslik = document.querySelector('#exampleModalLabel'); // Modal başlık
const modalBody = document.querySelector('.modal-body'); // Modal içeriği
const sepetteYumurta = document.querySelector('#sepet'); // Sepet simgesi
const sepetSayfasi = document.querySelector('#sepetBody'); // Sepet sayfası içeriği
const sepetToplam = document.querySelector('#sepetTotal'); // Sepet toplam tutarı
const buttonClasses = [
  'btn-primary',
  'btn-secondary',
  'btn-success',
  'btn-danger',
  'btn-warning',
  'btn-info',
]; // Buton tasarımları
const apiUrl = 'https://anthonyfs.pythonanywhere.com/api/products/'; // API URL'si

// Ürünleri Ekrana Basma Fonksiyonu
const ekranaBas = (veri) => {
  output.innerHTML = '';
  let biriktir = '';
  veri.forEach((item) => {
    biriktir += `
      <div class='card'>
        <img src='${item.image}' class='p-2' height='250px' alt="${item.title} Görseli" />
        <div class='card-body'>
          <h5 class='card-title line-clamp-1'>${item.title}</h5>
          <p class='card-text line-clamp-3'>${item.description}</p>
        </div>
        <div class='card-footer w-100 fw-bold d-flex justify-content-between gap-3'>
          <span>Fiyat:</span><span>${item.price} ₺</span>
        </div>
        <div class='card-footer w-100 d-flex justify-content-center gap-3'>
          <button class='btn btn-danger' data-id='${item.id}'>Sepete Ekle</button>
          <button class='btn btn-primary' data-id='${item.id}' data-bs-toggle='modal' data-bs-target='#exampleModal'>
            Detay Gör
          </button>
        </div>
      </div>`;
  });
  output.innerHTML = biriktir;
};

// Kategori Butonlarını Oluşturma
const kategoriBas = (veri) => {
  let index = 0;
  butonlar.innerHTML = '';
  let biriktir = '';
  veri.forEach((element) => {
    const buttonClass = buttonClasses[index % buttonClasses.length];
    index++;
    biriktir += `<button type='button' id='${element}' class='btn ${buttonClass}'>${element.toUpperCase()}</button>`;
  });
  butonlar.innerHTML = biriktir;
};

// Kategorileri Topla ve Ekrana Bas
const kategoriTopla = (urun) => {
  let hepsi = ['All'];
  urun.forEach((element) => {
    if (!hepsi.includes(element.category)) hepsi.push(element.category);
  });
  kategoriBas(hepsi);
};

// Kategoriye Göre Filtreleme
const kategoriyeGoreGetir = (kategori, input) => {
  kategoriler.textContent = kategori;
  const data = JSON.parse(localStorage.getItem('All')) || [];
  let kategoriData;

  if (kategori !== 'All') {
    kategoriData = data.filter((esya) => esya.category === kategori);
  } else {
    kategoriData = data;
  }

  if (input) {
    kategoriData = kategoriData.filter((item) =>
      item.title.toLowerCase().includes(input.toLowerCase())
    );
  }

  ekranaBas(kategoriData);
};

// Sepetteki Ürünleri Hesaplama
const sepetHesap = (id, islem) => {
  const urunler = JSON.parse(localStorage.getItem('sepet')) || [];
  switch (islem) {
    case 'artir':
      urunler[id][2]++;
      break;
    case 'azalt':
      if (urunler[id][2] > 1) urunler[id][2]--;
      break;
    case 'remove':
      urunler.splice(id, 1);
      break;
  }
  localStorage.setItem('sepet', JSON.stringify(urunler));
  sepetteGoster();
};

// Sepetteki Ürünleri Gösterme
const sepetteGoster = () => {
  sepetSayfasi.innerHTML = '';
  const urunler = JSON.parse(localStorage.getItem('sepet')) || [];
  sepet.textContent = urunler.length;
  let sira = 0;
  let fiyat = 0;

  if (!urunler.length) {
    sepetSayfasi.innerHTML = `<p class="text-center">Sepetiniz boş!</p>`;
    sepetToplam.innerHTML = '';
    return;
  }

  let biriktir = '';
  urunler.forEach((element) => {
    biriktir += `
<div class="card mb-3">
    <div class="row g-0">
        <div class="col-md-4 my-auto">
            <img src="${element[1]}" class="img-fluid" alt="${element[0]} Görseli" />
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5>${element[0]}</h5>
                <div class="d-flex align-items-center gap-2" role="button">
                    <i onclick="sepetHesap('${sira}','azalt')" class="fa-solid fa-minus border rounded-circle bg-danger text-white p-2"></i><span class="fw-bold">${element[2]}</span>
                    <i onclick="sepetHesap('${sira}','artir')" class="fa-solid fa-plus border bg-danger text-white rounded-circle p-2"></i>
                </div>
                <p>Total: ${element[2]} x ${element[3]} ₺</p>
                <button onclick="sepetHesap('${sira}','remove')" class="btn btn-danger">Remove</button>
            </div>
        </div>
    </div>
</div>
`;
    fiyat += element[2] * element[3];
    sira++;
  });

  sepetSayfasi.innerHTML = biriktir;
  sepetToplam.innerHTML = `
  <div class="d-flex justify-content-between align-items-center mx-4 mb-1">
    <h5>Toplam Tutar</h5>
    <h5>${fiyat.toFixed(2)} ₺</h5>
  </div>`;
};

// Sepete Ekleme
const sepeteEkle = (id) => {
  const allProducts = JSON.parse(localStorage.getItem('All')) || [];
  const mevcut = JSON.parse(localStorage.getItem('sepet')) || [];
  const urun = allProducts.find((urun) => urun.id == id);

  if (!urun) return;

  const { title, price, image } = urun;
  const urunIndex = mevcut.findIndex((urun) => urun[0] === title);

  if (urunIndex !== -1) mevcut[urunIndex][2]++;
  else mevcut.push([title, image, 1, price]);

  localStorage.setItem('sepet', JSON.stringify(mevcut));
  sepetteGoster();
};

// Ürün Detaylarını Gösterme
const detayGöster = (id) => {
  const urun = JSON.parse(localStorage.getItem('All')).find(
    (urun) => urun.id == id
  );
  if (!urun) return;

  const { title, description, price, image } = urun;
  modalBaslik.textContent = title;
  modalBody.innerHTML = `
    <img src="${image}" height="250px" alt="${title}">
    <p>${description}</p>
    <p>Fiyat: ${price} ₺</p>`;
};

// Veri Çekme Fonksiyonu
const veriGetir = async () => {
  try {
    output.innerHTML = `<p class="text-center">Ürünler yükleniyor...</p>`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Veri alınamadı.');

    const data = await res.json();
    localStorage.setItem('All', JSON.stringify(data));
    ekranaBas(data);
    kategoriTopla(data);
  } catch (error) {
    alert(`Hata: ${error.message}`);
  }
};

// Sayfa Yüklenince Veri Çek
window.addEventListener('load', () => veriGetir());

// Arama Kutusu Dinleme
aramaKutusu.addEventListener('input', () => {
  kategoriyeGoreGetir(kategoriler.textContent, aramaKutusu.value);
});

// Ürünler Bölgesi Event Listener
output.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-danger'))
    sepeteEkle(e.target.getAttribute('data-id'));
  if (e.target.classList.contains('btn-primary'))
    detayGöster(e.target.getAttribute('data-id'));
});

// Kategori Butonları Event Listener
butonlar.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON')
    kategoriyeGoreGetir(e.target.id, aramaKutusu.value);
});
