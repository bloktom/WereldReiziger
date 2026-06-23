# 🌍 Floor vs Tom — De Grote Reisstrijd

Een speelse, persoonlijke **reis-race** tussen Floor en Tom. Vink op een grote
interactieve wereldkaart de landen af waar je geweest bent, claim territorium en
strijd om gedeelde landen via de **landenbattle**.

- 🟤 **Floor** speelt in **beige** — de officiële kleur van haar twijfelachtige muur.
- 🔵 **Tom** speelt in **blauw** — omdat iemand hier tenminste smaak heeft.

De app is een **statische React-app** (Vite) die lokaal draait én gepubliceerd kan
worden via **GitHub Pages**. Gedeelde data loopt via **Firebase Firestore**, zodat
Floor en Tom dezelfde landen en scores zien. Zonder Firebase draait de app
automatisch in een **demo-modus** (lokale mock data), zodat je meteen kunt testen.

---

## ✨ Functionaliteiten

- **Speler kiezen** (Floor of Tom), onthouden in `localStorage`, wisselen via Instellingen.
- **Grote interactieve wereldkaart** met alle landen, klikbaar, hover-tooltip en zoom.
  - Beige = Floor, blauw = Tom, gestreept = allebei, 👑 = gewonnen via battle.
- **Scorebalk** bovenin: Floor vs Tom, wie staat voor, hoeveel gedeeld, met speelse teksten.
- **Landdetailpaneel**: status, datum, notitie, herinnering, afbeelding-URL, markeren/verwijderen.
- **Speelse Floor/Tom-teksten** bij het aanvinken (inclusief de windsurf-grap voor kustlanden).
- **Landenbattle** voor landen die beiden bezochten, met puntensysteem en winnaar.
- **Scorebord / overzicht**, **Battles**, **Herinneringen** (filterbaar) en **Instellingen**.
- **Realtime updates** via Firestore `onSnapshot` (in Firebase-modus).
- **Responsive** voor desktop én telefoon.

---

## 🚀 Lokaal draaien

