---
title: Mongodb入门
author: 程序员子龙
index: true
icon: discover
category:
- 开源项目
---
## 简介

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

-  MongoDB中的一条记录是一个文档，它是由字段和值对组成的数据结构。MongoDB文档类似于JSON对象。字段的值可以包括其他文档，数组和文档数组。MongoDB数据模型和你的对象在内存中的表现形式一样，一目了然的对象模型。

- 同一个集合中可以包含不同字段（类型）的文档对象：同一个集合的字段可能不同

- 线上修改数据模式，修改时应用与数据库都无须下线

​    ![0](https://note.youdao.com/yws/public/resource/5e038498891617c552667b853742fdc1/xmlnote/67E8D4D144954D17BE0E4686F440EAD1/29859)

 

关系型数据库设计（第三范式）：

​    ![0](https://note.youdao.com/yws/public/resource/5e038498891617c552667b853742fdc1/xmlnote/E314376CE33E4DCF8593A3F68236610D/29855)



| 数据库       | MongoDB                                              | MySQL                        |
| ------------ | ---------------------------------------------------- | ---------------------------- |
| 数据库模型   | 非关系型                                             | 关系型                       |
| 存储方式     | 以类JSON的文档的格式存储                             | 不同引擎有不同的存储方式     |
| 查询语句     | MongoDB查询方式（类似JavaScript的函数）              | SQL语句                      |
| 数据处理方式 | 基于内存，将热数据存放在物理内存中，从而达到高速读写 | 不同引擎有自己的特点         |
| 广泛度       | NoSQL数据库中，比较完善且开源，使用人数在不断增长    | 开源数据库，市场份额不断增长 |
| 事务性       | 仅支持单文档事务操作，弱一致性                       | 支持事务操作                 |
| 占用空间     | 占用空间大                                           | 占用空间小                   |
| join操作     | MongoDB没有join                                      | MySQL支持join                |

系型数据库和文档型数据库主要概念对应

|              | **关系型数据库** | **文档型数据库**       |
| ------------ | ---------------- | ---------------------- |
| **模型实体** | 表               | 集合                   |
| **模型属性** | 列               | 字段                   |
| **模型关系** | 表关联           | 内嵌数组，引用字段关联 |

## 主要特点

- MongoDB 是一个面向文档存储的数据库，操作起来比较简单和容易。
- 你可以在MongoDB记录中设置任何属性的索引 (如：FirstName="Sameer",Address="8 Gandhi Road")来实现更快的排序。
- 你可以通过本地或者网络创建数据镜像，这使得MongoDB有更强的扩展性。
- 如果负载的增加（需要更多的存储空间和更强的处理能力） ，它可以分布在计算机网络中的其他节点上这就是所谓的分片。
- Mongo支持丰富的查询表达式。查询指令使用JSON形式的标记，可轻易查询文档中内嵌的对象及数组。
- MongoDb 使用update()命令可以实现替换完成的文档（数据）或者一些指定的数据字段 。
- Mongodb中的Map/reduce主要是用来对数据进行批量处理和聚合操作。
- Map和Reduce。Map函数调用emit(key,value)遍历集合中所有的记录，将key与value传给Reduce函数进行处理。
- Map函数和Reduce函数是使用Javascript编写的，并可以通过db.runCommand或mapreduce命令来执行MapReduce操作。
- GridFS是MongoDB中的一个内置功能，可以用于存放大量小文件。
- MongoDB允许在服务端执行脚本，可以用Javascript编写某个函数，直接在服务端执行，也可以把函数的定义存储在服务端，下次直接调用即可。
- MongoDB支持各种编程语言:RUBY，PYTHON，JAVA，C++，PHP，C#等多种语言。

## 安装

[mongodb官网下载](https://www.mongodb.com/try/download/community)

- **MongoDB for Windows 64-bit** 适合 64 位的 Windows Server 2008 R2, Windows 7 , 及最新版本的 Window 系统。
- **MongoDB for Windows 32-bit** 适合 32 位的 Window 系统及最新的 Windows Vista。 32 位系统上 MongoDB 的数据库最大为 2GB。
- **MongoDB for Windows 64-bit Legacy** 适合 64 位的 Windows Vista, Windows Server 2003, 及 Windows Server 2008 。

下载 .msi 文件，下载后双击该文件，按操作提示安装即可。

![](http://img.xxfxpt.top/202204262156824.png)

安装过程中，你可以通过点击 "Custom(自定义)" 按钮来设置你的安装目录。

![img](https://www.runoob.com/wp-content/uploads/2013/10/win-install1.jpg)



![img](https://www.runoob.com/wp-content/uploads/2013/10/win-install2.jpg)

下一步安装 **"install mongoDB compass"** 不勾选（当然你也可以选择安装它，可能需要更久的安装时间），MongoDB Compass 是一个图形界面管理工具，我们可以在后面自己到官网下载安装，下载地址：https://www.mongodb.com/download-center/compass。

![img](https://www.runoob.com/wp-content/uploads/2013/10/8F7AF133-BE49-4BAB-9F93-88A9D666F6C0.jpg)

**创建数据目录**

MongoDB 将数据目录存储在 db 目录下。但是这个数据目录不会主动创建，我们在安装完成后需要创建它。请注意，数据目录应该放在根目录下 (如： C:\ 或者 D:\ 等 )。

我们已经在 C 盘安装了 mongodb，现在让我们创建一个 data 的目录然后在 data 目录里创建 db 目录。

```
cd C:\
md "\data\db"
```

你也可以通过 window 的资源管理器中创建这些目录，而不一定通过命令行。

## 运行 MongoDB 服务器

为了从命令提示符下运行 MongoDB 服务器，你必须从 MongoDB 目录的 bin 目录中执行 mongod.exe 文件。

```shell
C:\mongodb\bin\mongod --dbpath d:\data\db # 这个路径是MongoDB默认的数据存放路径

 mongod  --auth              #以授权模式启动
 
 mongo -u 用户名 --host 127.0.0.1:27017 #授权方式连接
```



## 基本操作

### 数据库操作

```
db # 显示当前所在的数据库 

use example # 切换数据库，不存在数据库会直接创建
show databases; #展示所有数据库
```

### 创建用户

```shell
use admin  # 设置密码需要切换到admin库
> db.createUser(
   {
     user: "demo",
     pwd: "123456",
     roles: [ "root" ]
   }
 )
 show users # 查看所有用户信息
```

```shell
> show users;
{
        "_id" : "admin.demo",
        "userId" : UUID("941519b6-b6dd-4d66-ade9-cea6a0f01fc5"),
        "user" : "demo",
        "db" : "admin",
        "roles" : [
                {
                        "role" : "root",
                        "db" : "admin"
                }
        ],
        "mechanisms" : [
                "SCRAM-SHA-1",
                "SCRAM-SHA-256"
        ]
}
```



### 创建集合

```
db.createCollection(name, options)
```

参数说明：

- name: 要创建的集合名称
- options: 可选参数, 指定有关内存大小及索引的选项

options 可以是如下参数：

| 字段        | 类型 | 描述                                                         |
| :---------- | :--- | :----------------------------------------------------------- |
| capped      | 布尔 | （可选）如果为 true，则创建固定集合。固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。 **当该值为 true 时，必须指定 size 参数。** |
| autoIndexId | 布尔 | 3.2 之后不再支持该参数。（可选）如为 true，自动在 _id 字段创建索引。默认为 false。 |
| size        | 数值 | （可选）为固定集合指定一个最大值，即字节数。 **如果 capped 为 true，也需要指定该字段。** |
| max         | 数值 | （可选）指定固定集合中包含文档的最大数量。                   |

在插入文档时，MongoDB 首先检查固定集合的 size 字段，然后检查 max 字段。

在 MongoDB 中，可以不用创建集合。当插入一些文档时，MongoDB 会自动创建集合。

### 添加数据 insert

```
db.集合.insertOne(<JSON对象>)   // 添加单个文档
db.集合.insertMany([{<JSON对象1>},{<JSON对象2>}])   // 批量添加文档
db.集合.insert()   // 添加单个文档
```

```shell
> db.user.insertOne(
... {
...  name:"sue",
...  age:26,
...  status:"pending"}
... );
```

注意：mongodb的主键名称是_id,可以在插入数据时指定。

![](http://img.xxfxpt.top/202205012203812.png)

