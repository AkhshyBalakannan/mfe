# MFE - Micro-Front-End 

    This is a type of architecture where a web application is divided into different modules or even individual frameworks 

 # PROs
 
 Reduced maintenance demands
 
 Faster and more efficient development cycles
 
 Reduced complexity when implementing changes

#
### USAGE
To work with microfrontend we need to combine different framework codes or maybe same framework but different instance of projects.

To combine we can there are many methods, we will be using  [webpack](https://webpack.js.org/), [ModuleFederationPlugin](https://webpack.js.org/concepts/module-federation/) method.
#
### Prerequisite
We will be using JS frontend frameworks such as VueJS, ReactJS, Angular, where all of these would require nodeJS installed in our machine.

Check NodeJS is installed in your machine using
```bash
node --version
```
If you get version something like this ```v19.2.0```, We are good to go

If Not, Install [NodeJS](https://nodejs.org/en/) from the official site.
#
### Getting Started
Now we are ready to start with our frontend code, easy for us all frameworks such as VueJS, ReactJS, Angular provide us with simple commands to get started with the boiler template for folder structure.

To create ReactJS folder we need to give 
```bash
npx create-react-app my-app
```

To create VueJS folder we can give 
```bash
npm init vue@latest
```

To create Angular folder we can give 
```dash
npm install -g @angular/cli
ng new my-app
```

Or Alternative way is to create [mf](https://github.com/jherr/create-mf-app) boiler template folders

```bash
npx create-mf-app
```
Give your preferred or required App name, Project type, Port No, framework, Language, CSS.

Once done we will see three commands which will be something similar to
```bash
cd <app name>
npm install
npm start
```
##### NOTE: Only difference here is the index.js file, Which loads the app dynamically.

Now we will have basic front-end framework folder setup ready and deployed

But for now we will create all folders by ourselves as this will be a small project with no scope of production deployment.

#

we need to update package.json file little to tell React to start using webpack instead.
```json
{
  "name": "<Project Name>",
  "version": "<Project Version>",
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:start": "cd dist && PORT=8081 npx serve",
    "start": "webpack serve --open --mode development",
    "start:live": "webpack serve --open --mode development --live-reload --hot"
  },
  ...
```
#
### Webpack methodology
Let’s update the webpack.config.js, add [ModuleFederationPlugin](https://webpack.js.org/concepts/module-federation/) to the plugins array with the following configuration
```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8081/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    port: 8081,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [ // This is important part
    new ModuleFederationPlugin({
      name: "counter",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Counter": "./src/components/Counter",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```

Explanation

publicPath and port — these should have the same port number. I’ve chosen 8081 as I intend to put my main container application on 8080

name: Name of the remote app which will be used to call from parent plugins.remotes

filename: Entry point (remoteEntry.js) which will be the home js

remotes: Add remotes entry here (relevant for the container)

exposes: All the component names that you want to expose to the container app.

shared: container all the dependencies that you want to share between the container and the counter app.

HtmlWebpackPlugin — our bundled JavaScript will be served using the ‘./src/index.html’ file


# 

Update the webpack.config.js file inside the Container app
```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8080/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [ // This is important part
    new ModuleFederationPlugin({
      name: "container",
      filename: "remoteEntry.js",
      remotes: {
        counter: "counter@http://localhost:8081/remoteEntry.js",
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```
##### NOTE: The remote objects will have to define all the entry points exposed from remote apps, remotes entry has the following structure:
```{ "app-name": "name@<remote-host>/remoteEntry.js" }```

#
## Shared Store
As of now we have created MFE with multiple front-end instance.
<i>Made connections between them for sharing components while rendering certain URL paths</i>


But now one step ahead we would like to have a shared store among the components as well as different front-ends

So, the basic idea here is
<ol>
  <li>Have Shared Data</li>
  <li>Can be stored in client machine (if needed)</li>
  <li>MFE members can/could have read/write access to State</li>
</ol>

For this, we have to create separate mfe member called as <i>store</i>

Where store functionality will be written in React and exposed in webpack

Here we can also have extra feature that is, to store data in client machine in form of sessionStorage, localStorage or cookies.

For more code wise explanation check the above codebase, 

#
All members of MFE are react instance where,
<ol>
  <li>Header shows state value</li>
  <li>Dashboard updates state value</li>
  <li>Host(parent) as well updates state value</li>
  <li>This state value is maintained in separate instance called as store</li>
</ol>

#
