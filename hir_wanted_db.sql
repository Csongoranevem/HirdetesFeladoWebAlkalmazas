-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 28. 21:01
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `hir_wanted_db`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `adverts`
--

CREATE TABLE `adverts` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `price` double NOT NULL,
  `city_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `category_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `condition_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `status` varchar(15) NOT NULL,
  `date_of_upload` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `adverts`
--

INSERT INTO `adverts` (`id`, `user_id`, `name`, `description`, `price`, `city_id`, `product_id`, `payment_method`, `category_id`, `condition_id`, `status`, `date_of_upload`, `createdAt`, `updatedAt`) VALUES
('17a5c885-b1a4-456b-a86b-6a940bc8ce92', 'ece581e4-6e5a-4a36-ac26-044d3e3bf4d3', 'Samsung Galaxy J3 2016 mobiltelefon, 4/64GB memória', 'Eladó Samsung Galaxy J3 2016 mobiltelefon, 4/64GB memóriával és tárhellyel. Kiváló állapotban van, nem látszik rajta a közel 4 éves használat. Garancia sajnos már nincs rá.\n- 5,8\" kijelző\n- 60fps képfrissítési frekvencia\n- 4GB RAM\n- 64GB memória\n- Ezüst színű', 45000, 'Söréd', 'TElefon', 'ff1f3326-1472-4f0a-9756-0fdac83f4ef8', 'bff28250-d414-41a0-9386-731b12bf33db', '3ee8a318-2760-4eb7-991c-7484fd9136e0', 'active', NULL, '2026-04-28 18:45:18', '2026-04-28 18:45:18'),
('d86bc267-e792-4f2f-a13f-8a80771681b1', 'eac88799-1f6b-42b1-8b98-bff95d2db5bd', 'Kalapács jó minőségű', 'Eladó ez az új kalapács, kihasználatlanság miatt.', 7600, 'Söréd', 'TElefon', '60443d6f-b605-4d5b-84f5-c3e890f8e8f8', '1eedbc11-bd04-4f4b-b04f-4902f2e4a2c5', 'ce5ab433-91e5-446c-9c47-7c36e62c8a3b', 'active', NULL, '2026-04-28 18:34:04', '2026-04-28 18:34:04'),
('dad32085-d0ca-4cff-97d4-f51bf8fb212f', 'ece581e4-6e5a-4a36-ac26-044d3e3bf4d3', 'Amerikai focilabda eladó', 'Eladó ez az amerikai focilabda, közel 3 év használat után döntöttem úgy, hogy megválok tőle. Nincs esztétikai hibája, kiváló állapotban van', 4600, 'Söréd', 'TElefon', '60443d6f-b605-4d5b-84f5-c3e890f8e8f8', '127fa062-cc3b-4984-847b-638103f2d4db', '3253497b-56f6-4207-8b51-356ae21364d6', 'active', NULL, '2026-04-28 18:49:44', '2026-04-28 18:49:44');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
('127fa062-cc3b-4984-847b-638103f2d4db', 'Sport', '2026-04-28 18:22:54', '2026-04-28 18:22:54'),
('1e4a3810-85b6-4c78-8b37-8ccd53fd3d89', 'Egyéb', '2026-04-28 18:23:40', '2026-04-28 18:23:40'),
('1eedbc11-bd04-4f4b-b04f-4902f2e4a2c5', 'Szerszám', '2026-04-28 18:22:42', '2026-04-28 18:22:42'),
('355e67d2-e101-49c0-ab88-3db61ca533f2', 'Autó kiegészítők', '2026-04-28 18:25:45', '2026-04-28 18:25:45'),
('53ef5b70-6ad4-4a25-8029-c2c5f70d121f', 'Háztartás', '2026-04-28 18:23:09', '2026-04-28 18:23:09'),
('bff28250-d414-41a0-9386-731b12bf33db', 'Telefon', '2026-04-28 18:22:47', '2026-04-28 18:22:47'),
('c8b7fa9e-380f-4dcb-a0dd-667ff2b6bb42', 'Elektronika', '2026-04-28 18:23:01', '2026-04-28 18:23:01'),
('cc9f85f0-a149-47dc-a10a-4eff07146d94', 'Játék', '2026-04-28 18:23:31', '2026-04-28 18:23:31'),
('f742044f-1c6c-40af-bbb7-86867f727136', 'Kertészet', '2026-04-28 18:25:30', '2026-04-28 18:25:30');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cities`
--

