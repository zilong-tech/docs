---
title: 接口重试机制 Spring-Retry
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
在实际工作中，重处理是一个非常常见的场景，比如:

- 发送消息失败。
- 调用远程服务失败。

这些错误可能是因为网络波动造成的，等待过后重处理就能成功。通常来说，会用try/catch，while循环之类的语法来进行重处理，但是这样的做法缺乏统一性，要多写很多重复代码。

```java
public String doSth(String param) {
    int count = 0;
    String result = "";
    while (count < 3) {
        try {
            result = retryRequestService.request(param);
            break;
        } catch (Exception e) {
            count++;
        }
    }
    return "响应是" + result;
}
```

spring-retry 可以通过注解，在不入侵原有业务逻辑代码的方式下，优雅的实现重处理功能。

spring-retry 是 Spring 全家桶中提供的开源重试框架，如果你用的是 Spring Boot 项目，那么接入起来会非常简单，只需要三步即可实现快速接入。

### 引入依赖

```
<dependency>
  <groupId>org.springframework.retry</groupId>
  <artifactId>spring-retry</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### 启动类添加注解

在启动类上加注解 @EnableRetry，让 Spring Boot 项目支持 spring-retry 的重试功能。

```java
@SpringBootApplication
@EnableRetry
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);

    }
}
```

### 方法上添加 `@Retryable`

```java
@Retryable(value = Exception.class, maxAttempts = 5, backoff = @Backoff(delay = 100))
public void retry(int code) throws Exception {

    System.out.println("test被调用,时间："+ LocalDateTime.now());
    // 模拟异常
    if (code == 0){
   		 throw new Exception("===========出现异常了！===========");
    }
    System.out.println("方法执行结束=============");
}
```

调用方法：

```
@RequestMapping(value = "/test")
public void test(int code) throws Exception {
     cityService.retry(code);
}
```

输出结果：

> test被调用,时间：2022-12-06T10:56:20.081
> test被调用,时间：2022-12-06T10:56:20.183
> test被调用,时间：2022-12-06T10:56:20.293
> test被调用,时间：2022-12-06T10:56:20.404
> test被调用,时间：2022-12-06T10:56:20.521
> 2022-12-06 10:56:20.525 ERROR 16696 --- [nio-8080-exec-1] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is java.lang.Exception: ===========出现异常了！===========] with root cause

解释下注解中参数的定义：

value：抛出指定异常才会重试
include：和value一样，默认为空，当exclude也为空时，默认所有异常
exclude：指定不处理的异常
maxAttempts：最大重试次数，默认3次
backoff：重试等待策略，默认使用@Backoff，@Backoff的value默认为1000(单位毫秒)，我们设置为2000；multiplier（指定延迟倍数）默认为0，表示固定暂停1秒后进行重试，如果把multiplier设置为1.5，则第一次重试为2秒，第二次为3秒，第三次为4.5秒。

backoff = @Backoff(delay = 100) delay=100 意味着下一次的重试，要等 100 毫秒之后才能执行。


如果重试耗尽仍然失败，应该怎么处理？

当重试耗尽时，`RetryOperations`可以将控制传递给另一个回调，即`RecoveryCallback`。`Spring-Retry`还提供了`@Recover`注解，用于@Retryable重试失败后处理方法。回调方法不是必要的。

```java
    @Recover
    public void recover(Exception e, int code){
        System.out.println("回调方法执行！！！！");
        System.out.println("retryParam参数值为："+ code);
        //记日志到数据库 或者调用其余的方法
        System.out.println("异常信息:"+e.getMessage());

    }
```

回调方法的参数可以可选地包括抛出的异常和（可选）传递给原始可重试方法的参数。

回调方法注意事项：

- 方法的返回值必须与@Retryable方法一致
- 方法的第一个参数，必须是Throwable类型的，建议是与@Retryable配置的异常一致
- 回调方法与重试方法写在同一个类里面

测试效果：

> test被调用,时间：2022-12-06T11:37:39.272
> test被调用,时间：2022-12-06T11:37:39.386
> test被调用,时间：2022-12-06T11:37:39.497
> test被调用,时间：2022-12-06T11:37:39.604
> test被调用,时间：2022-12-06T11:37:39.712
> 回调方法执行！！！！
> retryParam参数值为：0
> 异常信息:===========出现异常了！===========