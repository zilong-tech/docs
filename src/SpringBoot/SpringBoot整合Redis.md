---
title: SpringBoot 整合redis
author: 程序员子龙
index: true
icon: discover
category:
  - SpringBoot

---

### **引入依赖**

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

Spring Boot 提供了对 Redis 集成的组件包：`spring-boot-starter-data-redis`，`spring-boot-starter-data-redis`依赖于`spring-data-redis` 和 `lettuce` 。Spring Boot 1.0 默认使用的是 Jedis 客户端，2.0 替换成 Lettuce。

Lettuce 是一个可伸缩线程安全的 Redis 客户端，多个线程可以共享同一个 RedisConnection，它利用优秀 netty NIO 框架来高效地管理多个连接。

### 配置数据源

application.properties

```properties
# Redis数据库索引（默认为0）
spring.redis.database=0  
# Redis服务器地址
spring.redis.host=localhost
# Redis服务器连接端口
spring.redis.port=6379  
# Redis服务器连接密码（默认为空）
spring.redis.password=
# 连接池最大连接数（使用负值表示没有限制） 默认 8
spring.redis.lettuce.pool.max-active=8
# 连接池最大阻塞等待时间（使用负值表示没有限制） 默认 -1
spring.redis.lettuce.pool.max-wait=-1
# 连接池中的最大空闲连接 默认 8
spring.redis.lettuce.pool.max-idle=8
# 连接池中的最小空闲连接 默认 0
spring.redis.lettuce.pool.min-idle=0
```

### 数据访问层dao

```java
@Repository
public class RedisDao {

    @Autowired
    private StringRedisTemplate template;

    public  void setKey(String key,String value){
        template.opsForValue().set(key,value,1, TimeUnit.MINUTES);//1分钟过期
    }

    public String getValue(String key){
        return this.template.opsForValue().get(key);
    }


    public void setHash(String key,String filed,String value){
        template.opsForHash().put(key,filed,value);
    }

    public Object getHash(String key,String filed){
        return template.opsForHash().get(key, filed);
    }
}
```

### 单元测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringbootRedisApplicationTests {

	public static Logger logger= LoggerFactory.getLogger(SpringbootRedisApplicationTests.class);

	@Autowired
	RedisDao redisDao;

	@Test
	public void testRedis(){
		redisDao.setKey("name","hello");
		redisDao.setKey("age","11");
		logger.info(redisDao.getValue("name"));
		logger.info(redisDao.getValue("age"));

		redisDao.setHash("testHash","hello","world");
		logger.info("value:"+ redisDao.getHash("testHash","hello"));
	}
}

```

> c.demo.SpringbootRedisApplicationTests   : hello
> c.demo.SpringbootRedisApplicationTests   : 11
>
>  c.demo.SpringbootRedisApplicationTests   : value:world

### 解决java.lang.IllegalStateException: Unable to find a @SpringBootConfiguration, you need to use

单元测试报这个错误，原因是测试类的包名与启动器的包名不一致。

解决方法：Spring Boot测试类包名与main下application.class启动类的包名默认要一致，修改包名后问题得以解决！

### 利用AOP自动缓存

**添加 cache 的配置类**

```java

//@EnableCaching来开启缓存。
@Configuration
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {
    
    @Bean
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
}
```

测试：

```java
@RestController
public class CityController {

    @RequestMapping("/getCity")
    @Cacheable(value="city-key")
    public City getCity() {

        City city = new City("北京","首都");
        System.out.println("若下面没出现“无缓存的时候调用”字样且能打印出数据表示测试成功");
        return city;
    }
}
```

