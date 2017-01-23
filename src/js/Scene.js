import * as THREE from 'three'
import Testarossa from './Testarossa'
import Grid from './Grid'
import Postprocessing from './Postprocessing'

const Scene = {
  FIELDOFVIEW: 60,
  NEAR: 0.1,
  FAR: 5000,

  // the factor which determines how much space the car can take up
  STREET_FACTOR: 0.003,

  container: document.getElementById('scene'),

  posX: 0,
  rotationY: 0,


  init() {

    // let's bind the methods to the class
    this.render = this.render.bind(this)
    this.fitRendererToElement = this.fitRendererToElement.bind(this)
    this.getPositionFromMouse = this.getPositionFromMouse.bind(this)
    this.getPositionFromAccelerometer = this.getPositionFromAccelerometer.bind(this)

    // let's create the scene, camera and renderer
    this.Scene = new THREE.Scene()
    this.Camera = new THREE.PerspectiveCamera(this.FIELDOFVIEW, 1, this.NEAR, this.FAR)
    this.Renderer = new THREE.WebGLRenderer({
      alpha: true, // these two parameters get fucking ignored because we use another renderer with postprocessing
      antialias: true,
    })
    this.Renderer.setPixelRatio(window.devicePixelRatio)
    this.Renderer.setClearColor(0x112342, 1)

    this.Clock = new THREE.Clock()

    // let's resize the renderer so it fits its parent
    this.fitRendererToElement(this.container)

    // let's add it to the DOM
    this.container.appendChild(this.Renderer.domElement)

    // position camera
    this.Camera.position.set(0, 7, 30)
    // this.Camera.position.set(0, 300, 0) // look from up
    this.Camera.lookAt(new THREE.Vector3(0, 0, 0))

    // let's add the lights
    const hemisphereLight = new THREE.HemisphereLight(0xffffff)
    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(0, 10, -20)
    this.Scene.add(hemisphereLight)
    this.Scene.add(pointLight)

    // add the resize listener
    window.addEventListener('resize', this.fitRendererToElement.bind(this, this.container))

    // let's add the grid
    this.grid = Grid.init()
    this.Scene.add(this.grid)

    // let's add the fps thing if we're in development
    if (process.env.NODE_ENV === 'development') {
      const Stats = require('stats.js') // ideally this would be loaded async
      this.stats = new Stats()
      this.container.appendChild(this.stats.dom)
    }

    // let's add the postprocessing
    this.Composer = Postprocessing.init()

    // TODO fire this shit before on constructor
    Testarossa.load() // GODDAMIT constructor why can't you be async??
      .then((obj) => {
        this.testarossa = obj
        this.Scene.add(this.testarossa)

        // attach the interaction events
        this.addEventListeners()

        // let's start the render loop
        requestAnimationFrame(this.render)
      })
  },


  addEventListeners() {
    // if it's touch and it's shorter than 1024px (fucking touch laptops!!)
    if ('ontouchstart' in window && window.matchMedia('(max-width: 1024px)').matches) {
      window.addEventListener('deviceorientation', this.getPositionFromAccelerometer, { useCapture: true })
    } else {
      document.addEventListener('mousemove', this.getPositionFromMouse)
    }
  },


  // get the left/right position from the mouse
  getPositionFromMouse(e) {
    const mouseX = e.pageX

    this.posX = (mouseX - this.horizontalCenter) * this.STREET_FACTOR
  },

  // get the left/right position from the accelerometer
  getPositionFromAccelerometer(e) {
    const orientationY = e.gamma

    this.posX = (orientationY * 30) * this.STREET_FACTOR
  },


  // the render loop
  render() {
    // this.testarossa.rotation.y += 0.05

    // calculate the car left and right position
    this.testarossa.position.x += (this.posX - this.testarossa.position.x) / 30
    // could be done also with tweenmax:
    // TweenLite.to(this.testarossa.position, 3, {
    //   x: this.posX,
    //   ease: Power1.easeOut,
    // })


    // calculate the car rotation when driving
    this.rotationY = - (this.posX - this.testarossa.position.x) * 0.1
    this.testarossa.rotation.y += (this.rotationY - this.testarossa.rotation.y) / 30
    // could be done also with tweenmax:
    // TweenLite.to(this.testarossa.rotation, 3, {
    //   y: this.rotationY,
    //   ease: Power1.easeOut,
    // })

    // let's rerender and recall this function
    if (this.Composer) {
      // this.Composer.render(this.Clock.getDelta())
      this.Composer.render()
    } else {
      this.Renderer.render(this.Scene, this.Camera)
    }

    if (this.stats) {
      this.stats.update()
    }

    requestAnimationFrame(this.render)
  },

  /**
   * fit the renderer to the object we pass as an argument
   * @param  {node} el - the container to which we'll fit the canvas
   */
  fitRendererToElement(el) {
    const width = el.innerWidth || el.offsetWidth
    const height = el.innerHeight || el.offsetHeight
    const ratio = width / height

    this.Renderer.setSize(width, height)

    this.Camera.aspect = ratio
    this.Camera.updateProjectionMatrix()

    this.horizontalCenter = window.innerWidth / 2
  },

}


export default Scene