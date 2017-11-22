DROP TABLE IF EXISTS `tm_permission`;
CREATE TABLE `tm_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `user_id` int(11) NOT NULL COMMENT '逻辑外键，用户id',
  `project_id` int(11) NOT NULL COMMENT '逻辑外键，项目id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限表';
LOCK TABLES `tm_permission` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tm_user`;
CREATE TABLE `tm_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id，自增主键',
  `sid` char(12) NOT NULL COMMENT '用户sid',
  `username` varchar(16) NOT NULL COMMENT '用户名',
  `password` varchar(16) NOT NULL COMMENT '密码',
  `email` varchar(32) DEFAULT NULL COMMENT '邮箱',
  `is_admin` varchar(1) NOT NULL DEFAULT '1' COMMENT '是否管理员，1普通用户，2管理员，3超级管理员',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_login` datetime DEFAULT NULL COMMENT '最后登陆时间',
  `login_ip` varchar(16) NOT NULL COMMENT '注册时的ip',
  `enable` varchar(1) NOT NULL DEFAULT '1' COMMENT '是否锁定行为，1允许，2禁止。锁定包括登陆在内一切行为。',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';
LOCK TABLES `tm_user` WRITE;
UNLOCK TABLES;