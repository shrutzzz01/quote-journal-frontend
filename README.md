# 🖋️ Quote Journal - Frontend

A responsive React-based client for the Quote Journal application. This interface allows users to view, search, and manage their personal quotes, while providing an administrative dashboard for system-wide content management.

---

## 🚀 Live Demo
**Frontend:** [https://quote-journal-frontend.vercel.app](https://quote-journal-frontend.vercel.app)  
**Backend API:** [https://quote-journal-backend.onrender.com/api](https://quote-journal-backend.onrender.com/api)

---

## 🛠️ Tech Stack
* **React.js** - Component-based UI library.
* **React Router** - Single Page Application (SPA) navigation.
* **Axios** - Promise-based HTTP client for API communication.
* **CSS3** - Custom styling with a focus on responsive design.
* **Lucide-React** - Lightweight iconography.

---

## 🔑 Key Features
* **Dynamic Quote Dashboard:** Real-time fetching and display of quotes from the Spring Boot API.
* **Administrative Access:** Secure login flow for admin users to perform CRUD operations.
* **Search & Filtering:** Client-side filtering logic for a fast user experience.
* **CORS-Aware Architecture:** Fully configured to communicate with cross-origin backend services using secure headers.

---

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/shrutzzz01/quote-journal-frontend.git](https://github.com/shrutzzz01/quote-journal-frontend.git)
   cd quote-journal-frontend
2. Install dependencies:
   ```bash
   npm install
3. Environment Configuration: Create a .env file in the root directory and add the backend API URL:
   ```bash
   REACT_APP_API_URL=http://localhost:8080/api
4. Run the application:
   ```bash
   npm start
