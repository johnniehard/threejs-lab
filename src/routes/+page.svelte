<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	let element: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.Renderer;
	let cube: THREE.Mesh;

	let pointLight: THREE.PointLight;

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 5;

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		element.appendChild(renderer.domElement);

		cube = createCube();
		scene.add(cube);

		const ambientLight = new THREE.AmbientLight(0xffffff);

		const spaceTexture = new THREE.TextureLoader().load('outer_space.jpg');
		scene.background = spaceTexture;

		// const controls = new OrbitControls(camera, renderer.domElement)

		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(1, 1, 1);
		scene.add(pointLight, ambientLight);

		const gridHelper = new THREE.GridHelper();
		const lightHelper = new THREE.PointLightHelper(pointLight);
		scene.add(lightHelper, gridHelper);

		Array(200)
			.fill(() => {})
			.forEach(() => addStar(scene));

		animate();
        document.body.onscroll = moveCamera
	});

	function moveCamera() {

        const t = document.body.getBoundingClientRect().top

		cube.rotation.y = (t / window.innerHeight) * Math.PI * 2;

        camera.position.z = 5 + t * -0.01
        camera.position.y =   t * -0.01
        camera.rotation.x = t * 0.001;
	}

	function createCube() {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		return new THREE.Mesh(geometry, material);
	}

	function animate() {
		requestAnimationFrame(animate);

		// cube.rotation.x += 0.01;
		// cube.rotation.x += 0.01;

		renderer.render(scene, camera);
	}

	function addStar(scene: THREE.Scene) {
		const geometry = new THREE.SphereGeometry(0.25, 24, 24);
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
		const star = new THREE.Mesh(geometry, material);

		const [x, y, z] = Array(3)
			.fill(() => {})
			.map(() => THREE.MathUtils.randFloatSpread(100));
		star.position.set(x, y, z);

		scene.add(star);
	}

	function handleMouseMove(e: MouseEvent) {}
</script>


<article >
	<h1 style="grid-column: 2 / span 5">Hello</h1>
	<p style="grid-column: 2 / span 5">
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, laboriosam. Esse quisquam
		molestias, labore alias inventore sed, autem sit culpa ipsa cum corrupti ex, nulla expedita
		illum incidunt neque mollitia. Quam quo porro doloremque eligendi. Fugiat vero quae fuga iusto
		iste ad. Est laudantium optio id similique modi aut impedit neque pariatur magnam sint sapiente
		facere possimus, ea suscipit, dolorum illum magni quo saepe blanditiis, quidem minima? Odit
		nesciunt reiciendis voluptas facilis saepe soluta, explicabo exercitationem molestiae quidem
		facere quam ducimus molestias beatae deserunt asperiores laborum a consequatur ipsum repellat
		dolore quos quasi. Cum voluptatem repellendus eos ducimus maiores ipsa!
	</p>
	<p style="grid-column: 5 / span 3">
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, laboriosam. Esse quisquam
		molestias, labore alias inventore sed, autem sit culpa ipsa cum corrupti ex, nulla expedita
		illum incidunt neque mollitia. Quam quo porro doloremque eligendi. Fugiat vero quae fuga iusto
		iste ad. Est laudantium optio id similique modi aut impedit neque pariatur magnam sint sapiente
		facere possimus, ea suscipit, dolorum illum magni quo saepe blanditiis, quidem minima? Odit
		nesciunt reiciendis voluptas facilis saepe soluta, explicabo exercitationem molestiae quidem
		facere quam ducimus molestias beatae deserunt asperiores laborum a consequatur ipsum repellat
		dolore quos quasi. Cum voluptatem repellendus eos ducimus maiores ipsa!
	</p>
	<p style="grid-column: 2 / span 5">
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, laboriosam. Esse quisquam
		molestias, labore alias inventore sed, autem sit culpa ipsa cum corrupti ex, nulla expedita
		illum incidunt neque mollitia. Quam quo porro doloremque eligendi. Fugiat vero quae fuga iusto
		iste ad. Est laudantium optio id similique modi aut impedit neque pariatur magnam sint sapiente
		facere possimus, ea suscipit, dolorum illum magni quo saepe blanditiis, quidem minima? Odit
		nesciunt reiciendis voluptas facilis saepe soluta, explicabo exercitationem molestiae quidem
		facere quam ducimus molestias beatae deserunt asperiores laborum a consequatur ipsum repellat
		dolore quos quasi. Cum voluptatem repellendus eos ducimus maiores ipsa!
	</p>
</article>
<div class="bg" bind:this={element} />

<style>
	article {
		position: absolute;
        width: 100%;
		/* display: none; */
		/* background: blue; */
		color: white;
		margin: 0 auto;
		padding-top: 50px;
        z-index: 10;
        margin: 0 auto;
        padding: 120px 0;

        display: grid;
        grid-template-columns: repeat(12, 1fr);
	}
	article > * + * {
		margin-top: 20em;
	}
	.bg {
		/* z-index: -1; */
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
