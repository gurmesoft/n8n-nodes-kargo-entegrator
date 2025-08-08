# Kargo Entegratör n8n Node - Geliştirme Kılavuzu

## Geliştirme Ortamları

### 1. Basit Test Ortamı (Önerilen)

```bash
# 1. Kodu derle
npm run build

# 2. Docker container'ı başlat
docker-compose -f docker-compose.simple.yml up -d

# 3. n8n'e erişim
# http://localhost:5678
# Kullanıcı: admin
# Şifre: admin123
```

### 2. Gelişmiş Geliştirme Ortamı

```bash
# Watch mode ile otomatik derleme
npm run dev:docker

# Logları izle
npm run dev:docker:logs

# Durdur
npm run dev:docker:stop
```

## Geliştirme Döngüsü

### Basit Yöntem (Her değişiklik sonrası)

1. **Kod değişikliği yap**
2. **Derle**: `npm run build`
3. **Container'ı yeniden başlat**: 
   ```bash
   docker-compose -f docker-compose.simple.yml restart
   ```
4. **Test et**: http://localhost:5678

### Hızlı Geliştirme Yöntemi

1. **Watch mode başlat**: `npm run dev`
2. **Ayrı terminalde container başlat**: `npm run dev:docker`
3. **Kod değişikliği yap** (otomatik derlenir)
4. **Container'ı yeniden başlat**: 
   ```bash
   docker-compose -f docker-compose.dev.yml restart
   ```

## Node'u Test Etme

### 1. n8n Arayüzünde

1. http://localhost:5678 adresine git
2. admin/admin123 ile giriş yap
3. Yeni workflow oluştur
4. "Kargo Entegratör" node'unu ekle
5. Credentials yapılandır:
   - API Key: Test API anahtarın
   - Base URL: https://app.kargoentegrator.com/api

### 2. Test Senaryoları

#### Kargo Şirketlerini Listele
- Resource: Cargo
- Operation: Get All

#### Gönderi Oluştur
- Resource: Shipment
- Operation: Create
- Gerekli alanları doldur

#### İade Oluştur
- Resource: Shipment
- Operation: Create Return

## Hata Ayıklama

### Container Loglarını İzle
```bash
# Basit ortam için
docker-compose -f docker-compose.simple.yml logs -f

# Geliştirme ortamı için
docker-compose -f docker-compose.dev.yml logs -f
```

### Node Loglarını İzle
n8n arayüzünde workflow çalıştırırken "Executions" sekmesinden detaylı logları görebilirsin.

### Yaygın Sorunlar

1. **Node görünmüyor**: Container'ı yeniden başlat
2. **API hatası**: Credentials'ları kontrol et
3. **Build hatası**: `npm run lint` çalıştır

## Performans İpuçları

- Küçük değişiklikler için basit yöntemi kullan
- Büyük değişiklikler için watch mode kullan
- Container'ı her seferinde silmek yerine restart et
- Dist klasörünü mount etmek daha hızlı

## Üretim Hazırlığı

```bash
# Final build
npm run build

# Lint kontrolü
npm run lint

# Paket oluştur
npm pack

# Test et
npm run dev:docker
```