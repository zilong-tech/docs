---
title: ApplicationRunner、InitializingBean、@PostConstruct使用详解
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
## 概述

开发中可能会有这样的场景，需要在容器启动的时候执行一些内容。比如读取配置文件，数据库连接之类的。SpringBoot给我们提供了两个接口来帮助我们实现这种需求。两个启动加载接口分别是：CommandLineRunner和ApplicationRunner。Spring 提供了接口 InitializingBean，jdk提供了@PostConstruct

## CommandLineRunner和ApplicationRunner区别

CommandLineRunner和ApplicationRunner的作用是相同的。不同之处在于CommandLineRunner接口的run()方法接收String数组作为参数，即是最原始的参数，没有做任何处理；而ApplicationRunner接口的run()方法接收ApplicationArguments对象作为参数，是对原始参数做了进一步的封装。

当程序启动时，我们传给main()方法的参数可以被实现CommandLineRunner和ApplicationRunner接口的类的run()方法访问，即可接收启动服务时传过来的参数。我们可以创建多个实现CommandLineRunner和ApplicationRunner接口的类。为了使他们按一定顺序执行，可以使用@Order注解或实现Ordered接口。

### ApplicationRunner接口的示例

```java
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
 
@Component
@Order(value = 1)
public class JDDRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
    
        System.out.println("这个是测试ApplicationRunner接口");
               String strArgs = Arrays.stream(arg0.getSourceArgs()).collect(Collectors.joining("|"));
        System.out.println("Application started with arguments:" + strArgs);
    }
}

```

启动时候指定参数：java -jar xxxx.jar data1 data2 data3 

> 这个是测试ApplicationRunner接口
>
> Application started with arguments:data1|data2|data3

### CommandLineRunner接口示例

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TestCommandLineRunner implements CommandLineRunner {
 
    @Override
    public void run(String... args) throws Exception {
        System.out.println("这个是测试CommandLineRunn接口");
         String strArgs = Arrays.stream(args).collect(Collectors.joining("|"));
        System.out.println("Application started with arguments:" + strArgs);
    }
}
```

启动时候指定参数：java -jar xxxx.jar data1 data2 data3 

运行结果：

> 这个是测试CommandLineRunn接口
>
> Application started with arguments:data1|data2|data3

### CommandLineRunner和ApplicationRunner的执行顺序

在spring boot程序中，我们可以使用不止一个实现CommandLineRunner和ApplicationRunner的bean。为了有序执行这些bean的run()方法，可以使用@Order注解或Ordered接口。

```java
@Component
@Order(2)
public class ApplicationRunnerBean1 implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments arg0) throws Exception {
        System.out.println("ApplicationRunnerBean 1");
    }
}
```

```java
@Component
@Order(4)
public class ApplicationRunnerBean2 implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments arg0) throws Exception {
        System.out.println("ApplicationRunnerBean 2");
    }
}
```

```java
@Component
@Order(1)
public class CommandLineRunnerBean1 implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("CommandLineRunnerBean 1");
    }
}
```

```java
@Component
@Order(3)
public class CommandLineRunnerBean2 implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("CommandLineRunnerBean 2");
    }
}
```

执行结果：

> CommandLineRunnerBean 1
> ApplicationRunnerBean 1
> CommandLineRunnerBean 2
> ApplicationRunnerBean 2

### 实现多个ApplicationRunner时部分接口未执行

```
@Component
@Slf4j
public class RunnerTest1 implements ApplicationRunner {
 
    @Override
    public void run(ApplicationArguments args) throws Exception {
 
        while (true) {
            System.out.println("this is RunnerTest1");
            Thread.sleep(100);
        }
 
    }
}
```

```java
@Component
@Slf4j
public class RunnerTest2 implements ApplicationRunner {
 
    @Override
    public void run(ApplicationArguments args) throws Exception {
 
        while (true) {
            System.out.println("this is RunnerTest2");
            Thread.sleep(100);
        }
 
    }
}
```

只会执行RunnerTest1中方法。

通过分析springboot启动的源码可以发现，在applicationContext容器加载完成之后，会调用SpringApplication类的callRunners方法：

![](https://www.freesion.com/images/194/07f67d35d13eaab6a2bacae804ae8e8a.png)

该方法中会获取所有实现了ApplicationRunner和CommandLineRunner的接口bean，然后依次执行对应的run方法，并且是在同一个线程中执行。因此如果有某个实现了ApplicationRunner接口的bean的run方法一直循环不返回的话，后续的代码将不会被执行。

## ApplicationRunner、InitializingBean、@PostConstruct执行顺序问题

### InitializingBean接口的用法

InitializingBean接口为bean提供了初始化方法的方式，它只包括afterPropertiesSet方法，凡是继承该接口的类，在初始化bean的时候都会执行该方法。注意，实现该接口的最好加上Spring的注解注入，比如@Component

### @PostConstruct注解的用法

如果想在生成对象时候完成某些初始化操作，而偏偏这些初始化操作又依赖于依赖注入，那么就无法在构造函数中实现。为此，可以使用@PostConstruct注解一个方法来完成初始化，@PostConstruct注解的方法将会在依赖注入完成后被自动调用。 优先级： Constructor >> @Autowired >> @PostConstruct

```java
@Component
public class Test implements InitializingBean, ApplicationRunner, CommandLineRunner {

    @PostConstruct
    public void init(){
        System.out.println("PostConstruct 方法执行");
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean 方法执行");
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("这个是测试ApplicationRunner接口");

    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("这个是测试CommandLineRunn接口");
    }
}
```

> PostConstruct 方法执行
> InitializingBean 方法执行
>
> 这个是测试ApplicationRunner接口
> 这个是测试CommandLineRunn接口

由此可知： @PostConstruct>InitializingBean>ApplicationRunner>CommandLineRunner