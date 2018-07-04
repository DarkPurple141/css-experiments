
// import geom as g from './geom.js'

const DIMENSIONS = {
   width: 300,
   height: 300
}


const randomHex = () => randomInt(0,255).toString(16)
const randomInt = (min, max) => Math.floor(Math.random()*(max-min) + min)
const randomColor = () => '#'+[0,1,2].map(randomHex).join('')
const offScreen = (x, y) =>
   (x < 0 || y < 0 || x > DIMENSIONS.width || y > DIMENSIONS.height)


function makeCircleElement() {
   const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

   const mass = randomInt(0, 10)

   circle.setAttribute('cx', randomInt(0, DIMENSIONS.width))
   circle.setAttribute('cy', randomInt(0, DIMENSIONS.height))
   circle.setAttribute('r', mass)
   circle.setAttribute('fill', randomColor())

   circle.data = {
      vx: 0,
      vy: 0,
      mass,
   }

   return circle
}

function extractPoint(circle) {
   let x = Number(circle.attributes['cx'].nodeValue)
   let y = Number(circle.attributes['cy'].nodeValue)

   return { x, y }
}


function init () {
   const c = document.getElementById('content')

   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
   svg.setAttribute('viewBox', `0 0 ${DIMENSIONS.width} ${DIMENSIONS.height}`)

   let circles = []

   for (let i = 0; i < 20; i++) {
      let circle = makeCircleElement()

      circles.push(circle)
      svg.appendChild(circle)
   }

   function animate() {

      const s = new Set()

      for (el of circles) {

         if (s.has(el)) continue

         let x = el.attributes['cx'].nodeValue
         let y = el.attributes['cy'].nodeValue

         
         el.data.vx = 0
         el.data.vy = 0
         

         let p1 = extractPoint(el)

         for (alt of circles) {
            if (alt === el) continue
            let p2 = extractPoint(alt)
            let { vx, vy } = getGravity(
               { point: p1, mass: el.data.mass },
               { point: p2, mass: alt.data.mass }
            )

            if (distance(p1, p2) < el.data.mass) {
               el.data.mass += alt.data.mass
               el.attributes['r'].nodeValue = el.data.mass
               s.add(alt)
               svg.removeChild(alt)
               circles = circles.filter(item => item != alt)
            } else {
               el.data.vx += vx
               el.data.vy += vy
            }
         }

         if (offScreen(Number(x), Number(y))) {
            svg.removeChild(el)
            circles = circles.filter(item => item != el)
         }

      }

      // do this after working out vel
      for (el of circles) {
         let x = el.attributes['cx'].nodeValue
         let y = el.attributes['cy'].nodeValue

         el.attributes['cx'].nodeValue = +x+el.data.vx
         el.attributes['cy'].nodeValue = +y+el.data.vy
      }
   }

   c.appendChild(svg)

   const id = setInterval(animate, 20)

}


document.addEventListener('DOMContentLoaded', init)
