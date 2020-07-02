# Pilot Scheduler

This project provides an API of a on-demand pilot scheduling system using Node.js, Express.js and MongoDB

## Installation

1. Clone the project `git clone https://github.com/vasuagrawal84/pilot-scheduler.git`.
2. Install dependencies `yarn install` or `npm i`
3. Create a `.env` file in the root like the `.env.example` file.
4. For dev you need to have mongodb db locally.
---

## Install Mongodb

With Homebrew you can just run `brew tap mongodb/brew`, then `brew install mongodb-community` and after `brew services start mongodb-community`.

---

## Next Steps to improve project

- Add more unit tests (currently only two controllers have been unit tested)
- Send server logs to analytics tools such as Sentry (Raven logs has easy integration), Mixpanel / Amplitude etc.
- Add typescript
- Add docker integration
- Add code coverage tool e.g. istanbul
- Add client validation - token based, whitelisting domains etc.
- Add more API docs
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
- [Jest](https://jestjs.io/)
- [NPS](https://github.com/kentcdodds/nps)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](http://mongoosejs.com/)
- [Webpack3](https://webpack.js.org/)

---

## Notes
- The two helper files in the src/services folder were copied over from an older project to save time