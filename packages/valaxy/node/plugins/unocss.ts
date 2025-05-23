import type {
  ConfigBase,
} from 'unocss'
import type { VitePluginConfig as UnoCSSConfig, VitePluginConfig } from 'unocss/vite'
import type { ResolvedValaxyOptions } from '../options'
import { resolve } from 'node:path'
import defu from 'defu'

import fs from 'fs-extra'
import { createJiti } from 'jiti'
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { loadSetups } from './setupNode'

const jiti = createJiti(import.meta.url)

export async function createSafelist(options: ResolvedValaxyOptions) {
  const { config } = options
  const safeIcons: string[] = [
    'i-ri-clipboard-line',

    'i-ri-archive-line',
    'i-ri-folder-2-line',
    'i-ri-price-tag-3-line',

    'i-ri-cloud-line',
  ]

  const safelist: ConfigBase['safelist'] = [
    'animate-fade-in',
    'm-auto',
    'text-left',
    'rotate-y-180',

    ...safeIcons,
    ...(options.config.unocss?.safelist ?? []),
  ]

  if (options.mode === 'dev') {
    const { safelist: devtoolsSafelist = [] } = (await import('@valaxyjs/devtools'))
    safelist.push(
      ...devtoolsSafelist,
    )
  }

  const siteConfig = config.siteConfig

  // block icon safelist
  if (config.markdown?.blocks) {
    const blocks = config.markdown.blocks
    Object.entries(blocks).forEach(([_key, block]) => {
      if (block.icon)
        safelist.push(block.icon)
    })
  }

  // generate icon safelist
  if (siteConfig.social?.length)
    siteConfig.social.forEach(item => safelist.push(item?.icon || ''))

  // sponsor icon
  const methods = siteConfig.sponsor?.methods || []
  if (methods.length)
    methods.forEach(item => safelist.push(item?.icon || ''))

  return safelist
}

export async function createUnocssConfig(options: ResolvedValaxyOptions) {
  const { config: pluginOptions } = options

  const unocssConfig: VitePluginConfig = {
    shortcuts: [
      ['flex-center', 'flex items-center justify-center'],
      ['inline-flex-center', 'inline-flex items-center justify-center'],

      ['btn', 'px-4 py-1 rounded inline-block bg-$va-c-primary text-white cursor-pointer transition hover:bg-$va-c-primary-light disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
      ['va-card', 'shadow hover:shadow-lg bg-$va-c-bg-light'],
    ],
    presets: [
      presetUno(pluginOptions.unocssPresets?.uno),
      presetAttributify(pluginOptions.unocssPresets?.attributify),
      presetIcons({
        scale: 1.2,
        // warn: true,
        ...pluginOptions.unocssPresets?.icons,
      }),
      presetTypography(pluginOptions.unocssPresets?.typography),
      // web fonts is so big, so we disable it, let the user decide
      // presetWebFonts({
      //   fonts: {
      //     serif: [
      //       {
      //         name: 'Noto Serif SC',
      //         weights: [900],
      //       },
      //     ],
      //   },
      // }),
    ],
    rules: [
      // more see 'valaxy/client/styles/global/helper.scss'
      ['font-serif', {
        'font-family': 'var(--va-font-serif)',
      }],
      ['font-sans', {
        'font-family': 'var(--va-font-sans)',
      }],
      ['font-mono', {
        'font-family': 'var(--va-font-mono)',
      }],
    ],
    transformers: [
      transformerDirectives(),
      transformerVariantGroup(),
    ],
    safelist: await createSafelist(options),
  }

  return unocssConfig
}

export async function createUnocssPlugin(options: ResolvedValaxyOptions) {
  const UnoCSS = await import('unocss/vite').then(r => r.default)
  const { unocss: unoOptions } = options.config
  const defaultConfig = await createUnocssConfig(options)

  const { themeRoot, clientRoot, roots } = options

  const unoConfigFiles = ['uno.config.ts', 'unocss.config.ts']
  const configFiles: string[] = []
  const dirs = [themeRoot, clientRoot]
  dirs.forEach(dir =>
    unoConfigFiles.forEach(file =>
      configFiles.push(resolve(dir, file)),
    ),
  )

  let config: UnoCSSConfig | { default: UnoCSSConfig } = {}

  const configDeps: string[] = []

  for (const configFile of configFiles) {
    if (await fs.exists(configFile)) {
      const uConfig = (await jiti.import(configFile, { default: true })) as UnoCSSConfig
      config = defu(config, uConfig)

      configDeps.push(configFile)
    }
  }

  config = await loadSetups(roots, 'unocss.ts', {}, config, true)

  // https://github.com/unocss/unocss/issues/1262
  return UnoCSS({
    configDeps,
    configFile: false,
    ...defu(unoOptions || {}, config, defaultConfig),
  })
}
