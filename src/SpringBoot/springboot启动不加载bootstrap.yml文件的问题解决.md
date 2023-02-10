---
title: springboot启动不加载bootstrap.yml文件的问题解决
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
### springboot启动不加载bootstrap.yml文件

使用nacos做配置中心，但是程序启动失败，没有拉取配置中心的配置信息。

检查之后发现是bootstrap.yml文件没有被加载，在项目的pom.xml文件中添加如下依赖。

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

重新导入依赖，然后重启项目，在项目日志里可以看到下面这一段信息，并且服务正常启动成功，说明服务启动成功。

```text
Ignore the empty nacos configuration and get it based on dataId[xxx.yml] & group[DEFAULT_GROUP]
```

