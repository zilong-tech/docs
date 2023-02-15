import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},i=e(`<h3 id="oauth2-0介绍" tabindex="-1"><a class="header-anchor" href="#oauth2-0介绍" aria-hidden="true">#</a> <strong>OAuth2.0介绍</strong></h3><p>OAuth（Open Authorization）是一个关于授权（authorization）的开放网络标准，允许用户授权第三方 应用访问他们存储在另外的服务提供者上的信息，而不需要将用户名和密码提供给第三方移动应用或分享他 们数据的所有内容。OAuth在全世界得到广泛应用，目前的版本是2.0版。</p><p>OAuth协议：https://tools.ietf.org/html/rfc6749</p><p>协议特点：</p><ul><li>简单：不管是OAuth服务提供者还是应用开发者，都很易于理解与使用；</li><li>安全：没有涉及到用户密钥等信息，更安全更灵活；</li><li>开放：任何服务提供商都可以实现OAuth，任何软件开发商都可以使用OAuth；</li></ul><h4 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> <strong>应用场景</strong></h4><ul><li><p>原生app授权：app登录请求后台接口，为了安全认证，所有请求都带token信息，如果登录验证、 请求后台数据。</p></li><li><p>前后端分离单页面应用：前后端分离框架，前端请求后台数据，需要进行oauth2安全认证</p></li><li><p>第三方应用授权登录，比如QQ，微博，微信的授权登录。</p></li></ul><p><img src="https://upload-images.jianshu.io/upload_images/15209061-6c7e5d5ef8c33c8a?imageMogr2/auto-orient/strip|imageView2/2/w/640/format/webp" alt=""></p><h4 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念" aria-hidden="true">#</a> 基本概念</h4><ul><li><p><strong>Third-party application</strong>：第三方应用程序，又称&quot;客户端&quot;（client），即例子中的&quot;豆瓣&quot;。</p></li><li><p><strong>HTTP service</strong>：HTTP服务提供商，简称&quot;服务提供商&quot;，即例子中的qq。</p></li><li><p><strong>Resource Owner</strong>：资源所有者，又称&quot;用户&quot;（user）。</p></li><li><p><strong>User Agent</strong>：用户代理，比如浏览器。</p></li><li><p><strong>Authorization server</strong>：授权服务器，即服务提供商专门用来处理认证授权的服务器。</p></li><li><p><strong>Resource server</strong>：资源服务器，即服务提供商存放用户生成的资源的服务器。它与授权服务器，可以是同一台服务器，也可以是不同的服务器。</p></li></ul><p>OAuth的作用就是让&quot;客户端&quot;安全可控地获取&quot;用户&quot;的授权，与&quot;服务提供商&quot;进行交互。</p><h4 id="优缺点" tabindex="-1"><a class="header-anchor" href="#优缺点" aria-hidden="true">#</a> <strong>优缺点</strong></h4><p>优点：</p><ul><li>更安全，客户端不接触用户密码，服务器端更易集中保护</li><li>广泛传播并被持续采用</li><li>短寿命和封装的token</li><li>资源服务器和授权服务器解耦</li><li>集中式授权，简化客户端</li><li>HTTP/JSON友好，易于请求和传递token</li><li>考虑多种客户端架构场景</li><li>客户可以具有不同的信任级别</li></ul><p>缺点：</p><ul><li>协议框架太宽泛，造成各种实现的兼容性和互操作性差</li><li>不是一个认证协议，本身并不能告诉你任何用户信息。</li></ul><h3 id="spring-security" tabindex="-1"><a class="header-anchor" href="#spring-security" aria-hidden="true">#</a> Spring Security</h3><p>Spring Security是一个能够为基于Spring的企业应用系统提供声明式的安全访问控制解决方案的<strong>安全框架</strong>。Spring Security 主要实现了<strong>Authentication</strong>（认证，解决who are you? ） 和 <strong>Access Control</strong>（访问控制，也就是what are you allowed to do？，也称为<strong>Authorization</strong>）。Spring Security在架构上将认证与授权分离，并提供了扩展点。</p><p><strong>认证（Authentication）</strong> ：用户认证就是判断一个用户的身份是否合法的过程，用户去访问系统资源时系统要求验证用户的身份信息，身份合法方可继续访问，不合法则拒绝访问。常见的用户身份认证方式有：用户名密码登录，二维码登录，手机短信登录，指纹认证等方式。</p><p><strong>授权（Authorization）</strong>： 授权是用户认证通过根据用户的权限来控制用户访问资源的过程，拥有资源的访问权限则正常访问，没有权限则拒绝访问。</p><p>将OAuth2和Spring Security集成，就可以得到一套完整的安全解决方案。我们可以通过Spring Security OAuth2构建一个授权服务器来验证用户身份以提供access_token，并使用这个access_token来从资源服务器请求数据。</p><h3 id="spring-security-oauth2-0整体架构" tabindex="-1"><a class="header-anchor" href="#spring-security-oauth2-0整体架构" aria-hidden="true">#</a> Spring Security + Oauth2.0<strong>整体架构</strong></h3><p><img src="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/E75EE15C7D3640D190B9A767423F7748/19014" alt="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/E75EE15C7D3640D190B9A767423F7748/19014"></p><ul><li>Authorize Endpoint ：授权端点，进行授权</li><li>Token Endpoint ：令牌端点，经过授权拿到对应的Token</li><li>Introspection Endpoint ：校验端点，校验Token的合法性</li><li>Revocation Endpoint ：撤销端点，撤销授权</li></ul><p><img src="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/890BA4CD0763456EB649582314FE6689/19008" alt="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/890BA4CD0763456EB649582314FE6689/19008"></p><ol><li>用户访问,此时没有Token。Oauth2RestTemplate会报错，这个报错信息会被Oauth2ClientContextFilter捕获并重定向到授权服务器。</li><li>授权服务器通过Authorization Endpoint进行授权，并通过AuthorizationServerTokenServices生成授权码并返回给客户端。</li><li>客户端拿到授权码去授权服务器通过Token Endpoint调用AuthorizationServerTokenServices生成Token并返回给客户端</li><li>客户端拿到Token去资源服务器访问资源，一般会通过Oauth2AuthenticationManager调用ResourceServerTokenServices进行校验。校验通过可以获取资源。</li></ol><h3 id="oauth2-0模式" tabindex="-1"><a class="header-anchor" href="#oauth2-0模式" aria-hidden="true">#</a> OAuth2.0模式</h3><h4 id="运行流程" tabindex="-1"><a class="header-anchor" href="#运行流程" aria-hidden="true">#</a> 运行流程</h4><p>OAuth 2.0的运行流程如下图，摘自RFC 6749。</p><p><img src="https://upload-images.jianshu.io/upload_images/15209061-98feec3dbfd354bf.png?imageMogr2/auto-orient/strip|imageView2/2/w/766/format/webp" alt=""></p><p>（A）用户打开客户端以后，客户端要求用户给予授权。 （B）用户同意给予客户端授权。 （C）客户端使用上一步获得的授权，向认证服务器申请令牌。 （D）认证服务器对客户端进行认证以后，确认无误，同意发放令牌。 （E）客户端使用令牌，向资源服务器申请获取资源。 （F）资源服务器确认令牌无误，同意向客户端开放资源。</p><p>引入依赖</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-oauth2&lt;/artifactId&gt;
&lt;/dependency&gt;    


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="授权模式" tabindex="-1"><a class="header-anchor" href="#授权模式" aria-hidden="true">#</a> 授权模式</h4><p>客户端必须得到用户的授权（authorization grant），才能获得令牌（access token）。OAuth 2.0一共分成四种授权类型（authorization grant）</p><ul><li>授权码模式（authorization code）</li><li>简化模式（implicit）</li><li>密码模式（resource owner password credentials）</li><li>客户端模式（client credentials）</li></ul><p>授权码模式和密码模式比较常用。</p><p>第三方应用申请令牌之前，都必须先到系统备案，说明自己的身份，然后会拿到两个身份识别码：客户端 ID（client ID）和客户端密钥（client secret）。这是为了防止令牌被滥用，没有备案过的第三方应用，是不会拿到令牌的。</p><h5 id="授权码模式" tabindex="-1"><a class="header-anchor" href="#授权码模式" aria-hidden="true">#</a> <strong>授权码模式</strong></h5><p><strong>授权码（authorization code）方式，指的是第三方应用先申请一个授权码，然后再用该码获取令牌。</strong></p><p>这种方式是最常用的流程，安全性也最高，它适用于那些有后端的 Web 应用。授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏。</p><p>适用场景：目前主流的第三方验证都是采用这种模式</p><p>​ <img src="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/28927E9C24844765935717F4C491EE2A/18873" alt="0"></p><p>主要流程：</p><p>（A）用户访问客户端，后者将前者导向授权服务器。</p><p>（B）用户选择是否给予客户端授权。</p><p>（C）用户给予授权，授权服务器将用户导向客户端事先指定的&quot;重定向URI&quot;（redirection URI），同时附上一个授权码。</p><p>（D）客户端收到授权码，附上早先的&quot;重定向URI&quot;，向授权服务器申请令牌。这一步是在客户端的后台的服务器上完成的，对用户不可见。</p><p>（E）授权服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌（access token）和更新令牌（refresh token）。</p><p>​</p><h6 id="配置授权服务器" tabindex="-1"><a class="header-anchor" href="#配置授权服务器" aria-hidden="true">#</a> <strong>配置授权服务器</strong></h6><p>注意：实际项目中clinet_id 和client_secret 是配置在数据库中，省略spring security相关配置，可以参考</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenStore tokenStore;
    
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints
                .tokenStore(tokenStore)  //指定token存储到redis
                .allowedTokenEndpointRequestMethods(HttpMethod.GET,HttpMethod.POST); //支持GET,POST请求

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {

        // 基于内存模式，这里只是演示，实际生产中应该基于数据库
        clients.inMemory()
                //配置client_id
                .withClient(&quot;client&quot;)
                //配置client_secret
                .secret(passwordEncoder.encode(&quot;123123&quot;))
                //配置访问token的有效期
                .accessTokenValiditySeconds(3600)
                //配置刷新token的有效期
                .refreshTokenValiditySeconds(864000)
                //配置redirect_uri，用于授权成功后跳转
                .redirectUris(&quot;http://www.baidu.com&quot;)
                //配置申请的权限范围
                .scopes(&quot;all&quot;)
                //配置grant_type，表示授权类型  authorization_code: 授权码
                .authorizedGrantTypes(&quot;authorization_code&quot;);


    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端信息，和授权码都是存储在了内存中，一旦认证服务宕机，那客户端的认证信息也随之消失，而且客户端信息是在程序中写死的，维护起来及不方便，每次修改都需要重启服务，如果向上述信息都存于数据库中便可以解决上面的问题，其中数据我们可以自定义存到<code>noSql</code>或其他数据库中。</p><p><strong>数据库存储模式</strong></p><p>首先在数据库中新建存储客户端信息，及授权码的表：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>#客户端信息
CREATE TABLE \`oauth_client_details\`  (
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

-- ----------------------------
-- Records of oauth_client_details
-- ----------------------------
INSERT INTO \`oauth_client_details\` VALUES (&#39;client&#39;, NULL, &#39;$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6&#39;, &#39;all&#39;, &#39;authorization_code,password,refresh_token,client_credentials,implicit&#39;, &#39;http://www.baidu.com&#39;, NULL, 3600, 864000, NULL, NULL);

#授权码
CREATE TABLE \`oauth_code\`  (
  \`code\` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  \`authentication\` blob NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>引入依赖</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;dependency&gt;
    &lt;groupId&gt;com.baomidou&lt;/groupId&gt;
    &lt;artifactId&gt;mybatis-plus-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;3.3.2&lt;/version&gt;
&lt;/dependency&gt;

&lt;dependency&gt;
    &lt;groupId&gt;mysql&lt;/groupId&gt;
    &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt;
&lt;/dependency&gt;

&lt;dependency&gt;
    &lt;groupId&gt;com.alibaba&lt;/groupId&gt;
    &lt;artifactId&gt;druid&lt;/artifactId&gt;
    &lt;version&gt;1.1.6&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 授权服务器
 *
 * 授权码模式基于数据库
 */</span>
<span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@EnableAuthorizationServer</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AuthorizationServerConfig1</span> <span class="token keyword">extends</span> <span class="token class-name">AuthorizationServerConfigurerAdapter</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">PasswordEncoder</span> passwordEncoder<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">TokenStore</span> tokenStore<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">DataSource</span> dataSource<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">AuthorizationCodeServices</span> authorizationCodeServices<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token annotation punctuation">@Qualifier</span><span class="token punctuation">(</span><span class="token string">&quot;jdbcClientDetailsService&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">ClientDetailsService</span> clientDetailsService<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Bean</span><span class="token punctuation">(</span><span class="token string">&quot;jdbcClientDetailsService&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">ClientDetailsService</span> <span class="token function">clientDetailsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">JdbcClientDetailsService</span> clientDetailsService <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">JdbcClientDetailsService</span><span class="token punctuation">(</span>dataSource<span class="token punctuation">)</span><span class="token punctuation">;</span>
        clientDetailsService<span class="token punctuation">.</span><span class="token function">setPasswordEncoder</span><span class="token punctuation">(</span>passwordEncoder<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> clientDetailsService<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//设置授权码模式的授权码如何存取</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">AuthorizationCodeServices</span> <span class="token function">authorizationCodeServices</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">JdbcAuthorizationCodeServices</span><span class="token punctuation">(</span>dataSource<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>




    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthorizationServerEndpointsConfigurer</span> endpoints<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        endpoints
                <span class="token punctuation">.</span><span class="token function">tokenStore</span><span class="token punctuation">(</span>tokenStore<span class="token punctuation">)</span>  <span class="token comment">//指定token存储到redis</span>
                <span class="token punctuation">.</span><span class="token function">authorizationCodeServices</span><span class="token punctuation">(</span>authorizationCodeServices<span class="token punctuation">)</span><span class="token comment">//授权码服务</span>
                <span class="token punctuation">.</span><span class="token function">allowedTokenEndpointRequestMethods</span><span class="token punctuation">(</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">GET</span><span class="token punctuation">,</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">POST</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//支持GET,POST请求</span>


    <span class="token punctuation">}</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthorizationServerSecurityConfigurer</span> security<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">//允许表单认证</span>
        security
                <span class="token punctuation">.</span><span class="token function">tokenKeyAccess</span><span class="token punctuation">(</span><span class="token string">&quot;permitAll()&quot;</span><span class="token punctuation">)</span>                    <span class="token comment">//oauth/token_key是公开</span>
                <span class="token punctuation">.</span><span class="token function">checkTokenAccess</span><span class="token punctuation">(</span><span class="token string">&quot;permitAll()&quot;</span><span class="token punctuation">)</span>                  <span class="token comment">//oauth/check_token公开</span>
                <span class="token punctuation">.</span><span class="token function">allowFormAuthenticationForClients</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">ClientDetailsServiceConfigurer</span> clients<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">//授权码模式</span>
        <span class="token comment">//http://localhost:8080/oauth/authorize?response_type=code&amp;client_id=client&amp;redirect_uri=http://www.baidu.com&amp;scope=all</span>
        <span class="token comment">// 简化模式</span>
<span class="token comment">//        http://localhost:8080/oauth/authorize?response_type=token&amp;client_id=client&amp;redirect_uri=http://www.baidu.com&amp;scope=all</span>

        clients<span class="token punctuation">.</span><span class="token function">withClientDetails</span><span class="token punctuation">(</span>clientDetailsService<span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置资源服务器" tabindex="-1"><a class="header-anchor" href="#配置资源服务器" aria-hidden="true">#</a> <strong>配置资源服务器</strong></h6><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@EnableResourceServer</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ResourceServiceConfig</span> <span class="token keyword">extends</span> <span class="token class-name">ResourceServerConfigurerAdapter</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">HttpSecurity</span> http<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>

        http<span class="token punctuation">.</span><span class="token function">authorizeRequests</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">anyRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">authenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">requestMatchers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">antMatchers</span><span class="token punctuation">(</span><span class="token string">&quot;/user/**&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置-spring-security" tabindex="-1"><a class="header-anchor" href="#配置-spring-security" aria-hidden="true">#</a> 配置 spring security</h6><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WebSecurityConfig</span> <span class="token keyword">extends</span> <span class="token class-name">WebSecurityConfigurerAdapter</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">PasswordEncoder</span> <span class="token function">passwordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">BCryptPasswordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">HttpSecurity</span> http<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        http<span class="token punctuation">.</span><span class="token function">formLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">permitAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">authorizeRequests</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">antMatchers</span><span class="token punctuation">(</span><span class="token string">&quot;/oauth/**&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">permitAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">anyRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">authenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">logout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">permitAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">csrf</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token keyword">implements</span> <span class="token class-name">UserDetailsService</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">PasswordEncoder</span> passwordEncoder<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">UserDetails</span> <span class="token function">loadUserByUsername</span><span class="token punctuation">(</span><span class="token class-name">String</span> username<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">UsernameNotFoundException</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> password <span class="token operator">=</span> passwordEncoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span><span class="token string">&quot;123456&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">User</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span>password<span class="token punctuation">,</span> <span class="token class-name">AuthorityUtils</span><span class="token punctuation">.</span><span class="token function">commaSeparatedStringToAuthorityList</span><span class="token punctuation">(</span><span class="token string">&quot;admin&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1、A网站（客户端）提供一个链接，用户点击后就会跳转到 B （授权服务器）网站，授权用户数据给 A 网站使用。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> <span class="token number">127.0</span>.0.1:9999/oauth/authorize?   
 <span class="token assign-left variable">response_type</span><span class="token operator">=</span>code<span class="token operator">&amp;</span>            <span class="token comment"># 表示授权类型，必选项，此处的值固定为&quot;code&quot;</span>
 <span class="token assign-left variable">client_id</span><span class="token operator">=</span>CLIENT_ID<span class="token operator">&amp;</span>           <span class="token comment"># 表示客户端的ID，必选项</span>
 <span class="token assign-left variable">redirect_uri</span><span class="token operator">=</span>CALLBACK_URL<span class="token operator">&amp;</span>     <span class="token comment"># redirect_uri：表示重定向URI，可选项</span>
 <span class="token assign-left variable">scope</span><span class="token operator">=</span>read					    <span class="token comment"># 表示申请的权限范围，可选项 read只读  </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>http://localhost:8080/oauth/authorize?response_type=code&amp;client_id=client&amp;redirect_uri=http://www.baidu.com&amp;scope=all</p><p>2、用户跳转后，B 网站会要求用户登录，然后询问是否同意给予 A 网站授权。用户表示同意，这时 B 网站就会跳回redirect_uri参数指定的网址。跳转时，会传回一个授权码</p><p>登录：</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041653244.png" alt=""></p><p>授权：</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041512818.png" alt=""></p><p>选择 authorize ，获取授权码，浏览器返回：https://www.baidu.com/?code=PVpEEw</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://a.com/callback?code=AUTHORIZATION_CODE    #code参数就是授权码                   
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果使用数据库模式：</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041656285.png" alt=""></p><p>3、A 网站拿到授权码以后，就可以在后端，向 B 网站请求令牌。 用户不可见，服务端行为</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>127.0.0.1:8080/oauth/token? 
client_id=CLIENT_ID&amp; 
client_secret=CLIENT_SECRET&amp;     # client_id和client_secret用来让 B 确认 A 的身份,client_secret参数是保密的，因此只能在后端发请求 
grant_type=authorization_code&amp;   # 采用的授权方式是授权码
code=AUTHORIZATION_CODE&amp;         # 上一步拿到的授权码 
redirect_uri=CALLBACK_URL		 # 令牌颁发后的回调网址         
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、B 网站收到请求以后，就会颁发令牌。具体做法是向redirect_uri指定的网址，返回数据。</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code> <span class="token punctuation">{</span>    
   <span class="token property">&quot;access_token&quot;</span><span class="token operator">:</span><span class="token string">&quot;ACCESS_TOKEN&quot;</span><span class="token punctuation">,</span>     # 令牌
   <span class="token property">&quot;token_type&quot;</span><span class="token operator">:</span><span class="token string">&quot;bearer&quot;</span><span class="token punctuation">,</span>
   <span class="token property">&quot;expires_in&quot;</span><span class="token operator">:</span><span class="token number">2592000</span><span class="token punctuation">,</span>
   <span class="token property">&quot;refresh_token&quot;</span><span class="token operator">:</span><span class="token string">&quot;REFRESH_TOKEN&quot;</span><span class="token punctuation">,</span>
   <span class="token property">&quot;scope&quot;</span><span class="token operator">:</span><span class="token string">&quot;read&quot;</span><span class="token punctuation">,</span>
   <span class="token property">&quot;uid&quot;</span><span class="token operator">:</span><span class="token number">100101</span><span class="token punctuation">,</span>
   <span class="token property">&quot;info&quot;</span><span class="token operator">:</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041525228.png" alt=""></p><p>此时redis中会存储token</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041708764.png" alt=""></p><h5 id="密码模式" tabindex="-1"><a class="header-anchor" href="#密码模式" aria-hidden="true">#</a> <strong>密码模式</strong></h5><p>如果你高度信任某个应用，RFC 6749 也允许用户把用户名和密码，直接告诉该应用。该应用就使用你的密码，申请令牌，这种方式称为&quot;密码式&quot;（password）。</p><p>在这种模式中，用户必须把自己的密码给客户端，但是客户端不得储存密码。这通常用在用户对客户端高度信任的情况下，比如客户端是操作系统的一部分，或者由一个著名公司出品。而授权服务器只有在其他授权模式无法执行的情况下，才能考虑使用这种模式。</p><p>适用场景：公司搭建的授权服务器</p><p><img src="https://upload-images.jianshu.io/upload_images/15209061-38d92855ebb979d1.png?imageMogr2/auto-orient/strip|imageView2/2/w/799/format/webp" alt=""></p><p>（A）用户向客户端提供用户名和密码。</p><p>（B）客户端将用户名和密码发给授权服务器，向后者请求令牌。</p><p>（C）授权服务器确认无误后，向客户端提供访问令牌。</p><h6 id="配置-spring-security-1" tabindex="-1"><a class="header-anchor" href="#配置-spring-security-1" aria-hidden="true">#</a> 配置 spring security</h6><p>增加AuthenticationManager</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WebSecurityConfig</span> <span class="token keyword">extends</span> <span class="token class-name">WebSecurityConfigurerAdapter</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">PasswordEncoder</span> <span class="token function">passwordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">BCryptPasswordEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">UserService</span> userService<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthenticationManagerBuilder</span> auth<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取用户信息</span>
        auth<span class="token punctuation">.</span><span class="token function">userDetailsService</span><span class="token punctuation">(</span>userService<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


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
    

    <span class="token annotation punctuation">@Bean</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">AuthenticationManager</span> <span class="token function">authenticationManagerBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">// oauth2 密码模式需要拿到这个bean</span>
        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">authenticationManagerBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token keyword">implements</span> <span class="token class-name">UserDetailsService</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token annotation punctuation">@Lazy</span>
    <span class="token keyword">private</span> <span class="token class-name">PasswordEncoder</span> passwordEncoder<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">UserDetails</span> <span class="token function">loadUserByUsername</span><span class="token punctuation">(</span><span class="token class-name">String</span> username<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">UsernameNotFoundException</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> password <span class="token operator">=</span> passwordEncoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span><span class="token string">&quot;123456&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">User</span><span class="token punctuation">(</span><span class="token string">&quot;jack&quot;</span><span class="token punctuation">,</span>password<span class="token punctuation">,</span> <span class="token class-name">AuthorityUtils</span><span class="token punctuation">.</span><span class="token function">commaSeparatedStringToAuthorityList</span><span class="token punctuation">(</span><span class="token string">&quot;admin&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisConfig</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RedisConnectionFactory</span> redisConnectionFactory<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">TokenStore</span> <span class="token function">tokenStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">RedisTokenStore</span><span class="token punctuation">(</span>redisConnectionFactory<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置授权服务器-1" tabindex="-1"><a class="header-anchor" href="#配置授权服务器-1" aria-hidden="true">#</a> 配置授权服务器</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig2 extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManagerBean;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenStore tokenStore;


    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.authenticationManager(authenticationManagerBean) //使用密码模式需要配置
                .tokenStore(tokenStore)  //指定token存储到redis
                .reuseRefreshTokens(false)  //refresh_token是否重复使用
                .userDetailsService(userService) //刷新令牌授权包含对用户信息的检查
                .allowedTokenEndpointRequestMethods(HttpMethod.GET,HttpMethod.POST); //支持GET,POST请求
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        //允许表单认证
        security.allowFormAuthenticationForClients();
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {

        clients.inMemory()
                //配置client_id
                .withClient(&quot;client&quot;)
                //配置client-secret
                .secret(passwordEncoder.encode(&quot;123123&quot;))
                //配置访问token的有效期
                .accessTokenValiditySeconds(3600)
                //配置刷新token的有效期
                .refreshTokenValiditySeconds(864000)
                //配置redirect_uri，用于授权成功后跳转
                .redirectUris(&quot;http://www.baidu.com&quot;)
                //配置申请的权限范围
                .scopes(&quot;all&quot;)
                /**
                 * 配置grant_type，表示授权类型
                 * authorization_code: 授权码模式
                 * implicit: 简化模式
                 * password： 密码模式
                 * client_credentials: 客户端模式
                 * refresh_token: 更新令牌
                 */
                .authorizedGrantTypes(&quot;authorization_code&quot;,&quot;implicit&quot;,&quot;password&quot;,&quot;client_credentials&quot;,&quot;refresh_token&quot;);
    }


}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如需支持数据库模式，只需要把授权服务器在授权码模式的基础上增加AuthenticationManager，关键代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AuthorizationServerConfig1
@Autowired
private AuthenticationManager authenticationManagerBean;

@Override
public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
    endpoints.authenticationManager(authenticationManagerBean) //使用密码模式需要配置
    .tokenStore(tokenStore)  //指定token存储到redis
    .authorizationCodeServices(authorizationCodeServices)//授权码服务
    .allowedTokenEndpointRequestMethods(HttpMethod.GET,HttpMethod.POST); //支持GET,POST请求


}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取token：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://oauth.b.com/oauth/token?
  grant_type=password&amp;       # 授权方式是&quot;密码式&quot;
  username=USERNAME&amp;
  password=PASSWORD&amp;
  client_id=CLIENT_ID&amp;
  client_secret=123123&amp;
  scope=all

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041738615.png" alt=""></p><h5 id="客户端模式" tabindex="-1"><a class="header-anchor" href="#客户端模式" aria-hidden="true">#</a> <strong>客户端模式</strong></h5><p>客户端模式（Client Credentials Grant）指客户端以自己的名义，而不是以用户的名义，向&quot;服务提供商&quot;进行 授权。</p><p>**适用于没有前端的命令行应用，即在命令行下请求令牌。**一般用来提供给我们完全信任的服务器端服务。</p><p><img src="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/4C4A7E900EAD416F94A9FCE3719413CE/18920" alt=""></p><p>它的步骤如下：</p><p>（A）客户端向授权服务器进行身份认证，并要求一个访问令牌。</p><p>（B）授权服务器确认无误后，向客户端提供访问令牌。</p><p>A 应用在命令行向 B 发出请求。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://oauth.b.com/token? 
grant_type=client_credentials&amp; 
client_id=CLIENT_ID&amp; 
client_secret=CLIENT_SECRET              
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置授权服务器-2" tabindex="-1"><a class="header-anchor" href="#配置授权服务器-2" aria-hidden="true">#</a> 配置授权服务器</h6><p>在grant_type增加client_credentials来支持客户端模式。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>clients<span class="token punctuation">.</span><span class="token function">inMemory</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token comment">//配置client_id</span>
        <span class="token punctuation">.</span><span class="token function">withClient</span><span class="token punctuation">(</span><span class="token string">&quot;client&quot;</span><span class="token punctuation">)</span>
        <span class="token comment">//配置client-secret</span>
        <span class="token punctuation">.</span><span class="token function">secret</span><span class="token punctuation">(</span>passwordEncoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span><span class="token string">&quot;123123&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token comment">//配置访问token的有效期</span>
        <span class="token punctuation">.</span><span class="token function">accessTokenValiditySeconds</span><span class="token punctuation">(</span><span class="token number">3600</span><span class="token punctuation">)</span>
        <span class="token comment">//配置刷新token的有效期</span>
        <span class="token punctuation">.</span><span class="token function">refreshTokenValiditySeconds</span><span class="token punctuation">(</span><span class="token number">864000</span><span class="token punctuation">)</span>
        <span class="token comment">//配置redirect_uri，用于授权成功后跳转</span>
        <span class="token punctuation">.</span><span class="token function">redirectUris</span><span class="token punctuation">(</span><span class="token string">&quot;http://www.baidu.com&quot;</span><span class="token punctuation">)</span>
        <span class="token comment">//配置申请的权限范围</span>
        <span class="token punctuation">.</span><span class="token function">scopes</span><span class="token punctuation">(</span><span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
        <span class="token doc-comment comment">/**
         * 配置grant_type，表示授权类型
         * authorization_code: 授权码模式
         * implicit: 简化模式
         * password： 密码模式
         * client_credentials: 客户端模式
         * refresh_token: 更新令牌
         */</span>
        <span class="token punctuation">.</span><span class="token function">authorizedGrantTypes</span><span class="token punctuation">(</span><span class="token string">&quot;authorization_code&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;implicit&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;password&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;client_credentials&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;refresh_token&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取令牌：</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041752612.png" alt=""></p><h5 id="简化-隐式-模式" tabindex="-1"><a class="header-anchor" href="#简化-隐式-模式" aria-hidden="true">#</a> <strong>简化(隐式)模式</strong></h5><p>有些 Web 应用是纯前端应用，没有后端。这时就不能用上面的方式了，必须将令牌储存在前端。<strong>RFC 6749 就规定了第二种方式，允许直接向前端颁发令牌，这种方式没有授权码这个中间步骤，所以称为（授权码）&quot;隐藏式&quot;（implicit）</strong></p><p>简化模式不通过第三方应用程序的服务器，直接在浏览器中向授权服务器申请令牌，跳过了&quot;授权码&quot;这个步骤，所有步骤在浏览器中完成，令牌对访问者是可见的，且客户端不需要认证。</p><p>这种方式把令牌直接传给前端，是很不安全的。因此，只能用于一些安全要求不高的场景，并且令牌的有效期必须非常短，通常就是会话期间（session）有效，浏览器关掉，令牌就失效了。</p><p><img src="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/E325135F742643A588C17ED8078C72E7/18898" alt="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/E325135F742643A588C17ED8078C72E7/18898"></p><p>它的步骤如下：</p><p>（A）客户端将用户导向授权服务器。</p><p>（B）用户决定是否给于客户端授权。</p><p>（C）假设用户给予授权，授权服务器将用户导向客户端指定的&quot;重定向URI&quot;，并在URI的Hash部分包含了访问令牌。</p><p>（D）浏览器向资源服务器发出请求，其中不包括上一步收到的Hash值。</p><p>（E）资源服务器返回一个网页，其中包含的代码可以获取Hash值中的令牌。</p><p>（F）浏览器执行上一步获得的脚本，提取出令牌。</p><p>（G）浏览器将令牌发给客户端。</p><p>A 网站提供一个链接，要求用户跳转到 B 网站，授权用户数据给 A 网站使用。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://b.com/oauth/authorize?
&gt;   response_type=token&amp;          # response_type参数为token，表示要求直接返回令牌
&gt;   client_id=CLIENT_ID&amp;
&gt;   redirect_uri=CALLBACK_URL&amp;
&gt;   scope=read
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用户跳转到 B 网站，登录后同意给予 A 网站授权。这时，B 网站就会跳回redirect_uri参数指定的跳转网址，并且把令牌作为 URL 参数，传给 A 网站。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://a.com/callback#token=ACCESS_TOKEN     #token参数就是令牌，A 网站直接在前端拿到令牌。 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置授权服务器-3" tabindex="-1"><a class="header-anchor" href="#配置授权服务器-3" aria-hidden="true">#</a> 配置授权服务器</h6><p>只需要在配置grant_type增加implicit</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
clients<span class="token punctuation">.</span><span class="token function">inMemory</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token comment">//配置client_id</span>
        <span class="token punctuation">.</span><span class="token function">withClient</span><span class="token punctuation">(</span><span class="token string">&quot;client&quot;</span><span class="token punctuation">)</span>
        <span class="token comment">//配置client-secret</span>
        <span class="token punctuation">.</span><span class="token function">secret</span><span class="token punctuation">(</span>passwordEncoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span><span class="token string">&quot;123123&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token comment">//配置访问token的有效期</span>
        <span class="token punctuation">.</span><span class="token function">accessTokenValiditySeconds</span><span class="token punctuation">(</span><span class="token number">3600</span><span class="token punctuation">)</span>
        <span class="token comment">//配置刷新token的有效期</span>
        <span class="token punctuation">.</span><span class="token function">refreshTokenValiditySeconds</span><span class="token punctuation">(</span><span class="token number">864000</span><span class="token punctuation">)</span>
        <span class="token comment">//配置redirect_uri，用于授权成功后跳转</span>
        <span class="token punctuation">.</span><span class="token function">redirectUris</span><span class="token punctuation">(</span><span class="token string">&quot;http://www.baidu.com&quot;</span><span class="token punctuation">)</span>
        <span class="token comment">//配置申请的权限范围</span>
        <span class="token punctuation">.</span><span class="token function">scopes</span><span class="token punctuation">(</span><span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
        <span class="token comment">//配置grant_type，表示授权类型 授权码：authorization_code implicit: 简化模式</span>
        <span class="token punctuation">.</span><span class="token function">authorizedGrantTypes</span><span class="token punctuation">(</span><span class="token string">&quot;authorization_code&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;implicit&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>http://localhost:8080/oauth/authorize?client_id=client&amp;response_type=token&amp;scope=all&amp;redirect_uri=http://www.baidu.com</p><p>登录之后进入授权页面，确定授权后浏览器会重定向到指定路径，并以Hash的形式存放在重定向uri的fargment中：</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041719513.png" alt=""></p><p>如果想要支持数据库模式，配置同授权码模式一样，只需要在oauth_client_details表的authorized_grant_types配置上implicit即可。</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>INSERT INTO \`oauth\`.\`oauth_client_details\`(\`client_id\`, \`resource_ids\`, \`client_secret\`, \`scope\`, \`authorized_grant_types\`, \`web_server_redirect_uri\`, \`authorities\`, \`access_token_validity\`, \`refresh_token_validity\`, \`additional_information\`, \`autoapprove\`) VALUES (&#39;gateway&#39;, NULL, &#39;$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6&#39;, &#39;all&#39;, &#39;authorization_code,password,refresh_token,implicit&#39;, &#39;http://www.baidu.com&#39;, NULL, 3600, 864000, NULL, NULL);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="令牌的使用" tabindex="-1"><a class="header-anchor" href="#令牌的使用" aria-hidden="true">#</a> <strong>令牌的使用</strong></h4><p>A 网站拿到令牌以后，就可以向 B 网站的 API 请求数据了。</p><p>此时，每个发到 API 的请求，都必须带有令牌。具体做法是在请求的头信息，加上一个Authorization字段，令牌就放在这个字段里面。</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041530217.png" alt=""></p><p>也可以添加请求参数access_token请求数据</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>localhost/user/getCurrentUser?access_token=xxxxxxxxxxxxxxxxxxxxxxxxxxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041527367.png" alt=""></p><h4 id="更新令牌" tabindex="-1"><a class="header-anchor" href="#更新令牌" aria-hidden="true">#</a> <strong>更新令牌</strong></h4><p>令牌的有效期到了，如果让用户重新走一遍上面的流程，再申请一个新的令牌，很可能体验不好，而且也没有必要。OAuth 2.0 允许用户自动更新令牌。</p><p>​ <img src="https://note.youdao.com/yws/public/resource/eaab054e79f362d02340114569806d3a/xmlnote/6D63CE8D35F04D63976B016C628B05CD/18991" alt="0"></p><p>具体方法是，B 网站颁发令牌的时候，一次性颁发两个令牌，一个用于获取数据，另一个用于获取新的令牌（refresh token 字段）。令牌到期前，用户使用 refresh token 发一个请求，去更新令牌。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://b.com/oauth/token?
&gt;   grant_type=refresh_token&amp;    # grant_type参数为refresh_token表示要求更新令牌
&gt;   client_id=CLIENT_ID&amp;
&gt;   client_secret=CLIENT_SECRET&amp;
&gt;   refresh_token=REFRESH_TOKEN    # 用于更新令牌的令牌
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202205041814057.png" alt=""></p><h4 id="基于redis存储token" tabindex="-1"><a class="header-anchor" href="#基于redis存储token" aria-hidden="true">#</a> <strong>基于redis存储Token</strong></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.apache.commons&lt;/groupId&gt;
    &lt;artifactId&gt;commons-pool2&lt;/artifactId&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="redis配置类" tabindex="-1"><a class="header-anchor" href="#redis配置类" aria-hidden="true">#</a> redis配置类</h6><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisConfig</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RedisConnectionFactory</span> redisConnectionFactory<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">TokenStore</span> <span class="token function">tokenStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">RedisTokenStore</span><span class="token punctuation">(</span>redisConnectionFactory<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在授权服务器配置中指定令牌的存储策略为Redis</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">TokenStore</span> tokenStore<span class="token punctuation">;</span>

<span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthorizationServerEndpointsConfigurer</span> endpoints<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
    endpoints<span class="token punctuation">.</span><span class="token function">authenticationManager</span><span class="token punctuation">(</span>authenticationManagerBean<span class="token punctuation">)</span> <span class="token comment">//使用密码模式需要配置</span>
        <span class="token punctuation">.</span><span class="token function">tokenStore</span><span class="token punctuation">(</span>tokenStore<span class="token punctuation">)</span>  <span class="token comment">//指定token存储到redis</span>
        <span class="token punctuation">.</span><span class="token function">reuseRefreshTokens</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>  <span class="token comment">//refresh_token是否重复使用</span>
        <span class="token punctuation">.</span><span class="token function">userDetailsService</span><span class="token punctuation">(</span>userService<span class="token punctuation">)</span> <span class="token comment">//刷新令牌授权包含对用户信息的检查</span>
        <span class="token punctuation">.</span><span class="token function">allowedTokenEndpointRequestMethods</span><span class="token punctuation">(</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">GET</span><span class="token punctuation">,</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">POST</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//支持GET,POST请求</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>OAuth2.0 的授权简单理解其实就是获取令牌（token）的过程，OAuth 协议定义了四种获得令牌的授权方式（authorization grant ）：授权码（authorization-code）、简单式（implicit）、密码式（password）、客户端凭证（client credentials），一般常用的是授权码和密码模式。</p>`,161),o=[i];function p(c,l){return s(),a("div",null,o)}const r=n(t,[["render",p],["__file","Spring Security 整合OAuth2.html.vue"]]);export{r as default};
