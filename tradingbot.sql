-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2024 at 12:59 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tradingbot`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `email`, `password`, `role`) VALUES
(1, 'test@gmail.com', '$2b$10$USKFQJ/5KJTbQBh1wzWryemqONUXQP/2PPqv.zIDbs9XCj3RtgXIm', 'user'),
(3, 'admin@gmail.com', '$2b$10$jURjX819.CKhgrqdIthKZ.VuHUE6T6GhLWmAZFmgKGMcWPZuZKhzy', 'admin'),
(4, 'testing@gmail.com', '$2b$10$EjAp6X3SDLOwIBhqxixS9Ofg3INOePZXAM6DUWQeXbvXiLiA2P836', 'user'),
(5, 'test1@gmail.com', '$2b$10$SdltdhStwP3xTVQV8XljMu2j71I0Yyn1.3f9Smj1fNldOJN7zb/Rm', 'user'),
(6, 'test3@gmail.com', '$2b$10$eIcAPs0AWk6nygBXawtekO/ZxGbrE0o9JXDLDMBYtybOknA2FaPre', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `bots`
--

CREATE TABLE `bots` (
  `bot_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `bot_path` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `backtest_image_path` varchar(255) DEFAULT NULL,
  `backtest_html_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bots`
--

INSERT INTO `bots` (`bot_id`, `name`, `description`, `bot_path`, `image_path`, `backtest_image_path`, `backtest_html_path`) VALUES
(51, '124sdfgadf', '123414251', '..\\public\\bot\\1710500005718-fxDreema.mq4', '..\\public\\botimage\\1710500005722-OIG2 (1).jpg', '..\\public\\backtestimage\\1710500005725-StrategyTester.gif', '..\\public\\backtesthtml\\1710500005725-StrategyTester.htm');

-- --------------------------------------------------------

--
-- Table structure for table `bot_currencies`
--

CREATE TABLE `bot_currencies` (
  `bot_id` int(11) NOT NULL,
  `currency_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bot_currencies`
--

INSERT INTO `bot_currencies` (`bot_id`, `currency_id`) VALUES
(51, 2);

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `dateAdded` date DEFAULT curdate(),
  `mse` decimal(10,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `name`, `imagePath`, `dateAdded`, `mse`) VALUES
(1, 'EURUSD', '..\\public\\currency\\1710438118975-EURUSD.png', '2024-03-15', 0.0034),
(2, 'USDJPY', '..\\public\\currency\\1710438641936-USDJPY.png', '2024-03-15', 0.0026),
(4, 'GOLD', '..\\public\\currency\\1710455356467-XAUUSD.png', '2024-03-14', 0.0035);

-- --------------------------------------------------------

--
-- Table structure for table `ports`
--

CREATE TABLE `ports` (
  `port_id` int(11) NOT NULL,
  `port_number` varchar(255) NOT NULL,
  `account_id` int(11) NOT NULL,
  `status` int(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ports`
--

INSERT INTO `ports` (`port_id`, `port_number`, `account_id`, `status`) VALUES
(8, '79092893', 1, 1),
(9, '123456', 1, 1),
(11, '3412312', 6, 0),
(12, '5654212', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `Transaction_ID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `Profit` decimal(10,2) DEFAULT NULL,
  `Commission` decimal(10,2) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `port_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`Transaction_ID`, `Date`, `Profit`, `Commission`, `Status`, `port_id`) VALUES
(5, '2024-03-08', 84.23, 8.42, '0', 8),
(6, '2024-03-08', 136.83, 13.68, '1', 8),
(7, '2024-03-08', 147.85, 14.78, '1', 8),
(8, '2024-03-08', 937.55, 93.75, '2', 8),
(9, '2024-03-08', 273.30, 27.33, '2', 8);

-- --------------------------------------------------------

--
-- Table structure for table `uploadslip`
--

CREATE TABLE `uploadslip` (
  `uploadslip_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `transactions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploadslip`
--

INSERT INTO `uploadslip` (`uploadslip_id`, `name`, `filePath`, `transactions`) VALUES
(28, 'kittikhun tapwang', '..\\public\\user\\slip\\1710265934218.jpg', '[5]');

-- --------------------------------------------------------

--
-- Table structure for table `verifyport`
--

CREATE TABLE `verifyport` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(255) NOT NULL,
  `port_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verifyport`
--

INSERT INTO `verifyport` (`id`, `filename`, `filepath`, `port_id`) VALUES
(6, '1709907321535.png', 'uploads/port/1709907321535.png', 8),
(7, '1709912958355.jpg', 'uploads/port/1709912958355.jpg', 9),
(9, 'à¸à¸±à¸à¸à¸£à¹.png', 'public\\user\\port\\1710177098526.png', 11),
(10, 'qrcode.jpg', 'public\\user\\port\\1710179854363.jpg', 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `bots`
--
ALTER TABLE `bots`
  ADD PRIMARY KEY (`bot_id`);

--
-- Indexes for table `bot_currencies`
--
ALTER TABLE `bot_currencies`
  ADD PRIMARY KEY (`bot_id`,`currency_id`),
  ADD KEY `currency_id` (`currency_id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ports`
--
ALTER TABLE `ports`
  ADD PRIMARY KEY (`port_id`),
  ADD UNIQUE KEY `port_number` (`port_number`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`Transaction_ID`),
  ADD KEY `port_id` (`port_id`);

--
-- Indexes for table `uploadslip`
--
ALTER TABLE `uploadslip`
  ADD PRIMARY KEY (`uploadslip_id`);

--
-- Indexes for table `verifyport`
--
ALTER TABLE `verifyport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `port_id` (`port_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bots`
--
ALTER TABLE `bots`
  MODIFY `bot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ports`
--
ALTER TABLE `ports`
  MODIFY `port_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `Transaction_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `uploadslip`
--
ALTER TABLE `uploadslip`
  MODIFY `uploadslip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `verifyport`
--
ALTER TABLE `verifyport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bot_currencies`
--
ALTER TABLE `bot_currencies`
  ADD CONSTRAINT `bot_currencies_ibfk_1` FOREIGN KEY (`bot_id`) REFERENCES `bots` (`bot_id`),
  ADD CONSTRAINT `bot_currencies_ibfk_2` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`);

--
-- Constraints for table `ports`
--
ALTER TABLE `ports`
  ADD CONSTRAINT `ports_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`);

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`port_id`) REFERENCES `ports` (`port_id`);

--
-- Constraints for table `verifyport`
--
ALTER TABLE `verifyport`
  ADD CONSTRAINT `verifyport_ibfk_1` FOREIGN KEY (`port_id`) REFERENCES `ports` (`port_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
