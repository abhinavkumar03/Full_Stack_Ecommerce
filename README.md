# Full Stack Ecommerce Project

## Project Overview
This is a full-featured ecommerce web application built with a modern MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless shopping experience for users and a powerful admin dashboard for store management. The project demonstrates secure authentication, robust backend APIs, and a responsive frontend UI.

## Current Features
- **User Authentication & Security**: Secure login/registration using JWT, password hashing, and role-based access (admin/user).
- **Admin Dashboard**: Admin panel for managing users, products, and orders, including inventory control and order processing.
- **Product Management**: Dynamic product catalog with full CRUD operations, category management, and image uploads.
- **Shopping Cart & Checkout**: Persistent cart system, quantity adjustment, and secure checkout process.
- **Order Management**: Order history, transaction records, and real-time status updates for users and admins.
- **Image Uploads**: Product images are uploaded and served securely from the backend.
- **Responsive Frontend**: Built with React, supporting all major devices and screen sizes.
- **Backend API**: RESTful API built with Node.js, Express, and MongoDB for data storage.
- **Technologies Used**: React, Node.js, Express.js, MongoDB, JWT, Multer, PM2, Git/GitHub.

## Project Structure
```
Full_Stack_Ecommerce/
  backend/      # Node.js/Express API, MongoDB models, authentication, image upload
  frontend/     # React app, components, pages, context, assets
```
- **backend/**: Contains all server-side code, API routes, authentication logic, and image upload handling.
- **frontend/**: Contains the React application, including user and admin pages, components, and styles.

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Backend Setup
1. `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   - `PORT=4000`
   - `MONGODB_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
4. Start in development: `npm run dev`
5. For production with PM2:
   - `npm run prod` (start)
   - `npm run stop` (stop)
   - `npm run restart` (restart)
   - `npm run logs` (view logs)

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start the React app: `npm start`
4. The app runs at [http://localhost:3000](http://localhost:3000)

## Future Enhancements / Roadmap
- Product reviews and ratings
- Wishlist/favorites functionality
- Advanced analytics and reporting for admin
- Email notifications for orders and account events
- Multi-vendor marketplace support
- Mobile app (React Native or Flutter)
- Internationalization (multi-language support)
- Performance and security improvements (rate limiting, audit logs, etc.)
- Integration with more payment gateways

## Contributing
Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or suggestions.

## License
This project is licensed under the MIT License. 