# 🥄 Pudding mit Gabel

Eine Next.js-Webanwendung für das kontemporäre jugendliche Gen-Z Phänomen des "Puddings Mit Gabel Essen".

## 🌟 Features

- **Event-Management**: Erstelle und verwalte Pudding-mit-Gabel Events
- **CMS mit Authentifizierung**: Einfaches Login-System mit sicherer Authentifizierung
- **Benutzerregistrierung**: Registrierung als normaler Benutzer oder Organisator
- **Manuelle Event-Freigabe**: Events müssen von Admins manuell freigegeben werden
- **Kommentarsystem**: Kommentare mit automatischer Azure Content Moderation
- **Responsive Design**: Mit Mantine UI und TailwindCSS
- **Datenbank-Integration**: Prisma ORM für PostgreSQL

## 🛠 Tech Stack

- **Framework**: Next.js 15 mit App Router
- **UI-Bibliotheken**: 
  - Mantine UI Components
  - TailwindCSS
- **Authentifizierung**: NextAuth.js
- **Datenbank**: 
  - Prisma ORM
  - PostgreSQL
- **Content Moderation**: Azure Cognitive Services Content Moderator
- **Sprache**: TypeScript

## 📋 Voraussetzungen

- Node.js 18+ 
- PostgreSQL Datenbank
- Azure Content Moderator Account (optional für Development)

## 🚀 Installation

1. **Repository klonen:**
```bash
git clone https://github.com/Mic-R/puddingmitgabel.git
cd puddingmitgabel
```

2. **Dependencies installieren:**
```bash
npm install
```

3. **Umgebungsvariablen einrichten:**
```bash
cp .env.example .env
```

Bearbeite `.env` und füge deine Credentials ein:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/puddingmitgabel?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
AZURE_CONTENT_MODERATOR_KEY="your-azure-key"
AZURE_CONTENT_MODERATOR_ENDPOINT="https://your-region.api.cognitive.microsoft.com/"
```

4. **Datenbank einrichten:**
```bash
# Prisma migrations ausführen
npx prisma generate
npx prisma db push

# Optional: Seed-Daten hinzufügen
# npx prisma db seed
```

5. **Development Server starten:**
```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar.

## 📁 Projektstruktur

```
puddingmitgabel/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth Authentifizierung
│   │   ├── events/       # Event-Management
│   │   ├── comments/     # Kommentar-System
│   │   └── register/     # Benutzerregistrierung
│   ├── auth/             # Auth-Seiten (Login, Register)
│   ├── events/           # Event-Seiten
│   ├── cms/              # CMS Dashboard
│   └── page.tsx          # Startseite
├── components/           # React Komponenten
├── lib/
│   ├── auth/             # Auth-Konfiguration
│   ├── prisma.ts         # Prisma Client
│   └── contentModerator.ts # Azure Content Moderator
├── prisma/
│   └── schema.prisma     # Datenbankschema
└── public/               # Statische Assets
```

## 🔐 Benutzerrollen

- **USER**: Kann Events ansehen und Kommentare schreiben
- **ORGANIZER**: Kann zusätzlich Events erstellen
- **ADMIN**: Kann Events freigeben/ablehnen und alle CMS-Funktionen nutzen

## 📝 Verwendung

### Als Benutzer

1. Registriere dich unter `/auth/register`
2. Melde dich unter `/auth/signin` an
3. Browse Events unter `/events`
4. Kommentiere Events

### Als Organisator

1. Registriere dich als Organisator (Checkbox bei der Registrierung)
2. Erstelle Events unter `/events/create`
3. Events werden zur manuellen Freigabe eingereicht

### Als Admin

1. Zugriff auf CMS unter `/cms`
2. Wartende Events freigeben oder ablehnen
3. Alle Events verwalten

### Ersten Admin erstellen

Da der erste Benutzer standardmäßig als USER registriert wird, musst du manuell einen Admin in der Datenbank erstellen:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 🧪 Content Moderation

Kommentare werden automatisch durch Azure Content Moderator geprüft:
- Genehmigte Kommentare werden sofort angezeigt
- Abgelehnte Kommentare werden nicht veröffentlicht
- Ohne Azure-Konfiguration werden Kommentare automatisch genehmigt (Development)

## 🔧 Entwicklung

```bash
# Development Server starten
npm run dev

# Production Build
npm run build
npm start

# Prisma Studio (Database GUI)
npx prisma studio

# TypeScript Type Check
npx tsc --noEmit
```

## 🌐 Deployment

### Vercel (Empfohlen)

1. Push zu GitHub
2. Verbinde Repository mit Vercel
3. Setze Umgebungsvariablen
4. Deploy!

### Andere Plattformen

Die App kann auf jeder Plattform deployed werden, die Next.js unterstützt (Netlify, Railway, etc.)

Wichtig:
- PostgreSQL Datenbank bereitstellen
- Umgebungsvariablen setzen
- `npm run build` ausführen

## 📄 Lizenz

MIT

## 👥 Beiträge

Beiträge sind willkommen! Bitte erstelle einen Pull Request.

## 📞 Support

Bei Fragen oder Problemen, erstelle bitte ein Issue im GitHub Repository.

---

**Viel Spaß beim Pudding-mit-Gabel-Essen! 🥄🍮**
