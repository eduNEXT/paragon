#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');
const { StyleDictionary, colorTransform, createCustomCSSVariables } = require('./style-dictionary');
const { createIndexCssFile } = require('./utils');

program
  .version('0.0.1')
  .description('CLI to build design tokens for various platforms (currently only CSS is supported) from Paragon Design Tokens.')
  .option('--build-dir <char>', 'A path to directory where to put files with built tokens, must end with a /.', './build/')
  .option('--source <char>', 'A path where to look for additional tokens that will get merged with Paragon ones, must be a path to root directory of the token files that contains "root" and "themes" subdirectories.')
  .option('--source-tokens-only', 'If provided, only tokens from --source will be included in the output; Paragon tokens will be used for references but not included in the output.')
  .option('--themes <themes...>', 'A list of theme variants to build. By default, Paragon currently only supports a light theme.')
  .parse();

const {
  buildDir,
  source: tokensSource,
  sourceTokensOnly: hasSourceTokensOnly,
  themes,
} = program.opts();

const coreConfig = {
  include: [path.resolve(__dirname, 'src/core/**/*.json')],
  source: tokensSource ? [`${tokensSource}/core/**/*.json`] : [],
  platforms: {
    css: {
      prefix: 'pgn',
      transformGroup: 'css',
      // NOTE: buildPath must end with a slash
      buildPath: buildDir.slice(-1) === '/' ? buildDir : `${buildDir}/`,
      files: [
        {
          format: 'css/custom-variables',
          destination: 'core/variables.css',
          filter: hasSourceTokensOnly ? 'isSource' : undefined,
          options: {
            outputReferences: !hasSourceTokensOnly,
          },
        },
        {
          format: 'css/custom-media-breakpoints',
          destination: 'core/custom-media-breakpoints.css',
          filter: hasSourceTokensOnly ? 'isSource' : undefined,
          options: {
            outputReferences: !hasSourceTokensOnly,
          },
        },
      ],
      transforms: StyleDictionary.transformGroup.css.filter(item => item !== 'size/rem').concat('color/sass-color-functions', 'str-replace'),
      options: {
        fileHeader: 'customFileHeader',
      },
    },
  },
};

const getStyleDictionaryConfig = (themeVariant) => ({
  ...coreConfig,
  include: [...coreConfig.include, path.resolve(__dirname, `src/themes/${themeVariant}/**/*.json`)],
  source: tokensSource ? [`${tokensSource}/themes/${themeVariant}/**/*.json`] : [],
  transform: {
    'color/sass-color-functions': {
      ...StyleDictionary.transform['color/sass-color-functions'],
      transformer: (token) => colorTransform(token, themeVariant),
    },
  },
  format: {
    'css/custom-variables': formatterArgs => createCustomCSSVariables({
      formatterArgs,
      themeVariant,
    }),
  },
  platforms: {
    css: {
      ...coreConfig.platforms.css,
      files: [
        {
          format: 'css/custom-variables',
          destination: `themes/${themeVariant}/variables.css`,
          filter: hasSourceTokensOnly ? 'isSource' : undefined,
          options: {
            outputReferences: !hasSourceTokensOnly,
          },
        },
        {
          format: 'css/utility-classes',
          destination: `themes/${themeVariant}/utility-classes.css`,
          filter: hasSourceTokensOnly ? 'isSource' : undefined,
          options: {
            outputReferences: !hasSourceTokensOnly,
          },
        },
      ],
    },
  },
});

StyleDictionary.extend(coreConfig).buildAllPlatforms();

// This line creates the index file for core folder, specially when buildDir is outside Paragon.
createIndexCssFile({ buildDir, isTheme: false });

const THEME_VARIANTS = themes || ['light'];

THEME_VARIANTS.forEach((themeVariant) => {
  const config = getStyleDictionaryConfig(themeVariant);
  StyleDictionary.extend(config).buildAllPlatforms();
  createIndexCssFile({ buildDir, isTheme: true, themeVariant });
});
