# Pilot Scheduler

This project provides an API of a on-demand pilot scheduling system using Node.js, Express.js and MongoDB

## Installation

1. Clone the project `git clone https://github.com/vasuagrawal84/pilot-scheduler.git`.
2. Install dependencies `yarn install` or `npm i`
3. Create a `.env` file in the root like the `.env.example` file.
4. For dev you need to have mongodb db locally.
5. Seed the database with some pilot data (See below)
---

## Install Mongodb

With Homebrew you can just run `brew tap mongodb/brew`, then `brew install mongodb-community` and after `brew services start mongodb-community`.

---

## Manually test API

Once set up has completed, the server is running and connected to the database, you can use the included Postman collection to test the API. The Postman collection is located in `scripts/pilot-scheduler.postman_collection.json`.

---

## Next steps to improve project

- Add more unit tests (currently only two controllers have been unit tested)
- Send server logs to analytics tools such as Sentry (Raven logs has easy integration), Mixpanel / Amplitude etc.
- Add typescript
- Add docker integration
- Add code coverage tool e.g. istanbul
- Add client validation - token based, whitelisting domains etc.
- Improve API docs
- Add integration/E2E tests
- Add more business logic to give pilots breaks between flights

---

## Scripts

### DEV

```
yarn build
yarn dev
```

or

```
npm run build
npm run dev
```

### DEV-DEBUG

```
yarn build
yarn dev:debug
```

or

```
npm run build
npm run dev:debug
```

### Unit tests
```
yarn test
```

or

```
npm run test
```

---

## API Documentation

`apidoc` has been used to generate documentation for the API of this Node/Express server

You can run `npm run doc` to generate the docs in the `doc` folder. Open `index.html` in a browser to view.

---

## Seeds

For seeding the database with the pilots, just run one of these following comands. 

**You will need to do this before making any requests to the pilot availability or create flight booking APIs**

- Seeds pilots in the Crew.json `yarn db:seeds-pilot`
- Clear pilot collection `yarn db:seeds-clear-pilot`
- Clear all collections `yarn db:seeds-clear`

---
## Monitoring

Monitoring Server on `http://localhost:3000/status`

---

## Techs

- Node Express middlewares - [http://expressjs.com/en/resources/middleware.html](http://expressjs.com/en/resources/middleware.html)
- [Jest](https://jestjs.io/) - unit testing
- [NPS](https://github.com/kentcdodds/nps) - cleaner package.json by extracting scripts
- [MongoDB](https://www.mongodb.com/) - NoSQL database 
- [Mongoose](http://mongoosejs.com/) - object modelling for MongoDB
- [Webpack3](https://webpack.js.org/) - module bundler
- [PM2](https://pm2.keymetrics.io/) - production process manager for Node.js

---

## Notes
- The two helper files in the `src/services` folder were copied over from an older project to save time