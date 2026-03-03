# 🌟 Airbnb Clone

Welcome to the **Airbnb Clone** project! 🏠✨ This project replicates key features of the Airbnb platform, allowing users to explore listings, create accounts, and interact with the application.

## 🌐 Live Demo

[👉 Check out the live version here!](https://airbnb-64m2.onrender.com/listing)

## ✨ Features

- 🔒 **User Authentication** (Signup/Login using Passport.js)
- 🏡 **Listing creation and management**
- 🖼️ **Dynamic content rendering** with EJS templates
- ✅ **Form validation** with Joi
- 📱 **Fully responsive design** for desktop and mobile

## 🛠️ Technologies Used

- **Frontend:** 🎨 HTML, CSS, Bootstrap, EJS
- **Backend:** ⚙️ Node.js, Express.js
- **Database:** 🗄️ MongoDB (with Mongoose)
- **Authentication:** 🔑 Passport.js
- **Validation:** ✅ Joi
- **Hosting:** 🌍 Render

## 🚀 Installation

Follow these steps to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kanzariya-maulik/Airbnb.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Airbnb
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     DATABASE_URL=mongoURL
     SECRET=hashing_secret
     CLOUD_NAME=cloudinary_account_name
     CLOUD_API_KEY=cloudinary_api_key
     CLOUD_API_SECRET=cloudinary_api_secret
     MAP_TOKEN=mapbox_token
     ```

5. **Start the server:**

   ```bash
   npm start
   ```

6. **Open your browser and visit:**

   ```
   http://localhost:8080
   ```

### 🐳 Running with Docker

1. **Build and Run:**
   ```bash
   npm run docker
   ```
2. **Access the app:**
   ```
   http://localhost:8080/listing
   ```

### ☸️ Running with Kubernetes (Kind)

> This setup runs the application in a local Kubernetes cluster using [Kind](https://kind.sigs.k8s.io/). It creates a cluster with 1 control-plane node and 2 worker nodes, and injects your `.env` variables via a ConfigMap.

1. **Ensure you have Docker, `kind`, and `kubectl` installed.**
2. **Launch the cluster and deploy:**
   ```bash
   npm run k8s_kind
   ```
3. **Access the application:**
   ```
   http://localhost:30001/listing
   ```

_(To easily redeploy changes with zero-downtime rolling updates, use `npm run k8s_kind_redeploy`)_

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/14a062af-bd2c-405f-bc42-8e3c9d7cc676)
![image](https://github.com/user-attachments/assets/3fa4f0e1-540b-4b21-9207-33cf1967f2d6)
![image](https://github.com/user-attachments/assets/6fb22fe2-73d3-4dd1-9ee6-808986431ab8)
![image](https://github.com/user-attachments/assets/76ca54e6-b40a-4d4c-9e79-35dfeb2394d5)
![image](https://github.com/user-attachments/assets/06b96c0b-37bd-4b9e-ae6e-d156f3c248e4)
![image](https://github.com/user-attachments/assets/66a5d7a9-9287-4725-8bd2-5e5c7206db82)

## 📂 Folder Structure

```
Airbnb/
|-- public/          # Static assets (CSS, JS, Images)
|-- routes/          # Application routes
|-- views/           # EJS templates
|-- models/          # Mongoose models
|-- controllers/     # Application logic and controllers
|-- init/            # Initialization scripts or configuration
|-- utils/           # Utility functions and helpers
|-- app.js           # Main application entry point
|-- package.json     # Dependencies and scripts
```

## Diagram

![diagram](https://github.com/user-attachments/assets/20c76332-9cfa-44c3-bde5-6f16d09d3fcf)

## 🤝 Contributing

Contributions are welcome! 🎉 If you’d like to improve this project:

1. **Fork the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature-name
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "Add feature-name"
   ```
4. **Push to your branch:**
   ```bash
   git push origin feature-name
   ```
5. **Submit a pull request.** 🚀

## 🙏 Acknowledgements

- 🏠 [Airbnb](https://www.airbnb.com) for the inspiration.
- 🌍 [Render](https://render.com) for hosting the live demo.
- 🗺️ [Mapbox](https://www.mapbox.com) for providing the mapping services.
- ☁️ [Cloudinary](https://cloudinary.com) for image hosting and management.
- 💖 All contributors who helped make this project a success!
