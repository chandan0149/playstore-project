# Play Store Application

## Overview

This is a full-stack Play Store web application where users can browse, download, and review apps. The system also allows app owners to upload and manage their applications.

## Tech Stack

* React.js (Frontend)
* Node.js and Express.js (Backend)
* MongoDB (Database)
* JWT (Authentication)

## Features

### User

* Register and login
* View apps
* Download apps
* Give ratings and reviews

### Owner

* Upload apps
* Manage apps
* View downloads and ratings

## Project Structure

playstore/

* backend/
* frontend/

## Installation

### Clone the project

git clone https://github.com/chandan0149/playstore-project.git

### Backend setup

cd backend
npm install
npm start

### Frontend setup

cd frontend
npm install
npm start

## Environment Variables

Create a .env file in backend and add:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

## Usage

Open browser and run:
http://localhost:3000

## Author

Chandan Kumar
