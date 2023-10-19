---
title: springboot下整合mybatis
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
## 引入依赖

官方说明：`MyBatis Spring-Boot-Starter will help you use MyBatis with Spring Boot`
其实就是 Mybatis 看 Spring Boot 这么火热也开发出一套解决方案来凑凑热闹，但这一凑确实解决了很多问题，使用起来确实顺畅了许多。`mybatis-spring-boot-starter`主要有两种解决方案，一种是使用注解解决一切问题，一种是简化后的老传统。

```
        <!-- Spring Boot Mybatis 依赖 -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.2.0</version>
        </dependency>

        <!-- MySQL 连接驱动依赖 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.39</version>
        </dependency>


       <!-- 数据库连接池-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.0.29</version>
        </dependency>
```

有注解和xml两种开发模式，下面分别介绍两种模式。

## 新建表

```mysql

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `money` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
INSERT INTO `account` VALUES ('1', 'aaa', '1000');
INSERT INTO `account` VALUES ('2', 'bbb', '1000');
INSERT INTO `account` VALUES ('3', 'ccc', '1000');



CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userName` varchar(32) DEFAULT NULL COMMENT '用户名',
  `passWord` varchar(32) DEFAULT NULL COMMENT '密码',
  `user_sex` varchar(32) DEFAULT NULL,
  `nick_name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```



## 注解方式

### 配置文件

```properties
## 数据源配置
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

## Mybatis 配置
mybatis.typeAliasesPackage=org.spring.springboot.domain

```

在启动类中添加对 mapper 包扫描`@MapperScan`,也可以直接在 Mapper 类上面添加注解`@Mapper`，建议使用@MapperScan扫描。

```java
@SpringBootApplication
@MapperScan("com.demo.dao")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```

### Mapper

```java
public interface AccountMapper {

    @Insert("insert into account(name, money) values(#{name}, #{money})")
    int add(@Param("name") String name, @Param("money") double money);

    @Update("update account set name = #{name}, money = #{money} where id = #{id}")
    int update(@Param("name") String name, @Param("money") double money, @Param("id") int  id);

    @Delete("delete from account where id = #{id}")
    int delete(int id);

    @Select("select id, name , money  from account where id = #{id}")
    Account findAccount(@Param("id") int id);

    @Select("select id, name , money  from account")
    List<Account> findAccountList();
}
```

- @Select 是查询类的注解，所有的查询均使用这个
- @Result 修饰返回的结果集，关联实体类属性和数据库字段一一对应，如果实体类属性和数据库属性名保持一致，就不需要这个属性来修饰。
- @Insert 插入数据库使用，直接传入实体类会自动解析属性到对应的值
- @Update 负责修改，也可以直接传入对象
- @delete 负责删除

### 单元测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {


    @Autowired
    AccountService accountService;



    @Test
    public void test(){

        Account account = accountService.findAccount(1);

        System.out.println(account);
    }
}
```

## xml配置方式

### 配置文件

```properties
## 数据源配置
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

## Mybatis 配置
mybatis.typeAliasesPackage=com.demo.domain

mybatis.mapper-locations=classpath:mapper/*.xml
```

### 配置mapper

```java
public interface UserMapper {
	
	List<User> getAll();
	
	User getOne(Long id);

	void insert(User user);

	void update(User user);

	void delete(Long id);

}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.demo.dao.UserMapper" >
    <resultMap id="BaseResultMap" type="com.demo.domain.User" >
        <id column="id" property="id" jdbcType="BIGINT" />
        <result column="userName" property="userName" jdbcType="VARCHAR" />
        <result column="passWord" property="passWord" jdbcType="VARCHAR" />
        <result column="nick_name" property="nickName" jdbcType="VARCHAR" />
    </resultMap>

    <sql id="Base_Column_List" >
        id, userName, passWord, user_sex, nick_name
    </sql>

    <select id="getAll" resultMap="BaseResultMap"  >
        SELECT
        <include refid="Base_Column_List" />
        FROM users
    </select>

    <select id="getOne" parameterType="java.lang.Long" resultMap="BaseResultMap" >
        SELECT
        <include refid="Base_Column_List" />
        FROM users
        WHERE id = #{id}
    </select>

    <insert id="insert" parameterType="com.demo.domain.User" >
        INSERT INTO
        users
        (userName,passWord,user_sex)
        VALUES
        (#{userName}, #{passWord}, #{userSex})
    </insert>

    <update id="update" parameterType="com.demo.domain.User" >
        UPDATE
        users
        SET
        <if test="userName != null">userName = #{userName},</if>
        <if test="passWord != null">passWord = #{passWord},</if>
        nick_name = #{nickName}
        WHERE
        id = #{id}
    </update>

    <delete id="delete" parameterType="java.lang.Long" >
        DELETE FROM
        users
        WHERE
        id =#{id}
    </delete>
</mapper>
```

和使用注解方式主要区别是，把sql拆到xml文件中了。

## Mybatis #与$的区别

**1、 #是一个占位符，$是拼接符。**

 \#是一个占位符，$是拼接符。

**（1）**使用#parameterName方式引用参数的时候，Mybatis会把传入的参数当成是一个字符串，自动添加双引号。

（2）使用$parameterName引用参数时，不做任何处理，直接将值拼接在sql语句中。

**2、使用 # 能够防止sql注入，$不能避免注入攻击。**

   \#的方式引用参数，mybatis会先对sql语句进行预编译，然后再引用值，能够有效防止sql注入，提高安全性。$的方式引用参数，sql语句不进行预编译。

## 多数据源配置

### 配置文件

```properties
mybatis.type-aliases-package=com.demo.model

spring.datasource.test1.jdbc-url=jdbc:mysql://localhost:3306/test1?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8&useSSL=true
spring.datasource.test1.username=root
spring.datasource.test1.password=123456
spring.datasource.test1.driver-class-name=com.mysql.cj.jdbc.Driver

spring.datasource.test2.jdbc-url=jdbc:mysql://localhost:3306/test?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8&useSSL=true
spring.datasource.test2.username=root
spring.datasource.test2.password=123456
spring.datasource.test2.driver-class-name=com.mysql.cj.jdbc.Driver
```

### 配置数据源

```java

//扫描不同的包，使用不同的数据源
@Configuration
@MapperScan(basePackages = "com.demo.mapper.test1", sqlSessionTemplateRef  = "test1SqlSessionTemplate")
public class DataSource1Config {

    @Bean(name = "test1DataSource")
    @ConfigurationProperties(prefix = "spring.datasource.test1")
    @Primary
    public DataSource testDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "test1SqlSessionFactory")
    @Primary
    public SqlSessionFactory testSqlSessionFactory(@Qualifier("test1DataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        return bean.getObject();
    }

    @Bean(name = "test1TransactionManager")
    @Primary
    public DataSourceTransactionManager testTransactionManager(@Qualifier("test1DataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "test1SqlSessionTemplate")
    @Primary
    public SqlSessionTemplate testSqlSessionTemplate(@Qualifier("test1SqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
```