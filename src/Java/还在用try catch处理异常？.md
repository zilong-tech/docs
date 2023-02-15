---
title: 还在用try catch处理异常？
author: 程序员子龙
index: true
icon: discover
category:
- Java 基础

---
在开发过程中，不可避免的是需要处理各种异常，至少有一半以上的时间都是在处理各种异常情况，所以代码中就会出现大量的`try {...} catch {...} finally {...}` 代码块，不仅有大量的冗余代码，而且还影响代码的可读性。

既然业务代码不显式地对异常进行捕获、处理，而异常肯定还是处理的，不然系统岂不是动不动就崩溃了，所以必须得有地方捕获并处理这些异常。

使用断言和枚举类相结合的方式，再配合统一异常处理，基本大部分的异常都能够被捕获。

@ControllerAdvice 注解可以把异常处理器应用到所有控制器。借助该注解，我们可以实现：在单独一个类，使用@ExceptionHandler进行捕获异常，然后在类的签名加上注解`@ControllerAdvice`，统一进行异常处理。

### 使用统一异常处理

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    /**
     * 业务异常
     * @param request
     * @param response
     * @param e
     * @return
     */
    @ExceptionHandler(ServiceException.class)
    public Object businessExceptionHandler(HttpServletRequest request,HttpServletResponse response,Exception e){
        log.error("[GlobalExceptionHandler][businessExceptionHandler] exception",e);
        JsonResult jsonResult = new JsonResult();
        jsonResult.setCode(JsonResultCode.FAILURE);
        jsonResult.setMessage("业务异常,请联系管理员");
        return jsonResult;
    }

    /**
     * 全局异常处理
     * @param request
     * @param response
     * @param e
     * @return
     */
    @ExceptionHandler(Exception.class
    public Object exceptionHandler(HttpServletRequest request,HttpServletResponse response,Exception e)
    {
        log.error("[GlobalExceptionHandler][exceptionHandler] exception",e);
        JsonResult jsonResult = new JsonResult();
        jsonResult.setCode(JsonResultCode.FAILURE);
        jsonResult.setMessage("系统错误,请联系管理员");
        return jsonResult;
    }
}
```

### 使用 Assert 和Enum抛出异常

自定义异常`BaseException`有2个属性，即`code`、`message`，

