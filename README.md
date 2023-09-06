# UET PROJECT

## REQUIREMENT

- Laragon + PHP 8.1.10
- Composer 2.5.8
- Node.js 18.16.1
- Yarn 1.22.19

## SETUP

```
Enable extension "fileinfo" in "php.ini"
```

```
cp .env.example .env
```

```
yarn install
```

```
composer install
```

```
php artisan key:generate
```

```
php artisan storage:link
```

```
php artisan migrate:refresh --seed
```

## DEVELOPMENT

```
yarn dev
```

```
php artisan serve
```

## BUILD

```
yarn build
```