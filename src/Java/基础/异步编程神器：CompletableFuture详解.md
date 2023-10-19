---
title: 异步编程神器：CompletableFuture详解

index: true
icon: discover
category:
- Java 基础

---
使用`Future`获得异步执行结果时，要么调用阻塞方法`get()`，要么轮询看`isDone()`是否为`true`，这两种方法都不是很好，因为主线程也会被迫等待。

从Java 8开始引入了`CompletableFuture`，它针对`Future`做了改进，可以传入回调对象，当异步任务完成或者发生异常时，自动调用回调对象的回调方法。

CompletableFuture 使用场景：创建异步任务、任务异步回调、多个任务组合处理。

## 创建异步任务

1. supplyAsync
    supplyAsync是创建带有返回值的异步任务。它有两个方法，一个是使用默认线程池（ForkJoinPool.commonPool()）的方法，一个是带有自定义线程池的重载方法。

  没有指定Executor的方法会使用ForkJoinPool.commonPool() 作为它的线程池执行异步代码。如果指定线程池，则使用指定的线程池运行。如果所有 CompletableFuture 共享一个线程池，那么一旦有任务执行一些很慢的 I/O 操作，就会导致线程池中所有线程都阻塞在 I/O 操作上，从而造成线程饥饿，进而影响整个系统的性能。所以，**强烈建议要根据不同的业务类型创建不同的线程池，以避免互相干扰**

```java
// 带返回值异步请求，默认线程池ForkJoinPool.commonPool
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)

// 带返回值的异步请求，可以自定义线程池
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

使用默认线程池：

```java
  CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
            System.out.println("业务代码");
            return "result";
        });
 
        //等待任务执行完成
        System.out.println("结果->" + cf.get());

```

使用自定义线程池：

```java
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(10,10,10,TimeUnit.SECONDS, new ArrayBlockingQueue<>(100));
        long startTime = System.currentTimeMillis();
        List<User> userList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            CompletableFuture<User> completableUserInfoFuture = CompletableFuture.supplyAsync(() -> userService.getUser(1), threadPoolExecutor);

            try {
                User user = completableUserInfoFuture.get();
                userList.add(user);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }

        System.out.println("总共用时" + (System.currentTimeMillis() - startTime) + "ms");

```

2、runAsync 方法以Runnable函数式接口类型为参数，没有返回结果。支持默认线程池和自定义线程池。

```java
//使用默认内置线程池ForkJoinPool.commonPool()，根据supplier构建执行任务
public static CompletableFuture<Void> runAsync(Runnable runnable)
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)

```

```java
     ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(10,10,10,TimeUnit.SECONDS, new ArrayBlockingQueue<>(100));
        
     CompletableFuture.runAsync(() -> userService.getUser(1), threadPoolExecutor);

```

## **获取结果**

**join&get**

join()和get()方法都是用来获取CompletableFuture异步之后的返回值。join()方法抛出的是uncheck异常（即未经检查的异常),不会强制开发者抛出。get()方法抛出的是经过检查的异常，ExecutionException, InterruptedException 需要用户手动处理（抛出或者 try catch）

## **结果处理**

![](http://img.xxfxpt.top/202307171043423.png)

**依赖关系：**

1. thenApply() 把前面异步任务的结果，交给后面的Function
2. thenCompose()用来连接两个有依赖关系的任务，结果由第二个任务返回

**and聚合关系：**

1. thenCombine:任务合并，有返回值
2. thenAccepetBoth:两个任务执行完成后，将结果交给thenAccepetBoth消耗，无返回值。
3. runAfterBoth:两个任务都执行完成后，执行下一步操作（Runnable）。

**or聚合关系：**

1. applyToEither:两个任务谁执行的快，就使用那一个结果，有返回值。
2. acceptEither: 两个任务谁执行的快，就消耗那一个结果，无返回值。
3. runAfterEither: 任意一个任务执行完成，进行下一步操作(Runnable)。

**并行执行：**

CompletableFuture类自己也提供了anyOf()和allOf()用于支持多个CompletableFuture并行执行

### whenComplete

当CompletableFuture的计算结果完成，或者抛出异常的时候，我们可以执行特定的 Action。主要是下面的方法：

```java
public CompletableFuture<T> whenComplete(BiConsumer<? super T,? super Throwable> action)  
  
public CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T,? super Throwable> action)
  
public CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T,? super Throwable> action, Executor executor)
```

- 方法不以Async结尾，意味着Action使用相同的线程执行，而Async可能会使用其它的线程去执行(如果使用相同的线程池，也可能会被同一个线程选中执行)。
- CompletableFuture的whenComplete方法表示，某个任务执行完成后，执行的回调方法，**无返回值**；并且whenComplete方法返回的CompletableFuture的**result是上个任务的结果**。

```java
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
                ()->{
                    System.out.println("当前线程名称：" + Thread.currentThread().getName());
                    try {
                        Thread.sleep(2000L);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    return "hello";
                }
        );

        CompletableFuture<String> rstFuture = orgFuture.whenComplete((a, throwable) -> {
            System.out.println("当前线程名称：" + Thread.currentThread().getName());
            System.out.println("上个任务执行完" + a + "传过来");
            if ("hello".equals(a)) {
                System.out.println("666");
            }
            System.out.println("1111");
        });

        System.out.println(rstFuture.get());

//当前线程名称：ForkJoinPool.commonPool-worker-1
//当前线程名称：ForkJoinPool.commonPool-worker-1
//上个任务执行完hello传过来
//666
//1111
//hello 
```

### exceptionally

某个任务执行异常时，执行的回调方法;并且有**抛出异常作为参数**，传递到回调方法。

```java
   CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
            }

            int i = 12 / 0;

            System.out.println("执行结束！");
            return "test";
        });

        future.exceptionally(new Function<Throwable, String>() {
            @Override
            public String apply(Throwable t) {
                System.out.println("执行失败：" + t.getMessage());
                return "异常xxxx";
            }
        });
```



## **结果消费**

结果消费系列函数只对结果执行Action，而不返回新的计算值。

根据对结果的处理方式，结果消费函数分为：

- thenAccept系列：对单个结果进行消费
- thenAcceptBoth系列：对两个结果进行消费
- thenRun系列：不关心结果，只对结果执行Action

### **thenAccept**

```java
public CompletionStage<Void> thenAccept(Consumer<? super T> action);
public CompletionStage<Void> thenAcceptAsync(Consumer<? super T> action);
```

CompletableFuture的thenAccept方法表示，第一个任务执行完成后，执行第二个回调方法任务，会将该任务的执行结果，作为入参，传递到回调方法中，但是回调方法是**没有返回值**的。

```java
        CompletableFuture<Void> future = CompletableFuture
                .supplyAsync(() -> {
                    int number = new Random().nextInt(10);
                    System.out.println("返回值：" + number);
                    return number;
                }).thenAccept(number ->
                        System.out.println("第二次计算结果：" + number * 10));
```

**thenAccept和thenAcceptAsync有什么区别呢**？可以看下源码：

```java
    public CompletableFuture<Void> thenAccept(Consumer<? super T> action) {
        return uniAcceptStage(null, action);
    }

    public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action) {
        return uniAcceptStage(asyncPool, action);
    }