CREATE TABLE `cities` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `id` tinyint(4) NOT NULL,
  `ad_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `comment` text NOT NULL,
  `user_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`id`, `ad_id`, `comment`, `user_id`, `createdAt`, `updatedAt`) VALUES
(1, 'd86bc267-e792-4f2f-a13f-8a80771681b1', 'Ismerem az eladót, nagyon kedves és megbízható', 'ece581e4-6e5a-4a36-ac26-044d3e3bf4d3', '2026-04-28 18:52:25', '2026-04-28 18:52:25'),
(2, 'd86bc267-e792-4f2f-a13f-8a80771681b1', 'Köszönöm a pozitív visszajelzést!', 'eac88799-1f6b-42b1-8b98-bff95d2db5bd', '2026-04-28 18:53:26', '2026-04-28 18:53:26'),
(3, '17a5c885-b1a4-456b-a86b-6a940bc8ce92', 'Nagyon jó telefonnak tűnik, lehet hogy érdeklődök majd iránta. Még keresgélek azért :)', 'a2bc09e2-444e-4c96-8caa-c7a1539c2c84', '2026-04-28 18:55:33', '2026-04-28 18:55:33');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `conditions`
--

CREATE TABLE `conditions` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `conditions`
--

INSERT INTO `conditions` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
('3253497b-56f6-4207-8b51-356ae21364d6', 'Jó állapotú', '2026-04-28 18:21:56', '2026-04-28 18:21:56'),
('3ee8a318-2760-4eb7-991c-7484fd9136e0', 'Használt', '2026-04-28 18:21:42', '2026-04-28 18:21:42'),
('ce5ab433-91e5-446c-9c47-7c36e62c8a3b', 'Bontatlan', '2026-04-28 18:21:48', '2026-04-28 18:21:48');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `images`
--

CREATE TABLE `images` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `advert_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `url` varchar(255) NOT NULL,
  `alt` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `images`
--

INSERT INTO `images` (`id`, `advert_id`, `url`, `alt`, `createdAt`, `updatedAt`) VALUES
('417921b4-898c-434a-8d22-d775cdd3dbe0', 'd86bc267-e792-4f2f-a13f-8a80771681b1', '/uploads/1777401244129-85376648.jpg', 'pexels-polina-tankilevitch-5583169.jpg', '2026-04-28 18:34:04', '2026-04-28 18:34:04'),
('4245081d-b031-435c-aa79-e27d123eebe2', 'dad32085-d0ca-4cff-97d4-f51bf8fb212f', '/uploads/1777402184545-796235239.jpg', 'pexels-jean-daniel-2570139.jpg', '2026-04-28 18:49:44', '2026-04-28 18:49:44'),
('44e0cdc5-e9ad-43bb-b616-9ea549427bb2', 'dad32085-d0ca-4cff-97d4-f51bf8fb212f', '/uploads/1777402184548-808851648.jpg', 'pexels-dorian-evans-2157080643-36573287.jpg', '2026-04-28 18:49:44', '2026-04-28 18:49:44'),
('4c22ed08-175f-4aff-8fee-c830ccc63f8b', '17a5c885-b1a4-456b-a86b-6a940bc8ce92', '/uploads/1777401918048-890450640.jpg', 'pexels-luckysam-47261.jpg', '2026-04-28 18:45:18', '2026-04-28 18:45:18'),
('607a3373-2bfe-442b-868b-b04e1ebd307f', 'dad32085-d0ca-4cff-97d4-f51bf8fb212f', '/uploads/1777402184543-389678379.jpg', 'pexels-nisarg-dave-202387205-11990039.jpg', '2026-04-28 18:49:44', '2026-04-28 18:49:44'),
('ac43f06e-ab0f-4947-ae05-fccc68cdb791', 'd86bc267-e792-4f2f-a13f-8a80771681b1', '/uploads/1777401244132-668370996.jpg', 'pexels-polina-tankilevitch-5583140.jpg', '2026-04-28 18:34:04', '2026-04-28 18:34:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `interests`
--

CREATE TABLE `interests` (
  `id` tinyint(4) NOT NULL,
  `ad_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `interests`
