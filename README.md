# NutriDrive - Drive intelligent sport & nutrition

Application mobile et web de "drive intelligent pour les courses" orientée sport et nutrition.
L'utilisateur choisit des recettes adaptées à ses objectifs → les courses sont générées automatiquement.

## Architecture

```
├── backend/          # API NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── auth/          # Authentification JWT
│   │   ├── user/          # Profil utilisateur & onboarding
│   │   ├── nutrition/     # Moteur de calcul nutritionnel
│   │   ├── recipes/       # Moteur de recettes & recommandations
│   │   ├── shopping/      # Panier & intégration drive
│   │   └── tracking/      # Suivi nutritionnel
│   └── prisma/            # Schéma DB & seed
├── web/              # Frontend Next.js (App Router + Tailwind)
└── mobile/           # App React Native (Expo)
```

## Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

## Setup rapide

### 1. Base de données

```bash
# Créer la base PostgreSQL
createdb nutridrive

# Ou avec Docker
docker run -d --name nutridrive-db \
  -e POSTGRES_DB=nutridrive \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres:16
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # Configurer DATABASE_URL et JWT_SECRET
npm install
npx prisma generate           # Générer le client Prisma
npx prisma migrate dev --name init  # Créer les tables
npm run prisma:seed            # Peupler avec 10 recettes exemple
npm run start:dev              # Démarrer sur http://localhost:3001
```

API docs Swagger : http://localhost:3001/api/docs

### 3. Web (Next.js)

```bash
cd web
npm install
npm run dev                    # Démarrer sur http://localhost:3000
```

### 4. Mobile (React Native / Expo)

```bash
cd mobile
npm install
npx expo start                 # Scanner le QR code avec Expo Go
```

## API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |

### User Profile
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/user/me` | Mon profil complet |
| GET | `/api/user/profile` | Profil nutritionnel |
| POST | `/api/user/profile` | Créer/modifier profil (onboarding) |

### Recipes
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/recipes` | Lister (filtres: search, tags, maxPrepTime, difficulty, nutriScore) |
| GET | `/api/recipes/recommendations` | Recettes recommandées selon macros restantes |
| GET | `/api/recipes/favorites` | Mes favoris |
| GET | `/api/recipes/:id` | Détail recette |
| POST | `/api/recipes/:id/favorite` | Toggle favori |

### Shopping
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/shopping` | Liste de courses active |
| POST | `/api/shopping/add-recipe/:recipeId` | Ajouter recette au panier |
| POST | `/api/shopping/toggle/:itemId` | Cocher/décocher article |
| DELETE | `/api/shopping/item/:itemId` | Supprimer article |
| DELETE | `/api/shopping/clear` | Vider la liste |
| GET | `/api/shopping/drive-cart` | Générer panier drive |

### Tracking
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/tracking/log` | Logger un repas |
| DELETE | `/api/tracking/log/:logId` | Supprimer un log |
| GET | `/api/tracking/daily` | Dashboard journalier |
| GET | `/api/tracking/weekly` | Dashboard hebdomadaire |

## Algorithmes

### Calcul BMR (Mifflin-St Jeor)
- Homme: `(10 × poids) + (6.25 × taille) − (5 × âge) + 5`
- Femme: `(10 × poids) + (6.25 × taille) − (5 × âge) − 161`

### TDEE (Total Daily Energy Expenditure)
`TDEE = BMR × multiplicateur d'activité`

| Niveau | Multiplicateur |
|--------|---------------|
| Sédentaire | 1.2 |
| Légèrement actif | 1.375 |
| Actif | 1.55 |
| Très actif | 1.725 |
| Athlète | 1.9 |

### Ajustements
- **Objectif** : Perte -20%, Prise +15%, Maintien 0%
- **Morphologie** : Ecto +5%, Endo -5%
- **Cycle menstruel** : Phase lutéale +7%

### Répartition macros
| Objectif | Protéines/kg | Lipides | Glucides |
|----------|-------------|---------|----------|
| Perte de gras | 2.2g | 25% | Reste |
| Prise de masse | 2.0g | 25% | Reste |
| Maintien | 1.6g | 30% | Reste |

### Matching recettes
Score = pondération (calories 30%, protéines 40%, glucides 15%, lipides 15%) de la proximité entre macros de la recette et macros restantes.

## Schéma de base de données

```
Users ──→ UserProfile ──→ DietaryConstraints
  │              
  ├──→ MealLogs ──→ Recipes
  │                    │
  ├──→ ShoppingLists   ├──→ RecipeIngredients ──→ Ingredients
  │       │            │                              │
  │       └──→ ShoppingItems ─��→ DriveProducts ───────┘
  │
  └──→ UserFavoriteRecipes ──→ Recipes
```

## Seed

10 recettes incluses : poulet/riz/brocoli, poke bowl saumon, overnight oats, salade quinoa/tofu, bolognaise, omelette épinards, bowl patate douce/thon, smoothie bowl, wok poulet, caprese protéinée.

26 ingrédients avec valeurs nutritionnelles complètes.

## Stack technique

- **Frontend** : Next.js 14 (web) + React Native / Expo (mobile)
- **Backend** : NestJS + Prisma ORM
- **BDD** : PostgreSQL
- **Auth** : JWT (passport-jwt)
- **Style** : Tailwind CSS (web), StyleSheet (mobile)
- **State** : Zustand
- **Docs** : Swagger/OpenAPI auto-générée

## Hébergement recommandé

- **Web** : Vercel
- **API** : AWS (EC2/ECS) ou Railway
- **BDD** : AWS RDS ou Supabase
- **Mobile** : App Store / Google Play via EAS Build
