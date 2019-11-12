# React Native Mobile Chat
A chat app for mobile devices using React Native. The app provides users with a chat interface and the possibility to share images and their location.

This application is based on React-Native and Expo.

You can find a [Kanban board](https://trello.com/b/psitF4yL/react-native-mobile-chat-app) related to the development process.

## Quick start

To run this application, you should first:
- Install Expo
- Install the required libraries
- Setup a Firebase account
- Set the configuration parameters into a new file `config.js`

You can then get the app to start by running:

`npm start`

This will launch DevTools on port 19002. You can then run the app on a physical device or emulator by either scanning the QR code or by creating and signing into an Expo account.

To run on your device, you can download and install the expo app from the app store.</br>

For information on how to set up an emulator for testing, you can visit [this page](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/). You can then press "Run on Android device/emulator" in the DevTools to launch the app on your emulator.

## Requirements

### Install Expo

You can do this by running:

`npm install expo-cli -g`

### Install the required libraries

To install all dependencies, you can run:

`npm install`

### Setup Firebase account

To set up a Firebase account, please follow these steps:

#### Setup the account

1. Go to the [Firebase](https://firebase.google.com/?hl=en) homepage.
1. Sign in using your Google account, or create a new one.
1. Click on `Go to console` -> `Add project`.
1. Follow the instructions.

#### Create a database

1. Click on `Database` below the `Develop` tab on the left.
1. Click on `Create Database` and choose the option `start in test mode`.

#### Create a collection

1. click on `create collection` and name it `messages` and then press `auto id` and confirm on the next screen.

#### Enable anonymous authentication

1. click on `Authentication` -> `set up sign-in method`, and enable `anonymous authentication`.

#### Create a a cloud storage

1. click on `Storage` to set up a cloud storage.

#### Get configuration parameters

1. Click on the gear just above the `Develop` tab, and select `project settings`.
1. Add Firebase to a web app with a name
1. Copy the parameters in the firebaseConfig and paste into the Chat.js file.
1. Create a file named `config.js` in the root folder of your project, with the following content:
    ```javascript
    const firebaseConfig = {
    };

    export default firebaseConfig;
    ```

1. Insert the parameters inside `firebaseConfig` with the ones you just copied:
    ```javascript
    const firebaseConfig = {
      apiKey: '...',
      authDomain: '... .firebaseapp.com',
      databaseURL: 'https:// ... .firebaseio.com',
      projectId: '...',
      storageBucket: '... .appspot.com',
      messagingSenderId: '...',
      appId: '...',
      measurementId: '...',
    };

    export default firebaseConfig;
    ```
