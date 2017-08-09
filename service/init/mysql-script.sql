DROP TABLE IF EXISTS `monitor_user`;

CREATE TABLE `monitor_user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `permisson_level` boolean NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `monitor_project`;

CREATE TABLE `monitor_project` (
  `project_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL DEFAULT '',
  `project_name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `project_name` (`project_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_project`;

CREATE TABLE `user_project` (
  `up_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned,
  `project_id` int(10) unsigned,
  PRIMARY KEY (`up_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;