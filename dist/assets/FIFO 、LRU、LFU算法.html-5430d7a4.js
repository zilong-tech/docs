import{_ as n,W as s,X as e,a1 as a}from"./framework-2afc6763.js";const i={},t=a(`<h3 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h3><p>三种常见的缓存策略：</p><p><strong>FIFO</strong>：First In First Out，先进先出</p><p><strong>LRU</strong>：Least Recently Used，最近最少使用</p><p><strong>LFU</strong>：Least Frequently Used，最不经常使用</p><h3 id="fifo" tabindex="-1"><a class="header-anchor" href="#fifo" aria-hidden="true">#</a> <strong>FIFO</strong></h3><p><strong>FIFO</strong> 按照“先进先出（First In，First Out）” 的原理淘汰数据，最先加载到内存的最先被置换出去，符合队列的特性，数据结构上使用队列Queue来实现。</p><p><img src="https://gitee.com/zysspace/mq-demo/raw/master/image/202212091801717.png" alt=""></p><p>FIFO 算法的描述：设计一种缓存结构，该结构在构造时确定大小，假设大小为 K，并有两个功能：</p><ol><li>set(key,value)：将记录(key,value)插入该结构。当缓存满时，将最先进入缓存的数据置换掉。</li><li>get(key)：返回key对应的value值。</li></ol><p>新数据插入 FIFO队列尾部，数据在FIFO队列中顺序移动；</p><p>淘汰FIFO队列头部的数据；</p><h3 id="lru" tabindex="-1"><a class="header-anchor" href="#lru" aria-hidden="true">#</a> LRU</h3><p>最近最久未使用（Least Recently Used LRU）算法是⼀种缓存淘汰策略，它是大部分操作系统为最大化页面命中率而广泛采用的一种页面置换算法。该算法的思路是，发生缺页中断时，将最近一段时间内最久未使用的页面置换出去。 从程序运行的原理来看，最近最久未使用算法是比较接近理想的一种页面置换算法，这种算法既充分利用了内存中页面调用的历史信息，又正确反映了程序的局部问题。</p><p>LRU算法的思想是：<strong>如果一个数据在最近一段时间没有被访问到，那么可以认为在将来它被访问的可能性也很小。因此，当空间满时，最久没有访问的数据最先被置换（淘汰）</strong>。</p><p>LRU算法的描述： 设计一种缓存结构，该结构在构造时确定大小，假设大小为 K，并有两个功能：</p><ol><li>set(key,value)：将记录(key,value)插入该结构。当缓存满时，将最久未使用的数据置换掉。</li><li>get(key)：返回key对应的value值。</li></ol><h4 id="java-实现-lru-算法" tabindex="-1"><a class="header-anchor" href="#java-实现-lru-算法" aria-hidden="true">#</a> java 实现 LRU 算法</h4><p>用LinkedHashMap来实现的LRU算法的缓存。</p><div class="language-JAVA line-numbers-mode" data-ext="JAVA"><pre class="language-JAVA"><code>public class LRUCache&lt;K, V&gt; extends LinkedHashMap&lt;K, V&gt; {

    private int cacheSize;
    public LRUCache(int cacheSize) {
        super(16, (float) 0.75, true);
        this.cacheSize = cacheSize;
    }


    @Override
    protected boolean removeEldestEntry(Map.Entry&lt;K, V&gt; eldest) {
        return size() &gt; cacheSize;
    }
}


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test</span> <span class="token punctuation">{</span>


    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">LRUCache</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> cache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LRUCache</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cache<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;key&quot;</span> <span class="token operator">+</span> i<span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;all cache :&quot;</span> <span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cache<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;key3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;get key3 :&quot;</span><span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cache<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;key4&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;get key4: &quot;</span><span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cache<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;key4&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;get key4 :&quot;</span><span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cache<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;key&quot;</span> <span class="token operator">+</span> <span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;cache :&quot;</span><span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cache<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;key&quot;</span> <span class="token operator">+</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;cache :&quot;</span><span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cache<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;key&quot;</span> <span class="token operator">+</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;cache :&quot;</span><span class="token operator">+</span> cache<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>


<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果：</p><blockquote><p>all cache :{key0=0, key1=1, key2=2, key3=3, key4=4, key5=5, key6=6, key7=7, key8=8, key9=9} get key3 :{key0=0, key1=1, key2=2, key4=4, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3} get key4: {key0=0, key1=1, key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4} get key4 :{key0=0, key1=1, key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4} cache :{key1=1, key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4, key10=10} cache :{key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4, key10=10, key11=11} cache :{key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4, key10=10, key11=11, key12=12}</p></blockquote><h3 id="lfu" tabindex="-1"><a class="header-anchor" href="#lfu" aria-hidden="true">#</a> <strong>LFU</strong></h3><p>LFU（Least Frequently Used），最近最少使用策略，也就是说在一段时间内，数据被使用频次最少的，优先被淘汰。</p><p>LFU将数据和数据的访问频次保存在一个容量有限的容器中，当访问一个数据时：</p><ol><li>该数据在容器中，则将该数据的访问频次加1。</li><li>该数据不在容器中，则将该数据加入到容器中，且访问频次为1。</li></ol><p>当数据量达到容器的限制后，会剔除掉访问频次最低的数据。下图是一个简易的LFU算法示意图。</p><p><img src="https://gitee.com/zysspace/mq-demo/raw/master/image/202212251625730.png" alt=""></p><h3 id="lfu实现" tabindex="-1"><a class="header-anchor" href="#lfu实现" aria-hidden="true">#</a> LFU实现</h3><p>可以使用双哈希表进行实现，一个哈希表用于存储对应的数据，另一个哈希表用于存储数据被使用次数和对应的数据。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>package com.demo.web.java;

import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class LFUCache&lt;K, V&gt; {

    /**
     * 容量限制
     */
    private int capacity;

    /**
     * 当前最小使用次数
     */
    private int minUsedCount;

    /**
     * key和数据的映射
     */
    private Map&lt;K, Node&gt; map;
    /**
     * 数据频率和对应数据组成的链表
     */
    private Map&lt;Integer, List&lt;Node&gt;&gt; usedCountMap;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minUsedCount = 1;
        this.map = new HashMap&lt;&gt;();
        this.usedCountMap = new HashMap&lt;&gt;();
    }

    public V get(K key) {

        Node node = map.get(key);
        if (node == null) {
            return null;
        }
        // 增加数据的访问频率
        addUsedCount(node);
        return node.value;
    }

    public V put(K key, V value) {
        Node node = map.get(key);
        if (node != null) {
            // 如果存在则增加该数据的访问频次
            V oldValue = node.value;
            node.value = value;
            addUsedCount(node);
            return oldValue;
        } else {
            // 数据不存在，判断链表是否满
            if (map.size() == capacity) {
                // 如果满，则删除队首节点，更新哈希表
                List&lt;Node&gt; list = usedCountMap.get(minUsedCount);
                Node delNode = list.get(0);
                list.remove(delNode);
                map.remove(delNode.key);
            }
            // 新增数据并放到数据频率为1的数据链表中
            Node newNode = new Node(key, value);
            map.put(key, newNode);
            List&lt;Node&gt; list = usedCountMap.get(1);
            if (list == null) {
                list = new LinkedList&lt;&gt;();
                usedCountMap.put(1, list);
            }

            list.add(newNode);
            minUsedCount = 1;
            return null;
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(&quot;LfuCache{&quot;);
        List&lt;Integer&gt; usedCountList = this.usedCountMap.keySet().stream().collect(Collectors.toList());
        usedCountList.sort(Comparator.comparingInt(i -&gt; i));
        int count = 0;
        for (int usedCount : usedCountList) {
            List&lt;Node&gt; list = this.usedCountMap.get(usedCount);
            if (list == null) {
                continue;
            }
            for (Node node : list) {
                if (count &gt; 0) {
                    sb.append(&#39;,&#39;).append(&#39; &#39;);
                }
                sb.append(node.key);
                sb.append(&#39;=&#39;);
                sb.append(node.value);
                sb.append(&quot;(UsedCount:&quot;);
                sb.append(node.usedCount);
                sb.append(&#39;)&#39;);
                count++;
            }
        }
        return sb.append(&#39;}&#39;).toString();
    }

    private void addUsedCount(Node node) {
        List&lt;Node&gt; oldList = usedCountMap.get(node.usedCount);
        oldList.remove(node);

        // 更新最小数据频率
        if (minUsedCount == node.usedCount &amp;&amp; oldList.isEmpty()) {
            minUsedCount++;
        }

        node.usedCount++;
        List&lt;Node&gt; set = usedCountMap.get(node.usedCount);
        if (set == null) {
            set = new LinkedList&lt;&gt;();
            usedCountMap.put(node.usedCount, set);
        }
        set.add(node);
    }

    class Node {

        K key;
        V value;
        int usedCount = 1;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }


    public static void main(String[] args) {
        LFUCache&lt;String, String&gt; cache = new LFUCache(3);
        cache.put(&quot;keyA&quot;, &quot;valueA&quot;);
        System.out.println(&quot;put keyA&quot;);
        System.out.println(cache);
        System.out.println(&quot;=========================&quot;);

        cache.put(&quot;keyB&quot;, &quot;valueB&quot;);
        System.out.println(&quot;put keyB&quot;);
        System.out.println(cache);
        System.out.println(&quot;=========================&quot;);

        cache.put(&quot;keyC&quot;, &quot;valueC&quot;);
        System.out.println(&quot;put keyC&quot;);
        System.out.println(cache);
        System.out.println(&quot;=========================&quot;);

        cache.get(&quot;keyA&quot;);
        System.out.println(&quot;get keyA&quot;);
        System.out.println(cache);
        System.out.println(&quot;=========================&quot;);

        cache.put(&quot;keyD&quot;, &quot;valueD&quot;);
        System.out.println(&quot;put keyD&quot;);
        System.out.println(cache);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结果：</p><blockquote><p>put keyA</p><p>LfuCache{keyA=valueA(UsedCount:1)}</p><p>put keyB</p><p>LfuCache{keyA=valueA(UsedCount:1), keyB=valueB(UsedCount:1)}</p><p>put keyC</p><p>LfuCache{keyA=valueA(UsedCount:1), keyB=valueB(UsedCount:1), keyC=valueC(UsedCount:1)}</p><p>get keyA</p><p>LfuCache{keyB=valueB(UsedCount:1), keyC=valueC(UsedCount:1), keyA=valueA(UsedCount:2)}</p><p>put keyD LfuCache{keyC=valueC(UsedCount:1), keyD=valueD(UsedCount:1), keyA=valueA(UsedCount:2)}</p></blockquote><h3 id="lfu相比于lru的优劣" tabindex="-1"><a class="header-anchor" href="#lfu相比于lru的优劣" aria-hidden="true">#</a> LFU相比于LRU的优劣</h3><p>区别：</p><p>LFU是基于访问频次的模式，而LRU是基于访问时间的模式。</p><p>优势：</p><p>在数据访问符合正态分布时，相比于LRU算法，LFU算法的缓存命中率会高一些。</p><p>劣势：</p><ol><li>LFU的复杂度要比LRU更高一些。</li><li>需要维护数据的访问频次，每次访问都需要更新。</li><li>早期的数据相比于后期的数据更容易被缓存下来，导致后期的数据很难被缓存。</li><li>新加入缓存的数据很容易被剔除，像是缓存的末端发生“抖动”。</li></ol>`,41),l=[t];function u(c,p){return s(),e("div",null,l)}const o=n(i,[["render",u],["__file","FIFO 、LRU、LFU算法.html.vue"]]);export{o as default};
