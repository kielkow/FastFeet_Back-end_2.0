<h3 align="center">
  Express Application for FastFeet project
</h3>

<p align="center">The best way to traffic your orders!</p>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/kielkow/FastFeet_Back-end_2.0?color=%23FF9000">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/kielkow/FastFeet_Back-end_2.0?color=%23FF9000">

  <a href="https://github.com/kielkow/FastFeet_Back-end_2.0/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/kielkow/FastFeet_Back-end_2.0?color=%23FF9000">
  </a>

  <a href="https://github.com/kielkow/FastFeet_Back-end_2.0/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/kielkow/FastFeet_Back-end_2.0?color=%23FF9000">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/EliasGcf/gobarber-api?color=%23FF9000">
</p>

<p align="center">
  <a href="#%EF%B8%8F-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p id="insomniaButton" align="center">
  <a href="https://insomnia.rest/run/?label=PontoLoc&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fkielkow%2Fpontoloc-api%2Fmaster%2FInsomnia.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

## 💇🏻‍♂️ About the project

This api provides everything needed to provide the entire organization for order creation and shipment.

Couriers can see all their orders, also see if one client canceled the order.

To see the **web client**, click here: [FastFeet Web](https://github.com/kielkow/FastFeet-Front-end)<br />

## 🚀 Technologies

Technologies that I used to develop this api

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Multer](https://github.com/expressjs/multer)
- [TypeORM](https://typeorm.io/#/)
- [JWT-token](https://jwt.io/)
- [uuid v4](https://github.com/thenativeweb/uuidv4/)
- [PostgreSQL](https://www.postgresql.org/)
- [Date-fns](https://date-fns.org/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://github.com/visionmedia/supertest)
- [Husky](https://github.com/typicode/husky)
- [Commitlint](https://github.com/conventional-changelog/commitlint)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## 💻 Getting started

Import the `Insomnia.json` on Insomnia App or click on [Run in Insomnia](#insomniaButton) button

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: I recommend use docker

**Clone the project and access the folder**

```bash
$ git clone https://github.com/kielkow/FastFeet_Back-end_2.0.git && cd FastFeet_Back-end_2.0
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment
$ cp .env.example .env

# Create the instance of postgreSQL using docker
$ docker run --name fastfeet-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=fastfeet -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Create the instance of mongoDB using docker
$ docker run --name fastfeet-mongodb -p 27017:27017 -d -t mongo

# Create the instance of redis using docker
$ docker run --name fastfeet-redis -p 6379:6379 -d -t redis:alpine

# Make a copy of 'ormconfig.example.json' to 'ormconfig.json'
# and set the values, if they are not filled,
# to connect with docker database containers
$ cp ormconfig.example.json ormconfig.json

# Once the services are running, run the migrations
$ yarn typeorm migration:run

# To finish, run the api service
$ yarn dev:server

# Well done, project is started!
```

## 🤔 How to contribute

**Make a fork of this repository**

```bash
# Fork using GitHub official command line
# If you don't have the GitHub CLI, use the web site to do that.

$ gh repo fork kielkow/FastFeet_Back-end_2.0
```

**Follow the steps below**

```bash
# Clone your fork
$ git clone your-fork-url && cd FastFeet_Back-end_2.0

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes
$ git commit -m 'feat: My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜 &nbsp;by Matheus Kielkowski 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/matheus-kielkowski-429b1617a/)
