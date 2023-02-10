---
title: 单点登录
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
### 简介

在微服务中，网关作为流量的入口，所以网关上处理授权鉴权成为了不二的选择。一般做法是：授权服务器生成令牌, 所有请求统一在网关层验证，判断权限等操作；API网关作为OAuth2.0的资源服务器角色，实现接入客户端权限拦截、令牌解析并转发当前登录用户信息给微服务，这样下游微服务就不需要关心令牌格式解析以及OAuth2.0相关机制了。

流程如下：

![](https://gitee.com/zysspace/pic/raw/master/images/202205032101918.png)

### **搭建微服务授权中心 auth**

本文使用 JWT非对称加密（公钥私钥）

#### **什么是JWT**  

JSON Web Token（JWT）是一个开放的行业标准（RFC 7519），它定义了一种简介的、自包含的协议格式，用于在通信双方传递json对象，传递的信息经过数字签名可以被验证和信任。JWT可以使用HMAC算法或使用RSA的公钥/私钥对来签名，防止被篡改。 官网： https://jwt.io/ 标准： https://tools.ietf.org/html/rfc7519

JWT令牌的优点：

1. jwt基于json，非常方便解析。
2. 可以在令牌中自定义丰富的内容，易扩展。
3. 通过非对称加密算法及数字签名技术，JWT防止篡改，安全性高。
4. 资源服务使用JWT可不依赖授权服务即可完成授权。

缺点：

​	JWT令牌较长，占存储空间比较大。  

**JWT组成**

一个JWT实际上就是一个字符串，它由三部分组成，头部（header）、载荷（payload）与签名（signature）。

![](https://gitee.com/zysspace/pic/raw/master/images/202205031621359.png)

**头部（header）**

头部用于描述关于该JWT的最基本的信息：类型（即JWT）以及签名所用的算法（如HMACSHA256或RSA）等。

这也可以被表示成一个JSON对象：

```json
{  "alg": "HS256",  "typ": "JWT" }              
```

然后将头部进行base64加密（该加密是可以对称解密的),构成了第一部分:

```text
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9              

```

**载荷（payload）**

第二部分是载荷，就是存放有效信息的地方。这个名字像是特指飞机上承载的货品，这些有效信息包含三个部分：

- 标准中注册的声明（建议但不强制使用）  

**iss**: jwt签发者

**sub**: jwt所面向的用户

**aud**: 接收jwt的一方

**exp**: jwt的过期时间，这个过期时间必须要大于签发时间

**nbf**: 定义在什么时间之前，该jwt都是不可用的.

**iat**: jwt的签发时间

**jti**: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

- 公共的声明 公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.  
- 私有的声明 私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。  

定义一个payload：

```json
{  "sub": "1234567890",  "name": "John Doe",  "iat": 1516239022 }              
```

然后将其进行base64加密，得到Jwt的第二部分:

```text
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ              
```

**签名（signature）**

jwt的第三部分是一个签证信息，这个签证信息由三部分组成：

- header (base64后的)
- payload (base64后的)
- secret(盐，一定要保密）  

这个部分需要base64加密后的header和base64加密后的payload使用.连接组成的字符串，然后通过header中声明的加密方式进行加盐secret组合加密，然后就构成了jwt的第三部分:

```js
var encodedString = base64UrlEncode(header) + '.' + base64UrlEncode(payload); 
var signature = HMACSHA256(encodedString, 'test'); // khA7TNYc7_0iELcDyTc7gHBZ_xfIcgbfpzUNWwQtzME       
```

将这三部分用.连接成一个完整的字符串,构成了最终的jwt:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA
```

注意：secret是保存在服务器端的，jwt的签发生成也是在服务器端的，secret就是用来进行jwt的签发和jwt的验证，所以，它就是你服务端的私钥，在任何场景都不应该流露出去。一旦客户端得知这个secret, 那就意味着客户端是可以自我签发jwt了。

**生成jks 证书文件**

使用jdk自动的工具生成

命令格式 

keytool 

-genkeypair  生成密钥对

-alias jwt(别名) 

-keypass 123456(别名密码) 

-keyalg RSA(生证书的算法名称，RSA是一种非对称加密算法) 

-keysize 1024(密钥长度,证书大小) 

-validity 365(证书有效期，天单位) 

-keystore D:/jwt/jwt.jks(指定生成证书的位置和证书名称) 

-storepass 123456(获取keystore信息的密码)

-storetype (指定密钥仓库类型)

使用 "keytool -help" 获取所有可用命令

```shell
keytool -genkeypair -alias jwt -keyalg RSA -keysize 2048 -keystore D:/jwt.jks              
```

将生成的jwt.jks文件放到授权服务器的resource目录下

![](https://gitee.com/zysspace/pic/raw/master/images/202205031642325.png)

查看公钥信息

```shell
keytool -list -rfc --keystore jwt.jks  | openssl x509 -inform pem -pubkey              

```

**引入依赖**

```
<!-- spring security oauth2-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>

```

#### **配置授权服务器**

```java
/**
 * 配置授权服务器
 */
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {
    
    @Autowired
    private DataSource dataSource;

    @Autowired
    @Qualifier("jwtTokenStore")
    private TokenStore tokenStore;

    @Autowired
    private JwtAccessTokenConverter jwtAccessTokenConverter;

    @Autowired
    private DemoUserDetailService userDetailService;

    @Autowired
    private AuthenticationManager authenticationManagerBean;

    @Autowired
    private DemoTokenEnhancer tokenEnhancer;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 基于DB模式配置授权服务器存储第三方客户端的信息
     * @param clients
     * @throws Exception
     */
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        // 第三方信息的存储   基于jdbc
        clients.withClientDetails(clientDetailsService());

        
    }

    @Bean
    public ClientDetailsService clientDetailsService(){
        return new JdbcClientDetailsService(dataSource);
    }


    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        //配置JWT的内容增强器
        TokenEnhancerChain enhancerChain = new TokenEnhancerChain();
        List<TokenEnhancer> delegates = new ArrayList<>();
        delegates.add(tokenEnhancer);
        delegates.add(jwtAccessTokenConverter);
        enhancerChain.setTokenEnhancers(delegates);
        
        //使用密码模式需要配置
        endpoints.authenticationManager(authenticationManagerBean)
                .reuseRefreshTokens(false)  //refresh_token是否重复使用
                .userDetailsService(userDetailService) //刷新令牌授权包含对用户信息的检查
                .tokenStore(tokenStore)  //指定token存储策略是jwt
                .accessTokenConverter(jwtAccessTokenConverter)
                .tokenEnhancer(enhancerChain) //配置tokenEnhancer
                .allowedTokenEndpointRequestMethods(HttpMethod.GET,HttpMethod.POST); //支持GET,POST请求
    }
    
    /**
     * 授权服务器安全配置
     * @param security
     * @throws Exception
     */
    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        //第三方客户端校验token需要带入 clientId 和clientSecret来校验
        security.checkTokenAccess("isAuthenticated()")
                .tokenKeyAccess("isAuthenticated()");//来获取我们的tokenKey需要带入clientId,clientSecret
        
        //允许表单认证
        security.allowFormAuthenticationForClients();
    }
    

}
```

在oauth_client_details表中添加第三方客户端信息（client_id  client_secret  scope等等）

```mysql
CREATE TABLE `oauth_client_details`  (
  `client_id` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `resource_ids` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `client_secret` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `scope` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `authorized_grant_types` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `web_server_redirect_uri` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `authorities` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `access_token_validity` int(11) NULL DEFAULT NULL,
  `refresh_token_validity` int(11) NULL DEFAULT NULL,
  `additional_information` varchar(4096) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `autoapprove` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`client_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

INSERT INTO `oauth_client_details` VALUES ('client', NULL, '$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6', 'all', 'authorization_code,password,refresh_token', 'http://www.baidu.com', NULL, 3600, 864000, NULL, NULL);
INSERT INTO `oauth_client_details` VALUES ('gateway', NULL, '$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6', 'all', 'authorization_code,password,refresh_token', NULL, NULL, 3600, 864000, NULL, NULL);
INSERT INTO `oauth_client_details` VALUES ('member', NULL, '$2a$10$CE1GKj9eBZsNNMCZV2hpo.QBOz93ojy9mTd9YQaOy8H4JAyYKVlm6', 'read,write', 'password,refresh_token', NULL, NULL, 3600, 864000, NULL, NULL);

```

#### **配置SpringSecurity**

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Autowired
    private DemoUserDetailService userDetailService;



    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().permitAll()
                .and().authorizeRequests()
                .antMatchers("/oauth/**").permitAll()
                .anyRequest()
                .authenticated()
                .and().logout().permitAll()
                .and().csrf().disable();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailService);
    }
    
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // oauth2 密码模式需要拿到这个bean
        return super.authenticationManagerBean();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}
