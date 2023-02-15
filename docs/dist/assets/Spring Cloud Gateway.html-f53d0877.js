import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},p=e(`<p><strong>Spring Cloud Gateway</strong></p><p>网关作为流量的入口，常用的功能包括路由转发，权限校验，限流等。</p><p>Spring Cloud Gateway 旨在为微服务架构提供一种简单且有效的 API 路由的管理方式，并基于 Filter 的方式提供网关的基本功能，例如说安全认证、监控、限流等等。</p><p>Spring Cloud Gateway 提供更优秀的性能，更强大的有功能。</p><h3 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念" aria-hidden="true">#</a> <strong>核心概念</strong></h3><ul><li>路由（route)</li></ul><p>路由是网关中最基础的部分，路由信息包括一个ID、一个目的URI、一组断言工厂、一组Filter组成。如果断言为真，则说 明请求的URL和配置的路由匹配。</p><ul><li>断言(predicates)</li></ul><p>Java8中的断言函数，SpringCloud Gateway中的断言函数类型是Spring5.0框架中的ServerWebExchange。断言函数允 许开发者去定义匹配Http request中的任何信息，比如请求头和参数等。</p><ul><li>过滤器（Filter)</li></ul><p>SpringCloud Gateway中的filter分为Gateway FilIer和Global Filter。Filter可以对请求和响应进行处理。</p><h3 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理" aria-hidden="true">#</a> 工作原理</h3><p><img src="https://pic1.zhimg.com/80/v2-eb5a41dbfa61c99d1418d62b8a83d2b5_720w.png" alt=""></p><p>客户端向 Spring Cloud Gateway 发出请求，如果请求与网关程序定义的路由匹配，则该请求就会被发送到网关 Web 处理程序，此时处理程序运行特定的请求过滤器链。</p><p>过滤器之间用虚线分开的原因是过滤器可能会在发送代理请求的前后执行逻辑。所有 pre 过滤器逻辑先执行，然后执行代理请求；代理请求完成后，执行 post 过滤器逻辑。</p><h3 id="网关配置" tabindex="-1"><a class="header-anchor" href="#网关配置" aria-hidden="true">#</a> 网关配置</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">gateway</span><span class="token punctuation">:</span>
      <span class="token key atrule">routes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> after_route
        <span class="token key atrule">uri</span><span class="token punctuation">:</span> lb<span class="token punctuation">:</span>服务名称  <span class="token comment">#lb 整合负载均衡器ribbon,loadbalancer</span>
        <span class="token key atrule">predicates</span><span class="token punctuation">:</span> <span class="token comment">#断言</span>
        <span class="token punctuation">-</span> Path=XXXX <span class="token comment">#URL</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Cookie
          <span class="token key atrule">args</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> mycookie
            <span class="token key atrule">regexp</span><span class="token punctuation">:</span> mycookievalue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="断言工厂" tabindex="-1"><a class="header-anchor" href="#断言工厂" aria-hidden="true">#</a> 断言工厂</h4><p>1、时间匹配</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>predicates: 

# 匹配在指定的日期时间之后发生的请求 入参是ZonedDateTime类型 

 ‐ After=2021‐01‐31T22:22:07.783+08:00[Asia/Shanghai] 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取ZonedDateTime类型的指定日期时间</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ZonedDateTime zonedDateTime = ZonedDateTime.now();//默认时区 

// 用指定时区获取当前时间 
ZonedDateTime zonedDateTime2 = ZonedDateTime.now(ZoneId.of(&quot;Asia/Shanghai&quot;)); 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>适用场景：秒杀活动，某个时间点后活动开始</p><p>在设置时间之前访问，404</p><p><img src="https://pic2.zhimg.com/80/v2-05d94193c4da629ca161b900df8eb5e6_720w.png" alt=""></p><p>2、cookie、header等匹配</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      routes:
      - id: order_route  #路由ID，全局唯一，建议配合服务名
        uri: lb://mall-order  #lb 整合负载均衡器ribbon,loadbalancer
        #断言
        predicates:
    
        # Cookie匹配
        - Cookie=username, test
        # Header匹配  请求中带有请求头名为 x-request-id，其值与 \\d+ 正则表达式匹配
        - Header=X-Request-Id, \\d+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、路径匹配</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      routes:
      - id: order_route  #路由ID，全局唯一，建议配合服务名
        uri: lb://mall-order  #lb 整合负载均衡器ribbon,loadbalancer
        predicates:
        #Path路径匹配
        - Path=/order/**
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>其他配置可以参考官网配置：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories</p></blockquote><p>4、自定义断言工厂</p><p>自定义路由断言工厂需要继承 AbstractRoutePredicateFactory 类，重写 apply 方法的逻辑。在 apply 方法中可以 通过 serverWebExchange.getRequest() 拿到 ServerHttpRequest 对象，从而可以获取到请求的参数、请求方式、请求头等信息。</p><p>注意： 命名需要以 RoutePredicateFactory 结尾</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CheckAuthRoutePredicateFactory</span> <span class="token keyword">extends</span>
        <span class="token class-name">AbstractRoutePredicateFactory</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CheckAuthRoutePredicateFactory<span class="token punctuation">.</span>Config</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token class-name">CheckAuthRoutePredicateFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token class-name">Config</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Predicate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServerWebExchange</span><span class="token punctuation">&gt;</span></span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token class-name">Config</span> config<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">GatewayPredicate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token class-name">ServerWebExchange</span> serverWebExchange<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;调用CheckAuthRoutePredicateFactory&quot;</span> <span class="token operator">+</span> config<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">ServerHttpRequest</span> request <span class="token operator">=</span> serverWebExchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

                <span class="token keyword">if</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                
                <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    
    <span class="token doc-comment comment">/**
     * 快捷配置
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">shortcutFieldOrder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Collections</span><span class="token punctuation">.</span><span class="token function">singletonList</span><span class="token punctuation">(</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 需要定义一个内部类，该类用于封装application.yml中的配置
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Config</span> <span class="token punctuation">{</span>

        <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> name<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在配置文件中配置：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>       predicates:
        - Path=/order/**
        #自定义CheckAuth断言工厂
        - CheckAuth=test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="过滤器工厂" tabindex="-1"><a class="header-anchor" href="#过滤器工厂" aria-hidden="true">#</a> 过滤器工厂</h3><p>SpringCloudGateway 内置了很多的过滤器工厂，我们通过一些过滤器工厂可以进行一些业务逻辑处理器，比如添加剔除响应头，添加去除参数等</p><p>1、添加请求头、请求参数</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  filters:
        - AddRequestHeader=X-Request-color, red  #添加请求头
        - AddRequestParameter=color, blue   # 添加请求参数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试：127.0.0.1:8888/order/testgateway2</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/testgateway2&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">testGateway</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestHeader</span><span class="token punctuation">(</span><span class="token string">&quot;X-Request-color&quot;</span><span class="token punctuation">)</span> <span class="token class-name">String</span> color1<span class="token punctuation">,</span>
                          <span class="token annotation punctuation">@RequestParam</span><span class="token punctuation">(</span><span class="token string">&quot;color&quot;</span><span class="token punctuation">)</span> <span class="token class-name">String</span> color2
                          <span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;gateWay获取请求头X-Request-color：&quot;</span><span class="token operator">+</span>color1<span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;gateWay获取请求参数color:&quot;</span><span class="token operator">+</span>color2<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token string">&quot;success&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、重定向</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> filters:
        - RedirectTo=302, http://baidu.com  #重定向到百度
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>更多过滤器操作，请参考官网：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories</p></blockquote><p>3、自定义过滤器</p><p>继承AbstractNameValueGatewayFilterFactory且我们的自定义名称必须要以GatewayFilterFactory结尾并交给 spring管理。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CheckAuthGatewayFilterFactory</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractNameValueGatewayFilterFactory</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">GatewayFilter</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token class-name">NameValueConfig</span> config<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span>exchange<span class="token punctuation">,</span> chain<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;调用CheckAuthGatewayFilterFactory===&quot;</span>
                    <span class="token operator">+</span> config<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;:&quot;</span> <span class="token operator">+</span> config<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// TODO</span>
            <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>yml中配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>        filters:
        - CheckAuth=test,男  #配置自定义的过滤器工厂
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>打印：用CheckAuthGatewayFilterFactory===test:男</p><h3 id="全局过滤器" tabindex="-1"><a class="header-anchor" href="#全局过滤器" aria-hidden="true">#</a> 全局过滤器</h3><p>GlobalFilter 会作用于所有路由。</p><p>自定义全局过滤器</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token annotation punctuation">@Order</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CheckAuthFilter</span> <span class="token keyword">implements</span> <span class="token class-name">GlobalFilter</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Mono</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">&gt;</span></span> <span class="token function">filter</span><span class="token punctuation">(</span><span class="token class-name">ServerWebExchange</span> exchange<span class="token punctuation">,</span> <span class="token class-name">GatewayFilterChain</span> chain<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//校验请求头中的token</span>
        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> token <span class="token operator">=</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;token&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;token:&quot;</span><span class="token operator">+</span> token<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>token<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// TODO token校验</span>
        <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="跨域配置" tabindex="-1"><a class="header-anchor" href="#跨域配置" aria-hidden="true">#</a> 跨域配置</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>globalcors<span class="token operator">:</span>
  cors<span class="token operator">-</span>configurations<span class="token operator">:</span>
    <span class="token char">&#39;[/**]&#39;</span><span class="token operator">:</span>
      allowedOrigins<span class="token operator">:</span> <span class="token string">&quot;*&quot;</span>
      allowedMethods<span class="token operator">:</span>
      <span class="token operator">-</span> <span class="token constant">GET</span>
      <span class="token operator">-</span> <span class="token constant">POST</span>
      <span class="token operator">-</span> <span class="token constant">DELETE</span>
      <span class="token operator">-</span> <span class="token constant">PUT</span>
      <span class="token operator">-</span> <span class="token constant">OPTION</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,57),c=[p];function i(o,l){return s(),a("div",null,c)}const r=n(t,[["render",i],["__file","Spring Cloud Gateway.html.vue"]]);export{r as default};
