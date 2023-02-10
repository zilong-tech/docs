---
title: springboot项目引入这个包以后把原来的json报文改为了xml格式返回
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
这个是 Spring MVC的消息转换器接口配置的问题,相关源码：

```java
	if (!shouldIgnoreXml) {
			if (jackson2XmlPresent) {
				Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.xml();
				if (this.applicationContext != null) {
					builder.applicationContext(this.applicationContext);
				}
				messageConverters.add(new MappingJackson2XmlHttpMessageConverter(builder.build()));
			}
			else if (jaxb2Present) {
				messageConverters.add(new Jaxb2RootElementHttpMessageConverter());
			}
		}
```

目前有三种解决方案：

- 干掉spring mvc 中的 `MappingJackson2XmlHttpMessageConverter`
- 依赖中排除`jackson-dataformat-xml`
- `spring.properties`设置`spring.xml.ignore`设置为`true`