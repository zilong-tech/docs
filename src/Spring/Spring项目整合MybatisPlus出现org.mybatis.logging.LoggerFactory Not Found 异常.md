---
title: Spring项目整合MybatisPlus出现org.mybatis.logging.LoggerFactory Not Found 异常
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
在一个spring项目中集成MybatisPlus,修改好配置文件后启动项目，出现异常

ClassNotFoundException: org.mybatis.logging.LoggerFactory 

1.查看缺少的LoggerFactory是属于哪一个包里的

在idea 中直接通过这个类的全路径名称在dependency中找对应的jar，在pom文件中右键，选择 generate ===》 Dependency

![](https://gitee.com/zysspace/pic/raw/master/images/202205021908623.png)

发现**org.mybatis.LoggerFactory**对应的是**mybatis-spring:2.0.0**以上的版本

2.通过maven打印出项目的依赖树 (mvn dependency:tree)

![](https://gitee.com/zysspace/pic/raw/master/images/202205021914014.png)

这时候发现自己引用的mybatis-spring 是1.3.2版本的 ，可是自己没有在项目中引用任何mybatis-spring依赖，后来想到，该项目是分多模块的，这些模块都依赖于一个父项目，这个父项目只用来声明依赖，其中就包括mybatis和mybatis-spring，删除父项目中的mybatis-spring依赖或者将该依赖升级到2.0.0就成功解决问题了。

```
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.0</version>
</dependency>
```

