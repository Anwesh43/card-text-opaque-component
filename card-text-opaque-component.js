class CardTextOpaqueComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
        this.text = this.getAttribute('text')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width
        canvas.height = this.image.height
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
class OpaqueTextImageCard {
    constructor(text,image) {
        this.text = text
        this.image = image
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.drawImage(this.image,0,0)
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopUpdate() {
        return this.state.stopped()
    }
    startUpdate() {
        this.state.start()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.animDir = 0
    }
    update() {
        this.scale += 0.1*this.animDir
        if(this.scale > 1) {
            this.animDir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.scale = 0
            this.animDir = 0
        }
    }
    stopped() {
          return this.animDir == 0
    }
    start() {
        this.animDir = 1 - 2*this.scale
    }
}
