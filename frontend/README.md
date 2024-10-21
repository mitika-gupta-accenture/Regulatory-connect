# MHRA Base Form

## What is it?

A Next.js project, bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and customized with the [`GOV UK Design System`](https://frontend.design-system.service.gov.uk/installing-with-npm/#requirements), adheres to government-established design patterns and accessibility standards.

## How to run it

Create a .env file in the `frontend` folder and then add the instrumentation key in the file:

```sh
NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING= *GET INSTUMENTATION KEY FROM TEAM*;
NOTIFY_API_KEY= *GET NOTIFY API KEY FROM TEAM*;
NOTIFY_CASEWORKER_EMAIL= *GET NOTIFY CASEWORKER EMAIL KEY FROM TEAM*;
```

Before you run the project, install it locally using npm:

```sh
$ cd frontend
$ npm install
# or
$ yarn
```

Then, to run the development server:

```sh
$ cd frontend
$ npm run dev
# or
$ yarn dev
```

## Setup Redis (Local)

Install brew[https://brew.sh/]

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install and run Redis:

```sh
brew install redis
brew services start redis
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup Postgres (Local)

### Install & Run Postgres with User (Database) - MAC Only

```sh
brew install postgresql
brew services start postgresql
createuser -s postgres
brew services restart postgresql
```

Then install [Postico](https://eggerapps.at/postico2/)

### Install & Run Postgres with User (Database) - Windows Only

[Follow Postgres installation instructions for Windows here](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)

You will likely need to raise an NTT request and submit a DPSIA and get admin approval to install. Please use the [DPSIA template signposted here in Confluence](https://mdop.atlassian.net/wiki/spaces/TSOENG/pages/388694033/Local+Development+Tooling#Raise-a-Request-to-IT-Helpdesk%3A)

Then create the user and database based on the Postgres docs or using an app like PGAdmin

### Setup Postgres User & Database

```sh
psql --u postgres
postgres=# CREATE DATABASE mwc;
```

From this point, you can prepopulate data into this database using the [Blob to Postgres Function App](https://github.com/MHRA/func-app-blob-to-db) where you need to install and run [Azurite for Blob Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio%2Cblob-storage) and have Postgres locally setup (as per above).

To start the function app, `npm i` and then `npm start`

You can then use Microsoft Azure Storage Explorer to locate your Azurite container instance under:

```sh
  Emulator & Attached ->
  Storage Accounts ->
  (Emulator - Default Ports) (Key) ->
  Blob Containers ->
  suspicious-websites // or local test container name
```

Here you can then drag and drop your website Excel sheets into this location to simulate the process of Blob Storage receiving either a new or updated urls file, which will trigger the function, and that will populate Postgres with the table and row data.

## Build the project using docker

To build the app locally run the below command

```sh
docker compose -f docker-compose.yml build --no-cache
```

To start the app container with supporting services like redis, postgres and azurite run the below command

```sh
docker-compose -f docker-compose.yml up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Test Data

In `/core/test/data` there is a `generate_test_data.js` script that can be manually run to create a file called `test_website_data.xlsx`.

This can be used as a test Excel file for populating your local Postgres instance above.

This has been structured on the following criteria based on the real Excel sheets we receive:

- Websites may not be complete and only contain subdomains due to how they have been collected via a webs scraper from online forums.

- Websites may be prefixed with different types of protocol, i.e. http or https, contain www. and/or neither of these things. So this has to be catered for when parsing and normalising the website urls.

- Entries contain information about what a previous website was called and what it is called now. So extract two websites from these entries when parsing them is needed.

- Excel files can contain multiple sheets so all of these need to be parsed, websites collected, and duplicate entries removed.

## Local Debugger for NextJS

- The launch.json file has already been created for the NextJS app, in case you want to debug the code with breakpoints in your local machine

- However, since the repository has the backend code as well, there are few additional steps that need to be performed

- Open as a Multi-Root Workspace
  1. Press Ctrl+Shift+P to open the command palette.
  2. Type `Add Folder to Workspace` and select it.
  3. Add the root of your project and the /frontend folder.
  4. After adding the folders, go to File > Save Workspace As... and save the workspace file. This will create a .code-workspace file.

- Go to Debugger (Ctrl+Shift+D)

- Select the configuration as per need and click run
