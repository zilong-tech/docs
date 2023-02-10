---
title: Spring @Cacheable与失效时间TTL
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
Spring @Cacheable是并不支持Expire失效时间的设定的。

若想在缓存注解上指定失效时间，必须具备如下两个基本条件：

- 缓存实现产品支持Expire失效时间（Ehcache、Redis等几乎所有第三方实现都支持）
- xxxCacheManager管理的xxxCache必须扩展了Expire的实现

因为缓存的k-v键值对具有自动失效的特性实在太重要和太实用了，所以虽然org.springframework.cache.Cache它没有实现Expire，但第三方产品对Spring缓存标准实现的时候，大都实现了这个重要的失效策略，比如典型例子：RedisCache。

本文介绍自定义cacheNames方式，实现redis缓存过期时间

### 自定义RedisCacheManager

```java
public class CustomRedisCacheManager extends RedisCacheManager {

    public CustomRedisCacheManager(RedisCacheWriter cacheWriter, RedisCacheConfiguration defaultCacheConfiguration) {
        super(cacheWriter, defaultCacheConfiguration);
    }

   /**
    * 针对@Cacheable设置缓存过期时间
    * @param name
    * @param cacheConfig
    * @return
    */
    @Override
    protected RedisCache createRedisCache(String name, RedisCacheConfiguration cacheConfig) {
        String[] array = StringUtils.delimitedListToStringArray(name, "#");
        name = array[0];
      // 解析TTL
        if (array.length > 1) {
            long ttl = Long.parseLong(array[1]);
            cacheConfig = cacheConfig.entryTtl(Duration.ofSeconds(ttl)); // 注意单位我此处用的是秒，而非毫秒
        }
        return super.createRedisCache(name, cacheConfig);
    }

}
```

### 配置CacheConfig

```java
@EnableCaching // 使用了CacheManager，别忘了开启它  否则无效
@Configuration
public class CacheConfig extends CachingConfigurerSupport {

    @Bean
    public CacheManager cacheManager() {
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofDays(1))
                .computePrefixWith(cacheName -> "caching:" + cacheName);

        MyRedisCacheManager redisCacheManager = new MyRedisCacheManager(RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory()), defaultCacheConfig);
        return redisCacheManager;
    }

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setHostName("xxxx");
        configuration.setPort(6379);
        configuration.setDatabase(0);
        LettuceConnectionFactory factory = new LettuceConnectionFactory(configuration);
        return factory;
    }

    @Bean
    public RedisTemplate<String, String> stringRedisTemplate() {
        RedisTemplate<String, String> redisTemplate = new StringRedisTemplate();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }

}

```

### 使用@Cacheable

```java
@Service
public class CacheDemoServiceImpl implements CacheDemoService {

    // #后面是缓存过期时间
    @Cacheable(cacheNames = {"testCache#3600"}, key = "#id")
    @Override
    public Object getFromDB(Integer id) {
        return "hello cache...";
    }
}

```

