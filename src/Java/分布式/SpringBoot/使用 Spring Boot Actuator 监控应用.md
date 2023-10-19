---
title: 使用 Spring Boot Actuator 监控应用
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
在微服务中，大部分功能模块都是运行在不同的机器上，出现了异常如何快速定位是哪个环节出现了问题？

所以应用的监控很重要！

本文主要结合 Spring Boot Actuator，跟大家一起分享微服务 Spring Boot Actuator 的常见用法，方便我们在日常中对我们的微服务进行监控治理。

### Actuator介绍

Actuator 是 Spring Boot 提供的对应用系统的自省和监控的集成功能，借助Actuator 开发者可以很方便的对应用系统某些指标进行监控统计。

Actuator 的核心是端点 Endpoint，它用来监视应用程序及交互，spring-boot-actuator 中已经内置了非常多的 Endpoint（health、info、beans、metrics、httptrace、shutdown等等），同时也允许我们自己扩展自己的 Endpoints。每个 Endpoint 都可以启用和禁用。要远程访问 Endpoint，还必须通过 JMX 或 HTTP 进行暴露，大部分应用选择HTTP。

本文基于spring boot 2.X介绍。

### 常用接口

/**actuator**

展示所有端点

```json
{
	"_links": {
		"self": {
			"href": "http://127.0.0.1:8080/actuator",
			"templated": false
		},
		"nacosconfig": {
			"href": "http://127.0.0.1:8080/actuator/nacosconfig",
			"templated": false
		},
		"nacosdiscovery": {
			"href": "http://127.0.0.1:8080/actuator/nacosdiscovery",
			"templated": false
		},
		"sentinel": {
			"href": "http://127.0.0.1:8080/actuator/sentinel",
			"templated": false
		},
		"beans": {
			"href": "http://127.0.0.1:8080/actuator/beans",
			"templated": false
		},
		"caches": {
			"href": "http://127.0.0.1:8080/actuator/caches",
			"templated": false
		},
		"caches-cache": {
			"href": "http://127.0.0.1:8080/actuator/caches/{cache}",
			"templated": true
		},
		"health": {
			"href": "http://127.0.0.1:8080/actuator/health",
			"templated": false
		},
		"health-path": {
			"href": "http://127.0.0.1:8080/actuator/health/{*path}",
			"templated": true
		},
		"info": {
			"href": "http://127.0.0.1:8080/actuator/info",
			"templated": false
		},
		"conditions": {
			"href": "http://127.0.0.1:8080/actuator/conditions",
			"templated": false
		},
		"configprops-prefix": {
			"href": "http://127.0.0.1:8080/actuator/configprops/{prefix}",
			"templated": true
		},
		"configprops": {
			"href": "http://127.0.0.1:8080/actuator/configprops",
			"templated": false
		},
		"env": {
			"href": "http://127.0.0.1:8080/actuator/env",
			"templated": false
		},
		"env-toMatch": {
			"href": "http://127.0.0.1:8080/actuator/env/{toMatch}",
			"templated": true
		},
		"loggers-name": {
			"href": "http://127.0.0.1:8080/actuator/loggers/{name}",
			"templated": true
		},
		"loggers": {
			"href": "http://127.0.0.1:8080/actuator/loggers",
			"templated": false
		},
		"heapdump": {
			"href": "http://127.0.0.1:8080/actuator/heapdump",
			"templated": false
		},
		"threaddump": {
			"href": "http://127.0.0.1:8080/actuator/threaddump",
			"templated": false
		},
		"metrics": {
			"href": "http://127.0.0.1:8080/actuator/metrics",
			"templated": false
		},
		"metrics-requiredMetricName": {
			"href": "http://127.0.0.1:8080/actuator/metrics/{requiredMetricName}",
			"templated": true
		},
		"scheduledtasks": {
			"href": "http://127.0.0.1:8080/actuator/scheduledtasks",
			"templated": false
		},
		"mappings": {
			"href": "http://127.0.0.1:8080/actuator/mappings",
			"templated": false
		},
		"refresh": {
			"href": "http://127.0.0.1:8080/actuator/refresh",
			"templated": false
		},
		"features": {
			"href": "http://127.0.0.1:8080/actuator/features",
			"templated": false
		},
		"serviceregistry": {
			"href": "http://127.0.0.1:8080/actuator/serviceregistry",
			"templated": false
		}
	}
}
```

**actuator/health**

health 主要用来检查应用的运行状态，这是我们使用最高频的一个监控点。通常使用此接口提醒我们应用实例的运行状态，以及应用不”健康“的原因，比如数据库连接、磁盘空间不够等。

默认情况下 health 的状态是开放的，添加依赖后启动项目，访问：`http://localhost:8080/actuator/health`即可看到应用的状态。

```javascript
{	
    "status" : "UP"	
}
```

默认情况下，最终的 Spring Boot 应用的状态是由 HealthAggregator 汇总而成的，汇总的算法是：

- 1 设置状态码顺序： `setStatusOrder(Status.DOWN, Status.OUT_OF_SERVICE, Status.UP, Status.UNKNOWN);`。
- 2 过滤掉不能识别的状态码。
- 3 如果无任何状态码，整个 Spring Boot 应用的状态是 UNKNOWN。
- 4 将所有收集到的状态码按照 1 中的顺序排序。
- 5 返回有序状态码序列中的第一个状态码，作为整个 Spring Boot 应用的状态。

health 通过合并几个健康指数检查应用的健康情况。Spring Boot Actuator 有几个预定义的健康指标比如`DataSourceHealthIndicator`, `DiskSpaceHealthIndicator`, `MongoHealthIndicator`, `RedisHealthIndicator`等，它使用这些健康指标作为健康检查的一部分。

举个例子，如果你的应用使用 Redis，`RedisHealthindicator` 将被当作检查的一部分；如果使用 MongoDB，那么`MongoHealthIndicator` 将被当作检查的一部分。

```
management:
  endpoint:
    health:
      enabled: true
      show-details: always
```

**actuator/info**

info 就是我们自己配置在配置文件中以 info 开头的配置信息，比如我们在示例项目中的配置是：

```javascript
info.app.name=spring-boot-actuator	

info.app.version= 1.0.0	

info.app.test= test
```

启动示例项目，访问：`http://localhost:8080/actuator/info`返回部分信息如下：

```javascript
{	

  "app": {	

    "name": "spring-boot-actuator",	

    "version": "1.0.0",	

    "test":"test"	
  }	

}
```

**actuator/beans**

展示了 bean 的别名、类型、是否单例、类的地址、依赖等信息。

访问：`http://localhost:8080/actuator/beans`返回部分信息如下：

```json
[	
  {	
    "context": "application:8080:management",	
    "parent": "application:8080",	
    "beans": [	
      {	
        "bean": "embeddedServletContainerFactory",	
        "aliases": [	
 
	
        ],	
        "scope": "singleton",	
        "type": "org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory",	
        "resource": "null",	
        "dependencies": [	
 
	
        ]	
      },	
      {	
        "bean": "endpointWebMvcChildContextConfiguration",	
        "aliases": [	
 
	
        ],	
        "scope": "singleton",	
        "type": "org.springframework.boot.actuate.autoconfigure.EndpointWebMvcChildContextConfiguration$$EnhancerBySpringCGLIB$$a4a10f9d",	
        "resource": "null",	
        "dependencies": [	
 
	
        ]	
      }	
  }	
]
```

**actuator/conditions**

Spring Boot 的自动配置功能非常便利，但有时候也意味着出问题比较难找出具体的原因。使用 conditions 可以在应用运行时查看代码了某个配置在什么条件下生效，或者某个自动配置为什么没有生效。

启动示例项目，访问：`http://localhost:8080/actuator/conditions`返回部分信息如下：

```json
{	
    "positiveMatches": {	
     "DevToolsDataSourceAutoConfiguration": {	
            "notMatched": [	
                {	
                    "condition": "DevToolsDataSourceAutoConfiguration.DevToolsDataSourceCondition",	
                    "message": "DevTools DataSource Condition did not find a single DataSource bean"	
                }	
            ],	
            "matched": [ ]	
        },	
        "RemoteDevToolsAutoConfiguration": {	
            "notMatched": [	
                {	
                    "condition": "OnPropertyCondition",	
                    "message": "@ConditionalOnProperty (spring.devtools.remote.secret) did not find property 'secret'"	
                }	
            ],	
            "matched": [	
                {	
                    "condition": "OnClassCondition",	
                    "message": "@ConditionalOnClass found required classes 'javax.servlet.Filter', 'org.springframework.http.server.ServerHttpRequest'; @ConditionalOnMissingClass did not find unwanted class"	
                }	
            ]	
        }	
    }	
}
```

**actuator/heapdump**

下载一个 压缩的 JVM 堆 dump文件。

**mappings**

描述全部的 URI 路径，以及它们和控制器的映射关系。

```json
{	
  "/**/favicon.ico": {	
    "bean": "faviconHandlerMapping"	
  },	
  "{[/hello]}": {	
    "bean": "requestMappingHandlerMapping",	
    "method": "public java.lang.String com.neo.controller.HelloController.index()"	
  },	
  "{[/error]}": {	
    "bean": "requestMappingHandlerMapping",	
    "method": "public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> org.springframework.boot.autoconfigure.web.BasicErrorController.error(javax.servlet.http.HttpServletRequest)"	
  }	
}
```

**actuator/threaddump**

threaddump 接口会生成当前线程活动的快照。方便我们在日常定位问题的时候查看线程的情况。主要展示了线程名、线程 ID、线程的状态、是否等待锁资源等信息。

启动示例项目，访问：`http://localhost:8080/actuator/threaddump`返回部分信息如下：

