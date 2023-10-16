import{_ as e,W as n,X as a,a1 as s}from"./framework-2afc6763.js";const i={},l=s(`<p>HashMap实现了Map接口，并继承 AbstractMap 抽象类，其中 Map 接口定义了键值映射规则。和 AbstractCollection抽象类在 Collection 族的作用类似， AbstractMap 抽象类提供了 Map 接口的骨干实现，以最大限度地减少实现Map接口所需的工作。</p><img src="http://img.xxfxpt.top/202112041656661.PNG" style="zoom:50%;"><h3 id="jdk1-8-之前" tabindex="-1"><a class="header-anchor" href="#jdk1-8-之前" aria-hidden="true">#</a> <strong>JDK1.8</strong> <strong>之前</strong></h3><p>JDK1.8 之前 HashMap 底层是 数组和链表 结合在⼀起使⽤也就是 链表散列。HashMap 通过key的 hashCode 经过扰动函数处理过后得到 hash 值，然后通过 (n - 1) &amp; hash 判断当前元素存放的位置（这⾥的 n 指的是数组的⻓度），如果当前位置存在元素的话，就判断该元素与要存⼊的元素的 hash 值以及 key 是否相同，如果相同的话，直接覆盖，不相同就通过拉链法解决冲突。</p><h3 id="哈希的相关概念" tabindex="-1"><a class="header-anchor" href="#哈希的相关概念" aria-hidden="true">#</a> 哈希的相关概念</h3><p>Hash 就是把任意长度的输入(又叫做预映射， pre-image)，通过哈希算法，变换成固定长度的输出(通常是整型)，该输出就是哈希值。这种转换是一种 压缩映射 ，也就是说，散列值的空间通常远小于输入的空间。不同的输入可能会散列成相同的输出，从而不可能从散列值来唯一的确定输入值。简单的说，就是一种将任意长度的消息压缩到某一固定长度的息摘要函数。</p><p><img src="https://pic2.zhimg.com/50/v2-ba14c0ddc953a8e951c578b79a3fa9be_b.jpg" alt="img"></p><h4 id="jdk-1-8-hash方法源码" tabindex="-1"><a class="header-anchor" href="#jdk-1-8-hash方法源码" aria-hidden="true">#</a> JDK 1.8 hash方法源码</h4><p>JDK 1.8 的 hash 方法 相比于 JDK 1.7 hash 方法更加简化，但是原理不变。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token function">hash</span><span class="token punctuation">(</span><span class="token class-name">Object</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>

 <span class="token keyword">int</span> h<span class="token punctuation">;</span>

 <span class="token comment">// key.hashCode()：返回散列值也就是hashcode</span>
 <span class="token comment">// ^ ：按位异或</span>
 <span class="token comment">// &gt;&gt;&gt;:⽆符号右移，忽略符号位，空位都以0补⻬</span>

 <span class="token keyword">return</span> <span class="token punctuation">(</span>key <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> <span class="token punctuation">(</span>h <span class="token operator">=</span> key<span class="token punctuation">.</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">^</span> <span class="token punctuation">(</span>h <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">16</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是1.7的hash方法</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>static int hash(int h) {
 // This function ensures that hashCodes that differ only by
 // constant multiples at each bit position have a bounded
 // number of collisions (approximately 8 at default load factor).
 h ^= (h &gt;&gt;&gt; 20) ^ (h &gt;&gt;&gt; 12);
 return h ^ (h &gt;&gt;&gt; 7) ^ (h &gt;&gt;&gt; 4);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本文主要讲解jdk 1.8 版本的实现</p><h3 id="hashmap数据结构" tabindex="-1"><a class="header-anchor" href="#hashmap数据结构" aria-hidden="true">#</a> HashMap数据结构</h3><p>每一个节点是Node&lt;K,V&gt;表示</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>static class Node&lt;K,V&gt; implements Map.Entry&lt;K,V&gt; {
    final int hash;
    final K key;
    V value;
    Node&lt;K,V&gt; next;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Node是一个内部类，这里的key为键，value为值，next指向下一个元素，可以看出HashMap中的元素不是一个单纯的键值对，<strong>还包含下一个元素的引用（链表时使用）</strong>。</p><p>数据结构是数组 + 链表或者红黑树</p><p><strong>当hash冲突时候，以链表形式存在，如果链表长度大于8并且数组长度大于64时，转换成红黑树，长度小于6时再转换成链表。</strong></p><img src="http://img.xxfxpt.top/202112041719919.PNG" style="zoom:67%;"><h3 id="存储元素过程" tabindex="-1"><a class="header-anchor" href="#存储元素过程" aria-hidden="true">#</a> 存储元素过程</h3><p>1、计算出key的hash值</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h &gt;&gt;&gt; 16);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、初始化数组长度</p><p>默认数组长度是16，加载因子是0.7</p><p><strong>用数组容量大小乘以加载因子得到一个值，一旦数组中存储的元素个数超过该值就会调用rehash方法将数组容量增加到原来的两倍，专业术语叫做扩容</strong>.</p><p><strong>在做扩容的时候会生成一个新的数组，原来的所有数据需要重新计算哈希码值重新分配到新的数组，所以扩容的操作非常消耗性能.</strong></p><p>3、计算元素数组中下标</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>(n - 1) &amp; hash
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>n是数组长度</p><p>分为两种情况：</p><ul><li>当前位置没有元素直接把node节点放进去</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>tab[i] = newNode(hash, key, value, null);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>当前位置有元素</li></ul><p>如果key值相同，直接替换；不相同以链表或者红黑树存在</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node&lt;K,V&gt;[] tab; Node&lt;K,V&gt; p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) &amp; hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node&lt;K,V&gt; e; K k;
        //判断key是不是完全相同
        if (p.hash == hash &amp;&amp;
            ((k = p.key) == key || (key != null &amp;&amp; key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode&lt;K,V&gt;)p).putTreeVal(this, tab, hash, key, value);
        else {
            //遍历链表
            for (int binCount = 0; ; ++binCount) {
                //找到链表的尾节点
                if ((e = p.next) == null) {
                    //插入到链表尾节点
                    p.next = newNode(hash, key, value, null);
                    if (binCount &gt;= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        //红黑树
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &amp;&amp;
                    ((k = e.key) == key || (key != null &amp;&amp; key.equals(k))))
                    break;
                p = e;
            }
        }
        //key 相同时候替换旧值
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size &gt; threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么要转换成红黑树？</p><p>为链表中元素太多的时候会影响查找效率，所以当链表的元素个数达到8的时候使用链表存储就转变成了使用红黑树存储，原因就是<strong>红黑树是平衡二叉树，在查找性能方面比链表要高</strong>.</p><h3 id="hashmap-的长度为什么是2的次幂" tabindex="-1"><a class="header-anchor" href="#hashmap-的长度为什么是2的次幂" aria-hidden="true">#</a> HashMap 的长度为什么是2的次幂</h3><p>为了能让 HashMap 存取高效，尽量较少碰撞，也就是要尽量把数据分配均匀。Hash 值的范围值-2147483648到2147483647，前后加起来⼤概40亿的映射空间，只要哈希函数映射得比较均匀松散，一般应用是很难出现碰撞的。但问题是一个40亿长度的数组，内存是放不下的。所以这个散列值是不能直接拿来用的。用之前还要先做对数组的长度度取模运算，得到的余数才能⽤来要存放的位置也就是对应的数组下标。这个数组下标的计算⽅法是 (n - 1) &amp;hash 。（n代表数组长度）</p><p>我们首先可能会想到采用%取余的操作来实现。但是，重点来了：“取余(%)操作中如果除数是2的幂次则等价于与其除数减一的与(&amp;)操作（也就是说 hash%length==hash&amp;(length-1)的前提是 length 是2的 n 次方；）。” 并且采用二进制位操作 &amp;，相对于%能够提⾼运算效率，这就解释了 HashMap 的长度为什么是2的幂次方。</p><h3 id="新的entry节点在插入链表的时候-是怎么插入的" tabindex="-1"><a class="header-anchor" href="#新的entry节点在插入链表的时候-是怎么插入的" aria-hidden="true">#</a> 新的Entry节点在插入链表的时候，是怎么插入的？</h3><p>java8之前是头插法，就是说新来的值会取代原有的值，原有的值就顺推到链表中去。</p><p>我们现在往一个容量大小为2的put两个值，负载因子是0.75是不是我们在put第二个的时候就会进行resize？</p><p>2*0.75 = 1 所以插入第二个就要resize了。</p><p>现在我们要在容量为2的容器里面<strong>用不同线程</strong>插入A，B，C，假如我们在resize之前打个断点，那意味着数据都插入了但是还没resize那扩容前可能是这样的。</p><p>我们可以看到链表的指向A-&gt;B-&gt;C</p><p><strong>注意：A的下一个指针是指向B的</strong></p><p><img src="https://pic4.zhimg.com/80/v2-05ab942864bf71f93edf0e290e197b3f_1440w.jpg" alt="img"></p><p>因为resize的赋值方式，也就是使用了<strong>单链表的头插入方式，同一位置上新元素总会被放在链表的头部位置</strong>，在旧数组中同一条Entry链上的元素，通过重新计算索引位置后，有可能被放到了新数组的不同位置上。</p><p>就可能出现下面的情况，大家发现问题没有？</p><p>B的下一个指针指向了A</p><p><img src="http://img.xxfxpt.top/202112042233121.jpg" alt=""></p><p>一旦几个线程都调整完成，就可能出现环形链表</p><p><img src="http://img.xxfxpt.top/202112042222361.jpg" alt=""></p><p>如果这个时候去取值，出现了——Infinite Loop。</p><p><strong>使用头插</strong>会改变链表的上的顺序，但是如果<strong>使用尾插</strong>，在扩容时会保持链表元素原本的顺序，就不会出现链表成环的问题了。</p><p>就是说原本是A-&gt;B，在扩容后那个链表还是A-&gt;B</p><img src="http://img.xxfxpt.top/202112042220842.PNG" style="zoom:67%;"><p>jdk 1.7 在多线程操作HashMap时可能引起死循环，原因是扩容转移后前后链表顺序倒置，在转移过程中修改了原来链表中节点的引用关系。Java 8在同样的前提下并不会引起死循环，原因是扩容转移后前后链表顺序不变，保持之前节点的引用关系。</p><h2 id="get过程" tabindex="-1"><a class="header-anchor" href="#get过程" aria-hidden="true">#</a> get过程</h2><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>final Node&lt;K,V&gt; getNode(int hash, Object key) {
    Node&lt;K,V&gt;[] tab; Node&lt;K,V&gt; first, e; int n; K k;
    if ((tab = table) != null &amp;&amp; (n = tab.length) &gt; 0 &amp;&amp;
        (first = tab[(n - 1) &amp; hash]) != null) {
        if (first.hash == hash &amp;&amp; // always check first node
            ((k = first.key) == key || (key != null &amp;&amp; key.equals(k))))
            return first;
        if ((e = first.next) != null) {
            //从红黑树中查找
            if (first instanceof TreeNode)
                return ((TreeNode&lt;K,V&gt;)first).getTreeNode(hash, key);
            //循环链表中查找
            do {
                if (e.hash == hash &amp;&amp;
                    ((k = e.key) == key || (key != null &amp;&amp; key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最近整理一些书单，包括 编程语言、操作系统、计算机网络、系统架构、设计模式、程序员数学、测试、中间件 、前端开发、后台开发、网络编程、Linux使用及内核、求职面试、算法与数据结构、数据库、Redis等编程学习书籍。</p><p>Java部分</p><p><img src="https://pic2.zhimg.com/80/v2-265ab679e17576b8d83ebcc8381da491_1440w.png" alt=""></p><p>算法和数据结构</p><p><img src="https://pic4.zhimg.com/80/v2-340c74c67bbfba65b08abacb7b7f7693_1440w.png" alt=""></p><p>面经</p><p><img src="https://pic3.zhimg.com/80/v2-da4bebffca7f59314e642c1e03a33152_1440w.png" alt="img"></p><p>下载链接：https://pan.baidu.com/s/1KtEMLrLkGbnyyfzskAzcjw 提取码：0i8d</p>`,70),t=[l];function d(r,p){return n(),a("div",null,t)}const v=e(i,[["render",d],["__file","HashMap.html.vue"]]);export{v as default};
