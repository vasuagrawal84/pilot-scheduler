require('dotenv').config();

const npsUtils = require('nps-utils');

const { rimraf, crossEnv, series, concurrent } = npsUtils;

const webpackMode = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
  scripts: {
    build: {
      description: 'Building in production environment.',
      default: series.nps('clean', 'build.build'),
      build: `webpack --mode ${webpackMode}`,
    },
    clean: {
      description: 'Clean dist folder.',
      default: rimraf('dist'),
    },
    default: {
      description: 'Start project with pm2 on production.',
      script: `${crossEnv('NODE_ENV=production')} pm2 start processes.json dist/index.bundle.js`,
    },
    doc: {
      description: 'Documenting the api.',
      default: 'apidoc -i src',
    },
    dev: {
      start: {
        description: 'Running on dev environment.',
        script: `${crossEnv('NODE_ENV=development')} nodemon dist/index.bundle.js`,
      },
      default: {
        script: concurrent.nps('dev.watch', 'dev.start'),
      },
      watch: {
        description: 'Webpack watch for change and compile.',
        script: 'webpack -w',
      },
      withDebug: {
        script: `${crossEnv('NODE_ENV=development')} MONGOOSE_DEBUG=true DEBUG=express:* nodemon dist/index.bundle.js`,
      },
      debug: {
        description: 'Running on dev environment with debug on.',
        script: concurrent.nps('dev.watch', 'dev.withDebug'),
      },
    },
    lint: {
      default: 'eslint src',
      fix: 'eslint --fix src',
    },
    lintStaged: 'lint-staged',
    db: {
      seedsPilot: 'bash ./scripts/seeds/pilot.seed.sh',
      seedsClearPilot: 'bash ./scripts/seeds/clearPilot.seed.sh',
      seedsClear: 'bash ./scripts/seeds/clearAll.seed.sh',
    },
    test: {
      default: `${crossEnv('NODE_ENV=test')} mocha $(find __tests__ -name *.test.js) --colors --require babel-core/register`,
      watch: series.nps('test -w'),
    },
    validate: {
      description: 'Validate code by linting, type-checking.',
      default: series.nps('lint', 'test'),
    },
  },
};
