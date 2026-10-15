/* EduKelistrikan · Bengkel Virtual TITL */
(function(){
"use strict";
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const fmt=(n,d=1)=>Number(n).toLocaleString("id-ID",{minimumFractionDigits:d,maximumFractionDigits:d});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const now=()=>Date.now();
const tglJam=t=>t?new Date(t).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"–";

/* ================= DATA BAWAAN ================= */
const CATS={hand:"Alat Tangan",ukur:"Alat Ukur",komp:"Komponen Instalasi",apd:"APD / K3",lain:"Lainnya"};
const CATCOL={hand:"#2f8f46",ukur:"#7b4fc9",komp:"#1f5fbf",apd:"#d97706",lain:"#64748b"};
const MODELS={tangKombinasi:"Tang kombinasi",tangPotong:"Tang potong",tangKupas:"Tang pengupas",obeng:"Obeng plus & minus",multimeter:"Multimeter",tespen:"Test pen",tangAmpere:"Tang ampere",megger:"Megger",mcb:"MCB",kabel:"Kabel NYA & NYM",stopKontak:"Stop kontak",saklar:"Saklar",sepatu:"Sepatu safety",helm:"Helm",sarungTangan:"Sarung tangan",kontaktor:"Kontaktor magnet",tor:"TOR (thermal overload relay)",tombol:"Tombol tekan",tdr:"Timer (TDR)",motor:"Motor induksi 3 fasa",earth:"Earth tester",kotak:"Bentuk kotak (umum)",silinder:"Bentuk silinder (umum)"};
const LABLINK_E={multimeter:"p1",tespen:"p1",tangAmpere:"p2",mcb:"p4",saklar:"p3",stopKontak:"p4",kabel:"p1",megger:"p4"};
const LABLINK_F={multimeter:"f1",tespen:"f1",tangAmpere:"f1",kontaktor:"f1",tor:"f1",tombol:"f2",tdr:"f3",motor:"f3",mcb:"f1"};

const DEFAULT_TOOLS=[
{id:"tang-kombinasi",name:"Tang Kombinasi",en:"Combination Pliers",cat:"hand",model:"tangKombinasi",
 desc:"Alat tangan serbaguna. Ujung bergerigi untuk menjepit dan memuntir kawat, lubang tengah untuk menahan benda bulat, dan mata potong di dekat engsel untuk memotong kabel.",
 steps:["Pilih tang berlabel VDE 1000 V dengan gagang utuh.","Jepit kawat di rahang bergerigi untuk memuntir sambungan.","Potong kabel kecil dengan mata potong di dekat engsel.","Bersihkan rahang dari serpihan setelah dipakai."],
 safety:["Gunakan tang berisolasi (VDE) minimal 1000 V jika bekerja dekat bagian bertegangan.","Jangan memakai tang sebagai palu.","Pastikan gagang karet tidak robek atau terkelupas."],
 pemantik:"Mengapa satu alat dibuat dengan tiga bentuk rahang yang berbeda?"},
{id:"tang-potong",name:"Tang Potong",en:"Diagonal Cutters",cat:"hand",model:"tangPotong",
 desc:"Dirancang khusus untuk memotong kawat tembaga, aluminium, atau baja kecil. Mata potongnya miring sehingga dapat memotong rata di permukaan.",
 steps:["Posisikan kabel tegak lurus terhadap mata potong.","Tekan gagang dengan mantap dalam satu gerakan.","Arahkan ujung potongan menjauh dari wajah."],
 safety:["Gunakan kacamata safety; potongan kawat kaku bisa terpental.","Jangan memotong kawat baja yang melebihi kapasitas tang."],
 pemantik:"Ke mana arah serpihan kawat terlempar saat dipotong, dan bagaimana kamu mengatur posisi tubuhmu?"},
{id:"tang-kupas",name:"Tang Pengupas Kabel",en:"Wire Stripper",cat:"hand",model:"tangKupas",
 desc:"Mengupas isolasi kabel tanpa melukai kawat inti. Rahangnya memiliki lubang dengan ukuran penampang berbeda (mm² / AWG).",
 steps:["Ukur penampang kabel, misalnya 1,5 mm² atau 2,5 mm².","Masukkan kabel ke lubang yang sesuai, sekitar 1–1,5 cm dari ujung.","Tekan lalu tarik kabel lurus keluar.","Periksa tembaga: tidak boleh ada serabut yang putus."],
 safety:["Lubang yang terlalu kecil melukai tembaga dan menaikkan hambatan sambungan.","Pastikan kabel tidak bertegangan saat dikupas."],
 pemantik:"Jika serabut tembaga ikut terpotong, apa akibatnya pada sambungan yang dialiri arus besar?"},
{id:"obeng",name:"Obeng Plus & Minus",en:"Phillips & Slotted Screwdrivers",cat:"hand",model:"obeng",
 desc:"Mengencangkan dan mengendurkan sekrup pada saklar, stop kontak, fitting, dan terminal MCB. Obeng plus (Phillips) bermata silang, obeng minus (slotted) bermata pipih.",
 steps:["Pilih ukuran mata yang pas dengan kepala sekrup.","Tekan obeng tegak lurus sambil memutar.","Kencangkan terminal secukupnya; jangan sampai kabel tergencet putus."],
 safety:["Gunakan obeng berisolasi penuh sampai dekat ujung batang.","Mata yang tidak pas membuat sekrup dol."],
 pemantik:"Terminal yang kendur sering menjadi penyebab kebakaran. Bagaimana sekrup kendur bisa menimbulkan panas?"},
{id:"multimeter",name:"Multimeter Digital",en:"Digital Multimeter (AVO)",cat:"ukur",model:"multimeter",
 desc:"Alat ukur utama. AVO berarti Ampere (arus), Volt (tegangan), dan Ohm (hambatan). Tegangan diukur paralel, sedangkan hambatan diukur saat rangkaian tidak bertegangan.",
 steps:["Pasang probe hitam ke COM dan probe merah ke V/Ω.","Putar selektor ke V~ untuk tegangan AC.","Sentuhkan probe ke dua titik secara paralel lalu baca layar.","Untuk Ω, matikan sumber dulu, lalu ukur kontinuitas."],
 safety:["Jangan mengukur tegangan saat selektor berada di posisi Ω atau A.","Mulai dari range tertinggi jika besar tegangan belum diketahui.","Pegang probe di belakang pelindung jari."],
 pemantik:"Mengapa multimeter bisa rusak jika selektor di posisi Ω lalu disentuhkan ke stop kontak?"},
{id:"tespen",name:"Test Pen",en:"Voltage Tester Screwdriver",cat:"ukur",model:"tespen",
 desc:"Obeng kecil dengan lampu neon. Lampu menyala bila ujungnya menyentuh penghantar fasa, karena arus sangat kecil mengalir melalui resistor, tubuh, lalu ke tanah.",
 steps:["Uji dulu pada stop kontak yang diketahui hidup.","Sentuhkan ujung ke terminal yang diperiksa.","Tempelkan jari di tutup logam bagian atas.","Lampu menyala berarti titik itu fasa atau bertegangan."],
 safety:["Jangan menyentuh mata test pen saat digunakan.","Lampu tidak menyala belum tentu aman. Pastikan dengan multimeter."],
 pemantik:"Jika arus melewati tubuhmu saat memakai test pen, mengapa kamu tidak tersengat?"},
{id:"tang-ampere",name:"Tang Ampere",en:"Clamp Meter",cat:"ukur",model:"tangAmpere",
 desc:"Mengukur arus AC tanpa memutus rangkaian. Rahang menangkap medan magnet di sekitar kabel yang dialiri arus.",
 steps:["Putar selektor ke A~.","Tekan pelatuk untuk membuka rahang, lalu jepit satu kabel saja.","Lepas pelatuk dan baca arus pada layar."],
 safety:["Menjepit fasa dan netral bersamaan menghasilkan 0 A karena medan magnetnya saling meniadakan.","Jauhkan jari dari bagian logam terbuka di panel."],
 pemantik:"Mengapa tang ampere tidak bisa mengukur arus pada kabel NYM utuh yang berisi fasa dan netral?"},
{id:"megger",name:"Megger (Insulation Tester)",en:"Megohmmeter",cat:"ukur",model:"megger",
 desc:"Mengukur tahanan isolasi kabel atau kumparan motor dengan tegangan uji 500–1000 V DC. Nilai yang rendah menandakan isolasi bocor.",
 steps:["Pastikan instalasi mati, terkunci LOTO, dan semua beban dilepas.","Pasang probe antara fasa–PE atau fasa–netral.","Tekan tombol uji lalu baca nilai MΩ.","Nilai minimal instalasi 230 V adalah 1 MΩ (uji 500 V DC)."],
 safety:["Instalasi yang diukur harus sudah tidak bertegangan.","Megger menghasilkan tegangan tinggi; jangan sentuh probe saat menguji."],
 pemantik:"Mengapa isolasi kabel lama di rumah yang lembap bisa membuat RCBO sering trip?"},
{id:"mcb",name:"MCB",en:"Miniature Circuit Breaker",cat:"komp",model:"mcb",
 desc:"Pengaman yang memutus arus otomatis saat terjadi beban lebih (bimetal, lambat) atau hubung singkat (kumparan magnet, seketika). Kode C10 berarti kurva C dengan arus nominal 10 A.",
 steps:["Hitung arus beban: I = P / (V · cos φ).","Pilih rating sedikit di atas arus beban dan sesuai penampang kabel.","Pasang kabel fasa dari sumber di terminal atas.","Uji dengan menaikkan dan menurunkan tuas."],
 safety:["Rating MCB harus sesuai penampang kabel.","Jika MCB trip, cari penyebabnya sebelum dinaikkan lagi."],
 pemantik:"Mengapa MCB trip seketika saat korsleting, tetapi butuh waktu saat beban sedikit berlebih?"},
{id:"kabel",name:"Kabel NYA & NYM",en:"Electrical Cables",cat:"komp",model:"kabel",
 desc:"NYA berinti tunggal dengan isolasi PVC dan harus dipasang dalam pipa. NYM berinti 2–4 dengan selubung luar putih dan boleh dipasang menempel atau ditanam.",
 steps:["Tentukan penampang: 1,5 mm² untuk penerangan, 2,5 mm² untuk stop kontak.","Ikuti warna PUIL: fasa coklat/hitam/abu, netral biru, PE hijau-kuning.","Sambung dengan puntiran yang kuat lalu tutup dengan lasdop."],
 safety:["Jangan menukar warna netral dan PE.","Sambungan harus kuat dan terisolasi rapat."],
 pemantik:"Apa bahayanya bagi teknisi berikutnya jika kabel biru dipakai sebagai fasa?"},
{id:"stop-kontak",name:"Stop Kontak",en:"Socket Outlet",cat:"komp",model:"stopKontak",
 desc:"Titik sambung beban melalui steker. Jenis modern memiliki lubang fasa dan netral serta klem pentanahan (PE) di sisi atas dan bawah.",
 steps:["Pasang kabel fasa, netral, dan PE pada terminal yang benar.","Kencangkan terminal lalu rapikan kabel.","Uji tegangan L–N sekitar 230 V dan pastikan PE tersambung."],
 safety:["Klem PE wajib tersambung untuk peralatan berbodi logam.","Jangan menumpuk banyak beban besar pada satu stop kontak."],
 pemantik:"Mengapa setrika dan pemanas air sebaiknya tidak memakai terminal bertumpuk?"},
{id:"saklar",name:"Saklar",en:"Switch",cat:"komp",model:"saklar",
 desc:"Menghubung dan memutus arus ke lampu. Jenisnya antara lain saklar tunggal, saklar seri (ganda), dan saklar tukar (hotel).",
 steps:["Matikan MCB dan pasang LOTO.","Hubungkan kabel fasa ke terminal masuk saklar.","Hubungkan terminal keluar ke fasa fitting lampu.","Uji: saat lampu mati, fitting tidak bertegangan."],
 safety:["Saklar harus memutus kabel fasa, bukan netral.","Terminal harus kencang agar tidak timbul percikan."],
 pemantik:"Lampu mati tetapi fitting masih bertegangan. Bagaimana itu bisa terjadi? Buktikan di Praktikum 1."},
{id:"sepatu",name:"Sepatu Safety Isolasi",en:"Electrical Hazard Safety Shoes",cat:"apd",model:"sepatu",
 desc:"Sepatu dengan sol karet isolator dan pelindung jari non-logam. Mencegah arus mengalir dari tubuh ke tanah saat terjadi kontak.",
 steps:["Periksa sol: tidak retak, tidak berlubang, dan kering.","Ikat tali dengan rapat.","Hindari genangan air di area kerja."],
 safety:["Sepatu basah kehilangan sifat isolatornya.","Ganti sepatu yang solnya sudah tipis atau robek."],
 pemantik:"Arus listrik selalu mencari jalan ke tanah. Bagaimana sepatumu memutus jalan itu?"},
{id:"helm",name:"Helm Pengaman",en:"Non-conductive Hard Hat",cat:"apd",model:"helm",
 desc:"Melindungi kepala dari benturan dan benda jatuh. Bahannya plastik tebal atau fiberglass yang tidak menghantarkan listrik.",
 steps:["Atur suspensi agar pas di kepala.","Ikat tali dagu saat bekerja di ketinggian.","Periksa retak pada cangkang sebelum dipakai."],
 safety:["Jangan memakai helm logam untuk pekerjaan listrik.","Ganti helm yang pernah terkena benturan keras."],
 pemantik:"Saat memasang fitting di plafon, bahaya apa saja yang mengancam kepalamu?"},
{id:"sarung-tangan",name:"Sarung Tangan Karet",en:"Rubber Insulating Gloves",cat:"apd",model:"sarungTangan",
 desc:"Sarung tangan karet tebal dengan kelas tegangan tertentu (misalnya Kelas 0 hingga 1000 V AC). Mencegah tangan tersengat saat menyentuh penghantar.",
 steps:["Periksa kelas tegangan pada label.","Uji kebocoran dengan menggulung pangkal sarung tangan untuk memompa udara ke dalam.","Pakai sarung tangan pelindung kulit di bagian luar bila perlu."],
 safety:["Jauhkan dari benda tajam, minyak, dan bahan kimia.","Simpan di tempat kering dan tidak terkena sinar matahari langsung."],
 pemantik:"Lubang sekecil jarum di sarung tangan karet bisa berbahaya. Mengapa?"},
{id:"kontaktor",fase:"F",name:"Kontaktor Magnet",en:"Magnetic Contactor",cat:"komp",model:"kontaktor",
 desc:"Saklar elektromagnetik untuk menghubungkan motor. Saat kumparan A1–A2 diberi tegangan, jangkar tertarik sehingga kontak utama (1-3-5 ke 2-4-6) menutup, kontak bantu NO 13-14 menutup, dan kontak bantu NC 21-22 membuka.",
 steps:["Periksa tegangan kumparan pada label (misalnya 220 V AC).","Sambungkan kontak utama: L1-L2-L3 ke 1-3-5, motor ke 2-4-6.","Rangkai kumparan A1–A2 pada rangkaian kontrol.","Gunakan 13-14 sebagai pengunci dan 21-22 sebagai interlock."],
 safety:["Jangan memberi tegangan kumparan yang tidak sesuai label.","Rating arus kontaktor (AC-3) harus di atas arus nominal motor.","Matikan dan LOTO sebelum mengganti kontaktor."],
 pemantik:"Mengapa motor besar tidak dinyalakan langsung dengan saklar tangan biasa, tetapi lewat kontaktor?"},
{id:"tor",fase:"F",name:"Thermal Overload Relay",en:"Thermal Overload Relay (TOR)",cat:"komp",model:"tor",
 desc:"Pengaman beban lebih motor. Bimetal di tiap fasa melengkung jika arus melebihi setelan, sehingga kontak NC 95-96 membuka dan memutus kumparan kontaktor. Kontak NO 97-98 dapat dipakai untuk lampu tanda gangguan.",
 steps:["Atur dial sesuai arus nominal motor pada pelat nama.","Pasang kontak 95-96 seri dengan tombol OFF di rangkaian kontrol.","Setelah trip, cari penyebab, tunggu bimetal dingin, lalu tekan RESET."],
 safety:["Setelan terlalu tinggi membuat motor terbakar sebelum TOR bekerja.","Jangan mengganjal tombol reset."],
 pemantik:"MCB sudah ada, mengapa motor masih memerlukan TOR?"},
{id:"tombol",fase:"F",name:"Tombol Tekan",en:"Push Button (NO/NC)",cat:"komp",model:"tombol",
 desc:"Saklar kembali sendiri (momentary). Tombol hijau ON memakai kontak NO (3-4) yang menutup saat ditekan. Tombol merah OFF memakai kontak NC (1-2) yang membuka saat ditekan.",
 steps:["Pasang tombol OFF (NC) di bagian awal rangkaian kontrol.","Pasang tombol ON (NO) seri setelah OFF.","Pasang kontak pengunci kontaktor paralel dengan tombol ON."],
 safety:["Tombol darurat (emergency stop) wajib berwarna merah dengan latar kuning.","Gunakan tutup pelindung pada tombol ON agar tidak tertekan tidak sengaja."],
 pemantik:"Jika tombol ON dilepas, mengapa motor bisa tetap berputar?"},
{id:"tdr",fase:"F",name:"Timer Delay Relay",en:"On-delay Timer (TDR)",cat:"komp",model:"tdr",
 desc:"Relai waktu tunda. Setelah kumparan A1–A2 diberi tegangan dan waktu setelan tercapai, kontak NC 55-56 membuka dan kontak NO 67-68 menutup. Dipakai pada pengasutan bintang-segitiga.",
 steps:["Pasang pada soket 8 kaki atau rel DIN.","Atur waktu dengan dial (misalnya 5 detik).","Rangkai 55-56 untuk kontaktor bintang dan 67-68 untuk kontaktor segitiga."],
 safety:["Waktu terlalu singkat membuat lonjakan arus saat pindah ke segitiga.","Periksa tegangan kumparan pada label."],
 pemantik:"Berapa lama motor perlu berada di hubungan bintang sebelum pindah ke segitiga?"},
{id:"motor3f",fase:"F",name:"Motor Induksi 3 Fasa",en:"Three-phase Induction Motor",cat:"komp",model:"motor",
 desc:"Penggerak utama di industri. Medan putar dari tiga fasa memutar rotor sangkar. Kumparannya dapat dihubung bintang (Y) atau segitiga (Δ) di kotak terminal U1-V1-W1 dan U2-V2-W2.",
 steps:["Baca pelat nama: daya, tegangan (Δ 400 V / Y 690 V), arus, cos φ, putaran.","Ukur tahanan isolasi kumparan terhadap bodi dengan megger.","Hubungkan bodi ke PE.","Tukar dua fasa untuk membalik arah putaran."],
 safety:["Bodi motor wajib ditanahkan.","Pasang pelindung pada poros dan kopling yang berputar."],
 pemantik:"Mengapa menukar dua kabel fasa saja sudah cukup untuk membalik arah putaran motor?"},
{id:"earth",fase:"F",name:"Earth Tester",en:"Earth Resistance Tester",cat:"ukur",model:"earth",
 desc:"Mengukur tahanan pentanahan elektroda (grounding) dengan metode tiga titik. Dua pasak bantu ditancapkan sekitar 5 m dan 10 m dari elektroda yang diuji.",
 steps:["Lepas sambungan elektroda dari instalasi.","Tancapkan pasak P (5 m) dan C (10 m) segaris.","Hubungkan kabel hijau (E), kuning (P), dan merah (C), lalu tekan tombol uji.","Nilai yang baik untuk instalasi rumah adalah ≤ 5 Ω."],
 safety:["Jangan mengukur saat ada petir atau hujan deras.","Pasang kembali sambungan elektroda setelah pengukuran."],
 pemantik:"Apa yang terjadi pada bodi mesin cuci yang bocor jika tahanan pentanahannya terlalu besar?"}
];

const DEFAULT_SOAL=[
 {fase:"E",id:"q1",q:"Test pen disentuhkan ke sebuah terminal dan lampunya menyala. Apa artinya?",o:["Terminal itu netral","Terminal itu fasa atau bertegangan terhadap tanah","Terminal itu pentanahan","Arus beban sedang besar"],a:1,e:"Lampu neon menyala karena arus kecil mengalir dari fasa melalui tubuh ke tanah. Netral dan PE berpotensial mendekati 0 V."},
 {fase:"E",id:"q2",q:"Saklar lampu yang benar dipasang memutus kabel…",o:["Netral","Pentanahan (PE)","Fasa","Boleh mana saja asal lampu mati"],a:2,e:"Jika saklar memutus netral, fitting tetap bertegangan walaupun lampu mati."},
 {fase:"E",id:"q3",q:"Menurut PUIL, warna isolasi kabel netral adalah…",o:["Hijau-kuning","Biru","Coklat","Hitam"],a:1,e:"Netral biru, PE hijau-kuning, fasa coklat, hitam, atau abu-abu."},
 {fase:"E",id:"q4",q:"Tang ampere menjepit kabel fasa dan netral sekaligus. Hasil ukurnya…",o:["Dua kali arus beban","Sama dengan arus beban","0 A","Tidak dapat diprediksi"],a:2,e:"Arus fasa dan netral sama besar dan berlawanan arah, sehingga medan magnetnya saling meniadakan."},
 {fase:"E",id:"q5",q:"Lampu LED 9 W (cos φ 0,9), setrika 350 W, dan rice cooker 350 W menyala bersamaan pada 230 V. Arus totalnya sekitar…",o:["1,6 A","3,1 A","4,6 A","7,0 A"],a:1,e:"I ≈ 0,04 + 1,52 + 1,52 ≈ 3,1 A. MCB C2 akan trip, sedangkan C4 aman."},
 {fase:"E",id:"q6",q:"Saklar tukar (hotel) dipakai untuk…",o:["Menyalakan dua lampu dari satu saklar","Mengendalikan satu lampu dari dua tempat","Mengganti fungsi MCB","Memutus netral dan fasa sekaligus"],a:1,e:"Dua saklar tukar dihubungkan dengan dua kabel penghubung (traveler), sehingga lampu bisa dinyalakan dan dimatikan dari dua tempat, misalnya ujung bawah dan atas tangga."},
 {fase:"E",id:"q7",q:"Dua lampu pijar 60 W dirangkai seri pada 230 V. Apa yang terjadi?",o:["Keduanya menyala terang","Keduanya menyala redup karena tegangan terbagi","Satu terang, satu mati","MCB langsung trip"],a:1,e:"Tegangan terbagi sekitar 115 V per lampu, sehingga daya tiap lampu turun menjadi kira-kira seperempatnya."},
 {fase:"E",id:"q8",q:"Pengukuran tahanan isolasi dengan megger dilakukan saat…",o:["Instalasi sedang berbeban penuh","Instalasi tidak bertegangan dan beban dilepas","MCB dalam posisi ON","Kapan saja"],a:1,e:"Megger mengeluarkan tegangan uji tinggi. Instalasi harus mati dan beban dilepas agar hasilnya benar dan aman."},
 {fase:"E",id:"q9",q:"MCB trip seketika saat korsleting karena bekerjanya…",o:["Bimetal (pelepas termal)","Kumparan magnet (pelepas magnetik)","Sekring lebur","Test pen"],a:1,e:"Arus hubung singkat (5–10× In pada kurva C) menggerakkan kumparan magnet seketika. Beban lebih kecil memanaskan bimetal secara perlahan."},
 {fase:"E",id:"q10",q:"Urutan LOTO yang benar adalah…",o:["Bekerja → matikan → label","Matikan → kunci & label → verifikasi tidak bertegangan → bekerja","Label → bekerja → matikan","Verifikasi → bekerja → matikan"],a:1,e:"Verifikasi dilakukan setelah penguncian agar kamu yakin titik kerja benar-benar aman."},
 {fase:"F",id:"f1",q:"Pada rangkaian DOL, motor tetap berputar setelah tombol ON dilepas karena…",o:["Tombol ON macet","Kontak bantu NO 13-14 kontaktor dipasang paralel dengan tombol ON (pengunci)","TOR menahan arus","MCB 3 fasa menahan motor"],a:1,e:"Kontak 13-14 menutup saat kontaktor bekerja dan menggantikan tombol ON, sehingga kumparan tetap mendapat tegangan."},
 {fase:"F",id:"f2",q:"Kontak TOR yang dipasang seri dengan tombol OFF adalah…",o:["97-98 (NO)","95-96 (NC)","13-14 (NO)","A1-A2"],a:1,e:"95-96 adalah kontak NC yang membuka saat beban lebih, sehingga kumparan kontaktor terputus."},
 {fase:"F",id:"f3",q:"Fungsi interlock pada kendali putar kanan-kiri adalah…",o:["Mempercepat perpindahan arah","Mencegah kedua kontaktor bekerja bersamaan yang menyebabkan hubung singkat","Mengurangi arus start","Menggantikan TOR"],a:1,e:"Kontak NC 21-22 kontaktor yang satu dipasang seri dengan kumparan kontaktor lainnya. Jika keduanya bekerja bersamaan, dua fasa terhubung singkat."},
 {fase:"F",id:"f4",q:"Untuk membalik arah putaran motor 3 fasa, yang dilakukan adalah…",o:["Menukar ketiga fasa","Menukar dua fasa","Membalik netral dan PE","Menurunkan tegangan"],a:1,e:"Menukar dua fasa membalik urutan fasa (L1-L2-L3 menjadi L1-L3-L2), sehingga arah medan putar ikut berbalik."},
 {fase:"F",id:"f5",q:"Tegangan pada tiap kumparan motor saat terhubung bintang di jaringan 400 V adalah sekitar…",o:["400 V","230 V","690 V","115 V"],a:1,e:"Pada hubungan bintang, kumparan mendapat tegangan fasa: 400/√3 ≈ 230 V. Pada hubungan segitiga, kumparan mendapat 400 V."},
 {fase:"F",id:"f6",q:"Tujuan pengasutan bintang-segitiga adalah…",o:["Menaikkan daya motor","Mengurangi arus start menjadi sekitar sepertiga","Membalik arah putar","Menghemat kabel"],a:1,e:"Saat bintang, arus jala-jala sekitar 1/3 dari arus start segitiga, sehingga lonjakan arus ke jaringan berkurang."},
 {fase:"F",id:"f7",q:"Tang ampere menjepit ketiga kabel fasa motor sekaligus. Hasilnya mendekati…",o:["Tiga kali arus fasa","Sama dengan arus fasa","0 A, karena jumlah arus tiga fasa seimbang adalah nol","√3 kali arus fasa"],a:2,e:"Pada beban seimbang, jumlah vektor ketiga arus fasa adalah nol, sehingga medan magnetnya saling meniadakan."},
 {fase:"F",id:"f8",q:"Setelan dial TOR untuk motor dengan arus nominal 4,7 A sebaiknya…",o:["2 A","4,7 A","10 A","Maksimum"],a:1,e:"TOR diatur sesuai arus nominal pada pelat nama motor agar bekerja tepat saat terjadi beban lebih."},
 {fase:"F",id:"f9",q:"Pada pengasutan Y-Δ, kontak TDR yang mengendalikan kontaktor bintang adalah…",o:["67-68 (NO tunda)","55-56 (NC tunda)","13-14","95-96"],a:1,e:"55-56 tertutup di awal sehingga kontaktor bintang bekerja. Setelah waktu tunda, kontak ini membuka dan 67-68 menutup untuk kontaktor segitiga."},
 {fase:"F",id:"f10",q:"Nilai tahanan pentanahan yang baik untuk instalasi rumah menurut PUIL adalah…",o:["≤ 5 Ω","≤ 50 Ω","≤ 500 Ω","≥ 1 MΩ"],a:0,e:"Tahanan pentanahan kecil (≤ 5 Ω) memastikan arus bocor mengalir ke tanah sehingga pengaman cepat bekerja."}
];

const DEFAULT_IDN={judul:"EduKelistrikan: Bengkel Virtual 3D Instalasi Listrik dan Kendali Motor Berbasis Pembelajaran Mendalam",penyusun:"Nama Guru, S.Pd.",sekolah:"SMK Negeri …",prodi:"Teknik Ketenagalistrikan · Konsentrasi TITL",mapel:"Dasar-dasar Teknik Ketenagalistrikan",fase:"Fase E (Kelas X) dan Fase F (Kelas XI–XII)",cp:"Fase E: K3LH, alat ukur, dasar instalasi listrik. Fase F: instalasi tenaga, pengendali elektromagnetik motor listrik, pengujian pentanahan",tp:"Peserta didik mampu mengidentifikasi fungsi dan prosedur K3 peralatan kerja, merangkai instalasi penerangan satu fasa (Fase E) dan rangkaian kendali motor 3 fasa (Fase F), mengukur besaran listrik, serta menganalisis penyebab gangguan instalasi."};
const IDN_LABELS={judul:"Judul karya",penyusun:"Penyusun",sekolah:"Satuan pendidikan",prodi:"Program keahlian",mapel:"Mata pelajaran",fase:"Fase / kelas",cp:"Elemen CP",tp:"Tujuan pembelajaran"};
const DEFAULT_BOBOT={m:20,p:40,k:30,r:10};

/* ================= APP STATE ================= */
const App={uid:null,online:false,isTeacher:false,guru:false,pending:null,saveErr:null,
  cloudReady:false,dl:null,materiDocs:{},soalDocs:{},idn:Object.assign({},DEFAULT_IDN),bobot:Object.assign({},DEFAULT_BOBOT),siswa:[],route:""};
function blankRec(){return{nama:"",kelas:"",absen:null,fase:"E",studied:[],prak:{},kuis:{ans:{},i:0},refl:{r1:"",r2:"",r3:""},log:[],mulai:0,aktif:0}}
let REC=blankRec();

function curFase(){return App.guru?(LS.get("ek2-gfase","E")):(REC.fase||"E")}
function inFase(x,f){return !x.fase||x.fase==="EF"||x.fase===f}
function tools(fase){
  const list=DEFAULT_TOOLS.map(t=>App.materiDocs[t.id]?Object.assign({},t,App.materiDocs[t.id]):t);
  Object.values(App.materiDocs).forEach(m=>{if(!DEFAULT_TOOLS.find(t=>t.id===m.id))list.push(m)});
  const f=fase||curFase();return list.filter(t=>!t.hapus&&t.name&&inFase(t,f));
}
function soal(fase){
  const list=DEFAULT_SOAL.map(s=>App.soalDocs[s.id]?Object.assign({},s,App.soalDocs[s.id]):s);
  Object.values(App.soalDocs).forEach(m=>{if(!DEFAULT_SOAL.find(s=>s.id===m.id))list.push(m)});
  const f=fase||curFase();return list.filter(s=>!s.hapus&&s.q&&Array.isArray(s.o)&&(s.fase?(s.fase==="EF"||s.fase===f):f==="E"));
}

/* ================= NILAI ================= */
function grades(rec){
  rec=rec||REC;const fase=rec.fase||"E";
  const T=tools(fase),Q=soal(fase),PR=praksOf(fase);
  const st=new Set(rec.studied||[]);
  const m=T.length?T.filter(t=>st.has(t.id)).length/T.length*100:0;
  const ps=PR.map(p=>(rec.prak&&rec.prak[p.id]&&rec.prak[p.id].score)||0);
  const p=PR.length?ps.reduce((a,b)=>a+b,0)/PR.length:0;
  const ans=(rec.kuis&&rec.kuis.ans)||{};
  const answered=Q.filter(q=>ans[q.id]!==undefined).length;
  const benar=Q.filter(q=>ans[q.id]===q.a).length;
  const k=Q.length?benar/Q.length*100:0;
  const R=rec.refl||{};const rf=["r1","r2","r3"].filter(x=>(R[x]||"").trim().length>=15).length;
  const r=rf/3*100;
  const B=App.bobot,tot=(B.m+B.p+B.k+B.r)||1;
  const akhir=(m*B.m+p*B.p+k*B.k+r*B.r)/tot;
  return{m,p,ps,k,benar,answered,nq:Q.length,r,rf,akhir,fase,PR};
}
function predikat(v){return v>=85?["A","a"]:v>=75?["B","b"]:v>=60?["C","b"]:["D","c"]}

/* ================= SUPABASE ================= */
const CFG=window.EDU_CONFIG||{};
const SB=(window.supabase&&CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY&&!/ISI_/.test(CFG.SUPABASE_URL+CFG.SUPABASE_ANON_KEY))?window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY):null;
const EMAIL_DOMAIN=CFG.STUDENT_EMAIL_DOMAIN||"siswa.edukelistrikan.id";
const cleanNis=n=>String(n||"").trim().replace(/[^0-9A-Za-z]/g,"");
const nisEmail=nis=>"nis-"+cleanNis(nis).toLowerCase()+"@"+EMAIL_DOMAIN;
App.online=!!SB;

/* ================= PENYIMPANAN ================= */
let saveT=null,saving=Promise.resolve();
function addLog(a){REC.log=REC.log||[];REC.log.unshift({t:now(),a:String(a).slice(0,140)});REC.log.length=Math.min(REC.log.length,40)}
function save(immediate){
  REC.aktif=now();LS.set("ek2-rec",REC);
  clearTimeout(saveT);
  saveT=setTimeout(pushCloud,immediate?0:1500);
}
function rowFromRec(){
  const data=JSON.parse(JSON.stringify(REC));["nama","kelas","absen","fase","nis"].forEach(k=>delete data[k]);
  return{user_id:App.uid,nis:REC.nis,nama:REC.nama,kelas:REC.kelas||null,absen:REC.absen||null,fase:REC.fase||"E",data,aktif:new Date().toISOString()};
}
function pushCloud(){
  if(!SB||!App.uid||App.isTeacher||!REC.nama||!REC.nis)return;
  const row=rowFromRec();
  saving=saving.then(async()=>{
    const{error}=await SB.from("siswa").upsert(row,{onConflict:"user_id"});
    if(error){App.saveErr=error.message;setStatus();setTimeout(pushCloud,4000+Math.random()*2000)}
    else if(App.saveErr){App.saveErr=null;setStatus()}
  });
}
function setStatus(msg){
  const el=$("#status"),tx=$("#statusTxt");let m=msg||"";
  if(!m){
    if(!SB)m="Database belum terhubung: isi SUPABASE_URL dan SUPABASE_ANON_KEY di config.js, lalu deploy ulang.";
    else if(App.saveErr)m="Gagal menyimpan ke database ("+App.saveErr+"). Mencoba lagi otomatis…";
  }
  el.hidden=!m;tx.textContent=m;
}

/* ================= CLOUD ================= */
const mapRows=rows=>{const o={};(rows||[]).forEach(r=>{o[r.id]=Object.assign({},r.data||{},{id:r.id})});return o};
async function loadShared(which){
  if(!SB)return;
  if(!which||which==="materi"){const{data}=await SB.from("materi").select("id,data");App.materiDocs=mapRows(data);refreshToolsUI();refreshGuruUI()}
  if(!which||which==="soal"){const{data}=await SB.from("soal").select("id,data");App.soalDocs=mapRows(data);renderQuiz();refreshGuruUI()}
  if(!which||which==="pengaturan"){const{data}=await SB.from("pengaturan").select("id,data").eq("id","umum").maybeSingle();
    const v=data&&data.data;App.idn=Object.assign({},DEFAULT_IDN,(v&&v.idn)||{});App.bobot=Object.assign({},DEFAULT_BOBOT,(v&&v.bobot)||{});
    renderIdn();if(App.route==="nilai")renderNilai();if(App.route==="beranda")renderBeranda()}
}
let siswaT=null;
async function loadSiswa(){
  if(!SB||!App.isTeacher)return;
  const{data,error}=await SB.from("siswa").select("*").order("nama");
  if(error){toastPage("Gagal memuat data siswa: "+error.message);return}
  App.siswa=(data||[]).map(r=>Object.assign(blankRec(),r.data||{},{nama:r.nama,kelas:r.kelas||"",absen:r.absen,fase:r.fase||"E",nis:r.nis,_id:r.user_id,mulai:Date.parse(r.mulai)||0,aktif:Date.parse(r.aktif)||0}));
  if(App.route==="nilai")renderNilai();
}
let chShared=null,chSiswa=null;
function subscribeRealtime(){
  if(!SB)return;
  if(!chShared){chShared=SB.channel("edu-shared");["materi","soal","pengaturan"].forEach(t=>chShared.on("postgres_changes",{event:"*",schema:"public",table:t},()=>loadShared(t)));chShared.subscribe()}
  if(App.isTeacher&&!chSiswa){chSiswa=SB.channel("edu-siswa").on("postgres_changes",{event:"*",schema:"public",table:"siswa"},()=>{clearTimeout(siswaT);siswaT=setTimeout(loadSiswa,600)}).subscribe()}
}
async function onSession(session){
  App.uid=session&&session.user?session.user.id:null;App.isTeacher=false;
  if(!App.uid){App.guru=false;REC=blankRec();LS.del("ek2-rec");renderWho();route();return}
  const{data:g}=await SB.from("guru").select("user_id,nama").eq("user_id",App.uid).maybeSingle();
  if(g){App.isTeacher=true;App.guru=true;App.guruNama=g.nama||"Guru";REC=blankRec();subscribeRealtime();await loadSiswa()}
  else{
    App.guru=false;
    const{data:row,error}=await SB.from("siswa").select("*").eq("user_id",App.uid).maybeSingle();
    if(row){REC=Object.assign(blankRec(),row.data||{},{nama:row.nama,kelas:row.kelas||"",absen:row.absen,fase:row.fase||"E",nis:row.nis})}
    else if(App.pending){REC=Object.assign(blankRec(),App.pending);App.pending=null;addLog("Mendaftar sebagai "+REC.nama);save(true)}
    else if(!error){REC=blankRec();App.needProfile=true}
    LS.set("ek2-rec",REC);subscribeRealtime();
  }
  renderWho();
  const h=location.hash.slice(1);
  if(!h||h==="masuk")location.hash=App.guru?"#nilai":"#beranda";
  route();
}
async function initCloud(){
  setStatus();
  if(!SB){App.cloudReady=true;$("#loginNote").textContent="Database belum dikonfigurasi. Lihat README untuk mengisi config.js.";route();return}
  $("#loginNote").textContent="Memeriksa sesi…";
  await loadShared();
  const{data}=await SB.auth.getSession();
  App.cloudReady=true;$("#loginNote").textContent="Tersambung ke database kelas.";
  await onSession(data.session);
  SB.auth.onAuthStateChange((ev)=>{if(ev==="SIGNED_OUT"&&App.uid){onSession(null)}});
}

/* ================= AUTH UI ================= */
function loggedIn(){return !!App.uid&&(App.guru||!!REC.nama)}
function renderWho(){
  const w=$("#who");w.hidden=!loggedIn();
  const nm=App.guru?(App.guruNama||"Guru"):REC.nama;
  $("#whoAv").textContent=(nm||"?").trim().slice(0,1).toUpperCase();
  $("#whoNm").innerHTML=`${esc(nm)}<small>${App.guru?"Mode guru":"Fase "+esc(REC.fase||"E")+" · "+esc(REC.kelas)+(REC.absen?" · No. "+esc(REC.absen):"")}</small>`;
  const fs=$("#faseSel");fs.hidden=!App.guru;fs.value=LS.get("ek2-gfase","E");
  $$(".nav-links .guru").forEach(a=>a.hidden=!App.guru);
}
function refreshGuruUI(){if(App.route==="materi")renderMateri()}
function setTab(t){["Masuk","Daftar","Guru"].forEach(k=>{$("#tab"+k).setAttribute("aria-pressed",k===t);$("#f"+k).hidden=k!==t})}
$("#tabMasuk").onclick=()=>setTab("Masuk");$("#tabDaftar").onclick=()=>setTab("Daftar");$("#tabGuru").onclick=()=>setTab("Guru");
const authMsg=m=>/Invalid login/i.test(m)?"NIS/email atau kata sandi salah.":/already registered|already been registered/i.test(m)?"NIS ini sudah terdaftar. Gunakan tab Masuk.":/Password should be/i.test(m)?"Kata sandi minimal 6 karakter.":/Email not confirmed/i.test(m)?"Akun belum dikonfirmasi. Matikan opsi 'Confirm email' di Supabase (lihat README).":/Signups not allowed/i.test(m)?"Pendaftaran dimatikan di Supabase. Aktifkan 'Allow new users to sign up'.":m;
function busy(btn,on,txt){btn.disabled=on;if(on){btn.dataset.t=btn.textContent;btn.textContent=txt||"Memproses…"}else if(btn.dataset.t)btn.textContent=btn.dataset.t}
$("#fMasuk").addEventListener("submit",async e=>{
  e.preventDefault();const err=$("#errMasuk"),btn=$("#fMasuk button[type=submit]");err.textContent="";
  if(!SB){err.textContent="Database belum dikonfigurasi.";return}
  const nis=cleanNis($("#inNisL").value),pw=$("#inPwL").value;
  if(!nis){err.textContent="Isi NIS kamu.";return}
  busy(btn,true);const{data,error}=await SB.auth.signInWithPassword({email:nisEmail(nis),password:pw});busy(btn,false);
  if(error){err.textContent=authMsg(error.message);return}
  await onSession(data.session);
  if(App.isTeacher){return}
  if(!REC.nama){err.textContent="Akun ditemukan tetapi data siswa belum ada. Daftar ulang dengan NIS ini tidak bisa; minta guru menghapus akunmu di Supabase."}
});
$("#fDaftar").addEventListener("submit",async e=>{
  e.preventDefault();const err=$("#loginErr"),btn=$("#fDaftar button[type=submit]");err.textContent="";
  if(!SB){err.textContent="Database belum dikonfigurasi.";return}
  const nama=$("#inNama").value.trim().replace(/\s+/g," "),kelas=$("#inKelas").value.trim(),absen=parseInt($("#inAbsen").value,10)||null,fase=$("#inFase").value==="F"?"F":"E";
  const nis=cleanNis($("#inNis").value),pw=$("#inPw").value,pw2=$("#inPw2").value;
  if(nama.length<3){err.textContent="Tulis nama lengkapmu (minimal 3 huruf).";return}
  if(!kelas){err.textContent="Isi kelasmu, misalnya X TITL 1.";return}
  if(nis.length<3){err.textContent="Isi NIS (nomor induk siswa).";return}
  if(pw.length<6){err.textContent="Kata sandi minimal 6 karakter.";return}
  if(pw!==pw2){err.textContent="Ulangi kata sandi dengan benar.";return}
  App.pending={nama,kelas,absen,fase,nis,mulai:now()};
  busy(btn,true,"Mendaftarkan…");
  const{data,error}=await SB.auth.signUp({email:nisEmail(nis),password:pw,options:{data:{nama,kelas,nis,peran:"siswa"}}});
  busy(btn,false);
  if(error){App.pending=null;err.textContent=authMsg(error.message);return}
  if(!data.session){App.pending=null;err.textContent="Akun dibuat, tetapi Supabase meminta konfirmasi email. Matikan 'Confirm email' di Authentication → Providers → Email (lihat README).";return}
  await onSession(data.session);
});
$("#fGuru").addEventListener("submit",async e=>{
  e.preventDefault();const err=$("#errGuru"),btn=$("#fGuru button[type=submit]");err.textContent="";
  if(!SB){err.textContent="Database belum dikonfigurasi.";return}
  busy(btn,true);const{data,error}=await SB.auth.signInWithPassword({email:$("#inEmailG").value.trim(),password:$("#inPwG").value});busy(btn,false);
  if(error){err.textContent=authMsg(error.message);return}
  await onSession(data.session);
  if(!App.isTeacher){err.textContent="Akun ini belum terdaftar sebagai guru. Tambahkan ke tabel guru (lihat README).";await SB.auth.signOut();App.uid=null;REC=blankRec();renderWho();route()}
});
$("#bOut").onclick=()=>{
  confirmBox("Keluar?",App.guru?"Anda akan keluar dari mode guru.":"Data belajarmu tetap tersimpan di database. Masuk lagi dengan NIS dan kata sandi untuk melanjutkan.","Keluar",async()=>{
    clearTimeout(saveT);if(!App.guru&&REC.nama)await (pushCloud(),saving);
    if(SB)await SB.auth.signOut();
    App.uid=null;App.guru=false;App.isTeacher=false;REC=blankRec();LS.del("ek2-rec");["#inPwL","#inPw","#inPw2","#inPwG"].forEach(x=>$(x).value="");setTab("Masuk");renderWho();location.hash="#masuk";route();
  });
};

/* ================= DIALOG ================= */
function closeDlg(){$("#dlgRoot").innerHTML="";document.body.style.overflow=""}
function dlg(html){$("#dlgRoot").innerHTML=`<div class="dialog-back" id="dBack"><div class="dialog" role="dialog" aria-modal="true">${html}</div></div>`;document.body.style.overflow="hidden";$("#dBack").onclick=e=>{if(e.target.id==="dBack")closeDlg()};const f=$("#dlgRoot input, #dlgRoot textarea, #dlgRoot select, #dlgRoot button");if(f)f.focus()}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#dlgRoot").innerHTML)closeDlg()});
function confirmBox(title,msg,ok,fn){dlg(`<h3>${esc(title)}</h3><p>${esc(msg)}</p><div class="row" style="justify-content:flex-end"><button class="btn" id="cNo">Batal</button><button class="btn danger" id="cYes">${esc(ok)}</button></div>`);$("#cNo").onclick=closeDlg;$("#cYes").onclick=()=>{closeDlg();fn()}}
function toastPage(m){const d=document.createElement("div");d.textContent=m;Object.assign(d.style,{position:"fixed",left:"50%",bottom:"24px",transform:"translateX(-50%)",background:"var(--ink)",color:"var(--bg)",padding:"10px 18px",borderRadius:"8px",fontWeight:"600",zIndex:70,maxWidth:"90vw"});document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}

/* ================= ROUTER ================= */
const PAGES=["masuk","beranda","toolkit","praktikum","kuis","refleksi","k3","nilai","materi","tentang"];
function route(){
  let h=(location.hash||"#beranda").slice(1)||"beranda";
  if(!loggedIn()&&h!=="masuk")h="masuk";
  if((h==="nilai"||h==="materi")&&!App.guru)h="beranda";
  const isLab=/^[pf][1-9]$/.test(h)&&PRAKS.find(p=>p.id===h);
  if(!isLab&&!PAGES.includes(h))h="beranda";
  App.route=h;
  $$(".page").forEach(p=>p.hidden=true);
  const pid=isLab?"page-lab":"page-"+h;$("#"+pid).hidden=false;
  const navKey=isLab?"praktikum":h;
  $$("#navLinks a").forEach(a=>a.setAttribute("aria-current",a.dataset.r===navKey?"page":"false"));
  if(isLab&&!praksOf(curFase()).includes(isLab)){h="praktikum";App.route=h;location.hash="#praktikum";return}
  if(h==="masuk"&&loggedIn()){h=App.guru?"nilai":"beranda";location.hash="#"+h;return}
  if(h==="beranda")renderBeranda();
  if(h==="toolkit")enterToolkit();
  if(h==="praktikum")renderPrakList();
  if(isLab)enterLab(h);else leaveLab();
  if(h==="kuis")renderQuiz();
  if(h==="refleksi")loadRefl();
  if(h==="nilai")renderNilai();
  if(h==="materi")renderMateri();
  if(h==="tentang")renderIdn();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",route);
$("#faseSel").onchange=e=>{LS.set("ek2-gfase",e.target.value);curTool=null;route()};
/* ================= THREE HELPERS ================= */
const T=window.THREE||null;
if(!T){document.querySelectorAll("canvas").forEach(c=>{const p=document.createElement("p");p.className="empty";p.textContent="Model 3D tidak dapat dimuat. Periksa koneksi internet lalu muat ulang halaman.";c.replaceWith(p)})}
function mat(color,o={}){return new T.MeshStandardMaterial(Object.assign({color,roughness:.5,metalness:0},o))}
const MAT=T?{
  metal:mat(0xc3c9d0,{metalness:.95,roughness:.25}),
  steel:mat(0x7d8792,{metalness:.9,roughness:.35}),
  chrome:mat(0xe3e6ea,{metalness:1,roughness:.12}),
  copper:mat(0xd0773a,{metalness:.95,roughness:.3}),
  brass:mat(0xc9a43a,{metalness:.9,roughness:.3}),
  red:mat(0xc62f26,{roughness:.55}),
  yellow:mat(0xf2b705,{roughness:.5}),
  orange:mat(0xe8621c,{roughness:.55}),
  black:mat(0x1d2126,{roughness:.6}),
  dark:mat(0x2a3038,{roughness:.45}),
  white:mat(0xf3f2ee,{roughness:.42}),
  ivory:mat(0xe4e2dc,{roughness:.5}),
  blue:mat(0x2463c9,{roughness:.5}),
  brown:mat(0x6b3d1d,{roughness:.5}),
  green:mat(0x2e9a46,{roughness:.5}),
  grey:mat(0x8f969e,{roughness:.5}),
  leather:mat(0x3b2a20,{roughness:.85}),
}:{};
function roundedBox(w,h,d,r,m){
  const s=new T.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
  const b=Math.min(r*.5,d*.25);
  const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,d-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b*.8,bevelSegments:3,curveSegments:8});
  g.center();const mesh=new T.Mesh(g,m);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
function cyl(r1,r2,h,m,seg=32){const me=new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg),m);me.castShadow=true;me.receiveShadow=true;return me}
function box(w,h,d,m){const me=new T.Mesh(new T.BoxGeometry(w,h,d),m);me.castShadow=true;me.receiveShadow=true;return me}
function tube(pts,r,m,seg=64){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const me=new T.Mesh(new T.TubeGeometry(c,seg,r,12,false),m);me.castShadow=true;return me}
function extrude(pts,depth,m,bevel=.015){const s=new T.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();
  const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,curveSegments:12});g.translate(0,0,-depth/2);const me=new T.Mesh(g,m);me.castShadow=true;me.receiveShadow=true;return me}