--

INSERT INTO `interests` (`id`, `ad_id`, `message`, `user_id`) VALUES
(1, 'd86bc267-e792-4f2f-a13f-8a80771681b1', 'Érdekelne ez a termék', 'ece581e4-6e5a-4a36-ac26-044d3e3bf4d3');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `payments`
--

CREATE TABLE `payments` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `payments`
--

INSERT INTO `payments` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
('460a2ecf-19d5-425a-83f6-13f2f26465b1', 'Paypal', '2026-04-28 18:20:19', '2026-04-28 18:20:19'),
('60443d6f-b605-4d5b-84f5-c3e890f8e8f8', 'Átutalás', '2026-04-28 18:21:33', '2026-04-28 18:21:33'),
('61433f53-86a9-471a-aae8-a579f54caf59', 'Készpénz', '2026-04-28 18:21:18', '2026-04-28 18:21:18'),
('ff1f3326-1472-4f0a-9756-0fdac83f4ef8', 'Bankkártya', '2026-04-28 18:21:10', '2026-04-28 18:21:10');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ratings`
--

CREATE TABLE `ratings` (
  `id` tinyint(4) NOT NULL,
  `ad_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `ratings`
--

INSERT INTO `ratings` (`id`, `ad_id`, `rating`, `user_id`) VALUES
(1, 'd86bc267-e792-4f2f-a13f-8a80771681b1', 5, 'ece581e4-6e5a-4a36-ac26-044d3e3bf4d3'),
(2, 'd86bc267-e792-4f2f-a13f-8a80771681b1', 4, 'a2bc09e2-444e-4c96-8caa-c7a1539c2c84'),
(3, '17a5c885-b1a4-456b-a86b-6a940bc8ce92', 5, 'a2bc09e2-444e-4c96-8caa-c7a1539c2c84');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `supports`
--

CREATE TABLE `supports` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `question` varchar(100) NOT NULL,
  `answer` varchar(500) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `supports`
--

INSERT INTO `supports` (`id`, `question`, `answer`, `topic`, `createdAt`, `updatedAt`) VALUES
('aa39fa47-a910-4a6d-8dbd-b090efbd533e', 'Hogyan tudok felhasználónevet változtatni?', 'A fiókbeállítások menüpontban tudod megváltoztatni a felhasználónevedet.', 'Fiókkezelés', '2026-04-28 18:29:19', '2026-04-28 18:29:19'),
('c592d930-f68c-489b-b004-3ae8fa7763d3', 'Hogyan tudok felhasználói fiókot létrehozni?', 'Az oldal jobb felső sarkában található profil ikonra kattintva a  \'Regisztráció\' gombbal tudsz új fiókot létrehozni. Kérlek, add meg a szükséges adatokat, majd jelentkezz be.', 'Fiókkezelés', '2026-04-28 18:28:36', '2026-04-28 18:28:36'),
('e5e286f6-d96a-4d08-a79a-40410714ce36', 'Hogyan tudok új hirdetést feladni?', 'Az új hirdetés feladásához először regisztrálnod kell egy fiókot, majd be kell jelentkezned. Ezután a főoldalon kattints a \'Új hirdetés\' gombra, és kövesd a megjelenő utasításokat a hirdetés részleteinek megadásához.', 'Hirdetések', '2026-04-28 18:30:19', '2026-04-28 18:30:19');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(30) NOT NULL,
  `profile_picture` varchar(255) DEFAULT 'none',
  `email` varchar(25) NOT NULL,
  `backup_email` varchar(25) DEFAULT NULL,
  `password` varchar(64) NOT NULL,
  `role_id` tinyint(4) NOT NULL DEFAULT 0,
  `phone` varchar(15) NOT NULL,
  `address` varchar(80) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `secret` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `profile_picture`, `email`, `backup_email`, `password`, `role_id`, `phone`, `address`, `status`, `firstName`, `lastName`, `secret`, `createdAt`, `updatedAt`) VALUES
