# Сборка

## Предварительные условия

Node JS версии ^20.19.0 || ^22.12.0 || ^24.0.0

## Установка

Выполнить:

1. `git clone https://github.com/Eustrosoft/qrd-frontend.git`
2. `cd qrd-frontend`
3. `npm i`

Если проект был клонирован ранее:

1. Переключится на ветку `develop` или `master` (в зависимости от того, что собираем - прод или препрод)
2. Получить последние изменения с сервера `git pull origin develop` || `git pull origin master`

## Сборка

1. `npm run build:production` || `npm run build:preproduction` (для прод или препрод сборки соответственно)
2. Скопировать содержимое папки `dist` в директорию веб-сервера
3. При необходимости - изменить `baseHref` в `index.html`
