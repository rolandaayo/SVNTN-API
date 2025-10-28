Seventeen Visuals — Server

This folder contains a small Express + Mongoose server used to accept booking requests and manage them.

Quick overview

- POST /api/bookings -> create a new booking (public)
- GET /api/bookings/:id -> get booking by bookingId (public)
- GET /api/bookings -> list bookings (admin only)
- PATCH /api/bookings/:id/approve -> approve booking (admin only)
- DELETE /api/bookings/:id -> delete booking (admin only)

Booking ID format

- Booking IDs are generated as: SVN-### (e.g. SVN-001). A `Counter` collection tracks the next sequence value.

Environment
Create a `.env` file in this folder or set environment variables before starting.

Example `.env` (see `.env.example`):

MONGODB_URI=mongodb://localhost:27017/seventeenvisuals
PORT=4000
ADMIN_TOKEN=some-secret-token

Admin authentication

- Admin endpoints expect an `x-admin-token` header containing `ADMIN_TOKEN` value OR `?admin_token=` query param.

Install & run

1. cd server
2. npm install
3. cp .env.example .env && edit .env
4. npm run dev

Testing with curl

- Create booking (public):
  curl -X POST http://localhost:4000/api/bookings -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@x.com","phone":"+123","date":"2026-01-01","notes":"Looking forward"}'

- Get booking by id (public):
  curl http://localhost:4000/api/bookings/SVN-001

- List bookings (admin):
  curl -H "x-admin-token: some-secret-token" http://localhost:4000/api/bookings
