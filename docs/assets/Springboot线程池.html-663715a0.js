import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},p=e(`<h3 id="springboot-默认线程池" tabindex="-1"><a class="header-anchor" href="#springboot-默认线程池" aria-hidden="true">#</a> springboot 默认线程池</h3><p>自动配置类EnableAutoConfiguration 为 key 的所有类：该配置文件在 spring-boot-autoconfigure jar 包中spring.factories文件里。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration,
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@ConditionalOnClass</span><span class="token punctuation">(</span><span class="token class-name">ThreadPoolTaskExecutor</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Configuration</span><span class="token punctuation">(</span>proxyBeanMethods <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@EnableConfigurationProperties</span><span class="token punctuation">(</span><span class="token class-name">TaskExecutionProperties</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TaskExecutionAutoConfiguration</span> <span class="token punctuation">{</span>

   <span class="token doc-comment comment">/**
    * Bean name of the application <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">TaskExecutor</span></span><span class="token punctuation">}</span>.
    */</span>
   <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">APPLICATION_TASK_EXECUTOR_BEAN_NAME</span> <span class="token operator">=</span> <span class="token string">&quot;applicationTaskExecutor&quot;</span><span class="token punctuation">;</span>

   <span class="token annotation punctuation">@Bean</span>
   <span class="token annotation punctuation">@ConditionalOnMissingBean</span>
   <span class="token keyword">public</span> <span class="token class-name">TaskExecutorBuilder</span> <span class="token function">taskExecutorBuilder</span><span class="token punctuation">(</span><span class="token class-name">TaskExecutionProperties</span> properties<span class="token punctuation">,</span>
         <span class="token class-name">ObjectProvider</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">TaskExecutorCustomizer</span><span class="token punctuation">&gt;</span></span> taskExecutorCustomizers<span class="token punctuation">,</span>
         <span class="token class-name">ObjectProvider</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">TaskDecorator</span><span class="token punctuation">&gt;</span></span> taskDecorator<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token class-name">TaskExecutionProperties<span class="token punctuation">.</span>Pool</span> pool <span class="token operator">=</span> properties<span class="token punctuation">.</span><span class="token function">getPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token class-name">TaskExecutorBuilder</span> builder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TaskExecutorBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">queueCapacity</span><span class="token punctuation">(</span>pool<span class="token punctuation">.</span><span class="token function">getQueueCapacity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">corePoolSize</span><span class="token punctuation">(</span>pool<span class="token punctuation">.</span><span class="token function">getCoreSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">maxPoolSize</span><span class="token punctuation">(</span>pool<span class="token punctuation">.</span><span class="token function">getMaxSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">allowCoreThreadTimeOut</span><span class="token punctuation">(</span>pool<span class="token punctuation">.</span><span class="token function">isAllowCoreThreadTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">keepAlive</span><span class="token punctuation">(</span>pool<span class="token punctuation">.</span><span class="token function">getKeepAlive</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token class-name">Shutdown</span> shutdown <span class="token operator">=</span> properties<span class="token punctuation">.</span><span class="token function">getShutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">awaitTermination</span><span class="token punctuation">(</span>shutdown<span class="token punctuation">.</span><span class="token function">isAwaitTermination</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">awaitTerminationPeriod</span><span class="token punctuation">(</span>shutdown<span class="token punctuation">.</span><span class="token function">getAwaitTerminationPeriod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">threadNamePrefix</span><span class="token punctuation">(</span>properties<span class="token punctuation">.</span><span class="token function">getThreadNamePrefix</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">customizers</span><span class="token punctuation">(</span>taskExecutorCustomizers<span class="token punctuation">.</span><span class="token function">orderedStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">::</span><span class="token function">iterator</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      builder <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">taskDecorator</span><span class="token punctuation">(</span>taskDecorator<span class="token punctuation">.</span><span class="token function">getIfUnique</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> builder<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>

   <span class="token annotation punctuation">@Lazy</span>
   <span class="token annotation punctuation">@Bean</span><span class="token punctuation">(</span>name <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token constant">APPLICATION_TASK_EXECUTOR_BEAN_NAME</span><span class="token punctuation">,</span>
         <span class="token class-name">AsyncAnnotationBeanPostProcessor</span><span class="token punctuation">.</span><span class="token constant">DEFAULT_TASK_EXECUTOR_BEAN_NAME</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
   <span class="token annotation punctuation">@ConditionalOnMissingBean</span><span class="token punctuation">(</span><span class="token class-name">Executor</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
   <span class="token keyword">public</span> <span class="token class-name">ThreadPoolTaskExecutor</span> <span class="token function">applicationTaskExecutor</span><span class="token punctuation">(</span><span class="token class-name">TaskExecutorBuilder</span> builder<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> builder<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认的线程池配置在org.springframework.boot.autoconfigure.task.TaskExecutionProperties文件</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@ConfigurationProperties</span><span class="token punctuation">(</span><span class="token string">&quot;spring.task.execution&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TaskExecutionProperties</span> <span class="token punctuation">{</span>

   <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Pool</span> pool <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Pool</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

   <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Shutdown</span> shutdown <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

   <span class="token doc-comment comment">/**
    * Prefix to use for the names of newly created threads.
    */</span>
   <span class="token keyword">private</span> <span class="token class-name">String</span> threadNamePrefix <span class="token operator">=</span> <span class="token string">&quot;task-&quot;</span><span class="token punctuation">;</span>

   <span class="token keyword">public</span> <span class="token class-name">Pool</span> <span class="token function">getPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>pool<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>

   <span class="token keyword">public</span> <span class="token class-name">Shutdown</span> <span class="token function">getShutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>shutdown<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>

   <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getThreadNamePrefix</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>threadNamePrefix<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>

   <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setThreadNamePrefix</span><span class="token punctuation">(</span><span class="token class-name">String</span> threadNamePrefix<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>threadNamePrefix <span class="token operator">=</span> threadNamePrefix<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>

   <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Pool</span> <span class="token punctuation">{</span>

      <span class="token doc-comment comment">/**
       * Queue capacity. An unbounded capacity does not increase the pool and therefore
       * ignores the &quot;max-size&quot; property.
       */</span>
      <span class="token keyword">private</span> <span class="token keyword">int</span> queueCapacity <span class="token operator">=</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">;</span>

      <span class="token doc-comment comment">/**
       * Core number of threads.
       */</span>
      <span class="token keyword">private</span> <span class="token keyword">int</span> coreSize <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span>

      <span class="token doc-comment comment">/**
       * Maximum allowed number of threads. If tasks are filling up the queue, the pool
       * can expand up to that size to accommodate the load. Ignored if the queue is
       * unbounded.
       */</span>
      <span class="token keyword">private</span> <span class="token keyword">int</span> maxSize <span class="token operator">=</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">;</span>

      <span class="token doc-comment comment">/**
       * Whether core threads are allowed to time out. This enables dynamic growing and
       * shrinking of the pool.
       */</span>
      <span class="token keyword">private</span> <span class="token keyword">boolean</span> allowCoreThreadTimeout <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

      <span class="token doc-comment comment">/**
       * Time limit for which threads may remain idle before being terminated.
       */</span>
      <span class="token keyword">private</span> <span class="token class-name">Duration</span> keepAlive <span class="token operator">=</span> <span class="token class-name">Duration</span><span class="token punctuation">.</span><span class="token function">ofSeconds</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">getQueueCapacity</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>queueCapacity<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setQueueCapacity</span><span class="token punctuation">(</span><span class="token keyword">int</span> queueCapacity<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>queueCapacity <span class="token operator">=</span> queueCapacity<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">getCoreSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>coreSize<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setCoreSize</span><span class="token punctuation">(</span><span class="token keyword">int</span> coreSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>coreSize <span class="token operator">=</span> coreSize<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">getMaxSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>maxSize<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setMaxSize</span><span class="token punctuation">(</span><span class="token keyword">int</span> maxSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>maxSize <span class="token operator">=</span> maxSize<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isAllowCoreThreadTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>allowCoreThreadTimeout<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setAllowCoreThreadTimeout</span><span class="token punctuation">(</span><span class="token keyword">boolean</span> allowCoreThreadTimeout<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>allowCoreThreadTimeout <span class="token operator">=</span> allowCoreThreadTimeout<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token class-name">Duration</span> <span class="token function">getKeepAlive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>keepAlive<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setKeepAlive</span><span class="token punctuation">(</span><span class="token class-name">Duration</span> keepAlive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>keepAlive <span class="token operator">=</span> keepAlive<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

   <span class="token punctuation">}</span>

   <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Shutdown</span> <span class="token punctuation">{</span>

      <span class="token doc-comment comment">/**
       * Whether the executor should wait for scheduled tasks to complete on shutdown.
       */</span>
      <span class="token keyword">private</span> <span class="token keyword">boolean</span> awaitTermination<span class="token punctuation">;</span>

      <span class="token doc-comment comment">/**
       * Maximum time the executor should wait for remaining tasks to complete.
       */</span>
      <span class="token keyword">private</span> <span class="token class-name">Duration</span> awaitTerminationPeriod<span class="token punctuation">;</span>

      <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isAwaitTermination</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>awaitTermination<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setAwaitTermination</span><span class="token punctuation">(</span><span class="token keyword">boolean</span> awaitTermination<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>awaitTermination <span class="token operator">=</span> awaitTermination<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token class-name">Duration</span> <span class="token function">getAwaitTerminationPeriod</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>awaitTerminationPeriod<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setAwaitTerminationPeriod</span><span class="token punctuation">(</span><span class="token class-name">Duration</span> awaitTerminationPeriod<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">this</span><span class="token punctuation">.</span>awaitTerminationPeriod <span class="token operator">=</span> awaitTerminationPeriod<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

   <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以在配置文件中指定参数值，例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spring.task.execution.threadNamePrefix=sportsThread
spring.task.execution.pool.coreSize=20
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>调用示例：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">Executor</span> executorService<span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    executorService<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span><span class="token punctuation">{</span>
    <span class="token comment">// todo 业务代码</span>

    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用自定义线程池" tabindex="-1"><a class="header-anchor" href="#使用自定义线程池" aria-hidden="true">#</a> 使用自定义线程池</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ThreadPoolConfig</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Bean</span><span class="token punctuation">(</span><span class="token string">&quot;myExecutor&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">Executor</span> <span class="token function">taskExecutor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ThreadPoolTaskExecutor</span> taskExecutor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadPoolTaskExecutor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//设置线程池参数信息</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setCorePoolSize</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setMaxPoolSize</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setQueueCapacity</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setKeepAliveSeconds</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setThreadNamePrefix</span><span class="token punctuation">(</span><span class="token string">&quot;myExecutor--&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setWaitForTasksToCompleteOnShutdown</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setAwaitTerminationSeconds</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//修改拒绝策略为使用当前线程执行</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">setRejectedExecutionHandler</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor<span class="token punctuation">.</span>CallerRunsPolicy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//初始化线程池</span>
        taskExecutor<span class="token punctuation">.</span><span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> taskExecutor<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用示例：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">Executor</span> myExecutor<span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    myExecutor<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span><span class="token punctuation">{</span>
    <span class="token comment">// todo 业务代码</span>

    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),o=[p];function c(i,l){return s(),a("div",null,o)}const k=n(t,[["render",c],["__file","Springboot线程池.html.vue"]]);export{k as default};
