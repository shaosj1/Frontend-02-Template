let element = document.documentElement;

// 鼠标监听
element.addEventListener("mousedown", event => {
  let context = Object.create(null)
  contexts.set("mouse" + (1 << event.button), context)

  start(event, context)

  let mousemove = event => {
    // move监听不到鼠标左键还是右键，可以使用event.buttons掩码来判断
    let button = 1;
    while(button <= event.buttons) {
      if (button && event.buttons) {

        // order of buttons & button property is not same
        let key;
        if(button === 2)
          key = 4
        else if(button === 4)
          key = 2
        else
          key = button
        let context = contexts.get("mouse" + key)
        move(event, context)
      }
      button = button << 1
    }
  }
  let mouseup = event => {
    let context = contexts.set("mouse" + (1 << event.button))
    end(event, context)
    contexts.delete("mouse" + (1 << event.button))
    element.removeEventListener("mousemove", mousemove)
    element.removeEventListener("mouseup", mouseup)
  }

  element.addEventListener("mousemove", mousemove)
  element.addEventListener("mouseup", mouseup)
})

let contexts = new Map();

// 与鼠标事件不同，touch事件的start move都作用在同一元素上，所以他们可以同级存在
element.addEventListener("touchstart", event => {
  for (let touch of event.changedTouches) {// 多点触摸，是个数组，从中得到clientX，clientY
    let context = Object.create(null)
    contexts.set(touch.identifier, context)
    start(touch, context)
  }
})
element.addEventListener("touchmove", event => {
  for (let touch of event.changedTouches) {
    let context = contexts.set(touch.identifier)
    move(touch, context)
  }
})
element.addEventListener("touchend", event => {
  for (let touch of event.changedTouches) {
    let context = contexts.set(touch.identifier)
    end(touch, context)
    contexts.delete(touch.identifier)
  }
})
// touch事件流程 触发start-》move-》end  若中间被打断就无法end，而执行cancel
element.addEventListener("touchcancel", event => {
  for (let touch of event.changedTouches) {
    let context = contexts.set(touch.identifier)
    cancel(touch, context)
    contexts.delete(touch.identifier)
  }
})

// let startX, startY;
// let isPan = false, isTap = true, isPress = false;
// let handler;

/**
 * start关注三件事：1.是否end 2.是否移动10px（小于10px不算移动）3.是否长按0.5s
 * @param {*} point 
 */
let start = (point, context) => {
  context.startX = point.clientX, startY = point.clientY;

  context.points = [{
    t: Date.now(),
    x:point.clientX,
    y:point.clientY
  }];

  context.isTap = true
  context.isPan = false
  context.isPress = false

  // 关注长按0.5s
  handler = setTimeout(() => {
    context.isTap = false
    context.isPan = false
    context.isPress = true
    context.handler = null // 置为null避免多次clear
  }, 500);
}
/**
 * 移动
 * 可以判断flick 根据一定时间内点取平均速度
 * @param {*} point 
 * @param {*} context 
 */
let move = (point, context) => {
  let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

  // 关注移动10px
  if(!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false
    context.isPan = true
    context.isPress = false
    console.log('panstart')
    clearTimeout(context.handler)
  }

  if(context.isPan) {
    console.log('pan')
  }

  context.points = context.points.filter(point => Date.now() - point.t < 500)
  context.points.push({
    t: Date.now(),
    x:point.clientX,
    y:point.clientY
  })
}
let end = (point, context) => {
  if(context.isTap) {
    dispatch("tap", {})
    clearTimeout(context.handler)
  }
  if(context.isPan) {
    console.log("panend")
  }
  if(context.isPress) {
    console.log("pressend")
  }
  context.points = context.points.filter(point => Date.now() - point.t < 500)
  let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientX - context.points[0].x) ** 2);
  let v = d / (DataCue.now - context.points[0].t)
  if (v > 1.5) {
    console.log("flick")
  }
}
let cancel = (point, context) => {
  clearTimeout(context.handler)
}

/**
 * 派发事件
 */
function dispatch(type, properties) {
  let event = new Event(type)
  for(let name in properties) {
    event[name] = properties[name]
  }
  element.dispatchEvent(event)
}