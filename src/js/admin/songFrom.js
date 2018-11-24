{
  // let view = {
  //   el: '.page > .main',
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
        <div class="row">
          <label>
          歌名
          </label>
          <input name="name" type="text" value="__name__">
        </div>
      <div class="row">
          <label>
          歌手
          </label>
          <input name="singer" type="text" value="__singer__">
        </div>
    
      <div class="row">
          <label>
          外链
          </label>
          <input name="url" type="text" value="__url__">
        </div>
     
      <div class="row actions">
          <button type="submit">保存</button>
        </div>
   
    </form>
    `,
    render(data = {}) {
      let placeholders = ['name', 'url', 'singer', 'id']
      /*es6新语法：如果用户没有传入data或者传入的data是undefined,那就默认执行data的新对象*/

      //把key 和link 填入到新对象里

      let html = this.template

      //进行遍历
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '') //把对应下划线的key变成data的key,如果是空的就是空的字符串.

      })
      $(this.el).html(html)
      if (data.id) {
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    },
    reset() {
      this.render({})
    }
  }
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    update(data) {
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      return song.save().then((response) => {

        Object.assign(this.data, data)
        console.log(response)
        return response
      })
    },
    create(data) {
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
      return song.save().then((newSong) => {
        let {
          id,
          attributes
        } = newSong
        Object.assign(this.data, {
          id,
          ...attributes
        })
      }, (error) => {
        console.error(error);
      });
    }
  }


  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()

      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', (data) => {
        if (this.model.data.id) {
          this.model.data = {
            name: '',
            url: '',
            id: '',
            singer: ''
          }
        } else {
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
    },
    creat() {
      let needs = 'name singer url'.split(' ')
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.create(data)
        .then(() => {
          this.view.reset()
          //this.model.data === 'ADDR 108'
          let string = JSON.stringify(this.model.data)
          let object = JSON.parse(string)
          window.eventHub.emit('create', object)
        })
    },
    update() {
      let needs = 'name singer url'.split(' ')
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })

      this.model.update(data).then(() => {
        alert('更新成功')
        window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
      })

    },

    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()

        if (this.model.data.id) {
          console.log('id存在')
          this.update()
        } else {
          console.log('id不存在')
          this.creat()
        }
      })
    }
    //   window.eventHub.on('upload', (data) => {
    //     //拿到真正的data就reset,就把这个data render到我的view里面
    //     this.view.render(data)
    //     console.log('songList 模块得到了data')
    //     console.log(data)
    //   })
    // }
  }
  controller.init(view, model)
}