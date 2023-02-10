---
title: Spring Cloud Ribbon
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
## **什么是Ribbon**

Spring Cloud Ribbon是基于Netflix Ribbon 实现的一套客户端的负载均衡工具，Ribbon客户端组件提供一系列的完善的配置，如超时，重试等。通过Load Balancer获取到服务提供的所有机器实例，Ribbon会自动基于某种规则(轮询，随机)去调用这些服务。Ribbon也可以实现我们自己的负载均衡算法。

Ribbon 本地负载均衡，在调用微服务接口时候，会在注册中心上获取注册信息服务列表之后缓存到 JVM 本地，从而在本地实现 RPC 远程服务调用技术。

![](https://gitee.com/zysspace/pic/raw/master/images/202204102203625.jpg)

## 负载方案

LB 负载均衡(Load Balance)是什么 ？

简单的说就是将用户的请求平摊的分配到多个服务上，从而达到系系统的 HA (高可用)。常见的负载均衡有软件 Nginx，LVS，硬件 F5 等。

目前主流的负载方案分为以下两种：

- 集中式负载均衡，在消费者和服务提供方中间使用独立的代理方式进行负载，有硬件的（比如 F5），也有软件的（比如 Nginx）。
- 客户端根据自己的请求情况做负载均衡，Ribbon 就属于客户端自己做负载均衡。

Nginx 是服务器负载均衡，客户端所有请求都会交给 nginx，然后由nginx 实现转发请求。即负载均衡是由服务端实现的。

![https://note.youdao.com/yws/public/resource/983c803c0f366af153e5c336aa4ac834/xmlnote/074F758C9974417991452EC230F43ED5/13572](https://note.youdao.com/yws/public/resource/983c803c0f366af153e5c336aa4ac834/xmlnote/074F758C9974417991452EC230F43ED5/13572)

### **常见负载均衡算法**

- 随机，通过随机选择服务进行执行，一般这种方式使用较少;
- 轮训，负载均衡默认实现方式，请求来之后排队处理;
- 加权轮训，通过对服务器性能的分型，给高配置，低负载的服务器分配更高的权重，均衡各个服务器的压力;
- 地址Hash，通过客户端请求的地址的HASH值取模映射进行服务器调度。  ip hash
- 最小连接数，即使请求均衡了，压力不一定会均衡，最小连接数法就是根据服务器的情况，比如请求积压数等参数，将请求分配到当前压力最小的服务器上。  最小活跃数

## **Ribbon使用**

**Spring Cloud快速整合Ribbon**

![](https://gitee.com/zysspace/pic/raw/master/images/202204102337425.png)

在order模块中定义接口：

```java
    /**
     * 根据用户id查询订单信息
     * @param userId
     * @return
     */
    @RequestMapping("/order/findOrderByUserId/{userId}")
    public R findOrderByUserId(@PathVariable("userId") Integer userId) {

        log.info("根据userId:"+userId+"查询订单信息");
        List<OrderEntity> orderEntities = orderService.listByUserId(userId);
        return R.ok().put("orders", orderEntities);
    }
```

在消费端user添加**@LoadBalanced**注解

```java
@Configuration
public class RestConfig {

    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        
        return new RestTemplate();
    }
    
    
}
```

调用order模块中的接口

```java
@Autowired
private RestTemplate restTemplate;   

public R  findOrderByUserId(@PathVariable("id") Integer id) {
        log.info("根据userId:"+id+"查询订单信息");
        String url = "http://order/order/findOrderByUserId/"+id;
        R result = restTemplate.getForObject(url,R.class);

        return result;
    }
```

### **@LoadBalanced 注解**

```java
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Qualifier
public @interface LoadBalanced {
}
```

@LoadBalanced利用@Qualifier作为restTemplates注入的筛选条件，筛选出具有负载均衡标识的RestTemplate。



```java
public class LoadBalancerAutoConfiguration 
    
    //被@LoadBalanced注解的restTemplate会被定制，添加LoadBalancerInterceptor拦截器。
    @LoadBalanced
    @Autowired(
        required = false
    )
    private List<RestTemplate> restTemplates = Collections.emptyList();
    
    
    
    @Configuration
    @ConditionalOnMissingClass({"org.springframework.retry.support.RetryTemplate"})
    static class LoadBalancerInterceptorConfig {
        LoadBalancerInterceptorConfig() {
        }

        @Bean
        public LoadBalancerInterceptor ribbonInterceptor(LoadBalancerClient loadBalancerClient, LoadBalancerRequestFactory requestFactory) {
            return new LoadBalancerInterceptor(loadBalancerClient, requestFactory);
        }
        
        @Bean
        @ConditionalOnMissingBean
        public RestTemplateCustomizer restTemplateCustomizer(final LoadBalancerInterceptor loadBalancerInterceptor) {
            return (restTemplate) -> {
                List<ClientHttpRequestInterceptor> list = new ArrayList(restTemplate.getInterceptors());
                // 添加loadBalancerInterceptor拦截器
                list.add(loadBalancerInterceptor);
                restTemplate.setInterceptors(list);
            };
        }
}
```



###  RibbonClientConfiguration

```java
    //Ribbon的客户端配置，默认采用DefaultClientConfigImpl实现。    
    @Bean
    @ConditionalOnMissingBean
    public IClientConfig ribbonClientConfig() {
        DefaultClientConfigImpl config = new DefaultClientConfigImpl();
        config.loadProperties(this.name);
        config.set(CommonClientConfigKey.ConnectTimeout, 1000);
        config.set(CommonClientConfigKey.ReadTimeout, 1000);
        config.set(CommonClientConfigKey.GZipPayload, true);
        return config;
    }

    //Ribbon的负载均衡策略，默认采用ZoneAvoidanceRule实现，该策略能够在多区 域环境下选出最佳区域的实例进行访问。
    @Bean
    @ConditionalOnMissingBean
    public IRule ribbonRule(IClientConfig config) {
        if (this.propertiesFactory.isSet(IRule.class, this.name)) {
            return (IRule)this.propertiesFactory.get(IRule.class, config, this.name);
        } else {
            ZoneAvoidanceRule rule = new ZoneAvoidanceRule();
            rule.initWithNiwsConfig(config);
            return rule;
        }
    }
 
    //Ribbon的实例检查策略，默认采用DummyPing实现，该检查策略是一个特殊的 实现，实际上它并不会检查实例是否可用，而是始终返回true，默认认为所有服务实例都是 可用的
    @Bean
    @ConditionalOnMissingBean
    public IPing ribbonPing(IClientConfig config) {
        return (IPing)(this.propertiesFactory.isSet(IPing.class, this.name) ? (IPing)this.propertiesFactory.get(IPing.class, config, this.name) : new DummyPing());
    }

   //服务实例清单的维护机制，默认采用ConfigurationBasedServerList实现。
    @Bean
    @ConditionalOnMissingBean
    public ServerList<Server> ribbonServerList(IClientConfig config) {
        if (this.propertiesFactory.isSet(ServerList.class, this.name)) {
            return (ServerList)this.propertiesFactory.get(ServerList.class, config, this.name);
        } else {
            ConfigurationBasedServerList serverList = new ConfigurationBasedServerList();
            serverList.initWithNiwsConfig(config);
            return serverList;
        }
    }

    @Bean
    @ConditionalOnMissingBean
    public ServerListUpdater ribbonServerListUpdater(IClientConfig config) {
        return new PollingServerListUpdater(config);
    }


    //负载均衡器，默认采用ZoneAwareLoadBalancer实现，它具备了区域 感知的能力。
    @Bean
    @ConditionalOnMissingBean
    public ILoadBalancer ribbonLoadBalancer(IClientConfig config, ServerList<Server> serverList, ServerListFilter<Server> serverListFilter, IRule rule, IPing ping, ServerListUpdater serverListUpdater) {
        return (ILoadBalancer)(this.propertiesFactory.isSet(ILoadBalancer.class, this.name) ? (ILoadBalancer)this.propertiesFactory.get(ILoadBalancer.class, config, this.name) : new ZoneAwareLoadBalancer(config, rule, ping, serverList, serverListFilter, serverListUpdater));
    }

   // 服务实例清单过滤机制，默认采ZonePreferenceServerListFilter，该 策略能够优先过滤出与请求方处于同区域的服务实例。
    @Bean
    @ConditionalOnMissingBean
    public ServerListFilter<Server> ribbonServerListFilter(IClientConfig config) {
        if (this.propertiesFactory.isSet(ServerListFilter.class, this.name)) {
            return (ServerListFilter)this.propertiesFactory.get(ServerListFilter.class, config, this.name);
        } else {
            ZonePreferenceServerListFilter filter = new ZonePreferenceServerListFilter();
            filter.initWithNiwsConfig(config);
            return filter;
        }
    }

    @Bean
    @ConditionalOnMissingBean
    public RibbonLoadBalancerContext ribbonLoadBalancerContext(ILoadBalancer loadBalancer, IClientConfig config, RetryHandler retryHandler) {
        return new RibbonLoadBalancerContext(loadBalancer, config, retryHandler);
    }

    @Bean
    @ConditionalOnMissingBean
    public RetryHandler retryHandler(IClientConfig config) {
        return new DefaultLoadBalancerRetryHandler(config);
    }

    @Bean
    @ConditionalOnMissingBean
    public ServerIntrospector serverIntrospector() {
        return new DefaultServerIntrospector();
    }

    @PostConstruct
    public void preprocess() {
        RibbonUtils.setRibbonProperty(this.name, CommonClientConfigKey.DeploymentContextBasedVipAddresses.key(), this.name);
    }

```



###  **Ribbon负载均衡策略**

![](https://note.youdao.com/yws/public/resource/983c803c0f366af153e5c336aa4ac834/xmlnote/E1376C784BB9439BA29A8CF3105D8E9D/13573)

1. **RandomRule**： 随机选择一个Server。
2. **RetryRule**： 对选定的负载均衡策略机上重试机制，在一个配置时间段内当选择Server不成功，则一直尝试使用subRule的方式选择一个可用的server。
3. **RoundRobinRule**： 轮询选择， 轮询index，选择index对应位置的Server。
4. **AvailabilityFilteringRule**： 过滤掉一直连接失败的被标记为circuit tripped的后端Server，并过滤掉那些高并发的后端Server或者使用一个AvailabilityPredicate来包含过滤server的逻辑，其实就是检查status里记录的各个Server的运行状态。
5. **BestAvailableRule**： 选择一个最小的并发请求的Server，逐个考察Server，如果Server被tripped了，则跳过。
6. **WeightedResponseTimeRule**： 根据响应时间加权，响应时间越长，权重越小，被选中的可能性越低。
7. **ZoneAvoidanceRule**： 默认的负载均衡策略，即复合判断Server所在区域的性能和Server的可用性选择Server，在没有区域的环境下，类似于轮询(RandomRule)
8. **NacosRule:**  同集群优先调用

### **自定义负载均衡策略**

通过实现 IRule 接口可以自定义负载策略，主要的选择服务逻辑在 choose 方法中。  

```java
public class NacosRandomWithWeightRule extends AbstractLoadBalancerRule {

    @Autowired
    private NacosDiscoveryProperties nacosDiscoveryProperties;

    @Override
    public Server choose(Object key) {
        DynamicServerListLoadBalancer loadBalancer = (DynamicServerListLoadBalancer) getLoadBalancer();
        String serviceName = loadBalancer.getName();
        NamingService namingService = nacosDiscoveryProperties.namingServiceInstance();

        try {
            //nacos基于权重的算法
            Instance instance = namingService.selectOneHealthyInstance(serviceName);
            log.info(instance.getIp()+":"+instance.getPort());
            return new NacosServer(instance);
        } catch (NacosException e) {
            log.error("获取服务实例异常：{}", e.getMessage());
            e.printStackTrace();
        }

        return null;
    }
  }
```

 **修改全局负载均衡策略**

```java
@Configuration
public class RibbonConfig {

    /**
     * 全局配置
     * 指定负载均衡策略
     * @return
     */
    @Bean
    public IRule() {
        // 指定使用Nacos提供的负载均衡策略（优先调用同一集群的实例，基于随机权重）
        return new NacosRule();
    }
```



**修改局部配置**：

调用指定微服务提供的服务时，使用对应的负载均衡算法

修改application.yml

```yaml
# 被调用的微服务名  当需要使用局部配置的时候推荐使用这种方式
order:
 ribbon:
    #指定使用Nacos提供的负载均衡策略（优先调用同一集群的实例，基于随机&权重）
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule
```





 **饥饿加载**

在进行服务调用的时候，如果网络情况不好，第一次调用会超时。

Ribbon默认懒加载，意味着只有在发起调用的时候才会创建客户端。

开启饥饿加载，解决第一次调用慢的问题

```yaml
ribbon:
  eager-load:
    # 开启ribbon饥饿加载
    enabled: true
    # 配置user使用ribbon饥饿加载，多个使用逗号分隔
    clients: order

```

