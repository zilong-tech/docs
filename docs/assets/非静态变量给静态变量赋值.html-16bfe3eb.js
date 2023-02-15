import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},p=e(`<p>@Value注解介绍： 作为Spring的一个常用注解，其作用是通过注解将常量、配置文件中的值和其他bean的属性值注入到变量中，作为变量的初始值。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${login.name}&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">private</span> <span class="token class-name">String</span> loginName<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@value不能直接注入值给静态变量</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@Value(&quot;\${login.name}&quot;)
private static String loginName;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在Java中，静态变量也称为类变量。也就是说，它们属于一个类，而不是一个特定的实例。因此，类初始化的时候也将初始化静态变量相反，类的实例 初始化的时候也将初始化 实例变量(非静态变量)。类的所有实例共享该类的静态变量。</p><p>@value 是在 bean实例化后，在属性填充过程中进行赋值的，static初始化要早于@value。</p><p>实际场景中，常量需要通过配置文件来配置，该怎么办？</p><p>第一种方式：</p><p>把@Value(value=&quot;\${local.file.temp.dir}&quot;)放到静态变量的set方法上面即可，需要注意的是set方法要去掉static，还有就是当前类要交给spring来管理</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token doc-comment comment">/**文件存储目录*/</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token constant">SAVE_PATH</span><span class="token punctuation">;</span>

    <span class="token comment">//记得去掉static</span>
    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${local.file.temp.dir}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setSavePath</span><span class="token punctuation">(</span><span class="token class-name">String</span> savePath<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token constant">SAVE_PATH</span> <span class="token operator">=</span> savePath<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">local</span><span class="token punctuation">:</span>
  <span class="token key atrule">file</span><span class="token punctuation">:</span>
    <span class="token key atrule">temp</span><span class="token punctuation">:</span>
      <span class="token key atrule">dir</span> <span class="token punctuation">:</span> /data/temp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种方式:</p><p>使用 @postconstruct</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token doc-comment comment">/**文件存储目录*/</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token constant">SAVE_PATH</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${local.file.temp.dir}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token constant">SAVE_PATH_TEMP</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@PostConstruct</span>
    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token constant">SAVE_PATH</span> <span class="token operator">=</span> <span class="token constant">SAVE_PATH_TEMP</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

  <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token constant">SAVE_PATH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@PostConstruct 是在 bean 初始化（initializeBean）过程中调用的，是在@value之后调用的，可以通过这种方式给静态变量赋值。</p><p>第三种方式：</p><p>实现InitializingBean 接口</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">IndexController</span> <span class="token keyword">implements</span> <span class="token class-name">InitializingBean</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**文件存储目录*/</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token constant">SAVE_PATH</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${local.file.temp.dir}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token constant">SAVE_PATH_TEMP</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token constant">SAVE_PATH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">afterPropertiesSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token constant">SAVE_PATH</span> <span class="token operator">=</span> <span class="token constant">SAVE_PATH_TEMP</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>InitializingBean 接口也是在bean初始化（initializeBean）过程中调用的，具体可以看下spring bean 的实例化过程。</p><p>使用 @value 注解读取配置文件给静态变量赋值的方法给大家介绍到这里，希望对大家有所帮助。</p>`,21),i=[p];function c(l,o){return s(),a("div",null,i)}const d=n(t,[["render",c],["__file","非静态变量给静态变量赋值.html.vue"]]);export{d as default};
