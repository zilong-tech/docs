---
title: Spring Cloud Gateway
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
**Spring Cloud Gateway**

网关作为流量的入口，常用的功能包括路由转发，权限校验，限流等。 

Spring Cloud Gateway 旨在为微服务架构提供一种简单且有效的 API 路由的管理方式，并基于 Filter 的方式提供网关的基本功能，例如说安全认证、监控、限流等等。 

Spring Cloud Gateway 提供更优秀的性能，更强大的有功能。 

### **核心概念**

- 路由（route) 

路由是网关中最基础的部分，路由信息包括一个ID、一个目的URI、一组断言工厂、一组Filter组成。如果断言为真，则说 明请求的URL和配置的路由匹配。 

- 断言(predicates) 

Java8中的断言函数，SpringCloud Gateway中的断言函数类型是Spring5.0框架中的ServerWebExchange。断言函数允 许开发者去定义匹配Http request中的任何信息，比如请求头和参数等。 

- 过滤器（Filter) 

SpringCloud Gateway中的filter分为Gateway FilIer和Global Filter。Filter可以对请求和响应进行处理。 

### 工作原理



![](https://pic1.zhimg.com/80/v2-eb5a41dbfa61c99d1418d62b8a83d2b5_720w.png)

客户端向 Spring Cloud Gateway 发出请求，如果请求与网关程序定义的路由匹配，则该请求就会被发送到网关 Web 处理程序，此时处理程序运行特定的请求过滤器链。 

过滤器之间用虚线分开的原因是过滤器可能会在发送代理请求的前后执行逻辑。所有 pre 过滤器逻辑先执行，然后执行代理请求；代理请求完成后，执行 post 过滤器逻辑。

### 网关配置

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: lb:服务名称  #lb 整合负载均衡器ribbon,loadbalancer
        predicates: #断言
        - Path=XXXX #URL
        - name: Cookie
          args:
            name: mycookie
            regexp: mycookievalue
```

#### 断言工厂

1、时间匹配

```
predicates: 

# 匹配在指定的日期时间之后发生的请求 入参是ZonedDateTime类型 

 ‐ After=2021‐01‐31T22:22:07.783+08:00[Asia/Shanghai] 
```

获取ZonedDateTime类型的指定日期时间 

```
ZonedDateTime zonedDateTime = ZonedDateTime.now();//默认时区 

// 用指定时区获取当前时间 
ZonedDateTime zonedDateTime2 = ZonedDateTime.now(ZoneId.of("Asia/Shanghai")); 
```

适用场景：秒杀活动，某个时间点后活动开始

在设置时间之前访问，404

![](https://pic2.zhimg.com/80/v2-05d94193c4da629ca161b900df8eb5e6_720w.png)

2、cookie、header等匹配

```
      routes:
      - id: order_route  #路由ID，全局唯一，建议配合服务名
        uri: lb://mall-order  #lb 整合负载均衡器ribbon,loadbalancer
        #断言
        predicates:
    
        # Cookie匹配
        - Cookie=username, test
        # Header匹配  请求中带有请求头名为 x-request-id，其值与 \d+ 正则表达式匹配
        - Header=X-Request-Id, \d+
```

3、路径匹配

```
      routes:
      - id: order_route  #路由ID，全局唯一，建议配合服务名
        uri: lb://mall-order  #lb 整合负载均衡器ribbon,loadbalancer
        predicates:
        #Path路径匹配
        - Path=/order/**
```

> 其他配置可以参考官网配置：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories 

4、自定义断言工厂

自定义路由断言工厂需要继承 AbstractRoutePredicateFactory 类，重写 apply 方法的逻辑。在 apply 方法中可以 通过 serverWebExchange.getRequest() 拿到 ServerHttpRequest 对象，从而可以获取到请求的参数、请求方式、请求头等信息。

注意： 命名需要以 RoutePredicateFactory 结尾 

```java
@Component
@Slf4j
public class CheckAuthRoutePredicateFactory extends
        AbstractRoutePredicateFactory<CheckAuthRoutePredicateFactory.Config> {

    public CheckAuthRoutePredicateFactory() {
        super(Config.class);
    }

    @Override
    public Predicate<ServerWebExchange> apply(Config config) {
        return new GatewayPredicate() {

            @Override
            public boolean test(ServerWebExchange serverWebExchange) {
                log.info("调用CheckAuthRoutePredicateFactory" + config.getName());
                ServerHttpRequest request = serverWebExchange.getRequest();

                if(config.getName().equals("test")){
                    return true;
                }
                
                return false;
            }
        };
    }
    
    
    /**
     * 快捷配置
     * @return
     */
    @Override
    public List<String> shortcutFieldOrder() {
        return Collections.singletonList("name");
    }

    /**
     * 需要定义一个内部类，该类用于封装application.yml中的配置
     */
    public static class Config {

        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
```

在配置文件中配置：

```
       predicates:
        - Path=/order/**
        #自定义CheckAuth断言工厂
        - CheckAuth=test
```

### 过滤器工厂

SpringCloudGateway 内置了很多的过滤器工厂，我们通过一些过滤器工厂可以进行一些业务逻辑处理器，比如添加剔除响应头，添加去除参数等

1、添加请求头、请求参数

```
  filters:
        - AddRequestHeader=X-Request-color, red  #添加请求头
        - AddRequestParameter=color, blue   # 添加请求参数
```

测试：127.0.0.1:8888/order/testgateway2

```java
@GetMapping("/testgateway2")
public String testGateway(@RequestHeader("X-Request-color") String color1,
                          @RequestParam("color") String color2
                          ) throws Exception {
    log.info("gateWay获取请求头X-Request-color："+color1);
    log.info("gateWay获取请求参数color:"+color2);
    return "success";
}
```

2、重定向

```
 filters:
        - RedirectTo=302, http://baidu.com  #重定向到百度
```

> 更多过滤器操作，请参考官网：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories

3、自定义过滤器

继承AbstractNameValueGatewayFilterFactory且我们的自定义名称必须要以GatewayFilterFactory结尾并交给 spring管理。

```java
@Component
@Slf4j
public class CheckAuthGatewayFilterFactory extends AbstractNameValueGatewayFilterFactory {

    @Override
    public GatewayFilter apply(NameValueConfig config) {
        return (exchange, chain) -> {
            log.info("调用CheckAuthGatewayFilterFactory==="
                    + config.getName() + ":" + config.getValue());
            // TODO
            return chain.filter(exchange);
        };
    }
}
```

yml中配置

```
        filters:
        - CheckAuth=test,男  #配置自定义的过滤器工厂
```

打印：用CheckAuthGatewayFilterFactory===test:男

### 全局过滤器

 GlobalFilter 会作用于所有路由。 

自定义全局过滤器

```java
@Component
@Order(-1)
@Slf4j
public class CheckAuthFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        //校验请求头中的token
        List<String> token = exchange.getRequest().getHeaders().get("token");
        log.info("token:"+ token);
        if (token.isEmpty()){
            return chain.filter(exchange);
        }
        // TODO token校验
        return chain.filter(exchange);
    }
}
```

### 跨域配置

```java
globalcors:
  cors-configurations:
    '[/**]':
      allowedOrigins: "*"
      allowedMethods:
      - GET
      - POST
      - DELETE
      - PUT
      - OPTION
```

