import { ShapeFlags } from '@gavinshuer/shared'

export function initSlots(instance, children) {
  const { vnode } = instance

  console.log('初始化 initSlots')

  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, (instance.slots = {}))
  }
}

const normalizeSlotValue = (value) => {
  // 把 function 返回的值转换成 Array, 这样 slot 就可以支持多个元素了
  return Array.isArray(value) ? value : [value]
}

const normalizeObjectSlots = (rawSlots, slots) => {
  for (const key in rawSlots) {
    const value = rawSlots[key]
    if (typeof value === 'function') {
      // 把这个函数给到 slots 对象上存起来
      // 后续在 renderSlots 中调用
      // TODO 这里没有对 value 做 normalize
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (props) => normalizeSlotValue(props)
    }
  }
}
