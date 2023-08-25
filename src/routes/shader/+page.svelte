<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { DragControls } from 'three/examples/jsm/controls/DragControls';

	let element: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.Renderer;
	let cube: THREE.Mesh;

	let pointLight: THREE.PointLight;

	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2(1, 1);

	import fragmentShader from '$lib/shaders/fragment';
	import vertexShader from '$lib/shaders/vertex';

	let t = 0;

	let uniforms = {
		u_time: { value: 0.0 }
	};

	let INTERSECTED: any;
	let controls: OrbitControls;
	let dragControls: DragControls;
	let draggable: THREE.Group;
	let clock: THREE.Clock;

	onMount(() => {
		init();
		animate();
	});

	function init() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x151515);
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 5;

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		element.appendChild(renderer.domElement);

		// cube = createCube();
		// scene.add(cube);

		const ambientLight = new THREE.AmbientLight(0xffffff);

		const spaceTexture = new THREE.TextureLoader().load('outer_space.jpg');
		// scene.background = spaceTexture;

		controls = new OrbitControls(camera, renderer.domElement);

		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(1, 1, 1);
		scene.add(pointLight, ambientLight);

		const gridHelper = new THREE.GridHelper();
		// const lightHelper = new THREE.PointLightHelper(pointLight);
		scene.add(gridHelper);

		// addStars(scene);

		draggable = new THREE.Group();

		clock = new THREE.Clock();

		const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
		const material = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms
			// wireframe: true
		});

		const ico = new THREE.Mesh(geometry, material);
		draggable.add(ico);

		ico.position.y = 1;

		scene.add(draggable);

		dragControls = new DragControls(draggable.children, camera, renderer.domElement);

		document.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// function createCube() {
	// 	const geometry = new THREE.BoxGeometry(1, 1, 1);
	// 	const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
	// 	return new THREE.Mesh(geometry, material);
	// }

	function animate() {
		requestAnimationFrame(animate);

		uniforms.u_time.value = clock.getElapsedTime()

		camera.updateMatrixWorld();
		raycaster.setFromCamera(pointer, camera);

		const intersects = raycaster.intersectObjects(draggable.children, false);

		// if (intersects.length > 0) {
		// 	if (INTERSECTED != intersects[0].object) {
		// 		if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

		// 		INTERSECTED = intersects[0].object;
		// 		INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
		// 		INTERSECTED.material.emissive.setHex(0xff0000);
		// 	}
		// } else {
		// 	if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

		// 	INTERSECTED = null;
		// }

		if (intersects.length > 0) {
			controls.enableRotate = false;
		} else {
			controls.enableRotate = true;
		}

		renderer.render(scene, camera);
	}

	function addStars(scene: THREE.Scene) {
		const geometry = new THREE.SphereGeometry(0.25, 24, 24);

		for (let i = 0; i < 2000; i++) {
			const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
			const star = new THREE.Mesh(geometry, material);

			const [x, y, z] = Array(3)
				.fill(() => {})
				.map(() => THREE.MathUtils.randFloatSpread(100));
			star.position.set(x, y, z);

			scene.add(star);
		}
	}

	function handleMouseMove(e: MouseEvent) {
		pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
	}
</script>

<!-- <article>
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
</article> -->
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

		/* display: grid; */
		display: none;
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
