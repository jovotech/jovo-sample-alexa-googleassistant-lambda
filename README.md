# Jovo v4 Sample: Alexa Skill & Google Action on AWS Lambda

[![Jovo Framework](https://www.jovo.tech/img/github-header.png)](https://www.jovo.tech)

<p>
<a href="https://www.jovo.tech" target="_blank">Website</a> -  <a href="https://www.jovo.tech/docs" target="_blank">Docs</a> - <a href="https://www.jovo.tech/marketplace" target="_blank">Marketplace</a> - <a href="https://github.com/jovotech/jovo-v4-template" target="_blank">Template</a>   
</p>

This [Jovo `v4`](https://www.jovo.tech) sample app showcases the following features:

- **Platforms**: A single code base that works on both [Alexa](https://www.jovo.tech/marketplace/platform-alexa) and [Google Assistant](https://www.jovo.tech/marketplace/platform-googleassistant).
- **Staging**: Uses a `dev` stage for local debugging and a `prod` stage that is deployed to [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda). Both stages use different Alexa Skill and Google Action projects.
- **Deployment**: Uses the [Serverless CLI](https://www.jovo.tech/marketplace/target-serverless) for AWS deployment.

Learn how to get this project up and running in the [getting started](#getting-started) section. The [stages and deployment](#stages-and-deployment) section will help you deploy the project to the platform developer consoles and AWS.

## Getting Started

Clone this repository and install all dependencies:

```sh
# Clone project
$ git clone https://github.com/jovotech/jovo-sample-alexa-googleassistant-lambda.git

# Go to directory
$ cd jovo-sample-alexa-googleassistant-lambda

# Install dependencies
$ npm install
```

The easiest way test the project code is to install the [Jovo CLI](https://www.jovo.tech/docs/cli) and use the [`run`](https://www.jovo.tech/docs/run-command) command. Learn more in [Jovo getting started docs](https://www.jovo.tech/docs/getting-started).

```sh
# Install Jovo CLI globally
$ npm install -g @jovotech/cli

# Run local development server
$ jovo run
```

This will compile the code, run the local development server, and print out your individual [Jovo Webhook URL](https://www.jovo.tech/docs/webhook) that you can then use to access the [Jovo Debugger](https://www.jovo.tech/docs/debugger).

The Debugger allows you to test your local code without having to create Alexa Skill and Google Action projects in the respective developer consoles. We'll do this in the [stages and deployment](#stages-and-deployment) section below.

## Stages and Deployment

This project uses the [Jovo staging feature](https://www.jovo.tech/docs/staging) that enables you to use multiple versions of your app, for example for local development and for a live version.

There are two stages available:

- `dev`: This stage is used for local development
  - The [`app.dev.ts`](./src/app.dev.ts) [app config](https://www.jovo.tech/docs/app-config) uses a file-based database integration called [FileDb](https://www.jovo.tech/marketplace/db-filedb) and the [Jovo Debugger](https://www.jovo.tech/docs/debugger) for browser-based testing.
  - It uses the [`server.express.ts`](./src/server.express.ts) file as a local development server using [Express](https://www.jovo.tech/marketplace/server-express).
- `prod`: This stage is used for the live version deployed to AWS
  - The [`app.prod.ts`](./src/app.prod.ts) [app config](https://www.jovo.tech/docs/app-config) uses a database integration for [AWS DynamoDB](https://www.jovo.tech/marketplace/db-dynamodb).
  - It uses the [`server.lambda.ts`](./src/server.lambda.ts) for running the code on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda).
  - The [`jovo.project.js`](./jovo.project.js) [project config](https://www.jovo.tech/docs/project-config)

The [`jovo.project.js`](./jovo.project.js) [project config](https://www.jovo.tech/docs/project-config) uses a `dev` and a `prod` stage for stage specific Alexa Skill and Google Action projects as well.

To get started, copy the [`.env.example`](./.env.example) file and rename it to `.env`.

Learn more below:

- [Alexa Developer Console](#alexa-developer-console)
- [Actions on Google Console](#actions-on-google-console)-
- [AWS](#aws)

### Alexa Developer Console

This guide will show you how to create two different [Alexa](https://www.jovo.tech/marketplace/platform-alexa) Skill projects in the Alexa Developer Console:

- One for the `dev` stage called `Jovo Sample DEV` using the invocation name `my dev test app`
- One for the `prod` stage called `Jovo Sample PROD` using the invocation name `my test app`

It's also possible to stop after creating the `dev` Skill. More on that below.

#### DEV Skill

As explained in the [Jovo Alexa installation docs](https://www.jovo.tech/marketplace/platform-alexa#installation), first install the ASK CLI and configure it by linking it to your Amazon developer account:

```sh
# Install ASK CLI globally
$ npm install -g ask-cli

# Configure ASK profile
$ ask configure
```

If you want to deploy to your `default` ASK profile, you don't need to change anything. If you want to use a different profile, modify the following in your `.env` file (after copying the [`.env.example`](./.env.example) file and renaming it to `.env`):

```
ALEXA_ASK_PROFILE_DEV=default
```

The [Alexa Developer Console project](https://www.jovo.tech/marketplace/platform-alexa#alexa-developer-console-project) docs show you in detail how to then deploy the project. Use the following two commands:

```sh
# Build platform specific files (default stage: dev)
$ jovo build:platform alexa

# Deploy these files to the Alexa Developer Console
$ jovo deploy:platform alexa
```

Since the `.env` does include an empty string for the Alexa Skill ID (for both `dev` and `prod`), a new Skill project will be created during the deployment.

```
ALEXA_SKILL_ID_DEV=
ALEXA_SKILL_ID_PROD=
```

After running the command, the CLI will print out the Skill ID of the newly created project. To keep the deployment linked to this project, copy the ID and add it to the `.env` file.

If you open the [Alexa Developer Console](https://developer.amazon.com/), you should now see your project named `Jovo Sample DEV` in the list of Alexa Skills. The endpoint should be your [Jovo Webhook URL](https://www.jovo.tech/docs/webhook). You can then open the testing tab and test the app using the invocation "_my dev test app_" (the invocation name is a stage specific [model override](https://www.jovo.tech/docs/project-config#models) that is added in the [`jovo.project.js`](./jovo.project.js) file). Make sure that your local development server is running with `jovo run` before you start testing.

#### PROD Skill

The [`jovo.project.js`](./jovo.project.js) file uses `dev` as `defaultStage`, so if you want to deploy to the `prod` stage, you either need to update that property or add the `--stage` flag to the commands:

```sh
# Build platform specific files (stage: prod)
$ jovo build:platform alexa --stage prod

# Deploy these files to the Alexa Developer Console
$ jovo deploy:platform alexa --stage prod
```

If you want to deploy to your `default` ASK profile, you don't need to change anything. If you want to use a different profile, modify the following in your `.env` file (after copying the [`.env.example`](./.env.example) file and renaming it to `.env`):

```
ALEXA_ASK_PROFILE_PROD=default
```

After successful deployment, you should now see your project named `Jovo Sample PROD` in the list of Alexa Skills in the Alexa Developer Console.

While the `dev` Alexa Skill uses the [Jovo Webhook](https://www.jovo.tech/docs/webhook) as [`endpoint`](https://www.jovo.tech/docs/project-config#endpoint), the code for the `prod` Skill will be hosted on [AWS](#aws). You need to deploy it and update the following property in your `.env` file:

```
LAMBDA_ARN_PROD=arn:aws:lambda:us-east-1:111111111111:function:jovo-sample-prod-handler
```

It is necessary that you redeploy your Alexa Skill project again after updating the value above.

### Actions on Google Console

This guide will show you how to create two different [Google Action](https://www.jovo.tech/marketplace/platform-googleassistant) projects in the Actions on Google Console:

- One for the `dev` stage called `Jovo Sample DEV` using the invocation name `my dev test app`
- One for the `prod` stage called `Jovo Sample PROD` using the invocation name `my test app`

It's also possible to stop after creating the `dev` Action. More on that below.

#### DEV Action

As explained in the [Jovo Google Assistant installation docs](https://www.jovo.tech/marketplace/platform-googleassistant#installation), you need to install the `gactions` CLI, ideally by following the [official documentation by Google](https://developers.google.com/assistant/actionssdk/gactions#install_the_gactions_command-line_tool).

The [Actions on Google Console project](https://www.jovo.tech/marketplace/platform-googleassistant#actions-on-google-console-project) docs show you in detail how to then deploy the project. Since the Google Actions API doesn't allow for programmatic project creation, you need to [access the console](https://console.actions.google.com/) and create a project manually. Learn more in the [official Google Assistant docs](https://developers.google.com/assistant/conversational/build/projects?tool=builder#create_a_project).

Then copy the newly created project ID and add it to your `.env` file (after copying the [`.env.example`](./.env.example) file and renaming it to `.env`):

```
GOOGLE_ACTION_PROJECT_ID_DEV=
```

For now, you only need to fill in the field for the `dev` stage.

You can then use the following two commands:

```sh
# Build platform specific files (default stage: dev)
$ jovo build:platform googleAssistant

# Deploy these files to the Actions on Google Console
$ jovo deploy:platform googleAssistant
```

After that, you can log see the changes in the Actions on Google console.

#### PROD Action

The [`jovo.project.js`](./jovo.project.js) file uses `dev` as `defaultStage`, so if you want to deploy to the `prod` stage, you either need to update that property or add the `--stage` flag to the commands:

```sh
# Build platform specific files (stage: prod)
$ jovo build:platform googleAssistant --stage prod

# Deploy these files to the Actions on Google Console
$ jovo deploy:platform googleAssistant --stage prod
```

For this to work, you need to create a project in the Actions on Google console as explained in the previous section, copy the newly created project ID and add it to your `.env` file:

```
GOOGLE_ACTION_PROJECT_ID_PROD=
```

While the `dev` Google Action uses the [Jovo Webhook](https://www.jovo.tech/docs/webhook) as [`endpoint`](https://www.jovo.tech/docs/project-config#endpoint), the code for the `prod` Action will be hosted on [AWS](#aws). You need to deploy it and update the following property in your `.env` file:

```
LAMBDA_ARN_URL=https://abcdefghijklmnopqrstuvwxyz.lambda-url.us-east-1.on.aws/
```

It is necessary that you redeploy your Google Action project again after updating the value above.

### AWS

This guide will show you how to deploy the `prod` stage of your Jovo app to [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda) using the [Jovo Serverless CLI integration](https://www.jovo.tech/marketplace/target-serverless). The Serverless CLI needs to be installed globally like this:

```sh
$ npm install -g serverless
```

Learn more about how to create an AWS account and making the security credentials available to the CLI in the [official Serverless docs](https://www.serverless.com/framework/docs/providers/aws/guide/credentials).

You can make the keys accessible like this:

```sh
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

After doing so, you can create a `serverless.yaml` file and then bundle and deploy the code using the following commands:

```sh
# Create serverless.yaml (stage: prod)
$ jovo build:serverless --stage prod

# Bundle and deploy code to AWS (stage: prod)
$ jovo deploy:code serverless --stage prod
```

If you run into any problems with the deployment, you can also use the following commands instead of `deploy:code serverless`:

```sh
# Bundle the prod stage source code
$ npm run bundle:prod

# Use the Serverless CLI for deployment
$ serverless deploy
```

Learn more about the `npm` scripts in the [`package.json`](./package.json) file.

After successful deployment, you should be able to see the created function in the [AWS Lambda console](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions). If you did not update the `service` name in `jovo.project.js`, it should be called `jovo-sample-prod-handler`.

If the deployment doesn't work, it's possibly because the value for the Alexa Skill ID (which is needed for the verification happening in the Alexa Skills Kit Trigger) is undefined in your `.env` file. To get started, you could copy the existing `dev` Alexa SKill ID into the field and swap it out at a later point after creating a `prod` Skill project.

```
ALEXA_SKILL_ID_PROD=
```

To get information about your function, you can either open it in the console or run the `serverless info` command. Copy the ARN and add it to your `.env` file. This can then be used to rebuild and deploy your `prod` Alexa Skill with the Lambda function as endpoint.

```
LAMBDA_ARN_PROD=arn:aws:lambda:us-east-1:111111111111:function:jovo-sample-prod-handler
```

The function URL (that was added using the `url: true` parameter in the Serverless config, learn more in the [official Serverless docs](https://www.serverless.com/blog/aws-lambda-function-urls-with-serverless-framework)) is a newly introduced feature by AWS that makes Lambda functions accessible to outside services without the need to add an API Gateway endpoint.

Copy the function URL and add it to your `.env` file. This can then be used to rebuild and deploy your `prod` Google Action with the Lambda function as endpoint.

```
LAMBDA_URL_PROD=https://abcdefghijklmnopqrstuvwxyz.lambda-url.us-east-1.on.aws/
```

The `jovo.project.js` also includes the permissions to create and update a DynamoDb table. By default, the table will be called `jovo-sample-db`. You can also update it in the project config under the `prod` stage:

```js
new ServerlessCli({
  provider: {
    // ...
    environment: {
      DYNAMODB_TABLE_NAME: 'jovo-sample-db',
    },
  },
  // ...
}),
```

On the first request, the Lambda will fail because of the DynamoDb table creation. On the next request, the table should be created and everything should work correctly.

## Next Steps

Learn more about the Jovo app project structure and key concepts in the [Jovo getting started docs](https://www.jovo.tech/docs/getting-started).
