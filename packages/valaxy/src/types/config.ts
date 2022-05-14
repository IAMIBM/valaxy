import type { PartialDeep } from 'type-fest'
import type { VitePluginConfig } from 'unocss/vite'
import type { MarkdownOptions } from '../node/markdown'
import type { ViteMdOptions } from '../node/plugins/markdown'

export type ValaxyThemeConfig = Record<string, any>

export interface SocialLink {
  /**
   * The title of your link
   */
  name: string
  link: string
  /**
   * 图标名称
   * https://icones.js.org/
   */
  icon: string
  color: string
}

export interface ValaxyConfig<T = ValaxyThemeConfig> {
  /**
   * Default language
   * @description 默认语言
   * @default 'en'
   */
  lang: string
  /**
   * You site url in web, required for ssg & rss
   * @description 站点的 URL，SSG & RSS 需要（譬如生成版权处文章永久链接）
   */
  url: string
  /**
   * Site title
   * @description 站点标题
   */
  title: string
  /**
   * 副标题
   */
  subtitle: string
  /**
   * 站点描述
   */
  description: string
  /**
   * The owner of this blog
   * @description 博客作者
   */
  author: {
    /**
     * Your name
     * @description 你的名字
     */
    name: string
    email: string
    link: string
    avatar: string
    /**
     * The status of you
     * @description 状态
     */
    status: {
      emoji: string
      /**
       * show when hover emoji
       * @description 当鼠标悬浮在图标上时显示
       */
      message: string
    }
  }

  /**
   * icon for your website
   */
  favicon: string

  feed: {
    /**
     * name: feed -> feed.xml / feed.atom / feed.json
     * @default '' -> feed.xml / atom.xml / feed.json
     */
    name: string
    favicon: string
  }

  /**
   * 社交链接
   */
  social: SocialLink[]

  /**
   * search
   */
  search: {
    algolia: {
      enable: boolean
      appId: string
      apiKey: string
      indexName: string
      chunkSize: number
    }
  }

  /**
   * comment: waline/...
   */
  comment: {
    waline: {
      enable: boolean
      serverURL: string
    }
    twikoo: {
      enable: boolean
      envId: string
    }
  }

  /**
   * The name of theme
   * @description 主题名称
   */
  theme: string
  /**
   * The config of theme
   * @description 主题配置
   */
  themeConfig: T & {
    pkg: {
      name: string
      version: string
      homepage?: string
      [key: string]: any
    }
  }

  /**
   * Unocss Config
   */
  unocss: VitePluginConfig

  /**
   * The license of your posts
   * @description 文章所使用的协议，默认使用 Creative Commons
   * @default https://creativecommons.org/licenses/
   */
  license: {
    /**
     * Whether to show at the bottom of the article
     * @description 是否显示在文章底部
     * @default true
     */
    enabled: boolean
    /**
     * Creative License Language, same with your config.lang
     * when lang === 'zh-CN', use 'zh'
     * @description 默认与站点语言相同
     * @default 'en'
     */
    language: string
    /**
     * Type of license
     * @description 证书类型
     * @default 'by-nc-sa'
     */
    type: 'zero' | 'by-sa' | 'by-nd' | 'by-nc' | 'by-nc-sa' | 'by-nc-nd'
  }

  /**
   * donate for author
   * @description 打赏/赞助
   */
  sponsor: {
    enable: boolean
    title: string
    methods: {
      name: string
      url: string
      color: string
      icon: string
    }[]
  }

  /**
   * for markdown
   */
  markdown: ViteMdOptions
  markdownIt: MarkdownOptions
}

/**
 * Valaxy User Config
 * @description Valaxy 用户配置
 */
export type UserConfig<T = ValaxyThemeConfig> = PartialDeep<ValaxyConfig<T>>

export const defaultValaxyConfig: ValaxyConfig = {
  url: '',
  lang: 'en',
  title: 'Valaxy Blog',
  description: 'A blog generated by Valaxy.',
  subtitle: 'Next Generation Static Blog Framework.',
  author: {
    avatar: 'https://cdn.jsdelivr.net/gh/YunYouJun/yun/images/meme/yun-good-with-bg.jpg',
    email: 'me@yunyoujun.cn',
    link: 'https://www.yunyoujun.cn',
    name: 'YunYouJun',
    status: {
      emoji: '😊',
      message: 'All at sea.',
    },
  },
  favicon: 'favicon.svg',
  feed: {
    name: '',
    favicon: 'favicon.svg',
  },
  social: [],

  license: {
    enabled: true,
    language: '',
    type: 'by-nc-sa',
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱',
    methods: [
      {
        name: '支付宝',
        url: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/donate/alipay-qrcode.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/donate/qqpay-qrcode.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/donate/wechatpay-qrcode.jpg',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },

    ],
  },

  search: {
    algolia: {
      enable: false,
      appId: '',
      apiKey: '',
      indexName: '',
      chunkSize: 5000,
    },
  },

  comment: {
    waline: {
      enable: false,
      serverURL: '',
    },
    twikoo: {
      enable: false,
      envId: 'https://twikoo.vercel.app',
    },
  },

  theme: 'yun',
  themeConfig: {
    pkg: {
      name: '',
      version: '',
    },
  },

  unocss: {},

  markdown: {
    excerpt: '<!-- more -->',
  },
  markdownIt: {
    toc: {
      includeLevel: [1, 2, 3, 4],
      listType: 'ol',
    },
    katex: {},
  },
}
