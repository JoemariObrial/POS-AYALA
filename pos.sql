-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 15, 2024 at 02:03 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `ayala`
--

CREATE TABLE `ayala` (
  `user_id` int(11) NOT NULL,
  `username` varchar(250) NOT NULL,
  `fullname` varchar(250) NOT NULL,
  `pword` varchar(250) NOT NULL,
  `role` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ayala`
--

INSERT INTO `ayala` (`user_id`, `username`, `fullname`, `pword`, `role`) VALUES
(1, 'Pitok', 'Pitok Batolata', '12345', 'Admin'),
(3, 'Kulas', 'Kulas D Malas', '54321', 'Cashier');

-- --------------------------------------------------------

--
-- Table structure for table `centrio`
--

CREATE TABLE `centrio` (
  `prod_id` int(11) NOT NULL,
  `prod_name` varchar(250) NOT NULL,
  `prod_code` int(250) NOT NULL,
  `prod_price` int(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `centrio`
--

INSERT INTO `centrio` (`prod_id`, `prod_name`, `prod_code`, `prod_price`) VALUES
(1, 'shabu', 1001, 100),
(2, 'test', 1001, 10),
(3, 'marijuana', 1002, 90),
(4, 'shamppo', 1003, 100),
(5, 'meow', 1009, 100),
(6, 'Egg', 1000210, 12),
(7, 'Bulad', 1230909, 900);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_display`
--

CREATE TABLE `tbl_display` (
  `display_id` int(11) NOT NULL,
  `display_nameid` int(50) NOT NULL,
  `display_name` varchar(250) NOT NULL,
  `display_quantity` int(250) NOT NULL,
  `display_price` int(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ayala`
--
ALTER TABLE `ayala`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `centrio`
--
ALTER TABLE `centrio`
  ADD PRIMARY KEY (`prod_id`);

--
-- Indexes for table `tbl_display`
--
ALTER TABLE `tbl_display`
  ADD PRIMARY KEY (`display_id`),
  ADD KEY `display_nameid` (`display_nameid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ayala`
--
ALTER TABLE `ayala`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `centrio`
--
ALTER TABLE `centrio`
  MODIFY `prod_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_display`
--
ALTER TABLE `tbl_display`
  MODIFY `display_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_display`
--
ALTER TABLE `tbl_display`
  ADD CONSTRAINT `tbl_display_ibfk_1` FOREIGN KEY (`display_nameid`) REFERENCES `ayala` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