```

如果执行第一个任务的时候，传入了一个自定义线程池：

- 调用thenAccept方法执行第二个任务时，则第二个任务和第一个任务是**共用同一个线程池**。
- 调用thenAcceptAsync执行第二个任务时，则第一个任务使用的是你自己传入的线程池，**第二个任务使用的是ForkJoin线程池**

thenRun 和thenRunAsync，thenApply和thenApplyAsync等，它们之间也是这个区别。

### **thenRun**

```java
public CompletionStage<Void> thenRun(Runnable action);
public CompletionStage<Void> thenRunAsync(Runnable action);
```

thenRun 会在上一阶段 CompletableFuture 计算完成的时候执行一个Runnable，Runnable并不使用该 CompletableFuture 计算的结果。CompletableFuture的thenRun方法，通俗点讲就是，**做完第一个任务后，再做第二个任务**。某个任务执行完成后，执行回调方法；但是前后两个任务**没有参数传递，第二个任务也没有返回值**。

```java
        CompletableFuture<String> future = CompletableFuture.supplyAsync(
                () -> {
                    System.out.println("先执行第一个CompletableFuture方法任务");
                    return "hello";
                }
        );

        CompletableFuture thenRunFuture = future.thenRun(() -> {
            System.out.println("执行第二个任务");
        });

        System.out.println(thenRunFuture.get());
```

## **结果转换**

将上一段任务的执行结果作为下一阶段任务的入参参与重新计算，产生新的结果。

### **thenApply**

thenApply 接收一个函数作为参数，使用该函数处理上一个CompletableFuture 调用的结果，并返回一个具有处理结果的Future对象。第一个任务执行完成后，执行第二个回调方法任务，会将该任务的执行结果，作为入参，传递到回调方法中，并且回调方法是有返回值的。

```java
public <U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn) 
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn)     
```

​         

```java
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            int result = 10;
            System.out.println("一阶段：" + result);
            return result;
        }).thenApply(number -> {
            int result = number * 3;
            System.out.println("二阶段：" + result);
            return result;
        });

        System.out.println(future.get());
```

> 一阶段：10
> 二阶段：30
> 30

### **thenCompose**

thenCompose方法会在某个任务执行完成后，将该任务的执行结果,作为方法入参,去执行指定的方法。该方法会返回一个新的CompletableFuture实例

- 如果该CompletableFuture实例的result不为null，则返回一个基于该result新的CompletableFuture实例；
- 如果该CompletableFuture实例为null，然后就执行这个新任务

```java
     CompletableFuture<Integer> future = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(30);
                        System.out.println("第一次计算结果：" + number);
                        return number;
                    }
                })
                .thenCompose(new Function<Integer, CompletionStage<Integer>>() {
                    @Override
                    public CompletionStage<Integer> apply(Integer param) {
                        return CompletableFuture.supplyAsync(new Supplier<Integer>() {
                            @Override
                            public Integer get() {
                                int number = param * 2;
                                System.out.println("第二次计算结果：" + number);
                                return number;
                            }
                        });
                    }
                });
```

> 第一次计算结果：6
> 第二次计算结果：12

**thenApply 和 thenCompose的区别**

- thenApply 转换的是泛型中的类型，返回的是同一个CompletableFuture；
- thenCompose 将内部的 CompletableFuture 调用展开来并使用上一个CompletableFutre 调用的结果在下一步的 CompletableFuture 调用中进行运算，是生成一个新的CompletableFuture。

## **结果组合**

### and 组合的关系

thenCombine / thenAcceptBoth / runAfterBoth都表示：**将两个CompletableFuture组合起来，只有这两个都正常执行完了，才会执行某个任务**。

区别在于：

- thenCombine：会将两个任务的执行结果作为方法入参，传递到指定方法中，且**有返回值**
- thenAcceptBoth: 会将两个任务的执行结果作为方法入参，传递到指定方法中，且**无返回值**
- runAfterBoth 不会把执行结果当做方法入参，且没有返回值。

#### **thenCombine**

thenCombine 方法，会将两个任务的执行结果作为方法入参，传递到指定方法中，且**有返回值**

```java
public <U,V> CompletionStage<V> thenCombine(CompletionStage<? extends U> other,BiFunction<? super T,? super U,? extends V> fn);

