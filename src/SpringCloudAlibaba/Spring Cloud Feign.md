---
title: Spring Cloud Feign
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
### **什么是Feign** 

Feign是Netflix开发的声明式、模板化的HTTP客户端。 Feign可帮助我们更加便捷、优雅地调用HTTP API。 

Feign支持多种注解，例如Feign自带的注解或者JAX-RS注解等。

Spring Cloud openfeign对Feign进行了增强，使其支持Spring MVC注解，另外还整合了Ribbon和Eureka，从而使得Feign的使用更加方便。

**Feign是一个声明式的web服务客户端，让编写web服务客户端变得非常容易，** 只需创建一个接口并在接口上添加注解即可。

Feign可以做到使用 HTTP 请求远程服务时就像调用本地方法一样的体验，开发者完全感知不到这是远程方法，更感知不到这是个 HTTP 请求。它像 Dubbo 一样，consumer 直接调用接口方法调用 provider，而不需要通过常规的 Http Client 构造请求再解析返回数据。它解决了让开发者调用远程接口就跟调用本地方法一样，无需关注与远程的交互细节，更无需关注分布式环境开发。

OpenFeign和Feign的区别：
Feign是SpringCloud中的一个轻量级RestFul的Http客户端，内置了Ribbon，用于客户端负载均衡，使用方法是使用Feign的注解去修饰一个接口，客户端调用这个接口那么久是调用远程的微服务了。
OpenFeign在Feign的基础上支持了SpringMVC的注解，如@RequestMapping等。OpenFeign的@FeigenClient注解可以解析SpringMvc的@RequestMapping注解下的接口，通过动态代理的方式产生实现类，实现类中进行负载均衡的微服务远程调用！

### **Spring Cloud Alibaba快速整合Feign**

引入依赖

```yaml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

编写调用接口+@FeignClient注解，实际开发中，最好单独定义成一个模块，方便引用

```java
@FeignClient(value = "order",path = "/order")
public interface OrderFeignService {

    @RequestMapping("/findOrderByUserId/{userId}")
    R findOrderByUserId(@PathVariable("userId") Integer userId);

}
```

调用端在启动类上添加@EnableFeignClients注解，`@EnableFeignClients`：启用feign进行远程调用

```java
@EnableFeignClients
public class FeignDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeignDemoApplication.class, args);
    }

}
```

4）发起调用，像调用本地方式一样调用远程服务

```java
@Autowired
OrderFeignService orderFeignService;

@RequestMapping(value = "/findOrderByUserId/{id}")
public R  findOrderByUserId(@PathVariable("id") Integer id) {
    //feign调用
    R result = orderFeignService.findOrderByUserId(id);
    return result;
}
```

### spring 通过@Autowired为什么找不到feign接口 

1、没有使用@EnableFeignClients进行扫描；

2、使用了@EnableFeignClients进行扫描，但是该注解没有添加basePackages属性，默认扫描的是当前启动类所在的包及其子包下feign，而使用的feign是第三方提供的，不在扫描路径下；

3、使用了@EnableFeignClients进行扫描，也添加了basePackages属性配置了第三方feign接口所在包路径，但是feign接口定义的方法中，没有添加@RequestMapping等注解；

### 修改负载均衡策略

feign其实不是做负载均衡的,负载均衡是ribbon的功能。

注意下面的代码不能在springboot默认的扫描包路劲下。

```
@Bean
public IRule getRule() {
    return new RandomRule();
}
```

### 日志配置

#### 全局配置

```java
@Configuration  // 全局配置
public class FeignConfig {
    /**
     * 日志级别
     * 通过源码可以看到日志等级有 4 种，分别是：
     * NONE：不输出日志。
     * BASIC：只输出请求方法的 URL 和响应的状态码以及接口执行的时间。
     * HEADERS：将 BASIC 信息和请求头信息输出。
     * FULL：输出完整的请求信息。
     *
     * @return
     */
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
```

日志输出：

> 2022-04-11 15:40:46.731 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] ---> GET http://order/order/findOrderByUserId/2 HTTP/1.1
> 2022-04-11 15:40:46.732 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] Accept-Encoding: gzip
> 2022-04-11 15:40:46.732 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] Accept-Encoding: deflate
> 2022-04-11 15:40:46.732 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] Authorization: 249df155-e75f-4a4e-b682-aee20e4e9d13
> 2022-04-11 15:40:46.732 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] ---> END HTTP (0-byte body)
> 2022-04-11 15:40:47.836 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] <--- HTTP/1.1 200 (1104ms)
> 2022-04-11 15:40:47.836 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] connection: keep-alive
> 2022-04-11 15:40:47.837 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] content-type: application/json
> 2022-04-11 15:40:47.837 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] date: Mon, 11 Apr 2022 07:40:47 GMT
> 2022-04-11 15:40:47.837 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] keep-alive: timeout=60
> 2022-04-11 15:40:47.837 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] transfer-encoding: chunked
> 2022-04-11 15:40:47.837 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] 
> 2022-04-11 15:40:47.862 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] {"msg":"success","code":0,"orders":[{"id":2,"userId":"2","commodityCode":"2","count":0,"amount":0}]}
> 2022-04-11 15:40:47.863 DEBUG 29944 --- [nio-8055-exec-4] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] <--- END HTTP (100-byte body)

生产环境中，尽量不要配置成FULL,配置成BASIC

> 2022-04-11 15:43:11.487 DEBUG 1736 --- [nio-8055-exec-3] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] ---> GET http://order/order/findOrderByUserId/2 HTTP/1.1
> 2022-04-11 15:43:11.571 DEBUG 1736 --- [nio-8055-exec-3] c.t.feigndemo.feign.OrderFeignService    : [OrderFeignService#findOrderByUserId] <--- HTTP/1.1 200 (82ms)

#### 局部配置

```yaml
feign:
  client:
    config:
      order:  #对应微服务
        loggerLevel: FULL
```

### 接口鉴权认证

通常调用的接口都是有权限控制的，很多时候可能认证的值是通过参数去传递的，还有就是通过请求头去传递认证信息，比如 Basic 认证方式。  

每次 feign 发起http调用之前，会去执行拦截器中的逻辑。 

消费端配置拦截器

```java
public class FeignAuthRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        // 业务逻辑  模拟认证逻辑
          String str="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        for(int i=0;i<10;i++) {
            int number = random.nextInt(62);
            sb.append(str.charAt(number));
        }

        String access_token = sb.toString();
        template.header("Authorization",access_token);
    }
}
```

注册拦截器

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    
    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new FeignAuthRequestInterceptor());
    }
    
}
```

