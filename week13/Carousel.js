/***
 * 实现轮播图
 */

import { Component } from './framework.js'
const imgWidth = 450 // 图片宽度
class Carousel extends Component{
  constructor(){
    super()
    this.attributes = Object.create(null)
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  render() {
    this.root = document.createElement("div")
    this.root.classList.add('carousel')
    for (let child of this.attributes.src) {
      let img = document.createElement("div")
      img.style.backgroundImage = `url(${child})`
      this.root.appendChild(img)
    }

    // 手动拖拽移动
    let position = 0 // 位置下标
    this.root.addEventListener('mousedown', event => {
      let startX = event.clientX
      let children = this.root.children

      let move = event => {
        let distance = event.clientX - startX
        // 处理滑到最后一张和第一张再继续会空白的情况
        let current = position - ((distance - distance % imgWidth) / imgWidth) // 这样可以取到distance整数部分且保证绝对值不大于它本身
        for(let offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + children.length) % children.length // 不应该出现负数，用此方法做转换
          children[pos].style.transition = "none"
          children[pos].style.transform = `translateX(${-pos * imgWidth + offset * imgWidth + distance % imgWidth}px)`
        }

        // for(let child of children) {
        //   child.style.transition = "none"
        //   child.style.transform = `translateX(${-position * imgWidth + distance}px)`
        // }
      }
      let up = event => {
        let distance = event.clientX - startX
        position = position - Math.round(distance / imgWidth)

        for(let offset of [0, - Math.sign(Math.round(distance / imgWidth) - distance + imgWidth / 2 * Math.sign(distance))]) {
          let pos = position + offset
          pos = (pos + children.length) % children.length // 不应该出现负数，用此方法做转换

          children[pos].style.transition = ""
          children[pos].style.transform = `translateX(${-pos * imgWidth + offset * imgWidth}px)`
        }

        // for(let child of children) {
        //   child.style.transition = ""
        //   child.style.transform = `translateX(${-position * imgWidth}px)`
        // }
        // 鼠标弹起后要停止move和up的监听
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    let currentIndex = 0
    // 定时轮播 并处理最后一张图后不是返回第一张的效果，而是继续向后到第一张
    // 利用每次切换都是只看到当前张和后一张的动作，让当前张总是向前移，后一张回归它自己的位置
    // setInterval(() => {
    //   const children = this.root.children
    //   let nextIndex = (currentIndex + 1) % children.length // 总共3张图，current每到3就重新变为0

    //   let current = children[currentIndex]
    //   let next = children[nextIndex]

    //   next.style.transition = "none"
    //   next.style.transform = `translateX(${100 - 100 * nextIndex}%)` // 先移到当前的后面做准备
    //   setTimeout(() => {
    //     next.style.transition = "" // js置空，css会生效
    //     current.style.transform = `translateX(${-100 - 100 * currentIndex}%)`
    //     next.style.transform = `translateX(-${100 * nextIndex}%)` // 真实的位置

    //     currentIndex = nextIndex
    //   }, 16) // 16是浏览器一帧的时间
    // }, 3000);
    return this.root
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}