<h1>Таблица семинаров</h1>

- В качестве сборщика используется [vite](https://vitejs.dev/)
- Приложение написано с использованием фреймворка [React](https://react.dev/)
- Запросы выполняются согласно архитектурному стилю REST
- В качестве backend части приложения используется [json-server](https://github.com/typicode/json-server#readme)
- Для работы с формами используется библиотека [useForm](https://react-hook-form.com/docs/useform)
- Для валидации запросов и форм используется библиотека [zod](https://www.npmjs.com/package/zod#optional)
- Для задания стилий в приложении используется препроцессор [Saas](https://sass-lang.com/)
- Для работы с запросами используется [TanStack Query](https://tanstack.com/)
  <br>
  <br>
- Для реализации большинства компонентов в приложении используется библиотека [Material UI](https://mui.com/material-ui/)
- [Компонент таблицы](https://github.com/Vladislav-096/seminars-list/blob/main/src/components/SeminarsTable/SeminarsTable.tsx)
- В таблице реализована кнопка удаления семинара, которая при клике открывает окно подтверждения.
- При подтвержнении удаляния отвравляется "DELETE" запрос на сервер.
- При неудачном запросе появляется уведомление на странице, которое пропадает через несколько секунд.
- Реализован функционал редактирования семинара. Редактирование происходит в модальном окне.
- В приложении обрабатываются все ошибки.
- При неудачном "DELETE" или "PATCH" запросе пользователь увидет уведомление.
- При неудачном "GET" запросе, на получение всех семинаров, пользователь увидит ошибку и будет иметь возможность повторить запрост по нажатии на кнопку "Try again" (кнопка будет не доступна для повторного нажатия в течении нескольких секунд после первого нажатия)

### Запуск сервера одновременно c фронтенд приожением выполняется при помощи "concurrently".

### Запуск в режиме разработки:

```
npm run dev
```
