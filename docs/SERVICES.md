# NEW SERVICE SETUP
Upon the creation of a new service, we need to setup a few things so that we make sure we are all good to start the developement of the service

## 1. Navigate to the servies folder
```sh
cd services
```

## 2. Create a new service
```sh
mkdir new-service
```
On the creation of the new service, replace ``` new-service ``` with the name of the new service that you wish to create

## 3. Navigate to the new service folder
```sh
cd new-service
```

## 4. Set a new service environment
- Start by initializing a new node environment
```
npm init -y 
```

- Install the necessary dependancies
```
npm i express
```

- Install the dev dependancies
```sh
npm i -D typescript @types/express ts-node nodemon
```

- Initialize the ``` tsconfig.json ```
```sh
npx tsc --init
```

## 5. 