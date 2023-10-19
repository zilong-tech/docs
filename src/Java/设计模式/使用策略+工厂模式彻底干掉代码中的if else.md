---
title: 使用策略+工厂模式彻底干掉代码中的if else
author: 程序员子龙
index: true
icon: discover
category:
- 设计模式
---
对于业务开发来说，业务逻辑的复杂是必然的，随着业务发展，需求只会越来越复杂，为了考虑到各种各样的情况，代码中不可避免的会出现很多if-else。

一旦代码中if-else过多，就会大大的影响其可读性和可维护性。

![](http://img.xxfxpt.top/202205282145773.png)

其实，if-else是有办法可以消除掉的，其中比较典型的并且使用广泛的就是借助策略模式和工厂模式，准确的说是利用这两个设计模式的思想，彻底消灭代码中的if-else。

本文，就结合这两种设计模式，介绍如何消除if-else，并且，还会介绍如何和Spring框架结合，这样读者看完本文之后就可以立即应用到自己的项目中。

### 需求背景

监听上游服务MQ消息，根据不同的操作类型（type）做相对应的个性化处理。目前接收的就三种，随着业务拓展还会不断的增加，所以此处按照原来的if-else去处理会显得比较呆。

伪代码：

```java
public void consume(Message message) {
    
    String type = message.getType();
    if (TypeEnum.OP_CODE_100.getCode().equals(type)) {
        opCode_100(detailsDO);
    } else if (TypeEnum.OP_CODE_110.getCode().equals(type)) {
        opCode_110(detailsDO);
    } else if (TypeEnum.OP_CODE_120.getCode().equals(type)) {
        opCode_120(detailsDO);
    }
   
 
}
```

下面我们通过工厂模式+策略模式，来实现这个功能。

策略模式（Strategy Pattern）定义了一组策略，分别在不同类中封装起来，每种策略都可以根据当前场景相互替换，从而使策略的变化可以独立于操作者。

#### 定义策略工厂

```java
@Component
public class EventServiceFactory   {
 
    // 存放策略实现类
    private static  Map<String, EventService> EVENT_SERVICE_MAP = new ConcurrentHashMap<>(255);
 
    // 通过类型找service
    public static EventService getHandler(String type) {
        return EVENT_SERVICE_MAP.get(type);
    }

    // 将EventService 的实现类放到map中
    public static void register(String type,EventService eventService){
        EVENT_SERVICE_MAP.put(type,eventService);
    }
}
```

#### 定义抽象的数据策略接口

```java
public interface EventService extends InitializingBean {

    void handler(String type);
}
```

#### 具体策略实现类

```java
@Service
public class FirstEventServiceImpl implements EventService{


    @Override
    public void handler(String type) {
        // TODO 实现业务
    }


    // Spring 启动时候调用此方法
    @Override
    public void afterPropertiesSet() throws Exception {
        EventServiceFactory.register("101",this);
    }
}
```

如果后续再有别的type，我们只需要增加新的service就可以，这样代码的扩展性更好。

接下来，我们再去实现本次需求。

```java
public void consume(Message message) {
    
    String type = message.getType();

    EventService eventService = EventServiceFactory.getHandler(type);
    eventService.handler(type);
}
```

### 总结

本文，我们通过策略模式、工厂模式以及Spring的InitializingBean，提升了代码的可读性以及可维护性，彻底消灭了一坨if-else。

- 易于扩展，增加一个新的策略只需要添加一个具体的策略实现类即可，基本不需要改变原有的代码，符合开放封闭原则
- 避免使用多重条件选择语句，充分体现面向对象设计思想
- 策略类之间可以自由切换，由于策略类都实现同一个接口，所以使它们之间可以自由切换
- 每个策略类使用一个策略类，符合单一职责原则
- 客户端与策略算法解耦，两者都依赖于抽象策略接口，符合依赖反转原则
- 客户端不需要知道都有哪些策略类，符合最小可用原则