Vereist [Node.js](https://nodejs.org/) **20.19+ of 22.12+** (nodig voor Vite 8).

```bash
npm install
npm run dev
```

Open daarna de URL die Vite toont (meestal `http://localhost:5173`).

> Zonder Firebase-configuratie draait de app meteen in **demo-modus** met
> voorbeelddata. Perfect om alles uit te proberen.

Productie-build maken en lokaal bekijken:

```bash
npm run build
npm run preview
```

---

## 🔥 Firebase instellen (gedeelde online opslag)

Zodat Floor en Tom **elkaars** landen zien, koppel je een gratis Firebase-project.

1. Ga naar de [Firebase Console](https://console.firebase.google.com/) en maak een
   **nieuw project** (analytics mag uit).
2. Klik in het project op het **web-icoon** `</>` om een **web-app** te registreren.
   Geef een naam op (bv. "reisrace") en kopieer de getoonde **config-waarden**.
3. Open links **Build → Firestore Database → Create database**.
   - Kies een locatie (bv. `eur3` / Europa).
   - Start in **Production mode** of **Test mode** (zie regels hieronder).
4. Maak in de projectmap een bestand **`.env`** aan (kopie van `.env.example`) en
   vul je waarden in:

   ```dotenv
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

5. Start de app opnieuw (`npm run dev`). In **Instellingen** zie je nu
   "✅ Verbonden met Firebase".

### Firestore-beveiligingsregels

Voor deze privé-app zonder login is open lezen/schrijven het simpelst. Plak dit
onder **Firestore → Rules** (let op: iedereen met de link kan dan schrijven —
prima voor een privé-linkje, niet voor gevoelige data):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /visitedCountries/{doc} {
      allow read, write: if true;
    }
    match /countryBattles/{doc} {
      allow read, write: if true;
    }
  }
}
```

> Wil je het later dichttimmeren? Voeg dan Firebase Authentication toe (zie
> "Later uitbreiden" onderaan) en vervang `if true` door `if request.auth != null`.

### Datastructuur

**Collection `visitedCountries`** — document-id: `player_countryCode` (bv. `Floor_528`)

| veld | type | omschrijving |
| --- | --- | --- |
| `player` | string | `Floor` of `Tom` |
| `countryCode` | string | numerieke ISO-code (bv. `528`) |
| `countryName` | string | landnaam |
| `visited` | bool | bezocht? |
| `note` | string | notitie |
| `memory` | string | favoriete herinnering |
| `visitDate` | string | datum van bezoek |
| `imageUrl` | string | optionele afbeelding-URL |
| `createdAt` | timestamp | toegevoegd op |
| `updatedAt` | timestamp | laatst bijgewerkt |

**Collection `countryBattles`** — document-id: `countryCode`

| veld | type | omschrijving |
| --- | --- | --- |
| `countryCode` | string | numerieke ISO-code |
| `countryName` | string | landnaam |
| `floorAnswers` | map | Floor's battle-antwoorden |
| `tomAnswers` | map | Tom's battle-antwoorden |
| `floorScore` | number | berekende score Floor |
| `tomScore` | number | berekende score Tom |
| `winner` | string | `Floor`, `Tom` of `Tie` |
| `updatedAt` | timestamp | laatst bijgewerkt |

---

## 🌐 Publiceren op GitHub Pages

De `base`-path is in `vite.config.js` standaard `'/WereldReiziger/'`. **Heet je
repo anders, pas dit dan aan** (of laat de GitHub Action het automatisch doen —
die vult `VITE_BASE` met je repo-naam).

### Optie A — Automatisch via GitHub Actions (aanbevolen)

1. Push je code naar een GitHub-repository (branch `main`).
2. Ga in GitHub naar **Settings → Pages** en zet **Source** op **GitHub Actions**.
3. (Optioneel, voor gedeelde data) zet je Firebase-waarden als **secrets** onder
   **Settings → Secrets and variables → Actions → New repository secret**:
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
   `VITE_FIREBASE_APP_ID`.
4. Elke push naar `main` bouwt en publiceert nu automatisch
   (zie `.github/workflows/deploy.yml`). De live-URL verschijnt in de Action en
   onder **Settings → Pages**, meestal:
   `https://<jouw-gebruikersnaam>.github.io/<repo-naam>/`

### Optie B — Handmatig met het `gh-pages`-pakket

```bash
npm run deploy
```

Dit bouwt de app en pusht de `dist`-map naar de `gh-pages`-branch. Zet daarna in
**Settings → Pages** de **Source** op branch `gh-pages` (map `/root`).

> Let op: bij optie B worden je `.env`-waarden in de gebouwde bestanden opgenomen.
> Voor een privé-linkje is dat acceptabel; gebruik anders optie A met secrets.

---

## 💌 Hoe Floor de link opent

1. Tom deelt de GitHub Pages-link (bv. `https://tom.github.io/WereldReiziger/`).
2. Floor opent de link en kiest **"Floor"**.
3. Floor ziet meteen Tom's landen (mits Firebase is gekoppeld) en vinkt haar eigen
   landen aan. De score loopt automatisch bij — voor allebei, realtime.

---

## 🗂️ Projectstructuur

```
src/
  main.jsx                      # entrypoint
  App.jsx                       # app-shell, routing tussen views
  firebase.js                   # Firebase init + demo-mode detectie
  data/
    countryMetadata.js          # kustlanden, vlaggen, featured landen
    funnyMessages.js            # speelse teksten Floor/Tom
    mockData.js                 # demo/seed data
  hooks/
    useTravelData.js            # Firestore <-> mock data, realtime
  utils/
    constants.js                # spelers, kleuren, keys, views
    countryStatus.js            # status & tellingen per land
    scoring.js                  # battle-puntensysteem
    format.js                   # datum-helper
  components/
    PlayerSelect.jsx            # wie ben jij?
    HeaderScore.jsx             # scorebalk bovenin
    NavMenu.jsx                 # hoofdmenu
    WorldMap.jsx                # interactieve wereldkaart
    CountryDetailPanel.jsx      # detailpaneel per land
    BattleForm.jsx              # landenbattle
    Scoreboard.jsx              # overzichtspagina
    Battles.jsx                 # battles-overzicht
    Memories.jsx                # herinneringen
    Settings.jsx                # instellingen
    Toast.jsx                   # feedback-meldingen
  styles/
    global.css                  # alle styling
```

---

## 🖼️ Later uitbreiden: afbeeldingen via Firebase Storage

Nu kun je een **afbeelding-URL** invullen (bv. een link naar een foto). Wil je echt
uploaden vanaf je telefoon, voeg dan Firebase Storage toe:

1. Zet **Storage** aan in de Firebase Console.
2. Installeer niets extra's nodig — `firebase` bevat al `firebase/storage`.
3. Maak een upload-helper:

   ```js
   import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
   import { app } from './firebase'

   const storage = getStorage(app)
   export async function uploadCountryImage(file, player, code) {
     const r = ref(storage, `countries/${player}_${code}_${Date.now()}`)
     await uploadBytes(r, file)
     return getDownloadURL(r)
   }
   ```

4. Roep dit aan in `CountryDetailPanel.jsx` bij een `<input type="file">` en sla de
   teruggegeven URL op in het bestaande `imageUrl`-veld.

## 🔐 Later uitbreiden: login

De code kiest nu simpelweg Floor of Tom. Wil je echte accounts? Voeg
**Firebase Authentication** toe (bv. Google of e-maillink), gebruik de ingelogde
gebruiker om de speler te bepalen en scherp de Firestore-regels aan met
`request.auth`.

---

## 🧰 Scripts

| Commando | Doet |
| --- | --- |
| `npm install` | dependencies installeren |
| `npm run dev` | lokale dev-server |
| `npm run build` | productie-build in `dist/` |
| `npm run preview` | gebouwde app lokaal bekijken |
| `npm run deploy` | bouwen + naar `gh-pages`-branch pushen |

Veel plezier, en moge de beste reiziger winnen. 🌍✈️

