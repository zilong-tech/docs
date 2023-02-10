---
title: SpringCloud Nacos
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
### **什么是 Nacos** 

官方文档： https://nacos.io/zh-cn/docs/what-is-nacos.html 

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态 服务发现、服务配置、服务元数据及流量管理。 

Nacos 的关键特性包括: 

- 服务发现和服务健康监测 

- 动态配置服务 

- 动态 DNS 服务 

- 服务及其元数据管理 

![](https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561217892717-1418fb9b-7faa-4324-87b9-f1740329f564.jpeg)

![](https://note.youdao.com/yws/public/resource/ff9ab83ebe09e367dc598cc844b5bb13/xmlnote/F94BCA1509DA4586A850C70F042C7BE2/12912)

### 核心概念

#### 服务 (Service)

服务是指一个或一组软件功能（例如特定信息的检索或一组操作的执行），其目的是不同的客户端可以为不同的目的重用（例如通过跨进程的网络调用）。Nacos 支持主流的服务生态，如 Kubernetes Service、gRPC|Dubbo RPC Service 或者 Spring Cloud RESTful Service。

#### 服务注册中心 (Service Registry)

服务注册中心，它是服务，其实例及元数据的数据库。服务实例在启动时注册到服务注册表，并在关闭时注销。服务和路由器的客户端查询服务注册表以查找服务的可用实例。服务注册中心可能会调用服务实例的健康检查 API 来验证它是否能够处理请求。

#### 服务元数据 (Service Metadata)

服务元数据是指包括服务端点(endpoints)、服务标签、服务版本号、服务实例权重、路由规则、安全策略等描述服务的数据。

#### 服务提供方 (Service Provider)

是指提供可复用和可调用服务的应用方。

#### 服务消费方 (Service Consumer)

是指会发起对某个服务调用的应用方。

#### 配置 (Configuration)

在系统开发过程中通常会将一些需要变更的参数、变量等从代码中分离出来独立管理，以独立的配置文件的形式存在。目的是让静态的系统工件或者交付物（如 WAR，JAR 包等）更好地和实际的物理运行环境进行适配。配置管理一般包含在系统部署的过程中，由系统管理员或者运维人员完成这个步骤。配置变更是调整系统运行时的行为的有效手段之一。

#### 配置管理 (Configuration Management)

在数据中心中，系统中所有配置的编辑、存储、分发、变更管理、历史版本管理、变更审计等所有与配置相关的活动统称为配置管理。

#### 名字服务 (Naming Service)

提供分布式系统中所有对象(Object)、实体(Entity)的“名字”到关联的元数据之间的映射管理服务，例如 ServiceName -> Endpoints Info, Distributed Lock Name -> Lock Owner/Status Info, DNS Domain Name -> IP List, 服务发现和 DNS 就是名字服务的2大场景。

#### 配置服务 (Configuration Service)

在服务或者应用运行过程中，提供动态配置或者元数据以及配置管理的服务提供者。

### 快速使用

#### nacos-server 安装

下载安装包：https://github.com/alibaba/Nacos/releases

解压，进入nacos目录

```shell
startup.cmd -m standalone
```

#### **搭建Nacos-client服务**

引入依赖

```Java
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

application.properties中配置

```Java
#配置nacos注册中心地址
cloud:
  nacos:
    discovery:
      server-addr: 127.0.0.1:8848
```

更多配置：https://github.com/alibaba/spring-cloud-alibaba/wiki/Nacos-discovery

​    ![0](https://note.youdao.com/yws/public/resource/ff9ab83ebe09e367dc598cc844b5bb13/xmlnote/68B395E46AF34F26AA0FBD76FD133310/12908)

启动应用，nacos管理端界面查看是否成功注册

​    ![0](https://note.youdao.com/yws/public/resource/ff9ab83ebe09e367dc598cc844b5bb13/xmlnote/A2C5D212455B4C1D8DEEFD9CF1CBB7FE/12914)