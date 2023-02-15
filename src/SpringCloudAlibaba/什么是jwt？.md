---
title: 什么是jwt
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
### 什么是jwt

以下是官网解释

> JSON Web Token (JWT) 是一个开放标准 ( [RFC 7519](https://tools.ietf.org/html/rfc7519) )，它定义了一种紧凑且自包含的方式，用于在各方之间作为 JSON 对象安全地传输信息。该信息可以被验证和信任，因为它是经过数字签名的。JWT 可以使用秘密（使用**HMAC**算法）或使用**RSA**或**ECDSA**的公钥/私钥对进行**签名**。
>
> 虽然 JWT 可以加密以在各方之间提供保密，但我们将重点关注*签名*令牌。签名令牌可以验证其中包含的声明的*完整性*，而加密令牌则对其他方*隐藏*这些声明。当使用公钥/私钥对对令牌进行签名时，签名还证明只有持有私钥的一方才是对其进行签名的一方。

官网： https://jwt.io/ 

标准： https://tools.ietf.org/html/rfc7519 

JWT令牌的优点： 

1. jwt基于json，非常方便解析。 

2. 可以在令牌中自定义丰富的内容，易扩展。 

3. 通过非对称加密算法及数字签名技术，JWT防止篡改，安全性高。 

4. 资源服务使用JWT可不依赖授权服务即可完成授权。 

缺点：

JWT令牌较长，占存储空间比较大。 

### jwt应用场景

- **授权**：这是使用 JWT 最常见的场景。用户登录后，每个后续请求都将包含 JWT，允许用户访问该令牌允许的路由、服务和资源。单点登录是当今广泛使用 JWT 的一项功能，因为它的开销很小，并且能够轻松跨不同域使用。
- **信息交换**：JSON Web Tokens 是一种在各方之间安全传输信息的好方法。因为 JWT 可以被签名——例如，使用公钥/私钥对——你可以确定发件人就是他们所说的那样。此外，由于使用标头和有效负载计算签名，因此您还可以验证内容是否未被篡改。

### **JWT组成**

一个JWT实际上就是一个字符串，它由用（.）分割的三部分组成，头部（header）、载荷（payload）与签名 （signature）。

因此，JWT 通常如下所示。

```java
xxxxx.yyyyy.zzzzz
```

![](https://gitee.com/zysspace/pic/raw/master/images/202205042117032.png)

接下来分别介绍这三个部分

#### **头部（**header**）** 

头部用于描述关于该JWT的最基本的信息：类型（即JWT）以及签名所用的算法（如 HMACSHA256或RSA）等。 

这也可以被表示成一个JSON对象：

```json
{  
 "alg": "HS256",
 "typ": "JWT" 
}
```

然后，这个 JSON 被**Base64Url**编码以形成 JWT 的第一部分。

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9 
```

#### **载荷（payload**）

存放有效信息的地方，包含三个部分：

- 标准中注册的声明（建议但不强制使用），例如，iss: jwt签发者，sub: jwt所面向的用户 ，aud: 接收jwt的一方 ,exp: jwt的过期时间，这个过期时间必须要大于签发时间 ,nbf: 定义在什么时间之前，该jwt都是不可用的，iat: jwt的签发时间 ,jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

​		**iss**: jwt签发者

​		**sub**: jwt所面向的用户

​		**aud**: 接收jwt的一方

​		**exp**: jwt的过期时间，这个过期时间必须要大于签发时间

​		**nbf**: 定义在什么时间之前，该jwt都是不可用的.

​		**iat**: jwt的签发时间

​		**jti**: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

- 公共声明：公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不 建议添加敏感信息，因为该部分在客户端可解密。
- 私有的声明 ：私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，该部分信息可以归类为明文信息

定义一个有效载荷

```json
{
  "sub": "1234567890",
  "name": "Jack",
  "iat": 1516239022
}
```

然后将其进行base64加密，得到Jwt的第二部分: 

```
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphY2siLCJpYXQiOjE1MTYyMzkwMjJ9
```

#### **签名（**signature**）** 

jwt的第三部分是一个签证信息，这个签证信息由三部分组成： 

- header (base64加密后的) 

- payload (base64加密后的) 

- secret(密钥，在服务端） 

这个部分需要base64加密后的header和base64加密后的payload使用.连接组成的字符串，然后通过header中声明的加密方式进行加盐secret组合加密，然后就构成了jwt的第三部分: 

```
var encodedString = base64UrlEncode(header) + '.' + base64UrlEncode(payload);
var signature = HMACSHA256(encodedString, 'test');
5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA
```

把这三个部分连在一起就得到一个完整的jwt

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA
```

注意：secret是保存在服务器端的，jwt的签发生成也是在服务器端的，secret就是用来进行jwt的 签发和jwt的验证，所以，它就是你服务端的私钥，在任何场景都不应该流露出去。

### jwt使用

是在请求头里加入Authorization，并加上Bearer标注：`Authorization: Bearer <token>`

下图显示了如何获取 JWT 并将其用于访问 API 或资源：

![JSON 网络令牌如何工作](https://cdn2.auth0.com/docs/media/articles/api-auth/client-credentials-grant.png)

1. 应用程序或客户端向授权服务器请求授权。

2. 当授权被授予时，授权服务器向应用程序返回一个访问令牌。

3. 应用程序使用访问令牌来访问受保护的资源（如 API）。

   

### 快速使用

JJWT是一个提供端到端的JWT创建和验证的Java库。永远免费和开源(Apache License，版本2.0)，JJWT很容易使用和理解。它被设计成一个以建筑为中心的流畅界面，隐藏了它的大部分复杂性。

引入依赖

```java
　　<dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.6.0</version>
     </dependency>   
      
```

生成token

```java

private static final String SECRETKEY="1111111";

@Test
public void test() {

    Map map = new HashMap();
    map.put("phone","13211111");
    map.put("email","11@qq.com");
    //创建一个JwtBuilder对象
    JwtBuilder jwtBuilder = Jwts.builder()
            //声明的标识{"jti":"666"}
            .setId("666")
            //主体，用户{"sub":"jack"}
            .setSubject("jack")
            //创建日期{"ita":"xxxxxx"}
            .setIssuedAt(new Date())
            //设置过期时间   10分钟
            .setExpiration(new Date(System.currentTimeMillis()+600*1000))
            //claims 有效载荷
            .addClaims(map)
            .claim("roles","admin")
            //签名手段，参数1：算法，参数2：密钥
            .signWith(SignatureAlgorithm.HS256, SECRETKEY);
    //获取token   jwt
    String token = jwtBuilder.compact();
    System.out.println(token);

    //三部分的base64解密
    String[] split = token.split("\\.");
    //{"alg":"HS256"}
    System.out.println(Base64Codec.BASE64.decodeToString(split[0]));
    
    //{"jti":"666","sub":"jack","iat":1636896993,"exp":1636897053,"phone":"13211111",
    "email":"11@qq.com","roles":"admin","logo":"xxx.jpg"}
    System.out.println(Base64Codec.BASE64.decodeToString(split[1]));
    //base64无法解密
    System.out.println(Base64Codec.BASE64.decodeToString(split[2]));
}
```

验证解析token

```Java
public void testParseToken(){
    //token
    String token ="eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NjYiLCJzdWIiOiJqYWNrIiwiaWF0IjoxNjM2ODk3NDk2LCJleHAiOjE2MzY4OTgwOTYsInBob25lIjoiMTMyMTExMTEiLCJlbWFpbCI6IjExQHFxLmNvbSIsInJvbGVzIjoiYWRtaW4iLCJsb2dvIjoieHh4LmpwZyJ9.VHZDARQFehcZZsp9Uurd4yWY_TwBwi8UVN01s3r7cfU";
    //解析token获取载荷中的声明对象
    Claims claims = Jwts.parser()
            .setSigningKey(SECRETKEY)
            .parseClaimsJws(token)
            .getBody();

    System.out.println("id:"+claims.getId());
    System.out.println("subject:"+claims.getSubject());
    System.out.println("issuedAt:"+claims.getIssuedAt());

    DateFormat sf =new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    System.out.println("签发时间:"+sf.format(claims.getIssuedAt()));
    System.out.println("过期时间:"+sf.format(claims.getExpiration()));
    System.out.println("当前时间:"+sf.format(new Date()));

    System.out.println("roles:"+claims.get("roles"));
}
```

打印结果：

```
id:666
subject:jack
issuedAt:Sun Nov 14 21:44:56 CST 2021
签发时间:2021-11-14 21:44:56
过期时间:2021-11-14 21:54:56
当前时间:2021-11-14 21:45:30
roles:admin
```

### **Spring Security 整合Oauth2**、JWT

```
<dependency> 

    <groupId>org.springframework.security</groupId> 

    <artifactId>spring‐security‐jwt</artifactId> 

    <version>1.0.9.RELEASE</version> 

</dependency> 
```

