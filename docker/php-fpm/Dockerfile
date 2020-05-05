FROM php:7.2-fpm

RUN apt-get update && apt-get install -y \
    libmcrypt-dev \
	libfreetype6-dev \
	libjpeg62-turbo-dev \
	libmcrypt-dev \
	libpng-dev \
    libwebp-dev \
    libzip-dev \
    curl

RUN docker-php-ext-install \
    mysqli \
    pdo_mysql \
    && docker-php-ext-configure zip --with-libzip \
    && docker-php-ext-install zip \
    && docker-php-ext-configure gd \
        --with-jpeg-dir=/usr/include \
        --with-png-dir=/usr/include \
        --with-webp-dir=/usr/include \
        --with-freetype-dir=/usr/include \
    && docker-php-ext-install gd

RUN pecl install mcrypt-1.0.1 && \
    docker-php-ext-enable mcrypt

WORKDIR /var/www/html

CMD ["php-fpm"]

EXPOSE 9000