服务端配置拦截器

```java
@Slf4j
public class AuthInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        boolean flag = true;
        // 简单的认证逻辑  从请求头中获取Authorization
        String authorization = request.getHeader("Authorization");
        log.info("=========Authorization:"+authorization);
        if (StringUtils.isEmpty(authorization)){
            // 从请求参数中获取access_token
            String access_token = request.getParameter("access_token");
            // TODO 实现逻辑
            if(StringUtils.isEmpty(access_token)){
                flag = false;
            }
        }
        return flag;
    }
}
```

注册拦截器

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    
    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor());
    }
    
}
```

这样在请求时候能收到认证信息

> 2022-04-11 16:23:59.703  INFO 12216 --- [io-8021-exec-10] com.test.interceptor.AuthInterceptor     : =========Authorization:XKBuFhAiIh

注册拦截器也可以通过拦截器

### 接口超时配置

全局配置

```java
@Configuration
public class FeignConfig {
    @Bean
    public Request.Options options() {
        // connectTimeoutMillis readTimeoutMillis
        return new Request.Options(5000, 5000);
    }
}
```

局部配置，针对不同微服务

```yaml
feign:
  client:
    config:
      order:  #对应微服务
        requestInterceptors[0]:  #配置拦截器
          com.test.feigndemo.interceptor.FeignAuthRequestInterceptor
        # 连接超时时间，默认2s
        connectTimeout: 3000
        # 请求处理超时时间，默认5s
        readTimeout: 1000
```

### 重试配置

Feign在调用外部服务的时候，偶尔会出现  **SocketException: Connection reset 、NoHttpResponseException: xxxxxx failed to respond 等异常，**而这些异常并非是因为服务提供方服务不可用，或者负载过高引起的，百度查了查大概原因说是因为在Client 和Server建立链接之后Server端在数据为正常响应之前就关闭了链接导致的异常。

Feign 调用发起请求处理类 SynchronousMethodHandler 重试代码如下：

![](https://upload-images.jianshu.io/upload_images/6819280-c8d5d31b87b9c156.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

 Retryer 则是 Feign 的重试策略接口，默认Feign 配置的重试策略是 Retryer.NEVER_RETRY 也就是不走重试，直接异常报错。

**需要注意几点：**
 1.Feign默认配置是不走重试策略的，当发生RetryableException异常时直接抛出异常。
 2.并非所有的异常都会触发重试策略，只有 RetryableException 异常才会触发异常策略。
 3.在默认Feign配置情况下，只有在网络调用时发生 IOException 异常时，才会抛出 RetryableException，也是就是说链接超时、读超时等不不会触发此异常。

因此常见的 SocketException、NoHttpResponseException、UnknownHostException、HttpRetryException、SocketConnectException、ConnectionClosedException 等异常都可触发Feign重试机制。


#### 默认重试设置

全局配置：

```java
    @Bean
    public Retryer feignRetryer() {
        //最大请求次数为5，初始间隔时间为100ms，下次间隔时间1.5倍递增，重试间最大间隔时间为1s，
        return new Retryer.Default();
    }
