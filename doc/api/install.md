## install API

### POST /index/install

#### 安装该系统，首先测试是否目标服务器能否连通，不通会返回错误信息。

|名称|类型|必填|说明|
| ---- | ---- | ---- | ---- |
|username|String|yes|用户名，用来登录此系统|
|password|String|yes|密码|
|db_host|String|yes|mysql 主机|
|db_port|Number|yes|mysql 端口号|
|db_name|String|yes|mysql 数据库名|
|db_account|String|yes|mysql 数据库账号|
|db_password|String|yes|mysql 数据库密码|
|db_table_prefix|String|yes|mysql 数据表前缀|
|influx_host|String|yes|influx 主机|
|influx_port|Number|yes|influx 端口|

```json
{
    "errno": 0,
    "errmsg": "安装成功",
    "data": ""
}
```

