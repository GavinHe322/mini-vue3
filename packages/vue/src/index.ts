import * as runtimeDom from '@gavinshuer/runtime-dom'
import { registerRuntimeCompiler } from '@gavinshuer/runtime-dom'

import { baseCompiler } from '@gavinshuer/compiler-core'

export * from '@gavinshuer/runtime-dom'

function compilerToFunction(template, options = {}) {
  const { code } = baseCompiler(template, options)

  // 调用 compiler 得到的代码在给封装到函数内,
  // 这里会依赖 runtimeDom 的一些函数，所以在这里通过参数的形式注入进去
  const render = new Function('Vue', code)(runtimeDom)

  return render
}

registerRuntimeCompiler(compilerToFunction)
