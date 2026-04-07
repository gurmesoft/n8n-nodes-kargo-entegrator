#!/bin/bash

# Web dizinine geç
cd web

# PHP ve Composer komutları
rm composer.lock
composer install
php artisan clear-compiled
php artisan event:clear
php artisan view:clear
php artisan config:clear
php artisan optimize
composer dump-autoload -o
php artisan queue:restart

# Node.js ve NPM komutları
npm i
npm run build

# Build dizinini taşıma işlemi
rm -rf public/build/
mv dist public/build
