# NutriDrive — CLAUDE.md

Smart grocery drive app for sport & nutrition. Users pick recipes → macros are auto-tracked + ingredients auto-added to cart.

---

## Stack

| Layer | Tech |
|---|---|
| Backend API | NestJS 10 + Prisma ORM + PostgreSQL |
| Web app | Next.js 14 (App Router) + Tailwind CSS |
| Mobile app | React Native + Expo SDK 50 — **cible principale iOS** |
| Auth | JWT (passport-jwt) |
| State | Zustand (web) |
| DB local | Postgres.app (macOS) — `127.0.0.1:5432` |

## Dossiers

```
/
├── backend/          NestJS API (port 3001)
├── web/              Next.js web app (port 3000)
└── mobile/           React Native / Expo (port 8081)
```

## Lancer les serveurs

Node via nvm — `~/.nvm/versions/node/v20.20.2/`

```bash
# Backend
cd backend && npm run start:dev

# Web
cd web && npm run dev

# Mobile (iOS)
cd mobile && npx expo start --ios
```

Les scripts `.claude/start-*.sh` configurent nvm automatiquement.

## Mobile — iOS en priorité

- Cible principale : **iPhone (iOS)**
- Tester avec **Expo Go** ou simulateur Xcode
- Navigation : `@react-navigation/bottom-tabs` (5 onglets)
- Pas de `StyleSheet` inline — utiliser des constantes de style ou NativeWind si ajouté
- Images : `expo-image` ou `Image` de React Native
- Stockage token : `expo-secure-store`

## Backend

- **Auth** : `POST /api/auth/register`, `POST /api/auth/login` → retourne `{ user, token }`
- **Profile** : `POST /api/user/profile` — crée le profil nutritionnel
- **Recommandations** : `GET /api/nutrition/recommendations?mealType=LUNCH`
- **Panier** : `POST /api/shopping/add-recipe/:id`
- **Log repas** : `POST /api/nutrition/log`
- Toutes les routes protégées requièrent `Authorization: Bearer <token>`

### Algorithme nutritionnel

- BMR : Mifflin-St Jeor
- TDEE = BMR × activité
- Objectif : FAT_LOSS −20% / MUSCLE_GAIN +15% / MAINTAIN 0%
- Macros : protéines prioritaires selon poids (2g/kg muscle, 1.6g/kg perte)
- Score recette : proximité macro pondérée (calories 30%, protéines 40%, glucides 15%, lipides 15%)

## Web

- Tailwind custom color : `brand` (vert — `brand-500 = #22c55e`)
- Classes utilitaires globales : `.card`, `.btn-primary`, `.btn-secondary`, `.input`
- Pas d'emoji décoratif dans la nav, les tabs ou les filtres
- Border-radius : `rounded-xl` pour les cards, `rounded-lg` pour les boutons
- Palette : gris + orange pour les calories + brand-500 pour les CTAs uniquement

## Base de données

- 10 recettes seedées avec photos Unsplash + macros complets
- 27 ingrédients avec nutrition/100g
- Migration active : `20260414113621_add_household_kitchen_preferences`

```bash
# Reseed
cd backend && npx ts-node prisma/seed.ts
# Migration
cd backend && npx prisma migrate dev
```

## Conventions

- TypeScript strict partout
- Pas de `any` sauf `data` en attente d'une réponse API inconnue
- Composants React : arrow functions exportées nommées
- Pas de `console.log` en production
- Commits en français ou anglais, pas de mélange dans un même fichier
