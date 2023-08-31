FROM php:8.1-fpm

WORKDIR /var/www/html/

RUN apt update -y

RUN apt upgrade -y

RUN apt install libzip-dev libpng-dev zlib1g-dev libmariadb-dev git zip unzip sendmail -y

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

RUN docker-php-ext-install pdo_mysql && docker-php-ext-enable pdo_mysql

RUN docker-php-ext-install zip && docker-php-ext-enable zip

RUN docker-php-ext-install gd && docker-php-ext-enable gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt install -y nodejs

RUN npm i -g yarn