import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},p=e(`<div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Description: 获取springboot 上下文、注入bean工具类
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * Create on 2018/11/23
 *
 * <span class="token keyword">@author</span>
 */</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpringBeanUtil</span> <span class="token keyword">implements</span> <span class="token class-name">ApplicationContextAware</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 上下文对象实例
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ApplicationContext</span> applicationContext<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setApplicationContext</span><span class="token punctuation">(</span><span class="token class-name">ApplicationContext</span> applicationContext<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">BeansException</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>applicationContext <span class="token operator">=</span> applicationContext<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token doc-comment comment">/**
     * 获取applicationContext
     *
     * <span class="token keyword">@return</span>
     *      applicationContext
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ApplicationContext</span> <span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> applicationContext<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 通过name获取 Bean.
     *
     * <span class="token keyword">@param</span> <span class="token parameter">name</span>
     *          bean name
     * <span class="token keyword">@return</span>
     *          bean
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> <span class="token function">getBean</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getBean</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 通过class获取Bean.
     * <span class="token keyword">@param</span> <span class="token parameter">clazz</span>
     *          class
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span>
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">T</span> <span class="token function">getBean</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> clazz<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getBean</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 通过name,以及Clazz返回指定的Bean
     * <span class="token keyword">@param</span> <span class="token parameter">name</span>
     *          bean name
     * <span class="token keyword">@param</span> <span class="token parameter">clazz</span>
     *          class
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span>
     * <span class="token keyword">@return</span>
     *          bean
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">T</span> <span class="token function">getBean</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> clazz<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getBean</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> clazz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),c=[p];function i(l,o){return s(),a("div",null,c)}const d=n(t,[["render",i],["__file","Spring在代码中获取bean.html.vue"]]);export{d as default};
