{
  const body = document.body

  const MathUtils = {
    lineEq: (y2, y1, x2, x1, currentVal) => {
      // y = mx + b
      var m = (y2 - y1) / (x2 - x1),
        b = y1 - m * x1
      return m * currentVal + b
    },
    lerp: (a, b, n) => (1 - n) * a + n * b,
    getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
  }

  const getMousePos = e => {
    let posx = 0
    let posy = 0
    if (!e) e = window.event
    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft
      posy = e.clientY + body.scrollTop + document.documentElement.scrollTop
    }
    return { x: posx, y: posy }
  }

  let winsize
  const calcWinsize = () => (winsize = { width: window.innerWidth, height: window.innerHeight })
  calcWinsize()
  window.addEventListener("resize", calcWinsize)

  let mousepos = { x: winsize.width / 2, y: winsize.height / 2 }
  window.addEventListener("mousemove", ev => (mousepos = getMousePos(ev)))

  class Cursor {
    constructor(el) {
      this.DOM = { el: el }
      this.DOM.circle = this.DOM.el.querySelector(".cursor__inner")
      this.bounds = this.DOM.circle.getBoundingClientRect()
      this.lastMousePos = { x: 0, y: 0 }
      this.scale = 1
      this.lastScale = 1
      requestAnimationFrame(() => this.render())
    }
    render() {
      this.lastMousePos.x = MathUtils.lerp(
        this.lastMousePos.x,
        mousepos.x - this.bounds.width / 2,
        0.2
      )
      this.lastMousePos.y = MathUtils.lerp(
        this.lastMousePos.y,
        mousepos.y - this.bounds.height / 2,
        0.2
      )
      this.lastScale = MathUtils.lerp(this.lastScale, this.scale, 0.15)
      this.DOM.circle.style.transform = `translateX(${this.lastMousePos.x}px) translateY(${
        this.lastMousePos.y
      }px) scale(${this.lastScale})`
      requestAnimationFrame(() => this.render())
    }
    enter() {
      this.scale = 1.9
    }
    leave() {
      this.scale = 1
    }
    click() {
      this.lastScale = 0.4
    }
  }

  const cursor = new Cursor(document.querySelector(".cursor"))

  const dialog = document.getElementById("dialog")
  const openBtn = document.getElementById("openBtn")
  const closeBtn = document.getElementById("closeBtn")

  openBtn.addEventListener("click", function() {
    dialog.setAttribute("open", true)
  })

  closeBtn.addEventListener("click", function() {
    dialog.removeAttribute("open")
  })

  ;[...document.querySelectorAll("a"), openBtn, closeBtn].forEach(link => {
    link.addEventListener("mouseenter", () => cursor.enter())
    link.addEventListener("mouseleave", () => cursor.leave())
  })

  document.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "1":
        window.open("/past.html");
        break;
      case "2":
        window.open("/present.html");
        break;
      case "3":
        window.open("/future.html");
        break;
      default:
        return;
    }

    event.preventDefault();
  }, true);
}
