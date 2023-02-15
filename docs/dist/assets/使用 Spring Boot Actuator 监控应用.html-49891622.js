import{_ as n,W as s,X as a,a1 as t}from"./framework-2afc6763.js";const e={},o=t(`<p>在微服务中，大部分功能模块都是运行在不同的机器上，出现了异常如何快速定位是哪个环节出现了问题？</p><p>所以应用的监控很重要！</p><p>本文主要结合 Spring Boot Actuator，跟大家一起分享微服务 Spring Boot Actuator 的常见用法，方便我们在日常中对我们的微服务进行监控治理。</p><h3 id="actuator介绍" tabindex="-1"><a class="header-anchor" href="#actuator介绍" aria-hidden="true">#</a> Actuator介绍</h3><p>Actuator 是 Spring Boot 提供的对应用系统的自省和监控的集成功能，借助Actuator 开发者可以很方便的对应用系统某些指标进行监控统计。</p><p>Actuator 的核心是端点 Endpoint，它用来监视应用程序及交互，spring-boot-actuator 中已经内置了非常多的 Endpoint（health、info、beans、metrics、httptrace、shutdown等等），同时也允许我们自己扩展自己的 Endpoints。每个 Endpoint 都可以启用和禁用。要远程访问 Endpoint，还必须通过 JMX 或 HTTP 进行暴露，大部分应用选择HTTP。</p><p>本文基于spring boot 2.X介绍。</p><h3 id="常用接口" tabindex="-1"><a class="header-anchor" href="#常用接口" aria-hidden="true">#</a> 常用接口</h3><p>/<strong>actuator</strong></p><p>展示所有端点</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
	<span class="token property">&quot;_links&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
		<span class="token property">&quot;self&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;nacosconfig&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/nacosconfig&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;nacosdiscovery&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/nacosdiscovery&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;sentinel&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/sentinel&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;beans&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/beans&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;caches&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/caches&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;caches-cache&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/caches/{cache}&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;health&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/health&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;health-path&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/health/{*path}&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;info&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/info&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;conditions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/conditions&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;configprops-prefix&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/configprops/{prefix}&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;configprops&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/configprops&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;env&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/env&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;env-toMatch&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/env/{toMatch}&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;loggers-name&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/loggers/{name}&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;loggers&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/loggers&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;heapdump&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/heapdump&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;threaddump&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/threaddump&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;metrics&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/metrics&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;metrics-requiredMetricName&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/metrics/{requiredMetricName}&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;scheduledtasks&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/scheduledtasks&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;mappings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/mappings&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;refresh&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/refresh&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;features&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/features&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token property">&quot;serviceregistry&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
			<span class="token property">&quot;href&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:8080/actuator/serviceregistry&quot;</span><span class="token punctuation">,</span>
			<span class="token property">&quot;templated&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>actuator/health</strong></p><p>health 主要用来检查应用的运行状态，这是我们使用最高频的一个监控点。通常使用此接口提醒我们应用实例的运行状态，以及应用不”健康“的原因，比如数据库连接、磁盘空间不够等。</p><p>默认情况下 health 的状态是开放的，添加依赖后启动项目，访问：<code>http://localhost:8080/actuator/health</code>即可看到应用的状态。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>	
    <span class="token string-property property">&quot;status&quot;</span> <span class="token operator">:</span> <span class="token string">&quot;UP&quot;</span>	
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，最终的 Spring Boot 应用的状态是由 HealthAggregator 汇总而成的，汇总的算法是：</p><ul><li>1 设置状态码顺序： <code>setStatusOrder(Status.DOWN, Status.OUT_OF_SERVICE, Status.UP, Status.UNKNOWN);</code>。</li><li>2 过滤掉不能识别的状态码。</li><li>3 如果无任何状态码，整个 Spring Boot 应用的状态是 UNKNOWN。</li><li>4 将所有收集到的状态码按照 1 中的顺序排序。</li><li>5 返回有序状态码序列中的第一个状态码，作为整个 Spring Boot 应用的状态。</li></ul><p>health 通过合并几个健康指数检查应用的健康情况。Spring Boot Actuator 有几个预定义的健康指标比如<code>DataSourceHealthIndicator</code>, <code>DiskSpaceHealthIndicator</code>, <code>MongoHealthIndicator</code>, <code>RedisHealthIndicator</code>等，它使用这些健康指标作为健康检查的一部分。</p><p>举个例子，如果你的应用使用 Redis，<code>RedisHealthindicator</code> 将被当作检查的一部分；如果使用 MongoDB，那么<code>MongoHealthIndicator</code> 将被当作检查的一部分。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>management:
  endpoint:
    health:
      enabled: true
      show-details: always
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>actuator/info</strong></p><p>info 就是我们自己配置在配置文件中以 info 开头的配置信息，比如我们在示例项目中的配置是：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>info<span class="token punctuation">.</span>app<span class="token punctuation">.</span>name<span class="token operator">=</span>spring<span class="token operator">-</span>boot<span class="token operator">-</span>actuator	

info<span class="token punctuation">.</span>app<span class="token punctuation">.</span>version<span class="token operator">=</span> <span class="token number">1.0</span><span class="token number">.0</span>	

info<span class="token punctuation">.</span>app<span class="token punctuation">.</span>test<span class="token operator">=</span> test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动示例项目，访问：<code>http://localhost:8080/actuator/info</code>返回部分信息如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>	

  <span class="token string-property property">&quot;app&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	

    <span class="token string-property property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;spring-boot-actuator&quot;</span><span class="token punctuation">,</span>	

    <span class="token string-property property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1.0.0&quot;</span><span class="token punctuation">,</span>	

    <span class="token string-property property">&quot;test&quot;</span><span class="token operator">:</span><span class="token string">&quot;test&quot;</span>	
  <span class="token punctuation">}</span>	

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>actuator/beans</strong></p><p>展示了 bean 的别名、类型、是否单例、类的地址、依赖等信息。</p><p>访问：<code>http://localhost:8080/actuator/beans</code>返回部分信息如下：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">[</span>	
  <span class="token punctuation">{</span>	
    <span class="token property">&quot;context&quot;</span><span class="token operator">:</span> <span class="token string">&quot;application:8080:management&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;parent&quot;</span><span class="token operator">:</span> <span class="token string">&quot;application:8080&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;beans&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
      <span class="token punctuation">{</span>	
        <span class="token property">&quot;bean&quot;</span><span class="token operator">:</span> <span class="token string">&quot;embeddedServletContainerFactory&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;aliases&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
 
	
        <span class="token punctuation">]</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;scope&quot;</span><span class="token operator">:</span> <span class="token string">&quot;singleton&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;resource&quot;</span><span class="token operator">:</span> <span class="token string">&quot;null&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;dependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
 
	
        <span class="token punctuation">]</span>	
      <span class="token punctuation">}</span><span class="token punctuation">,</span>	
      <span class="token punctuation">{</span>	
        <span class="token property">&quot;bean&quot;</span><span class="token operator">:</span> <span class="token string">&quot;endpointWebMvcChildContextConfiguration&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;aliases&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
 
	
        <span class="token punctuation">]</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;scope&quot;</span><span class="token operator">:</span> <span class="token string">&quot;singleton&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;org.springframework.boot.actuate.autoconfigure.EndpointWebMvcChildContextConfiguration$$EnhancerBySpringCGLIB$$a4a10f9d&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;resource&quot;</span><span class="token operator">:</span> <span class="token string">&quot;null&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;dependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
 
	
        <span class="token punctuation">]</span>	
      <span class="token punctuation">}</span>	
  <span class="token punctuation">}</span>	
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>actuator/conditions</strong></p><p>Spring Boot 的自动配置功能非常便利，但有时候也意味着出问题比较难找出具体的原因。使用 conditions 可以在应用运行时查看代码了某个配置在什么条件下生效，或者某个自动配置为什么没有生效。</p><p>启动示例项目，访问：<code>http://localhost:8080/actuator/conditions</code>返回部分信息如下：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>	
    <span class="token property">&quot;positiveMatches&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
     <span class="token property">&quot;DevToolsDataSourceAutoConfiguration&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
            <span class="token property">&quot;notMatched&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
                <span class="token punctuation">{</span>	
                    <span class="token property">&quot;condition&quot;</span><span class="token operator">:</span> <span class="token string">&quot;DevToolsDataSourceAutoConfiguration.DevToolsDataSourceCondition&quot;</span><span class="token punctuation">,</span>	
                    <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;DevTools DataSource Condition did not find a single DataSource bean&quot;</span>	
                <span class="token punctuation">}</span>	
            <span class="token punctuation">]</span><span class="token punctuation">,</span>	
            <span class="token property">&quot;matched&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token punctuation">]</span>	
        <span class="token punctuation">}</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;RemoteDevToolsAutoConfiguration&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
            <span class="token property">&quot;notMatched&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
                <span class="token punctuation">{</span>	
                    <span class="token property">&quot;condition&quot;</span><span class="token operator">:</span> <span class="token string">&quot;OnPropertyCondition&quot;</span><span class="token punctuation">,</span>	
                    <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;@ConditionalOnProperty (spring.devtools.remote.secret) did not find property &#39;secret&#39;&quot;</span>	
                <span class="token punctuation">}</span>	
            <span class="token punctuation">]</span><span class="token punctuation">,</span>	
            <span class="token property">&quot;matched&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
                <span class="token punctuation">{</span>	
                    <span class="token property">&quot;condition&quot;</span><span class="token operator">:</span> <span class="token string">&quot;OnClassCondition&quot;</span><span class="token punctuation">,</span>	
                    <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;@ConditionalOnClass found required classes &#39;javax.servlet.Filter&#39;, &#39;org.springframework.http.server.ServerHttpRequest&#39;; @ConditionalOnMissingClass did not find unwanted class&quot;</span>	
                <span class="token punctuation">}</span>	
            <span class="token punctuation">]</span>	
        <span class="token punctuation">}</span>	
    <span class="token punctuation">}</span>	
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>actuator/heapdump</strong></p><p>下载一个 压缩的 JVM 堆 dump文件。</p><p><strong>mappings</strong></p><p>描述全部的 URI 路径，以及它们和控制器的映射关系。</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>	
  <span class="token property">&quot;/**/favicon.ico&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
    <span class="token property">&quot;bean&quot;</span><span class="token operator">:</span> <span class="token string">&quot;faviconHandlerMapping&quot;</span>	
  <span class="token punctuation">}</span><span class="token punctuation">,</span>	
  <span class="token property">&quot;{[/hello]}&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
    <span class="token property">&quot;bean&quot;</span><span class="token operator">:</span> <span class="token string">&quot;requestMappingHandlerMapping&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;method&quot;</span><span class="token operator">:</span> <span class="token string">&quot;public java.lang.String com.neo.controller.HelloController.index()&quot;</span>	
  <span class="token punctuation">}</span><span class="token punctuation">,</span>	
  <span class="token property">&quot;{[/error]}&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
    <span class="token property">&quot;bean&quot;</span><span class="token operator">:</span> <span class="token string">&quot;requestMappingHandlerMapping&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;method&quot;</span><span class="token operator">:</span> <span class="token string">&quot;public org.springframework.http.ResponseEntity&lt;java.util.Map&lt;java.lang.String, java.lang.Object&gt;&gt; org.springframework.boot.autoconfigure.web.BasicErrorController.error(javax.servlet.http.HttpServletRequest)&quot;</span>	
  <span class="token punctuation">}</span>	
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>actuator/threaddump</strong></p><p>threaddump 接口会生成当前线程活动的快照。方便我们在日常定位问题的时候查看线程的情况。主要展示了线程名、线程 ID、线程的状态、是否等待锁资源等信息。</p><p>启动示例项目，访问：<code>http://localhost:8080/actuator/threaddump</code>返回部分信息如下：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">[</span>	
  <span class="token punctuation">{</span>	
    <span class="token property">&quot;threadName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http-nio-8088-exec-6&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;threadId&quot;</span><span class="token operator">:</span> <span class="token number">49</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;blockedTime&quot;</span><span class="token operator">:</span> <span class="token number">-1</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;blockedCount&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;waitedTime&quot;</span><span class="token operator">:</span> <span class="token number">-1</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;waitedCount&quot;</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;lockName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject@1630a501&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;lockOwnerId&quot;</span><span class="token operator">:</span> <span class="token number">-1</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;lockOwnerName&quot;</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;inNative&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;suspended&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;threadState&quot;</span><span class="token operator">:</span> <span class="token string">&quot;WAITING&quot;</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;stackTrace&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>	
      <span class="token punctuation">{</span>	
        <span class="token property">&quot;methodName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;park&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;fileName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Unsafe.java&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;lineNumber&quot;</span><span class="token operator">:</span> <span class="token number">-2</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;className&quot;</span><span class="token operator">:</span> <span class="token string">&quot;sun.misc.Unsafe&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;nativeMethod&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>	
      <span class="token punctuation">}</span><span class="token punctuation">,</span>	
      ...	
      <span class="token punctuation">{</span>	
        <span class="token property">&quot;methodName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;run&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;fileName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;TaskThread.java&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;lineNumber&quot;</span><span class="token operator">:</span> <span class="token number">61</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;className&quot;</span><span class="token operator">:</span> <span class="token string">&quot;org.apache.tomcat.util.threads.TaskThread$WrappingRunnable&quot;</span><span class="token punctuation">,</span>	
        <span class="token property">&quot;nativeMethod&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>	
      <span class="token punctuation">}</span>	
      ...	
    <span class="token punctuation">]</span><span class="token punctuation">,</span>	
    <span class="token property">&quot;lockInfo&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>	
      <span class="token property">&quot;className&quot;</span><span class="token operator">:</span> <span class="token string">&quot;java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject&quot;</span><span class="token punctuation">,</span>	
      <span class="token property">&quot;identityHashCode&quot;</span><span class="token operator">:</span> <span class="token number">372286721</span>	
    <span class="token punctuation">}</span>	
  <span class="token punctuation">}</span>	
  ...	
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="actuator-shutdown" tabindex="-1"><a class="header-anchor" href="#actuator-shutdown" aria-hidden="true">#</a> /actuator/shutdown</h3><p>开启接口优雅关闭 Spring Boot 应用，要使用这个功能首先需要在配置文件中开启：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>management<span class="token punctuation">.</span>endpoint<span class="token punctuation">.</span>shutdown<span class="token punctuation">.</span>enabled<span class="token operator">=</span><span class="token boolean">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>配置完成之后，启动示例项目，使用 curl 模拟 post 请求访问 shutdown 接口。</p><blockquote><p>shutdown 接口默认只支持 post 请求。</p></blockquote><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>curl <span class="token operator">-</span><span class="token constant">X</span> <span class="token constant">POST</span> <span class="token string">&quot;http://localhost:8080/actuator/shutdown&quot;</span>	

<span class="token punctuation">{</span>	

    <span class="token string-property property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Shutting down, bye...&quot;</span>	

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时你会发现应用已经被关闭。</p><h3 id="快速上手" tabindex="-1"><a class="header-anchor" href="#快速上手" aria-hidden="true">#</a> 快速上手</h3><p>引入依赖</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;dependency&gt;	
      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;	
      &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;	
  &lt;/dependency&gt;	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>management:
  endpoints:
    web:
      exposure:
        #开启所有监控
        include: &quot;*&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> management:
  endpoints:
    # 暴露 EndPoint 以供访问，有jmx和web两种方式，exclude 的优先级高于 include
    jmx:
      exposure:
        exclude: &#39;*&#39;
        include: &#39;*&#39;
    web:
      exposure:
      # exclude: &#39;*&#39;
        include: [&quot;health&quot;,&quot;info&quot;,&quot;beans&quot;,&quot;mappings&quot;,&quot;logfile&quot;,&quot;metrics&quot;,&quot;shutdown&quot;,&quot;env&quot;]
      base-path: /actuator  # 配置 Endpoint 的基础路径
      cors: # 配置跨域资源共享
        allowed-origins: http://example.com
        allowed-methods: GET,POST
    enabled-by-default: true # 修改全局 endpoint 默认设置
  endpoint:
    auditevents: # 1、显示当前引用程序的审计事件信息，默认开启
      enabled: true
      cache:
        time-to-live: 10s # 配置端点缓存响应的时间
    beans: # 2、显示一个应用中所有 Spring Beans 的完整列表，默认开启
      enabled: true
    conditions: # 3、显示配置类和自动配置类的状态及它们被应用和未被应用的原因，默认开启
      enabled: true
    configprops: # 4、显示一个所有@ConfigurationProperties的集合列表，默认开启
      enabled: true
    env: # 5、显示来自Spring的 ConfigurableEnvironment的属性，默认开启
      enabled: true
    flyway: # 6、显示数据库迁移路径，如果有的话，默认开启
      enabled: true
    health: # 7、显示健康信息，默认开启
      enabled: true
      show-details: always
    info: # 8、显示任意的应用信息，默认开启
      enabled: true
    liquibase: # 9、展示任何Liquibase数据库迁移路径，如果有的话，默认开启
      enabled: true
    metrics: # 10、展示当前应用的metrics信息，默认开启
      enabled: true
    mappings: # 11、显示一个所有@RequestMapping路径的集合列表，默认开启
      enabled: true
    scheduledtasks: # 12、显示应用程序中的计划任务，默认开启
      enabled: true
    sessions: # 13、允许从Spring会话支持的会话存储中检索和删除(retrieval and deletion)用户会话。使用Spring Session对反应性Web应用程序的支持时不可用。默认开启。
      enabled: true
    shutdown: # 14、允许应用以优雅的方式关闭，默认关闭
      enabled: true
    threaddump: # 15、执行一个线程dump
      enabled: true
    # web 应用时可以使用以下端点
    heapdump: # 16、    返回一个GZip压缩的hprof堆dump文件，默认开启
      enabled: true
    jolokia: # 17、通过HTTP暴露JMX beans（当Jolokia在类路径上时，WebFlux不可用），默认开启
      enabled: true
    logfile: # 18、返回日志文件内容（如果设置了logging.file或logging.path属性的话），支持使用HTTP Range头接收日志文件内容的部分信息，默认开启
      enabled: true
    prometheus: #19、以可以被Prometheus服务器抓取的格式显示metrics信息，默认开启
      enabled: true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>您可以按如下方式公开所有端点：management.endpoints.web.exposure.include=* 您可以通过以下方式显式启用/shutdown端点：management.endpoint.shutdown.enabled=true 要公开所有（已启用）网络端点除env端点之外： management.endpoints.web.exposure.include=* management.endpoints.web.exposure.exclude=env</p>`,56),p=[o];function i(l,c){return s(),a("div",null,p)}const r=n(e,[["render",i],["__file","使用 Spring Boot Actuator 监控应用.html.vue"]]);export{r as default};
