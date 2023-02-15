---
title: Spring Security原理
author: 程序员子龙
index: true
icon: discover
category:
- Spring

---

Spring Security的功能实现主要就是由一系列过滤器链相互配合完成的。

当初始化Spring Security时，在org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration中会往Spring容器中注入一个名为**SpringSecurityFilterChain**的Servlet过滤器，类型为org.springframework.security.web.FilterChainProxy。它实现了javax.servlet.Filter，因此外部的请求都会经过这个类。

FilterChainProxy是一个代理，真正起作用的是FilterChainProxy中SecurityFilterChain所包含的各个Filter，同时，这些Filter都已经注入到Spring容器中，他们是Spring Security的核心，各有各的职责。但是他们并不直接处理用户的认证和授权，而是把他们交给了认证管理器(AuthenticationManager)和决策管理器(AccessDecisionManager)进行处理。

![](https://pic1.zhimg.com/80/v2-bdd98b2a932b78399bbf34258b3ebed9_720w.png)

项目启动时候打印的过滤器

```
 org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@596dd88d
 org.springframework.security.web.context.SecurityContextPersistenceFilter@78002812
 org.springframework.security.web.header.HeaderWriterFilter@5e93783a
 org.springframework.security.web.authentication.logout.LogoutFilter@621e5270
 org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter@568e8a1a
 org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter@40edd65c
 org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter@5c288735
 org.springframework.security.web.savedrequest.RequestCacheAwareFilter@6d4e288c
 org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@6faecb58
 org.springframework.security.web.authentication.AnonymousAuthenticationFilter@6ecc3f13
 org.springframework.security.web.session.SessionManagementFilter@77e6c7a9
 org.springframework.security.web.access.ExceptionTranslationFilter@59f9844a
 org.springframework.security.web.access.intercept.FilterSecurityInterceptor@6a85289b
```

![](https://pica.zhimg.com/80/v2-0446075367f10d0a053da5c0de7de2a2_720w.png)

介绍过滤器链中主要的几个过滤器及其作用：

**SecurityContextPersistenceFilter** 这个Filter是整个拦截过程的入口和出口（也就是第一个和最后一个拦截器），会在请求开始时从配置好的 SecurityContextRepository 中获取 SecurityContext，然后把它设置给SecurityContextHolder。在请求完成后将SecurityContextHolder 持有的 SecurityContext 再保存到配置好的 SecurityContextRepository，同时清除 securityContextHolder 所持有的 SecurityContext； 

**UsernamePasswordAuthenticationFilter** 用于处理来自表单提交的认证。该表单必须提供对应的用户名和密码，其内部还有登录成功或失败后进行处理的 AuthenticationSuccessHandler 和 AuthenticationFailureHandler，这些都可以根据需求做相关改变；

**FilterSecurityInterceptor** 是用于保护web资源的，使用AccessDecisionManager对当前用户进行授权访问；

**ExceptionTranslationFilter** 能够捕获来自 FilterChain 所有的异常，并进行处理。但是它只会处理两类异常：AuthenticationException 和 AccessDeniedException，其它的异常它会继续抛出。

### 认证流程

![](https://pic1.zhimg.com/80/v2-42bde7bd74d7aa8bbf01bf15626cdd17_720w.png)

1、用户提交用户名、密码被SecurityFilterChain中的 UsernamePasswordAuthenticationFilter 过滤器获取到，封装为请求Authentication，通常情况下是UsernamePasswordAuthenticationToken这个实现类。

```java
public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest)req;
    HttpServletResponse response = (HttpServletResponse)res;
    if (!this.requiresAuthentication(request, response)) {
        chain.doFilter(request, response);
    } else {
   
        Authentication authResult;
        try {
            //登录验证
            authResult = this.attemptAuthentication(request, response);
            if (authResult == null) {
                return;
            }

            this.sessionStrategy.onAuthentication(authResult, request, response);
        } catch (InternalAuthenticationServiceException var8) {
            this.logger.error("An internal error occurred while trying to authenticate the user.", var8);
            this.unsuccessfulAuthentication(request, response, var8);
            return;
        } catch (AuthenticationException var9) {
            this.unsuccessfulAuthentication(request, response, var9);
            return;
        }

        if (this.continueChainBeforeSuccessfulAuthentication) {
            chain.doFilter(request, response);
        }

        this.successfulAuthentication(request, response, chain, authResult);
    }
}
```

```java
public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    if (this.postOnly && !request.getMethod().equals("POST")) {
        throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
    } else {
        String username = this.obtainUsername(request);
        String password = this.obtainPassword(request);
        if (username == null) {
            username = "";
        }

        if (password == null) {
            password = "";
        }

        username = username.trim();
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
        this.setDetails(request, authRequest);
        return this.getAuthenticationManager().authenticate(authRequest);
    }
}
```

UsernamePasswordAuthenticationToken类的继承关系

![](https://pic2.zhimg.com/80/v2-7ad9e89636ac7728e71623da42ca33ef_720w.png)

2、 过滤器将Authentication提交至认证管理器（AuthenticationManager）进行认证



```java
// 加载用户信息
protected final UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
    this.prepareTimingAttackProtection();

    try {
        UserDetails loadedUser = this.getUserDetailsService().loadUserByUsername(username);
        if (loadedUser == null) {
            throw new InternalAuthenticationServiceException("UserDetailsService returned null, which is an interface contract violation");
        } else {
            return loadedUser;
        }
    } catch (UsernameNotFoundException var4) {
        this.mitigateAgainstTimingAttack(authentication);
        throw var4;
    } catch (InternalAuthenticationServiceException var5) {
        throw var5;
    } catch (Exception var6) {
        throw new InternalAuthenticationServiceException(var6.getMessage(), var6);
    }
}
```

```java
// 比较密码
protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
    if (authentication.getCredentials() == null) {
        this.logger.debug("Authentication failed: no credentials provided");
        throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
    } else {
        // 用户输入的密码
        String presentedPassword = authentication.getCredentials().toString();
        if (!this.passwordEncoder.matches(presentedPassword, userDetails.getPassword())) {
            this.logger.debug("Authentication failed: password does not match stored value");
            throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }
    }
}
```

3、认证成功后， AuthenticationManager 身份管理器返回一个被填充满了信息的（包括上面提到的权限信息，身份信息，细节信息，但密码通常会被移除） Authentication 实例。

```java
protected Authentication createSuccessAuthentication(Object principal, Authentication authentication, UserDetails user) {
    UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken(principal, authentication.getCredentials(), this.authoritiesMapper.mapAuthorities(user.getAuthorities()));
    result.setDetails(authentication.getDetails());
    return result;
}
```

4、登录成功之后，将认证后的 Authentication 对象存储到请求线程上下文，这样在授权阶段就可以获取到 Authentication 认证信息，并利用 Authentication 内的权限信息进行访问控制判断。

```java
protected void successfulAuthentication(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain, Authentication authResult)
            throws IOException, ServletException {

        if (logger.isDebugEnabled()) {
            logger.debug("Authentication success. Updating SecurityContextHolder to contain: " + authResult);
        }
　　　　　// 登录成功之后，把认证后的 Authentication 对象存储到请求线程上下文，这样在授权阶段就可以获取到此认证信息进行访问控制判断
        SecurityContextHolder.getContext().setAuthentication(authResult);

        rememberMeServices.loginSuccess(request, response, authResult);

        // Fire event
        if (this.eventPublisher != null) {
            eventPublisher.publishEvent(new InteractiveAuthenticationSuccessEvent(
                    authResult, this.getClass()));
        }

        successHandler.onAuthenticationSuccess(request, response, authResult);
    }
```

主要组件的流程图：

![](https://pic2.zhimg.com/80/v2-7b2bcf2e45cf880736866e56c225d9ca_720w.png)

####  AuthenticationProvider接口：认证处理器

```java
public interface AuthenticationProvider {
    //认证的方法
   Authentication authenticate(Authentication authentication) throws AuthenticationException;
    //支持哪种认证 
   boolean supports(Class<?> var1); }
```

这里对于AbstractUserDetailsAuthenticationProvider，他的support方法就表明他可以处理用户名密码这样的认证。

```java
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
```

####  Authentication认证信息

继承自Principal类，代表一个抽象主体身份。继承了一个getName()方法来表示主体的名称。

```
public interface Authentication extends Principal, Serializable {
	//获取权限信息列表
    Collection<? extends GrantedAuthority> getAuthorities();
	//获取凭证信息。用户输入的密码字符串，在认证过后通常会被移除，用于保障安全。
    Object getCredentials();
	//细节信息，web应用中的实现接口通常为 WebAuthenticationDetails，它记录了访问者的ip地 址和sessionId的值。
    Object getDetails();
	//身份信息，大部分情况下返回的是UserDetails接口的实现类
    Object getPrincipal();

    boolean isAuthenticated();

    void setAuthenticated(boolean var1) throws IllegalArgumentException;
}
```

#### UserDetailsService接口: 获取用户信息

获取用户信息的基础接口，只有一个根据用户名获取用户信息的方法。

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
}
```

在DaoAuthenticationProvider的retrieveUser方法中，会获取spring容器中的UserDetailsService。如果我们没有自己注入UserDetailsService对象，那么在UserDetailsServiceAutoConfiguration类中，会在启动时默认注入一个带user用户的UserDetailsService。

我们可以通过注入自己的UserDetailsService来实现加载自己的数据。

#### UserDetails: 用户信息实体

代表了一个用户实体，包括用户、密码、权限列表，还有一些状态信息，包括账号过期、认证过期、是否启用。

```java
public interface UserDetails extends Serializable {
    Collection<? extends GrantedAuthority> getAuthorities();

    String getPassword();

    String getUsername();

    boolean isAccountNonExpired();

    boolean isAccountNonLocked();

    boolean isCredentialsNonExpired();

    boolean isEnabled();
}
```

#### PasswordEncoder 密码解析器

用来对密码进行加密及解析

```java
public interface PasswordEncoder {、
    //加密
    String encode(CharSequence var1);
	//比较密码
    boolean matches(CharSequence var1, String var2);
	
    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

DaoAuthenticationProvider在additionalAuthenticationChecks方法中会获取Spring容器中的PasswordEncoder来对用户输入的密码进行比较。

#### BCryptPasswordEncoder:

​	这是SpringSecurity中最常用的密码解析器。他使用BCrypt算法。他的特点是加密可以加盐sault，但是解密不需要盐。因为盐就在密文当中。这样可以通过每次添加不同的盐，而给同样的字符串加密出不同的密文。

密文形如：$2a$10$vTUDYhjnVb52iM3qQgi2Du31sq6PRea6xZbIsKIsmOVDnEuGb/.7K

其中：$是分割符，无意义；2a是bcrypt加密版本号；10是cost的值；而后的前22位是salt值；再然后的字符串就是密码的密文了

### 授权流程

Spring Security可以通过http.authorizeRequests()对web请求进行授权保护。Spring Security使用标准Filter建立了对web请求的拦截，最终实现对资源的授权访问。

![](https://pica.zhimg.com/80/v2-f73f7bf8688918f83946da121e565cf7_720w.png)

1、**拦截请求**，已认证用户访问受保护的web资源将被SecurityFilterChain中 FilterSecurityInterceptor 拦截。

```java
//FilterSecurityInterceptor.java
public void doFilter(ServletRequest request, ServletResponse response,
      FilterChain chain) throws IOException, ServletException {
   FilterInvocation fi = new FilterInvocation(request, response, chain);
   invoke(fi);
}
```



2、**获取资源访问策略**，FilterSecurityInterceptor会从 SecurityMetadataSource 的子类DefaultFilterInvocationSecurityMetadataSource 获取要访问当前资源所需要的权限`Collection<ConfigAttribute>` 。 

SecurityMetadataSource其实就是读取访问策略的抽象，而读取的内容，其实就是我们配置的访问规则，读取访问策略如：

```java
http.csrf().disable()//关闭csrg跨域检查
        //这里注意matchere是有顺序的。
        .authorizeRequests()
        .antMatchers("/mobile/**").hasAuthority("mobile")
        .antMatchers("/salary/**").hasAuthority("salary")
        .antMatchers("/common/**").permitAll() //common下的请求直接通过
        .anyRequest().authenticated() //其他请求需要登录
        .and() //并行条件
        .formLogin().defaultSuccessUrl("/main.html").failureUrl("/common/loginFailed");
```

3、**最后**，FilterSecurityInterceptor会调用 AccessDecisionManager 进行授权决策，若决策通过，则允许访问资源，否则将禁止访问。

关于AccessDecisionManager接口，最核心的就是其中的decide方法。这个方法就是用来鉴定当前用户是否有访问对应受保护资源的权限。

```java
public interface AccessDecisionManager {
	//通过传递的参数来决定用户是否有访问对应受保护资源的权限
	void decide(Authentication authentication, Object object,
			Collection<ConfigAttribute> configAttributes) throws AccessDeniedException,
			InsufficientAuthenticationException;
}
```

这里着重说明一下decide的参数：

authentication：要访问资源的访问者的身份

object：要访问的受保护资源，web请求对应FilterInvocation

configAttributes：是受保护资源的访问策略，通过SecurityMetadataSource获取。

#### 决策流程

在AccessDecisionManager的实现类ConsensusBased中，是使用投票的方式来确定是否能够访问受保护的资源。

![](https://pic2.zhimg.com/80/v2-87e168da212e1a5898514c774167ff40_720w.png)

AccessDecisionManager中包含了一系列的AccessDecisionVoter讲会被用来对Authentication是否有权访问受保护对象进行投票，AccessDecisionManager根据投票结果，做出最终角色。

> 为什么要投票？ 因为权限可以从多个方面来进行配置，有角色但是没有资源怎么办？这就需要有不同的处理策略

AccessDecisionVoter是一个接口，定义了三个方法

```java
public interface AccessDecisionVoter<S> {
   int ACCESS_GRANTED = 1;
   int ACCESS_ABSTAIN = 0;
   int ACCESS_DENIED = -1;

   boolean supports(ConfigAttribute attribute);

   boolean supports(Class<?> clazz);

   int vote(Authentication authentication, S object,
         Collection<ConfigAttribute> attributes);
}
```

vote()就是进行投票的方法。投票可以表示赞成、拒绝、弃权。

Spring Security内置了三个基于投票的实现类，分别是AffirmativeBased,ConsensusBasesd和UnanimaousBased

**AffirmativeBased是Spring Security默认使用的投票方式**，他的逻辑是只要有一个投票通过，就表示通过。

​	1、只要有一个投票通过了，就表示通过。

​	2、如果全部弃权也表示通过。

​	3、如果没有人投赞成票，但是有人投反对票，则抛出AccessDeniedException.

**ConsensusBased**的逻辑是：多数赞成就通过

​	1、如果赞成票多于反对票则表示通过

​	2、如果反对票多于赞成票则抛出AccessDeniedException

​	3、如果赞成票与反对票相同且不等于0，并且属性allowIfEqualGrantedDeniedDecisions的值为true，则表示通过，否则抛出AccessDeniedException。参数allowIfEqualGrantedDeniedDecisions的值默认是true。

​	4、如果所有的AccessDecisionVoter都弃权了，则将视参数allowIfAllAbstainDecisions的值而定，如果该值为true则表示通过，否则将抛出异常AccessDeniedException。参数allowIfAllAbstainDecisions的值默认为false。

​	**UnanimousBased**相当于一票否决。

​	1、如果受保护对象配置的某一个ConfifigAttribute被任意的AccessDecisionVoter反对了，则将抛出AccessDeniedException。

​	2、如果没有反对票，但是有赞成票，则表示通过。

​	3、如果全部弃权了，则将视参数allowIfAllAbstainDecisions的值而定，true则通过，false则抛出AccessDeniedException。

​	Spring Security默认是使用的AffirmativeBased投票器，我们同样可以通过往Spring容器里注入的方式来选择投票决定器

```java
@Bean
public AccessDecisionManager accessDecisionManager() {
    List<AccessDecisionVoter<? extends Object>> decisionVoters 
      = Arrays.asList(
        new WebExpressionVoter(),
        new RoleVoter(),
        new AuthenticatedVoter(),
        new MinuteBasedVoter());
    return new UnanimousBased(decisionVoters);
}
```

然后在configure中配置

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
    ...
    .anyRequest()
    .authenticated()
    .accessDecisionManager(accessDecisionManager());
}
```

### 自定义认证

#### 自定义登录页面及登录过程

```java
 //配置安全拦截机制
@Override
protected void configure(HttpSecurity http) throws Exception {
   http
           .authorizeRequests()
           .antMatchers("/r/**").authenticated()    
           .anyRequest().permitAll()                
           .and()
           .formLogin()//允许表单登录
         .loginPage("/login‐view")//自定义登录页面
         .loginProcessingUrl("/login")//自定义登录处理地址
       	.defaultSuccessUrl("/main.html")//指定登录成功后的跳转地址-页面重定向
        // .successForwardUrl("/login‐success")//指定登录成功后的跳转URL - 后端跳转
         .permitAll();
} 
```

#### 将数据源改为从数据库获取数据

修改UserDetails，从数据库加载用户信息。

修改HttpSecurity，从数据库加载授权配置。

####  配置方法与资源绑定关系

##### 	1、代码方式配置

​	Spring Security可以通过HttpSecurity配置URL授权信息，保护URL常用的方法有：

```
authenticated() 保护URL，需要用户登录
permitAll() 指定URL无需保护，一般应用与静态资源文件
hasRole(String role) 限制单个角色访问。角色其实相当于一个"ROLE_"+role的资源。
hasAuthority(String authority) 限制单个权限访问
hasAnyRole(String… roles)允许多个角色访问. 
hasAnyAuthority(String… authorities) 允许多个权限访问. 
access(String attribute) 该方法使用 SpEL表达式, 所以可以创建复杂的限制. 
hasIpAddress(String ipaddressExpression) 限制IP地址或子网
```

##### 	2、注解方式配置

​	Spring Security除了可以通过HttpSecurity配置授权信息外，还提供了注解方式对方法进行授权。

​	注解方式需要先在启动加载的类中打开 @EnableGlobalMethodSecurity(securedEnabled=true) 注解，然后在需要权限管理的方法上使用@Secured(Resource)的方式配合权限。其中

```
@EnableGlobalMethodSecurity(securedEnabled=true) 开启@Secured 注解过滤权限
	打开后@Secured({"ROLE_manager","ROLE_admin"}) 表示方法需要有manager和admin两个角色才能访问
	另外@Secured注解有些关键字，比如IS_AUTHENTICATED_ANONYMOUSLY 表示可以匿名登录。
@EnableGlobalMethodSecurity(jsr250Enabled=true)	开启@RolesAllowed 注解过滤权限 

@EnableGlobalMethodSecurity(prePostEnabled=true) 使用表达式时间方法级别的安全性，打开后可以使用一下几个注解。
    @PreAuthorize 在方法调用之前,基于表达式的计算结果来限制对方法的访问。例如@PreAuthorize("hasRole('normal') AND hasRole('admin')")
    @PostAuthorize 允许方法调用,但是如果表达式计算结果为false,将抛出一个安全性异常。此注释支持使用returnObject来表示返回的对象。例如@PostAuthorize(" returnObject!=null &&  returnObject.username == authentication.name")
    @PostFilter 允许方法调用,但必须按照表达式来过滤方法的结果
    @PreFilter 允许方法调用,但必须在进入方法之前过滤输入值
```

### 会话控制

#### 	获取当前用户信息

用户认证通过后，为了避免用户的每次操作都进行认证可将用户的信息保存在会话中。spring security提供会话管

理，认证通过后将身份信息放入SecurityContextHolder上下文，SecurityContext与当前线程进行绑定，方便获取

用户身份。

可以通过为SecurityContextHolder.getContext().getAuthentication()获取当前登录用户信息。

```java
@RestController
@RequestMapping("/common")
public class LoginController {

    @GetMapping("/getLoginUserByPrincipal")
    public String getLoginUserByPrincipal(Principal principal){
        return principal.getName();
    }
    @GetMapping(value = "/getLoginUserByAuthentication")
    public String currentUserName(Authentication authentication) {
        return authentication.getName();
    }
    @GetMapping(value = "/username")
    public String currentUserNameSimple(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        return principal.getName();
    }
    @GetMapping("/getLoginUser")
    public String getLoginUser(){
        Principal principal = (Principal)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getName();
    }

}
```



####  会话控制

​	可以通过配置sessonCreationPolicy参数来了控制如何管理Session。

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http.sessionManagement()
       .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) }
```

这个属性有几个选项：

| 机制       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| always     | 如果没有Session就创建一个                                    |
| ifRequired | 如果需要就在登录时创建一个，默认策略                         |
| never      | SpringSecurity将不会创建Session。但是如果应用中其他地方创建了Session，那么Spring Security就会使用。 |
| stateless  | SpringSecurity将绝对不创建Session，也不使用。适合于一些REST API的无状态场景。 |

####  会话超时

​	会话超时时间可以通过spring boot的配置直接审定。

```properties
server.servlet.session.timeout=3600s
```

session超时后，可以通过SpringSecurity的http配置跳转地址

```java
http.sessionManagement()
   .expiredUrl("/login‐view?error=EXPIRED_SESSION")
   .invalidSessionUrl("/login‐view?error=INVALID_SESSION");
```

expired是指session过期，invalidSession指传入的sessionId失效。

#### 安全会话cookie

我们可以使用httpOnly和secure标签来保护我们的会话cookie：

**httpOnly**：如果为true，那么浏览器脚本将无法访问cookie

**secure**：如果为true，则cookie将仅通过HTTPS连接发送

spring boot 配置文件：

```properties
server.servlet.session.cookie.http‐only=true
server.servlet.session.cookie.secure=true
```

#### 退出

​	Spring Security默认实现了logout退出，直接访问/logout就会跳转到登出页面，而ajax访问/logout就可以直接退出。

​	在WebSecurityConfifig的config(HttpSecurity http)中，也是可以配置退出的一些属性，例如自定义退出页面、定义推出后的跳转地址。

```java
http
.and()
.logout() //提供系统退出支持，使用 WebSecurityConfigurerAdapter 会自动被应用
.logoutUrl("/logout") //默认退出地址
.logoutSuccessUrl("/login‐view?logout") //退出后的跳转地址
    .addLogoutHandler(logoutHandler) //添加一个LogoutHandler，用于实现用户退出时的清理工作.默认 SecurityContextLogoutHandler 会被添加为最后一个 LogoutHandler 。
    .invalidateHttpSession(true);  //指定是否在退出时让HttpSession失效，默认是true
```

在退出操作时，会做以下几件事情：

 1、使HTTP Session失效。

2、清除SecurityContextHolder

3、跳转到定义的地址。

**logoutHandler**

一般来说， LogoutHandler 的实现类被用来执行必要的清理，因而他们不应该抛出异常。

下面是Spring Security提供的一些实现：

- PersistentTokenBasedRememberMeServices 基于持久化token的**RememberMe**功能的相关清理

- TokenBasedRememberMeService 基于token的**RememberMe**功能的相关清理

- CookieClearingLogoutHandler 退出时Cookie的相关清理

- CsrfLogoutHandler 负责在退出时移除csrfToken

- SecurityContextLogoutHandler 退出时SecurityContext的相关清理

链式API提供了调用相应的 LogoutHandler 实现的快捷方式，比如deleteCookies()。