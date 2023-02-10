---
title: springboot启动的时候排除加载某些bean
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
@SpringBootApplication的exclude 专门用来排除auto-configuration 也就是我们说的自动配置的类的。例如：

```java
@SpringBootApplication(exclude = KafkaAutoConfiguration.class)
```

如果在@SpringBootApplication排除非自动配置类，会报错

用@SpringBootApplication(exclude = RibbonRule.class)排除类@bean注入的类的时候报错

The following classes could not be excluded because they are not auto-configuration classes.....

如果想要排除我们自定义的@Bean,可以用 

```java
@ComponentScan(excludeFilters= {@ComponentScan.Filter(type=FilterType.ASSIGNABLE_TYPE, value= {RedisUtil.class})})
```

