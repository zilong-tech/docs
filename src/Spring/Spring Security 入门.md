---
title: Spring Security 入门
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
## 一、基本概念

### 认证

用户认证就是判断一个用户的身份是否合法的过程，用户去访问系统资源时系统要求验证用户的身份信息，身份合法方可继续访问，不合法则拒绝访问。常见的用户身份认证方式有：用户名密码登录，二维码登录，手机短信登录，指纹认证等方式。

​	**系统为什么要认证？**

认证是为了保护系统的隐私数据与资源，用户的身份合法方可访问该系统的资源。

​	**怎么进行认证？**

### 授权

授权是用户认证通过后，根据用户的权限来控制用户访问资源的过程，拥有资源的访问权限则正常访问，没有权限则拒绝访问。

​	**为什么要授权？**

认证是为了保证用户身份的合法性，授权则是为了更细粒度的对隐私数据进行划分，授权是在认证通过后发生的，

控制不同的用户能够访问不同的资源。

### 会话

用户认证通过后，为了避免用户的每次操作都进行认证可将用户的信息保证在会话中。会话就是系统为了保持当前用户的登录状态所提供的机制，常见的有基于session方式、基于token方式等。

### RBAC模型

​	主体  -》 角色 -》 资源 -》行为 

#### RBAC0

RBAC0，它是RBAC0的核心，RBAC1、RBAC2、RBAC3都是先后在RBAC0上的扩展。RBAC0定义了能构成RBAC控制系统的最小的元素集合

RBAC0的模型中包括用户（U）、角色（R）和许可权（P）等3类实体集合。

