# AIWallet

Hackaton 9\_7 project - AI-powered financial management platform

## Особенности

- ✅ Работает с Live Server (локальная разработка)
- ✅ Работает с Express сервером (полный функционал)
- ✅ Автоматический fallback на localStorage при отсутствии сервера
- ✅ Универсальный API wrapper для всех режимов работы

## Развертывание

### Live Server (локальная разработка)

1. Установите расширение Live Server в VS Code
2. Откройте проект в VS Code
3. Правой кнопкой на `index.html` → "Open with Live Server"
4. Сайт откроется в браузере на `http://localhost:5500`

**Примечание:** При работе через Live Server данные сохраняются в localStorage браузера.

### Express Server (полный функционал)

1. Установите зависимости:
   ```bash
   npm install express cors
   ```

2. Запустите сервер:
   ```bash
   node server.js
   ```

3. Откройте браузер: `http://localhost:3000`

**Примечание:** При работе с сервером данные сохраняются в `users.json` и синхронизируются с localStorage.

## Структура проекта

- `index.html` - Главная страница
- `signup.html` - Регистрация
- `signin.html` - Вход
- `profile.html` - Профиль пользователя
- `pricing.html` - Тарифы
- `api-wrapper.js` - Универсальный API wrapper
- `script.js` - Основной JavaScript
- `server.js` - Express сервер (опционально)
- `simple_server.js` - Простой HTTP сервер (опционально)

## Как это работает

Проект использует универсальный API wrapper (`api-wrapper.js`), который:

1. **Пытается подключиться к серверу** (если доступен)
2. **Автоматически переключается на localStorage** при отсутствии сервера
3. **Синхронизирует данные** между сервером и localStorage

Это позволяет проекту работать в двух режимах:
- **Live Server**: только localStorage
- **Express Server**: сервер + localStorage (синхронизация)

## Задачи на завтра:

* Версия для телефона
* Сделать норм график