function strip(center,w0,w1){ // poligon pita mengikuti garis tengah
  const L=[],R=[],n=center.length;
  for(let i=0;i<n;i++){const a=center[Math.max(0,i-1)],b=center[Math.min(n-1,i+1)];const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;const nx=-dy/l,ny=dx/l;const w=(w0+(w1-w0)*i/(n-1))/2;L.push([center[i][0]+nx*w,center[i][1]+ny*w]);R.push([center[i][0]-nx*w,center[i][1]-ny*w])}
  return L.concat(R.reverse());
}
function smooth(pts,n=24){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],p[1],0)));return c.getPoints(n).map(v=>[v.x,v.y])}
function texCanvas(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");draw(x,w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t}
function labelPlane(w,h,draw,pw,ph){const t=texCanvas(w,h,draw);return new T.Mesh(new T.PlaneGeometry(pw,ph),new T.MeshStandardMaterial({map:t,roughness:.5}))}
function stripeTex(rep=10){const t=texCanvas(64,16,(x)=>{x.fillStyle="#2e9a46";x.fillRect(0,0,64,16);x.fillStyle="#e8c51a";for(let i=-16;i<80;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i+8,0);x.lineTo(i+16,16);x.lineTo(i+8,16);x.fill()}});t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep,1);return t}
function lcdTex(big,unit,small){return texCanvas(512,256,(x,w,h)=>{x.fillStyle="#c9d6b4";x.fillRect(0,0,w,h);x.fillStyle="#1d2a14";x.font="bold 130px JetBrains Mono, monospace";x.textAlign="right";x.fillText(big,w-90,180);x.font="bold 46px monospace";x.fillText(unit,w-14,180);if(small){x.font="28px monospace";x.textAlign="left";x.fillText(small,20,42)}})}
function part(g,name,desc,pos){const o=new T.Object3D();o.position.set(...pos);g.add(o);(g.userData.parts=g.userData.parts||[]).push({name,desc,obj:o});return o}

