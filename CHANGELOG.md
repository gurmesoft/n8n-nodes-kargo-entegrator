# Değişiklik Günlüğü

## [0.1.2] - 2026-04-07

### Değiştirildi
- Tüm node etiketleri, açıklamalar, alan isimleri, hata mesajları ve kod yorumları İngilizce'ye çevrildi
- Node açıklamasına `documentationUrl` eklendi — "Docs" butonu artık `https://dev.kargoentegrator.com` adresine yönlendiriyor
- Kimlik bilgileri `documentationUrl` adresi `https://dev.kargoentegrator.com/authentication` olarak güncellendi
- Alan açıklamaları resmi API dokümantasyonundan alınan detaylarla zenginleştirildi (max karakter limitleri, zorunlu/opsiyonel durumlar, formatlar)
- Gönderi Oluşturma: `platformId` alanı `number` yerine `string` olarak değiştirildi (max 255 karakter, API spesifikasyonuna uygun)
- Gönderi Oluşturma: `currency` ve `total` alanları artık yalnızca "Kapıda Ödeme" aktif olduğunda görünüyor
- Gönderi Oluşturma: Seçenekler koleksiyonuna opsiyonel alanlar eklendi — `packageCount`, `platformDId`, `barcode`, `waybillNumber`, `invoiceNumber`, `description`
- İade Oluşturma: `platformId` alanı `number` yerine `string` olarak değiştirildi
- İade Oluşturma: `currency` ve `total` alanları artık yalnızca "Kapıda Ödeme" aktif olduğunda görünüyor
- İade Oluşturma: `returnReason` alanı opsiyonel yapıldı (API spesifikasyonuna uygun)
- Kargo kaynağı "Cargo Integration" olarak yeniden adlandırıldı, `/api/integrations/kargo-listeleme` bağlantısı eklendi
- Depo işlemlerine `/api/settings/depo-listeleme` bağlantısı eklendi
- Gönderi Oluşturma ve PDF işlemlerine `/api/shipments/olusturma` ve `/api/print-pdf` bağlantıları eklendi
- İade Oluşturma ve PDF işlemlerine `/api/returneds/olusturma` bağlantısı eklendi

## [0.1.1] - 2025-01-01

### Eklendi
- Gönderi, İade, Kargo, Depo ve Ayarlar kaynakları ile ilk sürüm yayınlandı
- Gönderi ve İade için Oluştur, Getir, Tümünü Getir ve PDF Yazdır işlemleri
- loadOptions ile dinamik depo ve kargo firması açılır listeleri
- İkili (Binary) ve Base64 PDF çıktı formatları
- Webhook tabanlı durum güncellemeleri için Kargo Entegratör Trigger node'u
