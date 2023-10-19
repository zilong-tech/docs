---
title: Spring在代码中获取bean
author: 程序员子龙
index: true
icon: discover
category:
- Spring
---


```java
/**
 * Description: 获取springboot 上下文、注入bean工具类
 * <p>
 * Create on 2018/11/23
 *
 * @author
 */
@Component
public class SpringBeanUtil implements ApplicationContextAware {

    /**
     * 上下文对象实例
     */
    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
    /**
     * 获取applicationContext
     *
     * @return
     *      applicationContext
     */
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    /**
     * 通过name获取 Bean.
     *
     * @param name
     *          bean name
     * @return
     *          bean
     */
    public static Object getBean(String name){
        return getApplicationContext().getBean(name);
    }

    /**
     * 通过class获取Bean.
     * @param clazz
     *          class
     * @param <T>
     * @return
     */
    public static <T> T getBean(Class<T> clazz){
        return getApplicationContext().getBean(clazz);
    }

    /**
     * 通过name,以及Clazz返回指定的Bean
     * @param name
     *          bean name
     * @param clazz
     *          class
     * @param <T>
     * @return
     *          bean
     */
    public static <T> T getBean(String name,Class<T> clazz){
        return getApplicationContext().getBean(name, clazz);
    }

}
```