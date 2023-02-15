import{_ as i,W as t,X as o,Y as s,Z as n,a0 as c,a1 as a,F as l}from"./framework-2afc6763.js";const p={},d=a(`<h2 id="什么是-nacos-config" tabindex="-1"><a class="header-anchor" href="#什么是-nacos-config" aria-hidden="true">#</a> 什么是 Nacos Config</h2><p>Nacos 提供用于存储配置和其他元数据的 key/value 存储，为分布式系统中的外部化配置提供服务器端和客户端支持。使用 Spring Cloud Alibaba Nacos Config，您可以在 Nacos Server 集中管理你 Spring Cloud 应用的外部属性配置。</p><ul><li><p><strong>支持自定义</strong> <strong>namespace</strong> <strong>的配置</strong></p><p>用于进行租户粒度的配置隔离。不同的命名空间下，可以存在相同的 Group 或 Data ID 的配置。Namespace 的常用场景之一是不同环境的配置的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等。</p><p>在没有明确指定 \${spring.cloud.nacos.config.namespace} 配置的情况下， 默认使用的是 Nacos 上 Public 这个namespace。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spring.cloud.nacos.config.namespace=b3404bc0-d7dc-4855-b519-570ed34b62d7
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p><strong>支持profile粒度的配置</strong></p><p>在加载配置的时候，不仅仅加载了以 dataid 为 \${spring.application.name}.\${file-extension:properties} 为前缀的基础配置，还加载了dataid为 \${spring.application.name}-\${profile}.\${file-extension:properties} 的基础配置。在日常开发中如果遇到多套环境下的不同配置，可以通过Spring 提供的 \${spring.profiles.active} 这个配置项来配置。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spring.profiles.active=dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Nacos 上新增一个dataid为：nacos-config-develop.yaml的基础配置，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Data ID:        nacos-config-dev.yaml

Group  :        DEFAULT_GROUP

配置格式:        YAML

配置内容:        current.env: develop-env
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>支持自定义</strong> <strong>Group</strong> <strong>的配置</strong></p><p>Group是组织配置的维度之一。在没有明确指定 <code>\${spring.cloud.nacos.config.group}</code> 配置的情况下， 默认使用的是 DEFAULT_GROUP 。如果需要自定义自己的 Group，可以通过以下配置来实现：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spring.cloud.nacos.config.group=DEVELOP_GROUP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p><strong>支持自定义扩展的 Data Id 配置</strong></p></li></ul>`,3),r={href:"https://github.com/spring-cloud-incubator/spring-cloud-alibaba/issues/141",target:"_blank",rel:"noopener noreferrer"},u=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spring.application.name=opensource-service-provider
spring.cloud.nacos.config.server-addr=127.0.0.1:8848

# config external configuration
# 1、Data Id 在默认的组 DEFAULT_GROUP,不支持配置的动态刷新
spring.cloud.nacos.config.extension-configs[0].data-id=ext-config-common01.properties

# 2、Data Id 不在默认的组，不支持动态刷新
spring.cloud.nacos.config.extension-configs[1].data-id=ext-config-common02.properties
spring.cloud.nacos.config.extension-configs[1].group=GLOBALE_GROUP

# 3、Data Id 既不在默认的组，也支持动态刷新
spring.cloud.nacos.config.extension-configs[2].data-id=ext-config-common03.properties
spring.cloud.nacos.config.extension-configs[2].group=REFRESH_GROUP
spring.cloud.nacos.config.extension-configs[2].refresh=true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到:</p><ul><li>通过 <code>spring.cloud.nacos.config.extension-configs[n].data-id</code> 的配置方式来支持多个 Data Id 的配置。</li><li>通过 <code>spring.cloud.nacos.config.extension-configs[n].group</code> 的配置方式自定义 Data Id 所在的组，不明确配置的话，默认是 DEFAULT_GROUP。</li><li>通过 <code>spring.cloud.nacos.config.extension-configs[n].refresh</code> 的配置方式来控制该 Data Id 在配置变更时，是否支持应用中可动态刷新， 感知到最新的配置值。默认是不支持的。</li></ul><table><thead><tr><th>Note</th><th>多个 Data Id 同时配置时，他的优先级关系是 <code>spring.cloud.nacos.config.extension-configs[n].data-id</code> 其中 n 的值越大，优先级越高。</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table><table><thead><tr><th>Note</th><th><code>spring.cloud.nacos.config.extension-configs[n].data-id</code> 的值必须带文件扩展名，文件扩展名既可支持 properties，又可以支持 yaml/yml。 此时 <code>spring.cloud.nacos.config.file-extension</code> 的配置对自定义扩展配置的 Data Id 文件扩展名没有影响。</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table><p>通过自定义扩展的 Data Id 配置，既可以解决多个应用间配置共享的问题，又可以支持一个应用有多个配置文件。</p><p>为了更加清晰的在多个应用间配置共享的 Data Id ，你可以通过以下的方式来配置：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 配置支持共享的 Data Id
spring.cloud.nacos.config.shared-configs[0].data-id=common.yaml

