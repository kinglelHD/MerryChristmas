let mute = true
let _unmute = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" fill-rule="evenodd" d="m89.752 59.582l251.583 251.584l5.433 5.432l49.473 49.473v-.001l30.861 30.861h-.001l25.318 25.318l-30.17 30.17l-187.833-187.834l.001 164.103l-110.73-85.458h-81.02V172.563h80.896l10.537-8.293l-74.518-74.518zm314.213 28.015c67.74 75.639 82.5 181.38 44.28 270.136l-32.95-32.95c23.87-71.003 8.999-151.972-44.615-210.559zm-84.385 67.509c28.626 31.924 41.556 72.77 38.788 112.752l-49.236-49.236c-4.823-12.914-12.148-25.12-21.976-35.884l-.9-.973zm-85.163-69.772l-.001 58.574l-32.78-32.78z"/></svg>'
let _mute = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" fill-rule="evenodd" d="m403.966 426.944l-33.285-26.63c74.193-81.075 74.193-205.015-.001-286.09l33.285-26.628c86.612 96.712 86.61 242.635.001 339.348M319.58 155.105l-33.324 26.659c39.795 42.568 39.794 108.444.001 151.012l33.324 26.658c52.205-58.22 52.205-146.109-.001-204.329m-85.163-69.772l-110.854 87.23H42.667v170.666h81.02l110.73 85.458z"/></svg>'
let btn = document.createElement('button')
btn.innerHTML = _unmute
btn.addEventListener('click', () => {
    mute = !mute
    mute ? btn.innerHTML = _unmute : btn.innerHTML = _mute
    document.getElementById('music').muted = mute
})
btn.id = 'mute-btn'
document.querySelector('html').appendChild(btn)

const name = document.getElementById('name')
name.innerText = window.location.hash.slice(1).replace(/%20/g, ' ') || 'to you'



const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})
const gift_img = document.getElementById('gift_img')
let Konfettis = []
const Gifts = []

class Surprise {
    constructor(x, y, size) {
        this.random = Math.random()
        this.size = this.random > .8 ? size * 500 : size * 250
        this.canvas = canvas
        this.ctx = ctx
        this.x = x
        this.y = y
        this.speedX = Math.random() * 6 - 3
        this.speedY = Math.random() * 6 - 3
        this.speed = .1
        this.friction = .995
        this.images = document.querySelectorAll('.pixel-art')
        this.image = this.random > .8 ? this.images[1] : this.images[0]
        this.delet = false
    }
    update() {
        this.size -= this.speed
        this.speed += .001
        this.speedX *= this.friction
        this.speedY *= this.friction
        this.x += this.speedX
        this.y += this.speedY
        if (this.size < 1) {
            this.delet = true
        }
    }
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size)
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    SNOW = SNOW.filter((snow) => !snow.delet)
    SNOW.forEach(snow => {
        snow.update()
        snow.draw()
    })

    Konfettis = Konfettis.filter(konfetti => !konfetti.delet)
    
    for (var i in Gifts) {
        if (Gifts[i].clicked || Gifts[i].y > canvas.height || Gifts[i].y < - Gifts[i].height) {
            Gifts.splice(i, 1)
            i--
        } else if (Gifts[i].x > canvas.width - Gifts[i].width || Gifts[i].x < 0) {
            Gifts[i].speedX *= -1
        }
    }
    Konfettis.forEach( konfetti => {
        konfetti.update()
        konfetti.draw()
    })
    Gifts.forEach( gift => {
        gift.update()
        gift.draw()
    })

    requestAnimationFrame(animate)
}

window.addEventListener('click', function(e) {
    mouse.x = e.x
    mouse.y = e.y
    for (var i in Gifts) {
        if (collision(Gifts[i], mouse)) {
            Gifts[i].click()
        }
    }
})

class Gift {
    constructor() {
        this.S_width = 324
        this.S_height = 456
        this.size = Math.random() * .08 + .16
        this.width = this.S_width * this.size
        this.height = this.S_height * this.size
        this.img = gift_img
        this.x = Math.random() * (canvas.width - this.width)
        this.y = - this.height
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() + .5
        this.clicked = false
        this.content = this.size * 25
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    click() {   
        this.clicked = true   
        for (let i = 0; i < this.content; i++) {
            Konfettis.push(new Surprise(this.x + this.width * .5, this.y + this.height * .5, this.size));
        }
    }
}

class Mouse {
    constructor() {
        this.x = undefined
        this.y = undefined
        this.width = 1
        this.height = 1
    }
}

let mouse = new Mouse()

setInterval(() => {
    if (Gifts.length < 3 && document.visibilityState == "visible") { 
        Gifts.push(new Gift())
    }
}, 5000);

function collision(r1, r2) {
    if (r1.x + r1.width >= r2.x &&
          r1.x <= r2.x + r2.width &&
        r1.y + r1.height >= r2.y &&
          r1.y <= r2.y + r2.height)
    {
      return true;
    }
    
    return false;
}

let SNOW = []
let speed = 1

class Snow {
    constructor(canvas, ctx) {
        this.size = Math.floor(Math.random() * 10 + 20)
        this.canvas = canvas
        this.ctx = ctx
        this.x = Math.random() * canvas.width
        this.y = - this.size
        this.angel = 0
        this.n = Math.random() * Math.PI
        this.images = document.querySelectorAll('.snow')
        this.image = this.images[Math.floor(Math.random() * this.images.length)]
        this.delet = false
    }
    update() {
        this.n += Math.random() / 100
        this.angel = Math.sin(this.n)
        this.y += .5 * speed
        this.x += this.angel * .5 * speed
        if (this.y > this.canvas.height + this.size) {
            this.delet = true
        }
    }
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size)
    }
}

setInterval(() => {
    if (SNOW.length < 100 && document.visibilityState == "visible") {
        SNOW.push(new Snow(canvas, ctx))
    }
}, 500);

animate()