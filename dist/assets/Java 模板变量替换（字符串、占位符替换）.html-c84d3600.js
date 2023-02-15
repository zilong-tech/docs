import{_ as t,W as p,X as e,Y as n,Z as o,a0 as c,a1 as s,F as l}from"./framework-2afc6763.js";const u={},i=s(`<p>1、<strong>org.apache.commons.text</strong></p><p>变量默认前缀是\${，后缀是}</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">&gt;</span></span>
    <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">&gt;</span></span>org<span class="token punctuation">.</span>apache<span class="token punctuation">.</span>pdfbox<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">&gt;</span>
    <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">&gt;</span></span>pdfbox<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">&gt;</span>
    <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">&gt;</span></span><span class="token number">2.0</span><span class="token number">.12</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Map valuesMap = new HashMap();
valuesMap.put(&quot;code&quot;, 1234);
String templateString = &quot;验证码:\${code},您正在登录管理后台，5分钟内输入有效。&quot;;
StringSubstitutor sub = new StringSubstitutor(valuesMap);
String content= sub.replace(templateString);
System.out.println(content);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>验证码:1234,您正在登录管理后台，5分钟内输入有效。</p></blockquote><p>修改前缀、后缀</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Map</span> valuesMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
valuesMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;code&quot;</span><span class="token punctuation">,</span> <span class="token number">1234</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> templateString <span class="token operator">=</span> <span class="token string">&quot;验证码:[code],您正在登录管理后台，5分钟内输入有效。&quot;</span><span class="token punctuation">;</span>
<span class="token class-name">StringSubstitutor</span> sub <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringSubstitutor</span><span class="token punctuation">(</span>valuesMap<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//修改前缀、后缀</span>
sub<span class="token punctuation">.</span><span class="token function">setVariablePrefix</span><span class="token punctuation">(</span><span class="token string">&quot;[&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
sub<span class="token punctuation">.</span><span class="token function">setVariableSuffix</span><span class="token punctuation">(</span><span class="token string">&quot;]&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> content<span class="token operator">=</span> sub<span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span>templateString<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、<strong>org.springframework.expression</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
<span class="token class-name">String</span> smsTemplate <span class="token operator">=</span> <span class="token string">&quot;验证码:#{[code]},您正在登录管理后台，5分钟内输入有效。&quot;</span><span class="token punctuation">;</span>
<span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> params <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
params<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;code&quot;</span><span class="token punctuation">,</span> <span class="token number">12345</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token punctuation">;</span>

<span class="token class-name">ExpressionParser</span> parser <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SpelExpressionParser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">TemplateParserContext</span> parserContext <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TemplateParserContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> content <span class="token operator">=</span> parser<span class="token punctuation">.</span><span class="token function">parseExpression</span><span class="token punctuation">(</span>smsTemplate<span class="token punctuation">,</span>parserContext<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span>params<span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>验证码:12345,您正在登录管理后台，5分钟内输入有效。</p></blockquote><p>ExpressionParser是简单的用java编写的表达式解析器，官方文档：</p>`,11),r={href:"https://links.jianshu.com/go?to=http%3A%2F%2Fdocs.spring.io%2Fspring%2Fdocs%2Fcurrent%2Fspring-framework-reference%2Fhtml%2Fexpressions.html",target:"_blank",rel:"noopener noreferrer"},d=s(`<p><strong>3、java.text.MessageFormat</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> params <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token string">&quot;1234&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;5&quot;</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> msg <span class="token operator">=</span> <span class="token class-name">MessageFormat</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;验证码:{0},您正在登录管理后台，{1}分钟内输入有效。&quot;</span><span class="token punctuation">,</span> params<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>验证码:1234,您正在登录管理后台，10分钟内输入有效。</p></blockquote><p><strong>4、java.lang.String</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> s <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;My name is %s. I am %d.&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Tom&quot;</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>常用的占位符含义:</p><table><thead><tr><th>转换符</th><th>详细说明</th><th>示例</th></tr></thead><tbody><tr><td>%s</td><td>字符串类型</td><td>“喜欢请收藏”</td></tr><tr><td>%c</td><td>字符类型</td><td>‘m’</td></tr><tr><td>%b</td><td>布尔类型</td><td>true</td></tr><tr><td>%d</td><td>整数类型（十进制）</td><td>88</td></tr><tr><td>%x</td><td>整数类型（十六进制）</td><td>FF</td></tr><tr><td>%o</td><td>整数类型（八进制）</td><td>77</td></tr><tr><td>%f</td><td>浮点类型</td><td>8.888</td></tr><tr><td>%a</td><td>十六进制浮点类型</td><td>FF.35AE</td></tr><tr><td>%e</td><td>指数类型</td><td>9.38e+5</td></tr><tr><td>%g</td><td>通用浮点类型（f和e类型中较短的）</td><td>不举例(基本用不到)</td></tr><tr><td>%h</td><td>散列码</td><td>不举例(基本用不到)</td></tr><tr><td>%%</td><td>百分比类型</td><td>％(%特殊字符%%才能显示%)</td></tr><tr><td>%n</td><td>换行符</td><td>不举例(基本用不到)</td></tr><tr><td>%tx</td><td>日期与时间类型（x代表不同的日期与时间转换符)</td><td>不举例(基本用不到)</td></tr></tbody></table>`,7);function k(m,v){const a=l("ExternalLinkIcon");return p(),e("div",null,[i,n("p",null,[n("a",r,[o("http://docs.spring.io/spring/docs/current/spring-framework-reference/html/expressions.html"),c(a)])]),d])}const b=t(u,[["render",k],["__file","Java 模板变量替换（字符串、占位符替换）.html.vue"]]);export{b as default};
