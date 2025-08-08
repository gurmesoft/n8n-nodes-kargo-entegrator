# Kargo Entegratör n8n Node - Debug Kılavuzu

## Credential Doğrulama Sorunları

### 1. Credential Test Etme

#### n8n Arayüzünde
1. **Settings** > **Credentials** > **Kargo Entegratör API**
2. **Test** butonuna tıkla
3. Hata mesajlarını incele

#### Yaygın Hatalar ve Çözümleri

**❌ "API anahtarı geçersiz"**
- API anahtarını kontrol et
- Kargo Entegratör dashboard'dan yeni anahtar al
- API anahtarında boşluk veya özel karakter olmamalı

**❌ "Endpoint erişilemez"**
- Base URL'yi kontrol et: `https://app.kargoentegrator.com/api`
- İnternet bağlantısını kontrol et
- Firewall/proxy ayarlarını kontrol et

**❌ "Authorization header missing"**
- API anahtarının başında/sonunda boşluk olabilir
- API anahtarını tekrar gir

### 2. Manuel Test

#### Postman/Curl ile Test
```bash
# Test komutu
curl -X GET "https://app.kargoentegrator.com/api/integration/cargos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

#### Beklenen Yanıt
```json
{
  "success": true,
  "data": [...]
}
```

### 3. Docker Container'da Debug

#### Container Loglarını İzle
```bash
# Basit ortam
docker-compose -f docker-compose.simple.yml logs -f

# Geliştirme ortamı
docker-compose -f docker-compose.dev.yml logs -f
```

#### Container İçinde Test
```bash
# Container'a bağlan
docker exec -it n8n-kargo-simple bash

# Node.js ile test
node -e "console.log('API Test:', process.env)"
```

### 4. n8n Workflow Debug

#### Debug Node Ekle
1. Workflow'a **Function** node ekle
2. Kargo Entegratör node'undan önce yerleştir
3. Şu kodu ekle:

```javascript
// Credentials debug
console.log('Credentials:', $credentials);
console.log('Input data:', $input.all());

return $input.all();
```

#### Execution Loglarını İncele
1. Workflow çalıştır
2. **Executions** sekmesine git
3. Başarısız execution'ı tıkla
4. **Error** sekmesinde detaylı hata mesajını gör

### 5. Yaygın Sorunlar

#### API Anahtarı Formatı
```
✅ Doğru: abc123def456ghi789
❌ Yanlış: Bearer abc123def456ghi789
❌ Yanlış:  abc123def456ghi789  (boşluklar)
```

#### Base URL Formatı
```
✅ Doğru: https://app.kargoentegrator.com/api
❌ Yanlış: https://app.kargoentegrator.com/api/
❌ Yanlış: https://app.kargoentegrator.com
```

### 6. Gelişmiş Debug

#### Network İzleme
1. Browser Developer Tools > Network
2. n8n'de credential test et
3. API çağrılarını incele

#### Node.js Debug
```javascript
// KargoEntegrator.node.ts içinde debug ekle
console.log('API Request:', {
  url: options.url,
  headers: options.headers,
  method: options.method
});
```

### 7. Test Checklist

- [ ] API anahtarı doğru girildi
- [ ] Base URL doğru: `https://app.kargoentegrator.com/api`
- [ ] İnternet bağlantısı çalışıyor
- [ ] Postman/curl ile manuel test yapıldı
- [ ] Container logları kontrol edildi
- [ ] n8n execution logları incelendi
- [ ] API anahtarında boşluk/özel karakter yok
- [ ] Kargo Entegratör hesabı aktif

### 8. Destek

Sorun devam ederse:
1. Container loglarını kaydet
2. n8n execution loglarını kaydet
3. API test sonuçlarını kaydet
4. Kargo Entegratör desteğe başvur: destek@kargoentegrator.com