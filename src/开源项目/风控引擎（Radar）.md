---
title: 风控引擎
author: 程序员子龙
index: true
icon: discover
category:
- 开源项目
---
#  风控引擎（Radar）

### 简介

一款基于java语言，使用Springboot + Mongodb + Groovy + Es等框架搭建的轻量级实时风控引擎，适用于反欺诈应用场景，极简的配置，真正做到了开箱即用。通过一个统一的管理平台，使用规则引擎，采用可视化配置的形式， 平台化管理不同产品的风控策略才是一种更好的方式。

##  项目特点

- 实时风控，特殊场景可以做到100ms内响应
- 可视化规则编辑器，丰富的运算符、计算规则灵活
- 支持中文，易用性更强
- 自定义规则引擎，更加灵活，支持复杂多变的场景
- 插件化的设计，快速接入其它数据能力平台
- NoSQL，易扩展，高性能
- 配置简单，开箱即用！

### 架构图

![](https://www.riskengine.cn/radar/sys_model_arch.png)

### 产品截图

![](https://images.gitee.com/uploads/images/2019/1014/235326_c6826c09_5150633.png)

![](https://images.gitee.com/uploads/images/2019/1014/235325_532232f7_5150633.png)

![](https://images.gitee.com/uploads/images/2019/1014/235325_0df82f70_5150633.png)

![](https://images.gitee.com/uploads/images/2019/1014/235325_ff50729e_5150633.png)

### 项目地址

https://gitee.com/freshday/radar

# open-capacity-platform 微服务能力开放平台

- 项目简介

ocp是基于layui+springcloud的企业级微服务框架(用户权限管理，配置中心管理，应用管理，....),其核心的设计目标是分离前后端，快速开发部署，学习简单，功能强大，提供快速接入核心接口能力，其目标是帮助企业搭建一套类似百度能力开放平台的框架；

- 系统功能
  - 统一安全认证中心
    - 支持oauth的四种模式登录
    - 支持用户名、密码加图形验证码登录
    - 手机校验码登录
    - 支持第三方系统单点登录
  - 微服务架构基础支撑
    - 服务注册发现、路由与负载均衡
    - 服务熔断与限流
    - 统一配置中心
    - 统一日志中心
    - 分布式锁
    - 分布式任务调度器
  - 系统服务监控中心
    - 服务调用链监控
    - 应用吞吐量监控
    - 服务降级、熔断监控
    - 微服务服务监控
  - 能力开放平台业务支撑
    - 网关基于应用方式API接口隔离
    - 网关基于应用限制调用次数
    - 下游服务基于RBAC权限管理，实现细粒度控制
    - 代码生成器中心
    - 网关聚合服务内部Swagger接口文档
    - 统一跨域处理
    - 统一异常处理
  - docker容器化部署
    - 基于rancher的容器化部署
    - 基于docker的elk日志监控
    - 基于docker的服务动态扩容

- 代码结构

![](https://images.gitee.com/uploads/images/2020/0531/225255_8134df97_1441068.png)

-  能力开放管理平台

  ![](https://images.gitee.com/uploads/images/2019/0330/112405_4b826028_869801.png)

![](https://images.gitee.com/uploads/images/2019/0908/215719_7280e0a7_869801.png)



![](https://images.gitee.com/uploads/images/2019/0908/215805_ccc6f047_869801.png)

![](https://images.gitee.com/uploads/images/2019/0908/215849_3579d1f2_869801.png)



![](https://images.gitee.com/uploads/images/2019/0731/144404_6e9f86e3_869801.png)

![](https://images.gitee.com/uploads/images/2019/1021/180342_fbfa0c95_869801.png)

![](https://images.gitee.com/uploads/images/2019/1021/180402_d345fc8c_869801.png)

- 系统监控

  ![](https://images.gitee.com/uploads/images/2019/0523/085501_ee047496_869801.png)

![](https://images.gitee.com/uploads/images/2019/0401/230332_f777ea8d_869801.png)

![](https://images.gitee.com/uploads/images/2019/0401/230430_3eb6b5e0_869801.png)

## J2Cache —— 基于内存和 Redis 的两级 Java 缓存框架

- 项目简介      

  J2Cache 是 OSChina 目前正在使用的两级缓存框架（要求至少 Java 8）。第一级缓存使用内存(同时支持 Ehcache 2.x、Ehcache 3.x 和 Caffeine)，第二级缓存使用 Redis(推荐)/Memcached 。 由于大量的缓存读取会导致 L2 的网络成为整个系统的瓶颈，因此 L1 的目标是降低对 L2 的读取次数。 该缓存框架主要用于集群环境中。单机也可使用，用于避免应用重启导致的缓存冷启动后对后端业务的冲击。

- 准备工作

拷贝 `j2cache.properties` 和 `caffeine.properties` 到你项目的源码目录，并确保这些文件会被编译到项目的 classpath 中。如果你选择了 ehcache 作为一级缓存，需要拷贝 `ehcache.xml` 或者 `ehcache3.xml` 到源码目录（后者对应的是 Ehcache 3.x 版本），这些配置文件的模板可以从 https://gitee.com/ld/J2Cache/tree/master/core/resources 这里获取。

使用你喜欢的文本编辑器打开 `j2cache.properties` 并找到 `redis.hosts` 项，将其信息改成你的 Redis 服务器所在的地址和端口。

我们建议缓存在使用之前都需要预先设定好缓存大小及有效时间，使用文本编辑器打开 caffeine.properties 进行缓存配置，配置方法请参考文件中的注释内容。

例如：default = 1000,30m #定义缓存名 default ，对象大小 1000，缓存数据有效时间 30 分钟。 你可以定义多个不同名称的缓存。

![](https://pic1.zhimg.com/80/v2-8eef11e2c1ffdb947c5cccf897867547_720w.png)

## SealBuilderTool 印章生成工具

####  项目简介：

SealBuilderTool是使用javafx开发的一款印章生成工具，可快速生成各种样式印章。



####  ![](https://gitee.com/xwintop/x-SealBuilderTool/raw/master/images/%E5%8D%B0%E7%AB%A0%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7.png)

![](https://gitee.com/xwintop/x-SealBuilderTool/raw/master/images/%E5%8D%B0%E7%AB%A0%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7.gif)

## **DC3**

- 项目简介

  DC3是基于Spring Cloud的开源可分布式物联网(IOT)平台,用于快速开发、部署物联设备接入项目,是一整套物联系统解决方案。

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/iot-dc3-logo.png)

- 产品截图

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/demo/1.png)

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/demo/2.png)

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/demo/3.png)

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/demo/5.png)

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/demo/8.png)

![](https://gitee.com/pnoker/dc3-web/raw/master/dc3/images/demo/12.png)




