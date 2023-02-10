---
title: SpringBoot中new对象不能自动注入对象和属性的问题
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
SpringBoot中new对象不能自动注入对象，可以通过ApplicationContextAware获取bean。

ApplicationContextAware 通过它Spring容器会自动把上下文环境对象调用 ApplicationContextAware接口中的setApplicationContext 方法。

我们在 ApplicationContextAware的实现类中，就可以通过这个上下文环境对象得到Spring容器中的Bean。

ApplicationContextAware的作用是可以方便获取Spring容器ApplicationContext ，从而可以获取容器内的Bean。

```java
public interface ApplicationContextAware extends Aware {

    void setApplicationContext(ApplicationContext var1) throws BeansException;

}
```

ApplicationContextAware接口只有一个方法，如果实现了这个方法，那么Spring创建这个实现类的时候就会自动执行这个方法，把ApplicationContext注入到这个类中，也就是说，Spring在启动的时候就需要实例化这个 class（如果是懒加载就是你需要用到的时候实例化），在实例化这个 class 的时候，发现它包含这个 ApplicationContextAware 接口的话，Spring就会调用这个对象的 setApplicationContext 方法，把 applicationContext Set 进去了。

Spring 获取bean工具类

```java

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * @Description: Spring 上下文工具, 可用于获取spring 容器中的Bean
 */
@Component
public class SpringContextUtil implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextUtil.applicationContext = applicationContext;
    }

    /**
     * @Description: 获取spring容器中的bean,通过bean名称获取
     * @param beanName bean名称
     * @return: Object 返回Object,需要做强制类型转换
     */
    public static Object getBean(String beanName){
        return applicationContext.getBean(beanName);
    }

    /**
     * @Description: 获取spring容器中的bean, 通过bean类型获取
     * @param beanClass bean 类型
     * @return: T 返回指定类型的bean实例
     */
    public static <T> T getBean(Class<T> beanClass) {
        return applicationContext.getBean(beanClass);
    }

    public static <T> Optional<T> getBeanOptional(Class<T> beanClass) {
        try {
            T bean = applicationContext.getBean(beanClass);
            return Optional.of(bean);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * @Description: 获取spring容器中的bean, 通过bean名称和bean类型精确获取
     * @param beanName bean 名称
     * @param beanClass bean 类型
     * @return: T 返回指定类型的bean实例

     */
    public static <T> T getBean(String beanName, Class<T> beanClass){
        return applicationContext.getBean(beanName,beanClass);
    }
}


```

