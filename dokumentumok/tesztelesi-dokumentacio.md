# Tesztelési dokumentáció – HirdetésFeladó Webalkalmazás

## 1. Cél és hatókör
A dokumentum célja, hogy összefoglalja a projektben jelenleg elérhető automatizált teszteket és azok futtatásának módját.

A tesztelés két fő területre épül:
- **API (backend) endpoint tesztek**: VS Code REST Client kérések (`HIR_backend/tests/*.rest`).
- **UI tesztek**: Katalon alapú UI tesztek/exportált riportok PDF formátumban (`dokumentumok/katalonTesztek/*.pdf`).

Megjegyzés: a repo-ban jelenleg **REST Client request gyűjtemények** és **Katalon PDF exportok** találhatók. A Katalon tesztek újrafuttatásához jellemzően a Katalon projekt (test case-ek, object repository stb.) is szükséges; ez ebben a workspace-ben nem látható.

## 2. Tesztkörnyezet és előfeltételek

### 2.1 Backend (Node.js + MySQL)
Előfeltételek:
- Node.js telepítve.
- MySQL elérhető (host/port/user adatokat a backend `.env`-je adja meg).
- A backend konfiguráció a `HIR_backend/.env` fájlból olvas (pl. `PORT`, DB adatok, token secret, SMTP opciók).

Indítás (fejlesztői mód):
1. `cd HIR_backend`
2. `npm install`
3. `npm run dev`

A REST tesztek jelenleg `http://localhost:3000` base URL-t használnak (a `.env` alapján a `PORT=3000`).

### 2.2 Frontend (Angular)
A Katalon UI tesztek futtatásához általában szükséges, hogy a frontend is elérhető legyen (és a backend is fusson).

Indítás:
1. `cd HIR_frontend`
2. `npm install`
3. `npm start`

## 3. Automatizált API tesztek (VS Code REST Client)

### 3.1 Eszköz
A `.rest` fájlok a **VS Code REST Client** bővítmény formátumát követik.
- Javasolt bővítmény: „REST Client” (VS Code Marketplace)

### 3.2 Futtatás lépései
1. Indítsd el a backendet (`npm run dev`).
2. Nyisd meg a kívánt `.rest` fájlt a `HIR_backend/tests/` mappából.
3. A REST Client-ben kattints a kérés feletti **Send Request** gombra.
4. Ellenőrizd a választ (HTTP státusz, JSON body).

### 3.3 Tesztadat-függőségek és paraméterezés
A `.rest` tesztek több helyen **hardcode-olt azonosítókat** (UUID-kat) és/vagy **Bearer tokent** használnak. Emiatt:
- Előfordulhat, hogy egyes kérések csak akkor sikeresek, ha az adott rekordok valóban léteznek az adatbázisban.
- Az `Authorization: Bearer ...` érték idővel lejárhat vagy környezetfüggő lehet.

Ajánlás a futtatáshoz:
- A dokumentációban a tokeneket/secret-eket **nem** érdemes bemásolni; használj helyette `Bearer <TOKEN>` jelölést.
- Ha egy `GET/PATCH/DELETE` kérés 404-et ad, előbb futtasd le a megfelelő `POST` létrehozó kérést, vagy cseréld ki az ID-t egy létező értékre.

### 3.4 Lefedettség – `.rest` fájlok és végpontok

**`HIR_backend/tests/adverts.rest`**
- `GET /adverts/` – összes hirdetés
- `GET /adverts/{id}` – hirdetés lekérdezése
- `POST /adverts/` – hirdetés létrehozása
- `PATCH /adverts/{id}` – hirdetés módosítása
- `DELETE /adverts/{id}` – hirdetés törlése

**`HIR_backend/tests/users.rest`**
- `GET /users/` – felhasználók listázása (Authorization fejléc szerepel a fájlban)
- `GET /users/{id}` – felhasználó lekérdezése (Authorization fejléc szerepel a fájlban)
- `POST /users/register` – regisztráció
- `POST /users/login/` – belépés
- `PATCH /users/{id}` – felhasználó módosítása (a fájlban csak jelszó mező példával)
- `DELETE /users/{id}` – felhasználó törlése (Authorization fejléc szerepel a fájlban)
- `GET /users/userId/eq/` – **félbehagyott/incomplete** kérés (a fájl végén paraméter nélkül)

**`HIR_backend/tests/payment.rest`**
- `GET /payments` – fizetési módok listája
- `POST /payments` – új fizetési mód létrehozása
- `DELETE /payments/{id}` – fizetési mód törlése

**`HIR_backend/tests/category.rest`**
- `GET /categories` – kategóriák listája
- `GET /categories/{id}` – kategória lekérdezése
- `POST /categories` – új kategória
- `PATCH /categories/{id}` – kategória módosítása
- `DELETE /categories/{id}` – kategória törlése

**`HIR_backend/tests/condition.rest`**
- `POST /conditions` – állapot (condition) létrehozása

**`HIR_backend/tests/images.rest`**
- `POST /images` – kép létrehozása
- `GET /images` – képek listája
- `GET /images/{id}` – kép lekérdezése
- `PATCH /images/{id}` – kép módosítása
- `DELETE /images/{id}` – kép törlése

**`HIR_backend/tests/support.rest`**
- `POST /support` – support ticket létrehozása

**`HIR_backend/tests/wishlists.rest`**
- A fájl jelenleg **üres** (nincs benne kérés).

**`HIR_backend/tests/countries.rest`**
- A repo-ban van `.rest` fájl, viszont a backend route-ok között jelenleg nem látszik `/countries` útvonal.
- Következmény: ez a tesztfájl valószínűleg **elavult**, vagy hiányzik a kapcsolódó route implementáció.

## 4. Automatizált UI tesztek (Katalon) – PDF exportok

### 4.1 Elérhető tesztanyagok
A Katalon UI tesztek/riportok PDF exportként itt találhatók:
- `dokumentumok/katalonTesztek/20260423_164424.pdf`
- `dokumentumok/katalonTesztek/20260423_174821.pdf`
- `dokumentumok/katalonTesztek/20260426_121942.pdf`
- `dokumentumok/katalonTesztek/20260427_092711.pdf`

### 4.2 Futtatás
Ebben a workspace-ben jelenleg a Katalon tesztek **futtatható projektje** nem látható (csak PDF exportok vannak), ezért a futtatás pontos lépései a Katalon projekt elhelyezkedésétől függnek.

Általános futtatási feltételek (ha a Katalon projekt elérhető):
- Backend fusson (`http://localhost:3000`).
- Frontend fusson (Katalon által beállított base URL-en).
- Katalon Studio telepítve, a megfelelő böngésző driver-ekkel.

## 5. Riportálás és naplók
Ajánlott, hogy hiba esetén az alábbiakat rögzítsétek:
- Teszt típusa: API (.rest) / UI (Katalon)
- Reprodukció lépései
- Elvárt eredmény vs. tényleges eredmény
- API esetén: teljes request (URL, body) és response (status, body)
- Backend log kivonat (terminál)

## 6. Ismert hiányosságok / karbantartási pontok
- Több `.rest` kérés fix ID-kat használ → környezetfüggő, gyakran kézi módosítást igényel.
- `HIR_backend/tests/countries.rest` valószínűleg nincs összhangban a jelenlegi backend route-okkal.
- `HIR_backend/tests/wishlists.rest` üres.
- `HIR_backend/tests/users.rest` végén van egy befejezetlen request (`/users/userId/eq/`).
