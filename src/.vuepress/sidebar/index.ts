
import { sidebar } from "vuepress-theme-hope";
import { books } from "./books.js";
import { openSourceProject } from "./open-source-project.js";


export default sidebar({

  "/open-source-project/": openSourceProject,
  "/books/": books,



  // 必须放在最后面
  "/": [

    {
      text: "Java",
      icon: "java",
      collapsible: true,
      prefix: "java/",
      children: [

        {
          text: "基础",
          prefix: "basis/",
          icon: "basic",
          link:"/Java/"
        },
        {
          text:"JVM",
          icon:"info",
          link:"/JVM/"
        },

        {
          text:"并发编程",
          icon:"et-performance",
          link:"/并发编程/"
        },
        {
          text:"Spring",
          icon:"info",
          link:"/Spring/"
        },
        {
          text:"网络编程",
          icon:"info",
          link:"/网络编程/"
        },

      ]
    },

    {
      text:"设计模式",
      icon:"info",
      link:"/设计模式/"
    },

    {
      text: "数据库",
      icon: "database",
      collapsible: true,
      prefix: "java/",
      children: [

        {
          text:"Redis",
          icon:"info",
          link:"/Redis/"
        },
        {
          text:"MySQL",
          icon:"info",
          link:"/MySQL/"
        },
        {
          text:"Mongodb",
          icon:"info",
          link:"/Mongodb/"
        },
      ]
    },

    {
      text:"Mybatis",
      icon:"info",
      link:"/Mybatis/"
    },
        
    {
      text: "消息中间件",
      icon: "info",
      children: [
        {
          text: "Kafka",
          icon: "creative",
          link: "/Kafka/",

        },
        {
          text: "RocketMQ",
          icon: "creative",
          link: "/RocketMQ/"
        }
      ]
    },

    {
      text:"分布式",
      icon:"distributed-network",
      children:[

        {
          text: "理论",
          icon: "suanfaku",
          prefix: "protocol/",
          collapsible: true,
          link:"/分布式基础/"
        },
        {
          text: "zookeeper",
          icon: "creative",
          link: "/zookeeper/",

        },
        {
          text: "分布式事务",
          icon: "creative",
          link: "/分布式事务/"
        },

        {
          text: "微服务",
          icon: "info",
          children: [
              {
                text: "SpringBoot",
                icon: "creative",
                link: "/SpringBoot/",
  
              },
              {
                text: "SpringCloudAlibaba",
                icon: "creative",
                link: "/SpringCloudAlibaba/"
              }
          ]
        },

      ]
    },


    {
      text:"高并发",
      icon:"info",
      link:"/高并发/"
    },

    {
      text:"面试",
      icon:"info",
      link:"/面试/"
    },

    {
      text:"工具",
      icon:"info",
      link:"/工具/"
    },

  ]
   
  });
  
