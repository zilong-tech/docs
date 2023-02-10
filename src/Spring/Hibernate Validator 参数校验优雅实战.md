---
title: Hibernate Validator 参数校验优雅实战
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
### 简介

在项目中，难免需要**对参数进行合法性的效验**，多次出现if效验数据使得业务代码显得臃肿。

JSR提供了一套Bean校验规范的API，维护在包javax.validation.constraints下。该规范使用属性或者方法参数或者类上的一套简洁易用的注解来做参数校验。在开发过程中，仅需在需要校验的地方加上形如@NotNull, @NotEmpty 等注解。

**Hibernate validator框架** 可以很优雅的方式实现参数的效验。hibernate Validator提供了JSR303规范中所有内置约束的实现，除此之外还有一些附加约束。

### 快速实战

在springboot中 不需要引入[Hibernate](https://so.csdn.net/so/search?q=Hibernate&spm=1001.2101.3001.7020) Validator ， 因为 在引入的 **spring-boot-starter-web**（springbootweb启动器）依赖的时候中，内部已经依赖了 **hibernate-validator** 依赖包。

```xml
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.0.9.Final</version>
</dependency>
```

#### 常用注解

hibernate-validator提供的校验方式为在类的属性上加入相应的注解来达到校验的目的。hibernate-validator提供的用于校验的注解如下：

| **注解**           | **说明**                                           |
| ------------------ | -------------------------------------------------- |
| @NotEmpty          | 不能为空，这里的空是指空字符串                     |
| @NotBlank          | 不能为空，检查时会将空格忽略                       |
| @Pattern(regex=)   | 被注释的元素必须符合指定的正则表达式               |
| @NotNull           | 不能为null                                         |
| @Min               | 该字段的值只能大于或等于该值                       |
| @Max               | 该字段的值只能小于或等于该值                       |
| @Length(min=,max=) | 所属的字段的长度是否在min和max之间，只能用于字符串 |
| @AssertTrue        | 用于boolean字段，该字段只能为true                  |
| @AssertFalse       | 用于boolean字段，该字段只能为false                 |
| @Email             | 检查是否是一个有效的email地址                      |
| @Future            | 检查该字段的日期是否是属于将来的日期               |
| @Past              | 必须是过去的日期                                   |
| @Size              | 元素的大小必须在指定范围内                         |

#### 参数上添加注解

```
@Data
public class City implements Serializable {

    private static final long serialVersionUID = -1L;

    /**
     * 城市编号
     */
    private Long id;

    /**
     * 省份编号
     */
    private Long provinceId;

    /**
     * 城市名称
     */
    @NotBlank(message = "城市名称不能为空")
    private String cityName;
}
```

#### 校验的Bean前添加`@Valid`或者`@Validated`注解

```
 @RequestMapping(value = "/save",method = RequestMethod.POST)
    public void save(@Valid @RequestBody City city){
        System.out.println(city.toString());
    }
```

postman调用：

```json
{
	"provinceId":1
}
```

返回结果：

```json
{
    "timestamp": "2022-11-11T03:15:02.176+0000",
    "status": 400,
    "error": "Bad Request",
    "errors": [
        {
            "codes": [
                "NotBlank.city.cityName",
                "NotBlank.cityName",
                "NotBlank.java.lang.String",
                "NotBlank"
            ],
            "arguments": [
                {
                    "codes": [
                        "city.cityName",
                        "cityName"
                    ],
                    "arguments": null,
                    "defaultMessage": "cityName",
                    "code": "cityName"
                }
            ],
            "defaultMessage": "城市名称不能为空",
            "objectName": "city",
            "field": "cityName",
            "rejectedValue": null,
            "bindingFailure": false,
            "code": "NotBlank"
        }
    ],
    "message": "Validation failed for object='city'. Error count: 1",
    "path": "/save"
}
```

这样返回的结果不够友好，可以添加全局异常处理返回的结果。

#### 定义返回数据实体

```
@Data
public class ResultBody {
    /**
     * 响应代码
     */
    private String code;

    /**
     * 响应消息
     */
    private String message;

    public static ResultBody fail(String code,String message){

        return new ResultBody(code,message);
    }
  }
```

#### 全局异常处理

```java
@RestControllerAdvice
public class ValidatorConfiguration {


    @ExceptionHandler({BindException.class,MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultBody handleError(MethodArgumentNotValidException e) {

        return this.handleError(e.getBindingResult());
    }

    private ResultBody handleError(BindingResult result) {
        FieldError error = result.getFieldError();
        String message = String.format("%s:%s", error.getField(), error.getDefaultMessage());
        return ResultBody.fail("400", message);
    }
}
```

再次调用返回结果：

```json
{
    "code": "400",
    "message": "cityName:城市名称不能为空",
    "result": null
}
```

#### 校验模式

hibernate validator 有两种校验模式：**普通模式**和**快速失败模式**。

- 普通模式它会校验所有属性，并返回所有的失败信息
- 快速失败模式则是只有一个校验失败就会返回

```kotlin
@Configuration
public class HibernateValidatorConfiguration {
    @Bean
    public Validator validator(){
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                //  快速失败模式  true表示启用，false表示普通模式
                .addProperty("hibernate.validator.fail_fast","true")
                .buildValidatorFactory();

        return validatorFactory.getValidator();
    }
}
```

普通模式全局异常处理：

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResultBody resolveMethodArgumentNotValidException(MethodArgumentNotValidException ex){

    List<ObjectError> objectErrors = ex.getBindingResult().getAllErrors();
    if(!CollectionUtils.isEmpty(objectErrors)) {
        StringBuilder msgBuilder = new StringBuilder();
        for (ObjectError objectError : objectErrors) {
            msgBuilder.append(objectError.getDefaultMessage()).append(",");
        }
        String errorMessage = msgBuilder.toString();
        if (errorMessage.length() > 1) {
            errorMessage = errorMessage.substring(0, errorMessage.length() - 1);
        }
        return ResultBody.fail("400", errorMessage);

    }
    return null;
}
```

#### 分组校验

同一个字段在不同场景下，使用不同的校验规则，这时候就用到了分组校验。

```java
public class User {
    public interface Default {
    }

    public interface Update {
    }

    @NotNull(message = "id不能为空", groups = Update.class)
    private Long id;

    @NotNull(message = "名字不能为空", groups = Default.class)
    @Length(min = 4, max = 10, message = "name 长度必须在 {min} - {max} 之间", groups = Default.class)
    private String name;

    @NotNull(message = "年龄不能为空", groups = Default.class)
    @Min(value = 18, message = "年龄不能小于18岁", groups = Default.class)
    private Integer age;

}
```

```java
/**
 * 使用Defaul分组进行验证
 * @param
 * @return
 */
@PostMapping("/validate")
public String addUser(@Validated(value = User.Default.class) @RequestBody User user) {
    return "validate";
}

/**
 * 使用Update分组进行验证
 * @param
 * @return
 */
@PutMapping("/validate1")
public String updateUser(@Validated(value = {User.Update.class}) @RequestBody User user) {
    return "validate1";
}
```

#### 自定义校验规则

定义注解：

- 与普通注解相比，这种自定义注解需要增加元注解@Constraint，并通过validatedBy参数指定验证器。

- 依据JSR规范，定义三个通用参数：message（校验失败保存信息）、groups（分组）和payload（负载）。

- 自定义额外所需配置参数

- 定义内部List接口，参数是该自定义注解数组，配合元注解@Repeatable，可使该注解可以重复添加。

  

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER,ElementType.FIELD})
@Constraint(validatedBy = FlagValidatorClass.class)
public @interface FlagValidator {
    // flag的有效值，多个使用,隔开
    String values();

    // flag无效时的提示内容
    String message() default "flag必须是预定义的那几个值";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

定义校验类：

- 该验证器需要实现ConstraintValidator接口，ConstraintValidator接口包含两个类型参数，第一个指定验证器要校验的注解，第二个参数指定要验证的数据类型。
- 实现initialize方法，通常在该注解中拿到注解的参数值。
- 实现isValid方法，方法第一个参数是要校验的属性值；校验逻辑写在该方法内；校验通过返回true，校验失败返回false。

```java

public class FlagValidatorClass implements ConstraintValidator<FlagValidator,Object> {
    /**
     * FlagValidator注解规定的那些有效值
     */
    private String values;

    @Override
    public void initialize(FlagValidator flagValidator) {
        this.values = flagValidator.values();
    }

    /**
     * 用户输入的值，必须是FlagValidator注解规定的那些值其中之一。
     * 否则，校验不通过。
     * @param value 用户输入的值，如从前端传入的某个值
     */
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext constraintValidatorContext) {
        // 切割获取值
        String[] value_array = values.split(",");
        Boolean isFlag = false;

        for (int i = 0; i < value_array.length; i++){
            // 存在一致就跳出循环
            if (value_array[i] .equals(value)){
                isFlag = true; 
                break;
            }
        }

        return isFlag;
    }
}
```

使用注解：

```java
// flag值必须是1或2或3，否则校验失败
@FlagValidator(values = "1,2,3")
private String flag ;
```

#### 使用Hibernate Validator编程式校验

在有些场景不是http请求，比如消费mq数据，这时候要自行实现校验方式。

```java
public static String validateParams(Object voObject) {
   ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
   Validator validator = factory.getValidator();
   Set<ConstraintViolation<Object>> violations = validator.validate(voObject);
   if (violations.size() > 0) {
      List<String> msgList = new ArrayList<>();
      for (ConstraintViolation<Object> violation : violations) {
         msgList.add(violation.getMessage());
      }
      return StringUtils.join(msgList.toArray(), ",");
   } else {
      return null;
   }
}
```

Validation类是Bean Validation的入口点，buildDefaultValidatorFactory()方法基于默认的Bean Validation提供程序构建并返回ValidatorFactory实例。使用默认验证提供程序解析程序逻辑解析提供程序列表。代码上等同于Validation.byDefaultProvider().configure().buildValidatorFactory()。

以上代码根据java spi查找ValidationProvider的实现类，如果类路径加入了hibernate-validator，则使用HibernateValidator，关于HibernateValidator细节暂不探讨。

之后调用该ValidatorFactory.getValidator()返回一个校验器实例，使用这个校验器的validate方法对目标对象的属性进行校验，返回一个ConstraintViolation集合。ConstraintViolation用于描述约束违规。 此对象公开约束违规上下文以及描述违规的消息。


### 总结

![](https://img2020.cnblogs.com/blog/1822926/202102/1822926-20210207094540403-499749728.png)
