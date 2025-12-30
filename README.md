# MERN Stack Blog Application

A full-stack **MERN Blog Application** built using **MongoDB, Express.js, React.js, and Node.js**.  
This project supports **user authentication**, **CRUD operations for blog posts**, **protected routes**, and a **rich text editor** for writing blogs.

---

##  Features

###  Authentication
- User Registration
- User Login
- JWT-based authentication
- Protected routes (only authenticated users can create/edit/delete posts)

###  Blog Management
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- View all blog posts
- View single blog post (detail page)

###  Rich Text Editor
- Built using **TipTap**
- Supports:
  - Bold
  - Italic
  - Underline
  - Headings
  - Lists
  - Blockquotes

###  Forms & Validation
- Forms handled using **Formik**
- Validation using **Yup**
- Client-side validation for:
  - Name
  - Email
  - Password
  - Confirm Password

###  UI & UX
- Tailwind CSS for styling
- Loader component
- Toast notifications using **react-hot-toast**
- Responsive layout

---

##  Tech Stack

### Frontend
- React.js
- Redux Toolkit & RTK Query
- React Router DOM
- Formik + Yup
- TipTap Editor
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

---


Getting Started
Clone the Repository
git clone https://github.com/abdulzakirkhan/task-blog.git


Install Backend Dependencies
cd server
npm install
npm start

Install Frontend Dependencies
cd client
npm install
npm run dev

API Endpoints
Auth
POST /auth/register → Register user
POST /auth/login → Login user

Blogs

GET /posts → Get all blogs

GET /posts/:id → Get blog by ID

POST /posts → Create new blog (Protected)

PUT /posts/:id → Update blog (Protected)

DELETE /posts/:id → Delete blog (Protected)

API Testing

APIs tested using Postman

Local APIs exposed using ngrok for sharing