# HotelPro Client

Frontend React single-page application built with **Vite**, **Bootstrap 5**, **React Router v6**, and **Axios**.

## Features

- **AuthContext**: Manages authentication tokens and user state in `localStorage`.
- **Axios Instance**: Automatically attaches `Bearer <token>` in the `Authorization` header.
- **Role-Based Navigation**: Navbar adjusts links according to user roles (`guest`, `staff`, `admin`).
- **Protected Routes**: Automatic redirection to `/login` for unauthenticated users and authorization verification for staff/admin views.
- **Pages**:
  - **Login / Register**: Tabbed interface with role selection.
  - **Rooms**: Filterable room cards with check-in/out date range picker and instant booking.
  - **My Bookings (Guest)**: Displays reservations with mock payment and cancellation options.
  - **Staff Page (Staff / Admin)**: Dashboard to oversee bookings and execute check-ins and check-outs.
  - **Admin Page (Admin)**: Form to add new rooms with live inventory list.

## Development Scripts

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```
