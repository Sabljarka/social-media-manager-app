# Social Media Manager

Aplikacija za upravljanje socijalnim mrežama (Facebook, Instagram, TikTok, YouTube) sa jednog mesta.

## Funkcionalnosti

- Upravljanje korisnicima i rolama
- Integracija sa više socijalnih mreža
- Upravljanje fan page stranicama
- Direktne poruke
- Upravljanje komentarima
- Upravljanje objavama

## Tehnologije

- Backend: Node.js, Express.js, MongoDB
- Frontend: React.js, Redux, Material-UI, Vite
- Autentifikacija: JWT
- API integracije: Facebook Graph API, Instagram Graph API, TikTok API, YouTube API

## Instalacija

1. Klonirajte repozitorijum:
```bash
git clone https://github.com/Sabljarka/social-media-manager-app.git
cd social-media-manager
```

2. Instalirajte zavisnosti za backend:
```bash
cd backend
npm install
```

3. Instalirajte zavisnosti za frontend:
```bash
cd ../frontend
npm install
```

4. Konfigurirajte .env fajlove:
- Kopirajte `.env.example` u `.env` u backend direktorijumu
- Popunite potrebne API ključeve i tajne

5. Pokrenite MongoDB:
```bash
mongod
```

6. Pokrenite backend:
```bash
cd backend
npm start
```

7. Pokrenite frontend:
```bash
cd frontend
npm start
```

## Development Setup

This project uses Vite for frontend development. Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## API Endpoints

### Autentifikacija
- POST /api/auth/register - Registracija novog korisnika
- POST /api/auth/login - Prijava korisnika
- GET /api/auth/me - Dohvatanje trenutnog korisnika

### Korisnici
- GET /api/users - Dohvatanje svih korisnika (admin only)
- GET /api/users/:id - Dohvatanje korisnika po ID-u
- PUT /api/users/:id - Ažuriranje korisnika
- DELETE /api/users/:id - Brisanje korisnika
- PUT /api/users/:id/permissions - Ažuriranje dozvola korisnika

### Socijalne mreže
- GET /api/social/accounts - Dohvatanje svih socijalnih naloga
- POST /api/social/accounts - Dodavanje novog socijalnog naloga
- PUT /api/social/accounts/:id - Ažuriranje socijalnog naloga
- DELETE /api/social/accounts/:id - Brisanje socijalnog naloga

## Licenca

MIT
