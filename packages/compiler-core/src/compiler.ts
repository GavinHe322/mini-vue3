import { generate } from './codegen'
import { baseParse } from './parse'
import { transform } from './transform'
import { transformElement } from './transforms/transformElement'
import { transformExpression } from './transforms/transformExpression'
import { transformText } from './transforms/transformText'

export function baseCompiler(template, options) {
  // 1.现将 template parse 成 ast
  const ast = baseParse(template)
  // 2.给 ast 加点料（- -#)
  transform(
    ast,
    Object.assign(options, {
      nodeTransforms: [transformElement, transformText, transformExpression]
    })
  )

  // 3. 生成 render 函数代码
  return generate(ast)
}