# 配置 Data Id 所在分组，缺省默认 DEFAULT_GROUP
spring.cloud.nacos.config.shared-configs[0].group=GROUP_APP1

# 配置Data Id 在配置变更时，是否动态刷新，缺省默认 false
spring.cloud.nacos.config.shared-configs[0].refresh=true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到：</p><ul><li><p>通过 <code>spring.cloud.nacos.config.shared-configs[n].data-id</code> 来支持多个共享 Data Id 的配置。</p></li><li><p>通过 <code>spring.cloud.nacos.config.shared-configs[n].group</code> 来配置自定义 Data Id 所在的组，不明确配置的话，默认是 DEFAULT_GROUP。</p></li><li><p>通过 <code>spring.cloud.nacos.config.shared-configs[n].refresh</code> 来控制该Data Id在配置变更时，是否支持应用中动态刷新，默认false。</p></li><li><p><strong>配置的优先级</strong></p></li></ul><p>Spring Cloud Alibaba Nacos Config 目前提供了三种配置能力从 Nacos 拉取相关的配置。</p><ul><li>A: 通过 <code>spring.cloud.nacos.config.shared-configs[n].data-id</code> 支持多个共享 Data Id 的配置</li><li>B: 通过 <code>spring.cloud.nacos.config.extension-configs[n].data-id</code> 的方式支持多个扩展 Data Id 的配置</li><li>C: 通过内部相关规则(应用名、应用名+ Profile )自动生成相关的 Data Id 配置</li></ul><p>当三种方式共同使用时，他们的一个优先级关系是:A &lt; B &lt; C</p><ul><li><strong>完全关闭配置</strong></li></ul><p>通过设置 spring.cloud.nacos.config.enabled = false 来完全关闭 Spring Cloud Nacos Config</p><h2 id="接入配置中心" tabindex="-1"><a class="header-anchor" href="#接入配置中心" aria-hidden="true">#</a> 接入配置中心</h2><p>引入依赖</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!--nacos配置中心--&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.alibaba.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-alibaba-nacos-config<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加bootstrap.yml,<strong>必须使用 bootstrap.properties (yml)配置文件来配置Nacos Server 地址</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>config  <span class="token comment">#微服务名称</span>

  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">nacos</span><span class="token punctuation">:</span>
      <span class="token key atrule">config</span><span class="token punctuation">:</span>
        <span class="token key atrule">server-addr</span><span class="token punctuation">:</span> 192.168.253.128<span class="token punctuation">:</span><span class="token number">8848</span> <span class="token comment">#没有指定namespace时默认是public</span>
      
        <span class="token key atrule">namespace</span><span class="token punctuation">:</span> 80a98d11<span class="token punctuation">-</span>492c<span class="token punctuation">-</span>4008<span class="token punctuation">-</span>85aa<span class="token punctuation">-</span>32d889e9b0d0
        <span class="token comment"># 基于 dataid 为 yaml 的文件扩展名配置方式</span>
        <span class="token key atrule">file-extension</span><span class="token punctuation">:</span> yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在Nacos添加如下的配置：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Data ID:    nacos-config.properties

Group  :    DEFAULT_GROUP

配置格式:    Properties

配置内容：   user.name=nacos-config-properties
            user.age=90
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Note</th><th>注意dataid是以 properties(默认的文件扩展名方式)为扩展名</th></tr></thead></table><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202204112338313.png" alt=""></p><p>使用</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${user.age}&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">private</span> <span class="token class-name">String</span> age<span class="token punctuation">;</span>
<span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${user.name}&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>

<span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/index&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> name<span class="token operator">+</span><span class="token string">&quot;,&quot;</span><span class="token operator">+</span>age<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>@RefreshScope</strong></p><p>动态刷新配置的值，需要加上**@RefreshScope** 注解</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@RestController</span>
<span class="token annotation punctuation">@RefreshScope</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">IndexController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${user.age}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> age<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/index&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> name<span class="token operator">+</span><span class="token string">&quot;,&quot;</span><span class="token operator">+</span>age<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29);function g(v,m){const e=l("ExternalLinkIcon");return t(),o("div",null,[d,s("p",null,[n("Spring Cloud Alibaba Nacos Config 从 0.2.1 版本后，可支持自定义 Data Id 的配置。关于这部分详细的设计可参考 "),s("a",r,[n("这里"),c(e)]),n("。 一个完整的配置案例如下所示：")]),u])}const k=i(p,[["render",g],["__file","Spring Cloud Nacos Config.html.vue"]]);export{k as default};
