# 🏥 CareNest - Baby Sitting & Elderly Care Service Platform

A comprehensive web application that provides reliable and trusted care services for children, elderly, and other family members. Users can easily find, book, and manage caretakers for different purposes through a secure and accessible platform.

## 🌟 Project Overview

**CareNest** is a web-based caregiving platform that connects users with professional caretakers for:
- 👶 Baby Care & Babysitting
- 👴 Elderly Care Services
- 🏥 Sick People Special Care

The platform simplifies the process of finding trusted care services with transparent pricing, easy booking, and real-time status tracking.

---

## ✨ Key Features

### Core Functionality
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **User Authentication**: 
  - Email & Password login
  - Google Social Login integration
- **Dynamic Booking System**:
  - Flexible duration selection (hours/days)
  - Location-based services (Division → District → City → Area)
  - Address input for precise service delivery
- **Automatic Cost Calculation**: Real-time total cost based on duration × service charge
- **Booking Management**:
  - Status tracking (Pending / Confirmed / Completed / Cancelled)
  - My Bookings dashboard
  - Cancel booking option
- **Service Pages**: Dedicated detail pages for each service type

### Advanced Features
- **SEO Optimized**: Metadata implementation on Home & Service detail pages
- **Email Notifications**: Automated invoice emails upon booking confirmation
- **Private Routes**: Secure access with persistent login sessions

### Optional Features
- 💳 **Stripe Payment Integration**: Secure online payments
- 📊 **Admin Dashboard**: Payment history and booking management
- 📧 **Email Service**: Booking confirmations and invoices

---

## 📋 Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage with banner, services overview, testimonials |
| `/service/:service_id` | Public | Detailed service information with booking CTA |
| `/booking/:service_id` | Private | Multi-step booking form with cost calculation |
| `/login` | Public | User authentication page |
| `/register` | Public | New user registration with validation |
| `/my-bookings` | Private | User's booking history and management |
| `*` | Public | 404 Error page with navigation |

---

## 🎯 User Journey

### 1. **Homepage**
- Eye-catching banner/slider with caregiving motivation
- About section explaining platform mission
- Services overview cards (Baby Care, Elderly Service, Sick People Service)
- Success metrics and testimonials

### 2. **Service Detail Page** (`/service/:service_id`)
- Comprehensive service information
- Pricing details
- "Book Service" button (redirects to login if unauthenticated)

### 3. **Booking Process** (`/booking/:service_id`)
**Step-by-step booking flow:**
1. Select service duration (hours or days)
2. Choose location (Division → District → City → Area)
3. Enter detailed address
4. Review automatically calculated total cost
5. Confirm booking → Status set to "Pending"
6. Receive email invoice

### 4. **My Bookings** (`/my-bookings`)
View and manage all bookings with:
- Service name and details
- Duration and location
- Total cost
- Current status (Pending/Confirmed/Completed/Cancelled)
- Action buttons (View Details / Cancel Booking)

---

## 🔐 Authentication System

### Registration Requirements
- **NID Number**: Unique identification
- **Full Name**
- **Email Address**
- **Contact Number**
- **Password**: 
  - Minimum 6 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
- **Confirmation**: Password match validation

### Login Options
- Email & Password
- Google Social Login

### Security Features
- Persistent login sessions (no redirect to login on private route reload)
- Protected routes for booking and user dashboard
- Secure password hashing

---

## 🛠️ Technical Implementation

### Frontend Technologies
- React.js / Next.js (recommended)
- Tailwind CSS for styling
- React Router for navigation
- Firebase Authentication (or Auth0)
- Axios for API requests

### Backend Technologies
- Node.js with Express.js
- MongoDB / PostgreSQL for database
- JWT for session management
- Nodemailer for email services
- Stripe API for payment processing (optional)

### Data Structure Example

```javascript
// Booking Schema
{
  bookingId: "BK001234",
  userId: "USR5678",
  serviceId: "SRV001",
  serviceName: "Baby Care",
  duration: {
    value: 8,
    unit: "hours"
  },
  location: {
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhanmondi",
    area: "Road 27",
    address: "House 12, Road 27, Dhanmondi"
  },
  totalCost: 1200,
  status: "Pending", // Pending | Confirmed | Completed | Cancelled
  bookingDate: "2025-01-03",
  createdAt: "2025-01-03T10:30:00Z"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB/PostgreSQL database
- Firebase account (for authentication)
- Stripe account (optional, for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AfsanaMim9639/carenest.git
cd carenest
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_database_connection_string

# Authentication
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Payment (Optional)
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Application
JWT_SECRET=your_jwt_secret_key
API_BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. **Run the application**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

5. **Access the application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 📊 Challenges Implementation

### 1. **Metadata Implementation**
```javascript
// Home Page
<Helmet>
  <title>CareNest - Trusted Baby Sitting & Elderly Care Services</title>
  <meta name="description" content="Find reliable caretakers for children, elderly, and sick family members. Book trusted care services easily." />
  <meta property="og:title" content="CareNest - Professional Care Services" />
  <meta property="og:image" content="/og-image.jpg" />
</Helmet>

// Service Detail Page
<Helmet>
  <title>{serviceName} - CareNest</title>
  <meta name="description" content={serviceDescription} />
</Helmet>
```

### 2. **Email Invoice System**
```javascript
// Email template sent after booking
const sendBookingInvoice = async (bookingData) => {
  const emailContent = `
    <h2>Booking Confirmation - CareNest</h2>
    <p>Thank you for booking our service!</p>
    <h3>Booking Details:</h3>
    <ul>
      <li>Service: ${bookingData.serviceName}</li>
      <li>Duration: ${bookingData.duration}</li>
      <li>Location: ${bookingData.location.address}</li>
      <li>Total Cost: ৳${bookingData.totalCost}</li>
      <li>Status: ${bookingData.status}</li>
    </ul>
  `;
  // Send email using Nodemailer
};
```

---

## 💳 Optional Features

### Stripe Payment Integration
- Secure checkout process
- Payment success confirmation
- Booking creation after successful payment
- Transaction history

### Admin Dashboard
- View all bookings
- Payment history reports
- User management
- Service analytics
- Booking status updates

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

---

## 🔒 Security Considerations

- Password encryption using bcrypt
- JWT token-based authentication
- HTTP-only cookies for session management
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Environment variable protection

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Check code coverage
npm run test:coverage
```

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy to hosting platform
3. Set environment variables in platform settings

### Backend Deployment (Railway/Render/Heroku)
1. Configure environment variables
2. Set up database connection
3. Deploy application
4. Configure domain and SSL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


