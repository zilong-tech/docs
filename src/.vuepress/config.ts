import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { hopeTheme } from "vuepress-theme-hope";
import { seoPlugin } from "vuepress-plugin-seo2";
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";
import { searchPlugin } from "@vuepress/plugin-search";


export default defineUserConfig({
  base: "/docs/",
  locales: {

    "/": {
      lang: "zh-CN",
      title: "子龙技术",
      description: "程序员子龙",
    },
  },

  head: [
    [
      'script',
      { charset: 'utf-8', src: 'https://my.openwrite.cn/js/readmore.js' },
    ],
  ],

  theme: hopeTheme({
    logo: "/logo.png",


    navbar: [
  
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
    ],


    sidebar: {
      "/SpringBoot/": "structure",
      "/SpringCloudAlibaba/" : "structure",

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
      "hostname":"https://zilong-tech.github.io/docs/"
    }),

    autoCatalogPlugin({
      //插件选项
    }),

    searchPlugin({
      // 你的选项
    }),



  ],
 
 
 
});
