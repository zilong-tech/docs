---
title: openfeign远程调用异常统一处理
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
在目前微服务流行的年代，稍微大点的项目都会使用微服务架构模式。

当服务提供方响应为非 2xx 状态码时, feign调用将会抛出FeignException. 由于其异常message经过了Feint的封装, 所以不再是服务提供方的原始异常信息. 若想展示原始信息则需要重写ErrorDecoder来实现。

### 返回数据结构

```java
@Data
public class ApiResponse<T> {
    /**
     * 返回码 0 为成功 其他为异常
     */
    private int code;
    /**
     * 异常提示信息
     */
    private String msg;
    /**
     * 返回的数据
     */
    private T result;
}

```

重写ErrorDecoder

```java
public class FeignErrorDecoder implements ErrorDecoder {


	@Override
	public Exception decode(String methodKey, Response response) {

		String message = null;
		try {
			if (response.body() != null) {
				message = Util.toString(response.body().asReader(Util.UTF_8));
				ApiResponse  result = JsonUtil.parse(message, ApiResponse .class);

				return new ServiceException(result.getMsg());
			}
		} catch (Exception ignored) {
		}
		return new RuntimeException(message);
	}

}
```

### 配置全局feign配置类

```java
@Configuration
public class CustomizedConfiguration {

	@Bean
	public ErrorDecoder feignDecoder() {
		return new FeignErrorDecoder();
	}
}

```

说明：如果不加@Configuration，需要在@FeignClient指定配置类

在Feign进行远程调用后，需要对结果进行解码成具体的Java对象，如ApiResponse对象。而解码操作的类，必须实现Decoder接口，并重新decode方法，最后需要让其注入到spring的bean工厂中。
通过查看springcloud源代码，发现是一个叫ResponseEntityDecoder的解析器进行解码的（ResponseEntityDecoder也实现了Decoder接口），为了充分利用这个解析器，上述自定义的解析器对ResponseEntityDecoder进行了适配。

也可以重写Decoder接口，通过状态判断，对异常信息进行捕获。

```java
@Component
public class MyResponseEntityDecoder implements Decoder,SmartInitializingSingleton {
    @Autowired
    private ObjectFactory<HttpMessageConverters> messageConverters;

    private ResponseEntityDecoder responseEntityDecoder;

    @Override
    public Object decode(final Response response, Type type) throws IOException,
            FeignException {
        //返回码不为200，表示远程访问有运行时异常，则直接抛出异常即可
        if (response.status() ==200) {
            //充分利用spring框架提供的解析器
            Object result = responseEntityDecoder.decode(response, type);
            ApiResponse baseResponse = (ApiResponse)result;
            int code = baseResponse.getCode();
            if (code==0){
                return baseResponse;
            }
            throw new ServiceException(baseResponsegetMsg());
        }
        throw new RuntimeException("异常返回");
    }

    @Override
    public void afterSingletonsInstantiated() {
        //初始化spring提供的解析器
        responseEntityDecoder = new ResponseEntityDecoder(new SpringDecoder(this.messageConverters));
    }
}

```

### 总结

通过重写Decoder接口或者ErrorDecoder接口，可以做全局异常处理，避免在程序中，写入大量的异常处理。