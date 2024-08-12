# Big and Little: a MERN Stack Mobile App with Expo

This repo contains a MERN stack mobile application: using MongoDB Atlas and Expo

## Pre-reqs
-[Node.js](https://nodejs.org/en/download/package-manager) **Node.JS v20.16.0(LTS)**  
    -Execute given commands in Windows PowerShell (have not researched complications w/ macOS)  
-[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) Account  
-[Expo CLI](Expo APP on iPhone) APP  

## Setup
1. Clone the repo
2. Create '.env' file
    -In root directory, copy '.env.example,' into a new file '.env.'
    -Filling in your MongoDB Atlas URI in the spare space in '.env' (communicate with your scrum masters at this point!)
2. Install backend dependencies:
    -In terminal, run: npm install
3. Install mobile dependencies:
    -In terminal, cd into mobile
    -Run: npm install
4. Have Expo Go app running on your phone!

## Running
1. In root of project, run 'npm run server' in terminal
2. In root of project, run 'npm run mobile' in terminal
3. The app is running!

You can start the app (both server and mobile) with simply 'npm run dev' in terminal, but there's a bug with it not showing the QR code with this input; after you've started the app once through the process outlined above, you can simply run the 'npm run dev' command and connect to the app, on your device, through past connections.