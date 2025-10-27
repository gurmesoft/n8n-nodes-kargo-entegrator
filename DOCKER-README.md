# Docker Ortamı Kullanım Kılavuzu

## Genel Bakış
Bu proje için 3 farklı Docker Compose konfigürasyonu hazırlanmıştır:

### 1. Basit Ortam (docker-compose.simple.yml)
- Sadece N8N servisi
- Hızlı test için ideal
- Veritabanı yok (SQLite kullanır)

### 2. Geliştirme Ortamı (docker-compose.dev.yml)
- N8N + PostgreSQL + Node geliştirme konteyneri
- Tam geliştirme ortamı
- Hot reload desteği

### 3. Üretim Ortamı (docker-compose.yml)
- N8N + PostgreSQL
- Üretim için optimize edilmiş

## Kullanım

### Basit Ortamı Başlatma
```bash
docker-compose -f docker-compose.simple.yml up -d
```

### Geliştirme Ortamını Başlatma
```bash
npm run dev:docker
# veya
docker-compose -f docker-compose.dev.yml up -d
```

### Logları İzleme
```bash
npm run dev:docker:logs
# veya
docker-compose -f docker-compose.dev.yml logs -f
```

### Ortamı Durdurma
```bash
npm run dev:docker:stop
# veya
docker-compose -f docker-compose.dev.yml down
```

### Ortamı Yeniden Başlatma
```bash
npm run dev:docker:restart
# veya
docker-compose -f docker-compose.simple.yml restart
```

## Erişim Bilgileri

### N8N Web Arayüzü
- URL: http://localhost:5678
- Kullanıcı: admin
- Şifre: admin123

### PostgreSQL (Geliştirme/Üretim)
- Host: localhost
- Port: 5432 (üretim) / 5433 (geliştirme)
- Kullanıcı: n8n
- Şifre: n8n123
- Veritabanı: n8n

## Geliştirme İpuçları

1. **Node Değişiklikleri**: `dist` klasöründeki değişiklikler otomatik olarak N8N'e yansır
2. **Hot Reload**: `npm run dev:live` komutu ile kod değişikliklerinde otomatik restart
3. **Debug**: N8N log seviyesi debug olarak ayarlanmış

## Sorun Giderme

### Docker İmajları İndiriliyor
İlk çalıştırmada Docker imajları indirilir, bu işlem internet hızınıza bağlı olarak 5-15 dakika sürebilir.

### Port Çakışması
Eğer 5678 portu kullanımda ise, docker-compose dosyalarındaki port ayarlarını değiştirin.

### Volume Sorunları
```bash
docker-compose down -v  # Volume'ları temizle
docker system prune     # Kullanılmayan kaynakları temizle
```

## Önemli Notlar

- İlk kurulumda N8N'in başlatılması birkaç dakika sürebilir
- Custom node'lar `/home/node/.n8n/custom` klasörüne mount edilir
- Veritabanı verileri Docker volume'larında saklanır
- Geliştirme sırasında `npm run build` komutunu çalıştırmayı unutmayın