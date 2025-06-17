// service-worker.js
console.log('Service Worker dimulai.');

// Event listener untuk saat Service Worker diinstal
self.addEventListener('install', (event) => {
    console.log('Service Worker terinstal.');
    // Skip waiting memastikan Service Worker baru aktif secepatnya
    self.skipWaiting();
});

// Event listener untuk saat Service Worker diaktifkan
self.addEventListener('activate', (event) => {
    console.log('Service Worker aktif.');
    event.waitUntil(self.clients.claim()); // Mengambil alih kontrol dari halaman klien yang ada
});

// Event listener untuk pesan yang diterima dari halaman utama
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon } = event.data;
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            // Anda bisa menambahkan opsi lain di sini
            // tag: 'my-message',
            // renotify: true,
            // actions: [ { action: 'open', title: 'Buka' } ]
        }).then(() => {
            console.log('Notifikasi berhasil ditampilkan oleh Service Worker.');
        }).catch(error => {
            console.error('Gagal menampilkan notifikasi dari Service Worker:', error);
        });
    }
});

// Event listener untuk saat notifikasi diklik
self.addEventListener('notificationclick', (event) => {
    console.log('Notifikasi diklik:', event);
    event.notification.close(); // Tutup notifikasi setelah diklik

    // Contoh: Buka jendela baru atau fokus ke jendela yang sudah ada
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === self.location.origin + '/' && 'focus' in client) {
                    return client.focus(); // Fokus ke tab yang sudah ada
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/'); // Buka tab baru jika tidak ada yang cocok
            }
        })
    );
});

// Event listener untuk saat notifikasi ditutup
self.addEventListener('notificationclose', (event) => {
    console.log('Notifikasi ditutup:', event);
});
