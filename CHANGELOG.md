# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