```

**获取会员信息，此处通过feign从member获取会员信息**

```java

@Service
@Slf4j
public class DemoUserDetailService implements UserDetailsService {

    @Autowired
    private UmsMemberFeignService umsMemberFeignService;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {


        // 加载用户信息
        if (StringUtils.isEmpty(username)) {
            log.warn("用户登陆用户名为空:{}", username);
            throw new UsernameNotFoundException("用户名不能为空");
        }
        
        UmsMember umsMember = getByUsername(username);
        
        if (null == umsMember) {
            log.warn("根据用户名没有查询到对应的用户信息:{}", username);
        }
        
        log.info("根据用户名:{}获取用户登陆信息:{}", username, umsMember);
        
        // 会员信息的封装 implements UserDetails
        MemberDetails memberDetails = new MemberDetails(umsMember);
        
        return memberDetails;
    }



    public UmsMember getByUsername(String username) {


        CommonResult<UmsMember> memberResult = umsMemberFeignService.loadUserByUsername(username);


        return memberResult.getData();

    }
}


@FeignClient(value = "member",path="/member/center")
public interface UmsMemberFeignService {
    
    @RequestMapping("/loadUmsMember")
    CommonResult<UmsMember> loadUserByUsername(@RequestParam("username") String username);

```

#### JWT配置

```java
@Configuration
@EnableConfigurationProperties(value = JwtCAProperties.class)
public class JwtTokenStoreConfig {

