# Create RESTful API using NestJS + Prisma (Part 1) - TheFullStackNerb.com

In this part, we will create a NestJS application which is implemented some basic functionalities such as

- Caching
- Rate limiting
- Swagger (OpenAPI)
- Request's parameters validation

Then in the next part, we're going to deploy it to AWS ECS Fargate using AWS CDK.

Table of contents
- [Create RESTful API using NestJS + Prisma (Part 1) - TheFullStackNerb.com](#create-restful-api-using-nestjs--prisma-part-1---thefullstacknerbcom)
  - [How to run the project](#how-to-run-the-project)
  - [Folder structure](#folder-structure)
  - [Explanation](#explanation)
    - [Initialize NestJS project](#initialize-nestjs-project)
    - [Create mock database](#create-mock-database)
      - [How to generate `prisma.schema`](#how-to-generate-prismaschema)
    - [Implement some useful functionalities](#implement-some-useful-functionalities)
      - [Caching](#caching)
      - [Rate limiting](#rate-limiting)
      - [Auto-generated OAS definition](#auto-generated-oas-definition)

## How to run the project

Install dependencies

```
yarn
```

Generate the Prisma entities defined in `prisma/schema.prisma`

```
yarn prisma:gen
```

Run the application

```
yarn start:dev
```

Open http://localhost:3000/docs to see the swagger definitions and test the APIs.

## Folder structure

I applied a modular approach here which means every function (Albums, Artists, etc...) will be defined in a folder
In my experience, it's very easy to maintain as well as improve readability.

```
+-- prisma // prisma schema
+-- src
    +-- albums // the Album module that provides functionality to `/albums` endpoints
    +-- config // the Config module thats hold all configuration used in the application
    +-- prisma // the Prisma module that provides a service to help other modules to communicate with database.
    +-- shares // common functions
    +-- app.module.ts // declare root module
    +-- main.ts
+-- test // e2e and unit test files
+-- typings // modules and globals type definitions
+-- .env // in real-world project you shouldn't expose this file to source control, it's intended to use in development only.

```

## Explanation

### Initialize NestJS project

> **Note**: Please refer here https://docs.nestjs.com/first-steps

Install Nest CLI

```
npm install -g @nestjs/cli
```

Create new project

```
nest new sample-nestjs
```

Open the code in your favorite IDE, in my case it's VSCode.😄

```
cd sample-nestjs
code .
```

### Create mock database

> **Note**: I will explain the process how I created the Prisma schema that is used in this project.
> You don't have to replay this step.

For the sake of simplicity, I used a sample SQLite database that can be found here https://www.sqlitetutorial.net/sqlite-sample-database/

#### How to generate `prisma.schema`

There are 2 approaches we usually do when working with ORMs

- Code-first: you declare the schema first then use the ORM engine to build up the database. It is useful in case of creating a new database.
- Database-first: you have a running database and want to create a schema file from the database.
  This approach is often used when migrating the legacy database to use some modern ORMs.

Because I use the existing database then I must go for the `database-first` approach. Let's see how Prisma handles it.

Install `Prisma`

```
yarn add prisma -D
```

Initialize Prisma

```
npx prisma init
```

Then, it will create the `prisma` folder in the root folder.
Modify the `prisma.schema` file -> change provider to `sqlite`

```
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

In the `.env` file, add

```
DATABASE_URL=file:mock.db
```

Prisma will read `.env` file while starting up and inject it into the schema file.

Next, pull the schema from an existing database

```
npx prisma db pull
```

> **Note**: https://www.prisma.io/docs/reference/api-reference/command-reference#db-pull

Then the `prisma.schema` will be added to some model definitions

> **Note**: I did change the model name to upper-case

Generate Prisma entity classes.

```
npx prisma generate
```

> **IMPORTANT**: when working with Prisma, remember to run `prisma generate` everytime you update the schema.

### Implement some useful functionalities

#### Caching

Caching can significantly improve your app performance as well as decrease latency.  
Of course, how long the TTL or which endpoint cannot be applied caching is up to your situation.

> **Note**: Reference: https://docs.nestjs.com/techniques/caching

In `app.module.ts`
```ts
CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // config key is the key of `environmentConfig`
  useFactory: (config: ConfigService) => config.get('cache'),
}),
```

#### Rate limiting

You don't want `bad customers` to storm your server with thousands or millions of requests at the same time. right? 🥹

> **Note**: To implement throttling mechanism please refer here https://docs.nestjs.com/security/rate-limiting

In `app.module.ts`

```ts
ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // config key is the key of `environmentConfig`
  useFactory: (config: ConfigService) => config.get('throttler'),
}),
```

#### Auto-generated OAS definition
NestJS comes with a very straightforward way to generate OAS definitions.

> **Note**: The document can be found here https://docs.nestjs.com/openapi/introduction

I want to show you a useful tip when working with NestJS OpenAPI.  
NestJS offers a mechanism that you can provide plugins into the build process.  

Instead of repeating `@ApiProperty()` many times in your code, use `@nestjs/swagger` plugin.

In `nest-cli.json`
```json
....
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "classValidatorShim": true,
        "introspectComments": true,
        "controllerFileNameSuffix": [".dto.ts"]
      }
    ]
  }
```

> **Note**: https://docs.nestjs.com/openapi/cli-plugin