('a2bc09e2-444e-4c96-8caa-c7a1539c2c84', 'janedoe.1', 'none', 'janedoe@gmail.com', 'janedoe2@gmail.com', '$2b$10$Jig1MyaTsNqFfoEUNBUHT.4n2Z3ASc3w/y5Sa093a6yT19lj4UnNK', 0, '+3630456789', '6500 Baja Bácska tér 1.', 1, NULL, NULL, '3d3ec313-4d4d-44f2-a331-15d45e8f8d85', '2026-04-28 18:15:27', '2026-04-28 18:15:27'),
('eac88799-1f6b-42b1-8b98-bff95d2db5bd', 'admin', 'none', 'admin@wanted.hu', 'admin2@wanted.hu', '$2b$10$/qUtGaBUP1zo71mLJuLhu.QcOY7wv5BByCD7DRWd1CZdwrWSS2hFq', 1, '+36302345678', '6500 Baja, Bácska tér 1.', 1, NULL, NULL, '899d4728-2258-4f6e-a292-2e9f4aca65e5', '2026-04-28 18:17:00', '2026-04-28 18:17:00'),
('ece581e4-6e5a-4a36-ac26-044d3e3bf4d3', 'John Doe', 'none', 'johndoe@gmail.com', 'johndoe2@gmail.com', '$2b$10$54Gce9SlLlo.stbmfUTkyuztvfdLrjeke.W.XUeQ8vnww44irjuY.', 0, '+36301234567', '6521 Baja, Bácska tér 1.', 1, NULL, NULL, '8c42c0ec-3cb0-49ef-b52c-67289f2e6e28', '2026-04-28 18:14:04', '2026-04-28 18:14:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `wishlists`
--

CREATE TABLE `wishlists` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `advertId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `wishlists`
--

INSERT INTO `wishlists` (`id`, `userId`, `advertId`, `createdAt`, `updatedAt`) VALUES
('139516a6-ea61-44dd-8756-381c0f211f00', 'ece581e4-6e5a-4a36-ac26-044d3e3bf4d3', 'd86bc267-e792-4f2f-a13f-8a80771681b1', '2026-04-28 18:57:54', '2026-04-28 18:57:54'),
('88ac1205-27e2-4458-90dc-0f6090a4beea', 'a2bc09e2-444e-4c96-8caa-c7a1539c2c84', '17a5c885-b1a4-456b-a86b-6a940bc8ce92', '2026-04-28 18:54:53', '2026-04-28 18:54:53');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `adverts`
--
ALTER TABLE `adverts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ad_id` (`ad_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `conditions`
--
ALTER TABLE `conditions`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advert_id` (`advert_id`);

--
-- A tábla indexei `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ad_id` (`ad_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ad_id` (`ad_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `supports`
--
ALTER TABLE `supports`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- A tábla indexei `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `advertId` (`advertId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `interests`
--
ALTER TABLE `interests`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `adverts`
--
ALTER TABLE `adverts`
  ADD CONSTRAINT `adverts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`ad_id`) REFERENCES `adverts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`advert_id`) REFERENCES `adverts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `interests`
--
ALTER TABLE `interests`
  ADD CONSTRAINT `interests_ibfk_3` FOREIGN KEY (`ad_id`) REFERENCES `adverts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `interests_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`ad_id`) REFERENCES `adverts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_4` FOREIGN KEY (`advertId`) REFERENCES `adverts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
