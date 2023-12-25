# ajaxtask
Приложение для отображения, добавления(с выпадающим списком авторов), редактирования, удаления(подтверждение действия, если отмеченный пост), отметки важных постов. Так же реализована смена темы страницы, лоадер. Создание и редактирование в модальных окнах.
## Сборка и запуск:
1. Скачать проект (есть два способа):
   - Скачать проект как архив и разархивировать в нужную директорию
   - Открыть терминал в нужной дириктории. Прописать `git clone 'https://github.com/vsssjke77/ajax_task'` <br> Проект склонировался
2. Зайти в папку с проектом (в папку, в которой находится package.json) и открыть в нем терминал
3. Установить зависимости:<br>
   `npm install` <br> `npm install -g json-server` <br> `npm install jquery`
4. Запустить сервер:<br>
   `json-server --watch db.json`
5. Открыть страницу в браузере (два способа):
   - Открыть index.html, используя браузер (рекомендуется)
   - Установить live-server:
       - В терминале по тому же адресу установить:<br>
         `npm install axios` <br> `npm install -g live-server`
       - Запустить live-server, перейти по ссылке в терминале:<br>
         `live-server`<br>
6. *Наслаждаться работой программы*
     
