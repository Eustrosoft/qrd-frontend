# Release

1) Переключиться на ветку `develop`
2) Обновить ветку `develop` (`git pull --rebase origin develop` || `git rebase origin/develop`)
3) Выполнить `npm run release`
4) Проверить, что корректно сгенерировались изменения в файле `CHANGELOG.md`
5) Проверить, что в файлах `package.json` и `package-lock.json` обновилась версия проекта
6) Запушить изменения с тегами: `git push --follow-tags origin develop`
7) Переключиться на ветку `master`
8) Обновить ветку `master` (`git pull --rebase origin master` || `git rebase origin/master`)
9) Слить изменения из `develop` в `master`: `git merge --no-ff origin/develop`
10) Запушить изменения: `git push origin master`