    @Autowired
    private JwtCAProperties jwtCAProperties;

    @Bean
    public TokenStore jwtTokenStore(){
        return new JwtTokenStore(jwtAccessTokenConverter());
    }
    
    @Bean
    public DemoTokenEnhancer demoTokenEnhancer() {
        return new DemoTokenEnhancer();
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter(){
        JwtAccessTokenConverter accessTokenConverter = new JwtAccessTokenConverter();

        //配置JWT使用的秘钥 非对称加密
        accessTokenConverter.setKeyPair(keyPair());
        return accessTokenConverter;
    }
    

    
    @Bean
    public KeyPair keyPair() {
        KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(new ClassPathResource(jwtCAProperties.getKeyPairName()), jwtCAProperties.getKeyPairSecret().toCharArray());
        return keyStoreKeyFactory.getKeyPair(jwtCAProperties.getKeyPairAlias(), jwtCAProperties.getKeyPairStoreSecret().toCharArray());
    }
}
```

​          

```java
@Data
@ConfigurationProperties(prefix = "demo.jwt")
public class JwtCAProperties {

    /**
     * 证书名称
     */
    private String keyPairName;


    /**
     * 证书别名
     */
    private String keyPairAlias;

    /**
     * 证书私钥
     */
    private String keyPairSecret;

    /**
     * 证书存储密钥
     */
    private String keyPairStoreSecret;

}
```

yml中添加jwt配置

```yaml
demo:
  jwt:
    keyPairName: jwt.jks
    keyPairAlias: jwt
    keyPairSecret: 123123
    keyPairStoreSecret: 123123
```

#### 扩展JWT中的存储内容

有时候我们需要扩展JWT中存储的内容，根据自己业务添加字段到Jwt中。 继承TokenEnhancer实现一个JWT内容增强器 

```java
public class DemoTokenEnhancer implements TokenEnhancer {


    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {

        MemberDetails memberDetails = (MemberDetails) authentication.getPrincipal();

        final Map<String, Object> additionalInfo = new HashMap<>();

        final Map<String, Object> retMap = new HashMap<>();

        //todo 可以根据自己的业务需要 进行添加字段
        additionalInfo.put("memberId",memberDetails.getUmsMember().getId());
        additionalInfo.put("nickName",memberDetails.getUmsMember().getNickname());

        retMap.put("additionalInfo",additionalInfo);

        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(retMap);

        return accessToken;
    }
}
```

#### **配置资源服务器**

这个配置是为了测试，实际中可以省略

```java
@Configuration
@EnableResourceServer
public class TulingResourceServerConfig  extends ResourceServerConfigurerAdapter {
    
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated();
        
    }
}

@RestController
@RequestMapping("/user")
public class UserController {
    
