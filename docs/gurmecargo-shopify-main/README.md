# Kargo Entegratör Shopify Uygulaması

### Bilinmesi Gerekenler

Proje frontendde React ve Polaris ile çalışıyor. Backend kısmında Laravel ile işlemler yapılıyor. Laravel Inheritia js 
ile farklı sayfalara ayrılmış durumda.

extensions dizini Uygulamanın Shopify uzantılarını barındırıyor
web Bu dizin bizim ana çalışma dizinimiz Laravel ve Frontend uygulamaları burada.


### Geliştirme Ortamı Nasıl Kurulur?

Ana dizin

```shell
yarn install
```

web dizininde 

```shell
yarn install
```

```shell
composer install
php artisan migrate
```

### Projeyi Çalıştırma

Ana dizinde

```shell
yarn run dev
```

İlk seferinde Shopify login olup uygulamayı eşleştirmeyi isteyecektir.

Farklı bir konsolda web dizinde girerek

```shell
yarn run dev
```

# Tests

```sh
vendor/bin/pint app; vendor/bin/phpcbf --standard=PSR12 app  # Fixers

vendor/bin/phpcs --standard=PSR12 app # Coding Standart

vendor/bin/phpstan analyse --memory-limit=32G app # Obvious & Tricky Bugs.

vendor/bin/phpmd app ansi phpmd.ruleset.xml # Mess Detector
```