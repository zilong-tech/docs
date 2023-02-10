---
title: 安装mysql
author: 程序员子龙
index: true
icon: discover
category:
- MySQL

---
### **安装mysql**

压缩包相当于免安装文件，要想使用它只需要配置相关的参数，再通过通过服务来启动数据库服务就可以了。

**把压缩包解压到你喜欢的位置**

本示例解压到：D:\software\mysql-5.7.18-winx64 文件夹下

**创建my.ini文件**

mysql-5.7.18-winx64根目录中创建my.ini文件添加以下内容： 

```
[mysqld] 
# set basedir to your installation path 
basedir=D:\\software\\mysql-5.7.18-winx64 
# set datadir to the location of your data directory 
datadir=D:\\software\\mysql-5.7.18-winx64\\data 
port = 3306 
max_allowed_packet = 32M 
```

注意，basedir和datadir是必须要配置的，basedir就是你解压的目录

** 配置环境变量**

- 添加一个名叫 MYSQL_HOME 的变量。
- 修改Path变量，在末尾添加 %MYSQL_HOME%\bin

**初始化数据库文件**

1、 以管理员身份运行cmd，进入mysql的bin目录。 

2、 初始化数据库文件

```
mysqld  --initialize  
```

初始化成功后，会在datadir目录下生成一些文件，其中，xxx.err(xxx是你电脑用户的名称)文件里说明了root账户的临时密码。例子：就是root账户的临时密码 

![](https://pic2.zhimg.com/80/v2-eeee8f79716ad2f6606c200492aa9d3b_720w.png)

2017-05-17T10:31:54.235041Z 1 [Note] A temporary password is generated for root@localhost: 

**注册mysql服务**

```
mysqld -install MySQL 
```

**2、6 启动mysql服务**

```
net start MySQL  
```

**3、 修改root密码**

使用root账号登录 这里的密码为上面提到的root账号的临时密码

```
mysql -u root -p Enter password: ****
```

修改root密码

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password'; 
```

### 卸载mysql

1、关闭服务

以管理员身份运行cmd，执行以下命令： 

```
net stop mysql
```

2、卸载

```
mysqld -remove [服务名]
```

3、删除文件

4、删除注册表信息

清除注册表中的该MySQL服务，有几个地方: 

```
a、HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Eventlog\Application\MySQL 目录删除 

b、HKEY_LOCAL_MACHINE\SYSTEM\ControlSet002\Services\Eventlog\Application\MySQL 目录删除 

c、HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Application\MySQL 目录删除 
```

注册表中的ControlSet001、ControlSet002不一定是001和002，可能是ControlSet005、006之类，删除的时候都删除就可以 。