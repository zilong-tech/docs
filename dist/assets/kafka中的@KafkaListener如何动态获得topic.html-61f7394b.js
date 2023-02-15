import{_ as n,W as a,X as s,a1 as e}from"./framework-2afc6763.js";const t={},i=e(`<p>spring boot 在集成kafka 消费端使用@KafkaListener时候要指定topic，在实际应用时候，可能需要通过配置来指定topic。</p><p>首先写一个KafkaTopicConfig类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">KafkaTopicConfig</span> <span class="token keyword">implements</span> <span class="token class-name">InitializingBean</span> <span class="token punctuation">{</span>

	<span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${kafka.topic}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> topic<span class="token punctuation">;</span>
 
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">afterPropertiesSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

         <span class="token comment">//系统写入</span>
         <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">setProperty</span><span class="token punctuation">(</span><span class="token string">&quot;topics&quot;</span><span class="token punctuation">,</span> topics<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@KafkaListener(topics = “#{’\${topics}’.split(’,’)}”) 在要调用 @KafkaListener的类前加上@DependsOn(value = “kafkaTopicConfig”)，确保kafkaTopicConfig类在此之前加载。</p><p>注意：@KafkaLisener中的topics是string[]类型，一定要注意传入参数的属性，不然会报value &#39;[Ljava.lang.String;@1fb8997’的错误，一定要注意一下！</p>`,5),p=[i];function o(c,l){return a(),s("div",null,p)}const k=n(t,[["render",o],["__file","kafka中的@KafkaListener如何动态获得topic.html.vue"]]);export{k as default};
