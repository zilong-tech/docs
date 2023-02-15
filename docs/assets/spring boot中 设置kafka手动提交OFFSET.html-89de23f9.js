import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const i={},t=e(`<h3 id="spring-boot中-设置kafka手动提交offset" tabindex="-1"><a class="header-anchor" href="#spring-boot中-设置kafka手动提交offset" aria-hidden="true">#</a> spring boot中 设置kafka手动提交OFFSET</h3><p>1、enable.auto.commit参数设置成了false</p><p>2、org.springframework.kafka.listener.AbstractMessageListenerContainer.AckMode</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code> <span class="token doc-comment comment">/**

   * The offset commit behavior enumeration.
     /
  public enum AckMode <span class="token punctuation">{</span> 
    /**
     * 每处理一条commit一次
     */</span>
    <span class="token constant">RECORD</span><span class="token punctuation">,</span>
 
    <span class="token doc-comment comment">/**
     * 每次poll的时候批量提交一次，频率取决于每次poll的调用频率
     */</span>
    <span class="token constant">BATCH</span><span class="token punctuation">,</span>
 
    <span class="token doc-comment comment">/**
     * 每次间隔ackTime的时间去commit
     */</span>
    <span class="token constant">TIME</span><span class="token punctuation">,</span>
 
    <span class="token doc-comment comment">/**
     * 累积达到ackCount次的ack去commit
     */</span>
    <span class="token constant">COUNT</span><span class="token punctuation">,</span>
 
    <span class="token doc-comment comment">/**
     *ackTime或ackCount哪个条件先满足，就commit
     */</span>
    <span class="token constant">COUNT_TIME</span><span class="token punctuation">,</span>
 
    <span class="token doc-comment comment">/**
     *  listener负责ack，但是实际上也是批量上去
     */</span>
    <span class="token constant">MANUAL</span><span class="token punctuation">,</span>
 
    <span class="token doc-comment comment">/**
     
     * listner负责ack，每调用一次，就立即commit
     /
    MANUAL_IMMEDIATE;
</span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="manual-commit" tabindex="-1"><a class="header-anchor" href="#manual-commit" aria-hidden="true">#</a> MANUAL COMMIT</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@KafkaListener</span><span class="token punctuation">(</span>topics <span class="token operator">=</span> <span class="token string">&quot;k010&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">listen</span><span class="token punctuation">(</span><span class="token class-name">ConsumerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">,</span> <span class="token operator">?</span><span class="token punctuation">&gt;</span></span> cr<span class="token punctuation">,</span><span class="token class-name">Acknowledgment</span> ack<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>

        <span class="token constant">LOGGER</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span>cr<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        ack<span class="token punctuation">.</span><span class="token function">acknowledge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>方法参数里头传递Acknowledgment，然后手工ack</p><p>如果只添加上面语句会报错：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>the listener container must have a MANUAL Ackmode to populate the Acknowledgment
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们要配置AckMode为MANUAL Ackmode</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>factory<span class="token punctuation">.</span><span class="token function">getContainerProperties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setAckMode</span><span class="token punctuation">(</span><span class="token class-name">AbstractMessageListenerContainer<span class="token punctuation">.</span>AckMode</span><span class="token punctuation">.</span><span class="token constant">MANUAL</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在spring boot 可以直接配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spring:

  kafka:
  
    # kafka服务地址与端口
    bootstrap-servers: 127.0.0.1:9092
    key.serializer: org.apache.kafka.common.serialization.StringSerializer
    value.serializer: org.apache.kafka.common.serialization.StringSerializer

    consumer:
      group-id: bbb
      topic: test
      auto-offset-reset: earliest
  
      max-poll-records: 100
      enable-auto-commit: false
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
  listener:
    ack-mode: manual
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置了手动提交-消息重复消费原因" tabindex="-1"><a class="header-anchor" href="#设置了手动提交-消息重复消费原因" aria-hidden="true">#</a> 设置了手动提交，消息重复消费原因</h3><p>kafka 有个offset的概念，当每个消息被写进去后，都有一个offset，代表他的序号，然后consumer消费该数据之后，隔一段时间，会把自己消费过的消息的offset提交一下，代表我已经消费过了。</p><p>max.poll.interval.ms</p><p>两次poll操作允许的最大时间间隔。单位毫秒。默认值300000（5分钟）。</p><p>两次poll超过此时间间隔，Kafka服务端会进行rebalance操作，导致客户端连接失效，无法提交offset信息，从而引发重复消费。可以适当调大这个参数避免重复消费。</p><p>session.timeout.ms</p><p>比如一条消息处理需要5分钟，session.timeout.ms = 3000ms,等消费者处理完消息，消费组早就将消费者移除消费者了，那么就会re-balance重平衡，此时有一定几率offset没提交，会导致重平衡后重复消费。</p>`,20),c=[t];function l(o,p){return s(),a("div",null,c)}const r=n(i,[["render",l],["__file","spring boot中 设置kafka手动提交OFFSET.html.vue"]]);export{r as default};
