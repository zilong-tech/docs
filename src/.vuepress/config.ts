import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { hopeTheme } from "vuepress-theme-hope";
import { seoPlugin } from "vuepress-plugin-seo2";
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";
import { searchPlugin } from "@vuepress/plugin-search";
import { readmorePlugin } from 'vuepress-plugin-readmore-popular-next';



export default defineUserConfig({
  base: "/docs/",
  locales: {

    "/": {
      lang: "zh-CN",
      title: "子龙技术",
      description: "程序员子龙",
    },
  },

  theme: hopeTheme({
    logo: "/logo.png",

    navbar: [

      {
        text:"并发编程",
        icon:"info",
        link:"/并发编程/"
      },
      {
        text:"网络编程",
        icon:"info",
        link:"/网络编程/"
      },
      {
        text:"分布式",
        icon:"info",
        children: [
          {
            text: "分布式基础",
            icon: "creative",
            link: "/分布式基础/",

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
          }
        ]

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

      {
        text:"设计模式",
        icon:"info",
        link:"/设计模式/"
      },

      {
        text:"Java",
        icon:"info",
        link:"/Java/"
      },
      {
        text:"JVM",
        icon:"info",
        link:"/JVM/"
      },
      {
        text:"数据库",
        icon:"info",
        children:[
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
        text:"Spring",
        icon:"info",
        link:"/Spring/"
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
      {
        text:"开源项目",
        icon:"info",
        link:"/开源项目/"
      },
    ],


    sidebar: {
      "/并发编程/": "structure",
      "/SpringBoot/": "structure",
      "/SpringCloudAlibaba/" : "structure",
      "/分布式事务/":"structure",
      "/设计模式/":"structure",
      "/MySQL/":"structure",
      "/Java/":"structure",
      "/Redis/":"structure",
      "/Spring/":"structure",
      "/Kafka/":"structure",
      "/RocketMQ/":"structure",
      "/网络编程/":"structure",
      "/开源项目/":"structure",
      "/分布式基础/":"structure",
      "/高并发/":"structure",
      "/面试/":"structure",
      "/Mybatis/":"structure",
      "/工具/":"structure",
    },

    themeColor: {
      blue: "#2196f3",
      red: "#f26d6d",
      green: "#3eaf7c",
      orange: "#fb9b5f",
    },

  }),

  shouldPrefetch: false,

  plugins: [
    seoPlugin({
      "hostname": "https://zilong-tech.github.io/docs/"
    }),

    autoCatalogPlugin({
      //插件选项
    }),

    searchPlugin({
      // 你的选项
    }),


    readmorePlugin({
      // 已申请的博客 ID
      blogId: '75444-7791228872984-790',
      // 已申请的微信公众号名称
      name: '程序员子龙',
      // 已申请的微信公众号回复关键词
      keyword: '验证码',
      // 已申请的微信公众号二维码图片
      qrcode: 'http://rpumme6gd.hb-bkt.clouddn.com/202302152116611.jpg',
      // 文章内容的 JS 选择器，若使用的不是官方默认主题，则需要根据第三方的主题来设置
      selector: 'div.theme-hope-content',
      // 自定义的 JS 资源链接，可用于 CDN 加速
      libUrl: 'https://qiniu.techgrow.cn/readmore/dist/readmore.js',
      // 自定义的 CSS 资源链接，可用于适配不同风格的博客
      cssUrl: 'https://qiniu.techgrow.cn/readmore/dist/vuepress2.css',
      // 文章排除添加引流工具的 URL 规则，支持使用路径、通配符、正则表达式的匹配规则
      excludes: { strExp: ["/docs/"], regExp: [] },
      // 是否反转 URL 排除规则的配置，即只有符合排除规则的文章才会添加引流工具
      reverse: false,
      // 文章内容的预览高度
      height: 'auto',
      // 文章解锁后凭证的有效天数
      expires: 365,
      // 定时校验凭证有效性的时间间隔（秒）
      interval: 60,
      // 每篇文章随机添加引流工具的概率，有效范围在 0.1 ~ 1 之间，1 则表示所有文章默认都自动添加引流工具
      random: 1,
      id: "",
      lockToc: "",
      type: ""
    })
    

  ],
 


 
});




