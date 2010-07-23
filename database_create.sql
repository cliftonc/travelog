-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 23, 2010 at 02:46 PM
-- Server version: 5.0.90
-- PHP Version: 5.2.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `cliftonc_mdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL auto_increment,
  `journal_id` int(11) NOT NULL,
  `name` varchar(100) collate latin1_general_ci NOT NULL,
  `comment` text collate latin1_general_ci NOT NULL,
  `date` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=53 ;

-- --------------------------------------------------------

--
-- Table structure for table `journals`
--

DROP TABLE IF EXISTS `journals`;
CREATE TABLE IF NOT EXISTS `journals` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) collate latin1_general_ci NOT NULL,
  `journal` longtext collate latin1_general_ci NOT NULL,
  `album` varchar(100) collate latin1_general_ci NOT NULL,
  `posted` date NOT NULL,
  `location_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `type` varchar(200) collate latin1_general_ci NOT NULL,
  `trip_id` int(11) NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=31 ;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) collate latin1_general_ci NOT NULL,
  `address` varchar(200) collate latin1_general_ci NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `url` varchar(1000) collate latin1_general_ci NOT NULL,
  `phone` varchar(100) collate latin1_general_ci NOT NULL,
  `type` varchar(30) collate latin1_general_ci NOT NULL default 'Accomodation',
  `trip_id` int(11) NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=97 ;

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
CREATE TABLE IF NOT EXISTS `routes` (
  `id` int(11) NOT NULL auto_increment,
  `start_location_id` int(11) NOT NULL,
  `end_location_id` int(11) NOT NULL,
  `description` varchar(500) collate latin1_general_ci NOT NULL,
  `trip_id` int(11) NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=18 ;

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
CREATE TABLE IF NOT EXISTS `trips` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) collate latin1_general_ci NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=7 ;