public <U,V> CompletionStage<V> thenCombineAsync(CompletionStage<? extends U> other,BiFunction<? super T,? super U,? extends V> fn);
```

```java
  CompletableFuture<Integer> future1 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第一阶段：" + number);
                        return number;
                    }
                });
        CompletableFuture<Integer> future2 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第二阶段：" + number);
                        return number;
                    }
                });
        CompletableFuture<Integer> result = future1
                .thenCombine(future2, new BiFunction<Integer, Integer, Integer>() {
                    @Override
                    public Integer apply(Integer x, Integer y) {
                        return x + y;
                    }
                });
        System.out.println(result.get());


第一阶段：8
第二阶段：4
12
```

#### thenAcceptBoth

会将两个任务的执行结果作为方法入参，传递到指定方法中，且**无返回值**，也就是当两个 CompletionStage 都正常完成计算的时候，就会执行提供的action消费两个异步的结果。

```java
public <U> CompletionStage<Void> thenAcceptBoth(CompletionStage<? extends U> other,BiConsumer<? super T, ? super U> action);

public <U> CompletionStage<Void> thenAcceptBothAsync(CompletionStage<? extends U> other,BiConsumer<? super T, ? super U> action);
```

```java
  CompletableFuture<Integer> futrue1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                int number = new Random().nextInt(5) + 1;
                try {
                    TimeUnit.SECONDS.sleep(number);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("第一阶段：" + number);
                return number;
            }
        });

        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                int number = new Random().nextInt(5) + 1;
                try {
                    TimeUnit.SECONDS.sleep(number);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("第二阶段：" + number);
                return number;
            }
        });

        CompletableFuture<Void> completableFuture = futrue1.thenAcceptBothAsync(future2, new BiConsumer<Integer, Integer>() {
            @Override
            public void accept(Integer x, Integer y) {
                System.out.println("最终结果：" + (x + y));
            }
        });
        System.out.println(completableFuture.get());
```

> 第二阶段：4
> 第一阶段：4
> 最终结果：8
> null

#### **runAfterBoth**

两个线程任务相比较，两个全部执行完成，才进行下一步操作，不关心运行结果。

```java
public CompletionStage<Void> runAfterBoth(CompletionStage<?> other,Runnable action); 
public CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other,Runnable action);   
```

```java
        CompletableFuture<Integer> future1 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第一次start：" + number);
                        try {
                            TimeUnit.SECONDS.sleep(number);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println("第一次end：" + number);
                        return number;
                    }
                });
        CompletableFuture<Integer> future2 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第二次start：" + number);
                        try {
                            TimeUnit.SECONDS.sleep(number);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println("第二次end：" + number);
                        return number;
                    }
                });

        future1.runAfterBoth(future2, () -> System.out.println("两个任务都执行完成了。")).get();

```

### OR 组合的关系

applyToEither / acceptEither / runAfterEither 表示：将两个CompletableFuture组合起来，只要其中一个执行完了,就会执行某个任务。

区别在于：

- applyToEither：会将已经执行完成的任务，作为方法入参，传递到指定方法中，且有返回值
- acceptEither: 会将已经执行完成的任务，作为方法入参，传递到指定方法中，且无返回值
- runAfterEither： 不会把执行结果当做方法入参，且没有返回值。

#### **applyToEither**

两个线程任务相比较，先获得执行结果的，就对该结果进行下一步的转化操作。

```java
public <U> CompletionStage<U> applyToEither(CompletionStage<? extends T> other,Function<? super T, U> fn); 

public <U> CompletionStage<U> applyToEitherAsync(CompletionStage<? extends T> other,Function<? super T, U> fn);        
```

​      

```java
   CompletableFuture<Integer> future1 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第一阶段start：" + number);
                        try {
                            TimeUnit.SECONDS.sleep(number);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println("第一阶段end：" + number);
                        return number;
                    }
                });
        CompletableFuture<Integer> future2 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第二阶段start：" + number);
                        try {
                            TimeUnit.SECONDS.sleep(number);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println("第二阶段end：" + number);
                        return number;
                    }
                });

        future1.applyToEither(future2, new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer number) {
                System.out.println("最快结果：" + number);
                return number * 2;
            }
        }).get();
