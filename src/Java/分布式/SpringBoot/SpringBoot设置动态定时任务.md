---
title: SpringBoot设置动态定时任务
author: 程序员子龙
index: true
icon: discover
category:
- SpringBoot

---
SpringBoot项目中使用定时任务很简单，但是cron是写死的，有些场景需要cron是写在配置文件中或者通过接口来修改。

下面介绍下怎么动态设置cron，实现动态定时任务。

启动类上添加@EnableScheduling:

```java
@EnableScheduling
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }


```

定时任务类：

```java
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.TriggerContext;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;
 
import java.time.LocalDateTime;
import java.util.Date;
 
/**
 * 定时任务
 */
@Data
@Slf4j
@Component
public class ScheduleTask implements SchedulingConfigurer {
 
    // 配置文件中配置表达式，默认是0/15 * * * * ?（15秒执行一次）
    @Value("${printTime.cron:0/15 * * * * ?}")
    private String cron;
 
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        // 动态使用cron表达式设置循环间隔
        taskRegistrar.addTriggerTask(new Runnable() {
            @Override
            public void run() {
                // todo 任务
                log.info("Current time： {}", LocalDateTime.now());
            }
        }, new Trigger() {
            @Override
            public Date nextExecutionTime(TriggerContext triggerContext) {
                // 使用CronTrigger触发器，可动态修改cron表达式来操作循环规则
                CronTrigger cronTrigger = new CronTrigger(cron);
                Date nextExecutionTime = cronTrigger.nextExecutionTime(triggerContext);
                return nextExecutionTime;
            }
        });
    }
}
```

启动项目后，15s打印一次：

> Current time： 2022-06-10T22:01:15.008
> Current time： 2022-06-10T22:01:30.012
> Current time： 2022-06-10T22:01:45.008

编写一个接口，可以通过调用接口动态修改该定时任务的执行时间：

```java

@Slf4j
@RestController
@RequestMapping("/test")
public class TestController {
 
    @Autowired
    private final ScheduleTask scheduleTask;
 
 
    @GetMapping("/updateCron")
    public String updateCron(String cron) {
        log.info("new cron :{}", cron);
        scheduleTask.setCron(cron);
        return "ok";
    }

```

调用接口,修改为60s执行一次。 http://127.0.0.1:8080/test/updateCron?cron=0/60 * * * * ? 

> Current time： 2022-06-10T22:05:00.014
> Current time： 2022-06-10T22:06:00.015
> Current time： 2022-06-10T22:07:00.013

