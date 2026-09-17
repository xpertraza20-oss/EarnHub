# EarnHub - Task Karo, Reward Kamao 🚀

Professional earning platform jahan members free signup karke legitimate tasks complete karte hain aur rewards earn karte hain.

## 🌟 Features

- ✅ **User Authentication** - Secure signup/login with JWT tokens
- 📋 **Multiple Tasks** - Surveys, Apps, Games, Signups
- 💰 **Rewards System** - Automatic reward credit via API/Postback
- 💳 **Withdrawals** - JazzCash, Easypaisa & Bank Transfer
- 👥 **Referral System** - Invite friends, earn Rs. 10 per referral
- 📱 **Mobile Friendly** - PWA support, install on home screen
- 🛡️ **Anti-Fraud** - Duplicate account protection
- 👨‍💼 **Admin Panel** - Manage users, tasks, withdrawals

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT + bcryptjs
- **Deployment**: Vercel/Cloudflare

## 🚀 Quick Start

### 1. Clone the project
```bash
git clone <your-repo-url>
cd EarnHub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Database
1. Create Neon PostgreSQL database at https://console.neon.tech/
2. Copy connection string
3. Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/EarnHub?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push database schema
```bash
npx prisma db push
```

### 5. Seed database
```bash
npx tsx prisma/seed.ts
```

### 6. Run development server
```bash
npm run dev
```

### 7. Access the app
- **User Interface**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 🔐 Default Credentials

### Admin Login
- **Email**: admin@earnhub.com
- **Password**: admin123

## 📁 Project Structure

```
EarnHub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── user/          # User profile
│   │   │   ├── tasks/         # Tasks management
│   │   │   ├── withdrawals/   # Withdrawals
│   │   │   ├── referrals/     # Referral system
│   │   │   ├── admin/         # Admin APIs
│   │   │   └── providers/     # Provider integrations
│   │   ├── dashboard/         # User dashboard
│   │   ├── tasks/             # Tasks page
│   │   ├── withdrawals/       # Withdrawals page
│   │   ├── referrals/         # Referrals page
│   │   └── admin/             # Admin panel
│   ├── lib/                   # Helper functions
│   │   ├── db.ts             # Database connection
│   │   ├── auth.ts           # Authentication helpers
│   │   ├── antiFraud.ts      # Anti-fraud checks
│   │   └── providers/        # Provider integrations
│   └── components/            # Reusable components
├── prisma/                   # Database schema & seed
├── public/                   # Static files & PWA
└── .env                      # Environment variables
```

## 🎯 How It Works

### For Users:
1. **Sign Up** - Create free account
2. **Complete Tasks** - Surveys, apps, games, signups
3. **Earn Rewards** - Points added to balance
4. **Withdraw** - Get paid via JazzCash, Easypaisa or Bank

### For Admin:
1. **Login** - Access admin panel
2. **Manage Users** - View, edit, ban users
3. **Manage Tasks** - Add, edit, remove tasks
4. **Approve Withdrawals** - Process payment requests
5. **Monitor Stats** - Track earnings, users, withdrawals

## 🔌 Provider Integration

Currently supports:
- BitLabs
- AdGate Media
- OfferToro

To add a new provider:
1. Create new provider class in `src/lib/providers/`
2. Add to `ProviderManager`
3. Create postback API route
4. Add provider in admin panel

## 💳 Payment Methods

### Supported:
- **JazzCash** 📱
- **Easypaisa** 📱  
- **Bank Transfer** 🏦

### Minimum Withdrawal: Rs. 100

## 📱 Mobile PWA

This app is Progressive Web App (PWA) ready:
- Install on home screen
- Works offline
- Fast loading
- Native app experience

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Anti-fraud checks
- Input validation
- CORS protection
- Rate limiting ready

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Cloudflare Pages
1. Build command: `npm run build`
2. Output directory: `.next`
3. Add environment variables

## 📊 Database Schema

- **Users** - User accounts & balances
- **Tasks** - Available tasks
- **Providers** - Offerwall providers
- **CompletedTasks** - Task completions
- **Withdrawals** - Payment requests
- **Referrals** - Referral system

## 🤝 Contributing

1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

- **Email**: support@earnhub.com
- **WhatsApp**: +92 3XX XXXXXXX

## ⚠️ Important Notes

1. **Provider Approval**: Apply to providers (BitLabs, AdGate) before going live
2. **Payment Gateway**: Integrate real payment APIs for production
3. **Legal Compliance**: Ensure compliance with local laws
4. **Testing**: Test thoroughly before launching

## 📈 Future Features

- [ ] Mobile apps (React Native)
- [ ] More payment methods
- [ ] Cryptocurrency withdrawals
- [ ] Gamification (levels, badges)
- [ ] Social features

## 🙏 Credits

- Next.js - React framework
- Prisma - Database ORM
- Tailwind CSS - CSS framework
- Lucide Icons - Icon library

---

**Made with ❤️ for Pakistan** 🇵🇰