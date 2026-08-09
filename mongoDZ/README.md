# mongoDZ

REST API на Express 5 + Mongoose для роботи з товарами.

## Запуск

```bash
npm install
npm run dev
```

Змінні оточення у `.env`: `MONGO_URI`, `PORT` (за замовчуванням у проєкті — `3000`).

---

## Обробка помилок

Усі помилки обробляє один централізований error-handling middleware
`middleware/errorHandler.js` Express відрізняє його від звичайного middleware
за кількістю аргументів — їх рівно чотири: `(err, req, res, next)`.
Він реєструється найостаннішим, після роутів і після middleware для
неіснуючих маршрутів `middleware/notFound.js`

### Як відтворити приклади в Postman

- Базовий URL: `http://localhost:3000`
- Для всіх запитів з тілом: заголовок `Content-Type: application/json`,
  вкладка **Body → raw → JSON**.
- Тіло помилки завжди має поле `message`; у разі помилки валідації додається
  масив `errors` з переліком полів, які не пройшли перевірку.

### Випадок 1 — невалідний ObjectId

Рядок `123abc` неможливо привести до `ObjectId`, тому Mongoose кидає `CastError`
ще до звернення до бази. Це помилка клієнта, тому **400**, а не 500.

**Запит**

```
GET http://localhost:3000/api/products/123abc
```

Тіло: немає.

**Відповідь — 400 Bad Request**

{
"message": "Invalid id: \"123abc\" is not a valid ObjectId"
}

### Випадок 2 — категорія поза списком enum

Поле `category` у схемі обмежене списком дозволених значень, тому `toys`
не проходить валідацію і Mongoose кидає `ValidationError`.

**Запит**

POST http://localhost:3000/api/products
Content-Type: application/json

{
"name": "Toy car",
"price": 15,
"category": "toys"
}

**Відповідь — 400 Bad Request**

{
"message": "Validation failed",
"errors": [
{
"field": "category",
"kind": "enum",
"message": "`toys` is not a valid enum value for path `category`."
}
]
}

### Випадок 3 — не заповнені обовʼязкові поля

`name`, `price` і `category` позначені як `required`. Замість одного довгого
рядка `"Product validation failed: category: ..., price: ..., name: ..."`
API повертає масив, у якому кожне проблемне поле — окремий обʼєкт.
Він будується з `error.errors`, де ключ — це шлях до поля, а значення —
`ValidatorError` з власними `path`, `kind` і `message`.

**Запит**

POST http://localhost:3000/api/products
Content-Type: application/json

{
"stock": 5
}

**Відповідь — 400 Bad Request**

{
"message": "Validation failed",
"errors": [
{
"field": "category",
"kind": "required",
"message": "Path `category` is required."
},
{
"field": "price",
"kind": "required",
"message": "Path `price` is required."
},
{
"field": "name",
"kind": "required",
"message": "Path `name` is required."
}
]
}

Той самий формат працює і для помилки типу. Наприклад, тіло
`{ "name": "Laptop", "price": "abc", "category": "Electronics" }` дає:

{
"message": "Validation failed",
"errors": [
{
"field": "price",
"kind": "Number",
"message": "Cast to Number failed for value \"abc\" (type string) at path \"price\""
}
]
}

### Випадок 5 — неіснуючий маршрут

Middleware `notFound` стоїть після всіх роутів і перехоплює запит раніше,
ніж Express дійде до власного обробника, тому замість HTML-сторінки
повертається JSON.

**Запит**

GET http://localhost:3000/api/nonexistent

Тіло: немає.

**Відповідь — 404 Not Found**

{
"message": "Route GET /api/nonexistent not found"
}

## Кешування

`GET /api/products` кешує результат у памʼяті процесу на 30 секунд
(`utils/cache.js`). Дані зберігаються разом з міткою часу `savedAt`: якщо з
моменту запису минуло менше 30 секунд — відповідь віддається одразу, без
звернення до MongoDB. Кожна комбінація `page`/`limit` кешується під власним
ключем, інакше запит другої сторінки повертав би вміст першої.

### Що станеться, якщо в цей момент створити новий товар через POST

Кеш про це нічого не знає, тому наступні запити `GET /api/products` до кінця
30-секундного вікна віддаватимуть застарілі дані: нового товару в списку не
буде, а поля `total` і `totalPages` покажуть стару кількість.

Виправляється очисткою кешу під час запису: потрыбно викликати у кешу clear() - наступний список буде з бд

## Пагінація

`GET /api/products` підтримує query-параметри `page` і `limit`.
Під капотом — `.skip((page - 1) * limit)`, `.limit(limit)` для вибірки та
`countDocuments()` для загальної кількості документів. Запити виконуються
паралельно через `Promise.all`. Обовʼязковий `.sort({ _id: 1 })` — без
сортування MongoDB не гарантує стабільного порядку, і при перегортанні
сторінок товари могли б дублюватися або зникати.

**Запит**

GET http://localhost:3000/api/products?page=2&limit=3

**Відповідь — 200 OK**

{
"total": 10,
"page": 2,
"limit": 3,
"totalPages": 4,
"products": [ ... ]
}

приклади:

- `GET /api/products` — без параметрів, віддає першу сторінку по 5 товарів
  (`page: 1`, `limit: 5`, `totalPages: 2` при 10 товарах у базі).
- `GET /api/products?page=1&limit=5` — те саме явно.
- `GET /api/products?page=abc&limit=-5` — некоректні значення не викликають
  помилки, підставляються дефолтні `page: 1`, `limit: 5`.
