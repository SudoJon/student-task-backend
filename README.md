**Backend API for the Student Task Manager project. Built with Node.js/Express, connected to AWS RDS MySQL, and deployed on EC2 inside a secure VPC. Uses API‑key authentication and a clean MVC structure.**
 **Features**

*    REST API built with Express

*    MySQL database hosted on AWS RDS

*    Secure environment variables using .env

*    CloudWatch logging + monitoring

*    Custom homepage route

*    /tasks endpoint for retrieving tasks

*    Deployed on AWS EC2

 **Project Structure**


student-task-backend/
│
├── Backend/
│   ├── app.js
│   ├── package.json
│   ├── node_modules/
│   └── .env   (not included in repo)
│
└── README.md

 **Local Setup**
1. **Clone the repository**


git clone https://github.com/SudoJon/student-task-backend.git
cd student-task-backend/Backend

2. **Install dependencies**


npm install

3. **Create a .env file**

     This file is NOT included in GitHub for security reasons.



DB_HOST=your-rds-endpoint
DB_USER=admin
DB_PASS=yourpassword
DB_NAME=student_tasks

4. **Start the server**


node app.js

 **API Endpoints**
**GET /**

Returns a simple HTML homepage confirming the backend is running.
**GET /tasks**

Returns all tasks stored in the MySQL database.
 **Database Schema**


CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50)
);

 **AWS Deployment Overview**
**EC2 Instance**

*    Hosts the Node.js backend

*    Contains the .env file

*    Runs the server manually or in the background

**RDS MySQL**

*    Stores all task data

*    Only accessible from EC2 security group

**CloudWatch**

*    CloudWatch Agent installed

*    Logs forwarded from:
    

    /home/ec2-user/node-app.log

*    Log group: node-app-logs

 **Logging**

The backend writes logs to:


/home/ec2-user/node-app.log

CloudWatch ingests this file automatically for monitoring.
 **Error Handling**

The backend includes error handling for:

*    Database connection failures

*    API errors

*    Server startup issues

All errors are logged to both the console and the log file.
 **Deployment Commands (EC2)**
**Start server**


node ~/student-task-backend/Backend/app.js

**Run in background**


node ~/student-task-backend/Backend/app.js &

**Stop background process**


jobs
fg %1
CTRL + C

**Pull latest changes**


cd ~/student-task-backend
git pull

 **Lessons Learned**

*    Managing environment variables securely

*    AWS EC2 + RDS connectivity

*    Security group configuration

*    CloudWatch logging setup

*    Linux process management

*    Deploying Node.js apps on cloud infrastructure
