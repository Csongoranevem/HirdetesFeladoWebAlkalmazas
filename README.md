# HirdetesFeladoWeboldal

használt modulok és keretrendszerek backendhez:
- node.js
- express
- cors
- path
- logger
- mysql2
- sequelize

frontendhez:
- angular 18.0.2
- bootstrap
- bootstrap-icons


Rövid útmutató a teszteléshez

Az oldal elindításához szükséges modulok és keretrendszerek feljebb olvahatók, ahol fontos, verziószámmal
- Backend (Node.js + MySQL)
  Előfeltételek:
  - Node.js telepítve.
  - MySQL elérhető (host/port/user adatokat a backend `.env`-je adja meg).
  - A backend konfiguráció a `HIR_backend/.env` fájlból olvas (pl. `PORT`, DB adatok, token secret, SMTP opciók).

  Indítás (fejlesztői mód):
  1. `cd HIR_backend`
  2. `npm install`
  3. `npm run dev`

A REST tesztek jelenleg `http://localhost:3000` base URL-t használnak (a `.env` alapján a `PORT=3000`).

- Frontend (Angular)
  A Katalon UI tesztek futtatásához általában szükséges, hogy a frontend is elérhető legyen (és a backend is fusson).
  
  Indítás:
  1. `cd HIR_frontend`
  2. `npm install`
  3. `npm start`



- 3 felhasználó van a dump adatok között, ebből egy admin és 2 sima felhasználó
- mindegyik felhasználónak meg van adva minden adata
- Az összes fiókhoz ugyanaz a jelszó, ez kizárólag a tesztelés könnyítése miatt van (Jelszó: Abcd1234)
- Felhazsnálók:
  - John Doe, johndoe@gmail.com
  - janedoe.1, janedoe@gmail.com
- Admin fiók:
  - admin, admin@wanted.hu
- 
