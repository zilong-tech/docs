---
title: SpringBoot配置数据源

index: true
icon: discover
category:
- 微服务
---

## 数据源的自动配置

**首先导入JDBC依赖**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
```

导入JDBC依赖后，我们可以在Maven的Dependencies依赖里看出`spring-boot-starter-data-jdbc`**自动**帮我们引入了数据源、JDBC与事务相关jar包。

![img](https:////upload-images.jianshu.io/upload_images/26617919-bb9115200048f5d3?imageMogr2/auto-orient/strip|imageView2/2/w/1125/format/webp)



由于数据源的配置是SpringBoot自动配置的，因此我们在外部依赖库里找到jdbc相关的自动配置：

![](https://upload-images.jianshu.io/upload_images/26617919-97d74e53df909c72?imageMogr2/auto-orient/strip|imageView2/2/format/webp)



### DataSourceAutoConfiguration：数据源自动配置类

其中`DataSourceAutoConfiguration`是数据源的自动配置类，其定义了一些静态方法，其中底层数据源相关的是：

```java
@Configuration(proxyBeanMethods = false)
@Conditional({DataSourceAutoConfiguration.PooledDataSourceCondition.class})
@ConditionalOnMissingBean({DataSource.class, XADataSource.class})
@Import({Hikari.class, Tomcat.class, Dbcp2.class, OracleUcp.class, Generic.class, DataSourceJmxConfiguration.class})
protected static class PooledDataSourceConfiguration {
    protected PooledDataSourceConfiguration() {
    }
}
```

其中`@ConditionalOnMissingBean`注解的含义是当容器内没有DataSource数据源时，才进行下面的自动配置默认的数据源；而`@Import`注解则说明了我们要引入的默认数据源是Hikari数据源。也就是说，在我们不做任何处理的情况下，SpringBoot为我们底层配置好的连接池是：`HikariDataSource`。

## HikariCP

Springboot内置的JDBC启动器默认的数据源是：HikariCP

```
<!--JDBC启动器-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!--mysql的依赖-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

配置数据源：

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8&useCursorFetch=true
    username: root
    password: 123456
    hikari:
      # 连接池中允许的最小连接数
      minimum-idle: 10
      #连接池中允许的最大连接数
      maximum-pool-size: 10
```

单元测试

```java
@Autowired
    private DataSource dataSource;
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    public void testDataSource(){
        //默认数据源为：class com.zaxxer.hikari.HikariDataSource
        System.out.println("默认数据源为：" + dataSource.getClass());

    }
```

## Druid

- Druid 是阿里巴巴开源平台上一个数据库连接池实现，结合了 C3P0、DBCP 等 DB 池的优点，同时加入了日志监控。
- 支持所有 JDBC（Oracle、MySQL、SQL Server 和 H2等 ）
- Druid 可以很好的监控 DB 池连接和 SQL 的执行情况，天生就是针对监控而生的 DB 连接池。
- Druid 已经在阿里巴巴部署了超过600个应用，经过一年多生产环境大规模部署的严苛考验。

引入依赖

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.6</version>
</dependency>
```

配置数据源：

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8&useCursorFetch=true
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource    #配置druid，默认为HikariCP
    
    druid:
      initialSize: 5
      minIdle: 5
      maxActive: 20
      maxWait: 60000
      timeBetweenEvictionRunsMillis: 60000
      minEvictableIdleTimeMillis: 300000
      validationQuery: SELECT 1 FROM DUAL
      testWhileIdle: true
      testOnBorrow: false
      testOnReturn: false
      poolPreparedStatements: true
      maxPoolPreparedStatementPerConnectionSize: 20
      useGlobalDataSourceStat: true
      connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
      # 配置监控统计拦截的filters，去掉后监控界面sql无法统计。stat:监控统计 log4:日志记录 wall:防御sql注入
      # 如果运行时报错：ClassNotFoundException:orgapache.log4j.Priority，则导入log4j依赖即可
      filters: stat,wall,log4j

```

也可以这样配置：

```yml
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/springboot_test?characterEncoding=utf8&serverTimezone=UTC
      username: root
      password: root
```



```java
   @Test
    public void testDataSource(){
        //class com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceWrapper
        System.out.println("数据源为：" + dataSource.getClass());

    }
```

## 性能对比

| 功能类别           | 功能            | Druid        | HikariCP    | DBCP | Tomcat-jdbc     | C3P0 |
| ------------------ | --------------- | ------------ | ----------- | ---- | --------------- | ---- |
| 性能               | PSCache         | 是           | 否          | 是   | 是              | 是   |
| LRU                | 是              | 否           | 是          | 是   | 是              |      |
| SLB负载均衡支持    | 是              | 否           | 否          | 否   | 否              |      |
| 稳定性             | ExceptionSorter | 是           | 否          | 否   | 否              | 否   |
| 扩展               | 扩展            | Filter       |             |      | JdbcIntercepter |      |
| 监控               | 监控方式        | jmx/log/http | jmx/metrics | jmx  | jmx             | jmx  |
| 支持SQL级监控      | 是              | 否           | 否          | 否   | 否              |      |
| Spring/Web关联监控 | 是              | 否           | 否          | 否   | 否              |      |
|                    | 诊断支持        | LogFilter    | 否          | 否   | 否              | 否   |
| 连接泄露诊断       | logAbandoned    | 否           | 否          | 否   | 否              |      |
| 安全               | SQL防注入       | 是           | 无          | 无   | 无              | 无   |
| 支持配置加密       | 是              | 否           | 否          | 否   | 否              | 否   |

