---
title: Jackson序列化json时null转成0或空串
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
在项目中可能会遇到null，转JSON时不希望出现null，可以添加下面的配置解决这个问题。

### 全局处理

定义bean解析器

```java
public class MyBeanSerializerModifier extends BeanSerializerModifier {
    public MyBeanSerializerModifier() {
    }

    @Override
	public List<BeanPropertyWriter> changeProperties(SerializationConfig config, BeanDescription beanDesc, List<BeanPropertyWriter> beanProperties) {
        beanProperties.forEach((writer) -> {
            if (!writer.hasNullSerializer()) {
                JavaType type = writer.getType();
                Class<?> clazz = type.getRawClass();
                if (type.isTypeOrSubTypeOf(Number.class)) {
                    writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.NUMBER_JSON_SERIALIZER);
                } else if (type.isTypeOrSubTypeOf(Boolean.class)) {
                    writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.BOOLEAN_JSON_SERIALIZER);
                } else if (type.isTypeOrSubTypeOf(Character.class)) {
                    writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.STRING_JSON_SERIALIZER);
                } else if (type.isTypeOrSubTypeOf(String.class)) {
                    writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.STRING_JSON_SERIALIZER);
                } else if (!type.isArrayType() && !clazz.isArray() && !type.isTypeOrSubTypeOf(Collection.class)) {
                    if (type.isTypeOrSubTypeOf(OffsetDateTime.class)) {
                        writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.STRING_JSON_SERIALIZER);
                    } else if (!type.isTypeOrSubTypeOf(Date.class) && !type.isTypeOrSubTypeOf(TemporalAccessor.class)) {
                        writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.OBJECT_JSON_SERIALIZER);
                    } else {
                        writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.STRING_JSON_SERIALIZER);
                    }
                } else {
                    writer.assignNullSerializer(MyBeanSerializerModifier.NullJsonSerializers.ARRAY_JSON_SERIALIZER);
                }

            }
        });
        return super.changeProperties(config, beanDesc, beanProperties);
    }

    public interface NullJsonSerializers {
        JsonSerializer<Object> STRING_JSON_SERIALIZER = new JsonSerializer<Object>() {
            @Override
			public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                gen.writeString("");
            }
        };
        JsonSerializer<Object> NUMBER_JSON_SERIALIZER = new JsonSerializer<Object>() {
            @Override
			public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                gen.writeNumber(0);
            }
        };
        JsonSerializer<Object> BOOLEAN_JSON_SERIALIZER = new JsonSerializer<Object>() {
            @Override
			public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                gen.writeObject(Boolean.FALSE);
            }
        };
        JsonSerializer<Object> ARRAY_JSON_SERIALIZER = new JsonSerializer<Object>() {
            @Override
			public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                gen.writeStartArray();
                gen.writeEndArray();
            }
        };
        JsonSerializer<Object> OBJECT_JSON_SERIALIZER = new JsonSerializer<Object>() {
            @Override
			public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                gen.writeStartObject();
                gen.writeEndObject();
            }
        };
    }
}
```



配置message转换器

```java
public class MappingApiJackson2HttpMessageConverter extends AbstractReadWriteJackson2HttpMessageConverter {

    public MappingApiJackson2HttpMessageConverter(ObjectMapper objectMapper, MyJacksonProperties properties) {
        super(objectMapper, initWriteObjectMapper(objectMapper, properties), initMediaType(properties));
    }

    private static ObjectMapper initWriteObjectMapper(ObjectMapper readObjectMapper, JacksonProperties properties) {
        ObjectMapper writeObjectMapper = readObjectMapper.copy();
  
		// 配置开关
        if (Boolean.TRUE.equals(properties.getNullToEmpty())) {
            writeObjectMapper.setSerializerFactory(writeObjectMapper.getSerializerFactory().withSerializerModifier(new BladeBeanSerializerModifier()));
            writeObjectMapper.getSerializerProvider().setNullValueSerializer(NullJsonSerializers.STRING_JSON_SERIALIZER);
        }

        return writeObjectMapper;
    }


}
```

配置开关：

```java
@ConfigurationProperties("jackson")
public class JacksonProperties {
    private Boolean nullToEmpty;
}   
```

注册消息转换器：

```java
@Configuration(
    proxyBeanMethods = false
)
@Order(-2147483648)
public class MessageConfiguration implements WebMvcConfigurer {
    private final ObjectMapper objectMapper;
    private final JacksonProperties properties;

    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.removeIf((x) -> {
            return x instanceof StringHttpMessageConverter || x instanceof AbstractJackson2HttpMessageConverter;
        });
  
        converters.add(new MappingApiJackson2HttpMessageConverter(this.objectMapper, this.properties));
    }
    
     public MessageConfiguration(final ObjectMapper objectMapper, final JacksonProperties properties) {
        this.objectMapper = objectMapper;
        this.properties = properties;
    }
}
```

### 局部处理

定义空系列化处理器：

```java
public class NumberNullSerialeze extends JsonSerializer<Object> {

   public static final int DEFULT_VALUE = 0;

   @Override
   public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
      gen.writeNumber(DEFULT_VALUE);
   }
}
```

在字段上添加注解：

```java
@JsonSerialize(nullsUsing = NumberNullSerialeze.class)
private Long availableAmt;
```