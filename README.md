# Smart To-Do list

## What it is

When you are recommended something it's not always easy to jot it down for later in an organized fashion. Adding the item to your phone or computer ends up taking time and opening up the right app is only part of the problem. You then have to locate the right list ("Movies to watch", "Books to read", etc.) to add to. And if you do get it in to the right list, you don't have much more context about it. This delay and lack of additional information acts as a huge deterrent.

The solution? A smart, auto-categorizing todo list app. The user simply has to add the name of the thing, and it gets put into the correct list.

## Screenshot

![''](https://raw.githubusercontent.com/TuanPham303/smart-TODO-List/development/docs/main.jpeg)

## Getting Started

1. Get a Google Places API key (https://developers.google.com/places/web-service/intro).
2. Get a Amazon Product Advertising API key (http://docs.aws.amazon.com/AWSECommerceService/latest/DG/becomingDev.html).
3. Create the .env by using .env.example as a reference: cp .env.example .env.
4. Update the .env file with your correct information.
5. Install dependencies using the `npm install` command.
6. Prepare your database with `knex migrate:latest` or `npm run knex migrate:latest` command.
7. Seed category keywords with `knex seed:run` or `npm run knex seed:run` command.
8. Start the web server using the `npm run local` command.
9. Go to <http://localhost:8080/> in your browser.

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- google-maps-services-js 0.4.3
- amazon-product-api 0.4.4
- bcrypt 1.0.3
- body-parser 1.15.2
- bootstrap 4.0.0
- cookie-session 1.3.2
- dotenv 2.0.0
- ejs 2.4.1
- express 4.13.4
- knex 0.11.7
- knex-logger 0.1.0
- morgan 1.7.0
- node-sass-middleware 0.9.8
- pg 6.0.2
- popper.js 1.12.5
- string-similarity 1.2.0