    @RequestMapping("/getCurrentUser")
    public Object getCurrentUser(Authentication authentication) {
        return authentication.getPrincipal();
    }
}
```



#### 通过密码模式测试获取token

```
http://localhost:9999/oauth/token?username=test&password=test&grant_type=password&client_id=member&client_secret=123123&scope=read
```

![](https://gitee.com/zysspace/pic/raw/master/images/202205031651985.png)

#### 获取token_key

![](https://gitee.com/zysspace/pic/raw/master/images/202205031652273.png)

#### 测试携带token访问资源

![](https://gitee.com/zysspace/pic/raw/master/images/202205031656594.png)

也可以请求头配置Authorization

​    ![0](https://note.youdao.com/yws/public/resource/7b3179e6fa5d39fb758bb4677fb7e2df/xmlnote/F59CE2C295394F0C806CAE038C520E7E/16192)

#### 校验token

![](https://gitee.com/zysspace/pic/raw/master/images/202205031658873.png)

### 配置网关服务

主要流程：

网关在启动时候，调用http://auth/oauth/token_key 获取公钥

   1.过滤不需要认证的url,比如/oauth/** 

2. 获取token ：从请求头中解析 Authorization  value:  bearer xxxxxxx  或者从请求参数中解析 access_token 
3.  校验token ：拿到token后，通过公钥（需要从授权服务获取公钥）校验 ， 校验失败或超时抛出异常 
4. 校验通过后，从token中获取的用户登录信息存储到请求头中              

```yaml
server:
  port: 8888
spring:
  application:
    name: gateway
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        namespace: 3ce28365-5914-4a66-9fc7-03d630fbf400

    gateway:
      discovery:
        locator:
          enabled: true
      enabled: true
      routes:
      - id: user
        uri: lb://user
        predicates:
        - Path=/member/**,/sso/**
      - id: auth
        uri: lb://auth
        predicates:
        - Path=/oauth/**

demo:
  gateway:
    shouldSkipUrls:
    - /oauth/**
    - /sso/**
```

```
     <!--添加jwt相关的包-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.10.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.10.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.10.5</version>
            <scope>runtime</scope>
        </dependency>
```

#### 全局过滤器进行权限的校验拦截 

```java
@Component
@Order(0)
@EnableConfigurationProperties(value = NotAuthUrlProperties.class)
@Slf4j
public class AuthenticationFilter implements GlobalFilter, InitializingBean {

    /**
     * jwt的公钥,需要网关启动,远程调用认证中心去获取公钥
     */
    private PublicKey publicKey;

    @Autowired
    private RestTemplate restTemplate;
    
    /**
     * 请求各个微服务 不需要用户认证的URL
     */
    @Autowired
    private NotAuthUrlProperties notAuthUrlProperties;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        //1.过滤不需要认证的url,比如/oauth/**
        String currentUrl = exchange.getRequest().getURI().getPath();
    
        //过滤不需要认证的url
        if(shouldSkip(currentUrl)) {
            //log.info("跳过认证的URL:{}",currentUrl);
            return chain.filter(exchange);
        }
        //log.info("需要认证的URL:{}",currentUrl);
        
    
        //2. 获取token
        // 从请求头中解析 Authorization  value:  bearer xxxxxxx
        // 或者从请求参数中解析 access_token
        //第一步:解析出我们Authorization的请求头  value为: “bearer XXXXXXXXXXXXXX”
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
    
        //第二步:判断Authorization的请求头是否为空
        if(StringUtils.isEmpty(authHeader)) {
            log.warn("需要认证的url,请求头为空");
            throw new GateWayException(ResultCode.AUTHORIZATION_HEADER_IS_EMPTY);
        }
    
        //3. 校验token
        // 拿到token后，通过公钥（需要从授权服务获取公钥）校验
        // 校验失败或超时抛出异常
        //第三步 校验我们的jwt 若jwt不对或者超时都会抛出异常
        Claims claims = JwtUtils.validateJwtToken(authHeader,publicKey);
    
        //4. 校验通过后，从token中获取的用户登录信息存储到请求头中
        //第四步 把从jwt中解析出来的 用户登陆信息存储到请求头中
        ServerWebExchange webExchange = wrapHeader(exchange,claims);
        
        return chain.filter(webExchange);
    }
    
    private ServerWebExchange wrapHeader(ServerWebExchange serverWebExchange,Claims claims) {
        
        String loginUserInfo = JSON.toJSONString(claims);
        
        //log.info("jwt的用户信息:{}",loginUserInfo);
        
        String memberId = claims.get("additionalInfo", Map.class).get("memberId").toString();
        
        String nickName = claims.get("additionalInfo",Map.class).get("nickName").toString();
        
        //向headers中放文件，记得build
        ServerHttpRequest request = serverWebExchange.getRequest().mutate()
                .header("username",claims.get("user_name",String.class))
                .header("memberId",memberId)
                .header("nickName",nickName)
                .build();
        
        //将现在的request 变成 change对象
        return serverWebExchange.mutate().request(request).build();
    }
    
    private boolean shouldSkip(String currentUrl) {
        //路径匹配器(简介SpringMvc拦截器的匹配器)
        //比如/oauth/** 可以匹配/oauth/token    /oauth/check_token等
        PathMatcher pathMatcher = new AntPathMatcher();
        for(String skipPath:notAuthUrlProperties.getShouldSkipUrls()) {
            if(pathMatcher.match(skipPath,currentUrl)) {
                return true;
            }
        }
        return false;
    }
    

    

    
    @Override
    public void afterPropertiesSet() throws Exception {
        //获取公钥  TODO
        // http://auth/oauth/token_key
        this.publicKey = JwtUtils.genPulicKey(restTemplate);
    }
}

