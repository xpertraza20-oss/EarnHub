# Premium UI/UX Design Specification: Earn Hub

## 1. Core Aesthetic (Aesthetic & Vibe)
- **Theme**: Clean & Minimal Light Theme combined with Glassmorphism.
- **Colors**:
  - Background: Soft Off-White / Very Light Gray (e.g., `#f8fafc`).
  - Primary Accent: Premium Blue or Purple gradients (Apple/Stripe inspired).
  - Cards/Containers: White with slight transparency and background blur (Glassmorphism).
- **Typography**: Modern Sans-serif (like Inter or Roboto) for clean readability.
- **Icons**: Lucide React icons will be utilized across all pages for consistent, modern iconography.

## 2. Layout & Structure
- **Global Layout**: A unified sidebar/navbar structure that utilizes glassmorphism for its background.
- **Page Transitions & Animations**: Subtle micro-interactions on hover states, button clicks, and page loads using Tailwind.
- **Cards & Data**: All tabular data and dashboard metrics will be housed in softly shadowed, rounded-corner glass cards.

## 3. Sub-pages to Overhaul
- **Dashboard (`/dashboard`)**: Premium statistics cards, beautiful Recharts graphs with gradients.
- **Admin (`/admin`)**: Clean tables, clear action buttons, easily scannable data.
- **Login/Signup (`/login`, `/signup`)**: Centered glassmorphic forms with a subtle animated gradient background.
- **Tasks & Referrals (`/tasks`, `/referrals`)**: Gamified, engaging list views with clear iconography indicating task status or referral tiers.
- **Withdrawals (`/withdrawals`)**: Trust-inspiring, secure-looking forms and transaction history.

## 4. Technical Implementation
- **Styling Engine**: Tailwind CSS.
- **Components**: Reusable UI components (Buttons, Inputs, Cards).
- **Validation**: Ensure all UI changes remain responsive on mobile devices.