/* ================= MODEL ALAT ================= */
function pliers(kind){
  const g=new T.Group();
  const grip=kind==="tangKupas"?MAT.yellow:MAT.red, grip2=kind==="tangKupas"?MAT.black:MAT.yellow;
  const jawPts={
    tangKombinasi:[[0,1.08],[-.05,1.07],[-.1,.85],[-.15,.55],[-.2,.25],[-.21,.05],[-.16,-.1],[-.06,-.16],[0,-.16]],
    tangPotong:[[0,.66],[-.07,.64],[-.17,.44],[-.22,.2],[-.21,0],[-.15,-.12],[-.06,-.16],[0,-.16]],
    tangKupas:[[0,1.0],[-.06,.99],[-.09,.7],[-.12,.35],[-.15,.08],[-.13,-.08],[-.05,-.16],[0,-.16]]
  }[kind];
  const handleC=smooth([[-.04,-.1],[.07,-.42],[.19,-.9],[.3,-1.35],[.38,-1.72]],20);
  const halves=[];
  [1,-1].forEach((s,idx)=>{
    const h=new T.Group();
    const jaw=extrude(jawPts,.09,MAT.metal);h.add(jaw);
    const core=extrude(strip(handleC,.1,.08),.08,MAT.steel,.01);h.add(core);
    const gc=handleC.slice(5);
    const sleeve=extrude(strip(gc,.17,.15),.14,grip,.03);h.add(sleeve);
    const tip=extrude(strip(gc.slice(-5),.19,.17),.155,grip2,.03);h.add(tip);
    const guardC=[gc[0][0],gc[0][1]];const guard=cyl(.12,.12,.17,grip,24);guard.rotation.x=Math.PI/2;guard.scale.set(1,1,.55);guard.position.set(guardC[0]+.02,guardC[1]+.03,0);h.add(guard);
    if(kind==="tangKombinasi"){for(let i=0;i<6;i++){const t=box(.1,.012,.1,MAT.dark);t.position.set(-.05,.68+i*.06,0);h.add(t)}
      const hole=new T.Mesh(new T.CylinderGeometry(.075,.075,.1,24,1,false,Math.PI,Math.PI),MAT.dark);hole.rotation.x=Math.PI/2;hole.position.set(0,.42,0);h.add(hole);
      const cut=box(.03,.16,.1,MAT.dark);cut.position.set(-.012,.17,0);h.add(cut)}
    if(kind==="tangPotong"){const edge=box(.02,.6,.1,MAT.chrome);edge.position.set(-.012,.25,0);h.add(edge)}
    if(kind==="tangKupas"){[.25,.4,.55].forEach((y,i)=>{const n=new T.Mesh(new T.CylinderGeometry(.025+i*.008,.025+i*.008,.1,16,1,false,Math.PI,Math.PI),MAT.dark);n.rotation.x=Math.PI/2;n.position.set(0,y,0);h.add(n)});
      const cut=box(.02,.14,.1,MAT.chrome);cut.position.set(-.012,.82,0);h.add(cut)}
    h.scale.x=s;h.position.z=s*.012;g.add(h);halves.push(h);
  });
  const piv=cyl(.15,.15,.12,MAT.steel);piv.rotation.x=Math.PI/2;g.add(piv);
  const riv=cyl(.065,.065,.14,MAT.chrome);riv.rotation.x=Math.PI/2;g.add(riv);
  const vde=labelPlane(256,64,(x,w,h)=>{x.fillStyle="#f2b705";x.fillRect(0,0,w,h);x.fillStyle="#15202b";x.font="bold 40px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText("⚡ 1000 V  VDE",w/2,46)},.32,.08);
  vde.position.set(.22,-1.05,.09);vde.rotation.z=-1.32;g.add(vde);
  if(kind==="tangKombinasi"){
    part(g,"Rahang bergerigi","Menjepit, menahan, dan memuntir kawat saat menyambung.",[0,.85,.08]);
    part(g,"Lubang penjepit","Menahan benda bulat seperti mur atau pipa kecil.",[0,.42,.08]);
    part(g,"Mata potong","Memotong kabel tembaga berpenampang kecil.",[0,.17,.08]);
  }else if(kind==="tangPotong"){
    part(g,"Mata potong diagonal","Kedua mata bertemu rata sehingga potongan bersih dan rata.",[0,.35,.08]);
  }else{
    part(g,"Lubang pengupas","Lubang berukuran 0,5–2,5 mm²; pilih yang sesuai penampang kabel.",[0,.4,.08]);
    part(g,"Pemotong ujung","Merapikan ujung kabel sebelum dikupas.",[0,.82,.08]);
  }
  part(g,"Engsel (paku keling)","Titik putar kedua belahan tang; beri sedikit pelumas agar gerakan ringan.",[0,0,.1]);
  part(g,"Pelindung jari","Tonjolan isolasi yang mencegah jari tergelincir ke bagian logam.",[.06,-.3,.1]);
  part(g,"Gagang berisolasi VDE","Diuji hingga 10 kV dan aman dipakai sampai 1000 V AC.",[.25,-1.15,.1]);
  g.userData.anim=t=>{const a=Math.sin(t*Math.PI*2)*.5+.5;const th=a*.22;halves[0].rotation.z=th;halves[1].rotation.z=-th};
  g.rotation.z=-.25;
  return g;
}
function screwdrivers(){
  const g=new T.Group();
  const mk=(x,phillips,col)=>{
    const s=new T.Group();
    const prof=[[0,0],[.12,0],[.15,.06],[.15,.5],[.165,.66],[.14,.8],[.08,.86],[0,.87]].map(p=>new T.Vector2(p[0],p[1]));
    const h=new T.Mesh(new T.LatheGeometry(prof,8),col);h.castShadow=true;h.scale.set(1,1,1);s.add(h);
    const h2=new T.Mesh(new T.LatheGeometry(prof.map(v=>new T.Vector2(v.x*.94,v.y)),40),col);s.add(h2);
    const band=cyl(.153,.153,.07,MAT.black);band.position.y=.18;s.add(band);
    const ins=cyl(.06,.05,1.05,MAT.red);ins.position.y=-.52;s.add(ins);
    const sh=cyl(.038,.038,.32,MAT.chrome);sh.position.y=-1.2;s.add(sh);
    if(phillips){const c=cyl(.038,.004,.16,MAT.chrome,4);c.position.y=-1.44;s.add(c)}
    else{const b=new T.Mesh(new T.CylinderGeometry(.06,.038,.16,4),MAT.chrome);b.scale.z=.25;b.position.y=-1.44;b.rotation.y=Math.PI/4;s.add(b)}
    const lab=labelPlane(64,256,(c,w,h)=>{c.fillStyle="#f2b705";c.fillRect(0,0,w,h);c.fillStyle="#15202b";c.save();c.translate(42,h/2);c.rotate(-Math.PI/2);c.font="bold 34px Barlow Condensed, sans-serif";c.textAlign="center";c.fillText(phillips?"PH2 · 1000V":"SL 5.5 · 1000V",0,0);c.restore()},.07,.32);
    lab.position.set(0,.4,.155);s.add(lab);
    s.position.x=x;return s;
  };
  const a=mk(-.34,true,MAT.yellow),b=mk(.34,false,MAT.red);g.add(a);g.add(b);
  part(g,"Gagang","Bergerigi agar tidak licin; diameter besar memberi torsi lebih.",[-.34,.45,.17]);
  part(g,"Isolasi batang","Selubung isolasi sampai dekat mata, syarat obeng VDE.",[.34,-.55,.07]);
  part(g,"Mata plus (Phillips)","Untuk sekrup kepala silang, misalnya terminal saklar.",[-.34,-1.45,.05]);
  part(g,"Mata minus (slotted)","Untuk sekrup kepala belah, misalnya terminal MCB.",[.34,-1.45,.05]);
  g.userData.anim=t=>{a.rotation.y=t*Math.PI*4;b.rotation.y=-t*Math.PI*4};
  return g;
}
function multimeter(){
  const g=new T.Group();
  g.add(roundedBox(1.3,2.15,.34,.17,MAT.yellow));
  const face=roundedBox(1.06,1.92,.06,.09,MAT.dark);face.position.z=.17;g.add(face);
  const lcdM=new T.MeshStandardMaterial({map:lcdTex("230.4","V~","AUTO  AC"),roughness:.4});
  const lcd=new T.Mesh(new T.PlaneGeometry(.86,.42),lcdM);lcd.position.set(0,.6,.205);g.add(lcd);
  const frame=roundedBox(.94,.5,.03,.04,MAT.black);frame.position.set(0,.6,.19);g.add(frame);
  const ring=labelPlane(256,256,(x,w,h)=>{x.fillStyle="#2a3038";x.fillRect(0,0,w,h);x.font="bold 22px sans-serif";x.textAlign="center";const L=["OFF","V~","V⎓","Ω","•))","A~"];L.forEach((t,i)=>{const a=-Math.PI*.8+i*(Math.PI*1.6/(L.length-1));x.fillStyle=i===1?"#f2b705":"#e7edf3";x.fillText(t,w/2+Math.sin(a)*100,h/2-Math.cos(a)*100+8)})},.82,.82);
  ring.position.set(0,-.2,.203);g.add(ring);
  const dial=new T.Group();const d0=cyl(.26,.28,.1,MAT.black,40);d0.rotation.x=Math.PI/2;dial.add(d0);
  const grip=box(.09,.5,.08,MAT.black);grip.position.z=.08;dial.add(grip);const ptr=box(.03,.16,.02,MAT.white);ptr.position.set(0,.16,.125);dial.add(ptr);
  dial.position.set(0,-.2,.24);dial.rotation.z=Math.PI*.48;g.add(dial);
  [[-.34,MAT.black,"COM"],[0,MAT.red,"VΩ"],[.34,MAT.red,"10A"]].forEach(([x,m])=>{const j=cyl(.06,.06,.06,m);j.rotation.x=Math.PI/2;j.position.set(x,-.76,.22);g.add(j);const hl=cyl(.025,.025,.065,MAT.black);hl.rotation.x=Math.PI/2;hl.position.set(x,-.76,.225);g.add(hl)});
  g.add(tube([[0,-.76,.25],[.1,-1.05,.55],[.5,-1.3,.65],[.95,-1.15,.5]],.025,MAT.red));
  g.add(tube([[-.34,-.76,.25],[-.45,-1.1,.55],[-.8,-1.3,.6],[-1.05,-1.1,.45]],.025,MAT.black));
  const mkProbe=(m,x,y,z,rz)=>{const pr=new T.Group();pr.add(cyl(.045,.04,.45,m));const pt=cyl(.012,.004,.14,MAT.chrome);pt.position.y=-.29;pr.add(pt);const gd=cyl(.07,.07,.03,m);gd.position.y=-.12;pr.add(gd);pr.position.set(x,y,z);pr.rotation.z=rz;g.add(pr)};
  mkProbe(MAT.red,1.1,-1.0,.45,-1.0);mkProbe(MAT.black,-1.2,-.95,.4,1.0);
  part(g,"Layar LCD","Menampilkan nilai ukur dan satuannya (V~, A, Ω).",[0,.6,.22]);
  part(g,"Saklar selektor","Pilih besaran dan jenis arus sebelum probe disentuhkan.",[0,-.2,.32]);
  part(g,"Jack COM","Tempat probe hitam, selalu di sini.",[-.34,-.76,.26]);
  part(g,"Jack V/Ω","Tempat probe merah untuk tegangan dan hambatan.",[0,-.76,.26]);
  part(g,"Probe uji","Pegang di belakang pelindung jari saat menyentuh titik ukur.",[1.1,-1.0,.5]);
  const seq=[["OFF","",.8],["230.4","V~",.48],["0.2","Ω",.0],["0.00","A~",-.8]];
  let last=-1;
  g.userData.anim=t=>{const i=Math.floor(t*4)%4;dial.rotation.z=Math.PI*seq[i][2];if(i!==last){last=i;lcdM.map.dispose();lcdM.map=lcdTex(seq[i][0],seq[i][1],i?"AUTO":"");lcdM.needsUpdate=true}};
  g.userData.reset=()=>{dial.rotation.z=Math.PI*.48;lcdM.map=lcdTex("230.4","V~","AUTO  AC");lcdM.needsUpdate=true;last=-1};
  return g;
}
function tespen(){
  const g=new T.Group();
  const glass=new T.Mesh(new T.CylinderGeometry(.11,.11,1.25,32),new T.MeshPhysicalMaterial({color:0xe6eef5,transparent:true,opacity:.45,roughness:.08}));glass.position.y=.28;g.add(glass);
  const neonM=new T.MeshStandardMaterial({color:0xff6a3d,emissive:0xff4a1c,emissiveIntensity:.2});
  const neon=new T.Mesh(new T.CapsuleGeometry(.04,.3,6,12),neonM);neon.position.y=.5;g.add(neon);
  const res=cyl(.03,.03,.28,MAT.dark);res.position.y=.12;g.add(res);
  const spring=new T.Mesh(new T.TorusKnotGeometry(.035,.008,60,6,12,1),MAT.chrome);spring.scale.y=3;spring.position.y=.85;g.add(spring);
  const cap=cyl(.115,.1,.2,MAT.chrome);cap.position.y=1.0;g.add(cap);
  const clip=box(.04,.7,.02,MAT.chrome);clip.position.set(.125,.7,0);g.add(clip);
  const ins=cyl(.11,.06,.25,MAT.red);ins.position.y=-.48;g.add(ins);
  const sh=cyl(.03,.03,.68,MAT.chrome);sh.position.y=-.93;g.add(sh);
  const tip=box(.08,.08,.015,MAT.chrome);tip.position.y=-1.3;g.add(tip);
  part(g,"Mata obeng","Disentuhkan ke terminal yang diperiksa. Jangan disentuh tangan.",[0,-1.3,.03]);
  part(g,"Lampu neon","Menyala jika titik itu fasa.",[0,.5,.12]);
  part(g,"Resistor","Hambatan sekitar 1 MΩ yang membatasi arus ke tubuh hingga di bawah 0,3 mA.",[0,.12,.12]);
  part(g,"Tutup logam","Sentuh dengan jari agar arus kecil mengalir lewat tubuh ke tanah.",[0,1.0,.12]);
  g.userData.anim=t=>{neonM.emissiveIntensity=(Math.sin(t*Math.PI*8)>0)?2.2:.15};
  g.userData.reset=()=>{neonM.emissiveIntensity=.2};
  g.rotation.z=.45;return g;
}
function clampMeter(){
  const g=new T.Group();
  const body=roundedBox(.82,1.65,.34,.15,MAT.red);body.position.y=-.6;g.add(body);
  const face=roundedBox(.64,1.0,.04,.06,MAT.dark);face.position.set(0,-.5,.175);g.add(face);
  const lcd=new T.Mesh(new T.PlaneGeometry(.5,.25),new T.MeshStandardMaterial({map:lcdTex("4.82","A~"),roughness:.4}));lcd.position.set(0,-.22,.2);g.add(lcd);
  const knob=cyl(.14,.15,.08,MAT.black);knob.rotation.x=Math.PI/2;knob.position.set(0,-.66,.21);g.add(knob);
  const neck=roundedBox(.62,.32,.3,.06,MAT.black);neck.position.y=.32;g.add(neck);
  const fixedJ=new T.Mesh(new T.TorusGeometry(.4,.1,16,40,Math.PI),MAT.black);fixedJ.rotation.z=Math.PI/2;fixedJ.position.set(0,.85,0);fixedJ.castShadow=true;g.add(fixedJ);
  const hinge=new T.Group();hinge.position.set(.0,.45,0);g.add(hinge);
  const movJ=new T.Mesh(new T.TorusGeometry(.4,.1,16,40,Math.PI),MAT.dark);movJ.rotation.z=-Math.PI/2;movJ.position.set(0,.4,0);movJ.castShadow=true;hinge.add(movJ);
  const trig=box(.12,.4,.2,MAT.dark);trig.position.set(.48,.1,0);trig.rotation.z=-.25;g.add(trig);
  const wire=cyl(.07,.07,1.8,MAT.brown);wire.rotation.x=Math.PI/2;wire.position.set(0,.85,0);g.add(wire);
  part(g,"Rahang penjepit","Inti besi yang menangkap medan magnet di sekitar kabel.",[-.42,.85,.1]);
  part(g,"Pelatuk","Ditekan untuk membuka rahang.",[.5,.1,.12]);
  part(g,"Layar","Menunjukkan arus AC dalam ampere.",[0,-.22,.21]);
  part(g,"Selektor","Putar ke A~ untuk arus bolak-balik.",[0,-.66,.26]);
  g.userData.anim=t=>{const a=Math.max(0,Math.sin(t*Math.PI*2));hinge.rotation.z=-a*.5;trig.position.x=.48-a*.05};
  return g;
}
function megger(){
  const g=new T.Group();
  g.add(roundedBox(1.7,.7,1.2,.1,MAT.orange));
  const top=roundedBox(1.52,.05,1.02,.05,MAT.dark);top.position.y=.36;g.add(top);
  const lcd=labelPlane(256,128,(x,w,h)=>{x.fillStyle="#c9d6b4";x.fillRect(0,0,w,h);x.fillStyle="#1d2a14";x.font="bold 56px monospace";x.textAlign="right";x.fillText("550",w-64,84);x.font="bold 26px monospace";x.fillText("MΩ",w-12,84);x.font="18px monospace";x.textAlign="left";x.fillText("500 V DC",10,26)},.62,.31);
  lcd.rotation.x=-Math.PI/2;lcd.position.set(-.3,.395,-.12);g.add(lcd);
  const k1=cyl(.13,.13,.08,MAT.black);k1.position.set(.45,.42,-.15);g.add(k1);
  const btn=cyl(.1,.1,.06,MAT.red);btn.position.set(.45,.41,.25);g.add(btn);
  [-.5,-.2,.1].forEach((x,i)=>{const j=cyl(.05,.05,.06,i===0?MAT.red:MAT.black);j.position.set(x,.41,.35);g.add(j)});
  g.add(tube([[-.5,.42,.35],[-.7,.7,.7],[-1.1,.5,.9],[-1.2,0,.8]],.025,MAT.red));
  g.add(tube([[-.2,.42,.35],[-.3,.8,.8],[-.8,.7,1.1],[-1.0,.2,1.1]],.025,MAT.black));
  g.add(tube([[-.5,.37,-.55],[-.4,.65,-.55],[.4,.65,-.55],[.5,.37,-.55]],.04,MAT.dark,20));
  part(g,"Layar MΩ","Menampilkan tahanan isolasi; minimal 1 MΩ untuk instalasi 230 V.",[-.3,.42,-.12]);
  part(g,"Selektor tegangan uji","Pilih 250, 500, atau 1000 V DC sesuai instalasi.",[.45,.48,-.15]);
  part(g,"Tombol uji","Ditekan untuk mengeluarkan tegangan uji. Jangan sentuh probe!",[.45,.46,.25]);
  part(g,"Kabel uji","Merah ke fasa, hitam ke PE atau netral.",[-1.15,.2,.85]);
  g.userData.anim=t=>{btn.position.y=.41-(Math.sin(t*Math.PI*2)>0?.03:0)};
  return g;
}
function mcbModel(label="C10"){
  const g=new T.Group();
  const rail=box(1.0,.35,.06,MAT.metal);rail.position.z=-.36;g.add(rail);
  g.add(roundedBox(.36,1.7,.7,.04,MAT.white));
  const front=roundedBox(.34,.72,.12,.03,MAT.white);front.position.z=.38;g.add(front);
  const lab=labelPlane(128,256,(x,w,h)=>{x.fillStyle="#f3f2ee";x.fillRect(0,0,w,h);x.fillStyle="#15202b";x.font="bold 46px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText(label,w/2,70);x.font="20px sans-serif";x.fillText("230/400V~",w/2,110);x.strokeStyle="#15202b";x.lineWidth=3;x.strokeRect(34,140,60,40);x.font="bold 22px sans-serif";x.fillText("6000",w/2,168);x.fillStyle="#2463c9";x.fillRect(0,215,w,41)},.3,.6);
  lab.position.set(0,-.52,.355);g.add(lab);
  const slot=box(.15,.36,.05,MAT.dark);slot.position.set(0,.18,.45);g.add(slot);
  const lev=new T.Group();const lv=box(.1,.22,.12,MAT.black);lv.position.y=.11;lev.add(lv);lev.position.set(0,.18,.47);g.add(lev);
  [.78,-.78].forEach(y=>{const s=cyl(.07,.07,.04,MAT.metal);s.rotation.x=Math.PI/2;s.position.set(0,y,.33);g.add(s)});
  const clip=box(.2,.08,.12,MAT.dark);clip.position.set(0,-.9,-.28);g.add(clip);
  part(g,"Tuas ON/OFF","Naik = ON. Turun sendiri (trip) saat ada gangguan.",[0,.35,.55]);
  part(g,"Terminal masuk","Kabel fasa dari sumber dipasang di atas.",[0,.78,.37]);
  part(g,"Terminal keluar","Menuju beban atau saklar.",[0,-.78,.37]);
  part(g,"Kode rating","C = kurva trip; 10 = arus nominal (A); 6000 = kemampuan putus (A).",[0,-.45,.37]);
  part(g,"Klip rel DIN","Mengunci MCB pada rel di dalam box panel.",[0,-.9,-.2]);
  g.userData.anim=t=>{lev.rotation.x=(Math.sin(t*Math.PI*2)>0)?0:Math.PI};
  g.userData.reset=()=>{lev.rotation.x=0};
  g.rotation.y=-.45;return g;
}
function cables(){
  const g=new T.Group();
  const nym=cyl(.19,.19,1.5,MAT.white,40);nym.rotation.z=Math.PI/2;nym.position.set(-.4,.3,0);g.add(nym);
  const filler=cyl(.15,.15,.08,MAT.grey,24);filler.rotation.z=Math.PI/2;filler.position.set(.37,.3,0);g.add(filler);
  const peM=new T.MeshStandardMaterial({map:stripeTex(14),roughness:.5});
  [[MAT.brown,[0,.07,.06]],[MAT.blue,[0,.07,-.06]],[peM,[0,-.07,0]]].forEach(([m,o],i)=>{
    const y0=.3+o[1],z0=o[2];
    g.add(tube([[.35,y0,z0],[.7,y0+(1-i)*.12-.02,z0*1.8],[1.05,y0+(1-i)*.25-.05,z0*2.5]],.06,m,20));
    const cu=cyl(.032,.032,.2,MAT.copper);cu.rotation.z=Math.PI/2;cu.position.set(1.15,y0+(1-i)*.25-.05,z0*2.5);g.add(cu);
  });
  const nya=cyl(.075,.075,2.1,MAT.brown);nya.rotation.z=Math.PI/2;nya.position.set(0,-.45,0);g.add(nya);
  const cu2=cyl(.03,.03,.2,MAT.copper);cu2.rotation.z=Math.PI/2;cu2.position.set(1.15,-.45,0);g.add(cu2);
  const nya2=cyl(.075,.075,2.1,MAT.blue);nya2.rotation.z=Math.PI/2;nya2.position.set(0,-.72,0);g.add(nya2);
  const nya3=new T.Mesh(new T.CylinderGeometry(.075,.075,2.1,24),peM);nya3.rotation.z=Math.PI/2;nya3.position.set(0,-.99,0);g.add(nya3);
  part(g,"Selubung luar NYM","PVC putih yang melindungi inti; boleh dipasang menempel dinding.",[-.6,.5,.1]);
  part(g,"Inti fasa (coklat)","Penghantar bertegangan.",[.75,.47,.15]);
  part(g,"Inti netral (biru)","Jalur kembali arus.",[.75,.3,-.15]);
  part(g,"Inti PE (hijau-kuning)","Pentanahan untuk keselamatan; tidak dialiri arus saat normal.",[.75,.12,0]);
  part(g,"Tembaga","Dikupas ±1 cm untuk masuk terminal.",[1.2,.6,.15]);
  part(g,"NYA inti tunggal","Wajib dimasukkan ke pipa (konduit).",[-.6,-.72,.1]);
  return g;
}
function socket(){
  const g=new T.Group();
  g.add(roundedBox(1.4,1.4,.22,.18,MAT.white));
  const rec=cyl(.5,.5,.12,MAT.ivory,48);rec.rotation.x=Math.PI/2;rec.position.z=.08;g.add(rec);
  [-.2,.2].forEach(x=>{const h=cyl(.07,.07,.13,MAT.black);h.rotation.x=Math.PI/2;h.position.set(x,0,.1);g.add(h)});
  [.42,-.42].forEach(y=>{const c=box(.2,.07,.08,MAT.metal);c.position.set(0,y,.12);g.add(c)});
  const s=cyl(.05,.05,.03,MAT.metal);s.rotation.x=Math.PI/2;s.position.set(0,-.6,.12);g.add(s);
  part(g,"Lubang fasa & netral","Kontak pegas yang menjepit pin steker.",[.2,0,.18]);
  part(g,"Klem pentanahan (PE)","Kontak logam yang menyentuh bagian samping steker.",[0,.42,.18]);
  part(g,"Sekrup penutup","Mengunci penutup ke inbow doos.",[0,-.6,.15]);
  g.rotation.x=-.2;return g;
}
function switchModel(){
  const g=new T.Group();
  g.add(roundedBox(1.4,1.4,.22,.18,MAT.white));
  const frame=roundedBox(.8,1.0,.08,.08,MAT.ivory);frame.position.z=.12;g.add(frame);
  const rock=new T.Group();const rk=roundedBox(.68,.88,.1,.07,MAT.white);rock.add(rk);const led=box(.12,.03,.02,MAT.orange);led.position.set(0,-.3,.06);rock.add(led);
  rock.position.z=.19;rock.rotation.x=.12;g.add(rock);
  part(g,"Tombol rocker","Ditekan atas = ON, bawah = OFF.",[0,.25,.28]);
  part(g,"Lampu indikator","Membantu mencari saklar dalam gelap.",[0,-.3,.27]);
  part(g,"Bingkai","Menutup inbow doos dan terminal di belakangnya.",[.55,.55,.14]);
  g.userData.anim=t=>{rock.rotation.x=(Math.sin(t*Math.PI*2)>0)?.12:-.12};
  g.rotation.x=-.2;return g;
}
function helmet(){
  const g=new T.Group();
  const shell=new T.Mesh(new T.SphereGeometry(.9,48,24,0,Math.PI*2,0,Math.PI/2),MAT.yellow);shell.scale.set(1,.85,1.15);shell.castShadow=true;g.add(shell);
  const ridge=new T.Mesh(new T.TorusGeometry(.77,.05,12,40,Math.PI),MAT.yellow);ridge.rotation.y=Math.PI/2;ridge.scale.set(1.15,.95,1);g.add(ridge);
  const brim=new T.Mesh(new T.CylinderGeometry(1.05,1.05,.04,48,1,false,-Math.PI*.35,Math.PI*.7),MAT.yellow);brim.scale.z=1.25;brim.castShadow=true;g.add(brim);
  const rim=new T.Mesh(new T.TorusGeometry(.9,.04,8,48),MAT.yellow);rim.rotation.x=Math.PI/2;rim.scale.y=1.15;g.add(rim);
  const strap=tube([[-.85,0,0],[-.6,-.6,.1],[0,-.85,.2],[.6,-.6,.1],[.85,0,0]],.025,MAT.black,30);g.add(strap);
  part(g,"Cangkang non-konduktif","Plastik HDPE/fiberglass; tidak menghantarkan listrik.",[0,.78,0]);
  part(g,"Lidah depan","Melindungi wajah dari benda jatuh dan silau.",[0,0,1.25]);
  part(g,"Tali dagu","Wajib diikat saat bekerja di ketinggian.",[0,-.85,.25]);
  return g;
}
function shoe(){
  const g=new T.Group();
  const outline=smooth([[-1,0],[-.92,.3],[-.5,.36],[.3,.4],[.85,.3],[1.05,0],[.85,-.3],[.3,-.38],[-.5,-.32],[-.92,-.28],[-1,0]],40);
  const sole=extrude(outline,.14,MAT.black,.03);sole.rotation.x=Math.PI/2;g.add(sole);
  const mid=extrude(outline,.05,MAT.yellow,.01);mid.rotation.x=Math.PI/2;mid.position.y=.1;mid.scale.set(.98,.98,1);g.add(mid);
  const up=new T.Mesh(new T.SphereGeometry(.5,32,20),MAT.leather);up.scale.set(1.85,.72,.66);up.position.set(.05,.36,0);up.castShadow=true;g.add(up);
  const toe=new T.Mesh(new T.SphereGeometry(.36,24,16,0,Math.PI*2,0,Math.PI/2),MAT.black);toe.scale.set(1.1,.85,.95);toe.position.set(.62,.14,0);g.add(toe);
  const col=cyl(.36,.4,.8,MAT.leather);col.scale.z=.9;col.position.set(-.45,.75,0);g.add(col);
  const cuff=cyl(.37,.37,.12,MAT.yellow);cuff.position.set(-.45,1.16,0);g.add(cuff);
  for(let i=0;i<4;i++){const l=box(.04,.03,.5,MAT.yellow);l.position.set(-.18+i*.13,.62-i*.07,0);l.rotation.z=-.5;g.add(l)}
  part(g,"Sol karet isolator","Menahan tegangan hingga 18 kV (standar EH); tanpa paku logam.",[0,-.05,.4]);
  part(g,"Pelindung jari","Komposit non-logam yang tahan benturan.",[.72,.3,0]);
  part(g,"Tali sepatu","Ikat rapat agar tidak tersandung.",[0,.6,.3]);
  return g;
}
function glove(){
  const g=new T.Group();const gm=mat(0xe86a1c,{roughness:.7});
  g.add(roundedBox(.9,1.0,.32,.2,gm));
  const fx=[-.33,-.11,.11,.33],fl=[.55,.68,.72,.62];
  fx.forEach((x,i)=>{const f=new T.Mesh(new T.CapsuleGeometry(.1,fl[i],6,14),gm);f.castShadow=true;f.position.set(x,.5+fl[i]/2,0);g.add(f)});
  const th=new T.Mesh(new T.CapsuleGeometry(.11,.45,6,14),gm);th.position.set(-.58,.1,.05);th.rotation.z=.8;th.castShadow=true;g.add(th);
  const cuff=cyl(.45,.55,.9,MAT.red,40);cuff.scale.z=.55;cuff.position.y=-.9;g.add(cuff);
  const lab=labelPlane(256,128,(x,w,h)=>{x.fillStyle="#f3f2ee";x.fillRect(0,0,w,h);x.fillStyle="#c62f26";x.font="bold 46px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText("CLASS 0",w/2,58);x.fillStyle="#15202b";x.font="bold 30px sans-serif";x.fillText("1000 V AC",w/2,104)},.5,.25);
  lab.position.set(0,-.85,.27);g.add(lab);
  part(g,"Karet isolasi","Karet alam tebal tanpa sambungan.",[.11,.9,.12]);
  part(g,"Label kelas tegangan","Kelas 0 = maks. 1000 V AC. Periksa sebelum dipakai.",[0,-.85,.3]);
  part(g,"Manset panjang","Melindungi pergelangan dari sentuhan.",[.45,-1.1,.1]);
  return g;
}
/* ===== alat Fase F ===== */
function txtPlane(lines,w,h,pw,ph,bg="#eef0f2",fg="#15202b"){return labelPlane(w,h,(x,W,H)=>{x.fillStyle=bg;x.fillRect(0,0,W,H);x.fillStyle=fg;x.textAlign="center";lines.forEach(([t,sz,y,col])=>{x.fillStyle=col||fg;x.font=`bold ${sz}px Barlow Condensed, sans-serif`;x.fillText(t,W/2,y)})},pw,ph)}
function contactorModel(){
  const g=new T.Group();const body=mat(0xd6dade,{roughness:.55});
  g.add(roundedBox(1.0,1.3,.85,.06,body));
  const front=roundedBox(.8,.62,.12,.04,mat(0xc4c9cf));front.position.set(0,-.02,.46);g.add(front);
  const lab=txtPlane([["K1",54,58,"#15202b"],["AC-3 · 9 A · 4 kW",24,96],["Kumparan 220 V AC",22,128]],256,150,.62,.36);lab.position.set(0,-.02,.53);g.add(lab);
  const ind=box(.16,.08,.05,MAT.dark);ind.position.set(0,.36,.54);g.add(ind);
  const win=box(.24,.14,.02,MAT.black);win.position.set(0,.36,.52);g.add(win);
  const aux=roundedBox(.8,.24,.18,.03,mat(0xe7eaee));aux.position.set(0,.5,.5);g.add(aux);
  const auxL=txtPlane([["13 NO 14   ·   21 NC 22",26,34]],256,48,.74,.14,"#e7edf3");auxL.position.set(0,.5,.6);g.add(auxL);
  [[-.3,.62,"1/L1"],[0,.62,"3/L2"],[.3,.62,"5/L3"],[-.3,-.62,"2/T1"],[0,-.62,"4/T2"],[.3,-.62,"6/T3"]].forEach(([x,y])=>{const s=cyl(.06,.06,.05,MAT.brass,16);s.rotation.x=Math.PI/2;s.position.set(x,y,.36);g.add(s);const h=box(.18,.14,.16,mat(0xb8bec5));h.position.set(x,y,.26);g.add(h)});
  [[-.45,.62],[-.45,-.62]].forEach(([x,y])=>{const s=cyl(.05,.05,.05,MAT.brass,16);s.rotation.x=Math.PI/2;s.position.set(x,y,.36);g.add(s)});
  const rail=box(1.3,.35,.06,MAT.metal);rail.position.z=-.46;g.add(rail);
  part(g,"Kumparan A1–A2","Elektromagnet; diberi tegangan kontrol untuk menarik jangkar.",[-.45,.62,.4]);
  part(g,"Kontak utama 1-3-5","Masukan tiga fasa L1-L2-L3 dari MCB.",[.3,.62,.4]);
  part(g,"Kontak utama 2-4-6","Keluaran tiga fasa menuju TOR dan motor.",[.3,-.62,.4]);
  part(g,"Kontak bantu NO 13-14","Menutup saat kontaktor bekerja; dipakai sebagai pengunci.",[-.2,.5,.62]);
  part(g,"Kontak bantu NC 21-22","Membuka saat kontaktor bekerja; dipakai sebagai interlock.",[.25,.5,.62]);
  part(g,"Indikator jangkar","Terdorong masuk saat kumparan bekerja.",[0,.36,.58]);
  g.userData.anim=t=>{const on=Math.sin(t*Math.PI*2)>0;ind.position.y=on?.33:.39;ind.material=on?MAT.red:MAT.dark};
  g.userData.reset=()=>{ind.position.y=.36;ind.material=MAT.dark};
  return g;
}
function torModel(){
  const g=new T.Group();
  g.add(roundedBox(1.0,.7,.8,.05,mat(0x3b434c,{roughness:.5})));
  [-.3,0,.3].forEach(x=>{const p=cyl(.04,.04,.4,MAT.copper);p.position.set(x,.55,0);g.add(p)});
  const dial=cyl(.17,.17,.08,MAT.blue,32);dial.rotation.x=Math.PI/2;dial.position.set(-.22,.02,.42);g.add(dial);
  const ptr=box(.03,.13,.02,MAT.white);ptr.position.set(-.22,.08,.47);g.add(ptr);
  const sc=txtPlane([["3,5 · 4 · 4,7 · 5 A",22,30,"#e7edf3"]],200,44,.42,.09,"#3b434c");sc.position.set(-.22,.25,.41);g.add(sc);
  const rst=cyl(.07,.07,.09,MAT.blue);rst.rotation.x=Math.PI/2;rst.position.set(.22,.1,.44);g.add(rst);
  const stp=cyl(.06,.06,.06,MAT.red);stp.rotation.x=Math.PI/2;stp.position.set(.22,-.14,.43);g.add(stp);
  const flag=box(.12,.05,.02,MAT.grey);flag.position.set(.0,-.2,.41);g.add(flag);
  const tl=txtPlane([["95  96   97  98",24,30,"#e7edf3"]],200,44,.5,.1,"#3b434c");tl.position.set(0,-.28,.405);g.add(tl);
  [-.42,-.1,.15,.42].forEach(x=>{const s=cyl(.045,.045,.04,MAT.brass,16);s.rotation.x=Math.PI/2;s.position.set(x*.5-.0,-.36+.0,.41);g.add(s)});
  part(g,"Dial setelan arus","Atur sama dengan arus nominal motor pada pelat nama.",[-.22,.02,.48]);
  part(g,"Tombol RESET","Ditekan setelah trip dan bimetal dingin.",[.22,.1,.5]);
  part(g,"Indikator trip","Berubah warna saat TOR bekerja karena beban lebih.",[0,-.2,.44]);
  part(g,"Kontak 95-96 (NC)","Diseri dengan tombol OFF; membuka saat beban lebih.",[-.15,-.36,.44]);
  part(g,"Kontak 97-98 (NO)","Untuk lampu tanda gangguan.",[.2,-.36,.44]);
  part(g,"Pin ke kontaktor","Masuk langsung ke terminal 2-4-6 kontaktor.",[.3,.7,0]);
  g.userData.anim=t=>{const tr=Math.sin(t*Math.PI*2)>0;flag.material=tr?MAT.orange:MAT.grey;rst.position.z=tr?.44:.42};
  g.userData.reset=()=>{flag.material=MAT.grey;rst.position.z=.44};
  return g;
}
function pushButtonModel(){
  const g=new T.Group();
  g.add(roundedBox(1.5,.8,.55,.08,mat(0xd6dade)));
  const mk=(x,col,txt,name)=>{const b=new T.Group();const bz=cyl(.22,.22,.06,MAT.dark,32);bz.rotation.x=Math.PI/2;b.add(bz);const btn=cyl(.17,.17,.12,col,32);btn.rotation.x=Math.PI/2;btn.position.z=.07;b.add(btn);b.position.set(x,.05,.3);g.add(b);
    const l=txtPlane([[txt,30,32]],128,44,.36,.12,"#f3f2ee");l.position.set(x,-.28,.29);g.add(l);return btn};
  const on=mk(-.38,MAT.green,"ON · 3-4 NO"),off=mk(.38,MAT.red,"OFF · 1-2 NC");
  part(g,"Tombol ON (hijau)","Kontak NO 3-4: menutup hanya selama ditekan.",[-.38,.05,.45]);
  part(g,"Tombol OFF (merah)","Kontak NC 1-2: membuka saat ditekan untuk memutus kumparan.",[.38,.05,.45]);
  part(g,"Kotak tombol","Isolasi plastik; kabel masuk dari bawah melalui gland.",[0,.4,.3]);
  g.userData.anim=t=>{const a=t<.5;on.position.z=a&&Math.sin(t*Math.PI*4)>0?.02:.07;off.position.z=!a&&Math.sin(t*Math.PI*4)>0?.02:.07};
  return g;
}
function tdrModel(){
  const g=new T.Group();
  const base=roundedBox(.8,.25,.8,.04,MAT.black);base.position.y=-.65;g.add(base);
  g.add(roundedBox(.7,1.1,.7,.08,mat(0xd6dade)));
  const face=txtPlane([["TDR · ON-DELAY",28,34],["0 · · 5 · · 10 s",26,170]],200,200,.52,.52,"#eef0f2");face.position.set(0,.1,.36);g.add(face);
  const knob=new T.Group();const k0=cyl(.13,.13,.08,MAT.white,32);k0.rotation.x=Math.PI/2;knob.add(k0);const kp=box(.025,.1,.02,MAT.red);kp.position.set(0,.05,.05);knob.add(kp);knob.position.set(0,.08,.4);g.add(knob);
  const led1=cyl(.03,.03,.02,mat(0x2e9a46,{emissive:0x2e9a46,emissiveIntensity:.8}));led1.rotation.x=Math.PI/2;led1.position.set(-.15,.42,.37);g.add(led1);
  const ledM=mat(0xe8621c,{emissive:0xe8621c,emissiveIntensity:.1});const led2=cyl(.03,.03,.02,ledM);led2.rotation.x=Math.PI/2;led2.position.set(.15,.42,.37);g.add(led2);
  part(g,"Dial waktu tunda","Atur lama hubungan bintang, umumnya 3–10 detik.",[0,.08,.48]);
  part(g,"LED keluaran","Menyala saat waktu habis dan kontak berpindah.",[.15,.42,.42]);
  part(g,"Soket 8 kaki","Kaki 2-7 = A1-A2, 1-4 = 55-56 (NC), 1-3 = 67-68 (NO).",[0,-.65,.42]);
  g.userData.anim=t=>{knob.rotation.z=-t*Math.PI*1.5;ledM.emissiveIntensity=t>.7?2:.1};
  g.userData.reset=()=>{knob.rotation.z=0;ledM.emissiveIntensity=.1};
  return g;
}
function motorModel(){
  const g=new T.Group();const paint=mat(0x2f6fa8,{roughness:.45,metalness:.2});
  const body=cyl(.55,.55,1.5,paint,48);body.rotation.z=Math.PI/2;g.add(body);
  for(let i=0;i<11;i++){const fin=cyl(.6,.6,.035,paint,40);fin.rotation.z=Math.PI/2;fin.position.x=-.62+i*.124;g.add(fin)}
  const bellF=cyl(.5,.55,.15,paint,40);bellF.rotation.z=Math.PI/2;bellF.position.x=.82;g.add(bellF);
  const fanC=cyl(.56,.5,.4,MAT.dark,40);fanC.rotation.z=Math.PI/2;fanC.position.x=-.95;g.add(fanC);
  const grill=new T.Mesh(new T.CircleGeometry(.48,32),mat(0x1d2126,{wireframe:true}));grill.rotation.y=-Math.PI/2;grill.position.x=-1.16;g.add(grill);
  const shaft=new T.Group();const sh=cyl(.08,.08,.5,MAT.chrome,24);sh.rotation.z=Math.PI/2;shaft.add(sh);const key=box(.3,.03,.04,MAT.steel);key.position.set(0,.085,0);shaft.add(key);shaft.position.x=1.12;g.add(shaft);
  const tb=roundedBox(.42,.24,.42,.04,paint);tb.position.set(.1,.66,0);g.add(tb);
  const lid=roundedBox(.46,.05,.46,.03,paint);lid.position.set(.1,.8,0);g.add(lid);
  const eye=new T.Mesh(new T.TorusGeometry(.08,.025,8,20),MAT.steel);eye.position.set(-.35,.62,0);g.add(eye);
  [-.5,.5].forEach(x=>{const f=box(.32,.18,1.0,paint);f.position.set(x,-.52,0);g.add(f)});
  const np=txtPlane([["MOTOR 3~  2,2 kW",30,40],["Δ 400 V  4,7 A  cos φ 0,82",22,80],["1420 rpm  50 Hz  IP55",22,112]],256,128,.56,.28,"#dfe3e8");np.position.set(.1,.0,.56);np.rotation.y=0;g.add(np);
  part(g,"Kotak terminal","U1-V1-W1 dan U2-V2-W2; plat penghubung menentukan Y atau Δ.",[.1,.85,0]);
  part(g,"Poros & pasak","Meneruskan putaran ke beban; wajib diberi pelindung.",[1.3,0,0]);
  part(g,"Tutup kipas","Kipas pendingin di ujung belakang poros.",[-1.15,.2,0]);
  part(g,"Pelat nama","Data daya, tegangan, arus, cos φ, dan putaran.",[.1,0,.6]);
  part(g,"Sirip pendingin","Memperluas permukaan untuk membuang panas.",[-.3,.58,.2]);
  g.userData.anim=t=>{shaft.rotation.x=t*Math.PI*30};
  return g;
}
function earthTester(){
  const g=new T.Group();
  g.add(roundedBox(1.4,.6,1.0,.1,mat(0xf2b705)));
  const top=roundedBox(1.2,.04,.8,.05,MAT.dark);top.position.y=.31;g.add(top);
  const lcd=labelPlane(256,128,(x,w,h)=>{x.fillStyle="#c9d6b4";x.fillRect(0,0,w,h);x.fillStyle="#1d2a14";x.font="bold 60px monospace";x.textAlign="right";x.fillText("3.42",w-50,86);x.font="bold 30px monospace";x.fillText("Ω",w-14,86)},.56,.28);lcd.rotation.x=-Math.PI/2;lcd.position.set(-.2,.335,-.1);g.add(lcd);
  [["E",MAT.green,-.45],["P",MAT.yellow,-.15],["C",MAT.red,.15]].forEach(([n,m,x])=>{const j=cyl(.05,.05,.06,m);j.position.set(x,.34,.3);g.add(j)});
  [[1.15,MAT.yellow],[1.65,MAT.red]].forEach(([x,m],i)=>{const sp=cyl(.03,.005,.7,MAT.steel);sp.position.set(x,-.05,.2);g.add(sp);const hd=cyl(.06,.06,.06,m);hd.position.set(x,.32,.2);g.add(hd);
    g.add(tube([[i?.15:-.15,.36,.3],[x*.5,.6,.5],[x,.36,.2]],.018,m,24))});
  const reel=cyl(.2,.2,.15,MAT.dark);reel.rotation.x=Math.PI/2;reel.position.set(-1.0,-.1,.3);g.add(reel);
  part(g,"Layar Ω","Tahanan pentanahan; ≤ 5 Ω untuk rumah tinggal.",[-.2,.36,-.1]);
  part(g,"Terminal E-P-C","E ke elektroda, P ke pasak 5 m, C ke pasak 10 m.",[-.15,.4,.3]);
  part(g,"Pasak bantu","Ditancapkan segaris dari elektroda yang diuji.",[1.15,0,.25]);
  part(g,"Gulungan kabel","Kabel uji panjang untuk menjangkau pasak.",[-1.0,-.1,.4]);
  return g;
}
function generic(shape,color,name){
  const g=new T.Group();const m=mat(new T.Color(color||"#e3a400"),{roughness:.45});
  g.add(shape==="silinder"?cyl(.6,.6,1.8,m,48):roundedBox(1.5,1.5,1.5,.15,m));
  const lab=labelPlane(512,160,(x,w,h)=>{x.fillStyle="#f3f2ee";x.fillRect(0,0,w,h);x.fillStyle="#15202b";x.font="bold 56px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText((name||"Materi").slice(0,22),w/2,100)},1.1,.34);
  lab.position.set(0,0,shape==="silinder"?.61:.76);g.add(lab);
  return g;
}
function buildModel(t){
  switch(t.model){
    case"tangKombinasi":case"tangPotong":case"tangKupas":return pliers(t.model);
    case"obeng":return screwdrivers();case"multimeter":return multimeter();case"tespen":return tespen();
    case"tangAmpere":return clampMeter();case"megger":return megger();case"mcb":return mcbModel("C10");
    case"kabel":return cables();case"stopKontak":return socket();case"saklar":return switchModel();
    case"helm":return helmet();case"sepatu":return shoe();case"sarungTangan":return glove();
    case"kontaktor":return contactorModel();case"tor":return torModel();case"tombol":return pushButtonModel();
    case"tdr":return tdrModel();case"motor":return motorModel();case"earth":return earthTester();
    default:return generic(t.model,t.color,t.name);
  }
}
function setupRenderer(canvas){
  const r=new T.WebGLRenderer({canvas,antialias:true,alpha:true});
  r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  return r;
}
function envFor(r,scene){if(T.RoomEnvironment){const pm=new T.PMREMGenerator(r);scene.environment=pm.fromScene(new T.RoomEnvironment(),.04).texture}}
function sizeR(r,cam,canvas){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return false;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(cam.userData.fit)cam.userData.fit();return true}
/* ================= TOOLKIT ================= */
const tv={on:false,anim:false,animT:0,showParts:true,parts:[],selPart:-1};
let curTool=null,catFilter="all";
function initViewer(){
  if(!T||tv.r)return;
  const canvas=$("#tvCanvas");
  tv.r=setupRenderer(canvas);tv.scene=new T.Scene();envFor(tv.r,tv.scene);
  tv.cam=new T.PerspectiveCamera(36,1,.1,100);tv.cam.position.set(0,1.2,5.2);
  tv.ctl=new T.OrbitControls(tv.cam,canvas);tv.ctl.enableDamping=true;tv.ctl.autoRotate=false;tv.ctl.autoRotateSpeed=1.6;tv.ctl.minDistance=2.2;tv.ctl.maxDistance=9;tv.ctl.target.set(0,1.1,0);
  tv.scene.add(new T.HemisphereLight(0xffffff,0x8a94a0,.55));
  const d=new T.DirectionalLight(0xffffff,1.15);d.position.set(3,6,4);d.castShadow=true;d.shadow.mapSize.set(1024,1024);Object.assign(d.shadow.camera,{left:-3,right:3,top:3,bottom:-3});d.shadow.radius=4;tv.scene.add(d);
  const fill=new T.DirectionalLight(0xfff1d6,.35);fill.position.set(-4,2,-3);tv.scene.add(fill);
  const ground=new T.Mesh(new T.CircleGeometry(3,48),new T.ShadowMaterial({opacity:.2}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;tv.scene.add(ground);
  const ring=new T.Mesh(new T.RingGeometry(1.75,1.79,96),new T.MeshBasicMaterial({color:0xe3a400,transparent:true,opacity:.55}));ring.rotation.x=-Math.PI/2;ring.position.y=.002;tv.ring=ring;tv.scene.add(ring);
  tv.holder=new T.Group();tv.scene.add(tv.holder);
  new ResizeObserver(()=>sizeR(tv.r,tv.cam,canvas)).observe(canvas);
  $("#tvAuto").onclick=e=>{tv.ctl.autoRotate=!tv.ctl.autoRotate;e.currentTarget.setAttribute("aria-pressed",tv.ctl.autoRotate)};
  $("#tvReset").onclick=resetView;
  $("#tvParts").onclick=e=>{tv.showParts=!tv.showParts;e.currentTarget.setAttribute("aria-pressed",tv.showParts);$("#partLayer").hidden=!tv.showParts};
  $("#tvAnim").onclick=()=>{tv.anim=!tv.anim;tv.animT=0;$("#tvAnim").textContent=tv.anim?"Hentikan peragaan":"Peragakan";if(!tv.anim&&tv.model&&tv.model.userData.reset)tv.model.userData.reset();if(!tv.anim&&tv.model&&tv.model.userData.anim)tv.model.userData.anim(0)};
}
function resetView(){if(!tv.cam)return;const y=tv.tgtY||1.1;tv.cam.position.set(0,y+.35,5.2);tv.ctl.target.set(0,y,0)}
function showModel(t){
  if(!T||!tv.holder)return;
  tv.holder.clear();tv.anim=false;$("#tvAnim").textContent="Peragakan";
  const m=buildModel(t);
  const b=new T.Box3().setFromObject(m),sz=b.getSize(new T.Vector3()),mx=Math.max(sz.x,sz.y,sz.z);
  const s=2.4/mx;m.scale.multiplyScalar(s);m.updateMatrixWorld(true);
  const b2=new T.Box3().setFromObject(m),c=b2.getCenter(new T.Vector3());
  m.position.x-=c.x;m.position.z-=c.z;m.position.y-=b2.min.y;
  tv.holder.add(m);tv.model=m;tv.holder.scale.setScalar(.6);tv.grow=0;
  tv.tgtY=(b2.max.y-b2.min.y)/2;tv.ctl.target.set(0,tv.tgtY,0);
  tv.parts=(m.userData.parts||[]);tv.selPart=-1;
  $("#tvAnim").hidden=!m.userData.anim;
  $("#partLayer").innerHTML=tv.parts.map((p,i)=>`<button class="part-tag" data-i="${i}"><i>${i+1}</i>${esc(p.name)}</button>`).join("");
  $$("#partLayer .part-tag").forEach(b=>b.onclick=()=>selectPart(+b.dataset.i));
}
function selectPart(i){
  tv.selPart=i;
  $$("#partLayer .part-tag").forEach(b=>b.classList.toggle("on",+b.dataset.i===i));
  $$("#partsList li").forEach(li=>li.classList.toggle("on",+li.dataset.i===i));
  const p=tv.parts[i];if(p){const el=$("#partDesc");if(el)el.innerHTML=`<b>${esc(p.name)}.</b> ${esc(p.desc)}`}
}
const _v=T?new T.Vector3():null;
function updatePartTags(){
  if(!tv.showParts||!tv.parts.length)return;
  const cv=$("#tvCanvas"),w=cv.clientWidth,h=cv.clientHeight;
  const camDir=new T.Vector3();tv.cam.getWorldDirection(camDir);
  const tags=$("#partLayer").children;
  tv.parts.forEach((p,i)=>{const el=tags[i];if(!el)return;p.obj.getWorldPosition(_v);
    const toP=_v.clone().sub(tv.cam.position);const behind=toP.dot(camDir)<0;
    _v.project(tv.cam);const x=(_v.x*.5+.5)*w,y=(-_v.y*.5+.5)*h;
    el.style.left=x+"px";el.style.top=y+"px";el.style.opacity=behind?0:1;el.style.pointerEvents=behind?"none":"auto"});
}
function renderChips(){
  const cats=["all",...new Set(tools().map(t=>t.cat))];
  $("#tkChips").innerHTML=cats.map(c=>`<button class="chip" data-c="${esc(c)}" aria-pressed="${c===catFilter}">${c==="all"?"Semua":esc(CATS[c]||c)}</button>`).join("");
  $$("#tkChips .chip").forEach(b=>b.onclick=()=>{catFilter=b.dataset.c;renderChips();renderList()});
}
function renderList(){
  const q=$("#tkSearch").value.trim().toLowerCase();const st=new Set(REC.studied);
  const list=tools().filter(t=>(catFilter==="all"||t.cat===catFilter)&&(!q||(t.name+" "+(t.en||"")).toLowerCase().includes(q)));
  $("#tkItems").innerHTML=list.length?list.map(t=>`<button class="tool-item" data-id="${esc(t.id)}" aria-current="${!!(curTool&&curTool.id===t.id)}"><span class="dot" style="background:${CATCOL[t.cat]||"#64748b"}"></span><span><span class="nm">${esc(t.name)}</span><span class="ct">${esc(CATS[t.cat]||t.cat)}</span></span><span class="done">${st.has(t.id)?"✓":""}</span></button>`).join(""):`<p class="muted small" style="padding:8px">Tidak ada alat yang cocok.</p>`;
  $$("#tkItems .tool-item").forEach(b=>b.onclick=()=>selectTool(b.dataset.id));
  const T_=tools();$("#tkCount").textContent=`${T_.filter(t=>st.has(t.id)).length} / ${T_.length} alat dipelajari`;
}
function selectTool(id){
  const all=tools();const t=all.find(x=>x.id===id)||all[0];if(!t)return;
  curTool=t;$("#tvName").textContent=t.name;$("#tvEn").textContent=t.en||"";
  const done=REC.studied.includes(t.id),link=(curFase()==="F"?LABLINK_F:LABLINK_E)[t.model];
  showModel(t);
  $("#tkDetail").innerHTML=`
    <div class="row" style="justify-content:space-between"><span class="badge" style="border-color:${CATCOL[t.cat]||"#64748b"}">${esc(CATS[t.cat]||t.cat)}</span>${done?'<span class="badge ok">✓ Sudah dipelajari</span>':""}</div>
    <div class="pemantik"><h4>Pertanyaan pemantik</h4><p>${esc(t.pemantik||"Apa yang ingin kamu ketahui tentang alat ini?")}</p></div>
    <div><h4>Fungsi utama</h4><p style="margin-top:6px">${esc(t.desc)}</p></div>
    ${tv.parts.length?`<div><h4>Bagian-bagian</h4><ul class="parts-list" id="partsList">${tv.parts.map((p,i)=>`<li data-i="${i}"><i>${i+1}</i><span>${esc(p.name)}<small>${esc(p.desc)}</small></span></li>`).join("")}</ul></div>`:""}
    ${t.steps&&t.steps.length?`<div><h4>Langkah penggunaan</h4><ol>${t.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div>`:""}
    ${t.safety&&t.safety.length?`<div class="k3box"><h4>Perhatian K3</h4><ul>${t.safety.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`:""}
    <div class="row">
      <button class="btn sm ${done?"":"primary"}" id="bStudy">${done?"Tandai belum dipelajari":"Tandai sudah dipelajari"}</button>
      ${link?`<a class="btn sm" href="#${link}">Praktikkan</a>`:""}
    </div>`;
  $$("#partsList li").forEach(li=>li.onclick=()=>selectPart(+li.dataset.i));
  $("#bStudy").onclick=()=>{const s=new Set(REC.studied);if(s.has(t.id))s.delete(t.id);else{s.add(t.id);addLog("Mempelajari alat: "+t.name)}REC.studied=[...s];save();selectTool(t.id)};
  renderList();
}
function refreshToolsUI(){if(App.route==="toolkit"){renderChips();renderList();if(curTool){const t=tools().find(x=>x.id===curTool.id);if(!t&&tools()[0])selectTool(tools()[0].id)}}}
function enterToolkit(){
  initViewer();renderChips();
  if(!curTool||!tools().find(t=>t.id===curTool.id))selectTool(tools()[0]&&tools()[0].id);else{renderList()}
  requestAnimationFrame(()=>{if(tv.r){sizeR(tv.r,tv.cam,$("#tvCanvas"));resetView()}});
}
$("#tkSearch").oninput=renderList;
/* ================= PRAKTIKUM: DEFINISI ================= */
const CT={
  src:{terms:{L:[-.18,-.6],N:[0,-.6],PE:[.18,-.6]},names:{L:"L",N:"N",PE:"PE"}},
  mcb:{terms:{in:[0,.42],out:[0,-.42]},names:{in:"masuk",out:"keluar"}},
  nbus:{terms:{n1:[-.21,0],n2:[-.07,0],n3:[.07,0],n4:[.21,0]},names:{n1:"1",n2:"2",n3:"3",n4:"4"}},
  pebus:{terms:{p1:[-.21,0],p2:[-.07,0],p3:[.07,0],p4:[.21,0]},names:{p1:"1",p2:"2",p3:"3",p4:"4"}},
  sw1:{terms:{in:[-.09,.34],out:[.09,.34]},names:{in:"IN",out:"OUT"}},
  sw2:{terms:{com:[-.15,.34],o1:[0,.34],o2:[.15,.34]},names:{com:"COM",o1:"1",o2:"2"}},
  swt:{terms:{com:[-.15,.34],t1:[0,.34],t2:[.15,.34]},names:{com:"COM",t1:"T1",t2:"T2"}},
  lamp:{terms:{a:[-.09,.3],b:[.09,.3]},names:{a:"1",b:"2"}},
  sock:{terms:{L:[-.15,.34],N:[0,.34],PE:[.15,.34]},names:{L:"L",N:"N",PE:"PE"}}
};
const COMMON=[
  {id:"src",type:"src",x:-2.7,y:1.3,label:"Sumber"},
  {id:"mcb",type:"mcb",x:-1.75,y:1.3,label:"MCB"},
  {id:"nb",type:"nbus",x:-1.75,y:.2,label:"Rel N"},
  {id:"pb",type:"pebus",x:-1.75,y:-.35,label:"Rel PE"}
];
const PREWIRE=[["src.L","mcb.in","L"],["src.N","nb.n1","N"],["src.PE","pb.p1","PE"]];
const LOADS=[
 {n:"Tidak ada beban",w:0,pf:1},{n:"Kipas angin 45 W",w:45,pf:.9},{n:"Pompa air 250 W",w:250,pf:.8},
 {n:"Rice cooker 350 W",w:350,pf:1},{n:"Setrika 350 W",w:350,pf:1},{n:"Dispenser 420 W",w:420,pf:1},
 {n:"Microwave 800 W",w:800,pf:.95},{n:"Pemanas air 1200 W",w:1200,pf:1}
];
const ISO={baik:{n:"Isolasi baik",v:550},turun:{n:"Isolasi menurun (kabel tua)",v:3.2},lembap:{n:"Isolasi lembap / bocor",v:.35}};

const lit=(r,id)=>{const l=r.loads.find(x=>x.id===id);return!!l&&l.frac>.55};
const dvOf=(r,id)=>{const l=r.loads.find(x=>x.id===id);return l?Math.abs(l.dv):0};
const pairIs=(e,a,b)=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a);
const pairHas=(e,arr)=>arr.includes(e.a)||arr.includes(e.b);
const LOTO_M=(lampIds)=>({t:"Terapkan LOTO, lalu buktikan terminal lampu 0 V dengan multimeter.",on:"mm",ok:(e,c)=>c.S.loto&&!c.energized&&pairHas(e,lampIds)&&e.v<1});

const PRAKS=[
{id:"p1",fase:"E",no:"Praktikum 1",title:"Saklar Tunggal",level:"Dasar",
 short:"Satu lampu dikendalikan satu saklar. Fondasi semua instalasi penerangan.",
 tujuan:["Merangkai instalasi lampu dengan saklar tunggal sesuai PUIL.","Memastikan saklar memutus fasa.","Mengukur tegangan kerja lampu."],
 bahan:["MCB C4 1 fasa","Saklar tunggal","Fitting + lampu","Kabel NYA 1,5 mm² coklat & biru","Multimeter, test pen"],
 comps:[{id:"S1",type:"sw1",x:-.1,y:.05,label:"Saklar"},{id:"L1",type:"lamp",x:1.6,y:1.2,label:"Lampu"}],
 hint:["MCB keluar → Saklar IN (coklat)","Saklar OUT → Lampu 1 (coklat)","Rel N → Lampu 2 (biru)"],
 test:st=>({L1:!!st.S1}),
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Nyalakan lampu: naikkan MCB, lalu saklar ON.",on:"state",ok:(e,c)=>c.S.ok&&lit(c.r,"L1")},
  {t:"Ukur tegangan antara kedua terminal lampu saat menyala (±230 V).",on:"mm",ok:e=>pairIs(e,"L1.a","L1.b")&&e.v>200},
  {t:"Matikan saklar, lalu buktikan dengan test pen bahwa terminal fasa lampu tidak bertegangan.",on:"tp",ok:(e,c)=>c.S.ok&&c.energized&&!c.S.sw.S1&&["L1.a","L1.b"].includes(e.p)&&c.role(e.p)==="L"&&!e.lit},
  LOTO_M(["L1.a","L1.b"])
 ]},
{id:"p2",fase:"E",no:"Praktikum 2",title:"Saklar Seri (Ganda)",level:"Dasar",
 short:"Dua lampu dikendalikan dari satu saklar ganda dengan dua tombol.",
 tujuan:["Merangkai saklar seri untuk dua kelompok lampu.","Memahami terminal COM sebagai titik bersama fasa.","Membuktikan arus total = jumlah arus cabang."],
 bahan:["MCB C4","Saklar seri (ganda)","2 fitting + lampu","Kabel NYA coklat & biru","Tang ampere"],
 comps:[{id:"S1",type:"sw2",x:-.1,y:.05,label:"Saklar seri"},{id:"L1",type:"lamp",x:1.0,y:1.25,label:"Lampu 1"},{id:"L2",type:"lamp",x:2.3,y:1.25,label:"Lampu 2"}],
 hint:["MCB keluar → Saklar COM (coklat)","Saklar 1 → Lampu 1 terminal 1 (coklat)","Saklar 2 → Lampu 2 terminal 1 (coklat)","Rel N → Lampu 1 terminal 2 (biru)","Rel N → Lampu 2 terminal 2 (biru)"],
 test:st=>({L1:!!st["S1.a"],L2:!!st["S1.b"]}),
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Nyalakan lampu 1 saja.",on:"state",ok:(e,c)=>c.S.ok&&lit(c.r,"L1")&&!lit(c.r,"L2")},
  {t:"Nyalakan lampu 2 saja.",on:"state",ok:(e,c)=>c.S.ok&&!lit(c.r,"L1")&&lit(c.r,"L2")},
  {t:"Nyalakan kedua lampu, lalu ukur dengan tang ampere: arus lampu 1, lampu 2, dan total.",on:"ta",ok:(e,c)=>{if(!(lit(c.r,"L1")&&lit(c.r,"L2")))return false;const f=c.S.flags.ta=c.S.flags.ta||{};f[e.w]=1;return f["load:L1"]&&f["load:L2"]&&f.main}},
  LOTO_M(["L1.a","L1.b","L2.a","L2.b"])
 ]},
{id:"p3",fase:"E",no:"Praktikum 3",title:"Saklar Tukar (Hotel)",level:"Menengah",
 short:"Satu lampu dinyalakan dan dimatikan dari dua tempat, seperti lampu tangga.",
 tujuan:["Merangkai dua saklar tukar dengan dua kabel penghubung (traveler).","Menganalisis kondisi tegangan pada kabel penghubung.","Menerapkan instalasi tangga atau lorong."],
 bahan:["MCB C4","2 saklar tukar","Fitting + lampu","Kabel NYA coklat & biru","Multimeter"],
 comps:[{id:"SA",type:"swt",x:-.55,y:.05,label:"Saklar A (bawah)"},{id:"SB",type:"swt",x:2.25,y:.05,label:"Saklar B (atas)"},{id:"L1",type:"lamp",x:.85,y:1.3,label:"Lampu tangga"}],
 hint:["MCB keluar → Saklar A COM (coklat)","Saklar A T1 → Saklar B T1 (coklat, penghubung)","Saklar A T2 → Saklar B T2 (coklat, penghubung)","Saklar B COM → Lampu 1 (coklat)","Rel N → Lampu 2 (biru)"],
 test:"toggle",
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Naik tangga: nyalakan lampu dari saklar A, lalu matikan dari saklar B.",on:"toggle",ok:(e,c)=>{const f=c.S.flags;if(!c.S.ok)return false;if(e.sw==="SA"&&lit(c.r,"L1"))f.aOn=1;return e.sw==="SB"&&f.aOn&&!lit(c.r,"L1")}},
  {t:"Turun tangga: nyalakan dari saklar B, lalu matikan dari saklar A.",on:"toggle",ok:(e,c)=>{const f=c.S.flags;if(!c.S.ok)return false;if(e.sw==="SB"&&lit(c.r,"L1"))f.bOn=1;return e.sw==="SA"&&f.bOn&&!lit(c.r,"L1")}},
  {t:"Saat lampu mati, ukur T1 dan T2 terhadap rel N: satu ±230 V dan satu 0 V.",on:"mm",ok:(e,c)=>{if(!c.energized||lit(c.r,"L1"))return false;const tr=["SA.t1","SA.t2","SB.t1","SB.t2"];let t=null,o=null;if(tr.includes(e.a)){t=e.a;o=e.b}else if(tr.includes(e.b)){t=e.b;o=e.a}if(!t||c.role(o)!=="N")return false;const f=c.S.flags.trav=c.S.flags.trav||{};f[t.slice(-2)]=e.v;return(f.t1>200&&f.t2!==undefined&&f.t2<5)||(f.t2>200&&f.t1!==undefined&&f.t1<5)}},
  LOTO_M(["L1.a","L1.b"])
 ]},
{id:"p4",fase:"E",no:"Praktikum 4",title:"Stop Kontak & Pengaman",level:"Menengah",
 short:"Pasang stop kontak berpentanahan, uji beban lebih, hubung singkat, dan tahanan isolasi.",
 tujuan:["Memasang stop kontak dengan PE sesuai PUIL.","Menganalisis kerja MCB terhadap beban lebih dan hubung singkat.","Mengukur tahanan isolasi dengan megger."],
 bahan:["MCB C4","Stop kontak berpentanahan","Kabel NYA coklat, biru, hijau-kuning","Beban uji","Multimeter, tang ampere, megger"],
 comps:[{id:"K1",type:"sock",x:.7,y:-.15,label:"Stop kontak"}],
 hint:["MCB keluar → Stop kontak L (coklat)","Rel N → Stop kontak N (biru)","Rel PE → Stop kontak PE (hijau-kuning)"],
 test:"socket",extra:["load","iso","short"],
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Ukur tegangan L–N stop kontak (±230 V).",on:"mm",ok:e=>pairIs(e,"K1.L","K1.N")&&e.v>200},
  {t:"Ukur tegangan N–PE stop kontak (mendekati 0 V).",on:"mm",ok:(e,c)=>c.energized&&pairIs(e,"K1.N","K1.PE")&&e.v<5},
  {t:"Pasang beban, lalu jepit fasa dan netral bersamaan dengan tang ampere (hasil 0 A).",on:"ta",ok:(e,c)=>e.w==="both"&&c.r.Itot>.05},
  {t:"Picu MCB trip karena beban lebih, kurangi beban, lalu naikkan MCB kembali.",on:"reset",ok:(e,c)=>c.S.overTrip&&c.r.Itot<=c.S.rating},
  {t:"Uji tahanan isolasi L–PE dengan megger: MCB OFF, LOTO terpasang, beban dicabut.",on:"mg",ok:e=>e.valid&&e.lpe},
  {t:"Simulasikan hubung singkat dan amati MCB trip seketika.",on:"trip",ok:e=>e.kind==="mag"}
 ]},
{id:"p5",fase:"E",no:"Praktikum 5",title:"Lampu Seri vs Paralel",level:"Analisis",
 short:"Bandingkan nyala, tegangan, dan arus dua lampu pijar yang dirangkai seri dan paralel.",
 tujuan:["Merangkai lampu secara seri dan paralel.","Membuktikan pembagian tegangan pada rangkaian seri.","Menjelaskan mengapa instalasi rumah dipasang paralel."],
 bahan:["MCB C4","2 lampu pijar 60 W","Kabel NYA coklat & biru","Multimeter, tang ampere"],
 comps:[{id:"L1",type:"lamp",x:.1,y:1.15,label:"Lampu 1 (60 W)"},{id:"L2",type:"lamp",x:1.9,y:1.15,label:"Lampu 2 (60 W)"}],
 hint:["SERI: MCB keluar → L1 terminal 1, L1 terminal 2 → L2 terminal 1, L2 terminal 2 → Rel N","PARALEL: MCB keluar → L1 terminal 1 dan L2 terminal 1 (coklat); Rel N → L1 terminal 2 dan L2 terminal 2 (biru)","Turunkan MCB setiap kali mengubah rangkaian."],
 test:"free",fixedLamp:{w:60,pf:1,n:"Pijar 60 W"},
 missions:[
  {t:"Rangkai kedua lampu secara SERI, nyalakan, dan amati nyalanya yang redup.",on:"state",ok:(e,c)=>c.energized&&[dvOf(c.r,"L1"),dvOf(c.r,"L2")].every(v=>v>90&&v<140)},
  {t:"Ukur tegangan pada salah satu lampu saat rangkaian seri (±115 V).",on:"mm",ok:e=>(pairIs(e,"L1.a","L1.b")||pairIs(e,"L2.a","L2.b"))&&e.v>90&&e.v<140},
  {t:"Ukur arus total rangkaian seri dengan tang ampere.",on:"ta",ok:(e,c)=>{const ser=[dvOf(c.r,"L1"),dvOf(c.r,"L2")].every(v=>v>90&&v<140);if(e.w==="main"&&ser){c.S.flags.Iser=e.I;return true}return false}},
  {t:"Rangkai ulang secara PARALEL; kedua lampu menyala terang.",on:"state",ok:(e,c)=>c.energized&&dvOf(c.r,"L1")>200&&dvOf(c.r,"L2")>200},
  {t:"Ukur arus total rangkaian paralel, lalu bandingkan dengan arus seri.",on:"ta",ok:(e,c)=>e.w==="main"&&dvOf(c.r,"L1")>200&&dvOf(c.r,"L2")>200&&c.S.flags.Iser!==undefined}
 ]}
];

/* ================= PRAKTIKUM: MESIN ================= */
let S=null; // state praktikum aktif
const L={}; // three.js lab
function pdef(){return PRAKS.find(p=>p.id===S.pid)}
function praksOf(f){return PRAKS.filter(p=>p.fase===f)}
function isF(){return !!S&&pdef().fase==="F"}
function allComps(){return (pdef().fase==="F"?COMMON_F:COMMON).concat(pdef().comps)}
function isLocked(t){return LOCKED.has(t)||(isF()&&lockedF(t))}
function termList(){const out=[];allComps().forEach(c=>Object.keys(CT[c.type].terms).forEach(k=>out.push(c.id+"."+k)));return out}
function termName(t){const[cid,k]=t.split(".");const c=allComps().find(x=>x.id===cid);if(!c)return t;return c.label+" · "+CT[c.type].names[k]}
function termPos(t){const[cid,k]=t.split(".");const c=allComps().find(x=>x.id===cid);const o=CT[c.type].terms[k];return[c.x+o[0],c.y+o[1]]}
const LOCKED=new Set(["src.L","src.N","src.PE","mcb.in"]);
function swKeys(){const k=[];pdef().comps.forEach(c=>{if(c.type==="sw1"||c.type==="swt")k.push(c.id);if(c.type==="sw2"){k.push(c.id+".a");k.push(c.id+".b")}});return k}
function energized(){return S.mcb&&!S.tripped}
function lampSpec(){return pdef().fixedLamp||S.lamp}

function solve(opt={}){
  const sw=opt.sw||S.sw,closedMcb=opt.allClosed?true:(opt.mcb!==undefined?opt.mcb:energized());
  const terms=termList(),par={};terms.forEach(t=>par[t]=t);
  const f=x=>par[x]===x?x:(par[x]=f(par[x]));const u=(a,b)=>{if(par[a]===undefined||par[b]===undefined)return;par[f(a)]=f(b)};
  S.wires.forEach(w=>u(w.a,w.b));
  if(closedMcb)u("mcb.in","mcb.out");
  allComps().forEach(c=>{const id=c.id;
    if(c.type==="nbus"){u(id+".n1",id+".n2");u(id+".n2",id+".n3");u(id+".n3",id+".n4")}
    if(c.type==="pebus"){u(id+".p1",id+".p2");u(id+".p2",id+".p3");u(id+".p3",id+".p4")}
    if(c.type==="sw1"&&(opt.allClosed||sw[id]))u(id+".in",id+".out");
    if(c.type==="sw2"){if(opt.allClosed||sw[id+".a"])u(id+".com",id+".o1");if(opt.allClosed||sw[id+".b"])u(id+".com",id+".o2")}
    if(c.type==="swt"){if(opt.allClosed||!sw[id])u(id+".com",id+".t1");if(opt.allClosed||sw[id])u(id+".com",id+".t2")}
  });
  if(opt.short||S.shortNow)allComps().forEach(c=>{if(c.type==="sock")u(c.id+".L",c.id+".N")});
  const H=f("src.L"),Ng=f("src.N"),Pg=f("src.PE");
  const short=H===Ng||H===Pg;
  const loads=[];const ls=lampSpec();
  allComps().forEach(c=>{
    if(c.type==="lamp")loads.push({id:c.id,ta:c.id+".a",tb:c.id+".b",Z:230*230*ls.pf/ls.w,P:ls.w,pf:ls.pf});
    if(c.type==="sock"&&S.load.w>0)loads.push({id:c.id,ta:c.id+".L",tb:c.id+".N",Z:230*230*S.load.pf/S.load.w,P:S.load.w,pf:S.load.pf});
  });
  const V={};V[H]=230;V[Ng]=0;V[Pg]=0;
  if(!short){
    const adj={};loads.forEach(l=>{l.ga=f(l.ta);l.gb=f(l.tb);if(l.ga===l.gb)return;(adj[l.ga]=adj[l.ga]||[]).push([l.gb,l.Z]);(adj[l.gb]=adj[l.gb]||[]).push([l.ga,l.Z])});
    const fixed=new Set([H,Ng,Pg]);const unk=Object.keys(adj).filter(g=>!fixed.has(g));
    // komponen terhubung dengan acuan?
    const reach={};const bfs=s=>{const seen=new Set([s]),q=[s];while(q.length){const g=q.pop();(adj[g]||[]).forEach(([n])=>{if(!seen.has(n)){seen.add(n);q.push(n)}})}return seen};
    const fromH=bfs(H),fromN=bfs(Ng),fromP=bfs(Pg);
    unk.forEach(g=>{V[g]=fromH.has(g)&&!(fromN.has(g)||fromP.has(g))?230:(fromN.has(g)||fromP.has(g))&&!fromH.has(g)?0:115});
    for(let it=0;it<80;it++)unk.forEach(g=>{if(!(fromH.has(g)&&(fromN.has(g)||fromP.has(g))))return;let num=0,den=0;adj[g].forEach(([n,Z])=>{num+=(V[n]??0)/Z;den+=1/Z});if(den)V[g]=num/den});
  }
  let Itot=0;
  loads.forEach(l=>{l.ga=l.ga||f(l.ta);l.gb=l.gb||f(l.tb);const va=V[l.ga]??null,vb=V[l.gb]??null;
    l.dv=(va===null||vb===null||short)?0:va-vb;l.I=Math.abs(l.dv)/l.Z;l.frac=Math.pow(Math.abs(l.dv)/230,2);l.Preal=l.P*l.frac});
  loads.forEach(l=>{if(l.ga===H&&l.gb!==H)Itot+=(230-(V[l.gb]??230))/l.Z;else if(l.gb===H&&l.ga!==H)Itot+=(230-(V[l.ga]??230))/l.Z});
  Itot=Math.abs(Itot);if(short&&closedMcb)Itot=999;
  const pot=t=>{const g=f(t);return short?0:(V[g]??null)};
  return{f,H,Ng,Pg,short,loads,V,Itot,pot};
}
function roles(){const r=solve({allClosed:true});const m={};termList().forEach(t=>{const g=r.f(t);m[t]=g===r.H?"L":g===r.Ng?"N":g===r.Pg?"PE":null});return m}
function ctx(){if(isF())return ctxF();const r=solve();const rl=roles();return{S,r,energized:energized(),role:t=>rl[t]}}

/* ===== misi & nilai ===== */
function prakRec(pid){REC.prak=REC.prak||{};return REC.prak[pid]=REC.prak[pid]||{done:[],viol:0,score:0,ok:false,wires:[]}}
function emit(e){
  if(!S)return;const p=pdef(),pr=prakRec(S.pid),c=ctx();let changed=false;
  p.missions.forEach((m,i)=>{if(pr.done.includes(i)||m.on!==e.type)return;try{if(m.ok(e,c)){pr.done.push(i);changed=true;toast("Misi tercapai: "+m.t,true);log("Misi "+(i+1)+" tercapai")}}catch(err){}});
  if(changed){scorePrak();renderMissions();save()}
}
function scorePrak(){const p=pdef(),pr=prakRec(S.pid);pr.score=Math.max(0,Math.round(pr.done.length/p.missions.length*100-5*pr.viol));pr.t=now();$("#labScore").textContent="Nilai: "+pr.score;$("#mvViol").textContent=pr.viol}
function violation(kind,msg){
  const pr=prakRec(S.pid);S.violKinds=S.violKinds||{};
  toast("Pelanggaran K3: "+msg);log("PELANGGARAN K3 · "+msg);
  if(S.violKinds[kind]&&now()-S.violKinds[kind]<8000)return;S.violKinds[kind]=now();
  pr.viol=(pr.viol||0)+1;scorePrak();save();
}
function renderMissions(){
  const p=pdef(),pr=prakRec(S.pid);
  $("#missions").innerHTML=p.missions.map((m,i)=>`<li class="${pr.done.includes(i)?"done":""}"><span>${esc(m.t)}</span></li>`).join("");
  $("#misCount").textContent=pr.done.length+"/"+p.missions.length;
}
let logArr=[];
function log(a){const t=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"});logArr.unshift({t,a});logArr.length=Math.min(logArr.length,50);
  $("#log").innerHTML=logArr.map(l=>`<div>${esc(l.t)} · <b>${esc(l.a)}</b></div>`).join("");addLog(pdef().no+": "+a)}
let toastT;function toast(msg,good){const t=$("#toast");t.textContent=msg;t.className="toast show"+(good?" good":"");clearTimeout(toastT);toastT=setTimeout(()=>t.className="toast",2800)}

/* ===== aksi ===== */
function setMcb(on){
  if(isF())return setMcbF(on);
  if(on){
    if(S.loto){toast("MCB terkunci LOTO. Lepas gembok terlebih dahulu.");return}
    S.tripped=false;S.mcb=true;S.heat=0;log("MCB dinaikkan");
    const r=solve();
    if(r.short||r.Itot>=S.rating*5){magTrip();return}
    emit({type:"reset"});
    if(S.overTrip&&r.Itot<=S.rating)S.overTrip=false;
  }else{S.mcb=false;S.tripped=false;log("MCB diturunkan")}
  sync();emit({type:"state"});
}
function magTrip(){S.tripped=true;S.mcb=false;S.heat=0;spark();toast("MCB trip seketika (pelepas magnetik): hubung singkat!");log("TRIP magnetik · hubung singkat");sync();emit({type:"trip",kind:"mag"})}
function thermalTrip(I){S.tripped=true;S.mcb=false;S.overTrip=true;S.heat=0;toast(`MCB trip: beban lebih ${fmt(I,2)} A > ${S.rating} A`);log(`TRIP termal · ${fmt(I,2)} A pada C${S.rating}`);sync();emit({type:"trip",kind:"thermal"})}
function toggleSw(key){S.sw[key]=!S.sw[key];log(swLabel(key)+" "+(S.sw[key]?"ON":"OFF"));sync();const sw=key.split(".")[0];emit({type:"toggle",sw});emit({type:"state"})}
function swLabel(key){const[id,k]=key.split(".");const c=pdef().comps.find(x=>x.id===id);return c.label+(k?(k==="a"?" tombol 1":" tombol 2"):"")}
function clickTerminal(t){
  if(S.mode==="meas"){
    if(S.ins==="tp"){S.tp=t;$("#tpPoint").value=t}
    else if(S.ins==="mm"||S.ins==="mg"){S.probeToggle=!S.probeToggle;if(S.probeToggle)S.red=t;else S.black=t;const a=$("#pRed"),b=$("#pBlack");if(a)a.value=S.red;if(b)b.value=S.black}
    else{toast("Tang ampere menjepit kabel; pilih kabelnya di panel Alat Ukur.",true)}
    refreshReadout(true);placeProbes();return;
  }
  if(isLocked(t)){toast(isF()?"Terminal ini bagian rangkaian daya yang sudah terpasang. Rangkai sisi kontrolnya saja.":"Terminal sumber sudah terpasang dari panel.",true);return}
  if(energized()){violation("wire-live","memasang kabel saat MCB ON. Turunkan MCB dulu!");return}
  if(!S.sel){S.sel=t;highlightSel();$("#selHint").textContent="Terpilih: "+termName(t)+". Klik terminal tujuan.";return}
  if(S.sel===t){S.sel=null;highlightSel();$("#selHint").textContent="Klik terminal pertama, lalu terminal kedua untuk memasang kabel.";return}
  const a=S.sel,b=t;S.sel=null;highlightSel();
  if(!S.wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a))){S.wires.push({a,b,c:S.color});S.ok=false;log("Kabel "+(S.color==="L"?"coklat":S.color==="N"?"biru":"hijau-kuning")+": "+termName(a)+" → "+termName(b))}
  $("#selHint").textContent="Kabel terpasang. Klik terminal berikutnya.";
  persistWires();buildWires();renderWireList();sync();
}
function removeWire(i){
  const w=S.wires[i];if(!w||w.fixed)return;
  if(energized()){violation("wire-live","melepas kabel saat MCB ON. Turunkan MCB dulu!");return}
  S.wires.splice(i,1);S.selWire=-1;S.ok=false;log("Kabel dilepas: "+termName(w.a)+" → "+termName(w.b));persistWires();buildWires();renderWireList();sync();
}
function persistWires(){const pr=prakRec(S.pid);pr.wires=S.wires.filter(w=>!w.fixed).map(w=>[w.a,w.b,w.c]);pr.ok=S.ok;save()}

/* ===== periksa rangkaian ===== */
function checkCircuit(){
  if(isF())return checkF();
  const p=pdef(),items=[];const rl=roles();const keys=swKeys();
  const student=S.wires.filter(w=>!w.fixed);
  if(!student.length){$("#checkOut").innerHTML=`<li><span class="n">✗</span><span>Belum ada kabel yang dipasang.</span></li>`;return}
  const rAll=solve({allClosed:true});
  const loadT=new Set();allComps().forEach(c=>{if(c.type==="lamp"){loadT.add(c.id+".a");loadT.add(c.id+".b")}if(c.type==="sock"){loadT.add(c.id+".L");loadT.add(c.id+".N");loadT.add(c.id+".PE")}if(/^sw/.test(c.type))Object.keys(CT[c.type].terms).forEach(k=>loadT.add(c.id+"."+k))});
  const groupHasLoad=g=>[...loadT].some(t=>rAll.f(t)===g);
  // 1 tersambung
  const floating=student.filter(w=>!rl[w.a]&&!groupHasLoad(rAll.f(w.a)));
  items.push([!floating.length,floating.length?`${floating.length} kabel tidak tersambung ke sumber maupun beban.`:"Semua kabel tersambung."]);
  // 2 warna
  const bad=[];student.forEach(w=>{const role=rl[w.a];const need=role||"L";if(role==="PE"&&w.c!=="PE")bad.push(w);else if(role==="N"&&w.c!=="N")bad.push(w);else if((role==="L"||!role)&&w.c!=="L")bad.push(w)});
  items.push([!bad.length,bad.length?`Warna kabel salah: ${bad.map(w=>termName(w.a)+" → "+termName(w.b)).slice(0,2).join("; ")}${bad.length>2?" …":""}. Fasa coklat, netral biru, PE hijau-kuning.`:"Warna kabel sesuai PUIL."]);
  // 3 saklar di fasa
  const swT=[];pdef().comps.forEach(c=>{if(/^sw/.test(c.type))Object.keys(CT[c.type].terms).forEach(k=>swT.push(c.id+"."+k))});
  const swN=swT.filter(t=>rl[t]==="N"||rl[t]==="PE");
  if(swT.length)items.push([!swN.length,swN.length?"Saklar berada di jalur netral. Saklar wajib memutus fasa.":"Saklar memutus fasa."]);
  // 4 hubung singkat di semua posisi saklar
  const combos=[];const n=keys.length;for(let m=0;m<(1<<n);m++){const st={};keys.forEach((k,i)=>st[k]=!!(m&(1<<i)));combos.push(st)}
  const shorts=combos.filter(st=>solve({sw:st,mcb:true}).short);
  items.push([!shorts.length,shorts.length?"Terjadi hubung singkat fasa–netral pada posisi saklar tertentu.":"Tidak ada hubung singkat."]);
  // 5 fungsi
  let fnOk=true,fnMsg="";
  const litIn=(st,id)=>{const r=solve({sw:st,mcb:true});const l=r.loads.find(x=>x.id===id);return!!l&&l.frac>.55};
  if(typeof p.test==="function"){combos.forEach(st=>{const exp=p.test(st);Object.keys(exp).forEach(id=>{if(litIn(st,id)!==exp[id])fnOk=false})});fnMsg=fnOk?"Lampu menyala dan padam sesuai posisi saklar.":"Lampu belum menyala/padam sesuai posisi saklar."}
  else if(p.test==="toggle"){combos.forEach(st=>{const base=litIn(st,"L1");keys.forEach(k=>{const s2=Object.assign({},st,{[k]:!st[k]});if(litIn(s2,"L1")===base)fnOk=false})});fnMsg=fnOk?"Lampu dapat dinyalakan dan dimatikan dari kedua saklar.":"Lampu belum bisa dikendalikan dari kedua saklar."}
  else if(p.test==="socket"){const r=solve({mcb:true});const okL=rl["K1.L"]==="L"&&rl["K1.N"]==="N";const okPE=rl["K1.PE"]==="PE";fnOk=okL&&okPE;fnMsg=!okL?"Terminal L dan N stop kontak belum benar.":!okPE?"Klem PE stop kontak belum tersambung ke rel PE.":"Stop kontak L–N–PE terpasang benar."}
  else{const r=solve({mcb:true});fnOk=r.loads.every(l=>l.frac>.1);fnMsg=fnOk?"Kedua lampu mendapat tegangan.":"Masih ada lampu yang tidak mendapat tegangan."}
  items.push([fnOk,fnMsg]);
  const pass=items.every(x=>x[0]);
  if(bad.length)violation("color","warna kabel tidak sesuai PUIL.");
  if(swN.length)violation("swN","saklar dipasang pada jalur netral.");
  S.ok=pass;persistWires();
  $("#checkOut").innerHTML=items.map(([ok,m])=>`<li><span class="${ok?"y":"n"}">${ok?"✓":"✗"}</span><span>${esc(m)}</span></li>`).join("")+(pass?`<li><span class="y">★</span><span><b>Rangkaian lulus pemeriksaan.</b> Naikkan MCB dan uji.</span></li>`:"");
  log(pass?"Periksa rangkaian: LULUS":"Periksa rangkaian: belum lulus");
  emit({type:"check",pass});
}

/* ===== alat ukur ===== */
const shown={};
function refreshReadout(user){
  if(!S)return;if(isF())return readF(user);const r=solve(),lcd=$("#lcd"),note=$("#readNote");$("#neon").hidden=S.ins!=="tp";
  const jit=v=>v>1?v+(Math.random()-.5)*.8:v;
  if(S.ins==="mm"){
    if(S.red===S.black){lcd.innerHTML="----";note.textContent="Kedua probe berada di titik yang sama.";}
    else if(S.mode2==="R"){
      if(energized()){lcd.innerHTML="Err";note.textContent="Bahaya! Mengukur Ω pada rangkaian bertegangan bisa merusak multimeter. Turunkan MCB dulu.";if(user)violation("ohm","selektor Ω dipakai pada rangkaian bertegangan.")}
      else{const rr=solve({mcb:false});const ga=rr.f(S.red),gb=rr.f(S.black);
        if(ga===gb){lcd.innerHTML="0.2<small>Ω</small>";note.textContent="Tersambung (kontinu): kedua titik berada di penghantar yang sama."}
        else{const ld=rr.loads.find(l=>(rr.f(l.ta)===ga&&rr.f(l.tb)===gb)||(rr.f(l.ta)===gb&&rr.f(l.tb)===ga));
          if(ld&&ld.id[0]==="L"&&lampSpec().n.includes("Pijar")){lcd.innerHTML=Math.round(ld.Z/12)+"<small>Ω</small>";note.textContent="Hambatan dingin filamen lampu pijar (sekitar 1/12 hambatan saat menyala)."}
          else if(ld){lcd.innerHTML="OL";note.textContent="Beban elektronik (LED/driver): multimeter menunjukkan OL."}
          else{lcd.innerHTML="OL";note.textContent="Open loop: tidak ada sambungan antara kedua titik."}}
        if(user)emit({type:"mmR",a:S.red,b:S.black})}
    }else{
      const va=r.pot(S.red),vb=r.pot(S.black);const v=Math.abs((va??0)-(vb??0));
      lcd.innerHTML=`${v<.05?"0.0":jit(v).toFixed(1)}<small>V~</small>`;
      note.textContent=v>200?"Tegangan jala-jala fasa–netral (nominal 230 V).":v>60?"Tegangan sebagian, misalnya terbagi pada rangkaian seri.":v>.5?"Beda tegangan kecil.":"Tidak ada beda tegangan antara kedua titik.";
      if(user)emit({type:"mm",a:S.red,b:S.black,v});
    }
  }else if(S.ins==="tp"){
    const v=r.pot(S.tp)??0,litT=v>60;$("#neon").classList.toggle("lit",litT);$("#neonTxt").textContent=litT?"Lampu test pen MENYALA":"Tidak menyala";
    lcd.innerHTML=litT?"FASA":"–";note.textContent=litT?"Titik ini bertegangan terhadap tanah. Jangan disentuh!":"Tidak terdeteksi fasa. Pastikan juga dengan multimeter sebelum menyentuh.";
    if(user)emit({type:"tp",p:S.tp,lit:litT});
  }else if(S.ins==="ta"){
    let I=0,n="";
    if(S.ta==="main"){I=r.Itot;n="Arus total yang dipasok MCB."}
    else if(S.ta==="mainN"){I=r.Itot;n="Arus netral sama dengan arus fasa pada rangkaian satu fasa."}
    else if(S.ta==="both"){I=0;n="Arus fasa dan netral sama besar tetapi berlawanan arah, sehingga medan magnetnya saling meniadakan."}
    else{const id=S.ta.split(":")[1];const l=r.loads.find(x=>x.id===id);I=l?l.I:0;n="Arus cabang "+(allComps().find(c=>c.id===id)||{}).label+"."}
    if(r.short)I=0;
    lcd.innerHTML=`${(I*(1+(Math.random()-.5)*.01)).toFixed(2)}<small>A~</small>`;note.textContent=n;
    if(user)emit({type:"ta",w:S.ta,I});
  }else{
    if(S.red===S.black){lcd.innerHTML="----";note.textContent="Pilih dua titik berbeda.";return}
    if(energized()){lcd.innerHTML="STOP";note.textContent="Megger tidak boleh dipakai pada instalasi bertegangan!";if(user)violation("megger","megger dipakai pada rangkaian bertegangan.");return}
    const rr=solve({mcb:false});const ga=rr.f(S.red),gb=rr.f(S.black);const rl=roles();
    let txt,nt,valid=false;
    const ld=rr.loads.find(l=>(rr.f(l.ta)===ga&&rr.f(l.tb)===gb)||(rr.f(l.ta)===gb&&rr.f(l.tb)===ga));
    if(ga===gb){txt="0.00<small>MΩ</small>";nt="Kedua titik terhubung langsung. Pilih penghantar yang berbeda (misalnya L dan PE)."}
    else if(ld){txt="0.00<small>MΩ</small>";nt="Beban masih tersambung sehingga hasil tidak valid. Cabut beban terlebih dahulu."}
    else{const iso=ISO[S.iso]||ISO.baik;const v=iso.v*(1+(Math.random()-.5)*.04);txt=(v>=10?v.toFixed(0):v.toFixed(2))+"<small>MΩ</small>";nt=v>=1?`Isolasi LAYAK (≥ 1 MΩ). Kondisi: ${iso.n.toLowerCase()}.`:"Isolasi TIDAK LAYAK (< 1 MΩ). Kabel harus diganti atau dikeringkan.";valid=true}
    lcd.innerHTML=txt;note.textContent=nt;
    const lpe=(rl[S.red]==="L"&&rl[S.black]==="PE")||(rl[S.red]==="PE"&&rl[S.black]==="L");
    if(user)emit({type:"mg",valid:valid&&S.loto&&S.load.w===0,lpe});
    if(user&&valid&&!S.loto)toast("Hasil terbaca, tetapi pasang LOTO dulu sesuai prosedur.",true);
  }
}
function insBody(){
  if(isF())return insBodyF();
  const opts=termList().map(t=>`<option value="${t}">${esc(termName(t))}</option>`).join("");
  let h="";
  if(S.ins==="mm")h=`<div class="grid2"><label class="field">Probe merah<select id="pRed">${opts}</select></label><label class="field">Probe hitam (COM)<select id="pBlack">${opts}</select></label></div>
    <label class="field" style="margin-top:8px">Posisi selektor<select id="mmMode"><option value="V">V~ (tegangan AC)</option><option value="R">Ω (hambatan / kontinuitas)</option></select></label>`;
  if(S.ins==="tp")h=`<label class="field">Titik yang disentuh<select id="tpPoint">${opts}</select></label>`;
  if(S.ins==="ta"){const ld=allComps().filter(c=>c.type==="lamp"||c.type==="sock").map(c=>`<option value="load:${c.id}">Kabel fasa ${esc(c.label)}</option>`).join("");
    h=`<label class="field">Kabel yang dijepit<select id="taWire"><option value="main">Fasa keluar MCB (total)</option><option value="mainN">Netral dari sumber</option>${ld}<option value="both">Fasa + netral bersamaan</option></select></label>`}
  if(S.ins==="mg")h=`<div class="grid2"><label class="field">Probe merah (L)<select id="pRed">${opts}</select></label><label class="field">Probe hitam<select id="pBlack">${opts}</select></label></div><p class="muted small" style="margin-top:6px">Tegangan uji 500 V DC. Syarat: MCB OFF, LOTO terpasang, beban dicabut.</p>`;
  $("#insBody").innerHTML=h;
  const a=$("#pRed"),b=$("#pBlack");if(a){a.value=S.red;a.onchange=()=>{S.red=a.value;refreshReadout(true);placeProbes()}}if(b){b.value=S.black;b.onchange=()=>{S.black=b.value;refreshReadout(true);placeProbes()}}
  const mm=$("#mmMode");if(mm){mm.value=S.mode2;mm.onchange=()=>{S.mode2=mm.value;log("Selektor multimeter: "+(S.mode2==="V"?"V~":"Ω"));refreshReadout(true)}}
  const tp=$("#tpPoint");if(tp){tp.value=S.tp;tp.onchange=()=>{S.tp=tp.value;refreshReadout(true);placeProbes()}}
  const ta=$("#taWire");if(ta){if(![...ta.options].some(o=>o.value===S.ta))S.ta="main";ta.value=S.ta;ta.onchange=()=>{S.ta=ta.value;refreshReadout(true)}}
}
function setIns(k){S.ins=k;$$("#insTabs [data-ins]").forEach(b=>b.setAttribute("aria-selected",b.dataset.ins===k));insBody();refreshReadout(false);placeProbes()}

/* ===== UI sinkron ===== */
function sync(){
  if(!S)return;if(isF())return syncF();const r=solve();
  $("#bMcb").textContent=S.tripped?"Reset MCB (trip)":S.mcb?"Turunkan MCB":"Naikkan MCB";
  $("#bLoto").setAttribute("aria-pressed",S.loto);$("#bLoto").textContent=S.loto?"Lepas LOTO":"Pasang LOTO";
  $$("#swBtns [data-sw]").forEach(b=>b.textContent=swLabel(b.dataset.sw)+": "+(S.sw[b.dataset.sw]?"ON":"OFF"));
  const m=$("#mtMcb");m.className="meter"+(S.tripped?" trip":energized()?" on":"");
  $("#mvMcb").textContent=S.tripped?"TRIP":S.mcb?"ON · C"+S.rating:"OFF";
  $("#mvV").textContent=(energized()?230:0)+" V";$("#mvI").textContent=fmt(r.short?0:r.Itot,2)+" A";
  $("#mvP").textContent=Math.round(r.loads.reduce((a,l)=>a+l.Preal,0))+" W";
  if(L.scene)update3D(r);
  refreshReadout(false);
}
function renderWireList(){
  $("#wireList").innerHTML=S.wires.map((w,i)=>w.fixed?"":`<div class="${S.selWire===i?"sel":""}"><i style="background:${w.c==="L"?"#6b3d1d":w.c==="N"?"#2463c9":"repeating-linear-gradient(90deg,#2e9a46 0 4px,#e8c51a 4px 8px)"}"></i><span>${esc(termName(w.a))} → ${esc(termName(w.b))}</span><button class="btn xs" data-del="${i}" aria-label="Lepas kabel">✕</button></div>`).join("")||`<p class="muted small">Belum ada kabel. Pilih warna, lalu klik dua terminal di papan.</p>`;
  $$("#wireList [data-del]").forEach(b=>b.onclick=()=>removeWire(+b.dataset.del));
}

/* ===== masuk / keluar halaman lab ===== */
function enterLab(pid){
  const p=PRAKS.find(x=>x.id===pid);const pr=prakRec(pid);
  S={pid,wires:PREWIRE.map(([a,b,c])=>({a,b,c,fixed:true})).concat((pr.wires||[]).map(([a,b,c])=>({a,b,c}))),
     mcb:false,tripped:false,loto:false,sw:{},rating:4,lamp:{w:9,pf:.9,n:"LED 9 W"},load:LOADS[0],iso:"baik",heat:0,
     mode:"wire",color:"L",sel:null,selWire:-1,ins:"mm",mode2:"V",red:"",black:"",tp:"",ta:"main",ok:!!pr.ok,flags:{},overTrip:false,shortNow:false};
  const lampT=p.comps.find(c=>c.type==="lamp"),sockT=p.comps.find(c=>c.type==="sock");
  const tgt=sockT||lampT;if(tgt){const tk=Object.keys(CT[tgt.type].terms);
  S.red=tgt.id+"."+tk[0];S.black=sockT?sockT.id+".N":"nb.n2";S.tp=tgt.id+"."+tk[0]}
  if(p.fase==="F")initF();
  logArr=[];$("#log").innerHTML="";
  $("#labEyebrow").textContent=p.no+" · Tingkat "+p.level;$("#labTitle").textContent=p.title;$("#labDesc").textContent=p.short;
  $("#jobBody").innerHTML=`<div><h4 style="font-size:16px;text-transform:uppercase">Tujuan</h4><ol>${p.tujuan.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
    <div><h4 style="font-size:16px;text-transform:uppercase">Alat &amp; bahan</h4><ul>${p.bahan.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4 style="font-size:16px;text-transform:uppercase">Langkah kerja</h4><ol><li>Pastikan MCB OFF sebelum merangkai.</li><li>Pilih warna kabel, lalu klik dua terminal untuk memasang kabel.</li><li>Tekan <b>Periksa rangkaian</b>.</li><li>Naikkan MCB, uji, ukur, lalu selesaikan misi.</li><li>Akhiri dengan LOTO sebelum membongkar.</li></ol></div>`;
  $("#swBtns").innerHTML=swKeys().map(k=>`<button class="btn sm" data-sw="${k}"></button>`).join("");
  $$("#swBtns [data-sw]").forEach(b=>b.onclick=()=>toggleSw(b.dataset.sw));
  $("#lampField").hidden=!!p.fixedLamp||!lampT;$("#ratingField").hidden=p.fase==="F";$("#legendF").hidden=p.fase!=="F";$("#heatLbl").textContent=p.fase==="F"?"Bimetal TOR (beban lebih motor)":"Bimetal MCB (beban lebih)";
  const ex=p.extra||[];
  $("#extraCtl").innerHTML=(ex.includes("load")?`<label class="field">Beban di stop kontak<select id="selLoad">${LOADS.map((l,i)=>`<option value="${i}">${esc(l.n)}${l.w?` · ${fmt(l.w/(230*l.pf),2)} A`:""}</option>`).join("")}</select></label>`:"")+
    (ex.includes("iso")?`<label class="field">Kondisi isolasi kabel (untuk uji megger)<select id="selIso">${Object.entries(ISO).map(([k,v])=>`<option value="${k}">${esc(v.n)}</option>`).join("")}</select></label>`:"")+
    (ex.includes("short")?`<button class="btn sm danger" id="bShort">Simulasikan hubung singkat di stop kontak</button>`:"");
  const sl=$("#selLoad");if(sl)sl.onchange=()=>{S.load=LOADS[+sl.value];log("Beban: "+S.load.n);buildAppliance();sync();emit({type:"state"})};
  const si=$("#selIso");if(si)si.onchange=()=>{S.iso=si.value;refreshReadout(false)};
  const bs=$("#bShort");if(bs)bs.onclick=()=>{if(!energized()){toast("Rangkaian tidak bertegangan; tidak ada arus hubung singkat.",true);return}log("Hubung singkat fasa–netral di stop kontak");magTrip()};
  $("#selRating").value="4";$("#selLamp").value="9|0.9|LED 9 W";
  $("#checkOut").innerHTML=S.ok?`<li><span class="y">✓</span><span>Rangkaian tersimpan sudah lulus pemeriksaan.</span></li>`:"";
  $$("#insTabs [data-ins]").forEach(b=>b.hidden=false);
  if(p.fase==="F")setupF();
  setMode("wire");setColor("L");setIns("mm");renderWireList();renderMissions();scorePrak();
  initLab3D();buildScene();sync();
  log("Membuka "+p.no+": "+p.title);
  requestAnimationFrame(()=>{if(L.r)sizeR(L.r,L.cam,$("#labCanvas"))});
}
function leaveLab(){if(S){save()}S=null}
function setMode(m){S.mode=m;$("#modeWire").setAttribute("aria-pressed",m==="wire");$("#modeMeas").setAttribute("aria-pressed",m==="meas");$("#wireCol").style.opacity=m==="wire"?1:.45;S.sel=null;highlightSel();
  $("#selHint").textContent=m==="wire"?"Klik terminal pertama, lalu terminal kedua untuk memasang kabel.":"Klik terminal untuk memasang probe alat ukur."}
function setColor(c){S.color=c;$$("#wireCol button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.c===c))}
$("#modeWire").onclick=()=>setMode("wire");$("#modeMeas").onclick=()=>setMode("meas");
$$("#wireCol button").forEach(b=>b.onclick=()=>{setColor(b.dataset.c);if(S.mode!=="wire")setMode("wire")});
$$("#insTabs [data-ins]").forEach(b=>b.onclick=()=>setIns(b.dataset.ins));
$("#bMcb").onclick=()=>setMcb(!energized());
$("#bLoto").onclick=()=>{if(!S.loto&&energized()){toast("Turunkan MCB terlebih dahulu sebelum memasang LOTO.");return}S.loto=!S.loto;log(S.loto?"LOTO dipasang":"LOTO dilepas");sync()};
$("#selRating").onchange=e=>{S.rating=+e.target.value;setMcbLabel();log("Rating MCB: C"+S.rating);sync()};
$("#selLamp").onchange=e=>{const[w,pf,n]=e.target.value.split("|");S.lamp={w:+w,pf:+pf,n};log("Lampu: "+n);sync();emit({type:"state"})};
$("#bCheck").onclick=checkCircuit;
$("#bHint").onclick=()=>{const p=pdef();$("#checkOut").innerHTML=`<li><span>💡</span><span><b>Petunjuk sambungan:</b></span></li>`+p.hint.map(h=>`<li><span>→</span><span>${esc(h)}</span></li>`).join("");log("Membuka petunjuk sambungan")};
$("#bClearWires").onclick=()=>{if(energized()){violation("wire-live","melepas kabel saat MCB ON.");return}confirmBox("Lepas semua kabel?","Semua kabel yang kamu pasang di praktikum ini akan dilepas.","Lepas semua",()=>{S.wires=S.wires.filter(w=>w.fixed);S.ok=false;persistWires();buildWires();renderWireList();sync();$("#checkOut").innerHTML="";log("Semua kabel dilepas")})};
setInterval(()=>{if(S&&document.visibilityState==="visible"&&S.ins!=="mg")refreshReadout(false)},700);

/* ================= PRAKTIKUM: 3D ================= */
function initLab3D(){
  if(!T||L.r)return;
  const canvas=$("#labCanvas");
  L.r=setupRenderer(canvas);L.cam=new T.PerspectiveCamera(42,1,.1,100);L.cam.position.set(0,.3,7.5);
  L.ctl=new T.OrbitControls(L.cam,canvas);L.ctl.enableDamping=true;L.ctl.target.set(0,.2,0);
  L.ctl.minAzimuthAngle=-1.0;L.ctl.maxAzimuthAngle=1.0;L.ctl.minPolarAngle=.6;L.ctl.maxPolarAngle=2.1;L.ctl.minDistance=2.2;L.ctl.maxDistance=14;
  L.cam.userData.fit=()=>{const a=L.cam.aspect,need=3.55/(Math.tan(T.MathUtils.degToRad(21))*a);L.cam.position.set(0,.3,Math.max(6.1,need));L.ctl.target.set(0,.2,0)};
  const ray=new T.Raycaster(),mv=new T.Vector2();
  const pick=e=>{if(!L.pickables)return null;const r=canvas.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,L.cam);
    const hits=ray.intersectObjects(L.pickables,true);for(const h of hits){let o=h.object;while(o){if(o.userData.pick)return o.userData.pick;o=o.parent}}return null};
  let down=null;
  canvas.addEventListener("pointerdown",e=>down=[e.clientX,e.clientY]);
  canvas.addEventListener("pointerup",e=>{if(!S||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const h=pick(e);if(!h)return;
    if(h.k==="mcb")setMcb(!energized());else if(h.k==="sw")toggleSw(h.key);else if(h.k==="term")clickTerminal(h.t);else if(h.k==="pb"){pressPb(h.id,true);setTimeout(()=>{if(S)pressPb(h.id,false)},650)}else if(h.k==="torReset")torReset();else if(h.k==="wire"){S.selWire=h.i;renderWireList();toast("Kabel dipilih. Tekan ✕ di daftar kabel untuk melepasnya.",true)}});
  canvas.addEventListener("pointermove",e=>{const h=pick(e);canvas.style.cursor=h?"pointer":"grab";if(L.hoverT!==(h&&h.t)){L.hoverT=h&&h.t;highlightSel()}});
  new ResizeObserver(()=>sizeR(L.r,L.cam,canvas)).observe(canvas);
}
function disposeScene(sc){sc.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();if(!Object.values(MAT).includes(m))m.dispose()})}})}
function sprite(text,opt={}){const w=opt.w||128,h=48;const t=texCanvas(w,h,(x)=>{x.fillStyle=opt.bg||"rgba(21,32,43,.9)";x.beginPath();if(x.roundRect)x.roundRect(0,0,w,h,10);else x.rect(0,0,w,h);x.fill();x.fillStyle=opt.fg||"#f2b705";x.font="bold "+(opt.fs||28)+"px JetBrains Mono, monospace";x.textAlign="center";x.fillText(text,w/2,33)});
  const s=new T.Sprite(new T.SpriteMaterial({map:t,depthTest:false,transparent:true}));s.scale.set((opt.sw||.22)*w/128,(opt.sw||.22)*h/128,1);s.renderOrder=5;return s}
function buildScene(){
  if(!T||!L.r)return;
  if(L.scene)disposeScene(L.scene);L.peMat=null;
  const sc=L.scene=new T.Scene();envFor(L.r,sc);L.pickables=[];L.termMesh={};L.swObj={};L.lamps={};
  Object.assign(L,{kon:{},pb:{},torFlag:null,tdrLed:null,motorShaft:null,mainPaths:null,lever:null,tag:null,mcbLabel:null,appliance:null,plug:null,res:null});
  sc.add(new T.HemisphereLight(0xffffff,0x6b7480,.6));
  const d=new T.DirectionalLight(0xffffff,.85);d.position.set(-3,4,6);d.castShadow=true;d.shadow.mapSize.set(2048,2048);Object.assign(d.shadow.camera,{left:-4,right:4,top:3,bottom:-3});sc.add(d);
  const wood=texCanvas(1024,640,(x,w,h)=>{x.fillStyle="#c9a77c";x.fillRect(0,0,w,h);for(let i=0;i<240;i++){x.strokeStyle=`rgba(${120+Math.random()*40|0},${80+Math.random()*30|0},${45+Math.random()*20|0},${.08+Math.random()*.12})`;x.lineWidth=1+Math.random()*3;x.beginPath();const y=Math.random()*h;x.moveTo(0,y);for(let X=0;X<=w;X+=40)x.lineTo(X,y+Math.sin(X*.01+i)*6);x.stroke()}
    x.strokeStyle="rgba(60,40,20,.22)";x.lineWidth=2;for(let gx=0;gx<w;gx+=64){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,h);x.stroke()}for(let gy=0;gy<h;gy+=64){x.beginPath();x.moveTo(0,gy);x.lineTo(w,gy);x.stroke()}});
  const board=box(6.6,4.0,.12,new T.MeshStandardMaterial({map:wood,roughness:.8}));board.position.set(0,.2,-.06);sc.add(board);
  const frame=new T.Mesh(new T.BoxGeometry(6.8,4.2,.1),MAT.dark);frame.position.set(0,.2,-.12);sc.add(frame);
  const p=pdef();
  const title=labelPlane(1024,96,(x,w,h)=>{x.fillStyle="#15202b";x.fillRect(0,0,w,h);x.fillStyle="#f2b705";x.font="bold 52px Barlow Condensed, sans-serif";x.fillText((p.no+" · "+p.title).toUpperCase(),24,66)},3.2,.3);title.position.set(-1.45,2.02,.01);sc.add(title);
  allComps().forEach(c=>buildComp(sc,c));if(isF())buildMainF(sc);
  // pentanahan
  const rod=cyl(.03,.03,.4,MAT.copper);rod.position.set(-2.95,-1.4,.08);sc.add(rod);
  [0,1,2].forEach(i=>{const e=box(.3-i*.09,.025,.03,MAT.dark);e.position.set(-2.95,-1.62-i*.06,.08);sc.add(e)});
  L.wireGroup=new T.Group();sc.add(L.wireGroup);
  L.dots=[];const dm=new T.MeshBasicMaterial({color:0xffd23a});const dg=new T.SphereGeometry(.028,10,8);
  for(let i=0;i<140;i++){const dd=new T.Mesh(dg,dm);dd.visible=false;sc.add(dd);L.dots.push(dd)}
  L.probe={red:mkProbe(0xe5392b),black:mkProbe(0x15202b)};
  L.spark=new T.PointLight(0x9fd0ff,0,3);L.spark.position.set(.7,-.2,.5);sc.add(L.spark);
  buildWires();buildAppliance();setMcbLabel();placeProbes();
}
function screw(sc,x,y,t){const s=cyl(.04,.04,.03,MAT.brass,16);s.rotation.x=Math.PI/2;s.position.set(x,y,.11);sc.add(s);const sl=box(.05,.008,.01,MAT.dark);sl.position.set(x,y,.127);sc.add(sl);
  const hit=new T.Mesh(new T.SphereGeometry(.085,12,10),new T.MeshBasicMaterial({color:0xf2b705,transparent:true,opacity:0,depthWrite:false}));hit.position.set(x,y,.13);hit.userData.pick={k:"term",t};sc.add(hit);L.pickables.push(hit);L.termMesh[t]={hit,screw:s}}
function buildComp(sc,c){
  const g=new T.Group();g.position.set(c.x,c.y,0);sc.add(g);
  const term=(k,lbl,dy,dx)=>{const o=CT[c.type].terms[k];screw(sc,c.x+o[0],c.y+o[1],c.id+"."+k);const s=sprite(lbl,{fs:24,w:lbl.length>2?112:72,sw:.2});s.position.set(c.x+o[0]+(dx||0),c.y+o[1]+(dx?0:(dy||.12)),.2);sc.add(s)};
  const strip=(w,y)=>{const b=box(w,.12,.06,MAT.black);b.position.set(0,y,.06);g.add(b)};
  const lbl=(txt,y)=>{const s=sprite(txt,{bg:"rgba(255,255,255,.92)",fg:"#15202b",fs:26,w:Math.min(512,40+txt.length*16),sw:.24});s.position.set(c.x,c.y+y,.25);sc.add(s)};
  if(BUILD_F[c.type]){BUILD_F[c.type](sc,c,g,term,lbl,strip);return}
  if(c.type==="src"){const b=roundedBox(.62,.95,.22,.05,MAT.grey);b.position.z=.06;g.add(b);
    const l=labelPlane(256,384,(x,w,h)=>{x.fillStyle="#2a3038";x.fillRect(0,0,w,h);x.fillStyle="#f2b705";x.font="bold 56px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText("PLN",w/2,90);x.fillStyle="#e7edf3";x.font="bold 40px JetBrains Mono, monospace";x.fillText("230 V~",w/2,170);x.fillText("50 Hz",w/2,230);x.font="28px sans-serif";x.fillText("SUMBER",w/2,320)},.5,.75);l.position.z=.18;g.add(l);
    strip(.6,-.6);term("L","L",-.13);term("N","N",-.13);term("PE","PE",-.13)}
  if(c.type==="mcb"){const enc=roundedBox(.55,1.05,.16,.04,MAT.white);enc.position.z=.03;g.add(enc);
    const mb=roundedBox(.22,.66,.24,.02,MAT.white);mb.position.z=.18;g.add(mb);
    L.mcbLabel=labelPlane(128,256,()=>{},.17,.33);L.mcbLabel.position.set(0,-.12,.305);g.add(L.mcbLabel);
    const slot=box(.11,.18,.02,MAT.dark);slot.position.set(0,.17,.305);g.add(slot);
    L.lever=new T.Group();const lv=box(.08,.15,.09,MAT.black);lv.position.y=.07;L.lever.add(lv);L.lever.position.set(0,.17,.32);g.add(L.lever);
    const hit=box(.3,.75,.4,new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.z=.2;hit.userData.pick={k:"mcb"};g.add(hit);L.pickables.push(hit);
    L.tag=new T.Group();const lock=new T.Mesh(new T.TorusGeometry(.05,.012,8,20,Math.PI),MAT.metal);lock.position.y=.05;L.tag.add(lock);L.tag.add(box(.1,.09,.04,MAT.red));
    const tc=labelPlane(128,192,(x,w,h)=>{x.fillStyle="#c62f26";x.fillRect(0,0,w,h);x.fillStyle="#fff";x.font="bold 30px sans-serif";x.textAlign="center";x.fillText("BAHAYA",w/2,50);x.font="bold 22px sans-serif";x.fillText("JANGAN",w/2,100);x.fillText("DINYALAKAN",w/2,130);x.font="18px sans-serif";x.fillText("LOTO",w/2,170)},.18,.27);tc.position.set(.13,-.22,.03);L.tag.add(tc);
    L.tag.position.set(c.x,c.y+.15,.45);L.tag.visible=false;sc.add(L.tag);
    term("in","IN",.11);term("out","OUT",-.13)}
  if(c.type==="nbus"||c.type==="pebus"){const b=roundedBox(.6,.15,.1,.02,c.type==="nbus"?MAT.blue:MAT.green);b.position.z=.05;g.add(b);
    Object.keys(CT[c.type].terms).forEach(k=>{const o=CT[c.type].terms[k];screw(sc,c.x+o[0],c.y+o[1],c.id+"."+k)});lbl(c.type==="nbus"?"REL N":"REL PE",-.17)}
  if(c.type==="sw1"||c.type==="swt"){const pl=roundedBox(.52,.52,.1,.07,MAT.white);pl.position.z=.04;g.add(pl);strip(.42,.34);
    const rk=new T.Group();rk.add(roundedBox(.28,.36,.06,.04,MAT.white));const dt=box(.08,.02,.01,c.type==="swt"?MAT.blue:MAT.orange);dt.position.set(0,-.13,.035);rk.add(dt);rk.position.z=.12;g.add(rk);
    rk.userData.pick={k:"sw",key:c.id};L.pickables.push(rk);L.swObj[c.id]=rk;
    Object.keys(CT[c.type].terms).forEach(k=>term(k,CT[c.type].names[k]));lbl(c.label,-.38)}
  if(c.type==="sw2"){const pl=roundedBox(.62,.52,.1,.07,MAT.white);pl.position.z=.04;g.add(pl);strip(.5,.34);
    ["a","b"].forEach((k,i)=>{const rk=new T.Group();rk.add(roundedBox(.22,.36,.06,.04,MAT.white));const nm=sprite(String(i+1),{bg:"rgba(0,0,0,0)",fg:"#15202b",fs:30,w:48,sw:.16});nm.position.set(0,-.1,.05);rk.add(nm);rk.position.set(i?.13:-.13,0,.12);g.add(rk);rk.userData.pick={k:"sw",key:c.id+"."+k};L.pickables.push(rk);L.swObj[c.id+"."+k]=rk});
    Object.keys(CT[c.type].terms).forEach(k=>term(k,CT[c.type].names[k]));lbl(c.label,-.38)}
  if(c.type==="lamp"){strip(.32,.3);const fit=cyl(.13,.11,.12,MAT.white);fit.rotation.x=0;fit.position.set(0,.16,.14);g.add(fit);
    const base=cyl(.075,.065,.14,MAT.metal);base.position.set(0,.04,.14);g.add(base);
    const bm=new T.MeshStandardMaterial({color:0xf4f1e8,roughness:.25,transparent:true,opacity:.92,emissive:0xffcf73,emissiveIntensity:0});
    const bulb=new T.Mesh(new T.SphereGeometry(.16,32,24),bm);bulb.position.set(0,-.2,.14);bulb.scale.y=1.12;g.add(bulb);
    const pl=new T.PointLight(0xffd38a,0,4,1.6);pl.position.set(0,-.25,.45);g.add(pl);
    const glow=new T.Sprite(new T.SpriteMaterial({map:texCanvas(128,128,(x,w,h)=>{const gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,"rgba(255,220,140,.9)");gr.addColorStop(1,"rgba(255,200,100,0)");x.fillStyle=gr;x.fillRect(0,0,w,h)}),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
    glow.scale.set(1.2,1.2,1);glow.position.set(0,-.2,.2);glow.material.opacity=0;g.add(glow);
    L.lamps[c.id]={bm,pl,glow};
    Object.keys(CT[c.type].terms).forEach(k=>term(k,CT[c.type].names[k]));lbl(c.label,-.5)}
  if(c.type==="sock"){const pl=roundedBox(.52,.52,.1,.07,MAT.white);pl.position.z=.04;g.add(pl);strip(.46,.34);
    const rec=cyl(.18,.18,.05,MAT.ivory,40);rec.rotation.x=Math.PI/2;rec.position.z=.1;g.add(rec);
    [-.07,.07].forEach(x=>{const h=cyl(.025,.025,.06,MAT.black);h.rotation.x=Math.PI/2;h.position.set(x,0,.11);g.add(h)});
    [.15,-.15].forEach(y=>{const k=box(.08,.025,.03,MAT.metal);k.position.set(0,y,.12);g.add(k)});
    Object.keys(CT[c.type].terms).forEach(k=>term(k,CT[c.type].names[k]));lbl(c.label,-.38);
    const shelf=box(1.6,.05,.7,MAT.dark);shelf.position.set(c.x+.5,c.y-1.0,.35);sc.add(shelf);
    L.appliance=new T.Group();L.appliance.position.set(c.x+.6,c.y-.75,.4);sc.add(L.appliance);
    L.plug=tube([[c.x,c.y,.14],[c.x+.15,c.y-.25,.35],[c.x+.6,c.y-.55,.4]],.02,MAT.black,20);sc.add(L.plug);L.sockPos=[c.x,c.y]}
}
function mkProbe(col){const g=new T.Group();const m=mat(col,{roughness:.4});const b=cyl(.028,.028,.3,m);b.position.y=.19;g.add(b);const gd=cyl(.05,.05,.02,m);gd.position.y=.06;g.add(gd);const t=cyl(.008,.003,.08,MAT.chrome);t.position.y=0;g.add(t);g.rotation.x=.7;g.visible=false;L.scene.add(g);return g}
function placeProbes(){
  if(!L.probe||!S)return;const show=(pr,t)=>{if(!t)return;const p=termPos(t);pr.position.set(p[0],p[1]+.02,.17);pr.visible=true};
  L.probe.red.visible=L.probe.black.visible=false;
  if(S.ins==="mm"||S.ins==="mg"){show(L.probe.red,S.red);show(L.probe.black,S.black)}else if(S.ins==="tp")show(L.probe.red,S.tp);
}
function highlightSel(){if(!L.termMesh||!S)return;Object.entries(L.termMesh).forEach(([t,o])=>{o.hit.material.opacity=t===S.sel?.55:(t===L.hoverT?.3:0)})}
const WCOL={L:()=>MAT.brown,N:()=>MAT.blue,PE:()=>{if(!L.peMat){L.peMat=new T.MeshStandardMaterial({map:stripeTex(30),roughness:.5})}return L.peMat}};
function buildWires(){
  if(!L.wireGroup)return;L.wireGroup.children.forEach(o=>{o.geometry&&o.geometry.dispose()});L.wireGroup.clear();L.wirePaths=[];
  L.pickables=L.pickables.filter(o=>!(o.userData.pick&&o.userData.pick.k==="wire"));
  S.wires.forEach((w,i)=>{const a=termPos(w.a),b=termPos(w.b);const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,len=Math.hypot(b[0]-a[0],b[1]-a[1]);
    const z0=.12,zm=.18+Math.min(.35,len*.08)+(i%3)*.03;
    const curve=new T.CatmullRomCurve3([new T.Vector3(a[0],a[1],z0),new T.Vector3(a[0],a[1],z0+.1),new T.Vector3(mx,my-Math.min(.25,len*.06),zm),new T.Vector3(b[0],b[1],z0+.1),new T.Vector3(b[0],b[1],z0)]);
    const m=new T.Mesh(new T.TubeGeometry(curve,48,.022,8,false),WCOL[w.c]());m.castShadow=true;m.userData.pick=w.fixed?null:{k:"wire",i};
    L.wireGroup.add(m);if(!w.fixed)L.pickables.push(m);L.wirePaths.push({curve,len:curve.getLength(),w})});
}
function buildAppliance(){
  if(!L.appliance)return;L.appliance.clear();
  if(!S.load.w){L.plug.visible=false;return}L.plug.visible=true;
  L.appliance.add(roundedBox(.7,.42,.4,.06,mat(0xdfe3e8,{roughness:.4})));
  const lab=labelPlane(256,128,(x,w,h)=>{x.fillStyle="#15202b";x.fillRect(0,0,w,h);x.fillStyle="#f2b705";x.font="bold 40px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText(S.load.n.replace(/ \d+ W/,""),w/2,56);x.fillStyle="#e7edf3";x.font="bold 34px JetBrains Mono, monospace";x.fillText(S.load.w+" W",w/2,104)},.6,.3);lab.position.z=.21;L.appliance.add(lab);
}
function setMcbLabel(){if(!L.mcbLabel||!S)return;const t=texCanvas(128,256,(x,w,h)=>{x.fillStyle="#f3f2ee";x.fillRect(0,0,w,h);x.fillStyle="#15202b";x.font="bold 54px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText("C"+S.rating,w/2,80);x.font="20px sans-serif";x.fillText("230V~",w/2,124);x.strokeStyle="#15202b";x.lineWidth=3;x.strokeRect(34,150,60,40);x.font="bold 22px sans-serif";x.fillText("6000",w/2,178);x.fillStyle="#2463c9";x.fillRect(0,222,w,34)});L.mcbLabel.material.map=t;L.mcbLabel.material.needsUpdate=true}
function update3D(r){
  if(isF())return update3DF();
  if(L.lever){L.lever.rotation.x=energized()?0:Math.PI;L.lever.position.y=energized()?.17:.2}
  if(L.tag)L.tag.visible=S.loto;
  Object.entries(L.swObj||{}).forEach(([k,o])=>o.rotation.x=S.sw[k]?.25:-.25);
  r.loads.forEach(l=>{const o=L.lamps[l.id];if(!o)return;const f=l.frac,k=Math.min(1,lampSpec().w/60);o.bm.emissiveIntensity=f*(1+k*1.6);o.pl.intensity=f*(1.2+k*2.4);o.glow.material.opacity=f*(.5+k*.4)});
  Object.keys(L.lamps).forEach(id=>{if(!r.loads.find(l=>l.id===id)){const o=L.lamps[id];o.bm.emissiveIntensity=0;o.pl.intensity=0;o.glow.material.opacity=0}});
  L.res=r;
}
function spark(){if(!L.spark)return;let n=0;const f=()=>{L.spark.intensity=n%2?0:6;if(++n<8)setTimeout(f,60);else L.spark.intensity=0};f()}
let flowT=0;
function animateLab(dt){
  if(!S)return;if(isF())return animateF(dt);
  const r=L.res||solve();
  if(energized()){
    const ratio=r.Itot/S.rating;
    if(r.short||ratio>=5)magTrip();
    else if(ratio>1.13){const tt=clamp(40/(ratio*ratio-1),2,25);S.heat+=dt/tt;if(S.heat>=1)thermalTrip(r.Itot)}
    else S.heat=Math.max(0,S.heat-dt*.15);
  }else S.heat=Math.max(0,S.heat-dt*.3);
  $("#heatBar").style.width=(S.heat*100).toFixed(1)+"%";
  if(!L.wirePaths)return;
  flowT+=dt;let di=0;
  if(energized()&&r.Itot>.005&&!r.short){
    const gI={};r.loads.forEach(l=>{[l.ga,l.gb].forEach(g=>{gI[g]=Math.max(gI[g]||0,l.I)})});gI[r.H]=r.Itot;gI[r.Ng]=r.Itot;
    L.wirePaths.forEach(p=>{const g=r.f(p.w.a);const I=gI[g]||0;if(I<.005)return;const n=Math.max(2,Math.round(p.len*4));const sp=.25+Math.min(I,8)*.15;
      for(let i=0;i<n&&di<L.dots.length;i++){const u=((flowT*sp/p.len)+i/n)%1;const q=p.curve.getPointAt(u);L.dots[di].position.copy(q);L.dots[di].visible=true;di++}});
  }
  for(;di<L.dots.length;di++)L.dots[di].visible=false;
}

/* ================= DAFTAR PRAKTIKUM ================= */
function renderPrakList(){
  const f=curFase();$("#prakEyebrow").textContent="Tahap 2 · Mengaplikasi · Fase "+f+(f==="F"?" (kendali motor 3 fasa)":" (instalasi penerangan)");
  $("#prakGrid").innerHTML=praksOf(f).map(p=>{const pr=(REC.prak||{})[p.id]||{done:[],score:0,viol:0};return`<a class="prak-card" href="#${p.id}">
    <span class="no">${esc(p.no)} · ${esc(p.level)}</span><h3>${esc(p.title)}</h3><p>${esc(p.short)}</p>
    <div class="bar"><i style="width:${(pr.done||[]).length/p.missions.length*100}%"></i></div>
    <div class="meta"><span class="muted">${(pr.done||[]).length}/${p.missions.length} misi · ${pr.viol||0} pelanggaran</span><span class="badge ${pr.score>=75?"ok":pr.score>0?"warn":""}">Nilai ${pr.score||0}</span></div></a>`}).join("");
  $("#prakAvg").textContent="Rata-rata nilai: "+Math.round(grades().p);
}
/* ================= FASE F: KENDALI MOTOR 3 FASA ================= */
Object.assign(CT,{
  src3:{terms:{L1:[-.24,-.62],L2:[-.12,-.62],L3:[0,-.62],N:[.12,-.62],PE:[.24,-.62]},names:{L1:"L1",L2:"L2",L3:"L3",N:"N",PE:"PE"}},
  mcb3:{terms:{},names:{}},
  ctl:{terms:{L:[-.12,0],N:[.12,0]},names:{L:"L",N:"N"}},
  pbn:{terms:{t1:[-.09,.32],t2:[.09,.32]},names:{t1:"1",t2:"2"}},
  pbo:{terms:{t3:[-.09,.32],t4:[.09,.32]},names:{t3:"3",t4:"4"}},
  kon:{terms:{a1:[-.56,.33],a2:[-.56,.2],n13:[-.56,.07],n14:[-.56,-.06],n21:[-.56,-.19],n22:[-.56,-.32]},names:{a1:"A1",a2:"A2",n13:"13",n14:"14",n21:"21",n22:"22"}},
  tor:{terms:{t95:[-.46,.15],t96:[-.46,.03],t97:[-.46,-.09],t98:[-.46,-.21]},names:{t95:"95",t96:"96",t97:"97",t98:"98"}},
  tdr:{terms:{a1:[-.42,.3],a2:[-.42,.18],n55:[-.42,.06],n56:[-.42,-.06],n67:[-.42,-.18],n68:[-.42,-.3]},names:{a1:"A1",a2:"A2",n55:"55",n56:"56",n67:"67",n68:"68"}},
  motor3:{terms:{U:[-.14,.6],V:[0,.6],W:[.14,.6]},names:{U:"U",V:"V",W:"W"}},
  motor6:{terms:{U1:[-.16,.68],V1:[0,.68],W1:[.16,.68],U2:[-.16,.53],V2:[0,.53],W2:[.16,.53]},names:{U1:"U1",V1:"V1",W1:"W1",U2:"U2",V2:"V2",W2:"W2"}}
});
const COMMON_F=[
  {id:"src3",type:"src3",x:-2.75,y:1.45,label:"Sumber 3 fasa"},
  {id:"Q1",type:"mcb3",x:-1.8,y:1.45,label:"MCB 3P"},
  {id:"ctl",type:"ctl",x:-1.8,y:.4,label:"Sumber kontrol"}
];
function lockedF(t){const cid=t.split(".")[0];if(cid==="src3"||cid==="Q1")return true;const c=allComps().find(x=>x.id===cid);return!!c&&/^motor/.test(c.type)}
const IN=4.7; // arus nominal motor 2,2 kW
const motorTerms=()=>{const m=pdef().comps.find(c=>/^motor/.test(c.type));return Object.keys(CT[m.type].terms).map(k=>m.id+"."+k)};
const MISSION_LOTO_F={t:"Terapkan LOTO, lalu buktikan terminal motor 0 V dengan multimeter.",on:"mm",ok:(e,c)=>c.S.loto&&!c.energized&&motorTerms().includes(e.a)&&motorTerms().includes(e.b)&&e.v<1};
const isNTerm=t=>t==="ctl.N"||t==="src3.N";

PRAKS.push(
{id:"f1",fase:"F",no:"Praktikum F1",title:"Kendali Motor DOL",level:"Fase F · Dasar",
 short:"Menjalankan motor 3 fasa langsung (Direct On Line) dengan tombol ON/OFF, kontak pengunci, dan pengaman TOR.",
 tujuan:["Merangkai rangkaian kontrol DOL dengan kontak pengunci 13-14.","Menempatkan TOR 95-96 dan tombol OFF sebagai pemutus.","Mengukur tegangan antarfasa dan arus motor."],
 bahan:["MCB 3P C10 dan MCB kontrol 1P","Kontaktor K1 (kumparan 220 V)","TOR 3,5–5 A","Tombol OFF (NC) dan ON (NO)","Motor induksi 3 fasa 2,2 kW","Multimeter, tang ampere"],
 comps:[{id:"S0",type:"pbn",x:-2.15,y:-.9,label:"S0 OFF"},{id:"S1",type:"pbo",x:-1.3,y:-.9,label:"S1 ON"},
   {id:"K1",type:"kon",x:.35,y:1.25,label:"K1"},{id:"F1",type:"tor",x:.35,y:.2,label:"F1 TOR"},{id:"M",type:"motor3",x:2.2,y:-.95,label:"Motor 3 fasa"}],
 main:[["Q1","K1"],["K1","F1"],["F1","M"]],
 hint:["Sumber kontrol L → TOR 95 (coklat)","TOR 96 → S0 terminal 1","S0 terminal 2 → S1 terminal 3","S1 terminal 4 → K1 A1","K1 A2 → Sumber kontrol N (biru)","Pengunci: K1 13 → S1 terminal 3, dan K1 14 → S1 terminal 4"],
 test:"dol",
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Tekan ON lalu lepaskan: motor tetap berputar (rangkaian pengunci).",on:"pb",ok:(e,c)=>c.S.ok&&e.id==="S1"&&!e.down&&c.dev.K1&&(c.S.flags.ran=1)},
  {t:"Hentikan motor dengan tombol OFF.",on:"pb",ok:(e,c)=>e.id==="S0"&&e.down&&c.S.flags.ran&&!c.dev.K1},
  {t:"Saat motor berputar, ukur U–V (±400 V) dan U–N (±230 V).",on:"mm",ok:(e,c)=>{const mt=motorTerms(),f=c.S.flags;if(mt.includes(e.a)&&mt.includes(e.b)&&e.v>380)f.uv=1;if((mt.includes(e.a)&&isNTerm(e.b))||(mt.includes(e.b)&&isNTerm(e.a))){if(e.v>200&&e.v<260)f.un=1}return f.uv&&f.un}},
  {t:"Saat motor berputar, jepit satu fasa lalu ketiga fasa sekaligus dengan tang ampere.",on:"ta",ok:(e,c)=>{const f=c.S.flags;if(c.mode==="off")return false;if(/^L[123]$/.test(e.w)&&e.I>.5)f.t1=1;if(e.w==="all")f.t3=1;return f.t1&&f.t3}},
  {t:"Naikkan beban hingga TOR trip, turunkan beban, reset TOR, lalu jalankan motor lagi.",on:"pb",ok:(e,c)=>e.id==="S1"&&!e.down&&c.dev.K1&&c.S.flags.torTripped&&c.S.load<=100},
  MISSION_LOTO_F
 ]},
{id:"f2",fase:"F",no:"Praktikum F2",title:"Putar Kanan-Kiri",level:"Fase F · Menengah",
 short:"Membalik arah putaran motor dengan dua kontaktor dan pengaman interlock agar tidak terjadi hubung singkat antarfasa.",
 tujuan:["Merangkai kendali putar kanan-kiri dengan pengunci dan interlock.","Menjelaskan pertukaran dua fasa pada rangkaian daya.","Membuktikan fungsi interlock."],
 bahan:["MCB 3P C10, MCB kontrol 1P","Kontaktor K1 (kanan) dan K2 (kiri)","TOR","Tombol OFF, KANAN, dan KIRI","Motor 3 fasa"],
 comps:[{id:"S0",type:"pbn",x:-2.35,y:-.9,label:"S0 OFF"},{id:"S1",type:"pbo",x:-1.55,y:-.9,label:"S1 KANAN"},{id:"S2",type:"pbo",x:-.75,y:-.9,label:"S2 KIRI"},
   {id:"K1",type:"kon",x:-.1,y:1.3,label:"K1 kanan"},{id:"K2",type:"kon",x:1.4,y:1.3,label:"K2 kiri"},{id:"F1",type:"tor",x:.65,y:.15,label:"F1 TOR"},{id:"M",type:"motor3",x:2.35,y:-.95,label:"Motor 3 fasa"}],
 main:[["Q1","K1"],["Q1","K2"],["K1","F1"],["K2","F1"],["F1","M"]],
 hint:["Sumber kontrol L → TOR 95; TOR 96 → S0 terminal 1","S0 terminal 2 → S1 terminal 3 dan S2 terminal 3","S1 terminal 4 → K2 21; K2 22 → K1 A1 (interlock)","S2 terminal 4 → K1 21; K1 22 → K2 A1 (interlock)","K1 A2 dan K2 A2 → Sumber kontrol N (biru)","Pengunci: K1 13-14 paralel S1 (3-4), K2 13-14 paralel S2 (3-4)"],
 test:"fr",
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Putar motor ke kanan (S1), lalu hentikan dengan OFF.",on:"pb",ok:(e,c)=>{const f=c.S.flags;if(!c.S.ok)return false;if(e.id==="S1"&&!e.down&&c.dev.K1)f.fwd=1;return e.id==="S0"&&e.down&&f.fwd&&!c.dev.K1&&!c.dev.K2}},
  {t:"Putar motor ke kiri (S2) dan biarkan berputar.",on:"pb",ok:(e,c)=>c.S.ok&&e.id==="S2"&&!e.down&&c.dev.K2&&!c.dev.K1},
  {t:"Buktikan interlock: saat berputar kanan, tekan tombol kiri. Arah putaran tidak berubah.",on:"pb",ok:(e,c)=>c.S.ok&&e.id==="S2"&&e.down&&c.dev.K1&&!c.dev.K2},
  {t:"Ukur U–W saat putar kanan dan saat putar kiri: besarnya sama (±400 V), hanya urutan fasanya yang berubah.",on:"mm",ok:(e,c)=>{const f=c.S.flags;if(!(pairIs(e,"M.U","M.W")&&e.v>380))return false;if(c.dev.K1)f.vk=1;if(c.dev.K2)f.vl=1;return f.vk&&f.vl}},
  MISSION_LOTO_F
 ]},
{id:"f3",fase:"F",no:"Praktikum F3",title:"Bintang-Segitiga Otomatis",level:"Fase F · Lanjut",
 short:"Pengasutan Y-Δ dengan timer: motor mulai di hubungan bintang untuk menekan arus start, lalu otomatis pindah ke segitiga.",
 tujuan:["Merangkai kontrol Y-Δ otomatis dengan TDR dan interlock.","Membandingkan arus start dan tegangan kumparan pada hubungan Y dan Δ.","Mengatur waktu tunda pengasutan."],
 bahan:["MCB 3P C10, MCB kontrol 1P","Kontaktor K1 utama, K2 bintang (Y), K3 segitiga (Δ)","TDR on-delay","TOR, tombol OFF dan ON","Motor 3 fasa 6 terminal"],
 comps:[{id:"S0",type:"pbn",x:-2.35,y:-.9,label:"S0 OFF"},{id:"S1",type:"pbo",x:-1.55,y:-.9,label:"S1 ON"},
   {id:"K1",type:"kon",x:-.25,y:1.3,label:"K1 utama"},{id:"F1",type:"tor",x:-.25,y:.2,label:"F1 TOR"},
   {id:"KD",type:"kon",x:1.05,y:1.3,label:"K3 Δ"},{id:"KY",type:"kon",x:2.4,y:1.3,label:"K2 Y"},{id:"T1",type:"tdr",x:1.0,y:.05,label:"T1 TDR"},
   {id:"M",type:"motor6",x:2.35,y:-.95,label:"Motor Y-Δ"}],
 main:[["Q1","K1"],["K1","F1"],["F1","M"],["F1","KD"],["KD","M"],["KY","M"]],
 hint:["L → TOR 95; TOR 96 → S0 1; S0 2 → S1 3; S1 4 → K1 A1; K1 A2 → N","Pengunci: K1 13 → S1 3, K1 14 → S1 4","K1 14 → T1 A1; T1 A2 → N","K1 14 → T1 55; T1 56 → KD 21; KD 22 → KY A1; KY A2 → N","K1 14 → T1 67; T1 68 → KY 21; KY 22 → KD A1; KD A2 → N"],
 test:"yd",
 missions:[
  {t:"Rangkai sesuai lembar kerja hingga lulus Periksa rangkaian.",on:"check",ok:e=>e.pass},
  {t:"Jalankan motor dan amati perpindahan otomatis dari bintang (Y) ke segitiga (Δ).",on:"yd",ok:(e,c)=>c.S.ok},
  {t:"Ukur arus satu fasa dengan tang ampere saat bintang dan saat segitiga, lalu bandingkan.",on:"ta",ok:(e,c)=>{const f=c.S.flags;if(!/^L[123]$/.test(e.w))return false;if(c.mode==="star")f.iy=e.I;if(c.mode==="delta")f.id=e.I;return f.iy>0&&f.id>0}},
  {t:"Ukur tegangan kumparan U1–U2: ±230 V saat bintang dan ±400 V saat segitiga.",on:"mm",ok:(e,c)=>{const f=c.S.flags;if(!pairIs(e,"M.U1","M.U2"))return false;if(c.mode==="star"&&e.v>200&&e.v<260)f.vy=1;if(c.mode==="delta"&&e.v>380)f.vd=1;return f.vy&&f.vd}},
  {t:"Ubah waktu tunda TDR, jalankan ulang, lalu amati lama hubungan bintang.",on:"yd",ok:(e,c)=>c.S.delay!==3},
  MISSION_LOTO_F
 ]}
);

/* ===== logika kontrol ===== */
const kons=()=>pdef().comps.filter(c=>c.type==="kon").map(c=>c.id);
const tdrId=()=>{const t=pdef().comps.find(c=>c.type==="tdr");return t?t.id:null};
function solveCtl(st,wires){
  const terms=termList(),par={};terms.forEach(t=>par[t]=t);
  const f=x=>par[x]===x?x:(par[x]=f(par[x]));const u=(a,b)=>{if(par[a]===undefined||par[b]===undefined)return;par[f(a)]=f(b)};
  (wires||S.wires).forEach(w=>u(w.a,w.b));
  pdef().comps.forEach(c=>{const id=c.id;
    if(c.type==="pbn"&&!st.pressed[id])u(id+".t1",id+".t2");
    if(c.type==="pbo"&&st.pressed[id])u(id+".t3",id+".t4");
    if(c.type==="kon"){if(st.dev[id])u(id+".n13",id+".n14");else u(id+".n21",id+".n22")}
    if(c.type==="tor"){if(!st.torTrip)u(id+".t95",id+".t96");else u(id+".t97",id+".t98")}
    if(c.type==="tdr"){if(!st.Tdone)u(id+".n55",id+".n56");else u(id+".n67",id+".n68")}
  });
  const Lg=st.main?f("ctl.L"):null,Ng=f("ctl.N");
  const short=Lg!==null&&Lg===Ng;
  const coil={};pdef().comps.forEach(c=>{if(c.type==="kon"||c.type==="tdr"){const a=f(c.id+".a1"),b=f(c.id+".a2");coil[c.id]=Lg!==null&&!short&&((a===Lg&&b===Ng)||(a===Ng&&b===Lg))}});
  return{f,Lg,Ng,short,coil};
}
function settle(st,wires){
  for(let i=0;i<14;i++){
    const r=solveCtl(st,wires);if(r.short)return{short:true,r};
    let ch=false;Object.keys(r.coil).forEach(id=>{if(!!st.dev[id]!==r.coil[id]){st.dev[id]=r.coil[id];ch=true}});
    const t=tdrId();if(t&&!st.dev[t])st.Tdone=false;
    if(!ch)return{r,stable:true};
  }
  return{unstable:true,r:solveCtl(st,wires)};
}
function modeOf(dev){
  const p=pdef();
  if(p.test==="dol")return dev.K1?"run":"off";
  if(p.test==="fr"){if(dev.K1&&dev.K2)return"short";return dev.K1?"fwd":dev.K2?"rev":"off"}
  if(dev.KY&&dev.KD)return"short";if(!dev.K1)return"off";return dev.KY?"star":dev.KD?"delta":"open";
}
function settleLive(){
  const st={pressed:S.pressed,dev:S.dev,Tdone:S.T.done,torTrip:S.torTrip,main:energized()};
  const res=settle(st);S.T.done=st.Tdone;
  const t=tdrId();if(t){S.T.on=!!S.dev[t];if(!S.T.on){S.T.t=0;S.T.done=false}}
  S.ctl=res.r;
  if(res.short){magTripF("hubung singkat L–N pada rangkaian kontrol");return}
  if(res.unstable&&!S.chatterWarned){S.chatterWarned=1;toast("Kontaktor bergetar (chattering): rangkaian kontrol tidak stabil.");log("Kontaktor chattering")}
  if(modeOf(S.dev)==="short")magTripF(pdef().test==="fr"?"K1 dan K2 bekerja bersamaan → hubung singkat antarfasa":"kontaktor Y dan Δ bekerja bersamaan → hubung singkat antarfasa");
}
function magTripF(why){S.tripped=true;S.mcb=false;spark();toast("MCB trip seketika: "+why+"!");log("TRIP magnetik · "+why);S.dev={};S.T={on:false,t:0,done:false};settleLive();syncF();emit({type:"trip",kind:"mag"})}
function setMcbF(on){
  if(on){if(S.loto){toast("MCB terkunci LOTO. Lepas gembok terlebih dahulu.");return}S.mcb=true;S.tripped=false;log("MCB 3P dinaikkan")}
  else{S.mcb=false;S.tripped=false;log("MCB 3P diturunkan")}
  settleLive();syncF();emit({type:"state"});
}
function pressPb(id,down){
  if(!!S.pressed[id]===down)return;S.pressed[id]=down;
  const c=pdef().comps.find(x=>x.id===id);if(down)log("Tekan "+c.label);
  settleLive();syncF();emit({type:"pb",id,down});emit({type:"state"});
}
function torReset(){
  if(!S.torTrip){toast("TOR tidak dalam kondisi trip.",true);return}
  if(S.heat>.35){toast("Bimetal masih panas. Tunggu beberapa detik lalu reset.",true);return}
  S.torTrip=false;log("TOR direset");settleLive();syncF();emit({type:"torReset"});
}

/* ===== pemeriksaan rangkaian ===== */
function checkF(){
  const p=pdef(),items=[];const student=S.wires.filter(w=>!w.fixed);
  if(!student.length){$("#checkOut").innerHTML=`<li><span class="n">✗</span><span>Belum ada kabel yang dipasang.</span></li>`;return}
  // warna: kabel yang terhubung langsung ke N kontrol harus biru
  const par={};termList().forEach(t=>par[t]=t);const f=x=>par[x]===x?x:(par[x]=f(par[x]));S.wires.forEach(w=>{par[f(w.a)]=f(w.b)});
  const Ng=f("ctl.N");const bad=student.filter(w=>(f(w.a)===Ng)!==(w.c==="N")||w.c==="PE");
  items.push([!bad.length,bad.length?`Warna kabel salah pada ${bad.length} kabel. Kabel yang tersambung ke N kontrol berwarna biru, lainnya coklat.`:"Warna kabel kontrol sesuai."]);
  // skenario
  const st={pressed:{},dev:{},Tdone:false,torTrip:false,main:true};let msg=null,danger=false;
  const step=()=>{const r=settle(st);if(r.short){msg=msg||"Hubung singkat L–N di rangkaian kontrol.";danger=true}if(r.unstable)msg=msg||"Rangkaian kontrol tidak stabil (kontaktor bergetar).";if(modeOf(st.dev)==="short"){msg=msg||"Dua kontaktor daya dapat bekerja bersamaan → hubung singkat antarfasa.";danger=true}return st.dev};
  const press=(id,d)=>{st.pressed[id]=d;return step()};
  const need=(cond,m)=>{if(!msg&&!cond)msg=m};
  let d=step();
  if(p.test==="dol"){
    need(!d.K1,"Motor berjalan tanpa tombol ON ditekan.");
    d=press("S1",true);need(d.K1,"Tombol ON belum menghidupkan K1. Periksa jalur L → 95-96 → S0 → S1 → A1, dan A2 → N.");
    d=press("S1",false);need(d.K1,"K1 belum mengunci saat tombol ON dilepas. Pasang 13-14 paralel dengan S1.");
    d=press("S0",true);need(!d.K1,"Tombol OFF belum memutus K1. S0 (NC) harus seri sebelum S1 dan pengunci.");
    press("S0",false);press("S1",true);press("S1",false);st.torTrip=true;d=step();need(!d.K1,"TOR 95-96 belum memutus kumparan K1.");
  }else if(p.test==="fr"){
    need(!d.K1&&!d.K2,"Kontaktor bekerja tanpa tombol ditekan.");
    d=press("S1",true);need(d.K1&&!d.K2,"Tombol KANAN (S1) harus menghidupkan K1 saja.");
    d=press("S1",false);need(d.K1,"K1 belum mengunci saat S1 dilepas.");
    d=press("S2",true);need(!d.K2,"Interlock belum bekerja: K2 ikut hidup saat K1 bekerja. Seri-kan K1 21-22 dengan kumparan K2.");
    press("S2",false);d=press("S0",true);need(!d.K1&&!d.K2,"Tombol OFF belum mematikan semua kontaktor.");press("S0",false);
    d=press("S2",true);need(d.K2&&!d.K1,"Tombol KIRI (S2) harus menghidupkan K2 saja.");
    d=press("S2",false);need(d.K2,"K2 belum mengunci saat S2 dilepas.");
    d=press("S1",true);need(!d.K1,"Interlock belum bekerja: K1 ikut hidup saat K2 bekerja. Seri-kan K2 21-22 dengan kumparan K1.");
    press("S1",false);st.torTrip=true;d=step();need(!d.K1&&!d.K2,"TOR 95-96 belum memutus rangkaian kontrol.");
  }else{
    need(!d.K1&&!d.KY&&!d.KD,"Kontaktor bekerja tanpa tombol ditekan.");
    d=press("S1",true);need(d.K1&&d.KY&&!d.KD,"Saat start, K1 dan KY (bintang) harus bekerja, KΔ belum.");
    d=press("S1",false);need(d.K1,"K1 belum mengunci saat S1 dilepas.");
    need(d.T1,"Timer T1 belum mendapat tegangan saat motor start.");
    if(d.T1){st.Tdone=true;d=step();need(d.K1&&d.KD&&!d.KY,"Setelah waktu tunda, KY harus lepas dan KΔ masuk (periksa T1 55-56, 67-68, dan interlock).")}
    d=press("S0",true);need(!d.K1&&!d.KY&&!d.KD,"Tombol OFF belum mematikan semua kontaktor.");
  }
  items.push([!msg,msg||"Urutan kerja kontaktor sesuai (start, pengunci, stop, pengaman)."]);
  const pass=items.every(x=>x[0]);
  if(bad.length)violation("color","warna kabel kontrol tidak sesuai.");
  if(danger)violation("short","rangkaian berpotensi hubung singkat.");
  S.ok=pass;persistWires();
  $("#checkOut").innerHTML=items.map(([ok,m])=>`<li><span class="${ok?"y":"n"}">${ok?"✓":"✗"}</span><span>${esc(m)}</span></li>`).join("")+(pass?`<li><span class="y">★</span><span><b>Rangkaian lulus pemeriksaan.</b> Naikkan MCB 3P dan uji dengan tombol.</span></li>`:"");
  log(pass?"Periksa rangkaian: LULUS":"Periksa rangkaian: belum lulus");
  emit({type:"check",pass});
}

/* ===== tegangan (fasor) ===== */
const PH=d=>[230*Math.cos(d*Math.PI/180),230*Math.sin(d*Math.PI/180)];
const PL={L1:PH(0),L2:PH(-120),L3:PH(120)},Z0=[0,0];
function potF(t){
  const[cid,k]=t.split(".");
  if(cid==="src3")return PL[k]||Z0;
  const mode=energized()?modeOf(S.dev):"off";
  if(cid==="M"){
    if(pdef().test!=="yd"){if(mode==="run"||mode==="fwd")return{U:PL.L1,V:PL.L2,W:PL.L3}[k];if(mode==="rev")return{U:PL.L3,V:PL.L2,W:PL.L1}[k];return null}
    if(!S.dev.K1||!energized())return null;
    const top={U1:PL.L1,V1:PL.L2,W1:PL.L3};if(top[k])return top[k];
    if(mode==="star")return Z0;if(mode==="delta")return{U2:PL.L2,V2:PL.L3,W2:PL.L1}[k];
    return{U2:PL.L1,V2:PL.L2,W2:PL.L3}[k];
  }
  const r=S.ctl;if(!r)return null;const g=r.f(t);
  if(r.Lg!==null&&g===r.Lg)return PL.L1;if(g===r.Ng)return Z0;
  if(r.Lg!==null){for(const c of pdef().comps){if(c.type!=="kon"&&c.type!=="tdr")continue;const a=r.f(c.id+".a1"),b=r.f(c.id+".a2");if((a===g&&b===r.Lg)||(b===g&&a===r.Lg))return PL.L1}}
  return null;
}
const vdiff=(a,b)=>{a=a||Z0;b=b||Z0;return Math.hypot(a[0]-b[0],a[1]-b[1])};

/* ===== alat ukur ===== */
function insBodyF(){
  const opts=termList().map(t=>`<option value="${t}">${esc(termName(t))}</option>`).join("");let h="";
  if(S.ins==="mg")S.ins="mm";
  if(S.ins==="mm")h=`<div class="grid2"><label class="field">Probe merah<select id="pRed">${opts}</select></label><label class="field">Probe hitam (COM)<select id="pBlack">${opts}</select></label></div>
    <label class="field" style="margin-top:8px">Posisi selektor<select id="mmMode"><option value="V">V~ (tegangan AC)</option><option value="R">Ω (hambatan / kontinuitas)</option></select></label>`;
  if(S.ins==="tp")h=`<label class="field">Titik yang disentuh<select id="tpPoint">${opts}</select></label>`;
  if(S.ins==="ta")h=`<label class="field">Kabel yang dijepit<select id="taWire"><option value="L1">Kabel fasa L1 motor</option><option value="L2">Kabel fasa L2 motor</option><option value="L3">Kabel fasa L3 motor</option><option value="all">Ketiga fasa motor bersamaan</option><option value="ctl">Kabel kontrol (kumparan)</option></select></label>`;
  $("#insBody").innerHTML=h;
  const a=$("#pRed"),b=$("#pBlack");if(a){a.value=S.red;a.onchange=()=>{S.red=a.value;readF(true);placeProbes()}}if(b){b.value=S.black;b.onchange=()=>{S.black=b.value;readF(true);placeProbes()}}
  const mm=$("#mmMode");if(mm){mm.value=S.mode2;mm.onchange=()=>{S.mode2=mm.value;log("Selektor multimeter: "+(S.mode2==="V"?"V~":"Ω"));readF(true)}}
  const tp=$("#tpPoint");if(tp){tp.value=S.tp;tp.onchange=()=>{S.tp=tp.value;readF(true);placeProbes()}}
  const ta=$("#taWire");if(ta){if(![...ta.options].some(o=>o.value===S.ta))S.ta="L1";ta.value=S.ta;ta.onchange=()=>{S.ta=ta.value;readF(true)}}
}
function readF(user){
  const lcd=$("#lcd"),note=$("#readNote");$("#neon").hidden=S.ins!=="tp";const mode=S.mot.mode;
  if(S.ins==="mm"){
    if(S.red===S.black){lcd.innerHTML="----";note.textContent="Kedua probe berada di titik yang sama.";return}
    if(S.mode2==="R"){
      if(energized()){lcd.innerHTML="Err";note.textContent="Bahaya! Mengukur Ω saat rangkaian bertegangan. Turunkan MCB 3P dulu.";if(user)violation("ohm","selektor Ω dipakai pada rangkaian bertegangan.");return}
      const r=solveCtl({pressed:S.pressed,dev:{},Tdone:false,torTrip:S.torTrip,main:false});const ga=r.f(S.red),gb=r.f(S.black);
      const mt=motorTerms();let txt="OL",nt="Open loop: tidak ada sambungan.";
      if(mt.includes(S.red)&&mt.includes(S.black)){const six=pdef().test==="yd";const ka=S.red.split(".")[1],kb=S.black.split(".")[1];
        if(six&&ka[0]===kb[0]){txt="3.4<small>Ω</small>";nt="Hambatan satu kumparan motor."}else if(six){txt="OL";nt="Kumparan berbeda tidak terhubung saat plat terminal dilepas."}else{txt="6.8<small>Ω</small>";nt="Hambatan dua kumparan motor (terhubung Δ di kotak terminal)."}}
      else if(ga===gb){txt="0.2<small>Ω</small>";nt="Tersambung (kontinu)."}
      else{const coil=pdef().comps.find(c=>(c.type==="kon"||c.type==="tdr")&&((r.f(c.id+".a1")===ga&&r.f(c.id+".a2")===gb)||(r.f(c.id+".a1")===gb&&r.f(c.id+".a2")===ga)));
        if(coil){txt=(coil.type==="kon"?"560":"1.2k")+"<small>Ω</small>";nt="Hambatan kumparan "+coil.label+". Kumparan dalam kondisi baik."}}
      lcd.innerHTML=txt;note.textContent=nt;if(user)emit({type:"mmR",a:S.red,b:S.black});return;
    }
    const v=vdiff(potF(S.red),potF(S.black));const vj=v>1?v+(Math.random()-.5)*1.2:v;
    lcd.innerHTML=`${v<.05?"0.0":vj.toFixed(1)}<small>V~</small>`;
    note.textContent=v>380?"Tegangan antarfasa (line to line) ±400 V.":v>200?"Tegangan fasa–netral ±230 V.":v>1?"Beda tegangan kecil.":"Tidak ada beda tegangan antara kedua titik.";
    if(user)emit({type:"mm",a:S.red,b:S.black,v});
  }else if(S.ins==="tp"){
    const p=potF(S.tp),lit=!!p&&Math.hypot(p[0],p[1])>60;$("#neon").classList.toggle("lit",lit);$("#neonTxt").textContent=lit?"Lampu test pen MENYALA":"Tidak menyala";
    lcd.innerHTML=lit?"FASA":"–";note.textContent=lit?"Titik ini bertegangan. Jangan disentuh!":"Tidak terdeteksi fasa. Pastikan juga dengan multimeter.";
    if(user)emit({type:"tp",p:S.tp,lit});
  }else{
    let I=0,n="";
    if(/^L[123]$/.test(S.ta)){I=S.mot.I;n=mode==="star"?"Arus jala-jala saat hubungan bintang (lebih kecil).":mode==="delta"?"Arus jala-jala saat hubungan segitiga.":mode==="off"?"Motor berhenti.":"Arus fasa motor. Lonjakan sesaat terjadi saat start."}
    else if(S.ta==="all"){I=0;n="Jumlah vektor tiga arus fasa yang seimbang adalah nol, sehingga medan magnetnya saling meniadakan."}
    else{I=Object.values(S.dev).filter(Boolean).length*.045;n="Arus kecil kumparan kontaktor/timer."}
    lcd.innerHTML=`${(I*(1+(Math.random()-.5)*.01)).toFixed(2)}<small>A~</small>`;note.textContent=n;
    if(user)emit({type:"ta",w:S.ta,I});
  }
}
function ctxF(){return{S,energized:energized(),dev:S.dev,mode:S.mot.mode}}

/* ===== UI ===== */
function initF(){
  Object.assign(S,{pressed:{},dev:{},T:{on:false,t:0,done:false},delay:3,torTrip:false,torSet:IN,load:100,mot:{mode:"off",tMode:0,Ipk:0,I:0,speed:0},ta:"L1",chatterWarned:0});
  const mt=motorTerms();S.red=mt[0];S.black=mt[1];S.tp="ctl.L";
}
function setupF(){
  const p=pdef();
  $("#swBtns").innerHTML=p.comps.filter(c=>c.type==="pbn"||c.type==="pbo").map(c=>`<button class="btn sm" data-pb="${c.id}" style="border-color:${c.type==="pbn"?"var(--danger)":"var(--ok)"}">${esc(c.label)}</button>`).join("")+`<button class="btn sm" id="bTorReset">Reset TOR</button>`;
  $$("#swBtns [data-pb]").forEach(b=>{const id=b.dataset.pb;
    b.onpointerdown=e=>{e.preventDefault();pressPb(id,true)};const up=()=>pressPb(id,false);b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up;
    b.onkeydown=e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();pressPb(id,true)}};b.onkeyup=e=>{if(e.key===" "||e.key==="Enter")pressPb(id,false)}});
  $("#bTorReset").onclick=torReset;
  $("#extraCtl").innerHTML=`<p class="muted small">Tahan tombol untuk menekan, lepas untuk melepas. Tombol juga bisa diklik di papan.</p>
    <label class="field">Beban motor: <span id="loadVal">100%</span><input type="range" id="selLoadF" min="0" max="160" step="5" value="100"></label>
    <div class="grid2"><label class="field">Setelan TOR<select id="selTor"><option value="3.5">3,5 A</option><option value="4.7" selected>4,7 A (= In motor)</option><option value="6">6,0 A</option></select></label>
    ${tdrId()?`<label class="field">Waktu tunda TDR<select id="selDelay"><option value="3">3 detik</option><option value="5">5 detik</option><option value="8">8 detik</option></select></label>`:"<span></span>"}</div>`;
  $("#selLoadF").oninput=e=>{S.load=+e.target.value;$("#loadVal").textContent=S.load+"%"};
  $("#selLoadF").onchange=()=>log("Beban motor "+S.load+"%");
  $("#selTor").onchange=e=>{S.torSet=+e.target.value;log("Setelan TOR "+e.target.value+" A")};
  const sd=$("#selDelay");if(sd)sd.onchange=e=>{S.delay=+e.target.value;log("Waktu tunda TDR "+S.delay+" s")};
  $$("#insTabs [data-ins]").forEach(b=>b.hidden=b.dataset.ins==="mg");
  settleLive();
}
function syncF(){
  if(!S)return;
  $("#bMcb").textContent=S.tripped?"Reset MCB 3P (trip)":S.mcb?"Turunkan MCB 3P":"Naikkan MCB 3P";
  $("#bLoto").setAttribute("aria-pressed",S.loto);$("#bLoto").textContent=S.loto?"Lepas LOTO":"Pasang LOTO";
  const m=$("#mtMcb");m.className="meter"+(S.tripped?" trip":energized()?" on":"");
  $("#mvMcb").textContent=S.tripped?"TRIP":S.mcb?"ON · 3P C10":"OFF";
  $("#mvV").textContent=energized()?"400/230 V":"0 V";
  $("#mvI").textContent=fmt(S.mot.I,2)+" A";
  $("#mvP").textContent=fmt(Math.sqrt(3)*400*S.mot.I*.82/1000,2)+" kW";
  $$("#swBtns [data-pb]").forEach(b=>b.setAttribute("aria-pressed",!!S.pressed[b.dataset.pb]));
  const tr=$("#bTorReset");if(tr){tr.disabled=!S.torTrip;tr.textContent=S.torTrip?"Reset TOR (trip)":"Reset TOR"}
  update3DF();readF(false);
}

/* ===== animasi motor ===== */
function animateF(dt){
  if(S.T.on&&!S.T.done){S.T.t+=dt;if(S.T.t>=S.delay){S.T.done=true;log("TDR habis waktu ("+S.delay+" s)");settleLive();syncF()}}
  const mode=modeOf(S.dev),M=S.mot;
  if(mode!==M.mode){const prev=M.mode;M.mode=mode;M.tMode=0;
    const Irun=IN*(.35+.65*S.load/100);
    M.Ipk=mode==="run"||mode==="fwd"||mode==="rev"?IN*6:mode==="star"?IN*2.2:mode==="delta"?(prev==="star"?IN*2.6:IN*6):0;
    if(mode!=="off"&&mode!=="open")log(({run:"Motor berputar (DOL)",fwd:"Motor berputar kanan",rev:"Motor berputar kiri",star:"Motor start hubungan BINTANG",delta:"Motor pindah ke SEGITIGA"})[mode]);
    if(mode==="off"&&prev!=="off")log("Motor berhenti");
    if(prev==="star"&&mode==="delta")emit({type:"yd"});
    syncF();
  }
  M.tMode+=dt;
  const Irun=IN*(.35+.65*S.load/100);
  const tgt=mode==="run"||mode==="fwd"||mode==="rev"||mode==="delta"?Irun:mode==="star"?Irun*.6:0;
  M.I=tgt?tgt+(M.Ipk-tgt)*Math.exp(-M.tMode/.45):0;
  const spT=mode==="run"||mode==="fwd"||mode==="delta"?1:mode==="rev"?-1:mode==="star"?.85:0;
  M.speed+=(spT-M.speed)*Math.min(1,dt*(spT?1.6:.7));
  if(L.motorShaft)L.motorShaft.rotation.x+=M.speed*dt*28;
  // TOR
  const r=M.I/S.torSet;
  if(r>1.05&&!S.torTrip){const tt=clamp(20/(r*r-1),2,12);S.heat+=dt/tt;if(S.heat>=1){S.torTrip=true;S.flags.torTripped=1;toast(`TOR trip: arus motor ${fmt(M.I,2)} A melebihi setelan ${fmt(S.torSet,1)} A`);log("TOR TRIP · beban lebih motor");settleLive();syncF();emit({type:"trip",kind:"tor"})}}
  else S.heat=Math.max(0,S.heat-dt*(S.torTrip?.12:.2));
  $("#heatBar").style.width=(S.heat*100).toFixed(1)+"%";
  $("#mvI").textContent=fmt(M.I,2)+" A";$("#mvP").textContent=fmt(Math.sqrt(3)*400*M.I*.82/1000,2)+" kW";
  // titik arus pada kabel daya
  let di=0;
  if(L.mainPaths&&Math.abs(M.speed)>.05&&M.I>.05){const t=performance.now()/1000;
    L.mainPaths.forEach(p=>{const n=Math.max(2,Math.round(p.len*3));for(let i=0;i<n&&di<L.dots.length;i++){const u=((t*.35*Math.min(3,M.I/IN)/p.len*1.5)+i/n)%1;L.dots[di].position.copy(p.curve.getPointAt(u));L.dots[di].visible=true;di++}})}
  if(L.dots)for(;di<L.dots.length;di++)L.dots[di].visible=false;
  if(L.tdrLed)L.tdrLed.emissiveIntensity=S.T.done?2:(S.T.on?(Math.sin(performance.now()/120)>0?.9:.2):.05);
}
function update3DF(){
  if(L.lever){L.lever.rotation.x=energized()?0:Math.PI;L.lever.position.y=energized()?.17:.2}
  if(L.tag)L.tag.visible=S.loto;
  Object.entries(L.kon||{}).forEach(([id,o])=>{const on=!!S.dev[id];o.ind.position.y=on?o.y0-.05:o.y0;o.ind.material=on?MAT.red:MAT.dark});
  Object.entries(L.pb||{}).forEach(([id,o])=>o.position.z=S.pressed[id]?.1:.16);
  if(L.torFlag)L.torFlag.material=S.torTrip?MAT.orange:MAT.grey;
}

/* ===== 3D komponen Fase F ===== */
const BUILD_F={
  src3(sc,c,g,term,lbl,strip){const b=roundedBox(.72,.95,.22,.05,MAT.grey);b.position.z=.06;g.add(b);
    const l=labelPlane(256,340,(x,w,h)=>{x.fillStyle="#2a3038";x.fillRect(0,0,w,h);x.fillStyle="#f2b705";x.font="bold 50px Barlow Condensed, sans-serif";x.textAlign="center";x.fillText("PLN 3 FASA",w/2,80);x.fillStyle="#e7edf3";x.font="bold 34px JetBrains Mono, monospace";x.fillText("400/230 V",w/2,160);x.fillText("50 Hz",w/2,215);x.font="26px sans-serif";x.fillText("L1 L2 L3 N PE",w/2,290)},.58,.77);l.position.z=.18;g.add(l);
    strip(.66,-.62);["L1","L2","L3","N","PE"].forEach(k=>term(k,k,-.13))},
  mcb3(sc,c,g,term,lbl){const enc=roundedBox(.7,1.0,.16,.04,MAT.white);enc.position.z=.03;g.add(enc);
    [-.17,0,.17].forEach(x=>{const m=roundedBox(.16,.6,.22,.02,MAT.white);m.position.set(x,0,.17);g.add(m);const lb=labelPlane(64,128,(cx,w,h)=>{cx.fillStyle="#f3f2ee";cx.fillRect(0,0,w,h);cx.fillStyle="#15202b";cx.font="bold 30px Barlow Condensed, sans-serif";cx.textAlign="center";cx.fillText("C10",w/2,80)},.13,.26);lb.position.set(x,-.14,.285);g.add(lb)});
    L.lever=new T.Group();const lv=box(.46,.06,.09,MAT.black);lv.position.y=.07;L.lever.add(lv);L.lever.position.set(0,.16,.3);g.add(L.lever);L.mcbLabel=null;
    const hit=box(.6,.75,.4,new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.z=.2;hit.userData.pick={k:"mcb"};g.add(hit);L.pickables.push(hit);
    L.tag=new T.Group();L.tag.add(box(.1,.09,.04,MAT.red));const tc=labelPlane(128,96,(x,w,h)=>{x.fillStyle="#c62f26";x.fillRect(0,0,w,h);x.fillStyle="#fff";x.font="bold 30px sans-serif";x.textAlign="center";x.fillText("BAHAYA",w/2,40);x.font="bold 22px sans-serif";x.fillText("LOTO",w/2,78)},.2,.15);tc.position.set(.15,-.12,.03);L.tag.add(tc);
    L.tag.position.set(c.x,c.y+.2,.45);L.tag.visible=false;sc.add(L.tag);lbl("MCB 3P C10",-.62)},
  ctl(sc,c,g,term,lbl){const b=roundedBox(.5,.2,.1,.03,MAT.dark);b.position.z=.05;g.add(b);const m=roundedBox(.12,.32,.16,.02,MAT.white);m.position.set(0,.3,.1);g.add(m);term("L","L",-.13);term("N","N",-.13);lbl("Sumber kontrol (MCB 1P)",.6)},
  pbn(sc,c,g,term,lbl,strip){BUILD_F._pb(sc,c,g,term,lbl,strip,MAT.red)},
  pbo(sc,c,g,term,lbl,strip){BUILD_F._pb(sc,c,g,term,lbl,strip,MAT.green)},
  _pb(sc,c,g,term,lbl,strip,m){const b=roundedBox(.44,.44,.18,.05,mat(0xd6dade));b.position.z=.08;g.add(b);
    const bz=cyl(.13,.13,.04,MAT.dark,24);bz.rotation.x=Math.PI/2;bz.position.z=.18;g.add(bz);
    const btn=cyl(.1,.1,.08,m,24);btn.rotation.x=Math.PI/2;btn.position.z=.16;btn.userData.pick={k:"pb",id:c.id};g.add(btn);L.pickables.push(btn);(L.pb=L.pb||{})[c.id]=btn;
    strip(.36,.32);Object.keys(CT[c.type].terms).forEach(k=>term(k,CT[c.type].names[k]));lbl(c.label,-.36)},
  kon(sc,c,g,term,lbl){const b=roundedBox(.72,.9,.4,.04,mat(0xd6dade));b.position.z=.15;g.add(b);
    const win=box(.22,.12,.02,MAT.black);win.position.set(0,.2,.36);g.add(win);
    const ind=box(.15,.07,.04,MAT.dark);ind.position.set(0,.2,.38);g.add(ind);(L.kon=L.kon||{})[c.id]={ind,y0:.2};
    [-.2,0,.2].forEach(x=>[.38,-.38].forEach(y=>{const s=cyl(.035,.035,.03,MAT.brass,12);s.rotation.x=Math.PI/2;s.position.set(x,y,.36);g.add(s)}));
    const st=box(.12,.8,.06,MAT.black);st.position.set(-.56,0,.06);g.add(st);
    Object.keys(CT.kon.terms).forEach(k=>term(k,CT.kon.names[k],0,-.15));
    const s=sprite(c.label,{bg:"rgba(21,32,43,.9)",fg:"#f2b705",fs:28,w:Math.min(256,40+c.label.length*17),sw:.24});s.position.set(c.x,c.y-.08,.42);sc.add(s)},
  tor(sc,c,g,term,lbl){const b=roundedBox(.62,.45,.35,.04,mat(0x3b434c));b.position.z=.13;g.add(b);
    const d=cyl(.08,.08,.04,MAT.blue,20);d.rotation.x=Math.PI/2;d.position.set(-.12,.05,.32);g.add(d);
    const rst=cyl(.06,.06,.06,MAT.blue,16);rst.rotation.x=Math.PI/2;rst.position.set(.15,.08,.33);rst.userData.pick={k:"torReset"};g.add(rst);L.pickables.push(rst);
    L.torFlag=box(.12,.04,.02,MAT.grey);L.torFlag.position.set(.15,-.1,.32);g.add(L.torFlag);
    const st=box(.12,.5,.06,MAT.black);st.position.set(-.46,-.03,.06);g.add(st);
    Object.keys(CT.tor.terms).forEach(k=>term(k,CT.tor.names[k],0,-.15));lbl(c.label,-.34)},
  tdr(sc,c,g,term,lbl){const b=roundedBox(.45,.7,.35,.05,mat(0xd6dade));b.position.z=.13;g.add(b);
    const k=cyl(.09,.09,.04,MAT.white,24);k.rotation.x=Math.PI/2;k.position.set(0,.05,.32);g.add(k);
    const lm=mat(0xe8621c,{emissive:0xe8621c,emissiveIntensity:.05});const led=cyl(.025,.025,.02,lm);led.rotation.x=Math.PI/2;led.position.set(.12,.25,.31);g.add(led);L.tdrLed=lm;
    const st=box(.12,.8,.06,MAT.black);st.position.set(-.42,0,.06);g.add(st);
    Object.keys(CT.tdr.terms).forEach(kk=>term(kk,CT.tdr.names[kk],0,-.15));lbl(c.label,-.45)},
  motor3(sc,c,g,term,lbl){BUILD_F._motor(sc,c,g,term,lbl)},
  motor6(sc,c,g,term,lbl){BUILD_F._motor(sc,c,g,term,lbl)},
  _motor(sc,c,g,term,lbl){const paint=mat(0x2f6fa8,{roughness:.45,metalness:.2});
    const body=cyl(.32,.32,.9,paint,40);body.rotation.z=Math.PI/2;body.position.z=.36;g.add(body);
    for(let i=0;i<8;i++){const f=cyl(.35,.35,.02,paint,32);f.rotation.z=Math.PI/2;f.position.set(-.35+i*.1,0,.36);g.add(f)}
    const fan=cyl(.33,.3,.22,MAT.dark,32);fan.rotation.z=Math.PI/2;fan.position.set(-.55,0,.36);g.add(fan);
    L.motorShaft=new T.Group();const sh=cyl(.05,.05,.3,MAT.chrome,16);sh.rotation.z=Math.PI/2;L.motorShaft.add(sh);const key=box(.2,.02,.03,MAT.steel);key.position.y=.052;L.motorShaft.add(key);
    const cp=cyl(.12,.12,.08,MAT.yellow,6);cp.rotation.z=Math.PI/2;cp.position.x=.12;L.motorShaft.add(cp);L.motorShaft.position.set(.6,0,.36);g.add(L.motorShaft);
    const tb=roundedBox(.5,.28,.3,.04,paint);tb.position.set(0,.42,.3);g.add(tb);
    [-.3,.3].forEach(x=>{const ft=box(.2,.1,.5,paint);ft.position.set(x,-.32,.36);g.add(ft)});
    Object.keys(CT[c.type].terms).forEach(k=>{const lo=c.type==="motor6"&&k.endsWith("2");term(k,CT[c.type].names[k],lo?-.11:.12)});lbl(c.label,-.55)}
};
function buildMainF(sc){
  const p=pdef(),comps=allComps();const pos=id=>comps.find(c=>c.id===id);
  const anchor=(id,end)=>{const c=pos(id);const dy={mcb3:.5,kon:.45,tor:.23,motor3:.42,motor6:.42}[c.type]||.4;
    if(/^motor/.test(c.type))return[c.x+(end==="in"?-.15:.15),c.y+dy-.05];return[c.x,c.y+(end==="in"?dy:-dy)]};
  const cols=[MAT.brown,MAT.black,MAT.grey];L.mainPaths=[];
  p.main.forEach(([a,b],idx)=>{const A=anchor(a,"out"),B=anchor(b,"in");const dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy)||1;const nx=-dy/l,ny=dx/l;
    [-1,0,1].forEach((o,i)=>{const ox=nx*o*.045,oy=ny*o*.045,z=.1+i*.005;
      const curve=new T.CatmullRomCurve3([new T.Vector3(A[0]+ox,A[1]+oy,z+.05),new T.Vector3(A[0]+ox+dx*.15,A[1]+oy+dy*.15,z+.2),new T.Vector3((A[0]+B[0])/2+ox,(A[1]+B[1])/2+oy-.05,z+.32+(idx%2)*.05),new T.Vector3(B[0]+ox-dx*.15,B[1]+oy-dy*.15,z+.2),new T.Vector3(B[0]+ox,B[1]+oy,z+.05)]);
      const m=new T.Mesh(new T.TubeGeometry(curve,40,.02,8,false),cols[i]);m.castShadow=true;sc.add(m);L.mainPaths.push({curve,len:curve.getLength()})})});
}
/* ================= BERANDA ================= */
function renderBeranda(){
  const g=grades();const [pr,cls]=predikat(g.akhir);
  const nama=App.guru&&!REC.nama?"Bapak/Ibu Guru":REC.nama.split(" ")[0];
  const bar=(lbl,v,d,href)=>`<a class="card" href="${href}" style="text-decoration:none;color:inherit;display:grid;gap:8px"><div class="row" style="justify-content:space-between"><b style="font-family:var(--f-display);font-size:22px;text-transform:uppercase">${lbl}</b><span class="mono">${Math.round(v)}</span></div><div class="bar"><i style="width:${v}%"></i></div><span class="muted small">${d}</span></a>`;
  const PRf=praksOf(curFase());const nextP=PRf.find(p=>!((REC.prak||{})[p.id]&&(REC.prak[p.id].done||[]).length===p.missions.length));
  $("#berandaBody").innerHTML=`
   <div class="page-head"><div><p class="eyebrow">${App.guru?"Mode guru · menampilkan Fase "+curFase():"Fase "+esc(REC.fase||"E")+" · "+esc(REC.kelas)+(REC.absen?" · No. absen "+esc(REC.absen):"")}</p><h1>Halo, ${esc(nama)}</h1>
     <p>${curFase()==="F"?"Fase F berfokus pada kendali motor 3 fasa: kontaktor, TOR, pengunci, interlock, dan pengasutan bintang-segitiga.":"Fase E berfokus pada alat kerja, alat ukur, dan instalasi penerangan satu fasa."} ${App.guru?"":`<button class="btn xs" id="bGantiFase">Ganti ke Fase ${curFase()==="F"?"E":"F"}</button>`}</p><p>Ikuti tiga tahap Pembelajaran Mendalam. Nilai akhirmu dihitung dari Memahami ${App.bobot.m}%, Praktikum ${App.bobot.p}%, Kuis ${App.bobot.k}%, dan Refleksi ${App.bobot.r}%.</p></div>
     ${App.guru?`<a class="btn primary" href="#nilai">Lihat nilai siswa</a>`:`<div class="card" style="min-width:220px"><span class="muted small">Nilai akhir sementara</span><div class="row" style="align-items:baseline;gap:12px"><span class="score-big">${Math.round(g.akhir)}</span><span class="grade ${cls}">${pr}</span></div></div>`}</div>
   <div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr));gap:12px" id="bGrid">
     ${bar("Memahami",g.m,`${(REC.studied||[]).length} alat dipelajari`,"#toolkit")}
     ${bar("Praktikum",g.p,`${PRf.filter(p=>((REC.prak||{})[p.id]||{}).score>0).length} dari ${PRf.length} praktikum dikerjakan`,"#praktikum")}
     ${bar("Kuis",g.k,`${g.benar} benar dari ${g.nq} soal`,"#kuis")}
     ${bar("Refleksi",g.r,`${g.rf}/3 pertanyaan dijawab`,"#refleksi")}
   </div>
   <nav class="alur" aria-label="Alur belajar">
     <a href="#toolkit"><span class="n">TAHAP 1</span><b>Memahami</b><small>Kenali ${tools().length} alat dalam 3D: bagian, cara kerja, dan K3.</small></a>
     <a href="#${nextP?nextP.id:"praktikum"}"><span class="n">TAHAP 2</span><b>Mengaplikasi</b><small>${nextP?"Lanjutkan "+esc(nextP.no)+": "+esc(nextP.title):"Semua praktikum tuntas. Ulangi untuk menaikkan nilai."}</small></a>
     <a href="#kuis"><span class="n">TAHAP 3</span><b>Merefleksi</b><small>Kerjakan kuis diagnostik dan tulis jurnal refleksi.</small></a>
   </nav>
   <div class="prinsip" style="margin-top:16px">
     <div class="card"><span class="tag">Berkesadaran</span><p>Setiap alat dibuka dengan pertanyaan pemantik. Setiap tindakan di praktikum dicatat, termasuk pelanggaran K3.</p></div>
     <div class="card"><span class="tag">Bermakna</span><p>Kamu merangkai sendiri saklar tunggal, seri, tukar, dan stop kontak seperti di rumah sungguhan, lalu membuktikannya dengan alat ukur.</p></div>
     <div class="card"><span class="tag">Menggembirakan</span><p>Alat bisa diputar dan diperagakan, misi diselesaikan bertahap, dan kuis langsung memberi pembahasan.</p></div>
   </div>`;
  if(window.innerWidth<860)$("#bGrid").style.gridTemplateColumns="1fr 1fr";
  const gf=$("#bGantiFase");if(gf)gf.onclick=()=>{const nf=REC.fase==="F"?"E":"F";confirmBox("Ganti ke Fase "+nf+"?","Materi, praktikum, dan kuis akan menyesuaikan Fase "+nf+". Kemajuan di fase sebelumnya tetap tersimpan.","Ganti fase",()=>{REC.fase=nf;addLog("Ganti ke Fase "+nf);save(true);curTool=null;renderWho();renderBeranda()})};
}

/* ================= KUIS ================= */
function renderQuiz(){
  if(App.route!=="kuis")return;
  const el=$("#quizCard"),Q=soal();const K=REC.kuis=REC.kuis||{ans:{},i:0};
  if(!Q.length){el.innerHTML=`<p class="empty">Belum ada soal.</p>`;return}
  const done=Q.every(q=>K.ans[q.id]!==undefined);
  if(done&&K.i>=Q.length){
    const sc=Q.filter(q=>K.ans[q.id]===q.a).length;const pct=sc/Q.length*100;
    if(!K.best||pct>K.best){K.best=Math.round(pct);save()}
    el.innerHTML=`<h3>Hasil kuis</h3><div class="row" style="align-items:baseline;gap:14px"><span class="score-big">${sc}<span class="muted" style="font-size:28px"> / ${Q.length}</span></span><span class="grade ${predikat(pct)[1]}">${Math.round(pct)}</span></div>
    <p class="muted" style="margin-top:8px">${sc===Q.length?"Sempurna. Konsep K3 dan pengukuran sudah kamu kuasai.":pct>=75?"Bagus. Tinjau kembali soal yang salah di Praktikum.":"Ulangi Toolkit dan Praktikum, lalu coba lagi."}</p>
    <div class="qdots" style="margin-top:12px">${Q.map(q=>`<i class="${K.ans[q.id]===q.a?"r":"w"}"></i>`).join("")}</div>
    <div class="quiz-foot"><a class="btn" href="#refleksi">Lanjut ke refleksi</a><button class="btn sm" id="qRetry">Ulangi kuis</button></div>`;
    $("#qRetry").onclick=()=>confirmBox("Ulangi kuis?","Jawaban saat ini akan dihapus. Nilai yang dilihat guru adalah hasil percobaan terbaru.","Ulangi",()=>{K.ans={};K.i=0;K.coba=(K.coba||1)+1;addLog("Mengulang kuis");save();renderQuiz()});return;
  }
  const i=clamp(K.i||0,0,Q.length-1),q=Q[i],answered=K.ans[q.id]!==undefined;
  el.innerHTML=`<h3>Soal ${i+1} <span class="mono muted" style="font-size:14px">${i+1}/${Q.length}</span></h3>
   <div class="quiz-q"><h4>${esc(q.q)}</h4><div class="opts">${q.o.map((o,k)=>`<button class="opt ${answered?(k===q.a?"right":k===K.ans[q.id]?"wrong":""):""}" data-k="${k}" ${answered?"disabled":""}>${String.fromCharCode(65+k)}. ${esc(o)}</button>`).join("")}</div>
   ${answered?`<div class="explain"><b>${K.ans[q.id]===q.a?"Tepat.":"Belum tepat."}</b> ${esc(q.e||"")}</div>`:""}</div>
   <div class="quiz-foot"><div class="qdots">${Q.map((qq,k)=>`<i class="${K.ans[qq.id]===undefined?"":K.ans[qq.id]===qq.a?"r":"w"} ${k===i?"cur":""}"></i>`).join("")}</div>
   <div class="row"><button class="btn sm" id="qPrev" ${i===0?"disabled":""}>Sebelumnya</button><button class="btn sm primary" id="qNext" ${answered?"":"disabled"}>${i===Q.length-1?"Lihat hasil":"Berikutnya"}</button></div></div>`;
  $$("#quizCard .opt").forEach(b=>b.onclick=()=>{K.ans[q.id]=+b.dataset.k;addLog(`Kuis soal ${i+1}: ${+b.dataset.k===q.a?"benar":"salah"}`);save();renderQuiz()});
  $("#qNext").onclick=()=>{K.i=i+1;if(K.i>=Q.length&&!done){const f=Q.findIndex(x=>K.ans[x.id]===undefined);if(f>=0)K.i=f}save();renderQuiz()};
  $("#qPrev").onclick=()=>{K.i=Math.max(0,i-1);renderQuiz()};
}

/* ================= REFLEKSI ================= */
let reflT;
function loadRefl(){const R=REC.refl=REC.refl||{r1:"",r2:"",r3:""};["r1","r2","r3"].forEach((k,i)=>{const t=$("#rf"+(i+1));t.value=R[k]||"";t.oninput=()=>{R[k]=t.value;$("#reflNote").textContent="Menyimpan…";clearTimeout(reflT);reflT=setTimeout(()=>{save();$("#reflNote").textContent=App.online&&!App.readOnly?"Tersimpan dan terkirim ke guru":"Tersimpan di perangkat ini"},900)}})}

/* ================= NILAI (GURU) ================= */
let nlSort={k:"nama",d:1},nlSel=null;
function nilaiRows(){
  return App.siswa.filter(s=>s.nama).map(s=>{const g=grades(s);return{s,g,fase:s.fase||"E",nama:s.nama,kelas:s.kelas||"",absen:+s.absen||0,m:g.m,p:g.p,k:g.k,r:g.r,akhir:g.akhir,aktif:s.aktif||0}});
}
function renderNilai(){
  if(!App.guru)return;
  const all=nilaiRows();
  const kelasSet=[...new Set(all.map(r=>r.kelas).filter(Boolean))].sort();
  const ks=$("#nlKelas"),cur=ks.value;ks.innerHTML=`<option value="">Semua kelas</option>`+kelasSet.map(k=>`<option ${k===cur?"selected":""}>${esc(k)}</option>`).join("");
  const q=$("#nlSearch").value.trim().toLowerCase();
  const fv=$("#nlFase").value;
  let rows=all.filter(r=>(!fv||r.fase===fv)&&(!ks.value||r.kelas===ks.value)&&(!q||r.nama.toLowerCase().includes(q)));
  rows.sort((a,b)=>{const x=a[nlSort.k],y=b[nlSort.k];return(typeof x==="string"?x.localeCompare(y,"id"):x-y)*nlSort.d});
  const avg=k=>rows.length?rows.reduce((a,r)=>a+r[k],0)/rows.length:0;
  $("#nilaiStats").innerHTML=`<div class="stat"><small>Siswa</small><b>${rows.length}</b></div><div class="stat"><small>Rata-rata akhir</small><b>${Math.round(avg("akhir"))}</b></div><div class="stat"><small>Tuntas (≥ 75)</small><b>${rows.filter(r=>r.akhir>=75).length}</b></div><div class="stat"><small>Rata-rata praktikum</small><b>${Math.round(avg("p"))}</b></div>`;
  const cols=[["no","No",0],["nama","Nama"],["fase","Fase"],["kelas","Kelas"],["absen","Absen"],["m","Memahami"],["p","Praktikum"],["k","Kuis"],["r","Refleksi"],["akhir","Akhir"],["aktif","Terakhir aktif"]];
  $("#nlHead").innerHTML="<tr>"+cols.map(([k,l,s])=>`<th>${s===0?l:`<button data-k="${k}">${l}${nlSort.k===k?(nlSort.d>0?" ▲":" ▼"):""}</button>`}</th>`).join("")+"</tr>";
  $$("#nlHead [data-k]").forEach(b=>b.onclick=()=>{const k=b.dataset.k;nlSort={k,d:nlSort.k===k?-nlSort.d:(["nama","kelas","absen"].includes(k)?1:-1)};renderNilai()});
  if(!SB){$("#nlBody").innerHTML=`<tr><td colspan="11" class="empty">Database belum dikonfigurasi. Isi config.js dengan URL dan anon key Supabase.</td></tr>`;return}
  $("#nlBody").innerHTML=rows.length?rows.map((r,i)=>{const[pd,c]=predikat(r.akhir);return`<tr class="click" data-id="${esc(r.s._id)}"><td class="num">${i+1}</td><td><b>${esc(r.nama)}</b></td><td><span class="badge">${esc(r.fase)}</span></td><td>${esc(r.kelas)}</td><td class="num">${r.absen||"–"}</td><td class="num">${Math.round(r.m)}</td><td class="num">${Math.round(r.p)}</td><td class="num">${Math.round(r.k)}</td><td class="num">${Math.round(r.r)}</td><td class="num"><span class="grade ${c}">${Math.round(r.akhir)} ${pd}</span></td><td class="mono small">${tglJam(r.aktif)}</td></tr>`}).join(""):`<tr><td colspan="11" class="empty">Belum ada siswa yang mendaftar. Bagikan alamat situs ini kepada siswa, lalu minta mereka mendaftar dengan NIS dan kata sandi masing-masing.</td></tr>`;
  $$("#nlBody tr.click").forEach(tr=>tr.onclick=()=>showSiswa(tr.dataset.id));
}
$("#nlSearch").oninput=renderNilai;$("#nlFase").onchange=renderNilai;$("#nlKelas").onchange=renderNilai;
function showSiswa(id){
  const s=App.siswa.find(x=>x._id===id);if(!s)return;const g=grades(s);const fz=s.fase||"E";const Q=soal(fz);
  dlg(`<div class="row" style="justify-content:space-between"><h3>${esc(s.nama)}</h3><span class="grade ${predikat(g.akhir)[1]}">${Math.round(g.akhir)} ${predikat(g.akhir)[0]}</span></div>
   <p class="muted">NIS ${esc(s.nis||"–")} · Fase ${esc(fz)} · ${esc(s.kelas)}${s.absen?" · No. "+esc(s.absen):""} · mulai ${tglJam(s.mulai)} · aktif ${tglJam(s.aktif)}</p>
   <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Praktikum</th><th>Misi</th><th>Pelanggaran K3</th><th>Nilai</th></tr></thead><tbody>${praksOf(fz).map(p=>{const pr=(s.prak||{})[p.id]||{};return`<tr><td>${esc(p.no)} · ${esc(p.title)}</td><td class="num">${(pr.done||[]).length}/${p.missions.length}</td><td class="num">${pr.viol||0}</td><td class="num"><b>${pr.score||0}</b></td></tr>`}).join("")}</tbody></table></div>
   <div><h4 style="font-size:18px;text-transform:uppercase">Kuis · ${g.benar}/${g.nq} benar</h4><div class="qdots" style="margin-top:6px">${Q.map(q=>{const a=(s.kuis&&s.kuis.ans||{})[q.id];return`<i class="${a===undefined?"":a===q.a?"r":"w"}" title="${esc(q.q)}"></i>`}).join("")}</div></div>
   <div><h4 style="font-size:18px;text-transform:uppercase">Alat dipelajari · ${Math.round(g.m)}%</h4><p class="small muted" style="margin-top:4px">${esc(tools(fz).filter(t=>(s.studied||[]).includes(t.id)).map(t=>t.name).join(", ")||"Belum ada")}</p></div>
   <div><h4 style="font-size:18px;text-transform:uppercase">Jurnal refleksi</h4>${["r1","r2","r3"].map((k,i)=>`<p class="small" style="margin-top:6px"><b>${["Berkesadaran","Bermakna","Menggembirakan"][i]}:</b> ${esc((s.refl||{})[k]||"–")}</p>`).join("")}</div>
   <details><summary style="cursor:pointer;font-weight:700">Catatan aktivitas terakhir</summary><div class="log" style="max-height:200px;margin-top:6px">${(s.log||[]).map(l=>`<div>${tglJam(l.t)} · <b>${esc(l.a)}</b></div>`).join("")||"–"}</div></details>
   <div class="row" style="justify-content:space-between">${App.isTeacher?`<button class="btn danger sm" id="bDelS">Hapus data siswa</button>`:"<span></span>"}<button class="btn" id="bCloseS">Tutup</button></div>`);
  $("#bCloseS").onclick=closeDlg;
  const del=$("#bDelS");if(del)del.onclick=()=>confirmBox("Hapus data siswa?",`Semua nilai dan catatan ${s.nama} akan dihapus permanen. Akun loginnya tetap ada di Supabase Authentication.`,"Hapus",async()=>{const{error}=await SB.from("siswa").delete().eq("user_id",id);if(error)toastPage("Gagal menghapus: "+error.message);else{toastPage("Data siswa dihapus");closeDlg();loadSiswa()}});
}
function csvData(sep){
  const rows=nilaiRows().sort((a,b)=>a.kelas.localeCompare(b.kelas)||a.absen-b.absen||a.nama.localeCompare(b.nama));
  const head=["NIS","Nama","Fase","Kelas","Absen","Memahami","Praktikum",...PRAKS.map(p=>p.no.replace("Praktikum ","").replace(/^(\d)$/,"P$1")),"Kuis","Refleksi","Nilai akhir","Predikat","Pelanggaran K3","Terakhir aktif"];
  const q=v=>{v=String(v??"");return sep===","&&/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v.replace(/\t/g," ")};
  const lines=[head.map(q).join(sep)].concat(rows.map(r=>[r.s.nis||"",r.nama,r.fase,r.kelas,r.absen||"",Math.round(r.m),Math.round(r.p),...PRAKS.map(p=>p.fase===r.fase?Math.round(((r.s.prak||{})[p.id]||{}).score||0):""),Math.round(r.k),Math.round(r.r),Math.round(r.akhir),predikat(r.akhir)[0],praksOf(r.fase).reduce((a,p)=>a+(((r.s.prak||{})[p.id]||{}).viol||0),0),tglJam(r.aktif)].map(q).join(sep)));
  return lines.join("\n");
}
$("#bCsv").onclick=()=>{
  const data="\ufeff"+csvData(",");const fn="nilai-edukelistrikan-"+new Date().toISOString().slice(0,10)+".csv";
  const url=URL.createObjectURL(new Blob([data],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toastPage("File CSV diunduh");
};
$("#bCopyCsv").onclick=()=>{const t=csvData("\t");navigator.clipboard.writeText(t).then(()=>toastPage("Tabel disalin. Tempel di Excel atau Google Sheets.")).catch(()=>{dlg(`<h3>Salin tabel</h3><textarea class="io" id="ioT" readonly>${esc(t)}</textarea><div class="row" style="justify-content:flex-end"><button class="btn" id="ioC">Tutup</button></div>`);$("#ioC").onclick=closeDlg;$("#ioT").select()})};
$("#bBobot").onclick=()=>{
  const B=App.bobot;
  dlg(`<h3>Bobot nilai akhir</h3><p class="muted">Persentase tiap komponen. Jumlah sebaiknya 100.</p>
   <div class="grid2"><label class="field">Memahami (Toolkit)<input type="number" id="bwM" min="0" max="100" value="${B.m}"></label><label class="field">Praktikum<input type="number" id="bwP" min="0" max="100" value="${B.p}"></label><label class="field">Kuis<input type="number" id="bwK" min="0" max="100" value="${B.k}"></label><label class="field">Refleksi<input type="number" id="bwR" min="0" max="100" value="${B.r}"></label></div>
   <p class="err" id="bwErr"></p><div class="row" style="justify-content:flex-end"><button class="btn" id="bwC">Batal</button><button class="btn primary" id="bwS">Simpan</button></div>`);
  $("#bwC").onclick=closeDlg;
  $("#bwS").onclick=()=>{const nb={m:+$("#bwM").value||0,p:+$("#bwP").value||0,k:+$("#bwK").value||0,r:+$("#bwR").value||0};const sum=nb.m+nb.p+nb.k+nb.r;if(sum!==100){$("#bwErr").textContent=`Jumlah saat ini ${sum}. Sesuaikan agar menjadi 100.`;return}
    App.bobot=nb;saveSetting().then(()=>{closeDlg();renderNilai();toastPage("Bobot disimpan")})};
};
function saveSetting(){if(!SB){toastPage("Database belum dikonfigurasi.");return Promise.resolve()}return SB.from("pengaturan").upsert({id:"umum",data:{idn:App.idn,bobot:App.bobot}}).then(({error})=>{if(error)toastPage("Gagal menyimpan: "+error.message);else loadShared("pengaturan")})}

/* ================= MATERI & SOAL (GURU) ================= */
function guruWrite(path,data,okMsg){
  if(!SB){toastPage("Database belum dikonfigurasi.");return Promise.reject()}
  const[table,id]=path.split("/");
  const q=data===null?SB.from(table).delete().eq("id",id):SB.from(table).upsert({id,data,diubah:new Date().toISOString()});
  return q.then(({error})=>{if(error){toastPage("Gagal menyimpan: "+error.message+(/row-level security/i.test(error.message)?" (akun belum terdaftar sebagai guru)":""));throw error}toastPage(okMsg);loadShared(table)});
}
function renderMateri(){
  if(!App.guru)return;
  const rows=DEFAULT_TOOLS.map(t=>Object.assign({},t,App.materiDocs[t.id]||{},{_def:true})).concat(Object.values(App.materiDocs).filter(m=>!DEFAULT_TOOLS.find(t=>t.id===m.id)));
  $("#mtBody").innerHTML=rows.map(t=>`<tr><td><b>${esc(t.name)}</b><br><span class="muted small">${esc(t.en||"")}</span></td><td>${esc(CATS[t.cat]||t.cat)} <span class="badge">${t.fase==="F"?"Fase F":t.fase==="E"?"Fase E":"E & F"}</span></td><td>${esc(MODELS[t.model]||t.model)}</td>
    <td>${t.hapus?'<span class="badge bad">Disembunyikan</span>':t._def?(App.materiDocs[t.id]?'<span class="badge warn">Bawaan, diubah</span>':'<span class="badge">Bawaan</span>'):'<span class="badge ok">Tambahan guru</span>'}</td>
    <td><div class="tbl-actions"><button class="btn xs" data-e="${esc(t.id)}">Ubah</button>${t._def?`<button class="btn xs" data-h="${esc(t.id)}">${t.hapus?"Tampilkan":"Sembunyikan"}</button>`:`<button class="btn xs danger" data-d="${esc(t.id)}">Hapus</button>`}</div></td></tr>`).join("");
  $$("#mtBody [data-e]").forEach(b=>b.onclick=()=>openMatForm(rows.find(t=>t.id===b.dataset.e)));
  $$("#mtBody [data-h]").forEach(b=>b.onclick=()=>{const t=rows.find(x=>x.id===b.dataset.h);const base=Object.assign({},App.materiDocs[t.id]||{});delete base.id;base.hapus=!t.hapus;guruWrite("materi/"+t.id,base,base.hapus?"Materi disembunyikan dari siswa":"Materi ditampilkan lagi")});
  $$("#mtBody [data-d]").forEach(b=>b.onclick=()=>{const t=rows.find(x=>x.id===b.dataset.d);confirmBox("Hapus materi?",`“${t.name}” akan dihapus untuk semua siswa.`,"Hapus",()=>guruWrite("materi/"+t.id,null,"Materi dihapus"))});
  const S_=DEFAULT_SOAL.map(s=>Object.assign({},s,App.soalDocs[s.id]||{},{_def:true})).concat(Object.values(App.soalDocs).filter(m=>!DEFAULT_SOAL.find(s=>s.id===m.id)));
  $("#sqBody").innerHTML=S_.map(s=>`<tr><td><span class="badge">${s.fase==="F"?"F":s.fase==="EF"?"E & F":"E"}</span> ${esc(s.q)}</td><td>${String.fromCharCode(65+(s.a||0))}. ${esc((s.o||[])[s.a]||"")}</td><td>${s.hapus?'<span class="badge bad">Disembunyikan</span>':s._def?'<span class="badge">Bawaan</span>':'<span class="badge ok">Tambahan guru</span>'}</td>
    <td><div class="tbl-actions"><button class="btn xs" data-se="${esc(s.id)}">Ubah</button>${s._def?`<button class="btn xs" data-sh="${esc(s.id)}">${s.hapus?"Tampilkan":"Sembunyikan"}</button>`:`<button class="btn xs danger" data-sd="${esc(s.id)}">Hapus</button>`}</div></td></tr>`).join("");
  $$("#sqBody [data-se]").forEach(b=>b.onclick=()=>openSoalForm(S_.find(s=>s.id===b.dataset.se)));
  $$("#sqBody [data-sh]").forEach(b=>b.onclick=()=>{const s=S_.find(x=>x.id===b.dataset.sh);const base=Object.assign({},App.soalDocs[s.id]||{});delete base.id;base.hapus=!s.hapus;guruWrite("soal/"+s.id,base,base.hapus?"Soal disembunyikan":"Soal ditampilkan")});
  $$("#sqBody [data-sd]").forEach(b=>b.onclick=()=>confirmBox("Hapus soal?","Soal ini akan dihapus dari kuis semua siswa.","Hapus",()=>guruWrite("soal/"+b.dataset.sd,null,"Soal dihapus")));
  $("#idnEdit").innerHTML=Object.keys(IDN_LABELS).map(k=>`<dt>${IDN_LABELS[k]}</dt><dd><input class="search" data-idn="${k}" value="${esc(App.idn[k]||"")}"></dd>`).join("");
}
$("#bSaveIdn").onclick=()=>{$$("#idnEdit [data-idn]").forEach(i=>App.idn[i.dataset.idn]=i.value.trim());saveSetting().then(()=>{renderIdn();toastPage("Identitas karya disimpan")})};
function openMatForm(t){
  const isNew=!t;t=t||{id:"",name:"",en:"",cat:"hand",model:"kotak",color:"#e3a400",desc:"",steps:[],safety:[],pemantik:""};
  dlg(`<h3>${isNew?"Tambah materi alat":"Ubah materi"}</h3>
   <form id="mf" class="grid2">
    <label class="field">Nama alat *<input id="f_name" required maxlength="60" value="${esc(t.name)}" placeholder="mis. Tang Crimping"></label>
    <label class="field">Nama bahasa Inggris<input id="f_en" maxlength="60" value="${esc(t.en)}" placeholder="mis. Crimping Tool"></label>
    <label class="field">Kategori<select id="f_cat">${Object.entries(CATS).map(([k,v])=>`<option value="${k}" ${t.cat===k?"selected":""}>${v}</option>`).join("")}</select></label>
    <label class="field">Model 3D<select id="f_model">${Object.entries(MODELS).map(([k,v])=>`<option value="${k}" ${t.model===k?"selected":""}>${v}</option>`).join("")}</select></label>
    <label class="field">Warna (untuk bentuk umum)<input id="f_color" type="color" value="${esc(t.color||"#e3a400")}"></label>
    <label class="field">Untuk fase<select id="f_fase"><option value="EF" ${!t.fase||t.fase==="EF"?"selected":""}>Fase E dan F</option><option value="E" ${t.fase==="E"?"selected":""}>Fase E saja</option><option value="F" ${t.fase==="F"?"selected":""}>Fase F saja</option></select></label>
    <label class="field" style="grid-column:1/-1">Fungsi utama *<textarea id="f_desc" required maxlength="800">${esc(t.desc)}</textarea></label>
    <label class="field" style="grid-column:1/-1">Pertanyaan pemantik<input id="f_pem" maxlength="240" value="${esc(t.pemantik||"")}" placeholder="Pertanyaan yang memancing rasa ingin tahu siswa"></label>
    <label class="field">Langkah penggunaan (satu per baris)<textarea id="f_steps">${esc((t.steps||[]).join("\n"))}</textarea></label>
    <label class="field">Perhatian K3 (satu per baris)<textarea id="f_safe">${esc((t.safety||[]).join("\n"))}</textarea></label>
    <p class="err" id="f_err" style="grid-column:1/-1"></p>
    <div class="row" style="grid-column:1/-1;justify-content:flex-end"><button type="button" class="btn" id="fCancel">Batal</button><button class="btn primary" type="submit">${isNew?"Tambahkan":"Simpan perubahan"}</button></div>
   </form>`);
  $("#fCancel").onclick=closeDlg;
  $("#mf").onsubmit=e=>{e.preventDefault();
    const name=$("#f_name").value.trim(),desc=$("#f_desc").value.trim();
    if(!name||!desc){$("#f_err").textContent="Nama dan fungsi utama wajib diisi.";return}
    const lines=s=>s.split("\n").map(x=>x.trim()).filter(Boolean).slice(0,12);
    const id=isNew?"m-"+Date.now().toString(36):t.id;
    const data={id,fase:$("#f_fase").value,name,en:$("#f_en").value.trim(),cat:$("#f_cat").value,model:$("#f_model").value,color:$("#f_color").value,desc,pemantik:$("#f_pem").value.trim(),steps:lines($("#f_steps").value),safety:lines($("#f_safe").value),hapus:!!t.hapus};
    guruWrite("materi/"+id,data,isNew?"Materi ditambahkan untuk semua siswa":"Perubahan materi disimpan").then(closeDlg).catch(()=>{});
  };
}
function openSoalForm(s){
  const isNew=!s;s=s||{q:"",o:["","","",""],a:0,e:""};const o=(s.o||[]).concat(["","","",""]).slice(0,4);
  dlg(`<h3>${isNew?"Tambah soal":"Ubah soal"}</h3>
   <form id="sf" style="display:grid;gap:10px">
    <label class="field">Pertanyaan *<textarea id="s_q" required maxlength="400">${esc(s.q)}</textarea></label>
    <div class="grid2">${o.map((x,i)=>`<label class="field">Pilihan ${String.fromCharCode(65+i)}${i<2?" *":""}<input id="s_o${i}" maxlength="160" value="${esc(x)}"></label>`).join("")}</div>
    <div class="grid2"><label class="field">Kunci jawaban<select id="s_a">${o.map((x,i)=>`<option value="${i}" ${s.a===i?"selected":""}>${String.fromCharCode(65+i)}</option>`).join("")}</select></label>
    <label class="field">Untuk fase<select id="s_fase"><option value="E" ${(s.fase||"E")==="E"?"selected":""}>Fase E</option><option value="F" ${s.fase==="F"?"selected":""}>Fase F</option><option value="EF" ${s.fase==="EF"?"selected":""}>Fase E dan F</option></select></label></div>
    <label class="field">Pembahasan<textarea id="s_e" maxlength="600">${esc(s.e||"")}</textarea></label>
    <p class="err" id="s_err"></p>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" id="sCancel">Batal</button><button class="btn primary" type="submit">${isNew?"Tambahkan":"Simpan"}</button></div>
   </form>`);
  $("#sCancel").onclick=closeDlg;
  $("#sf").onsubmit=e=>{e.preventDefault();
    const opts=[0,1,2,3].map(i=>$("#s_o"+i).value.trim());const filled=opts.filter(Boolean);const a=+$("#s_a").value;
    if(!$("#s_q").value.trim()||filled.length<2){$("#s_err").textContent="Isi pertanyaan dan minimal dua pilihan.";return}
    if(!opts[a]){$("#s_err").textContent="Kunci jawaban harus menunjuk pilihan yang terisi.";return}
    const keep=opts.map((v,i)=>[v,i]).filter(([v])=>v);const na=keep.findIndex(([,i])=>i===a);
    const id=isNew?"s-"+Date.now().toString(36):s.id;
    guruWrite("soal/"+id,{id,fase:$("#s_fase").value,q:$("#s_q").value.trim(),o:keep.map(([v])=>v),a:na,e:$("#s_e").value.trim(),hapus:!!s.hapus},isNew?"Soal ditambahkan":"Soal disimpan").then(closeDlg).catch(()=>{});
  };
}
$("#bAddMat").onclick=()=>openMatForm(null);
$("#bAddSoal").onclick=()=>openSoalForm(null);
function renderIdn(){$("#idnView").innerHTML=Object.keys(IDN_LABELS).map(k=>`<dt>${IDN_LABELS[k]}</dt><dd>${esc(App.idn[k]||"–")}</dd>`).join("")}

/* ================= LOOP & BOOT ================= */
if(T){
  const clock=new T.Clock();
  (function loop(){
    requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.1);
    if(App.route==="toolkit"&&tv.r){
      if(tv.grow<1){tv.grow=Math.min(1,tv.grow+dt*3);const e=1-Math.pow(1-tv.grow,3);tv.holder.scale.setScalar(.6+.4*e)}
      if(tv.anim&&tv.model&&tv.model.userData.anim){tv.animT=(tv.animT+dt/3)%1;tv.model.userData.anim(tv.animT)}
      tv.ring.rotation.z+=dt*.2;tv.ctl.update();tv.r.render(tv.scene,tv.cam);updatePartTags();
    }
    if(S&&L.r&&L.scene){animateLab(dt);L.ctl.update();L.r.render(L.scene,L.cam)}
  })();
}
renderIdn();route();initCloud();
window.addEventListener("beforeunload",()=>{if(saveT){clearTimeout(saveT);LS.set("ek2-rec",REC)}});
})();