```json
[	
  {	
    "threadName": "http-nio-8088-exec-6",	
    "threadId": 49,	
    "blockedTime": -1,	
    "blockedCount": 0,	
    "waitedTime": -1,	
    "waitedCount": 2,	
    "lockName": "java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject@1630a501",	
    "lockOwnerId": -1,	
    "lockOwnerName": null,	
    "inNative": false,	
    "suspended": false,	
    "threadState": "WAITING",	
    "stackTrace": [	
      {	
        "methodName": "park",	
        "fileName": "Unsafe.java",	
        "lineNumber": -2,	
        "className": "sun.misc.Unsafe",	
        "nativeMethod": true	
      },	
      ...	
      {	
        "methodName": "run",	
        "fileName": "TaskThread.java",	
        "lineNumber": 61,	
        "className": "org.apache.tomcat.util.threads.TaskThread$WrappingRunnable",	
        "nativeMethod": false	
      }	
      ...	
    ],	
    "lockInfo": {	
      "className": "java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject",	
      "identityHashCode": 372286721	
    }	
  }	
  ...	
]
```

### /actuator/shutdown

开启接口优雅关闭 Spring Boot 应用，要使用这个功能首先需要在配置文件中开启：

```javascript
management.endpoint.shutdown.enabled=true
```

