# Legal360 – Backend API

This is the backend service for **Legal360**, a web platform for legal advisory services in Colombia. It provides a RESTful API for managing PQRSF submissions, legal diagnostics, user authentication, and blog content.

---

## 🌍 Live API (Hosted on Render)

**Base URL:**  
🔗 https://legal360-backend.onrender.com/api/

---

## 📌 Main Features

- 📨 **PQRSF Handling** – Submit and store user requests, with file upload
- 🧠 **Free Diagnostic Form** – Capture and process diagnostic data
- 📝 **Blog Management** – Create, update, delete and retrieve blog posts
- 🔐 **Authentication** – JWT login system with user roles
- ☁️ **Cloudinary Integration** – Store uploaded PDFs securely in the cloud
- 📥 **Supabase Integration** – File handling and service role support

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- MySQL  
- Multer (file uploads)  
- Cloudinary SDK  
- Supabase SDK  
- JWT (JSON Web Tokens)  
- CORS / Dotenv  

---

## 📁 Project Structure

/config
cloudinary.js # Cloudinary credentials and setup
db.js # MySQL connection
multerConfig.js # File upload configuration
supabaseClient.js # Supabase setup

/controllers
authController.js # Login, token issuance
blogController.js # Blog CRUD operations
diagnosticsController.js # Diagnostic form logic
pqrsfController.js # PQRSF processing
userController.js # Admin user handling

/routes

All Express routers per module
/uploads

Stores incoming files before upload (temp)
.env / .env.local # Environment variables
index.js # Main entry point


---

## 🔐 Environment Variables

Create a `.env.local` file in `/server/` with the following:

```env
PORT=4000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=legal360
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

🚀 How to Run Locally

# Clone repository
git clone https://github.com/sazaba/legal360-backend.git
cd legal360-backend

# Install dependencies
npm install

# Start development server
npm run dev

📬 API Endpoints Overview
Method	Endpoint	Description
POST	/api/auth/login	Admin login, returns JWT
POST	/api/pqrsf	Submit PQRSF with file
POST	/api/diagnostico	Submit diagnostic answers
GET	/api/blog	Public list of blog posts
POST	/api/blog	Create a blog post (auth)
PUT	/api/blog/:id	Update blog post (auth)
DELETE	/api/blog/:id	Delete blog post (auth)
GET	/api/usuarios	List of admin users (auth)

🔗 Related Project
🖥️ Frontend Repository: https://github.com/sazaba/legal360-frontend

👨‍💻 Author
Santiago Zappa
React & Node.js Fullstack Developer
📧 santiagozappab@gmail.com
🌐 https://legal360.vercel.app