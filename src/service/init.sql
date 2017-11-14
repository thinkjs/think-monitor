DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增，分类id',
  `name` varchar(32) NOT NULL COMMENT '分类中文名',
  `alias` varchar(32) NOT NULL COMMENT '分类英文名',
  `parent_id` int(11) NOT NULL COMMENT '父级分类主键',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='分类表';
LOCK TABLES `category` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增，文章id',
  `title` text NOT NULL COMMENT '文章名',
  `description` text COMMENT '文章摘要',
  `md_content` text COMMENT '文章md',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章表';
LOCK TABLES `posts` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `posts_category_relation`;
CREATE TABLE `posts_category_relation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `posts_id` int(11) unsigned NOT NULL COMMENT '外键，文章id',
  `categroy_id` int(11) unsigned NOT NULL COMMENT '外键，分类id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章分裂关系表';
LOCK TABLES `posts_category_relation` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `posts_tag_relation`;
CREATE TABLE `posts_tag_relation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `posts_id` int(11) unsigned NOT NULL COMMENT '外键，文章id',
  `tag_id` int(11) unsigned NOT NULL COMMENT '外键，标签id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章标签关系表';
LOCK TABLES `posts_tag_relation` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增，标签id',
  `name` varchar(32) NOT NULL COMMENT 'tag中文名',
  `alias` varchar(32) NOT NULL COMMENT 'tag英文名',
  `create_time` datetime NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签表';

LOCK TABLES `tag` WRITE;
UNLOCK TABLES;
