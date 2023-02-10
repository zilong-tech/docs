---
title: sentinel 实战
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
### 并发对系统的影响

当一个系统的架构设计采用微服务架构模式时，会将庞大而复杂的业务拆分成一个个微服务，各个微服务之间互相调用。在调用的过程中，就会涉及到网路的问题，再加上微服务自身的原因，例如很难做到100%的高可用等。

![](https://note.youdao.com/yws/public/resource/2dcecdcc67311fe752754b252bd457c2/xmlnote/DD9EFA4484774C4D80390D48BDC22F0C/16338)

如果某一个服务不可用或者宕机了，就会出现线程池里所有线程都因等待响应而被阻塞, 从而造成服务雪崩. 

![](https://note.youdao.com/yws/public/resource/2dcecdcc67311fe752754b252bd457c2/xmlnote/B457BC7FDFE843099DD9B21A701F147E/16341)

### 服务雪崩

服务提供者的不可用导致服务调用者的不可用,并将不可用逐渐放大的过程，就叫服务雪崩效应。

由于业务之间往往具有复杂的依赖和调别关系，因此，微服务中的各个子服务之间的依赖关系也较为复杂。比如上游某个子服务因网络故障或者操作系统资源不足出现接口调用异常，则将导致下游服务也出现服务异常;此时，如果上游服务没有很好的请求拒绝策略，则会导致请求不断增加，大量的请求和、压不但会导致当前服务若机，还可能导致下游服务省机，继而引起雪崩效应。

导致雪崩效应的最根本原因是：大量请求线程同步等待造成的资源耗尽。当服务调用者使用同步调用时, 会产生大量的等待线程占用系统资源。一旦线程资源被耗尽,服务调用者提供的服务也将处于不可用状态, 于是服务雪崩效应产生了。

#### 服务雪崩产生过程

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202208181452893.png)



正常情况 , 一个请求进入C , C会从线程池中申请一个线程处理 , 然后请求B , 同时线程等待 ; B服务收到请求同样申请线程然后请求A , A处理完成返程结果并归还释放A自身的线程 , 然后BC依次完成响应并归/释放还线程。

A故障后 , B的线程请求A后 , 迟迟未得响应 , 线程阻塞等待

C继续接收大量请求并传给B , 导致B大量阻塞线程等待 , 直到线程资源耗尽 , 无法接收新的请求 . B服务故障

故障继续蔓延 , C的线程资源耗尽后 , 一个请求再也不能完成 . 整个微服务宕机

#### 服务雪崩产生原因

**服务提供者不可用**
硬件故障：服务器主机死机 , 或网络硬件故障导致服务提供者无法及时处理和相应
程序故障 : 缓存击穿 , 缓存应用重启或故障导致所有缓存被清空 , 或者大量缓存同时过期 , 导致大量请求直击后端(文件或数据库) , 造成服务提供者超负荷运行导致瘫痪 ; 高并发请求 , 在某些场景下 , 例如秒杀和大促销之前 , 如果没有做好应对措施 , 用户的大量请求也会导致服务故障。

在服务提供者不可用的时候，会出现大量重试的情况：用户重试、代码逻辑重试，这些重试最终导致：进一步加大请求流量。所以归根结底导致雪崩效应的最根本原因是：大量请求线程同步等待造成的资源耗尽。当服务调用者使用同步调用时, 会产生大量的等待线程占用系统资源。一旦线程资源被耗尽,服务调用者提供的服务也将处于不可用状态, 于是服务雪崩效应产生了。

**流量激增**
用户重试 : 用户忍不了界面上的一直加载或等待 , 频繁刷新页面或提交表单 , 这是在秒杀场景下的常规操作
代码逻辑重试 : 在消费者服务中存在大量不合理的重试逻辑 , 比如各种异常的重试机制等

**服务消费者不可用**
大量的等待线程占用系统资源 , 一旦资源被耗尽 , 消费者这边也会发生连锁反应 , 然后会导致故障向下蔓延

**缓存击穿**

一般发生在缓存应用重启, 缓存失效时高并发，所有缓存被清空时,以及短时间内大量缓存失效时。大量的缓存不命中, 使请求直击后端,造成服务提供者超负荷运行,引起服务不可用。

### 服务容错方案

为了最大程度的预防服务雪崩，组成整体系统的各个微服务需要支持服务容错的功能。

常见的服务错误方案包含：服务限流、服务隔离、服务超时、服务熔断和服务降级等。

#### 服务超时

服务超时就是在上游服务调用下游服务时，设置一个最大响应时间，如果超过这个最大响应时间下游服务还未返回结果，则断开上游服务与下游服务之间的请求连接，释放资源。由于释放资源速度较快，一定程度上可以抑制资源耗尽的问题。

![](https://img2020.cnblogs.com/blog/955092/202010/955092-20201013164546191-1392084890.png)

#### 服务限流

服务限流就是限制进入系统的流量，以防止进入系统的流量过大而压垮系统。这样可以更好的保证核心服务提供者不出问题，对于一些出问题的服务可以限制流量访问，只分配固定线程资源访问，这样能使整体的资源不至于被出问题的服务耗尽，进而整个系统雪崩。其主要的作用就是保护服务节点或者集群后面的数据节点，防止瞬时流量过大使服务崩溃。

常见的限流算法有：令牌桶、漏桶。计数器也可以用来进行粗暴限流实现。

![](https://img2020.cnblogs.com/blog/955092/202010/955092-20201013164827194-484685993.png)

#### 资源隔离

将系统按照一定的规则划分为若干个服务模块，各个模块之间相对独立，无强依赖。当有故障发生时，能将问题和影响隔离在某个模块内部，而不扩散风险，不涉及其他模块，不影响整体的系统服务。常见的隔离方式有：线程池隔离和信号量隔离。

![](https://img2020.cnblogs.com/blog/955092/202010/955092-20201013164412057-11798581.png)

##### 信号量模式

　　在该模式下，接收请求和执行下游依赖在同一个线程内完成，不存在线程上下文切换所带来的性能开销，所以大部分场景应该选择信号量模式。

##### 线程池模式

　　在该模式下，用户请求会被提交到各自的线程池中执行，把执行每个下游服务的线程分离，从而达到资源隔离的作用。当线程池来不及处理并且请求队列塞满时，新进来的请求将快速失败，可以避免依赖问题扩散。

| 隔离方式   | 是否支持超时                                                 | 是否支持熔断                                                 | 隔离原理             | 是否是异步调用                         | 资源消耗                                     |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------- | -------------------------------------- | -------------------------------------------- |
| 线程池隔离 | 支持，可直接返回                                             | 支持，当线程池到达maxSize后，再请求会触发fallback接口进行熔断 | 每个服务单独用线程池 | 可以是异步，也可以是同步。看调用的方法 | 大，大量线程的上下文切换，容易造成机器负载高 |
| 信号量隔离 | 不支持，如果阻塞，只能通过调用协议（如：socket超时才能返回） | 支持，当信号量达到maxConcurrentRequests后。再请求会触发fallback | 通过信号量的计数器   | 同步调用，不支持异步                   | 小，只是个计数器                             |

#### **服务熔断**

在分布式与微服务系统中，如果下游服务因为访问压力过大导致响应很慢或者一直调用失败时，上游服务为了保证系统的整体可用性，会暂时断开与下游服务的调用连接。这种方式就是熔断。

当依赖的服务有大量超时时，在让新的请求去访问根本没有意义，只会消耗现有资源。比如我们设置了超时时间为1s,如果短时间内有大量请求在1s内都得不到响应，就意味着这个服务出现了异常，此时就没有必要再让其他的请求去访问这个依赖了，这个时候就应该使用断路器避免资源浪费。

服务熔断一般情况下会有三种状态：关闭、开启和半熔断。

- 关闭状态：服务一切正常，没有故障时，上游服务调用下游服务时，不会有任何限制。
- 开启状态：上游服务不再调用下游服务的接口，会直接返回上游服务中预定的方法。
- 半熔断状态：处于开启状态时，上游服务会根据一定的规则，尝试恢复对下游服务的调用。此时，上游服务会以有限的流量来调用下游服务，同时，会监控调用的成功率。如果成功率达到预期，则进入关闭状态。如果未达到预期，会重新进入开启状态。

![](https://note.youdao.com/yws/public/resource/2dcecdcc67311fe752754b252bd457c2/xmlnote/7D1E188E75594151B138640FEC085E21/16360)

#### 服务降级

当某个服务熔断之后，服务将不再被调用，此时客户端可以自己准备一个本地的fallback（回退）回调，返回一个缺省值。例如，在商品详情页一般都会展示商品的介绍信息，一旦商品详情页系统出现故障无法调用时，会直接获取缓存中的商品介绍信息返回给前端页面。

![](https://img2020.cnblogs.com/blog/955092/202010/955092-20201013170637709-28240394.png)

### Sentinel简介

随着微服务的流行，服务和服务之间的稳定性变得越来越重要。Sentinel 是面向分布式服务架构的流量控制组件，主要以流量为切入点，从限流、流量整形、熔断降级、系统负载保护、热点防护等多个维度来帮助开发者保障微服务的稳定性。

我们使用Sentinel实现接口的限流，并使用Feign整合Sentinel实现服务容错的功能。

官方文档：https://sentinelguard.io/zh-cn/docs/introduction.html

### Sentinel 基本概念

#### 资源

资源是 Sentinel 的关键概念。它可以是 Java 应用程序中的任何内容，例如，由应用程序提供的服务，或由应用程序调用的其它应用提供的服务，甚至可以是一段代码。在接下来的文档中，我们都会用资源来描述代码块。

只要通过 Sentinel API 定义的代码，就是资源，能够被 Sentinel 保护起来。大部分情况下，可以使用方法签名，URL，甚至服务名称作为资源名来标示资源。

#### 规则

围绕资源的实时状态设定的规则，可以包括流量控制规则、熔断降级规则以及系统保护规则。所有规则可以动态实时调整。

#### 流量控制

Sentinel 作为一个调配器，可以根据需要把随机的请求调整成合适的形状。

流量控制有以下几个角度:

- 资源的调用关系，例如资源的调用链路，资源和资源之间的关系；
- 运行指标，例如 QPS、线程池、系统负载等；
- 控制的效果，例如直接限流、冷启动、排队等。

![](https://sentinelguard.io/docs/zh-cn/img/sentinel-flow-overview.jpg)

#### 熔断降级

- 通过并发线程数进行限制

Sentinel 通过限制资源并发线程的数量，来减少不稳定资源对其它资源的影响。这样不但没有线程切换的损耗，也不需要您预先分配线程池的大小。当某个资源出现不稳定的情况下，例如响应时间变长，对资源的直接影响就是会造成线程数的逐步堆积。当线程数在特定资源上堆积到一定的数量之后，对该资源的新请求就会被拒绝。堆积的线程完成任务后才开始继续接收请求。

- 通过响应时间对资源进行降级

除了对并发线程数进行控制以外，Sentinel 还可以通过响应时间来快速降级不稳定的资源。当依赖的资源出现响应时间过长后，所有对该资源的访问都会被直接拒绝，直到过了指定的时间窗口之后才重新恢复。

### Sentinel 是如何工作的

Sentinel 的主要工作机制如下：

- 对主流框架提供适配或者显示的 API，来定义需要保护的资源，并提供设施对资源进行实时统计和调用链路分析。
- 根据预设的规则，结合对资源的实时统计信息，对流量进行控制。同时，Sentinel 提供开放的接口，方便您定义及改变规则。
- Sentinel 提供实时的监控系统，方便您快速了解目前系统的状态。

### Sentinel工作主流程

在 Sentinel 里面，所有的资源都对应一个资源名称（resourceName），每次资源调用都会创建一个 Entry 对象。Entry 可以 

通过对主流框架的适配自动创建，也可以通过注解的方式或调用 SphU API 显式创建。Entry 创建的时候，同时也会创建一 

系列功能插槽（slot chain），这些插槽有不同的职责，例如: 

NodeSelectorSlot 负责收集资源的路径，并将这些资源的调用路径，以树状结构存储起来，用于根据调用路径来 限流降级； 

ClusterBuilderSlot 则用于存储资源的统计信息以及调用者信息，例如该资源的 RT, QPS, thread count 等等，这些信息将用作为多维度限流，降级的依据； 

StatisticSlot 则用于记录、统计不同纬度的 runtime 指标监控信息； 

FlowSlot 则用于根据预设的限流规则以及前面 slot 统计的状态，来进行流量控制； 

AuthoritySlot 则根据配置的黑白名单和调用来源信息，来做黑白名单控制； 

DegradeSlot 则通过统计信息以及预设的规则，来做熔断降级； 

SystemSlot 则通过系统的状态，例如 load1 等，来控制总的入口流量；

### Sentinel使用

引入依赖

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```



#### 简单使用

```java
  private static final String RESOURCE_NAME = "hello";

    @RequestMapping(value = "/hello")
    public String hello() {

        Entry entry = null;
        try {
            // 资源名可使用任意有业务语义的字符串，可唯一标识的字符串。
            entry = SphU.entry(RESOURCE_NAME);
            // 被保护的业务逻辑
            String str = "hello world";
            log.info("====="+str+"=====");
            return str;
        } catch (BlockException e1) {
            // 资源访问阻止，被限流或被降级
            log.info("block!");
            return "被流控了！";
        } catch (Exception ex) {
            // 若需要配置降级规则，需要通过这种方式记录业务异常
            Tracer.traceEntry(ex, entry);
        } finally {
            if (entry != null) {
                entry.exit();
            }
        }
        return null;
    }



    /**
     * 定义流控规则
     */
    @PostConstruct
    private static void initFlowRules(){
        List<FlowRule> rules = new ArrayList<>();
        FlowRule rule = new FlowRule();
        //设置受保护的资源
        rule.setResource(RESOURCE_NAME);
        // 设置流控规则 QPS
        rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        // 设置受保护的资源阈值
        // Set limit QPS to 20.
        rule.setCount(1);
        rules.add(rule);
        // 加载配置好的规则
        FlowRuleManager.loadRules(rules);
    }
```

这种方式缺点：

- 业务侵入性很强
- 配置不灵活，配置规则要通过硬编码方式

#### @SentinelResource注解实现

@SentinelResource 注解用来标识资源是否被限流、降级。 

blockHandler: 定义当资源内部发生了BlockException应该进入的方法（捕获的是Sentinel定义的异常） 

fallback: 定义的是资源内部发生了Throwable应该进入的方法

```java
    @GetMapping("world")
    @SentinelResource(value = "test_sentinel",
            blockHandlerClass = CommonBlockHandler.class,
            blockHandler = "handleException3")
    public R world(){
        return R.ok("hello world");
    }


public class CommonBlockHandler {

    /**
     * 注意： 必须为 static 方法,多个方法之间方法名不能一样
     * @param exception
     * @return
     */
    public static R handleException(Map<String, Object> params, BlockException exception){
        return R.error(-1,"===被限流啦==="+exception);
    }

    public static R handleException2(Integer id, BlockException exception){
        return R.error(-1,"===被限流啦==="+exception);
    }

    public static R handleException3(BlockException exception){
        return R.error("===被限流啦==="+exception);
    }
}
```

#### **BlockException异常统一处理**

@ResourceSentinel 注解太麻烦，每个接口都加注解 Sentinel 限流返回的提示太不友好了，改成自定义的异常处理。

springwebmvc接口资源限流入口在**HandlerInterceptor**的实现类**AbstractSentinelInterceptor**的 preHandle方法中，对异常的处理是**BlockExceptionHandler**的实现类。

```java
@Slf4j
@Component
public class MyBlockExceptionHandler implements BlockExceptionHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, BlockException e) throws Exception {
        log.info("BlockExceptionHandler BlockException================"+e.getRule());
        R r = null;

        if (e instanceof FlowException) {
            r = R.error(100,"接口限流了");

        } else if (e instanceof DegradeException) {
            r = R.error(101,"服务降级了");

        } else if (e instanceof ParamFlowException) {
            r = R.error(102,"热点参数限流了");

        } else if (e instanceof SystemBlockException) {
            r = R.error(103,"触发系统保护规则了");

        } else if (e instanceof AuthorityException) {
            r = R.error(104,"授权规则不通过");
        }

        //返回json数据
        response.setStatus(500);
        response.setCharacterEncoding("utf-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getWriter(), r);

    }
}
```

### Sentinel控制台

##### 下载Sentinel[控制台](https://github.com/alibaba/Sentinel/releases)

![](https://binghe001.github.io/assets/images/microservices/springcloudalibaba/sa-2022-05-03-003.png)

##### 启动控制台

```shell
java -jar sentinel-dashboard-1.8.0.jar
```

在浏览器中输入 `http://localhost:8080` 访问Sentinel控制台，如下所示。

![](https://binghe001.github.io/assets/images/microservices/springcloudalibaba/sa-2022-05-03-004.png)

输入默认的用户名sentinel和密码sentinel。

##### 项目中集成Sentinel控制台

添加Sentinel后，需要暴露/actuator/sentinel端点。

```yaml
#暴露actuator端点
management:

  endpoints:
    web:
      exposure:
        include: "*"


spring:
  application:
    name: sentinel-demo

    sentinel:
      transport:
        # 指定应用与Sentinel控制台交互的端口，应用本地会起一个该端口占用的HttpServer
        port: 8719
        # 添加sentinel的控制台地址
        dashboard: localhost:8080
```

![](C:/Users/zys/AppData/Roaming/Typora/typora-user-images/image-20220914153438398.png)

##### 在sentinel控制台中设置流控规则 

**资源名**: 接口的API 

**针对来源**: 默认是default，当多个微服务都调用这个资源时，可以配置微服务名来对指定的微服务设置阈值 

**阈值类型**: 分为QPS和线程数 假设阈值为10 

**QPS**类型: 只得是每秒访问接口的次数>10就进行限流 

**线程数**: 为接受请求该资源分配的线程数>10就进行限流

把我们上面的资源test_sentinel配置流控规则，在簇点链路列表中找到`/test_sentinel`，在右侧的操作中选择流控，如下所示。

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202209201900515.png)

点击流控按钮会显示 **新增流控规则** 的弹出框

![](C:/Users/zys/AppData/Roaming/Typora/typora-user-images/image-20220914170522885.png)

配置好之后点击新增按钮。上述配置表示`http://127.0.0.1:8800/world`接口的QPS为1，每秒访问1次。如果每秒访问的次数超过1次，则会被Sentinel限流。

说明：@SentinelResource 可以不配置。

##### **微服务和**Sentinel Dashboard通信原理

Sentinel控制台与微服务端之间，实现了一套服务发现机制，集成了Sentinel的微服务都会将元数据传递给Sentinel控制台

![](C:/Users/zys/AppData/Roaming/Typora/typora-user-images/image-20220914170859183.png)

### Feign整合Sentinel实现容错

Sentinel 适配了 Feign 组件。配置文件打开 Sentinel 对 Feign 的支持：feign.sentinel.enabled=true

#### 远程调用实现容错

在Feign的声明式接口上添加fallback属性

```java
@FeignClient(value = "order",path = "/order",fallback = OrderFeignServiceFallback.class)
public interface OrderFeignService {

    @RequestMapping("/findOrderByUserId/{userId}")
    public R findOrderByUserId(@PathVariable("userId") Integer userId);
}

```

定义OrderFeignServiceFallback

```java
@Component
public class OrderFeignServiceFallback implements OrderFeignService {

    @Override
    public R findOrderByUserId(Integer userId) {
        return R.error(-1,"=======服务降级了========");
    }
}

```

注意OrderFeignServiceFallback 一定要加入到spring容器中，如果不同的模块，需要在@SpringBootApplication添加属性，例如：

```java
@SpringBootApplication(scanBasePackages = {"com.demo","com.sentineldemo"})
```

调用方：

```
@RequestMapping(value = "/findOrderByUserId/{id}")
public R findOrderByUserId(@PathVariable("id") Integer id) {

    //feign调用
    R result = orderFeignService.findOrderByUserId(id);

    return result;
}
```

停掉order服务,实现了容错

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202209151651379.png)

####  实现容错时获取异常

在Feign的声明式接口上添加fallbackFactory属性 

```java
@FeignClient(value = "order",path = "/order",
          fallbackFactory = OrderFeignServiceFallbackFactory.class
)
public interface OrderFeignService {

    @RequestMapping("/findOrderByUserId/{userId}")
    public R findOrderByUserId(@PathVariable("userId") Integer userId);
}
```

定义OrderFeignServiceFallbackFactory

```java
@Component
public class OrderFeignServiceFallbackFactory implements FallbackFactory<OrderFeignService> {
    @Override
    public OrderFeignService create(Throwable throwable) {

        return new OrderFeignService() {
            @Override
            public R findOrderByUserId(Integer userId) {
                return R.error(-1,"=======服务降级了========");
            }
        };
    }
}
```

#### fallbackFactory和Fallback区别

fallbackFactory 推荐：可以捕获异常信息并返回默认降级结果。可以打印堆栈信息。

fallback 不推荐:不能捕获异常打印堆栈信息，不利于问题排查。

### Sentinel 持久化

#### **Sentinel规则推送模式** 

| 推送模式  | 说明                                                         | 优点                         | 缺点                                                         |
| --------- | ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| 原始模式  | API 将规则推送至客户端并直接更新到内存中，扩展写数据源（WritableDataSource） | 简单，无任何依赖             | 不保证一致性；规则保存在内存中，重启即消失。严重不建议用于生产环境 |
| Pull 模式 | 扩展写数据源（WritableDataSource）， 客户端主动向某个规则管理中心定期轮询拉取规则，这个规则中心可以是 RDBMS、文件 等 | 简单，无任何依赖；规则持久化 | 不保证一致性；实时性不保证，拉取过于频繁也可能会有性能问题。 |
| Push 模式 | 扩展读数据源（ReadableDataSource），规则中心统一推送，客户端通过注册监听器的方式时刻监听变化，比如使用 Nacos、Zookeeper 等配置中心。这种方式有更好的实时性和一致性保证。生产环境下一般采用 push 模式的数据源。 | 规则持久化；一致性；快速     | 引入第三方依赖                                               |

生产环境下一般更常用的是 push 模式的数据源。对于 push 模式的数据源,如远程配置中心（ZooKeeper, Nacos, Apollo等等），推送的操作经控制台统一进行管理，直接进行推送，数据源仅负责获取配置中心推送的配置并更新到本地。因此推送规则正确做法应该是 **配置中心控制台/Sentinel 控制台 → 配置中心 → Sentinel 数据源 → Sentinel**，而不是经 Sentinel 数据源推送至配置中心。

![](https://note.youdao.com/yws/public/resource/0d59172ba46dd6961289702eb8a92971/xmlnote/7A71C2A38C464125843D723A9E542841/52865)

#### 基于Nacos配置中心控制台实现推送

##### 修改Sentinel Dashboard

Sentinel 控制台提供 DynamicRulePublisher 和 DynamicRuleProvider 接口用于实现应用维度的规则推送和拉取：

- DynamicRuleProvider: 拉取规则
- DynamicRulePublisher: 推送规则

引入依赖

```
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
    <version>1.8.4</version>
</dependency>
```

拉取规则：

```java
@Component("flowRuleNacosProvider")
public class FlowRuleNacosProvider implements DynamicRuleProvider<List<FlowRuleEntity>> {

    @Autowired
    private ConfigService configService;

    @Override
    public List<FlowRuleEntity> getRules(String appName,String ip,Integer port) throws NacosException {
        // 从Nacos配置中心拉取配置
        String rules = configService.getConfig(
                appName + NacosConfigUtil.FLOW_DATA_ID_POSTFIX,
                NacosConfigUtil.GROUP_ID, NacosConfigUtil.READ_TIMEOUT);
        if (StringUtil.isEmpty(rules)) {
            return new ArrayList<>();
        }
        // 解析json获取到 List<FlowRule>
        List<FlowRule> list = JSON.parseArray(rules, FlowRule.class);
        // FlowRule------->FlowRuleEntity
        return list.stream().map(rule ->
                FlowRuleEntity.fromFlowRule(appName,ip,port,rule))
                .collect(Collectors.toList());
    }

}
```

推送规则：

```java
@Component("flowRuleNacosPublisher")
public class FlowRuleNacosPublisher implements DynamicRulePublisher<List<FlowRuleEntity>> {

    @Autowired
    private ConfigService configService;
    
    @Override
    public void publish(String app, List<FlowRuleEntity> rules) throws Exception {
        AssertUtil.notEmpty(app, "app name cannot be empty");
        if (rules == null) {
            return;
        }
        //发布配置到Nacos配置中心
        configService.publishConfig(
                app + NacosConfigUtil.FLOW_DATA_ID_POSTFIX,
            NacosConfigUtil.GROUP_ID, NacosConfigUtil.convertToRule(rules));
    }
}
```

yml配置匹配对应的规则后缀

```java
public final class NacosConfigUtil {

    public static final String GROUP_ID = "SENTINEL_GROUP";
    
    public static final String FLOW_DATA_ID_POSTFIX = "-flow-rules";
    public static final String PARAM_FLOW_DATA_ID_POSTFIX = "-param-flow-rules";
    public static final String DEGRADE_DATA_ID_POSTFIX = "-degrade-rules";
    public static final String SYSTEM_DATA_ID_POSTFIX = "-system-rules";
    public static final String AUTHORITY_DATA_ID_POSTFIX = "-authority-rules";
    public static final String GATEWAY_FLOW_DATA_ID_POSTFIX = "-gateway-flow-rules";
    public static final String GATEWAY_API_DATA_ID_POSTFIX = "-gateway-api-rules";
}
```

修改com.alibaba.csp.sentinel.dashboard.controller包下对应的规则controller实现类

```java
    // 拉取规则
    @GetMapping("/rules")
    @AuthAction(PrivilegeType.READ_RULE)
    public Result<List<FlowRuleEntity>> apiQueryMachineRules(@RequestParam String app,
                                                             @RequestParam String ip,
                                                             @RequestParam Integer port) {

        if (StringUtil.isEmpty(app)) {
            return Result.ofFail(-1, "app can't be null or empty");
        }
        if (StringUtil.isEmpty(ip)) {
            return Result.ofFail(-1, "ip can't be null or empty");
        }
        if (port == null) {
            return Result.ofFail(-1, "port can't be null");
        }
        try {

            //从远程配置中心获取规则配置
            List<FlowRuleEntity> rules = ruleProvider.getRules(app,ip,port);
            if (rules != null && !rules.isEmpty()) {
                for (FlowRuleEntity entity : rules) {
                    entity.setApp(app);
                    if (entity.getClusterConfig() != null && entity.getClusterConfig().getFlowId() != null) {
                        entity.setId(entity.getClusterConfig().getFlowId());
                    }
                }
            }

            rules = repository.saveAll(rules);
            return Result.ofSuccess(rules);
        } catch (Throwable throwable) {
            logger.error("Error when querying flow rules", throwable);
            return Result.ofThrowable(-1, throwable);
        }
    }

```

修改流控规则

```java
@PostMapping("/rule")
@AuthAction(PrivilegeType.WRITE_RULE)
public Result<FlowRuleEntity> apiAddFlowRule(@RequestBody FlowRuleEntity entity) {
    Result<FlowRuleEntity> checkResult = checkEntityInternal(entity);
    if (checkResult != null) {
        return checkResult;
    }
    entity.setId(null);
    Date date = new Date();
    entity.setGmtCreate(date);
    entity.setGmtModified(date);
    entity.setLimitApp(entity.getLimitApp().trim());
    entity.setResource(entity.getResource().trim());
    try {
        entity = repository.save(entity);

        //发布规则到远程配置中心
        publishRules(entity.getApp());
        return Result.ofSuccess(entity);
    } catch (Throwable t) {
        Throwable e = t instanceof ExecutionException ? t.getCause() : t;
        logger.error("Failed to add new flow rule, app={}, ip={}", entity.getApp(), entity.getIp(), e);
        return Result.ofFail(-1, e.getMessage());
    }
}
```

##### 修改微服务配置

在增加yml配置

```yaml
spring:
  application:
    name: sentinel-demo
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848

    sentinel:
      transport:
        # 指定应用与Sentinel控制台交互的端口，应用本地会起一个该端口占用的HttpServer
        port: 8719
        # 添加sentinel的控制台地址
        dashboard: localhost:8080
      datasource:
      	#流控规则
        flow-rules:
          nacos:
            server-addr: 127.0.0.1:8848
            dataId: ${spring.application.name}-flow-rules
            groupId: SENTINEL_GROUP   # 注意groupId对应Sentinel Dashboard中的定义
            data-type: json
            rule-type: flow
```

