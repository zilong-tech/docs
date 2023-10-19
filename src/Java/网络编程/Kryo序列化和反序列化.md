---
title: Kryo 的序列化和序列化
author: 程序员子龙
index: true
icon: discover
category:
- Netty
---
### Kryo 的序列化

作为一个灵活的序列化框架，Kryo 并不关心读写的数据，作为开发者，你可以随意使用 Kryo 提供的那些开箱即用的序列化器。

引入依赖

```
<dependency>
    <groupId>de.javakaffee</groupId>
    <artifactId>kryo-serializers</artifactId>
    <version>0.42</version>
</dependency>
```

使用工厂的方式实例化Kryo

```java
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.serializers.DefaultSerializers;
import de.javakaffee.kryoserializers.*;

import java.lang.reflect.InvocationHandler;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Kryo的工厂,实例化Kryo
 */
public class KryoFactory {

    public static Kryo createKryo() {

        Kryo kryo = new Kryo();
        kryo.setRegistrationRequired(false);
        kryo.register(Arrays.asList("").getClass(), new ArraysAsListSerializer());
        kryo.register(GregorianCalendar.class, new GregorianCalendarSerializer());
        kryo.register(InvocationHandler.class, new JdkProxySerializer());
        kryo.register(BigDecimal.class, new DefaultSerializers.BigDecimalSerializer());
        kryo.register(BigInteger.class, new DefaultSerializers.BigIntegerSerializer());
        kryo.register(Pattern.class, new RegexSerializer());
        kryo.register(BitSet.class, new BitSetSerializer());
        kryo.register(URI.class, new URISerializer());
        kryo.register(UUID.class, new UUIDSerializer());
        UnmodifiableCollectionsSerializer.registerSerializers(kryo);
        SynchronizedCollectionsSerializer.registerSerializers(kryo);

        kryo.register(HashMap.class);
        kryo.register(ArrayList.class);
        kryo.register(LinkedList.class);
        kryo.register(HashSet.class);
        kryo.register(TreeSet.class);
        kryo.register(Hashtable.class);
        kryo.register(Date.class);
        kryo.register(Calendar.class);
        kryo.register(ConcurrentHashMap.class);
        kryo.register(SimpleDateFormat.class);
        kryo.register(GregorianCalendar.class);
        kryo.register(Vector.class);
        kryo.register(BitSet.class);
        kryo.register(StringBuffer.class);
        kryo.register(StringBuilder.class);
        kryo.register(Object.class);
        kryo.register(Object[].class);
        kryo.register(String[].class);
        kryo.register(byte[].class);
        kryo.register(char[].class);
        kryo.register(int[].class);
        kryo.register(float[].class);
        kryo.register(double[].class);

        return kryo;
    }
}
```

封装序列化和反序列化工具

```java
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;

import java.io.ByteArrayOutputStream;

public class KryoSerializer {
    /**
     * 解决线程安全问题
     */
    private static final ThreadLocal<Kryo> kryoPool = ThreadLocal.withInitial(() -> {
        Kryo temp = KryoFactory.createKryo();
        temp.setReferences(false);
        return temp;
    });

    public static byte[] serialize(Object object) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream(4096);
        Output output = new Output(bos, 1024);
        kryoPool.get().writeClassAndObject(output, object);
        output.flush();
        return bos.toByteArray();
    }

    public static Object deserialize(byte[] bytes) {
        Input input = new Input(bytes);
        return kryoPool.get().readClassAndObject(input);
    }

    public static void setClassLoader(ClassLoader classLoader) {
        kryoPool.get().setClassLoader(classLoader);
    }
}
```

定义实体

```java
public class Param {

    public String name;

    public Integer age;

    public Map<String, Object> conf = new HashMap<>(4);

    public Param() {
    }

    public Param(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Param{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

测试的序列化和反序列化方法

```java
public class Test {

    private static void deserialize(String s) {
        System.out.println(Kryo.class.getProtectionDomain().getCodeSource().getLocation().getPath());

        //s = "AQBjb20uamltby5QYXJh7QEBamF2YS51dGlsLkhhc2hNYfABA2517QLIAWppbe8=";

        final Object obj = KryoSerializer.deserialize(Base64.getDecoder().decode(s));
        System.out.println(obj);
    }

    private static String  serialize() {
        System.out.println(Kryo.class.getProtectionDomain().getCodeSource().getLocation().getPath());
        final Param p = new Param("zhangsan",20);
        p.conf.put("num", 100);
        final byte[] bytes = KryoSerializer.serialize(p);
        return Base64.getEncoder().encodeToString(bytes);
    }

    public static void main(String[] args) {

        deserialize( serialize());

    }
}
```

> /D:/.m2/repository/com/esotericsoftware/kryo/4.0.0/kryo-4.0.0.jar
> /D:/.m2/repository/com/esotericsoftware/kryo/4.0.0/kryo-4.0.0.jar
> Param{name='zhangsan', age=20}

### 总结

对于`Kryo`的兼容性问题，建议序列化和反序列化保持同一个版本，跨版本的兼容很难保证，特别是在有 `Map`的情况下。