# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/Eustrosoft/qrd-frontend/compare/v1.1.0...v1.2.0) (2025-06-18)


### Features

* **cards:** добавлен компонент data-view ([a40bf8f](https://github.com/Eustrosoft/qrd-frontend/commit/a40bf8f95487f19f718efbb2414495e39ecb9385))
* **cards:** добавлен компонент view-list-item ([3d98c93](https://github.com/Eustrosoft/qrd-frontend/commit/3d98c93e2d82dd88bdef9317938a521dfcb0b627))
* **create-menu:** добавлено меню создания сущностей ([96c98cc](https://github.com/Eustrosoft/qrd-frontend/commit/96c98cca48df08b81bac10f99ba6f15528b16e70))
* **list-item:** добавлена динамическая генерация картинки, добавлен <a> для навигации в карточку ([134c65b](https://github.com/Eustrosoft/qrd-frontend/commit/134c65b02a4c956a83b5aae8d803bdb1d02d391b))
* **localization:** удалены геттеры переводов, оптимизирована загрузка локали ([49d271e](https://github.com/Eustrosoft/qrd-frontend/commit/49d271e7a16dc067ef56bfc66ef5f4da0f7ba6e1))
* **mat-icon:** интегрирован mat-icon, удалены избыточные конструкции ([32f364e](https://github.com/Eustrosoft/qrd-frontend/commit/32f364e90a98593a414d7d1ebac0375fad56a537))
* **ng-version:** скрыт атрибут ng-version в DOM ([bc8bf7a](https://github.com/Eustrosoft/qrd-frontend/commit/bc8bf7a2ef23771cdf7c44ec8cdbb4c32b862d18))
* **openapi:** добавлена автогенерация типов api ([876b588](https://github.com/Eustrosoft/qrd-frontend/commit/876b588f5d5e8c63ef6a9df9d9a07430d66c6641))
* **qr-cards:** добавлено представление списка ([b20890f](https://github.com/Eustrosoft/qrd-frontend/commit/b20890f9fd9dc61f5f8b3e850cd6843e46e12317))
* **routing:** настроен роутинг для qr-cards, сгенерированы компоненты ([8e22a3b](https://github.com/Eustrosoft/qrd-frontend/commit/8e22a3b0c4734774efd4c211422536c9e38cdfe0))
* **selection-bar:** добавлена sticky position для меню выбора ([35dbd22](https://github.com/Eustrosoft/qrd-frontend/commit/35dbd228869c5385a30dbda8156a2855f23203ae))
* **selection:** добавлен selection-actions-bar ([de52d0e](https://github.com/Eustrosoft/qrd-frontend/commit/de52d0ebe5dccacac2d8443bba313c23d5a06ab5))
* **selection:** доработан selection-actions-bar ([bbb0546](https://github.com/Eustrosoft/qrd-frontend/commit/bbb054621cb40a345239a28a2ac397192e31de7b))
* **skeleton:** добавлен компонент skeleton, добавлена заглушка для ошибок http ([fc17e45](https://github.com/Eustrosoft/qrd-frontend/commit/fc17e45dde29fbd0f94b170ba496e2a38b24b0fa))


### Bug Fixes

* **anim:** исправлено поведение анимации на адаптивной версии ([35ec092](https://github.com/Eustrosoft/qrd-frontend/commit/35ec0926f33df2a1fae28b8ad18fd93f2f46f29f))

## [1.1.0](https://github.com/Eustrosoft/qrd-frontend/compare/v1.0.0...v1.1.0) (2025-06-03)


### Features

* **login:** добавлен обработчик keydown.enter ([086935d](https://github.com/Eustrosoft/qrd-frontend/commit/086935d4f017ae1d129590ac4183128f2a95d757))

## 1.0.0 (2025-06-03)


### Features

* **auth:** добавлен сервис аутентификации и метод логина ([46d9003](https://github.com/Eustrosoft/qrd-frontend/commit/46d9003a8056c130381b4fbdb52121fc6daf6984))
* **auth:** добавлены обработчики аутентификации, компоненты отображения профиля ([c9d4ce9](https://github.com/Eustrosoft/qrd-frontend/commit/c9d4ce926cbe463b8cbebf7284d85ec42cb9652f))
* **bottom-navbar:** добавлено меню навигации для адаптивной версии ([3ead298](https://github.com/Eustrosoft/qrd-frontend/commit/3ead2985230876aff449e5e68a77124281d1b610))
* **button:** добавлены примеры toggle кнопок, checkbox ([8491794](https://github.com/Eustrosoft/qrd-frontend/commit/849179474030acf8f1ed3937faa1649bbf79e904))
* **error-handler:** добавлен обработчик ошибок ([367321e](https://github.com/Eustrosoft/qrd-frontend/commit/367321eb6d5926012b59093743ccd4566dfbd445))
* **error-page:** добавлена generic страница для отображения ошибок ([7229e36](https://github.com/Eustrosoft/qrd-frontend/commit/7229e36e6c6beec8f2794e8ad18bce6b682ce3cf))
* **form-field:** добавлены form-field, select и их кастомизации с ui-icon ([8bb6c12](https://github.com/Eustrosoft/qrd-frontend/commit/8bb6c12dc46e6d53436587e188604b0300eabd21))
* **header, footer, dictionary:** разработаны сервисы работы со справочными данными ([6ecde84](https://github.com/Eustrosoft/qrd-frontend/commit/6ecde84811050ad3a2792de619397b5014b68531))
* **locale:** source язык изменен на английский ([8300e2e](https://github.com/Eustrosoft/qrd-frontend/commit/8300e2ea1ffb49c61727c36af57bcf270e773729))
* **locale:** обновление локализации ([2d67926](https://github.com/Eustrosoft/qrd-frontend/commit/2d679269f733c0cdfdb3ae06e6c00144d4f71bf5))
* **localization:** добавлен сервис загрузки локализаций, настроена сборка ([8863548](https://github.com/Eustrosoft/qrd-frontend/commit/886354881316b221d5d503f294e19781ea02d44d))
* **localization:** добавлен функционал локализации даты ([076b3a8](https://github.com/Eustrosoft/qrd-frontend/commit/076b3a8b8d767c14cd06172f3baa1c5289679001))
* **login-page:** добавлена страница входа ([b9fa46f](https://github.com/Eustrosoft/qrd-frontend/commit/b9fa46fa2ec6cb9dc862b61ea419710c4230a799))
* **menu:** добавлен новый пункт bottom меню ([db15686](https://github.com/Eustrosoft/qrd-frontend/commit/db1568641b05fd62bd609b611c79b56416cdf408))
* **pages:** добавлены пустые компоненты страниц, доработан header, login ([db655b9](https://github.com/Eustrosoft/qrd-frontend/commit/db655b9d90d4f045a4d3adafbc316d4ff03f1c4e))
* **profile:** добавлен profile-overlay, добавлена директива для подсветки ссылок ([9275a7c](https://github.com/Eustrosoft/qrd-frontend/commit/9275a7c043035165a1329c640104e57260e4e683))
* **sidenav:** добавлен компонент навигации и API управления ([9388b2e](https://github.com/Eustrosoft/qrd-frontend/commit/9388b2ecfb0c332cddb7c15ef48c70ef14279337))
* **theme-picker:** добавлен overlay выбора оформления ([a97377e](https://github.com/Eustrosoft/qrd-frontend/commit/a97377e9f00b18e67d6d7d89e238ffe977a7f32d))
* **theme-picker:** добавлена возможность выбора контрастности, доработана анимация overlay ([e0a897c](https://github.com/Eustrosoft/qrd-frontend/commit/e0a897c448fae547592bdd9664641c30ec2145fd))
* **ui-badge:** добавлен компонент бейджа ([2ccc287](https://github.com/Eustrosoft/qrd-frontend/commit/2ccc2872bcdd69603cb3c8c601bdb9b85d7c0a89))
* **ui-icon:** добавлена возможность смены цвета для иконок ([8aadbac](https://github.com/Eustrosoft/qrd-frontend/commit/8aadbacb3c3862797e20f9bf28a465daa2bf3725))


### Bug Fixes

* **footer:** исправлен выбор локали ([bd1de68](https://github.com/Eustrosoft/qrd-frontend/commit/bd1de68d2a073dd76ac2845af134af071f50f1d8))
* **header:** доработано позиционирование theme-picker ([f321ad1](https://github.com/Eustrosoft/qrd-frontend/commit/f321ad16e5be7e506323482dad73580a1470c98b))
* **locale:** исправлено отсутствие перевода у title страниц ([27cd58c](https://github.com/Eustrosoft/qrd-frontend/commit/27cd58c628227b9fa590a8a8a6e8085ded586af4))
* **localization:** доработана локализация, исправлены ошибки применения переводов ([a503b87](https://github.com/Eustrosoft/qrd-frontend/commit/a503b876b14000c52df21b64d67034ed57f2acd7))
* **login:** исправлен градиент на странице входа ([bc0c4de](https://github.com/Eustrosoft/qrd-frontend/commit/bc0c4de9489778eb51ffd028fea6518905fc2bd8))
* **scroll:** исправлен цвет scroll ([22dbcf0](https://github.com/Eustrosoft/qrd-frontend/commit/22dbcf03861e0df04fb76d245eb21c1a6abc5642))
