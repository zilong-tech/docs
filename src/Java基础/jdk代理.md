---
title: JDK 代理
author: 程序员子龙
index: true
icon: discover
category:
- Java 基础

---
### 静态代理

静态代理有两种实现，继承和聚合

**继承**

需要定义接口或者父类，被代理对象与代理对象一起实现相同的接口或者继续相同父类，代理对象继承目标对象，重新目标对象的方法

```java
//目标对象
public class UserService {

    public void login(){
        System.out.println("login success");
    }
}
//代理对象
public class UserServiceProxy extends UserService{

    public void login(){
        System.out.println("开始执行--------------");
        super.login();
    }


    public static void main(String[] args) {
        UserServiceProxy proxy = new UserServiceProxy();
        proxy.login();
    }
}
```

聚合

![img](https://pic4.zhimg.com/v2-0ea80f06f0371d129fdc5fe9a88d84af_b.png)

Subject：抽象主题角色，抽象主题类可以是抽象类，也可以是接口，是一个最普通的业务类型定义，无特殊要求。

RealSubject：具体主题角色，也叫被委托角色、被代理角色。是业务逻辑的具体执行者。

Proxy：代理主题角色，也叫委托类、代理类。它把所有抽象主题类定义的方法给具体主题角色实现，并且在具体主题角色处理完毕前后做预处理和善后工作。

```java
//Subject
public interface UserService {

    public void login();
}

//RealSubject
public class UserServiceImpl implements UserService{
    @Override
    public void login() {
        System.out.println("login success");
    }
}
//代理类Proxy
public class UserServiceProxy implements UserService{


    UserService userService;

    public UserServiceProxy(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void login() {

        System.out.println("===========开始执行===============");
        userService.login();
    }

    public static void main(String[] args) {
        UserServiceProxy proxy = new UserServiceProxy(new UserServiceImpl());
        proxy.login();

    }
}
```

静态代理缺点：类太多

### **动态代理**

jdk动态代理是利用反射机制生成一个实现代理接口的匿名类，在调用具体方法前调用InvokeHandler来处理。

动态代理步骤：

1.创建一个实现接口InvocationHandler的类，它必须实现invoke方法

2.创建被代理的类以及接口

3.通过Proxy的静态方法

newProxyInstance(ClassLoaderloader, Class[] interfaces, InvocationHandler h)创建一个代理

4.通过代理调用方法

![img](https://pic3.zhimg.com/v2-e2c5d9daf35ae02c21c6c34163ecdcaa_b.png)

```java
public interface UserManager {

    //新增用户抽象方法
    void addUser(String userName,String password);
}

public class UserManagerImpl implements UserManager{
    @Override
    public void addUser(String userName, String password) {
        System.out.println("调用了新增的方法！");
        System.out.println("传入参数为 userName: "+userName+" password: "+password);
    }
}


public class JdkProxy implements InvocationHandler {


    private Object target; //需要代理的目标对象
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("JDK动态代理，监听开始！");
        Object result = method.invoke(target, args);
        System.out.println("JDK动态代理，监听结束！");
        return result;

    }

    //定义获取代理对象方法
    private Object getJDKProxy(Object targetObject) {
        //为目标对象target赋值
        this.target = targetObject;
        //JDK动态代理只能针对实现了接口的类进行代理，newProxyInstance 函数所需参数就可看出
        return Proxy.newProxyInstance(targetObject.getClass().getClassLoader(), targetObject.getClass().getInterfaces(), this);
    }

    public static void main(String[] args) {
        JdkProxy jdkProxy = new JdkProxy();//实例化JDKProxy对象
        //user 是代理对象
        UserManager user = (UserManager) jdkProxy.getJDKProxy(new UserManagerImpl());//获取代理对象
        user.addUser("admin", "123123");//执行新增方法
    }


}
```

![img](https://pic3.zhimg.com/v2-4f4007ec05916fd9f8a2bb6bb1ec13a6_b.png)

运行结果

```
JDK动态代理，监听开始！
调用了新增的方法！
传入参数为 userName: admin password: 123123
JDK动态代理，监听结束！
```

运行时候，代理对象调用JdkProxy 的invoke方法

**可以看到，动态代理使我们免于去重写接口中的方法，而着重于去扩展相应的功能或是方法的增强，与静态代理相比简单了不少，减少了项目中的代码量**

**打印代理类：**

```java
public static void createProxyClassFile(){

    byte[] $Proxy0s = ProxyGenerator.generateProxyClass("$Proxy0", new Class[]{UserManager.class});
    try {
        FileOutputStream fos = new FileOutputStream("$Proxy0.class");
        fos.write($Proxy0s);
        fos.close();
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

![img](https://pic3.zhimg.com/v2-50973c2348c9e93215d50cc48a6cd99e_b.png)

可以看出代理对象实现了UserManager接口，在addUser方法中，只有super.h.invoke(this, m3, new Object[]{var1, var2});h是代理对象

![img](https://pic1.zhimg.com/v2-40aef3eced1b48ae03072c9d348a199c_b.png)

**实现原理：**

```java
Subject subject = (Subject) Proxy.newProxyInstance(loader, interfaces, handler);
```

代理对象，调用业务方法时，会直接执行到代理对象关联的handler对象的invoke方法。

因为JDK生成的最终真正的代理类，它继承自Proxy并实现了我们定义的Subject接口，

在实现Subject接口方法的内部，通过反射调用了InvocationHandlerImpl的invoke方法。

主要步骤：

通过实现 InvocationHandler 接口创建自己的调用处理器；

通过为 Proxy 类指定 ClassLoader 对象和一组 interface 来创建动态代理类；

通过反射机制获得动态代理类的构造函数，其唯一参数类型是调用处理器接口类型；

通过构造函数创建动态代理类实例，构造时调用处理器对象作为参数被传入。

### 小结

**简单一句话，动态代理就是要生成一个包装类对象，由于代理的对象是动态的，所以叫动态代理。由于我们需要增强，这个增强是需要留给开发人员开发代码的，因此代理类不能直接包含被代理对象，而是一个InvocationHandler，该InvocationHandler包含被代理对象，并负责分发请求给被代理对象，分发前后均可以做增强。从原理可以看出，JDK动态代理是“对象”的代理。**

**JDK代理要求被代理的类必须实现接口，有很强的局限性。**