---
title: Java 模板变量替换（字符串、占位符替换）
author: 程序员子龙
index: true
icon: discover
category:
- java 基础

---
1、**org.apache.commons.text**

变量默认前缀是${，后缀是}

```java
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>2.0.12</version>
</dependency>
```



```
Map valuesMap = new HashMap();
valuesMap.put("code", 1234);
String templateString = "验证码:${code},您正在登录管理后台，5分钟内输入有效。";
StringSubstitutor sub = new StringSubstitutor(valuesMap);
String content= sub.replace(templateString);
System.out.println(content);
```

> 验证码:1234,您正在登录管理后台，5分钟内输入有效。

修改前缀、后缀

```java
Map valuesMap = new HashMap();
valuesMap.put("code", 1234);
String templateString = "验证码:[code],您正在登录管理后台，5分钟内输入有效。";
StringSubstitutor sub = new StringSubstitutor(valuesMap);
//修改前缀、后缀
sub.setVariablePrefix("[");
sub.setVariableSuffix("]");
String content= sub.replace(templateString);
System.out.println(content);
```

2、**org.springframework.expression**

```java

String smsTemplate = "验证码:#{[code]},您正在登录管理后台，5分钟内输入有效。";
Map<String, Object> params = new HashMap<>();
params.put("code", 12345);;

ExpressionParser parser = new SpelExpressionParser();
TemplateParserContext parserContext = new TemplateParserContext();
String content = parser.parseExpression(smsTemplate,parserContext).getValue(params, String.class);

System.out.println(content);
```

> 验证码:12345,您正在登录管理后台，5分钟内输入有效。

ExpressionParser是简单的用java编写的表达式解析器，官方文档：

[http://docs.spring.io/spring/docs/current/spring-framework-reference/html/expressions.html](https://links.jianshu.com/go?to=http%3A%2F%2Fdocs.spring.io%2Fspring%2Fdocs%2Fcurrent%2Fspring-framework-reference%2Fhtml%2Fexpressions.html)

**3、java.text.MessageFormat**

```java
Object[] params = new Object[]{"1234", "5"};
String msg = MessageFormat.format("验证码:{0},您正在登录管理后台，{1}分钟内输入有效。", params);
System.out.println(msg);
```

> 验证码:1234,您正在登录管理后台，10分钟内输入有效。

**4、java.lang.String**

```java
String s = String.format("My name is %s. I am %d.", "Tom", 18);
System.out.println(s);
```

常用的占位符含义:

| 转换符 | 详细说明                                     | 示例                     |
| ------ | -------------------------------------------- | ------------------------ |
| %s     | 字符串类型                                   | “喜欢请收藏”             |
| %c     | 字符类型                                     | ‘m’                      |
| %b     | 布尔类型                                     | true                     |
| %d     | 整数类型（十进制）                           | 88                       |
| %x     | 整数类型（十六进制）                         | FF                       |
| %o     | 整数类型（八进制）                           | 77                       |
| %f     | 浮点类型                                     | 8.888                    |
| %a     | 十六进制浮点类型                             | FF.35AE                  |
| %e     | 指数类型                                     | 9.38e+5                  |
| %g     | 通用浮点类型（f和e类型中较短的）             | 不举例(基本用不到)       |
| %h     | 散列码                                       | 不举例(基本用不到)       |
| %%     | 百分比类型                                   | ％(%特殊字符%%才能显示%) |
| %n     | 换行符                                       | 不举例(基本用不到)       |
| %tx    | 日期与时间类型（x代表不同的日期与时间转换符) | 不举例(基本用不到)       |