```

#### **acceptEither**

两个线程任务相比较，先获得执行结果的，就对该结果进行下一步的消费操作。

```java
public CompletionStage<Void> acceptEither(CompletionStage<? extends T> other,Consumer<? super T> action); 

public CompletionStage<Void> acceptEitherAsync(CompletionStage<? extends T> other,Consumer<? super T> action);             
```

```java
      CompletableFuture<Integer> future1 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第一阶段start：" + number);
                        try {
                            TimeUnit.SECONDS.sleep(number);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println("第一阶段end：" + number);
                        return number;
                    }
                });
        CompletableFuture<Integer> future2 = CompletableFuture
                .supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int number = new Random().nextInt(10);
                        System.out.println("第二阶段start：" + number);
                        try {
                            TimeUnit.SECONDS.sleep(number);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println("第二阶段end：" + number);
                        return number;
                    }
                });

        future1.acceptEither(future2, new Consumer<Integer>() {
            @Override
            public void accept(Integer number) {
                System.out.println("最快结果：" + number);
            }
        }).get();
```

### AllOf

所有任务都执行完成后，才执行 allOf返回的CompletableFuture。如果任意一个任务异常，allOf的CompletableFuture，执行get方法，会抛出异常

```java
  CompletableFuture<String> future1 = CompletableFuture
                .supplyAsync(() -> {
                    try {
                        TimeUnit.SECONDS.sleep(2);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("future1完成！");
                    return "future1完成！";
                });

        CompletableFuture<String> future2 = CompletableFuture
                .supplyAsync(() -> {
                    System.out.println("future2完成！");
                    return "future2完成！";
                });

       CompletableFuture.allOf(future1, future2).whenComplete((m,k)->{
           System.out.println("finish");
       }).get();
```

> future2完成！
> future1完成！
> finish

### AnyOf

任意一个任务执行完，就执行anyOf返回的CompletableFuture。如果执行的任务异常，anyOf的CompletableFuture，执行get方法，会抛出异常

```java
CompletableFuture<Void> a = CompletableFuture.runAsync(()->{
    try {
        Thread.sleep(3000L);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    System.out.println("我执行完了");
});
CompletableFuture<Void> b = CompletableFuture.runAsync(() -> {
    System.out.println("我也执行完了");
});
CompletableFuture<Object> anyOfFuture = CompletableFuture.anyOf(a, b).whenComplete((m,k)->{
    System.out.println("finish");

});
anyOfFuture.join();
```

**CompletableFuture常用方法总结**

​    ![](https://note.youdao.com/yws/public/resource/0e961b20b4e7a0b21fab4ed9f88c1ac5/xmlnote/7E8D1FF0BFEE460E8B06E0E16977D0F8/1936)

## CompletableFuture使用注意点

### CompletableFuture的get()方法是阻塞的。

1、CompletableFuture的get()方法是阻塞的，如果使用它来获取异步调用的返回值，需要添加超时时间

```java
CompletableFuture.get(5, TimeUnit.SECONDS);
```

2、默认线程池的注意点

默认情况下 CompletableFuture 会使用公共的 ForkJoinPool 线程池，处理的线程个数是电脑CPU核数-1。在**大量请求过来的时候，处理逻辑复杂的话，响应会很慢**。一般建议使用自定义线程池，优化线程池配置参数。



3、自定义线程池时，注意饱和策略

CompletableFuture的get()方法是阻塞的，我们一般建议使用`future.get(3, TimeUnit.SECONDS)`。并且一般建议使用自定义线程池。

但是如果线程池拒绝策略是`DiscardPolicy`或者`DiscardOldestPolicy`，当线程池饱和时，会直接丢弃任务，不会抛弃异常。因此建议，CompletableFuture线程池策略**最好使用AbortPolicy**，然后耗时的异步线程，做好**线程池隔离**哈。



