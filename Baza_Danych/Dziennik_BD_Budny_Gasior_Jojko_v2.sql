-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 04, 2024 at 10:57 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test2`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `formy_sprawdzania`
--

CREATE TABLE `formy_sprawdzania` (
  `id` int(11) NOT NULL,
  `kurs_id` int(11) NOT NULL,
  `typ` enum('kartkowka','sprawdzian','odpowiedz_ustna','inna') NOT NULL,
  `opis` varchar(255) NOT NULL,
  `waga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `formy_sprawdzania`
--

INSERT INTO `formy_sprawdzania` (`id`, `kurs_id`, `typ`, `opis`, `waga`) VALUES
(5, 2, 'kartkowka', 'Logarytmy', 2),
(6, 2, 'sprawdzian', '', 3),
(7, 2, 'odpowiedz_ustna', '', 1),
(8, 2, 'sprawdzian', 'Matura', 5),
(11, 2, 'kartkowka', 'Matura', 1),
(12, 2, 'odpowiedz_ustna', 'Matura', 1),
(14, 6, 'kartkowka', 'Wstęp', 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `kursy`
--

CREATE TABLE `kursy` (
  `id` int(11) NOT NULL,
  `nauczyciel_id` int(11) NOT NULL,
  `nazwa` varchar(255) NOT NULL,
  `data_rozpoczecia` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kursy`
--

INSERT INTO `kursy` (`id`, `nauczyciel_id`, `nazwa`, `data_rozpoczecia`) VALUES
(2, 1, 'Matematyka - PAW3', '2024-10-29'),
(3, 1, 'J.Polski - PAW 2', '2026-04-02'),
(4, 1, 'Test', '2024-10-27'),
(5, 1, 'Test5', '2024-11-20'),
(6, 7, 'IAM2', '2024-10-30');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `nauczyciele`
--

CREATE TABLE `nauczyciele` (
  `id` int(11) NOT NULL,
  `imie` varchar(255) NOT NULL,
  `nazwisko` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `haslo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nauczyciele`
--

INSERT INTO `nauczyciele` (`id`, `imie`, `nazwisko`, `login`, `haslo`) VALUES
(1, 'Jarosław', 'Gąsior', 'jrygames', '$2b$10$D8.20ybPITSV9prMSECIQ.3T5MsjCfro2yocXEo9ws3gRCxnpxIwG'),
(2, 'Adrian', 'Budny', 'abudny', '$2b$10$PvtEYA8b847l0.t0DGZZFerz0T.2rjz3z5OIe9vzpcA6g78jQHPy6'),
(4, 'a', 'b', 'c', '$2b$10$PMtHrGU5XsKiF1vg6R0jIOLmlRx0IoOhgDB86NNHrh027B1IRTu/W'),
(6, 'b', 'b', 'b', '$2b$10$HDI0.4IiEYRNWTYJhemBlu.brQBuq1qPtWegSsGV5q/84K4EHlf/q'),
(7, 'abc', 'abc', 'abc', '$2b$10$D1S2YoYmL9d.j7GpPj5hqO2VdUjGa9qUtSz2NR9FsOwYy7xy0G3iS');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `obecnosci`
--

CREATE TABLE `obecnosci` (
  `id` int(11) NOT NULL,
  `kurs_id` int(11) NOT NULL,
  `uczen_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `obecnosci`
--

INSERT INTO `obecnosci` (`id`, `kurs_id`, `uczen_id`, `data`, `status`) VALUES
(7, 2, 2, '2024-10-29', NULL),
(8, 2, 4, '2024-10-29', NULL),
(13, 2, 3, '2024-10-29', 1),
(37, 2, 2, '2024-10-28', NULL),
(38, 2, 3, '2024-10-28', NULL),
(39, 2, 4, '2024-10-28', NULL),
(40, 6, 2, '2024-10-30', 1),
(41, 6, 4, '2024-10-30', 1),
(42, 6, 2, '2024-10-29', 0),
(43, 6, 4, '2024-10-29', 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `oceny`
--

CREATE TABLE `oceny` (
  `id` int(11) NOT NULL,
  `uczen_id` int(11) NOT NULL,
  `forma_sprawdzania_id` int(11) NOT NULL,
  `wartosc` decimal(5,2) NOT NULL,
  `data` date NOT NULL,
  `anulowana` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `oceny`
--

INSERT INTO `oceny` (`id`, `uczen_id`, `forma_sprawdzania_id`, `wartosc`, `data`, `anulowana`) VALUES
(1, 2, 5, 1.00, '2024-10-29', 0),
(2, 4, 6, 3.00, '2024-10-31', 0),
(3, 4, 5, 5.00, '2024-10-24', 0),
(4, 2, 6, 5.00, '2024-10-24', 0),
(5, 2, 7, 2.00, '2024-10-24', 0),
(6, 2, 8, 3.00, '2024-10-24', 0),
(7, 4, 8, 5.00, '2024-10-24', 0),
(8, 4, 7, 4.00, '2024-10-24', 0),
(9, 2, 11, 1.00, '2024-10-24', 0),
(10, 4, 11, 5.00, '2024-10-24', 0),
(13, 2, 14, 4.00, '2024-10-29', 0),
(14, 4, 14, 3.00, '2024-10-29', 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uczniowie`
--

CREATE TABLE `uczniowie` (
  `id` int(11) NOT NULL,
  `imie` varchar(255) NOT NULL,
  `nazwisko` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uczniowie`
--

INSERT INTO `uczniowie` (`id`, `imie`, `nazwisko`) VALUES
(2, 'Adrian', 'Budny'),
(3, 'Jarosław', 'Gąsior'),
(4, 'Dominik', 'Jojko'),
(33, 'Jarasław', 'Gąsior'),
(35, 'abc', 'abc');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `formy_sprawdzania`
--
ALTER TABLE `formy_sprawdzania`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kurs_id` (`kurs_id`);

--
-- Indeksy dla tabeli `kursy`
--
ALTER TABLE `kursy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nauczyciel_id` (`nauczyciel_id`);

--
-- Indeksy dla tabeli `nauczyciele`
--
ALTER TABLE `nauczyciele`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`login`);

--
-- Indeksy dla tabeli `obecnosci`
--
ALTER TABLE `obecnosci`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kurs_id` (`kurs_id`,`uczen_id`,`data`),
  ADD KEY `uczen_id` (`uczen_id`);

--
-- Indeksy dla tabeli `oceny`
--
ALTER TABLE `oceny`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uczen_id` (`uczen_id`),
  ADD KEY `forma_sprawdzania_id` (`forma_sprawdzania_id`);

--
-- Indeksy dla tabeli `uczniowie`
--
ALTER TABLE `uczniowie`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `formy_sprawdzania`
--
ALTER TABLE `formy_sprawdzania`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kursy`
--
ALTER TABLE `kursy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `nauczyciele`
--
ALTER TABLE `nauczyciele`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `obecnosci`
--
ALTER TABLE `obecnosci`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `oceny`
--
ALTER TABLE `oceny`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `uczniowie`
--
ALTER TABLE `uczniowie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `formy_sprawdzania`
--
ALTER TABLE `formy_sprawdzania`
  ADD CONSTRAINT `formy_sprawdzania_ibfk_1` FOREIGN KEY (`kurs_id`) REFERENCES `kursy` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kursy`
--
ALTER TABLE `kursy`
  ADD CONSTRAINT `kursy_ibfk_1` FOREIGN KEY (`nauczyciel_id`) REFERENCES `nauczyciele` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `obecnosci`
--
ALTER TABLE `obecnosci`
  ADD CONSTRAINT `obecnosci_ibfk_1` FOREIGN KEY (`kurs_id`) REFERENCES `kursy` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `obecnosci_ibfk_2` FOREIGN KEY (`uczen_id`) REFERENCES `uczniowie` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `oceny`
--
ALTER TABLE `oceny`
  ADD CONSTRAINT `oceny_ibfk_1` FOREIGN KEY (`uczen_id`) REFERENCES `uczniowie` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `oceny_ibfk_3` FOREIGN KEY (`forma_sprawdzania_id`) REFERENCES `formy_sprawdzania` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
