---
title: 阿里开源的缓存框架JetCache
index: true
icon: discover
category:
- 缓存

---

在实际开发中，缓存是必须要使用的组件，一般是本地缓存和分布式缓存同时使用。使用Spring Cache进行接口数据的缓存，有个弊端就是没法设置缓存过期时间，需要自行去扩展。

今天了不起给大家推荐一款阿里开源的缓存组件 -- jetcache，可以解决上述问题。

## 项目简介

jetcache 上手简单、性能高效、拓展性强。支持本地缓存、分布式缓存、多级缓存，支持TTL、分布式自动刷新支持缓存预热 、缓存key前缀等功能。同时还提供了`Cache`接口用于手工缓存操作。 

jetcache 目前开源的实现有RedisCache、CaffeineCache（in memory）和`LinkedHashMapCache`(in memory)。

## 快速使用

### 引入依赖

```pom
<dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis</artifactId>
    <version>${jetcache.latest.version}</version>
</dependency>
```

### 配置缓存

```yaml
etcache:
  # 统计间隔，0表示不统计
  statIntervalMinutes: 15
  areaInCacheName: false
  #local表示本地缓存
  local:
    default:
      # 缓存类型 redis为当前支持的远程缓存；linkedhashmap、caffeine为当前支持的本地缓存类型
      type: linkedhashmap
      # Key的转换器
      keyConvertor: fastjson
  #remote 表示远程缓存    
  remote:
    default:
      type: redis
      keyConvertor: fastjson2
      #多个服务共用redis同一个channel可能会造成广播风暴，需要在这里指定channel
      broadcastChannel: projectA
      valueEncoder: java
      valueDecoder: java
      poolConfig:
        minIdle: 5
        maxIdle: 20
        maxTotal: 50
      host: localhost
      port: 6379
```

### 开启缓存

```java
@SpringBootApplication
@EnableMethodCache(basePackages = "com.demo.mypackage")
@EnableCreateCacheAnnotation
public class SpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(MySpringBootApp.class);
    }
}
```

EnableMethodCache 激活 @Cached。

### 方法缓存

```java
@Cached(name="selectUserById", key="#userId" expire = 300, cacheType=CacheType.BOTH)
User selectUserById(long userId);
```

name:缓存名称

key:缓存key,追加到name后面构成唯一的缓存key, 使用 SpEL 指定key，如果没有指定会根据所有参数自动生成。

expire:缓存失效时间

cacheType:缓存的类型，包括CacheType.REMOTE、CacheType.LOCAL、CacheType.BOTH。如果定义为BOTH，会使用LOCAL和REMOTE组合成两级缓存

注意：实体类一定要实现序列化，同时要定义serialVersionUID 属性。

## 缓存实例

配置缓存

```java
    @Autowired
    private CacheManager cacheManager;
    private Cache<Long, Object> userCache;

    @PostConstruct
    public void init(){
        QuickConfig quickConfig = QuickConfig.newBuilder("userCache:")
                .expire(Duration.ofSeconds(3600))
                .cacheType(CacheType.BOTH)
                // 本地缓存更新后，将在所有的节点中删除缓存，以保持强一致性
                .syncLocal(false)
                .build();
        userCache = cacheManager.getOrCreateCache(quickConfig);
    }

    @Bean
    public Cache<Long, Object> getUserCache(){
        return userCache;
    }
```

使用缓存

```java
User user = userCache.get(1L);
userCache.put(1L, user);
```

## 项目地址

```
https://github.com/alibaba/jetcache
```

## 总结

JetCache是阿里巴巴开源的通用缓存访问框架，支持多种缓存类型，使用简单，感兴趣的小伙伴赶快去试试吧。
