---
title: spring boot 配置文件的加载顺序
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
SpringApplication 类默认会把以“**--**”开头的**命令行参数**转化成应用中可以使用的**配置参数**，例如，--spring.profiles.active=dev

优先级从高到低，高优先级的配置覆盖低优先级的配置，所有配置会形成互补配置。 

1、命令行参数。所有的配置都可以在命令行上进行指定； 

2、Java系统属性（System.getProperties()）； 

在idea中设置 VM options

![image-20220421221932320](http://img.xxfxpt.top/202204212219982.png)

启动脚本中设置

```shell
java -jar -Dbook.name=sanguo chapter-1-spring-boot-quickstart-1.0.jar

```

在程序中使用

```java
   @RequestMapping(value = "/hello",method = RequestMethod.GET)
    @ResponseBody
    public String sayHello() {
        System.out.println(age);

        System.out.println(System.getProperty("book.name"));
        return "Hello，Spring Boot！";
    }
```

\3. 操作系统环境变量 ； 

\4. jar包外部的application-{profile}.properties或application.yml(带spring.profile)配置⽂件 

\5. jar包内部的application-{profile}.properties或application.yml(带spring.profile)配置⽂件 再来加 

载不带profile 

\6. jar包外部的application.properties或application.yml(不带spring.profile)配置⽂件 

\7. jar包内部的application.properties或application.yml(不带spring.profile)配置⽂件 

\8. @Configuration注解类上的@PropertySource 