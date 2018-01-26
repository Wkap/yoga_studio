-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 26, 2018 at 09:46 PM
-- Server version: 5.6.34-log
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yoga`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `style` text NOT NULL,
  `instructor` text NOT NULL,
  `full` tinyint(1) DEFAULT '0',
  `duration` int(11) NOT NULL DEFAULT '60'
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `date`, `style`, `instructor`, `full`, `duration`) VALUES
(3, '2018-01-21 18:00:00', 'Ashtanga', 'Dobre Milosh', 0, 60),
(5, '2018-01-26 08:00:00', 'Ashtanga', 'Garry Cool', 0, 60),
(6, '2018-01-25 08:00:00', 'Ashtanga', 'Garry Cool', 0, 60),
(7, '2018-01-30 11:00:00', 'Vinyasa', 'Dobre Milosh', 0, 90),
(8, '2018-01-19 09:27:00', 'Ashtanga', 'Garry Cool', 1, 60),
(9, '2018-01-30 14:57:00', 'Ashtanga', 'Garry Cool', 0, 60);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `email` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `class_id`, `email`) VALUES
(1, 1, 'reterius@gmail.com'),
(2, 3, 'reterius@gmail.com'),
(3, 1, 'reterius@gmail.com'),
(4, 6, 'madeya@mail.ru'),
(5, 3, 'Z3ndaL_2p@mail.ru'),
(6, 3, 'shelleah.pedersen@aauni.edu'),
(7, 3, 'kakb@mail.ru'),
(8, 8, 'aSas@mail.ru');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `is_admin`) VALUES
(1, 'a@b.c', '$2a$10$8g8T9u8PjZu1ZEiKXmnQ4emCsw1pttUPW7kq4TgGsRXxVDAtKEf2i', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