```

不需要权限认证的url

```java
@Data
@ConfigurationProperties("demo.gateway")
public class NotAuthUrlProperties {

    private LinkedHashSet<String> shouldSkipUrls;
}
```

工具类

```java
@Slf4j
public class JwtUtils {

    /**
     * 认证服务器许可我们的网关的clientId(需要在oauth_client_details表中配置)
     */
    private static final String CLIENT_ID = "gateway";

    /**
     * 认证服务器许可我们的网关的client_secret(需要在oauth_client_details表中配置)
     */
    private static final String CLIENT_SECRET = "123123";

    /**
     * 认证服务器暴露的获取token_key的地址
     */
    private static final String AUTH_TOKEN_KEY_URL = "http://auth/oauth/token_key/";

    /**
     * 请求头中的 token的开始
     */
    private static final String AUTH_HEADER = "bearer ";

    /**
     * 方法实现说明: 通过远程调用获取认证服务器颁发jwt的解析的key
     * @author:smlz
     * @param restTemplate 远程调用的操作类
     * @return: tokenKey 解析jwt的tokenKey
     * @exception:
     */
    private static String getTokenKeyByRemoteCall(RestTemplate restTemplate) throws GateWayException {

        //第一步:封装请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(CLIENT_ID,CLIENT_SECRET);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(null, headers);

        //第二步:远程调用获取token_key
        try {

            ResponseEntity<Map> response = restTemplate.exchange(AUTH_TOKEN_KEY_URL, HttpMethod.GET, entity, Map.class);

            String tokenKey = response.getBody().get("value").toString();

            log.info("去认证服务器获取Token_Key:{}",tokenKey);

            return tokenKey;

        }catch (Exception e) {

            log.error("远程调用认证服务器获取Token_Key失败:{}",e.getMessage());

            throw new GateWayException(ResultCode.GET_TOKEN_KEY_ERROR);
        }
    }

    /**
     * 方法实现说明:生成公钥
     * @author:smlz
     * @param restTemplate:远程调用操作类
     * @return: PublicKey 公钥对象
     * @exception:
     * @date:2020/1/22 11:52
     */
    public static PublicKey genPulicKey(RestTemplate restTemplate) throws GateWayException {

        String tokenKey = getTokenKeyByRemoteCall(restTemplate);

        try{

            //把获取的公钥开头和结尾替换掉
            String dealTokenKey =tokenKey.replaceAll("\\-*BEGIN PUBLIC KEY\\-*", "").replaceAll("\\-*END PUBLIC KEY\\-*", "").trim();

            java.security.Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

            X509EncodedKeySpec pubKeySpec = new X509EncodedKeySpec(Base64.decodeBase64(dealTokenKey));

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            PublicKey publicKey = keyFactory.generatePublic(pubKeySpec);

            log.info("生成公钥:{}",publicKey);

            return publicKey;

        }catch (Exception e) {

            log.info("生成公钥异常:{}",e.getMessage());

            throw new GateWayException(ResultCode.GEN_PUBLIC_KEY_ERROR);
        }
    }

    public static Claims validateJwtToken(String authHeader,PublicKey publicKey) {
        String token =null ;
        try{
            token = StringUtils.substringAfter(authHeader, AUTH_HEADER);

            Jwt<JwsHeader, Claims> parseClaimsJwt = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(token);

            Claims claims = parseClaimsJwt.getBody();

            //log.info("claims:{}",claims);

            return claims;

        }catch(Exception e){

            log.error("校验token异常:{},异常信息:{}",token,e.getMessage());

            throw new GateWayException(ResultCode.JWT_TOKEN_EXPIRE);
        }
    }
}
```

#### 获取token

网关的端口是8888

![](C:\Users\zys\AppData\Roaming\Typora\typora-user-images\image-20220503175000353.png)

#### 登录

![](https://gitee.com/zysspace/pic/raw/master/images/202205031750723.png)

#### 使用token

![](https://gitee.com/zysspace/pic/raw/master/images/202205031850573.png)

### 总结

以上就是在网关中整合授权服务实现单点登录，希望对大家有帮助。