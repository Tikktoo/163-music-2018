// window.eventHub = {
//     events:{

//     },
//     emit(eventName,data){  //发布,即找到订阅events的用户全部都call 一遍
//         for(let key in this.events){
//             if(key === eventName){
//                 let fnList = this.events[key]
//                 fnList.map((fn)=>{
//                     fn.call(undefined,data)
//                 })
//             }
//         }
//     },
//     on(eventName,fn){  //订阅
//         if(this.events[eventName] === undefined){  //检查events是否是空数组，如果是，就进行初始化
//             this.events[eventName] = []
//         }
//         this.events[eventName].push(fn)//不管是不是空的都要push
//     },

// }
window.eventHub = {
  events: {},
  emit(eventName, data) {
    for (let key in this.events) {
      if (key === eventName) {
        let fnList = this.events[key]
        fnList.map((fn) => {
          fn.call(undefined, data)
        })
      }
    }
  },
  on(eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },

}