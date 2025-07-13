# ✈️ Flight Booking Frontend

This is the frontend for the **Flight Booking System**, built using **Next.js ** and **TailwindCSS**, integrated with **Supabase Auth** for user login and **Edge Functions** for API access.

---

# Live
https://flight-booking-frontend-one.vercel.app/

## 🧱 Tech Stack

* **Next.js 14** with App Router
* **React** + **TypeScript**
* **TailwindCSS** for UI styling
* **Supabase Auth** for login/signup
* **Supabase Storage** for ticket PDFs
* **Edge Function APIs** (hosted on Supabase)

---

## 🚀 Features

* 🔐 **Login/Signup with Supabase**
* 📅 **Search Flights** by origin, destination, date, cabin class, passengers
* 📖 **Book Flights** (one-way or round trip)
* 📄 **Download Tickets** (PDF from Supabase Storage)
* 🔄 **Modify or Cancel Bookings**
* 🟢 **Live Flight Status** via Supabase Realtime
* ✅ **Fully integrated with Edge Function backend**

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/flight-booking-frontend.git
cd flight-booking-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Supabase Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

These values can be found in your Supabase project dashboard → Settings → API.

---

## 🧪 Run Locally

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000`

---

## 🔐 Auth Flow

* **useAuth** context provides `user`, `session`, and `authLoading`.
* Auth state is persisted using Supabase’s client SDK.
* Pages are protected based on session presence (`my-bookings`, `book`, etc.).

---

## 🌐 API Integration

All requests to backend use **Supabase Edge Functions** via `/api/` route handlers:

* `/api/searchFlights` → `supabase/functions/searchFlights`
* `/api/createBooking` → `supabase/functions/createBooking`
* `/api/cancelBooking` → `supabase/functions/cancelBooking`
* `/api/getMyBookings` → fetch user bookings
* `/api/flightStatusSSE` → listen to real-time flight updates

---


## 📌 Deployment

* deployed the frontend to **Vercel** with github for smooth CI/CD.
* Ensure environment variables are added to project settings.

---





