
import { sidebar } from "vuepress-theme-hope";

export default sidebar({


  "/":[
      "",
    {
      text: "学习指南",
      icon: "lightbulb",
      prefix: "Java/",
      children: [
        "基础/",
        "JVM/",
        "Spring/",
        "并发编程/",
        "设计模式/",
        "网络编程/",

        "数据库/",
        "Mybatis/",
        "缓存/",
        "消息中间件/",

        "分布式/",
        "高并发/",
        "面试/",

      ],
    },

    {
      text: "开源项目",
      icon: "github",
      prefix: "open-source-project/",
      children: [
        "实战项目/",

      ],
    },
  ],

  "/Java/":"structure",

  "/open-source-project/":"structure",

  "/工具/":"structure",

  });
  
