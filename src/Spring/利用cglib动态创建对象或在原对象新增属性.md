---
title: 利用cglib动态创建对象或在原对象新增属性
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---
引入依赖

```
  <dependency>
      <groupId>cglib</groupId>
      <artifactId>cglib-nodep</artifactId>
      <version>3.2.4</version>
  </dependency>

```

定义实体

```java
@Data
public class User {

    private String name;

    private Integer age;
}
```

直接上代码

```java

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.beans.BeanGenerator;
import org.springframework.cglib.beans.BeanMap;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

@Slf4j
public class DynamicObject {
    
    private Object object;    //对象
    
    private BeanMap beanMap;    //对象的属性
    
    private BeanGenerator beanGenerator;    //对象生成器
    
    private Map<String, Class> allProperty;    //对象的<属性名, 属性名对应的类型>

    public DynamicObject() {
    }
    

    /**给对象属性赋值
     * 
     * @param property
     * @param value
     */
    public void setValue(String property, Object value){
        beanMap.put(property, value);
    }

    private void setValue(Object object, Map<String, Class> property){
        for(String propertyName : property.keySet()){
            if(allProperty.containsKey(propertyName)){
                Object propertyValue = getPropertyValueByName(object, propertyName);
                this.setValue(propertyName, propertyValue);
            }
        }
    }
    
    private void setValue(Map<String, Object> propertyValue){
        for(Map.Entry<String, Object> entry : propertyValue.entrySet()){
            this.setValue(entry.getKey(), entry.getValue());
        }
    }
    
    /**通过属性名获取属性值
     * 
     * @param property
     * @return
     */
    public Object getValue(String property){
        return beanMap.get(property);
    }
    
    /**获取该bean的实体
     * 
     * @return
     */
    public Object getObject(){
        return this.object;
    }
    
    public Map<String, Class> getAllProperty() {
        return allProperty;
    }


    private Object generateObject(Map propertyMap){
        if(null == beanGenerator){
            beanGenerator = new BeanGenerator();
        }

        Set keySet = propertyMap.keySet();
        for(Iterator i = keySet.iterator(); i.hasNext();){
            String key = (String) i.next();
            beanGenerator.addProperty(key, (Class)propertyMap.get(key));
        }
        return beanGenerator.create();
    }
    
    /**添加属性名与属性值
     * 
     * @param propertyType
     * @param propertyValue
     */
    private void addProperty(Map propertyType, Map propertyValue){
        if(null == propertyType){
            throw new RuntimeException("动态添加属性失败！");
        }
        Object oldObject = object;
        object = generateObject(propertyType);
        beanMap = BeanMap.create(object);
        
        if(null != oldObject){
            setValue(oldObject, allProperty);
        }
        
        setValue(propertyValue);
        if(null == allProperty){
            allProperty = propertyType;
        }else{
            allProperty.putAll(propertyType);
        }
    }
    
    /**获取对象中的所有属性名与属性值
     * 
     * @param object
     * @return
     * @throws ClassNotFoundException 
     */
    public Map<String, Class> getAllPropertyType(Object object) throws ClassNotFoundException{
        Map<String, Class> map = new HashMap<String, Class>();
        Field[] fields = object.getClass().getDeclaredFields();
        for(int index = 0; index < fields.length; index ++){
            Field field = fields[index];
            String propertyName = field.getName();
            Class<?> propertyType = Class.forName(field.getGenericType().getTypeName());
            map.put(propertyName, propertyType);
        }
        return map;
    }

    /**获取对象中的所有属性名与属性值
     * 
     * @param object
     * @return
     * @throws ClassNotFoundException 
     */
    public Map<String, Object> getAllPropertyValue(Object object) throws ClassNotFoundException{
        Map<String, Object> map = new HashMap<String, Object>();
        Field[] fields = object.getClass().getDeclaredFields();
        for(int index = 0; index < fields.length; index ++){
            Field field = fields[index];
            String propertyName = field.getName();
            Object propertyValue = getPropertyValueByName(object, propertyName);
            map.put(propertyName, propertyValue);
        }
        return map;
    }

    /**根据属性名获取对象中的属性值
     * 
     * @param propertyName
     * @param object
     * @return
     */
    private Object getPropertyValueByName(Object object, String propertyName){
        String methodName = "get" + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1);
        Object value = null;
        try {
            Method method = object.getClass().getMethod(methodName, new Class[]{});
            value = method.invoke(object, new Object[]{});
        } catch (Exception e) {
            log.error(String.format("从对象%s获取%s的=属性值失败", object, propertyName));
        }
        return value;
    }
    
    
    public static void main(String[] args) throws ClassNotFoundException {

        User user = new User();
        user.setName("张三");
        user.setAge(20);

        DynamicObject dynamicBean = new DynamicObject();

        //1、在原来的对象新增属性
        Map<String, Class> allPropertyType = dynamicBean.getAllPropertyType(user);
        Map<String, Object> allPropertyValue = dynamicBean.getAllPropertyValue(user);
        allPropertyType.put("phone", Class.forName("java.lang.String"));
        allPropertyValue.put("phone", "1321111111");
        dynamicBean.addProperty(allPropertyType, allPropertyValue);

        System.out.println(JSON.toJSON(dynamicBean.getObject()));
        
        //2、动态创建一个新对象
        Map<String, Class> newPropertyType = new HashMap<>();
        Map<String, Object> newPropertyValue = new HashMap<>();
        newPropertyType.put("address", Class.forName("java.lang.String"));
        newPropertyValue.put("address", "地址地址");

        dynamicBean.addProperty(newPropertyType, newPropertyValue);

        Object entity = dynamicBean.getObject();

        System.out.println(JSONObject.toJSONString(entity));
    }
}
```

> {"name":"张三","phone":"1321111111","age":20}
> {"address":"地址地址","age":20,"name":"张三","phone":"1321111111"}

