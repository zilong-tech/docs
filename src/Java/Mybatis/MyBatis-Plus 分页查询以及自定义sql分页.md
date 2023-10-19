---
title: MyBatis-Plus 分页查询以及自定义sql分页
index: true
icon: discover
category:
- Mybatis
---
## 配置分页查询

```java
@Configuration
public class MybatisPlusConfig {

    /**
     * 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        PaginationInnerInterceptor paginationInnerInterceptor = new PaginationInnerInterceptor();
        paginationInnerInterceptor.setDbType(DbType.MYSQL);
        paginationInnerInterceptor.setOverflow(true);
        interceptor.addInnerInterceptor(paginationInnerInterceptor);
        return interceptor;
    }


}
```

## 默认分页方式

```java
    /**
     * 根据 entity 条件，查询全部记录（并翻页）
     *
     * @param page         分页查询条件（可以为 RowBounds.DEFAULT）
     * @param queryWrapper 实体对象封装操作类（可以为 null）
     */
    IPage<T> selectPage(IPage<T> page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
 
    /**
     * 根据 Wrapper 条件，查询全部记录（并翻页）
     *
     * @param page         分页查询条件
     * @param queryWrapper 实体对象封装操作类
     */
    IPage<Map<String, Object>> selectMapsPage(IPage<T> page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
```

方法调用：

```java
Page<User> page = new Page<>(1,2);
IPage<User> userIPage = userMapper.selectPage(page, wrapper);
System.out.println("总页数"+userIPage.getPages());
System.out.println("总记录数"+userIPage.getTotal());
```

分页查询执行sql如下，先是查询了一次总记录数，然后在查询的数据。执行结果：

> [           main] c.d.m.UserMapper.selectPage_mpCount      : ==>  Preparing: SELECT COUNT(*) AS total FROM users
> [           main] c.d.m.UserMapper.selectPage_mpCount      : ==> Parameters: 
> [           main] c.d.m.UserMapper.selectPage_mpCount      : <==      Total: 1
> [           main] com.demo.mapper.UserMapper.selectPage    : ==>  Preparing: SELECT id,user_name,pass_word,nick_name,user_sex FROM users LIMIT ?
> [           main] com.demo.mapper.UserMapper.selectPage    : ==> Parameters: 2(Long)
> [           main] com.demo.mapper.UserMapper.selectPage    : <==      Total: 2

## 自定义分页查询

多表查询需要我们自己写sql来进行分页查询。

定义分页查询接口

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {

 IPage<User> selectPageVo(IPage<User> page, @Param(Constants.WRAPPER) Wrapper<User> queryWrapper);

}
```

定义查询语句

```xml
<mapper namespace="com.demo.mapper.UserMapper">

    <select id="selectPageVo" resultType="com.demo.domain.User">
        SELECT id FROM users  ${ew.customSqlSegment}
    </select>

</mapper>
```

方法调用：

```java
 LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>();
 IPage<User> page = new Page<>(1,10);
 userMapper.selectPageVo(page,wrapper);
```

## 多表分页查询

多表联合查询和单表查询都是一样的

```java
IPage<User> selectUserInfoList(IPage<User> page);
```

```xml
<select id="selectUserInfoList" resultType="com.demo.domain.User">

    SELECT * from users u ,account c where u.user_name = c.`name`
</select>
```