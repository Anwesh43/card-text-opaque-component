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
        if(!this.opaqueTextImageCard) {
            this.opqaueTextImageCard = new OpaqueTextImageCard(this.text,this.image)
        }
        this.opaqueTextImageCard.draw(context)
        this.img.src = canvas.toDataURL()
    }
    start() {
        if(this.opaqueTextImageCard) {
            this.opaqueTextImageCard.startUpdate()
        }
    }
    update() {
        if(this.opaqueTextImageCard) {
            this.opaqueTextImageCard.update()
        }
    }
    stop() {
        return this.opaqueTextImageCard && this.opaqueTextImageCard.stopUpdate()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
        this.animator = new Animator(this)
        this.mouseHandler = new MouseHandler(this.animator,this.img)
        this.mouseHandler.handleHover()
    }
}
class OpaqueTextImageCard {
    constructor(text,image) {
        this.text = text
        this.image = image
        this.state = new State()
    }
    draw(context) {
        const w = this.iamge.width, h = this.image.height
        context.save()
        context.drawImage(this.image,0,0)
        context.save()
        context.globalAlpha = 0.45
        context.fillStyle = 'black'
        context.fillRect(0,h*(1-this.state.scale),w,h*this.state.scale)
        context.restore()
        context.fillStyle = 'white'
        context.font = context.font.replace(/\d{2}/,Math.min(w,h)/10)
        const tw = w/2 - context.measureText(this.text).width
        context.fillText(this.text,tw,h - (h/2)*this.state.scale)
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
class Animator  {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.start()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stop()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
class MouseHandler {
    constructor(animator,element) {
        this.over = false
        this.animator = animator
        this.element = element
    }
    handleHover() {
        this.element.onmouseover = () => {
            if(!this.over && !this.animator.animated) {
                this.over = true
                this.animator.start()
            }
        }
        this.element.onmouseout = () => {
            if(this.over && !this.animator.animated) {
                this.over = false
                this.animator.start()
            }
        }
    }
}
customElements.define('card-text-opaque-comp',CardTextOpaqueComponent)