```

#### 自定义重试配置

局部配置：

```java
import feign.RetryableException;
import feign.Retryer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static java.util.concurrent.TimeUnit.SECONDS;

@Slf4j
@Component
public  class CommonFeignRetry extends Retryer.Default {


    public CommonFeignRetry() {
        //重试10次 最大间隔时间1秒
        this(100, SECONDS.toMillis(1), 10);
    }
 
    public CommonFeignRetry(long period, long maxPeriod, int maxAttempts) {
        super(period, maxPeriod, maxAttempts);
    }

    @Override
    public void continueOrPropagate(RetryableException e) {

        log.warn("【FeignRetryAble】Message【{}】", e.getMessage());
        super.continueOrPropagate(e);
    }

 
    @Override
    public Retryer clone() {
        return new CommonFeignRetry();
    }
}
```

指定FeignClient走重试策略：

```
}
@FeignClient(name = "test-service", contextId = "testClient",
fallbackFactory = FmsBaseClientFallbackFactory.class, configuration = CommonFeignRetryConfig.class)
```

也可以在配置文件中指定：

```yaml
feign:
  client:
    config:
      feignName:
        connectTimeout: 5000
        readTimeout: 5000
        loggerLevel: full
        errorDecoder: com.example.SimpleErrorDecoder
        retryer: com.example.SimpleRetryer
```

全局配置：

```java
   @Bean
    Retryer getRetry() {
        return new CommonFeignRetry();
    }

```



### 客户端组件配置

Feign 中默认使用 JDK 原生的 URLConnection 发送 HTTP 请求，可以集成别的组件来替换掉 URLConnection，比如 Apache HttpClient，OkHttp。

####  **配置Apache HttpClient**

```yaml
<!-- Apache HttpClient -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.7</version>
</dependency>
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
    <version>10.1.0</version>
</dependency>
```

原理是 spring boot 自动装配

```java
//org.springframework.cloud.openfeign.FeignAutoConfiguration
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(ApacheHttpClient.class)
@ConditionalOnMissingClass("com.netflix.loadbalancer.ILoadBalancer")
@ConditionalOnMissingBean(CloseableHttpClient.class)
@ConditionalOnProperty(value = "feign.httpclient.enabled", matchIfMissing = true)
protected static class HttpClientFeignConfiguration {
```

#### **配置 OkHttp**

```yaml
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency>
```

```yaml
feign:
  #feign 使用 okhttp
  httpclient:
    enabled: false
  okhttp:
    enabled: true
```

源码：

```java
//org.springframework.cloud.openfeign.FeignAutoConfiguration
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(OkHttpClient.class)
@ConditionalOnMissingClass("com.netflix.loadbalancer.ILoadBalancer")
@ConditionalOnMissingBean(okhttp3.OkHttpClient.class)
@ConditionalOnProperty("feign.okhttp.enabled")
protected static class OkHttpFeignConfiguration {
```

### 压缩配置

开启压缩可以有效节约网络资源，提升接口性能，我们可以配置 GZIP 来压缩数据

```yaml
feign:
    compression:
      request:
        enabled: true
        # 配置压缩的类型
        mime-types: text/xml,application/xml,application/json
        # 最小压缩值
        min-request-size: 2048
      response:
        enabled: true
```

###  **编码器解码器配置**

Feign 中提供了自定义的编码解码器设置，同时也提供了多种编码器的实现，比如 Gson、Jaxb、Jackson。我们可以用不同的编码解码器来处理数据的传输。如果你想传输 XML 格式的数据，可以自定义 XML 编码解码器来实现获取使用官方提供的 Jaxb。

```java
@Bean
public Decoder decoder() {
    return new JacksonDecoder();
}
@Bean
public Encoder encoder() {
    return new JacksonEncoder();
}
```

**yml配置方式**

```yaml
feign:
  client:
    config:
      order:  #对应微服务

        # 配置编解码器
        encoder: feign.jackson.JacksonEncoder
        decoder: feign.jackson.JacksonDecoder
```

