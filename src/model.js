import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

class Model {
	constructor(obj) {
		this.name = obj.name
		this.file = obj.file
		this.scene = obj.scene
		this.placeOnLoad = obj.placeOnLoad
		this.color1 = obj.color1
		this.color2 = obj.color2
		this.background = obj.background

		this.isActive = false

		this.loader = new GLTFLoader()
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath('./draco/')
		this.loader.setDRACOLoader(this.dracoLoader)

		this.init()
	}

	init() {
		this.loader.load(this.file, (response) => {
			/*------------------------------
			Original Mesh
			------------------------------*/

			this.mesh = response.scene.children[0]

			/*------------------------------
			Material Mesh
			------------------------------*/
			this.material = new THREE.MeshBasicMaterial({
				color: 'red',
				wireframe: true,
			})
			this.mesh.material = this.material

			/*------------------------------
			Geometry Mesh
			------------------------------*/

			this.geometry = this.mesh.geometry

			/*------------------------------
			Particles Material
			------------------------------*/
			// this.particlesMaterial = new THREE.PointsMaterial({
			// 	color: 'red',
			// 	size: 0.02,
			// })

			this.particlesMaterial = new THREE.ShaderMaterial({
				uniforms: {
					uColor1: { value: new THREE.Color(this.color1) },
					uColor2: { value: new THREE.Color(this.color2) },
					uTime: { value: 0 },
					uScale: { value: 0 },
				},
				vertexColors: true,
				vertexShader: vertex,
				fragmentShader: fragment,
				transparent: true,
				depthTest: false,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
			})

			/*------------------------------
			Particles Geometry
			------------------------------*/

			const sampler = new MeshSurfaceSampler(this.mesh).build()
			const numParticles = 20000
			this.particlesGeometry = new THREE.BufferGeometry()
			const particlesPosition = new Float32Array(numParticles * 3)
			const colors = new Float32Array(numParticles * 3)
			const backColor = new THREE.Color(this.color1)
			const frontColor = new THREE.Color(this.color2)
			const particleRandomness = new Float32Array(numParticles * 3)

			for (let i = 0; i < numParticles; i++) {
				const newPosition = new THREE.Vector3()
				sampler.sample(newPosition)
				particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3)

				const random = Math.random() * newPosition.z

				const mixedColor = backColor.clone()
				mixedColor.lerp(frontColor, (random / newPosition.z) * newPosition.z + 0.4)
				colors.set([mixedColor.r, mixedColor.g, mixedColor.b], i * 3)

				particleRandomness.set(
					[Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
					i * 3
				)
			}

			this.particlesGeometry.setAttribute(
				'position',
				new THREE.BufferAttribute(particlesPosition, 3)
			)

			this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

			this.particlesGeometry.setAttribute(
				'aRandom',
				new THREE.BufferAttribute(particleRandomness, 3)
			)

			// console.log(this.particlesGeometry)
			/*------------------------------
			Particles
			------------------------------*/
			this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

			/*------------------------------
			Place on Load
			------------------------------*/

			if (this.placeOnLoad) {
				this.add()
			}
		})
	}

	add() {
		this.scene.add(this.particles)

		gsap.to(this.particlesMaterial.uniforms.uScale, {
			value: 1,
			duration: 0.8,
			delay: 0.5,
			ease: 'power3.out',
		})

		if (!this.isActive) {
			gsap.fromTo(
				this.particles.rotation,
				{
					y: Math.PI,
				},
				{
					y: 0,
					duration: 0.8,
					ease: 'power3.out',
				}
			)

			gsap.to('body', {
				background: this.background,
				duration: 0.8,
			})
		}

		this.isActive = true
	}

	remove() {
		gsap.to(this.particlesMaterial.uniforms.uScale, {
			value: 0,
			duration: 0.8,
			ease: 'power3.out',
			onComplete: () => {
				this.scene.remove(this.particles)
				this.isActive = false
			},
		})

		gsap.from(this.particles.rotation, {
			y: Math.PI,
			duration: 0.8,
			ease: 'power3.out',
		})
	}
}

export default Model
