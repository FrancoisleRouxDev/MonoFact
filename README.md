# MonoFact

MonoFact is a cross-platform educational mobile application built with **React Native** and **Expo**. The app teaches users interesting facts through an engaging swipe-based quiz experience inspired by modern learning apps.

Users swipe **right** if they believe a statement is a **Fact** and **left** if they believe it is a **Myth**, receiving immediate feedback while earning XP, building streaks, and tracking their progress across different knowledge categories.

---

## Preview

![MonoFact app screens](assets/monofact-preview.png)

---

## Screenshots

| Home | Play | Gameplay |
|------|------|----------|
| ![Home Screen](assets/screenshots/home.png) | ![Play Screen](assets/screenshots/play.png) | ![Gameplay Screen](assets/screenshots/gameplay.png) |

| Feedback | Results | Profile |
|----------|---------|---------|
| ![Feedback Screen](assets/screenshots/feedback.png) | ![Results Screen](assets/screenshots/results.png) | ![Profile Screen](assets/screenshots/profile.png) |

> Screenshots can be added by placing images in the `assets/screenshots/` folder and updating the paths above.

---

## Features

- Swipe-based Fact or Myth gameplay
- 6 knowledge categories — Nature, Science, Animals, Space, Photography, Technology
- Daily Challenge with a fresh mixed-fact round every day
- XP and unlimited level progression with streak bonuses
- 27 unlockable achievements across 8 categories including hidden secret achievements
- Explorer meter for category completion rewards
- Real-time statistics dashboard
- User profile with photo upload
- Category progress tracking with accuracy stats
- Continue where you left off
- Responsive cross-platform design (iOS and Android)
- Custom design system with reusable components

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile framework |
| Expo & Expo Router | Build tooling and file-based navigation |
| TypeScript | Type-safe development |
| Firebase Firestore | Real-time database and user data |
| Firebase Auth | User authentication |
| Firebase Storage | Profile photo uploads |
| React Native Gesture Handler | Swipe gesture recognition |
| Lucide React Native | Icon library |

---

## Project Structure

app/
(tabs)/ # Main tab screens (Home, Play, Profile, Stats, Settings)
game/ # Gameplay screens (category, daily, feedback, results)
services/ # Firebase config and stats logic
context/ # Shared UserContext for global state

components/
cards/ # Reusable card components
gameplay/ # In-game UI components
layout/ # Screen layout components
navigation/ # Bottom navigation
newcomps/ # Profile header components

constants/ # Design tokens (Colors, Typography, Spacing)
data/facts/ # Local JSON fact files used for seeding
documents/ # Project documentation


---

## Screens

| Screen | Description |
|---|---|
| Splash | App entry and branding |
| Login | User authentication |
| Register | New user registration |
| Home | Dashboard with daily challenge, continue card, and category grid |
| Play | Category selection with progress indicators |
| Gameplay | Swipe-based fact or myth question screen |
| Daily Challenge | Daily mixed-fact round, resets every 24 hours |
| Feedback | Per-question result with explanation and XP earned |
| Round Complete | End-of-round summary with score, accuracy, and XP progress |
| Profile | User stats, level, achievements, and photo |
| Statistics | Detailed performance breakdown |
| Settings | App preferences and account management |

---

## Gameplay Systems

### XP & Levelling
- 15 XP per correct answer
- Streak bonus XP — streak number × 10, capped at streak 9 (max 90 XP bonus)
- Unlimited levels using an exponential formula — each level requires roughly 1.8× the XP of the previous
- Daily Challenge awards +500 bonus XP on completion

### Achievements
27 unlockable achievements across 8 categories:
- **Streak** — First Spark, On Fire, Unstoppable, Legendary
- **Score** — Perfect Round, Sharp Mind, Flawless
- **Level** — First Steps, Rising Star, Fact Machine, Enlightened
- **Games** — Rookie, Dedicated, Veteran, Elite
- **Explorer** — Curious Mind, Explorer, Globetrotter, Completionist
- **Daily** — Daily Devotee, Consistent, Dedicated Scholar
- **Swipe** — Quick Draw, Swipe Master
- **Hidden** — secret achievements revealed only when earned

### Daily Challenge
- 5 random facts selected daily from a pool of 200 mixed-topic facts
- Same facts shown to the user all day regardless of when they play
- Can only be completed once per day
- Resets automatically at midnight

---

## Running the Project

Clone the repository:
```bash
git clone <repository-url>
```

Install dependencies:
```bash
npm install
```

Set up environment variables by creating a `.env` file in the root:

EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id


Start Expo:
```bash
npx expo start
```

Seed the database (first time setup):
```bash
npx ts-node scripts/seed.ts
```

---

## Documentation

Project documentation can be found inside the **documents/** folder. This includes:

- Project Proposal
- Wireframes
- Design System
- Database Design
- Planning Documents

---

## Acknowledgements

Special thanks to:
- **Tsungai Katsuro** — lecturer, for guidance and support throughout this project
- **Anthropic Claude** — AI assistant used during development for logic design, debugging, and implementation support
- **Expo** — for the React Native toolchain and development environment
- **Firebase** — for real-time database, authentication, and storage infrastructure
- **Lucide** — for the open-source icon library used throughout the UI

---

## 👨‍💻 Developer

**Francois le Roux**
Interactive Development Student
Open Window Institute
2026

---

## Demo

[Watch the demo video](https://drive.google.com/drive/folders/1cpskZdVN8eDnTDrasaUTKInUQez0y?usp=sharing)

---

## 📄 License

This project was developed for educational purposes as part of the Bachelor of Creative Technologies programme at The Open Window Institute.