配置完成之后，启动示例项目，使用 curl 模拟 post 请求访问 shutdown 接口。

> shutdown 接口默认只支持 post 请求。

```javascript
curl -X POST "http://localhost:8080/actuator/shutdown"	

{	

    "message": "Shutting down, bye..."	

}
```

此时你会发现应用已经被关闭。

### 快速上手

引入依赖

```
<dependency>	
      <groupId>org.springframework.boot</groupId>	
      <artifactId>spring-boot-starter-actuator</artifactId>	
  </dependency>	
```

配置文件

```
management:
  endpoints:
    web:
      exposure:
        #开启所有监控
        include: "*"
```

```
 management:
  endpoints:
    # 暴露 EndPoint 以供访问，有jmx和web两种方式，exclude 的优先级高于 include
    jmx:
      exposure:
        exclude: '*'
        include: '*'
    web:
      exposure:
      # exclude: '*'
        include: ["health","info","beans","mappings","logfile","metrics","shutdown","env"]
      base-path: /actuator  # 配置 Endpoint 的基础路径
      cors: # 配置跨域资源共享
        allowed-origins: http://example.com
        allowed-methods: GET,POST
    enabled-by-default: true # 修改全局 endpoint 默认设置
  endpoint:
    auditevents: # 1、显示当前引用程序的审计事件信息，默认开启
      enabled: true
      cache:
        time-to-live: 10s # 配置端点缓存响应的时间
    beans: # 2、显示一个应用中所有 Spring Beans 的完整列表，默认开启
      enabled: true
    conditions: # 3、显示配置类和自动配置类的状态及它们被应用和未被应用的原因，默认开启
      enabled: true
    configprops: # 4、显示一个所有@ConfigurationProperties的集合列表，默认开启
      enabled: true
    env: # 5、显示来自Spring的 ConfigurableEnvironment的属性，默认开启
      enabled: true
    flyway: # 6、显示数据库迁移路径，如果有的话，默认开启
      enabled: true
    health: # 7、显示健康信息，默认开启
      enabled: true
      show-details: always
    info: # 8、显示任意的应用信息，默认开启
      enabled: true
    liquibase: # 9、展示任何Liquibase数据库迁移路径，如果有的话，默认开启
      enabled: true
    metrics: # 10、展示当前应用的metrics信息，默认开启
      enabled: true
    mappings: # 11、显示一个所有@RequestMapping路径的集合列表，默认开启
      enabled: true
    scheduledtasks: # 12、显示应用程序中的计划任务，默认开启
      enabled: true
    sessions: # 13、允许从Spring会话支持的会话存储中检索和删除(retrieval and deletion)用户会话。使用Spring Session对反应性Web应用程序的支持时不可用。默认开启。
      enabled: true
    shutdown: # 14、允许应用以优雅的方式关闭，默认关闭
      enabled: true
    threaddump: # 15、执行一个线程dump
      enabled: true
    # web 应用时可以使用以下端点
    heapdump: # 16、    返回一个GZip压缩的hprof堆dump文件，默认开启
      enabled: true
    jolokia: # 17、通过HTTP暴露JMX beans（当Jolokia在类路径上时，WebFlux不可用），默认开启
      enabled: true
    logfile: # 18、返回日志文件内容（如果设置了logging.file或logging.path属性的话），支持使用HTTP Range头接收日志文件内容的部分信息，默认开启
      enabled: true
    prometheus: #19、以可以被Prometheus服务器抓取的格式显示metrics信息，默认开启
      enabled: true
```

您可以按如下方式公开所有端点：management.endpoints.web.exposure.include=*
您可以通过以下方式显式启用/shutdown端点：management.endpoint.shutdown.enabled=true
要公开所有（已启用）网络端点除env端点之外：
management.endpoints.web.exposure.include=*
management.endpoints.web.exposure.exclude=env