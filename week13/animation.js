const TICK = Symbol("tick") // 不想被外界访问的方法，因为Symbol是独一无二的，所以外面即使又定义了一个Symbol("tick")也对应不到TICK
const TICK_HANDLER = Symbol("handler")
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start-time")

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }

  start() {
    let startTime = Date.now()
    this[TICK] = () => {
      // 遍历执行animation
      let now = Date.now()
      for(let animal of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animal) < startTime)
          t = now - startTime
        else 
          t = now - this[START_TIME].get(animal)
        if (animal.duration < t) {
          this[ANIMATIONS].delete(animal)
          t = animal.duration
        }
        animal.receive(t)
      }
      requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

  pause() {}
  resume() {}

  reset() {}

  add(animation, startTime = Date.now()) {
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}

export class Animation{
  constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
  }

  receive(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.startValue + range * time / this.duration
  }
}