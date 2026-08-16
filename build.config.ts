import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: './src/core', name: 'core' },
    { input: './src/content', name: 'content' },
  ],
  declaration: true,
  rollup: {
    commonjs: false,
    emitCJS: false,
  },
})
