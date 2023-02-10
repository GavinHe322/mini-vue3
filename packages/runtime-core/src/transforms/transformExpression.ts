import { NodeTypes } from '../ast'

export function transformExpression(node) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.context = processExpression(node.content)
  }
}

function processExpression(node) {
  node.content = `_ctx.${node.content}`
  return
}
