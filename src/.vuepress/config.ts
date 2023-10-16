import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import {hopeTheme, sitemap} from "vuepress-theme-hope";
import { seoPlugin } from "vuepress-plugin-seo2";
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";
import { searchPlugin } from "@vuepress/plugin-search";
import { readmorePlugin } from 'vuepress-plugin-readmore-popular-next';
import { sitemapPlugin } from "vuepress-plugin-sitemap2";



export default defineUserConfig({
  base: "/",
  description:
    "「Java学习指北 + Java面试指南」一份涵盖大部分 Java 程序员所需要掌握的核心知识。准备 Java 面试，复习 Java 知识点，首选 JavaGuide！  ",
  lang: "zh-CN",

  head: [
    // meta
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "程序员子龙" }],
    [
      "meta",
      {
        "http-equiv": "Cache-Control",
        content: "no-cache, no-store, must-revalidate",
      },
    ],
    ["meta", { "http-equiv": "Pragma", content: "no-cache" }],
    ["meta", { "http-equiv": "Expires", content: "0" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "Java基础, 多线程, JVM, 虚拟机, 数据库, MySQL, Spring, Redis, MyBatis, 系统设计, 分布式, RPC, 高可用, 高并发",
      },
    ],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    // 添加百度统计
    [
      "script",
      {},
      `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?5dd2e8c97962d57b7b8fea1737c01743";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();`,
    ],
  ],

  theme,


  pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

  shouldPrefetch: false,

  plugins: [
    seoPlugin({
      "hostname": "http://xxfxpt.top"
    }),

    sitemapPlugin({
      // 配置选项
      "hostname": "http://xxfxpt.top"
    }),

    autoCatalogPlugin({
      //插件选项
    }),

    searchPlugin({
      // https://v2.vuepress.vuejs.org/zh/reference/plugin/search.html
      // 排除首页
      isSearchable: (page) => page.path !== "/",
      maxSuggestions: 10,
      hotKeys: ["s", "/"],
      // 用于在页面的搜索索引中添加额外字段
      getExtraFields: () => [],
      locales: {
        "/": {
          placeholder: "搜索",
        },
      },
    }),


    readmorePlugin({
      // 已申请的博客 ID
      blogId: '75444-7791228872984-790',
      // 已申请的微信公众号名称
      name: '程序员子龙',
      // 已申请的微信公众号回复关键词
      keyword: '验证码',
      // 已申请的微信公众号二维码图片
      qrcode: 'http://img.xxfxpt.top/202302152116611.jpg',
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




