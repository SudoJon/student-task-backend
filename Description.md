# student-task-backend
**Student Task Manager Backend API Project**
Student Task Manager – Backend API (AWS Cloud Capstone Project)  
This repository contains the backend service for our cloud‑hosted Student Task Manager application. The API is built with Node.js and Express, connected to an AWS RDS MySQL database, and deployed on an EC2 instance inside a secure VPC architecture.

The backend exposes RESTful endpoints for creating, retrieving, updating, and deleting tasks. All requests are protected using an API key authentication layer. The service is designed following a clean MVC structure with separate routing and controller logic.
Core Features
*  REST API built with Express
*  MySQL database hosted on AWS RDS
*  Secure API-Key authentication
*  Deployed on AWS EC2
*  Organized MVC folder structure (routes + controllers)
*  Environment variables managed through .env
*  CORS-enabled for frontend integration
*  Designed for scalability and cloud native deployment

AWS Architecture Components
*  EC2 instance (backend compute)
*  RDS MySQL instance (private subnet)
*  S3 bucket (frontend hosting)
*  IAM role attached to EC2 for secure access
*  VPC with public/private subnets and security groups

This backend serves as the core logic layer for the Student Task Manager application, enabling reliable task storage, retrieval, and management across thwe cloud environmemt.
