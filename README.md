# LearnPro - Online Learning Platform

LearnPro is an online learning platform designed to empower individuals through accessible, high-quality education. It offers a wide range of expert-led courses across technology, business, design, personal development, and more. With features like Razorpay payments, Clerk authentication, Cloudinary media handling, and Redux Toolkit for state management, LearnPro provides a seamless and engaging learning experience.

---

## ✨ Features

* 🎓 Wide range of courses across domains
* 🧑‍🏫 Expert-led video lectures
* 📊 Progress tracking and quizzes
* 📜 Course completion certificates
* 🔑 Secure authentication with Clerk
* 💳 Payment integration with Razorpay & Braintree
* ☁️ Cloudinary for image & media storage
* 📂 File uploads with FilePond
* 🌙 Dark mode support
* ⚡ Built with Next.js 14, Tailwind CSS, and shadcn/ui

---

## 📂 Folder Structure

```
├── client
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── public/                 # Static assets (logos, icons, images)
│   ├── src
│   │   ├── app/                 # Next.js App Router pages & layouts
│   │   │   ├── (auth)/          # Clerk auth pages (sign-in, sign-up)
│   │   │   ├── dashboard/       # User dashboard
│   │   │   ├── courses/         # Course listing & details
│   │   │   ├── checkout/        # Payment pages (Razorpay/Braintree)
│   │   │   └── api/             # API routes (payments, uploads, etc.)
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # shadcn/ui + Radix primitives
│   │   │   ├── forms/           # React Hook Form powered forms
│   │   │   └── common/          # Navbar, Footer, etc.
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities (axios, date-fns, zod validators)
│   │   ├── redux/               # Redux Toolkit slices & store
│   │   ├── styles/              # Global styles (Tailwind, globals.css)
│   │   └── types/               # TypeScript types
│   └── README.md
```

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14, React, Tailwind CSS, shadcn/ui
* **State Management:** Redux Toolkit
* **Forms & Validation:** React Hook Form, Zod
* **Authentication:** Clerk
* **Payments:** Razorpay, Braintree
* **Media Management:** Cloudinary, FilePond
* **Utilities:** Axios, date-fns

---

## 📸 Screenshots (Optional)

### Home Page:
<img width="1920" height="1031" alt="Screenshot (160)" src="https://github.com/user-attachments/assets/a629f42b-e207-4dfb-a499-13dd2a0cd60e" />

### Courses Page:
<img width="1920" height="1029" alt="Screenshot (161)" src="https://github.com/user-attachments/assets/74447293-5852-4bdd-937a-3ceefd8682fd" />

### Dashboard:
<img width="1920" height="1032" alt="Screenshot (165)" src="https://github.com/user-attachments/assets/ce28c392-36d7-4fa1-b0fa-6e61692b5c80" />

### Billing Page:
<img width="1920" height="1031" alt="Screenshot (163)" src="https://github.com/user-attachments/assets/e0bbdfae-6796-4aa3-9ba3-8001f5daecaa" />

### Profile Page:
<img width="1920" height="1027" alt="Screenshot (164)" src="https://github.com/user-attachments/assets/ac3fb024-52a5-4e4c-90e6-96920aea1580" />

### Course Player Page:
<img width="1920" height="1030" alt="Screenshot (166)" src="https://github.com/user-attachments/assets/41f69879-631e-49aa-9b27-d6c429da8d46" />

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 18
* npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/learnpro.git
cd learnpro/client

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root with the following:

```
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_api_key
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
NEXT_PUBLIC_BRAINTREE_KEY=your_braintree_key
NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
```

---

## 📜 License

This project is licensed under the MIT License.

---