RABC0权限管理的核心部分，其他的版本都是建立在0的基础上的，看一下类图：

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718232915978-1523363972.png)](http://images.cnitblog.com/blog/453361/201406/171727267394181.png)

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718232947946-1720181992.png)](http://images.cnitblog.com/blog/453361/201406/171727279428882.png)

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233021108-129680533.png)](http://images.cnitblog.com/blog/453361/201406/171727283952955.png)

RBAC0定义了能构成一个RBAC控制系统的最小的元素集合。

在RBAC之中,包含用户users(USERS)、角色roles(ROLES)、目标objects(OBS)、操作operations(OPS)、许可权permissions(PRMS)五个基本数据元素，此模型指明用户、角色、访问权限和会话之间的关系。

每个角色至少具备一个权限，每个用户至少扮演一个角色；可以对两个完全不同的角色分配完全相同的访问权限；会话由用户控制，一个用户可以创建会话并激活多个用户角色，从而获取相应的访问权限，用户可以在会话中更改激活角色，并且用户可以主动结束一个会话。

用户和角色是多对多的关系，表示一个用户在不同的场景下可以拥有不同的角色。

例如项目经理也可以是项目[架构](http://lib.csdn.net/base/architecture)师等；当然了一个角色可以给多个用户，例如一个项目中有多个组长，多个组员等。

这里需要提出的是，将用户和许可进行分离，是彼此相互独立，使权限的授权认证更加灵活。

角色和许可（权限）是多对多的关系，表示角色可以拥有多分权利，同一个权利可以授给多个角色都是非常容易理解的，想想现实生活中，当官的级别不同的权限的情景，其实这个模型就是对权限这方面的一个抽象，联系生活理解就非常容易了。

#### RBAC1

RBAC1，基于RBAC0模型，引入角色间的继承关系，即角色上有了上下级的区别，角色间的继承关系可分为一般继承关系和受限继承关系。一般继承关系仅要求角色继承关系是一个绝对[偏序关系](http://baike.baidu.com/view/1469650.htm)，允许角色间的多继承。而受限继承关系则进一步要求角色继承关系是一个树结构，实现角色间的单继承。

这种模型合适于角色之间的层次明确，包含明确。

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233058109-1441185946.png)](http://images.cnitblog.com/blog/453361/201406/171728206455450.png)

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233128156-1099621828.png)](http://images.cnitblog.com/blog/453361/201406/171728213791309.png)

####  RBAC2

RBAC2，基于RBAC0模型的基础上，进行了角色的访问控制。

RBAC2模型中添加了责任分离关系。RBAC2的约束规定了权限被赋予角色时，或角色被赋予用户时，以及当用户在某一时刻激活一个角色时所应遵循的强制性规则。责任分离包括静态责任分离和动态责任分离。约束与用户-角色-权限关系一起决定了RBAC2模型中用户的访问许可，此约束有多种。

- 互斥角色 ：同一用户只能分配到一组互斥角色集合中至多一个角色，支持责任分离的原则。互斥角色是指各自权限互相制约的两个角色。对于这类角色一个用户在某一次活动中只能被分配其中的一个角色，不能同时获得两个角色的使用权。常举的例子：在审计活动中，一个角色不能同时被指派给会计角色和审计员角色。
- 基数约束 ：一个角色被分配的用户数量受限；一个用户可拥有的角色数目受限；同样一个角色对应的访问权限数目也应受限，以控制高级权限在系统中的分配。例如公司的领导人有限的；
- 先决条件角色 ：可以分配角色给用户仅当该用户已经是另一角色的成员；对应的可以分配访问权限给角色，仅当该角色已经拥有另一种访问权限。指要想获得较高的权限，要首先拥有低一级的权限。就像我们生活中，国家主席是从副主席中选举的一样。
- 运行时互斥 ：例如，允许一个用户具有两个角色的成员资格，但在运行中不可同时激活这两个角色。

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233200752-675954436.png)](http://images.cnitblog.com/blog/453361/201406/171728219429179.png)

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233239290-981749804.png)](http://images.cnitblog.com/blog/453361/201406/171728235048924.png)

 

#### RBAC3

RBAC3，也就是最全面级的权限管理，它是基于RBAC0的基础上，将RBAC1和RBAC2进行整合了，最前面，也最复杂的：

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233317317-1505187782.png)](http://images.cnitblog.com/blog/453361/201406/171728240203782.png)

[![bubuko.com,布布扣](https://img2018.cnblogs.com/blog/1112483/201907/1112483-20190718233345768-280759371.png)](http://images.cnitblog.com/blog/453361/201406/171728248487668.png)

综上为权限管理模型的相关介绍，其实在任何系统中都会涉及到权限管理的模块，无论复杂简单，我们都可以通过以RBAC模型为基础，进行相关灵活运用来解决我们的问题。

## 二、SpringBoot Security 快速上手

1、引入依赖

```java
 <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
```

2、注入免密解析器PasswordEncoder和用户来源UserDetailsService

```
@Configuration
public class MyWebConfig implements WebMvcConfigurer {
    //默认Url根路径跳转到/login，此url为spring security提供
    @Override
    public void addViewControllers(ViewControllerRegistry registry)
    {
        registry.addViewController("/").setViewName("redirect:/login");
    }

    /**
     * 自行注入一个PasswordEncoder。
     * Security会优先从Spring容器中获取PasswordEncoder.
     * 注入一个不做任何加解密操作的密码处理器用作演示。
     * 一般常用BCryptPasswordEncoder
     * @return
     */

    @Bean
    public PasswordEncoder passwordEncoder() {
//        return NoOpPasswordEncoder.getInstance();
        return new BCryptPasswordEncoder();
    }

    /**
     * 自行注入一个UserDetailsService
     * 如果没有的话，在UserDetailsServiceAutoConfiguration中会默认注入一个包含user用户的InMemoryUserDetailsManager
     * @return
     */
    @Bean
    public UserDetailsService userDetailsService(){
        InMemoryUserDetailsManager userDetailsManager = new InMemoryUserDetailsManager(
        ,User.withUsername("user").password(passwordEncoder().encode("user")).authorities("user").build();
        return userDetailsManager;
    }
```

3、注入校验配置规则

```
/**
 * 注入一个自定义的配置
 */
@EnableWebSecurity
public class MyWebSecurityConfig extends WebSecurityConfigurerAdapter {

    //配置安全拦截策略
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //链式配置拦截策略
        http.csrf().disable()//关闭csrg跨域检查
                .authorizeRequests()
                .antMatchers("/mobile/**").hasAuthority("mobile") //配置资源权限
                .antMatchers("/common/**").permitAll() //common下的请求直接通过
                .anyRequest().authenticated() //其他请求需要登录
                .and() //并行条件
                .formLogin().defaultSuccessUrl("/main.html").failureUrl("/common/loginFailed"); //可从默认的login页面登录，并且登录后跳转到main.html
    }
}

```

3、获取当前用户信息

```
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
    //这种最常用
    @GetMapping("/getLoginUser")
    public String getLoginUser(){
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getUsername();
    }

}
```

4、测试资源

```
@RestController
@RequestMapping("/mobile")
public class MobileController {

    @GetMapping("/query")
    public String query(){
        return "mobile";
    }
}

```

以上搭建了简单的权限控制，在项目中用户信息都是存在数据库中，可以做如下调整：通过注入一个UserDetailsService来管理系统的实体数据。

```java
public class MyUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        return User.withUsername("test").password("test").authorities("test").build();
    }
}

    // 自行注入一个UserDetailsService
    @Bean
    public UserDetailsService userDetailsService(){
        return new MyUserDetailsService();
    }
```

## 三、常用配置

1、自定义授权及安全拦截策略

最常规的方式是通过覆盖WebSecurityConfigurerAdapter中的protected void configure(HttpSecurity http)方法。通过http来配置自定义的拦截规则。包含访问控制、登录页面及逻辑、退出页面及逻辑等。

​	**自定义登录**：http.loginPage()方法配置登录页，http.loginProcessingUrl()方法定制登录逻辑。要注意的是，SpringSecurity的登录页和登录逻辑是同一个地址/login，如果使用自定义的页面，需要将登录逻辑地址也分开。

```java
http
.formLogin()
.loginPage("index.html").loginProcessingUrl("/login")
```

而登录页面的一些逻辑处理，可以参考系统提供的默认登录页。但是这里依然要注意登录页的访问权限。而关于登录页的源码，可以在DefaultLoginPageGeneratingFilter中找到。

**记住我功能**：登录页面提供了记住我功能，此功能只需要往登录时提交一个remeber-me的参数，值可以是 on 、yes 、1 、 true，就会记住当前登录用户的token到cookie中。http.rememberMe().rememberMeParameter("remeber-me")，使用这个配置可以定制参数名。而在登出时，会清除记住我功能的cookie。

**拦截策略**：antMachers()方法设置路径匹配，可以用两个星号代表多层路径，一个星号代表一个或多个字符，问号代表一个字符。

然后配置对应的安全策略：

​	permitAll()所有人都可以访问。denyAll()所有人都不能访问。 anonymous()只有未登录的人可以访问，已经登录的无法访问。

​	hasAuthority、hasRole这些是配置需要有对应的权限或者角色才能访问。 其中，角色就是对应一个ROLE_角色名 这样的一个资源。

注意：anyRequest().authenticated() 之后不能再配置规则，也就是详细的规则要配在前面。

2、关于csrf

csrf全称是Cross—Site Request Forgery 跨站点请求伪造。这是一种安全攻击手段，简单来说，就是黑客可以利用存在客户端的信息来伪造成正常客户，进行攻击。例如你访问网站A，登录后，未退出又打开一个tab页访问网站B，这时候网站B就可以利用保存在浏览器中的sessionId伪造成你的身份访问网站A。

我们在示例中是使用http.csrf().disable()方法简单的关闭了CSRF检查。而其实Spring Security针对CSRF是有一套专门的检查机制的。他的思想就是在后台的session中加入一个csrf的token值，然后向后端发送请求时，对于GET、HEAD、TRACE、OPTIONS以外的请求，例如POST、PUT、DELETE等，会要求带上这个token值进行比对。

当我们打开csrf的检查，再访问默认的登录页时，可以看到在页面的登录form表单中，是有一个name为csrf的隐藏字段的，这个就是csrf的token。例如我们在freemarker的模板语言中可以使用<input type="hidden" name="${csrf.parameterName}"  value="${_csrf.token}"/>添加这个参数。

而在查看Spring Security后台，有一个CsrfFilter专门负责对Csrf参数进行检查。他会调用HttpSessionCsrfTokenRepository生成一个CsrfToken，并将值保存到Session中。

3、注解级别方法支持 

 在@Configuration支持的注册类上打开注解@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled = true,jsr250Enabled = true)即可支持方法及的注解支持。prePostEnabled属性 对应@PreAuthorize。securedEnabled 属性支持@Secured注解，支持角色级别的权限控制。jsr250Enabled属性对应@RolesAllowed注解，等价于@Secured。

