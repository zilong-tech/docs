---
title: SpringBoot 缓存之 @Cacheable 详细介绍与失效时间TTL
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
Spring 从 3.1 开始就引入了对 Cache 的支持。定义了 `org.springframework.cache.Cache` 和 `org.springframework.cache.CacheManager` 接口来统一不同的缓存技术。并支持使用 `JCache（JSR-107）`注解简化我们的开发。﻿

### @Cacheable 注解使用

1、开启基于注解的缓存，使用 `@EnableCaching` 标记在 SpringBoot 的主启动类上。

```java
@SpringBootApplication
@EnableCaching
public class SpringbootRedisApplication {

    public static void main(String[] args) {

        SpringApplication.run(SpringbootRedisApplication.class,args);
    }
}
```



2、标注缓存注解即可

```java

    @Cacheable(value = "city",key = "#city.id")
    public City getCity(City city){

        //模拟查询
        return new City("北京","首都");
    }
//缓存key：city::1
```

`@Cacheable `这个注解常用的几个属性：

- `cacheNames/value` ：用来指定缓存组件的名字
- `key` ：缓存数据时使用的 key，可以用它来指定。默认是使用方法参数的值。（这个 key 你可以使用 spEL 表达式来编写）

![](https://img-blog.csdnimg.cn/img_convert/9b44287bd9e642abfc8edcd09a51b87a.png)

- `keyGenerator` ：key 的生成器。 key 和 keyGenerator 二选一使用.

  首先自定义keyGenerator

  ```java
      @Bean("myKeyGenerator")
      public KeyGenerator keyGenerator() {
  
          return new KeyGenerator() {
              @Override
              public Object generate(Object target, Method method, Object... params) {
                  StringBuilder sb = new StringBuilder();
                  sb.append(target.getClass().getName());
                  sb.append(method.getName());
                  for (Object obj : params) {
                      sb.append(obj.toString());
                  }
                  return sb.toString();
              }
          };
      }
  ```

  ```java
     @Cacheable(value = "city",keyGenerator = "myKeyGenerator")
      public City getCity(City city){
  
          //模拟查询
          return new City("北京","首都");
      }
  
  //缓存key：city::com.demo.service.CityServicegetCityCity{id=1, provinceId=null, cityName='null', description='null'}
  ```

  

- `cacheManager` ：可以用来指定缓存管理器。从哪个缓存管理器里面获取缓存。

- `condition` ：可以用来指定符合条件的情况下才缓存

- `unless` ：否定缓存。当 unless 指定的条件为 true ，方法的返回值就不会被缓存。当然你也可以获取到结果进行判断。（通过 `#result` 获取方法结果）

- `sync` ：是否使用异步模式。默认是方法执行完，以同步的方式将方法返回的结果存在缓存中。j

### 设置缓存过期时间

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

