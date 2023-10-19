---
title: Spring  @Autowired Map
author: 程序员子龙
index: true
icon: discover
category:
- Spring

---
# Spring  @Autowired Map List

这是Spring的一个特殊的注入功能

当注入一个Map的时候 ，value泛型为T，则注入后Spring会将实例化后的bean放入value ，key则为注入后bean的名字

当注入一个List的时候，List的泛型为T，则注入后Spring会将实例化的bean放入List中

定义一个接口

```
public interface UserService {
    
}
```

两个实现类

```
@Service("beijing")
public class BeijingUserServiceImpl implements UserService{
    
}


@Service("shanghai")
public class ShanghaiServiceImpl implements UserService {
    
}

```

测试类

```
@Autowired
Map<String, UserService> map ;

@Autowired
List<UserService> list;

public void test(){
	 for (Map.Entry m : map.entrySet()){
            System.out.println("key : " + m.getKey()+" =value:" + m.getValue());
        }
        
           for (Map.Entry m : map.entrySet()){
            System.out.println("key : " + m.getKey()+"; value:" + m.getValue());
        }

        list.stream().forEach(l ->{

            System.out.println(l.toString());
        });

}
```

打印结果：

```
key : beijing; value:com.test.controller.BeijingUserServiceImpl@188c5d23
key : shanghai; value:com.test.controller.ShanghaiServiceImpl@183e329d

com.test.controller.BeijingUserServiceImpl@188c5d23
com.test.controller.ShanghaiServiceImpl@183e329d
```

注入map的使用场景：

完成简单版的策略模式