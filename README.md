# MonoFact
### *Learn the truth, one swipe at a time.*

MonoFact is a cross-platform educational mobile app that challenges users to separate fact from fiction. Swipe **right** for Fact, swipe **left** for Myth — then get instant feedback, earn XP, and track how your knowledge grows across different categories.

---
## Preview
![MonoFact app screens](assets/monofact-preview.png)
---

## Table of Contents

1. [What Is MonoFact?](#what-is-monofact)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Screens](#screens)
5. [Project Structure](#project-structure)
6. [Current Progress](#current-progress)
7. [Roadmap](#roadmap)
8. [Documentation](#documentation)
9. [Demo Video](#demo-video)
10. [License & Acknowledgements](#license--acknowledgements)

---

## What Is MonoFact?

The internet is full of misinformation. MonoFact makes it fun to fight back — one card at a time.

Users are presented with short statements and must classify them as a **Fact** or a **Myth** using swipe gestures. After each swipe, an explanation is shown so every right *or* wrong answer becomes a learning moment. Categories range from Science and Nature to Animals and Space, with XP, streaks, and statistics to keep progress meaningful.

**Core features include:**
- Swipe-based Fact or Myth gameplay
- Immediate feedback with educational explanations
- Multiple knowledge categories
- XP system and level progression
- Statistics dashboard with accuracy by category
- User profile and achievement tracking
- Settings screen
- Responsive cross-platform design
- Custom design system with reusable components

---

## Tech Stack

| Technology | Role |
|---|---|
| React Native | Cross-platform mobile framework |
| Expo / Expo Router | Build tooling and file-based navigation |
| TypeScript | Type safety and code reliability |
| Firebase Authentication | Secure user login and registration |
| Cloud Firestore | NoSQL database for user data and facts |
| React Native Reanimated | Swipe animations |
| React Native Gesture Handler | Gesture recognition |
| Lucide React Native | Icon library |

---

## Getting Started

**Prerequisites**
- Node.js v18 or newer
- npm
- A Firebase project (Auth + Firestore enabled)
- Expo CLI and either Expo Go (physical device) or an Android/iOS emulator

**Installation**

Clone the repository:
```bash
git clone <repository-url>
cd MonoFact
```

Install dependencies:
```bash
npm install
```

Set up your Firebase config by creating a `.env` file in the project root:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Start the development server:
```bash
npx expo start
```

Scan the QR code with Expo Go, or launch an emulator from the terminal menu.

---

## Screens

| Screen | Description |
|---|---|
| Splash | Entry point with branding |
| Login | Returning user sign-in |
| Register | New account creation |
| Home | Category overview and quick-play |
| Play | Category selection |
| Gameplay | The core swipe experience |
| Feedback | Post-swipe explanation screen |
| Round Complete | Score summary and XP earned |
| Profile | User info and achievements |
| Statistics | Accuracy, streaks, and category breakdown |
| Settings | Account, preferences, and sign-out |

---

## Project Structure

```
app/
  (tabs)/          # Tab-based screens (Home, Play, Profile, Stats, Settings)
  game/            # Gameplay, Feedback, and Round Complete screens

components/
  cards/           # Swipeable fact cards
  gameplay/        # In-game UI elements
  layout/          # Shared layout wrappers
  navigation/      # Navigation components
  profile/         # Profile-specific components
  settings/        # Settings-specific components

constants/         # Design tokens, colours, typography
documents/         # Project documentation (see below)
```

---

## Current Progress

**Completed**
- Full UI redesign and custom design system
- File-based navigation with Expo Router
- Swipe gesture implementation
- Complete gameplay flow (card → feedback → round complete)
- Responsive layouts across screen sizes
- Reusable component library

**In Progress**
- Firebase Authentication
- Firestore database integration
- XP and level persistence
- User statistics saving
- Category progress tracking

---

## Roadmap

**Nice to Have**
- Daily Challenge mode
- Favourite Facts collection
- Achievement badges
- Difficulty levels
- Category search

**Future Considerations**
- Multiplayer / leaderboards
- Admin content dashboard
- AI-generated fact suggestions
- Push notifications
- Offline support

---

## Documentation

All project documentation lives in the `documents/` folder and includes:

- Project Proposal
- Wireframes
- Design System reference
- Database schema (ERD)
- Planning documents

---

## Demo Video

🎬 [Watch the demo](https://drive.google.com/drive/folders/1cpskZdVN8eDnTDrasaUTKInUQeUqCz0y?usp=sharing)

---

## License & Acknowledgements

This project was developed for educational purposes as part of the Interactive Development 300 module at **Open Window Institute**, 2026.

Special thanks to **Tsungai Katsuro** for their guidance and support throughout the project.

AI tools used during development: **Claude** and **ChatGPT**.

---

**Francois le Roux** — Interactive Development Student, Open Window Institute
