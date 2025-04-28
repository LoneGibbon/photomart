PhotoMart - Full Stack Application Setup

Instructions:
This project is a full stack photography marketplace built using React
(Frontend) and Spring Boot (Backend) with H2 Database. This file
contains instructions on how to set up the project and get it running on
your local machine.
📋 Prerequisites:
Make sure you have the following installed on your machine:
•
Java 17 (for backend)
•
Maven (for backend)
•
Node.js (v18 or above) and npm (for frontend)
Use these commands to check:
java -version
mvn -version
node -v
npm -v
📁 Project Structure:
photomart/
├── photomart-frontend/ (React App)
├── photomart-backend/ (Spring Boot App)
└── README (this file)

🚀 Backend Setup (Spring Boot):

1. Open your terminal.
2. Navigate to the backend folder:
   cd photomart-backend
3. Install dependencies and build the project:
   ./mvnw clean install
4. Start the backend server:
   ./mvnw spring-boot:run
   ✅ The backend will start running at: http://localhost:8080
   •
   H2 Console (for database access) available at:
   http://localhost:8080/h2-console
   •
   JDBC URL: jdbc:h2:file:./data/photomartdb
   •
   Username and password are configured in application.properties.
   (username: sa)
   Note: Make sure port 8080 is free when starting the backend.

   🚀 Frontend Setup (React):

5. Open another terminal window or tab.
6. Navigate to the frontend folder:
   cd photomart-frontend
7. Install all required dependencies:
   npm install
8. Start the React frontend application:
   npm run dev
   ✅ The frontend app will start running at: http://localhost:3000
   •
   It will automatically connect with the backend running on
   •
   •
   •
   http://localhost:8080.
   No additional setup is needed for API integration.
   Customer login: UserID: demo@test.com Password: 1234
   Seller login: UserID: demo1@test.com Password: 1234
   Note: Make sure port 3000 is free when starting the frontend.
   📖 Final Notes:
   •
   Always start the backend server first before starting the frontend
   client.
   •
   Both servers must be running simultaneously for full functionality.
