---
title: SpringBoot 线程池
author: 程序员子龙
index: true
icon: discover
category:
  - SpringBoot

---

### springboot 默认线程池

自动配置类EnableAutoConfiguration 为 key 的所有类：该配置文件在 spring-boot-autoconfigure jar 包中spring.factories文件里。

```
org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration,
```

```java
@ConditionalOnClass(ThreadPoolTaskExecutor.class)
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(TaskExecutionProperties.class)
public class TaskExecutionAutoConfiguration {

   /**
    * Bean name of the application {@link TaskExecutor}.
    */
   public static final String APPLICATION_TASK_EXECUTOR_BEAN_NAME = "applicationTaskExecutor";

   @Bean
   @ConditionalOnMissingBean
   public TaskExecutorBuilder taskExecutorBuilder(TaskExecutionProperties properties,
         ObjectProvider<TaskExecutorCustomizer> taskExecutorCustomizers,
         ObjectProvider<TaskDecorator> taskDecorator) {
      TaskExecutionProperties.Pool pool = properties.getPool();
      TaskExecutorBuilder builder = new TaskExecutorBuilder();
      builder = builder.queueCapacity(pool.getQueueCapacity());
      builder = builder.corePoolSize(pool.getCoreSize());
      builder = builder.maxPoolSize(pool.getMaxSize());
      builder = builder.allowCoreThreadTimeOut(pool.isAllowCoreThreadTimeout());
      builder = builder.keepAlive(pool.getKeepAlive());
      Shutdown shutdown = properties.getShutdown();
      builder = builder.awaitTermination(shutdown.isAwaitTermination());
      builder = builder.awaitTerminationPeriod(shutdown.getAwaitTerminationPeriod());
      builder = builder.threadNamePrefix(properties.getThreadNamePrefix());
      builder = builder.customizers(taskExecutorCustomizers.orderedStream()::iterator);
      builder = builder.taskDecorator(taskDecorator.getIfUnique());
      return builder;
   }

   @Lazy
   @Bean(name = { APPLICATION_TASK_EXECUTOR_BEAN_NAME,
         AsyncAnnotationBeanPostProcessor.DEFAULT_TASK_EXECUTOR_BEAN_NAME })
   @ConditionalOnMissingBean(Executor.class)
   public ThreadPoolTaskExecutor applicationTaskExecutor(TaskExecutorBuilder builder) {
      return builder.build();
   }

}
```

默认的线程池配置在org.springframework.boot.autoconfigure.task.TaskExecutionProperties文件

```java
@ConfigurationProperties("spring.task.execution")
public class TaskExecutionProperties {

   private final Pool pool = new Pool();

   private final Shutdown shutdown = new Shutdown();

   /**
    * Prefix to use for the names of newly created threads.
    */
   private String threadNamePrefix = "task-";

   public Pool getPool() {
      return this.pool;
   }

   public Shutdown getShutdown() {
      return this.shutdown;
   }

   public String getThreadNamePrefix() {
      return this.threadNamePrefix;
   }

   public void setThreadNamePrefix(String threadNamePrefix) {
      this.threadNamePrefix = threadNamePrefix;
   }

   public static class Pool {

      /**
       * Queue capacity. An unbounded capacity does not increase the pool and therefore
       * ignores the "max-size" property.
       */
      private int queueCapacity = Integer.MAX_VALUE;

      /**
       * Core number of threads.
       */
      private int coreSize = 8;

      /**
       * Maximum allowed number of threads. If tasks are filling up the queue, the pool
       * can expand up to that size to accommodate the load. Ignored if the queue is
       * unbounded.
       */
      private int maxSize = Integer.MAX_VALUE;

      /**
       * Whether core threads are allowed to time out. This enables dynamic growing and
       * shrinking of the pool.
       */
      private boolean allowCoreThreadTimeout = true;

      /**
       * Time limit for which threads may remain idle before being terminated.
       */
      private Duration keepAlive = Duration.ofSeconds(60);

      public int getQueueCapacity() {
         return this.queueCapacity;
      }

      public void setQueueCapacity(int queueCapacity) {
         this.queueCapacity = queueCapacity;
      }

      public int getCoreSize() {
         return this.coreSize;
      }

      public void setCoreSize(int coreSize) {
         this.coreSize = coreSize;
      }

      public int getMaxSize() {
         return this.maxSize;
      }

      public void setMaxSize(int maxSize) {
         this.maxSize = maxSize;
      }

      public boolean isAllowCoreThreadTimeout() {
         return this.allowCoreThreadTimeout;
      }

      public void setAllowCoreThreadTimeout(boolean allowCoreThreadTimeout) {
         this.allowCoreThreadTimeout = allowCoreThreadTimeout;
      }

      public Duration getKeepAlive() {
         return this.keepAlive;
      }

      public void setKeepAlive(Duration keepAlive) {
         this.keepAlive = keepAlive;
      }

   }

   public static class Shutdown {

      /**
       * Whether the executor should wait for scheduled tasks to complete on shutdown.
       */
      private boolean awaitTermination;

      /**
       * Maximum time the executor should wait for remaining tasks to complete.
       */
      private Duration awaitTerminationPeriod;

      public boolean isAwaitTermination() {
         return this.awaitTermination;
      }

      public void setAwaitTermination(boolean awaitTermination) {
         this.awaitTermination = awaitTermination;
      }

      public Duration getAwaitTerminationPeriod() {
         return this.awaitTerminationPeriod;
      }

      public void setAwaitTerminationPeriod(Duration awaitTerminationPeriod) {
         this.awaitTerminationPeriod = awaitTerminationPeriod;
      }

   }

}
```

可以在配置文件中指定参数值，例如：

```
spring.task.execution.threadNamePrefix=sportsThread
spring.task.execution.pool.coreSize=20
```

调用示例：

```java
@Autowired
private Executor executorService;

public void test(){
    executorService.execute( () ->{
    // todo 业务代码

    });

}
```

### 使用自定义线程池



```java
@Configuration
public class ThreadPoolConfig {
    @Bean("myExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        //设置线程池参数信息
        taskExecutor.setCorePoolSize(10);
        taskExecutor.setMaxPoolSize(50);
        taskExecutor.setQueueCapacity(200);
        taskExecutor.setKeepAliveSeconds(60);
        taskExecutor.setThreadNamePrefix("myExecutor--");
        taskExecutor.setWaitForTasksToCompleteOnShutdown(true);
        taskExecutor.setAwaitTerminationSeconds(60);
        //修改拒绝策略为使用当前线程执行
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //初始化线程池
        taskExecutor.initialize();
        return taskExecutor;
    }
}
```

调用示例：

```java
@Autowired
private Executor myExecutor;

public void test(){
    myExecutor.execute( () ->{
    // todo 业务代码

    });

```