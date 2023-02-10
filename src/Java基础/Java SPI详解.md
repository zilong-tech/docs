---
title: Java SPI 详解
author: 程序员子龙
index: true
icon: discover
category:
- Java 基础

---
## 什么是SPI

 SPI 全称 Service Provider Interface，是Java提供的一套用来被第三方实现或者扩展的接口，它可以用来启用框架扩展和替换组件。 SPI的作用就是为这些被扩展的API寻找服务实现，一种服务发现机制。

SPI是专门提供给服务提供者或者扩展框架功能的开发者去使用的一个接口。

SPI 将服务接口和具体的服务实现分离开来，将服务调用方和服务实现者**解耦**，能够提升程序的扩展性、可维护性。修改或者替换服务实现并不需要修改调用方。

SPI 最典型的应用是JDBC接口，但并未提供具体实现类，而是在不同厂商提供的数据库实现包。

![](https://pic.rmb.bdstatic.com/bjh/down/e9e79669a5ca23ce9b0ffe05d47b298b.png)

SPI实现服务接口与服务实现的解耦：

- 服务提供者（如 springboot starter）提供出 SPI 接口，让客户端去自定义实现。
- 客户端（普通的 springboot 项目）即可通过本地注册的形式，将实现类注册到服务端，轻松实现可插拔。

## API 和 SPI 区别

API：大多数情况下，都是实现方制定接口并完成对接口的实现，调用方仅仅依赖接口调用。 

SPI ：是调用方来制定接口规范，提供给外部来实现，调用方在调用时则选择自己需要的外部实现。

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202212081713753.png)

## 简单实现

### 定义接口

```java
package com.test.service;

public interface ISpi {
    void say();
}

```

### 定义接口实现

第一个实现类：

```java
package com.test.service.impl;

import com.test.service.ISpi;

public class FirstSpiImpl implements ISpi {

    @Override
    public void say() {
        System.out.println("我是第一个SPI实现类");
    }
}

```

第二个实现类：

```java
package com.test.service.impl;

import com.test.service.ISpi;

public class SecondSpiImpl implements ISpi {

    @Override
    public void say() {
        System.out.println("我是第二个SPI实现类");
    }
}

```

### 编写配置文件

在resources目录下新建META-INF/services目录，并且在这个目录下新建一个与上述接口的全限定名一致的文件，在这个文件中写入接口的实现类的全限定名，并写上需要动态加载的实现类的全路径名。

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202212081739763.png)

```
#com.test.service.impl.FirstSpiImpl
com.test.service.impl.SecondSpiImpl
```

## 实现原理

从上面的例子，可以看到最关键的实现就是ServiceLoader这个类，看下这个类的源码：

```java
public final class ServiceLoader<S> implements Iterable<S> {
 
 
    //扫描目录前缀
    private static final String PREFIX = "META-INF/services/";
 
    // 被加载的类或接口
    private final Class<S> service;
 
    // 用于定位、加载和实例化实现方实现的类的类加载器
    private final ClassLoader loader;
 
    // 上下文对象
    private final AccessControlContext acc;
 
    // 按照实例化的顺序缓存已经实例化的类
    private LinkedHashMap<String, S> providers = new LinkedHashMap<>();
 
    // 懒查找迭代器
    private java.util.ServiceLoader.LazyIterator lookupIterator;
 
    // 私有内部类，提供对所有的service的类的加载与实例化
    private class LazyIterator implements Iterator<S> {
        Class<S> service;
        ClassLoader loader;
        Enumeration<URL> configs = null;
        String nextName = null;
 
        //...
        private boolean hasNextService() {
            if (configs == null) {
                try {
                    //获取目录下所有的类
                    String fullName = PREFIX + service.getName();
                    if (loader == null)
                        configs = ClassLoader.getSystemResources(fullName);
                    else
                        configs = loader.getResources(fullName);
                } catch (IOException x) {
                    //...
                }
                //....
            }
        }
 
        private S nextService() {
            String cn = nextName;
            nextName = null;
            Class<?> c = null;
            try {
                //反射加载类
                c = Class.forName(cn, false, loader);
            } catch (ClassNotFoundException x) {
            }
            try {
                //实例化
                S p = service.cast(c.newInstance());
                //放进缓存
                providers.put(cn, p);
                return p;
            } catch (Throwable x) {
                //..
            }
            //..
        }
    }
}
```

应用程序通过迭代器接口获取对象实例，这里首先会判断 providers 对象中是否有实例对象：

- 有实例，那么就返回
- 没有，执行类的装载步骤，具体类装载实现如下：

LazyIterator#hasNextService 读取 META-INF/services 下的配置文件，获得所有能被实例化的类的名称，并完成 SPI 配置文件的解析

LazyIterator#nextService 负责实例化 hasNextService() 读到的实现类，并将实例化后的对象存放到 providers 集合中缓存

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202212081820820.png)

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202212081753735.png)

## 应用案例

Java定义了一套JDBC的接口，但并未提供具体实现类，而是在不同厂商提供的数据库实现包。

一般要根据自己使用的数据库驱动jar包，比如我们最常用的MySQL，其`mysql-jdbc-connector.jar` 里面就有：

![](https://upload-images.jianshu.io/upload_images/16782311-73a0ce8d03357061?imageMogr2/auto-orient/strip|imageView2/2/w/687/format/webp)

sharding-jdbc 数据加密模块，本身支持 AES 和 MD5 两种加密方式。但若客户端不想用内置的两种加密，想用 RSA 算法呢？

sharding-jdbc 提供出 EncryptAlgorithm 加密算法接口，并引入 SPI 机制，做到服务接口与服务实现分离的效果。

客户端想要使用自定义加密算法，只需在客户端项目 `META-INF/services` 的路径下定义接口的全限定名称文件，并在文件内写上加密实现类的全限定名

![](https://upload-images.jianshu.io/upload_images/16782311-a6335862e8655cad?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

![](https://upload-images.jianshu.io/upload_images/16782311-3130954d64ac9eb4?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

## 总结

SPI 有如下的好处：

- 不需要改动源码就可以实现扩展，解耦。
- 实现扩展对原来的代码几乎没有侵入性。
- 只需要添加配置就可以实现扩展，符合开闭原则。

