import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},p=e(`<h3 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h3><p>在微服务中，网关作为流量的入口，所以网关上处理授权鉴权成为了不二的选择。一般做法是：授权服务器生成令牌, 所有请求统一在网关层验证，判断权限等操作；API网关作为OAuth2.0的资源服务器角色，实现接入客户端权限拦截、令牌解析并转发当前登录用户信息给微服务，这样下游微服务就不需要关心令牌格式解析以及OAuth2.0相关机制了。</p><p>流程如下：</p><p><img src="http://img.xxfxpt.top/202205032101918.png" alt=""></p><h3 id="搭建微服务授权中心-auth" tabindex="-1"><a class="header-anchor" href="#搭建微服务授权中心-auth" aria-hidden="true">#</a> <strong>搭建微服务授权中心 auth</strong></h3><p>本文使用 JWT非对称加密（公钥私钥）</p><h4 id="什么是jwt" tabindex="-1"><a class="header-anchor" href="#什么是jwt" aria-hidden="true">#</a> <strong>什么是JWT</strong></h4><p>JSON Web Token（JWT）是一个开放的行业标准（RFC 7519），它定义了一种简介的、自包含的协议格式，用于在通信双方传递json对象，传递的信息经过数字签名可以被验证和信任。JWT可以使用HMAC算法或使用RSA的公钥/私钥对来签名，防止被篡改。 官网： https://jwt.io/ 标准： https://tools.ietf.org/html/rfc7519</p><p>JWT令牌的优点：</p><ol><li>jwt基于json，非常方便解析。</li><li>可以在令牌中自定义丰富的内容，易扩展。</li><li>通过非对称加密算法及数字签名技术，JWT防止篡改，安全性高。</li><li>资源服务使用JWT可不依赖授权服务即可完成授权。</li></ol><p>缺点：</p><p>​ JWT令牌较长，占存储空间比较大。</p><p><strong>JWT组成</strong></p><p>一个JWT实际上就是一个字符串，它由三部分组成，头部（header）、载荷（payload）与签名（signature）。</p><p><img src="http://img.xxfxpt.top/202205031621359.png" alt=""></p><p><strong>头部（header）</strong></p><p>头部用于描述关于该JWT的最基本的信息：类型（即JWT）以及签名所用的算法（如HMACSHA256或RSA）等。</p><p>这也可以被表示成一个JSON对象：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>  <span class="token property">&quot;alg&quot;</span><span class="token operator">:</span> <span class="token string">&quot;HS256&quot;</span><span class="token punctuation">,</span>  <span class="token property">&quot;typ&quot;</span><span class="token operator">:</span> <span class="token string">&quot;JWT&quot;</span> <span class="token punctuation">}</span>              
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后将头部进行base64加密（该加密是可以对称解密的),构成了第一部分:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9              

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>载荷（payload）</strong></p><p>第二部分是载荷，就是存放有效信息的地方。这个名字像是特指飞机上承载的货品，这些有效信息包含三个部分：</p><ul><li>标准中注册的声明（建议但不强制使用）</li></ul><p><strong>iss</strong>: jwt签发者</p><p><strong>sub</strong>: jwt所面向的用户</p><p><strong>aud</strong>: 接收jwt的一方</p><p><strong>exp</strong>: jwt的过期时间，这个过期时间必须要大于签发时间</p><p><strong>nbf</strong>: 定义在什么时间之前，该jwt都是不可用的.</p><p><strong>iat</strong>: jwt的签发时间</p><p><strong>jti</strong>: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。</p><ul><li>公共的声明 公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.</li><li>私有的声明 私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。</li></ul><p>定义一个payload：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>  <span class="token property">&quot;sub&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1234567890&quot;</span><span class="token punctuation">,</span>  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;John Doe&quot;</span><span class="token punctuation">,</span>  <span class="token property">&quot;iat&quot;</span><span class="token operator">:</span> <span class="token number">1516239022</span> <span class="token punctuation">}</span>              
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后将其进行base64加密，得到Jwt的第二部分:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ              
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>签名（signature）</strong></p><p>jwt的第三部分是一个签证信息，这个签证信息由三部分组成：</p><ul><li>header (base64后的)</li><li>payload (base64后的)</li><li>secret(盐，一定要保密）</li></ul><p>这个部分需要base64加密后的header和base64加密后的payload使用.连接组成的字符串，然后通过header中声明的加密方式进行加盐secret组合加密，然后就构成了jwt的第三部分:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> encodedString <span class="token operator">=</span> <span class="token function">base64UrlEncode</span><span class="token punctuation">(</span>header<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&#39;.&#39;</span> <span class="token operator">+</span> <span class="token function">base64UrlEncode</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span> 
<span class="token keyword">var</span> signature <span class="token operator">=</span> <span class="token constant">HMACSHA256</span><span class="token punctuation">(</span>encodedString<span class="token punctuation">,</span> <span class="token string">&#39;test&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// khA7TNYc7_0iELcDyTc7gHBZ_xfIcgbfpzUNWwQtzME       </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>将这三部分用.连接成一个完整的字符串,构成了最终的jwt:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意：secret是保存在服务器端的，jwt的签发生成也是在服务器端的，secret就是用来进行jwt的签发和jwt的验证，所以，它就是你服务端的私钥，在任何场景都不应该流露出去。一旦客户端得知这个secret, 那就意味着客户端是可以自我签发jwt了。</p><p><strong>生成jks 证书文件</strong></p><p>使用jdk自动的工具生成</p><p>命令格式</p><p>keytool</p><p>-genkeypair 生成密钥对</p><p>-alias jwt(别名)</p><p>-keypass 123456(别名密码)</p><p>-keyalg RSA(生证书的算法名称，RSA是一种非对称加密算法)</p><p>-keysize 1024(密钥长度,证书大小)</p><p>-validity 365(证书有效期，天单位)</p><p>-keystore D:/jwt/jwt.jks(指定生成证书的位置和证书名称)</p><p>-storepass 123456(获取keystore信息的密码)</p><p>-storetype (指定密钥仓库类型)</p><p>使用 &quot;keytool -help&quot; 获取所有可用命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>keytool <span class="token parameter variable">-genkeypair</span> <span class="token parameter variable">-alias</span> jwt <span class="token parameter variable">-keyalg</span> RSA <span class="token parameter variable">-keysize</span> <span class="token number">2048</span> <span class="token parameter variable">-keystore</span> D:/jwt.jks              
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>将生成的jwt.jks文件放到授权服务器的resource目录下</p><p><img src="http://img.xxfxpt.top/202205031642325.png" alt=""></p><p>查看公钥信息</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>keytool <span class="token parameter variable">-list</span> <span class="token parameter variable">-rfc</span> <span class="token parameter variable">--keystore</span> jwt.jks  <span class="token operator">|</span> openssl x509 <span class="token parameter variable">-inform</span> pem <span class="token parameter variable">-pubkey</span>              

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>引入依赖</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- spring security oauth2--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-oauth2&lt;/artifactId&gt;
&lt;/dependency&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置授权服务器" tabindex="-1"><a class="header-anchor" href="#配置授权服务器" aria-hidden="true">#</a> <strong>配置授权服务器</strong></h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 配置授权服务器
 */</span>
<span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@EnableAuthorizationServer</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AuthorizationServerConfig</span> <span class="token keyword">extends</span> <span class="token class-name">AuthorizationServerConfigurerAdapter</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">DataSource</span> dataSource<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token annotation punctuation">@Qualifier</span><span class="token punctuation">(</span><span class="token string">&quot;jwtTokenStore&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">TokenStore</span> tokenStore<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">JwtAccessTokenConverter</span> jwtAccessTokenConverter<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">DemoUserDetailService</span> userDetailService<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">AuthenticationManager</span> authenticationManagerBean<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">DemoTokenEnhancer</span> tokenEnhancer<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">PasswordEncoder</span> <span class="token function">passwordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">BCryptPasswordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 基于DB模式配置授权服务器存储第三方客户端的信息
     * <span class="token keyword">@param</span> <span class="token parameter">clients</span>
     * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">Exception</span></span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">ClientDetailsServiceConfigurer</span> clients<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">// 第三方信息的存储   基于jdbc</span>
        clients<span class="token punctuation">.</span><span class="token function">withClientDetails</span><span class="token punctuation">(</span><span class="token function">clientDetailsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">ClientDetailsService</span> <span class="token function">clientDetailsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">JdbcClientDetailsService</span><span class="token punctuation">(</span>dataSource<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthorizationServerEndpointsConfigurer</span> endpoints<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">//配置JWT的内容增强器</span>
        <span class="token class-name">TokenEnhancerChain</span> enhancerChain <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TokenEnhancerChain</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">TokenEnhancer</span><span class="token punctuation">&gt;</span></span> delegates <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        delegates<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>tokenEnhancer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        delegates<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>jwtAccessTokenConverter<span class="token punctuation">)</span><span class="token punctuation">;</span>
        enhancerChain<span class="token punctuation">.</span><span class="token function">setTokenEnhancers</span><span class="token punctuation">(</span>delegates<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">//使用密码模式需要配置</span>
        endpoints<span class="token punctuation">.</span><span class="token function">authenticationManager</span><span class="token punctuation">(</span>authenticationManagerBean<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">reuseRefreshTokens</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>  <span class="token comment">//refresh_token是否重复使用</span>
                <span class="token punctuation">.</span><span class="token function">userDetailsService</span><span class="token punctuation">(</span>userDetailService<span class="token punctuation">)</span> <span class="token comment">//刷新令牌授权包含对用户信息的检查</span>
                <span class="token punctuation">.</span><span class="token function">tokenStore</span><span class="token punctuation">(</span>tokenStore<span class="token punctuation">)</span>  <span class="token comment">//指定token存储策略是jwt</span>
                <span class="token punctuation">.</span><span class="token function">accessTokenConverter</span><span class="token punctuation">(</span>jwtAccessTokenConverter<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">tokenEnhancer</span><span class="token punctuation">(</span>enhancerChain<span class="token punctuation">)</span> <span class="token comment">//配置tokenEnhancer</span>
                <span class="token punctuation">.</span><span class="token function">allowedTokenEndpointRequestMethods</span><span class="token punctuation">(</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">GET</span><span class="token punctuation">,</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">POST</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//支持GET,POST请求</span>
    <span class="token punctuation">}</span>
    
    <span class="token doc-comment comment">/**
     * 授权服务器安全配置
     * <span class="token keyword">@param</span> <span class="token parameter">security</span>
     * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">Exception</span></span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthorizationServerSecurityConfigurer</span> security<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">//第三方客户端校验token需要带入 clientId 和clientSecret来校验</span>
        security<span class="token punctuation">.</span><span class="token function">checkTokenAccess</span><span class="token punctuation">(</span><span class="token string">&quot;isAuthenticated()&quot;</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">tokenKeyAccess</span><span class="token punctuation">(</span><span class="token string">&quot;isAuthenticated()&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//来获取我们的tokenKey需要带入clientId,clientSecret</span>
        
        <span class="token comment">//允许表单认证</span>
        security<span class="token punctuation">.</span><span class="token function">allowFormAuthenticationForClients</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在oauth_client_details表中添加第三方客户端信息（client_id client_secret scope等等）</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>CREATE TABLE \`oauth_client_details\`  (
  \`client_id\` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  \`resource_ids\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`client_secret\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`scope\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`authorized_grant_types\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`web_server_redirect_uri\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`authorities\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`access_token_validity\` int(11) NULL DEFAULT NULL,
  \`refresh_token_validity\` int(11) NULL DEFAULT NULL,
  \`additional_information\` varchar(4096) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`autoapprove\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (\`client_id\`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

INSERT INTO \`oauth_client_details\` VALUES (&#39;client&#39;, NULL, &#39;$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6&#39;, &#39;all&#39;, &#39;authorization_code,password,refresh_token&#39;, &#39;http://www.baidu.com&#39;, NULL, 3600, 864000, NULL, NULL);
INSERT INTO \`oauth_client_details\` VALUES (&#39;gateway&#39;, NULL, &#39;$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6&#39;, &#39;all&#39;, &#39;authorization_code,password,refresh_token&#39;, NULL, NULL, 3600, 864000, NULL, NULL);
INSERT INTO \`oauth_client_details\` VALUES (&#39;member&#39;, NULL, &#39;$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6&#39;, &#39;read,write&#39;, &#39;password,refresh_token&#39;, NULL, NULL, 3600, 864000, NULL, NULL);

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置springsecurity" tabindex="-1"><a class="header-anchor" href="#配置springsecurity" aria-hidden="true">#</a> <strong>配置SpringSecurity</strong></h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WebSecurityConfig</span> <span class="token keyword">extends</span> <span class="token class-name">WebSecurityConfigurerAdapter</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">DemoUserDetailService</span> userDetailService<span class="token punctuation">;</span>



    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">HttpSecurity</span> http<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        http<span class="token punctuation">.</span><span class="token function">formLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">permitAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">authorizeRequests</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">antMatchers</span><span class="token punctuation">(</span><span class="token string">&quot;/oauth/**&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">permitAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">anyRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">authenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">logout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">permitAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">csrf</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthenticationManagerBuilder</span> auth<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        auth<span class="token punctuation">.</span><span class="token function">userDetailsService</span><span class="token punctuation">(</span>userDetailService<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token annotation punctuation">@Bean</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">AuthenticationManager</span> <span class="token function">authenticationManagerBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">// oauth2 密码模式需要拿到这个bean</span>
        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">authenticationManagerBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">PasswordEncoder</span> <span class="token function">passwordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">BCryptPasswordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>获取会员信息，此处通过feign从member获取会员信息</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
<span class="token annotation punctuation">@Service</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoUserDetailService</span> <span class="token keyword">implements</span> <span class="token class-name">UserDetailsService</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">UmsMemberFeignService</span> umsMemberFeignService<span class="token punctuation">;</span>


    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">UserDetails</span> <span class="token function">loadUserByUsername</span><span class="token punctuation">(</span><span class="token class-name">String</span> username<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">UsernameNotFoundException</span> <span class="token punctuation">{</span>


        <span class="token comment">// 加载用户信息</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>username<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;用户登陆用户名为空:{}&quot;</span><span class="token punctuation">,</span> username<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">UsernameNotFoundException</span><span class="token punctuation">(</span><span class="token string">&quot;用户名不能为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        <span class="token class-name">UmsMember</span> umsMember <span class="token operator">=</span> <span class="token function">getByUsername</span><span class="token punctuation">(</span>username<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> umsMember<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;根据用户名没有查询到对应的用户信息:{}&quot;</span><span class="token punctuation">,</span> username<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;根据用户名:{}获取用户登陆信息:{}&quot;</span><span class="token punctuation">,</span> username<span class="token punctuation">,</span> umsMember<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">// 会员信息的封装 implements UserDetails</span>
        <span class="token class-name">MemberDetails</span> memberDetails <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MemberDetails</span><span class="token punctuation">(</span>umsMember<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token keyword">return</span> memberDetails<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>



    <span class="token keyword">public</span> <span class="token class-name">UmsMember</span> <span class="token function">getByUsername</span><span class="token punctuation">(</span><span class="token class-name">String</span> username<span class="token punctuation">)</span> <span class="token punctuation">{</span>


        <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">UmsMember</span><span class="token punctuation">&gt;</span></span> memberResult <span class="token operator">=</span> umsMemberFeignService<span class="token punctuation">.</span><span class="token function">loadUserByUsername</span><span class="token punctuation">(</span>username<span class="token punctuation">)</span><span class="token punctuation">;</span>


        <span class="token keyword">return</span> memberResult<span class="token punctuation">.</span><span class="token function">getData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token annotation punctuation">@FeignClient</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;member&quot;</span><span class="token punctuation">,</span>path<span class="token operator">=</span><span class="token string">&quot;/member/center&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">UmsMemberFeignService</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/loadUmsMember&quot;</span><span class="token punctuation">)</span>
    <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">UmsMember</span><span class="token punctuation">&gt;</span></span> <span class="token function">loadUserByUsername</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestParam</span><span class="token punctuation">(</span><span class="token string">&quot;username&quot;</span><span class="token punctuation">)</span> <span class="token class-name">String</span> username<span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jwt配置" tabindex="-1"><a class="header-anchor" href="#jwt配置" aria-hidden="true">#</a> JWT配置</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@EnableConfigurationProperties</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token class-name">JwtCAProperties</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">JwtTokenStoreConfig</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">JwtCAProperties</span> jwtCAProperties<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">TokenStore</span> <span class="token function">jwtTokenStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">JwtTokenStore</span><span class="token punctuation">(</span><span class="token function">jwtAccessTokenConverter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">DemoTokenEnhancer</span> <span class="token function">demoTokenEnhancer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">DemoTokenEnhancer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">JwtAccessTokenConverter</span> <span class="token function">jwtAccessTokenConverter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token class-name">JwtAccessTokenConverter</span> accessTokenConverter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">JwtAccessTokenConverter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//配置JWT使用的秘钥 非对称加密</span>
        accessTokenConverter<span class="token punctuation">.</span><span class="token function">setKeyPair</span><span class="token punctuation">(</span><span class="token function">keyPair</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> accessTokenConverter<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    

    
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">KeyPair</span> <span class="token function">keyPair</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">KeyStoreKeyFactory</span> keyStoreKeyFactory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KeyStoreKeyFactory</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ClassPathResource</span><span class="token punctuation">(</span>jwtCAProperties<span class="token punctuation">.</span><span class="token function">getKeyPairName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> jwtCAProperties<span class="token punctuation">.</span><span class="token function">getKeyPairSecret</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toCharArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> keyStoreKeyFactory<span class="token punctuation">.</span><span class="token function">getKeyPair</span><span class="token punctuation">(</span>jwtCAProperties<span class="token punctuation">.</span><span class="token function">getKeyPairAlias</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> jwtCAProperties<span class="token punctuation">.</span><span class="token function">getKeyPairStoreSecret</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toCharArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@ConfigurationProperties</span><span class="token punctuation">(</span>prefix <span class="token operator">=</span> <span class="token string">&quot;demo.jwt&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">JwtCAProperties</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 证书名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> keyPairName<span class="token punctuation">;</span>


    <span class="token doc-comment comment">/**
     * 证书别名
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> keyPairAlias<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 证书私钥
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> keyPairSecret<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 证书存储密钥
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> keyPairStoreSecret<span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>yml中添加jwt配置</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">demo</span><span class="token punctuation">:</span>
  <span class="token key atrule">jwt</span><span class="token punctuation">:</span>
    <span class="token key atrule">keyPairName</span><span class="token punctuation">:</span> jwt.jks
    <span class="token key atrule">keyPairAlias</span><span class="token punctuation">:</span> jwt
    <span class="token key atrule">keyPairSecret</span><span class="token punctuation">:</span> <span class="token number">123123</span>
    <span class="token key atrule">keyPairStoreSecret</span><span class="token punctuation">:</span> <span class="token number">123123</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="扩展jwt中的存储内容" tabindex="-1"><a class="header-anchor" href="#扩展jwt中的存储内容" aria-hidden="true">#</a> 扩展JWT中的存储内容</h4><p>有时候我们需要扩展JWT中存储的内容，根据自己业务添加字段到Jwt中。 继承TokenEnhancer实现一个JWT内容增强器</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoTokenEnhancer</span> <span class="token keyword">implements</span> <span class="token class-name">TokenEnhancer</span> <span class="token punctuation">{</span>


    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">OAuth2AccessToken</span> <span class="token function">enhance</span><span class="token punctuation">(</span><span class="token class-name">OAuth2AccessToken</span> accessToken<span class="token punctuation">,</span> <span class="token class-name">OAuth2Authentication</span> authentication<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token class-name">MemberDetails</span> memberDetails <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">MemberDetails</span><span class="token punctuation">)</span> authentication<span class="token punctuation">.</span><span class="token function">getPrincipal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">final</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> additionalInfo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">final</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> retMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//todo 可以根据自己的业务需要 进行添加字段</span>
        additionalInfo<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;memberId&quot;</span><span class="token punctuation">,</span>memberDetails<span class="token punctuation">.</span><span class="token function">getUmsMember</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        additionalInfo<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;nickName&quot;</span><span class="token punctuation">,</span>memberDetails<span class="token punctuation">.</span><span class="token function">getUmsMember</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getNickname</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        retMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;additionalInfo&quot;</span><span class="token punctuation">,</span>additionalInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">DefaultOAuth2AccessToken</span><span class="token punctuation">)</span> accessToken<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setAdditionalInformation</span><span class="token punctuation">(</span>retMap<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">return</span> accessToken<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置资源服务器" tabindex="-1"><a class="header-anchor" href="#配置资源服务器" aria-hidden="true">#</a> <strong>配置资源服务器</strong></h4><p>这个配置是为了测试，实际中可以省略</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@EnableResourceServer</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TulingResourceServerConfig</span>  <span class="token keyword">extends</span> <span class="token class-name">ResourceServerConfigurerAdapter</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">HttpSecurity</span> http<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        http<span class="token punctuation">.</span><span class="token function">authorizeRequests</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">anyRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">authenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@RestController</span>
<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/user&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserController</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/getCurrentUser&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">getCurrentUser</span><span class="token punctuation">(</span><span class="token class-name">Authentication</span> authentication<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> authentication<span class="token punctuation">.</span><span class="token function">getPrincipal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="通过密码模式测试获取token" tabindex="-1"><a class="header-anchor" href="#通过密码模式测试获取token" aria-hidden="true">#</a> 通过密码模式测试获取token</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>http://localhost:9999/oauth/token?username=test&amp;password=test&amp;grant_type=password&amp;client_id=member&amp;client_secret=123123&amp;scope=read
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="http://img.xxfxpt.top/202205031651985.png" alt=""></p><h4 id="获取token-key" tabindex="-1"><a class="header-anchor" href="#获取token-key" aria-hidden="true">#</a> 获取token_key</h4><p><img src="http://img.xxfxpt.top/202205031652273.png" alt=""></p><h4 id="测试携带token访问资源" tabindex="-1"><a class="header-anchor" href="#测试携带token访问资源" aria-hidden="true">#</a> 测试携带token访问资源</h4><p><img src="http://img.xxfxpt.top/202205031656594.png" alt=""></p><p>也可以请求头配置Authorization</p><p>​ <img src="https://note.youdao.com/yws/public/resource/7b3179e6fa5d39fb758bb4677fb7e2df/xmlnote/F59CE2C295394F0C806CAE038C520E7E/16192" alt="0"></p><h4 id="校验token" tabindex="-1"><a class="header-anchor" href="#校验token" aria-hidden="true">#</a> 校验token</h4><p><img src="http://img.xxfxpt.top/202205031658873.png" alt=""></p><h3 id="配置网关服务" tabindex="-1"><a class="header-anchor" href="#配置网关服务" aria-hidden="true">#</a> 配置网关服务</h3><p>主要流程：</p><p>网关在启动时候，调用http://auth/oauth/token_key 获取公钥</p><p>1.过滤不需要认证的url,比如/oauth/**</p><ol start="2"><li>获取token ：从请求头中解析 Authorization value: bearer xxxxxxx 或者从请求参数中解析 access_token</li><li>校验token ：拿到token后，通过公钥（需要从授权服务获取公钥）校验 ， 校验失败或超时抛出异常</li><li>校验通过后，从token中获取的用户登录信息存储到请求头中</li></ol><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8888</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> gateway
  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">nacos</span><span class="token punctuation">:</span>
      <span class="token key atrule">discovery</span><span class="token punctuation">:</span>
        <span class="token key atrule">server-addr</span><span class="token punctuation">:</span> 127.0.0.1<span class="token punctuation">:</span><span class="token number">8848</span>
        <span class="token key atrule">namespace</span><span class="token punctuation">:</span> 3ce28365<span class="token punctuation">-</span>5914<span class="token punctuation">-</span>4a66<span class="token punctuation">-</span>9fc7<span class="token punctuation">-</span>03d630fbf400

    <span class="token key atrule">gateway</span><span class="token punctuation">:</span>
      <span class="token key atrule">discovery</span><span class="token punctuation">:</span>
        <span class="token key atrule">locator</span><span class="token punctuation">:</span>
          <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">routes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> user
        <span class="token key atrule">uri</span><span class="token punctuation">:</span> lb<span class="token punctuation">:</span>//user
        <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> Path=/member/<span class="token important">**</span><span class="token punctuation">,</span>/sso/<span class="token important">**</span>
      <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> auth
        <span class="token key atrule">uri</span><span class="token punctuation">:</span> lb<span class="token punctuation">:</span>//auth
        <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> Path=/oauth/<span class="token important">**</span>

<span class="token key atrule">demo</span><span class="token punctuation">:</span>
  <span class="token key atrule">gateway</span><span class="token punctuation">:</span>
    <span class="token key atrule">shouldSkipUrls</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> /oauth/<span class="token important">**</span>
    <span class="token punctuation">-</span> /sso/<span class="token important">**</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     &lt;!--添加jwt相关的包--&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
            &lt;artifactId&gt;jjwt-api&lt;/artifactId&gt;
            &lt;version&gt;0.10.5&lt;/version&gt;
        &lt;/dependency&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
            &lt;artifactId&gt;jjwt-impl&lt;/artifactId&gt;
            &lt;version&gt;0.10.5&lt;/version&gt;
            &lt;scope&gt;runtime&lt;/scope&gt;
        &lt;/dependency&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
            &lt;artifactId&gt;jjwt-jackson&lt;/artifactId&gt;
            &lt;version&gt;0.10.5&lt;/version&gt;
            &lt;scope&gt;runtime&lt;/scope&gt;
        &lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="全局过滤器进行权限的校验拦截" tabindex="-1"><a class="header-anchor" href="#全局过滤器进行权限的校验拦截" aria-hidden="true">#</a> 全局过滤器进行权限的校验拦截</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token annotation punctuation">@Order</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@EnableConfigurationProperties</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token class-name">NotAuthUrlProperties</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AuthenticationFilter</span> <span class="token keyword">implements</span> <span class="token class-name">GlobalFilter</span><span class="token punctuation">,</span> <span class="token class-name">InitializingBean</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * jwt的公钥,需要网关启动,远程调用认证中心去获取公钥
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">PublicKey</span> publicKey<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RestTemplate</span> restTemplate<span class="token punctuation">;</span>
    
    <span class="token doc-comment comment">/**
     * 请求各个微服务 不需要用户认证的URL
     */</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">NotAuthUrlProperties</span> notAuthUrlProperties<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Mono</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">&gt;</span></span> <span class="token function">filter</span><span class="token punctuation">(</span><span class="token class-name">ServerWebExchange</span> exchange<span class="token punctuation">,</span> <span class="token class-name">GatewayFilterChain</span> chain<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//1.过滤不需要认证的url,比如/oauth/**</span>
        <span class="token class-name">String</span> currentUrl <span class="token operator">=</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getURI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
        <span class="token comment">//过滤不需要认证的url</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">shouldSkip</span><span class="token punctuation">(</span>currentUrl<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">//log.info(&quot;跳过认证的URL:{}&quot;,currentUrl);</span>
            <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">//log.info(&quot;需要认证的URL:{}&quot;,currentUrl);</span>
        
    
        <span class="token comment">//2. 获取token</span>
        <span class="token comment">// 从请求头中解析 Authorization  value:  bearer xxxxxxx</span>
        <span class="token comment">// 或者从请求参数中解析 access_token</span>
        <span class="token comment">//第一步:解析出我们Authorization的请求头  value为: “bearer XXXXXXXXXXXXXX”</span>
        <span class="token class-name">String</span> authHeader <span class="token operator">=</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getFirst</span><span class="token punctuation">(</span><span class="token string">&quot;Authorization&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
        <span class="token comment">//第二步:判断Authorization的请求头是否为空</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>authHeader<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;需要认证的url,请求头为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">GateWayException</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span><span class="token constant">AUTHORIZATION_HEADER_IS_EMPTY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    
        <span class="token comment">//3. 校验token</span>
        <span class="token comment">// 拿到token后，通过公钥（需要从授权服务获取公钥）校验</span>
        <span class="token comment">// 校验失败或超时抛出异常</span>
        <span class="token comment">//第三步 校验我们的jwt 若jwt不对或者超时都会抛出异常</span>
        <span class="token class-name">Claims</span> claims <span class="token operator">=</span> <span class="token class-name">JwtUtils</span><span class="token punctuation">.</span><span class="token function">validateJwtToken</span><span class="token punctuation">(</span>authHeader<span class="token punctuation">,</span>publicKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    
        <span class="token comment">//4. 校验通过后，从token中获取的用户登录信息存储到请求头中</span>
        <span class="token comment">//第四步 把从jwt中解析出来的 用户登陆信息存储到请求头中</span>
        <span class="token class-name">ServerWebExchange</span> webExchange <span class="token operator">=</span> <span class="token function">wrapHeader</span><span class="token punctuation">(</span>exchange<span class="token punctuation">,</span>claims<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>webExchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">private</span> <span class="token class-name">ServerWebExchange</span> <span class="token function">wrapHeader</span><span class="token punctuation">(</span><span class="token class-name">ServerWebExchange</span> serverWebExchange<span class="token punctuation">,</span><span class="token class-name">Claims</span> claims<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        
        <span class="token class-name">String</span> loginUserInfo <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>claims<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">//log.info(&quot;jwt的用户信息:{}&quot;,loginUserInfo);</span>
        
        <span class="token class-name">String</span> memberId <span class="token operator">=</span> claims<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;additionalInfo&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Map</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;memberId&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token class-name">String</span> nickName <span class="token operator">=</span> claims<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;additionalInfo&quot;</span><span class="token punctuation">,</span><span class="token class-name">Map</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;nickName&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">//向headers中放文件，记得build</span>
        <span class="token class-name">ServerHttpRequest</span> request <span class="token operator">=</span> serverWebExchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">mutate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token string">&quot;username&quot;</span><span class="token punctuation">,</span>claims<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;user_name&quot;</span><span class="token punctuation">,</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token string">&quot;memberId&quot;</span><span class="token punctuation">,</span>memberId<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token string">&quot;nickName&quot;</span><span class="token punctuation">,</span>nickName<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">//将现在的request 变成 change对象</span>
        <span class="token keyword">return</span> serverWebExchange<span class="token punctuation">.</span><span class="token function">mutate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">request</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">shouldSkip</span><span class="token punctuation">(</span><span class="token class-name">String</span> currentUrl<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//路径匹配器(简介SpringMvc拦截器的匹配器)</span>
        <span class="token comment">//比如/oauth/** 可以匹配/oauth/token    /oauth/check_token等</span>
        <span class="token class-name">PathMatcher</span> pathMatcher <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AntPathMatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token class-name">String</span> skipPath<span class="token operator">:</span>notAuthUrlProperties<span class="token punctuation">.</span><span class="token function">getShouldSkipUrls</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>pathMatcher<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>skipPath<span class="token punctuation">,</span>currentUrl<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    

    

    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">afterPropertiesSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">//获取公钥  TODO</span>
        <span class="token comment">// http://auth/oauth/token_key</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>publicKey <span class="token operator">=</span> <span class="token class-name">JwtUtils</span><span class="token punctuation">.</span><span class="token function">genPulicKey</span><span class="token punctuation">(</span>restTemplate<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不需要权限认证的url</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@ConfigurationProperties</span><span class="token punctuation">(</span><span class="token string">&quot;demo.gateway&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">NotAuthUrlProperties</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">LinkedHashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> shouldSkipUrls<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>工具类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">JwtUtils</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 认证服务器许可我们的网关的clientId(需要在oauth_client_details表中配置)
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">CLIENT_ID</span> <span class="token operator">=</span> <span class="token string">&quot;gateway&quot;</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 认证服务器许可我们的网关的client_secret(需要在oauth_client_details表中配置)
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">CLIENT_SECRET</span> <span class="token operator">=</span> <span class="token string">&quot;123123&quot;</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 认证服务器暴露的获取token_key的地址
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">AUTH_TOKEN_KEY_URL</span> <span class="token operator">=</span> <span class="token string">&quot;http://auth/oauth/token_key/&quot;</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 请求头中的 token的开始
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">AUTH_HEADER</span> <span class="token operator">=</span> <span class="token string">&quot;bearer &quot;</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 方法实现说明: 通过远程调用获取认证服务器颁发jwt的解析的key
     * <span class="token keyword">@author</span>:smlz
     * <span class="token keyword">@param</span> <span class="token parameter">restTemplate</span> 远程调用的操作类
     * <span class="token keyword">@return</span>: tokenKey 解析jwt的tokenKey
     * <span class="token keyword">@exception</span>:
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getTokenKeyByRemoteCall</span><span class="token punctuation">(</span><span class="token class-name">RestTemplate</span> restTemplate<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">GateWayException</span> <span class="token punctuation">{</span>

        <span class="token comment">//第一步:封装请求头</span>
        <span class="token class-name">HttpHeaders</span> headers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HttpHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        headers<span class="token punctuation">.</span><span class="token function">setContentType</span><span class="token punctuation">(</span><span class="token class-name">MediaType</span><span class="token punctuation">.</span><span class="token constant">APPLICATION_FORM_URLENCODED</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        headers<span class="token punctuation">.</span><span class="token function">setBasicAuth</span><span class="token punctuation">(</span><span class="token constant">CLIENT_ID</span><span class="token punctuation">,</span><span class="token constant">CLIENT_SECRET</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">HttpEntity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">MultiValueMap</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> entity <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HttpEntity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> headers<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//第二步:远程调用获取token_key</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>

            <span class="token class-name">ResponseEntity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Map</span><span class="token punctuation">&gt;</span></span> response <span class="token operator">=</span> restTemplate<span class="token punctuation">.</span><span class="token function">exchange</span><span class="token punctuation">(</span><span class="token constant">AUTH_TOKEN_KEY_URL</span><span class="token punctuation">,</span> <span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">GET</span><span class="token punctuation">,</span> entity<span class="token punctuation">,</span> <span class="token class-name">Map</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">String</span> tokenKey <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">getBody</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;value&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;去认证服务器获取Token_Key:{}&quot;</span><span class="token punctuation">,</span>tokenKey<span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">return</span> tokenKey<span class="token punctuation">;</span>

        <span class="token punctuation">}</span><span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>

            log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;远程调用认证服务器获取Token_Key失败:{}&quot;</span><span class="token punctuation">,</span>e<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">GateWayException</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span><span class="token constant">GET_TOKEN_KEY_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 方法实现说明:生成公钥
     * <span class="token keyword">@author</span>:smlz
     * <span class="token keyword">@param</span> <span class="token parameter">restTemplate</span>:远程调用操作类
     * <span class="token keyword">@return</span>: PublicKey 公钥对象
     * <span class="token keyword">@exception</span>:
     * <span class="token keyword">@date</span>:2020/1/22 11:52
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">PublicKey</span> <span class="token function">genPulicKey</span><span class="token punctuation">(</span><span class="token class-name">RestTemplate</span> restTemplate<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">GateWayException</span> <span class="token punctuation">{</span>

        <span class="token class-name">String</span> tokenKey <span class="token operator">=</span> <span class="token function">getTokenKeyByRemoteCall</span><span class="token punctuation">(</span>restTemplate<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">try</span><span class="token punctuation">{</span>

            <span class="token comment">//把获取的公钥开头和结尾替换掉</span>
            <span class="token class-name">String</span> dealTokenKey <span class="token operator">=</span>tokenKey<span class="token punctuation">.</span><span class="token function">replaceAll</span><span class="token punctuation">(</span><span class="token string">&quot;\\\\-*BEGIN PUBLIC KEY\\\\-*&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">replaceAll</span><span class="token punctuation">(</span><span class="token string">&quot;\\\\-*END PUBLIC KEY\\\\-*&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>security<span class="token punctuation">.</span></span>Security</span><span class="token punctuation">.</span><span class="token function">addProvider</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">org<span class="token punctuation">.</span>bouncycastle<span class="token punctuation">.</span>jce<span class="token punctuation">.</span>provider<span class="token punctuation">.</span></span>BouncyCastleProvider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">X509EncodedKeySpec</span> pubKeySpec <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">X509EncodedKeySpec</span><span class="token punctuation">(</span><span class="token class-name">Base64</span><span class="token punctuation">.</span><span class="token function">decodeBase64</span><span class="token punctuation">(</span>dealTokenKey<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">KeyFactory</span> keyFactory <span class="token operator">=</span> <span class="token class-name">KeyFactory</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token string">&quot;RSA&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">PublicKey</span> publicKey <span class="token operator">=</span> keyFactory<span class="token punctuation">.</span><span class="token function">generatePublic</span><span class="token punctuation">(</span>pubKeySpec<span class="token punctuation">)</span><span class="token punctuation">;</span>

            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;生成公钥:{}&quot;</span><span class="token punctuation">,</span>publicKey<span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">return</span> publicKey<span class="token punctuation">;</span>

        <span class="token punctuation">}</span><span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>

            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;生成公钥异常:{}&quot;</span><span class="token punctuation">,</span>e<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">GateWayException</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span><span class="token constant">GEN_PUBLIC_KEY_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Claims</span> <span class="token function">validateJwtToken</span><span class="token punctuation">(</span><span class="token class-name">String</span> authHeader<span class="token punctuation">,</span><span class="token class-name">PublicKey</span> publicKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> token <span class="token operator">=</span><span class="token keyword">null</span> <span class="token punctuation">;</span>
        <span class="token keyword">try</span><span class="token punctuation">{</span>
            token <span class="token operator">=</span> <span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">substringAfter</span><span class="token punctuation">(</span>authHeader<span class="token punctuation">,</span> <span class="token constant">AUTH_HEADER</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">Jwt</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">JwsHeader</span><span class="token punctuation">,</span> <span class="token class-name">Claims</span><span class="token punctuation">&gt;</span></span> parseClaimsJwt <span class="token operator">=</span> <span class="token class-name">Jwts</span><span class="token punctuation">.</span><span class="token function">parser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setSigningKey</span><span class="token punctuation">(</span>publicKey<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">parseClaimsJws</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">Claims</span> claims <span class="token operator">=</span> parseClaimsJwt<span class="token punctuation">.</span><span class="token function">getBody</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token comment">//log.info(&quot;claims:{}&quot;,claims);</span>

            <span class="token keyword">return</span> claims<span class="token punctuation">;</span>

        <span class="token punctuation">}</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span><span class="token punctuation">{</span>

            log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;校验token异常:{},异常信息:{}&quot;</span><span class="token punctuation">,</span>token<span class="token punctuation">,</span>e<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">GateWayException</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span><span class="token constant">JWT_TOKEN_EXPIRE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="获取token" tabindex="-1"><a class="header-anchor" href="#获取token" aria-hidden="true">#</a> 获取token</h4><p>网关的端口是8888</p><p><img src="http://img.xxfxpt.top/202302152044421.png" alt=""></p><h4 id="登录" tabindex="-1"><a class="header-anchor" href="#登录" aria-hidden="true">#</a> 登录</h4><p><img src="http://img.xxfxpt.top/202205031750723.png" alt=""></p><h4 id="使用token" tabindex="-1"><a class="header-anchor" href="#使用token" aria-hidden="true">#</a> 使用token</h4><p><img src="http://img.xxfxpt.top/202205031850573.png" alt=""></p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>以上就是在网关中整合授权服务实现单点登录，希望对大家有帮助。</p>`,118),c=[p];function o(i,l){return s(),a("div",null,c)}const r=n(t,[["render",o],["__file","Spring Cloud 单点登录.html.vue"]]);export{r as default};
