1. Порахувати кількість товарів у кожній категорії
   `[
  {
    $group:
      {
        _id: "$category",
        count: {
          $sum: 1
        }
      }
  }
]`
   {
   "\_id": "books",
   "count": 1
   }
   {
   "\_id": "electronics",
   "count": 4
   }
   {
   "\_id": "food",
   "count": 1
   }
   {
   "\_id": "clothing",
   "count": 2
   }
   {
   "\_id": "accessories",
   "count": 1
   }

2.Порахувати середню ціну товарів по кожній категорії
`[
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$category",
        avgPrice: {
          $avg: "$price"
        }
      }
  }
]`

{
"\_id": "clothing",
"avgPrice": 97.5
}
{
"\_id": "food",
"avgPrice": 20
}
{
"\_id": "books",
"avgPrice": 35
}
\_id
{
"\_id": "electronics",
"avgPrice": 668.5
}
{
"\_id": "accessories",
"avgPrice": 250
}

3. Знайти сумарну вартість складу — суму price \* stock по всіх товарах
   `[
  {
    $group: {
      _id: null,
      totalPrice: {
        $sum: {
          $multiply: ["$price", "$stock"]
        }
      }
    }
  }
]`

{
"\_id": null,
"totalPrice": 36405
}

4. Вивести тільки ті категорії, у яких середня ціна більша за 300
   `
[
  {
    $group: {
      _id: "$category",
      avgPrice: {
        $avg: "$price"
      }
    }
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        avgPrice: {
          $gt: 300
        }
      }
  }
]`

{
"\_id": "electronics",
"avgPrice": 668.5
}

5. Порахувати кількість активних та неактивних користувачів

`
[
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$isActive",
        count: {
          $sum: 1
        }
      }
  }
]`

{
"\_id": false,
"count": 2
}

{
"\_id": true,
"count": 3
}

#2

1.Дізнайтеся, що таке індекс у MongoDB, як він влаштований і чому прискорює пошук. Своїми словами (3–4 речення) опишіть у queries.md, у чому різниця між COLLSCAN і IXSCAN.

COLLSCAN - дефолтний спосіб зчитування данних з колекції - просто йде перебор колекції один документ за іншим,то ж для великих обʼємів даних не підходить.
IXSCAN - йде пошук по спеціальному індексу (треба створити спочатку), що в рази прискорює запити

2.Виконайте db.products.getIndexes() та db.users.getIndexes(). У колекції users ви знайдете індекс, який не створювали вручну. Поясніть, звідки він узявся — підказка: шукайте у файлі userModel.js.

User indexes: [ { v: 2, key: { _id: 1 }, name: '_id_' } ]
Product indexes: [ { v: 2, key: { _id: 1 }, name: '_id_' } ]

подивився минулі дз та не знайшов таски на створення моделі,роутів,контроллерів для юзерів - тому файлу userModel.js не маю.Почитав та потестив локально індекс створюється при флазі unique:true

3.Виконайте запит з фільтром по category з .explain("executionStats") і збережіть значення totalDocsExamined, totalKeysExamined та stage.

"totalKeysExamined": 0,
"totalDocsExamined": 9,
"stage": "COLLSCAN",

4.Створіть індекс на поле category у колекції products.
5.Повторіть запит з .explain("executionStats"). Наведіть обидва результати поруч і порівняйте.

"totalKeysExamined": 4,
"totalDocsExamined": 4,
"stage": "IXSCAN",

6.Спробуйте додати користувача з email, який уже існує в колекції. Наведіть текст помилки і поясніть, чому вона виникла.

E11000 duplicate key error collection: shopDB.users index: email_1 dup key: { email: "olena@example.com" }

Унікальний індекс гарантує що одне й те саме значення ключа не може зустрітися двічі. Перед вставкою документа MongoDB перевіряє індекс і, знайшовши там `olena@example.com`, відхиляє операцію з кодом E11000

Висновок: до створення індексу запит переглянув усі 9 документів колекції,а після створення кількість переглянутих документів впала до кількості товарів підходящих до фільтру, запит став оптимізованіше - на великих колекціях виграш буде значніше
