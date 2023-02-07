import { hasChanged, isObject } from '@gavinshuer/shared'
import { createDep } from './dep'
import { isTracking, trackEffects, triggetEffects } from './effect'
import { reactive } from './reactive'


export class RefImpl {
  private  _rawValue: any
  private _value: any
  public dep
  public __v_isRef = true

  constructor(value) {
    this._rawValue = value
    // 看看value 是不是一个对象，如果是一个对象的话
    // 那么需要用 reactive 包裹一下
    this._value = convert(value)
    this.dep = createDep()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    // 当新的值不等于老的值的话
    // 那么才需要触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      // 更新值
      this._value = convert(newValue)
      this._rawValue = newValue
      // 触发依赖
      triggerRefValue(this)
    }
  }
}

export function ref(value) {
  return createRef(value)
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function createRef(value) {
  const refImpl = new RefImpl(value)

  return refImpl
}

export function triggerRefValue(ref) {
  triggetEffects(ref.dep)
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

// 这个函数的目的是
// 帮助结构 ref
// 比如在 template 中使用 ref 的时候，直接使用就可以了
// 比如：const count = ref(0) -> 在 template 中使用的话 可以直接 count
// 解决方案就是通过 proxy 来对 ref 做处理

const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    // 如果里面是一个 ref 类型的话，那么就返回 .value
    // 如果不是的话，那么直接返回 value 就可以了
    return 
  }
}

// 这里没有处理 objectWithRefs 是 reactive 类型的时候
// TODO reactive 里面如果有 ref 类型的 key 的话，那么也是不需要调用 ref.value 的
// (but 这个逻辑在 reactive 里面没有实现)
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers)
}

// 把 ref 里面的值拿到
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function isRef(value) {
  return !!value.__v_isRef
}
