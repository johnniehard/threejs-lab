<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

	let element: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let renderer: THREE.Renderer;

	let uniforms = {
		u_time: { value: 0.0 },
		u_meshPosition: new THREE.Uniform(new THREE.Vector3())
	};

	let controls: OrbitControls;
	let clock: THREE.Clock;

	onMount(() => {
		init();
		animate();
	});



	function init() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x151515);
		camera = new THREE.OrthographicCamera(
			window.innerWidth / -2,
			window.innerWidth / 2,
			window.innerHeight / 2,
			window.innerHeight / -2,
			1,
			1000
		);
		camera.position.x = -5;
		camera.position.y = 5;
		camera.position.z = 5;

		camera.zoom = 3000;

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		element.appendChild(renderer.domElement);

		const ambientLight = new THREE.AmbientLight(0xffffff);

		controls = new OrbitControls(camera, renderer.domElement);

		scene.add(ambientLight);

		const gridHelper = new THREE.GridHelper();
		scene.add(gridHelper);

		clock = new THREE.Clock();
		window.addEventListener('resize', onWindowResize);

		const geometry = new THREE.SphereGeometry(0.1, 24, 24);
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere)

		


	}

	function onWindowResize() {
		camera.left = 	window.innerWidth / -2,
		camera.right = window.innerWidth / 2,
		camera.top = window.innerHeight / 2,
		camera.bottom = window.innerHeight / -2,
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.updateProjectionMatrix();
	}

	function animate() {
		uniforms.u_time.value = clock.getElapsedTime();

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
</script>

<div class="bg" bind:this={element} />
<div class="overlay">
	<span>
		{uniforms.u_meshPosition.value.x}
	</span>
	<span>
		{uniforms.u_meshPosition.value.y}
	</span>
	<span>
		{uniforms.u_meshPosition.value.z}
	</span>
</div>

<style>
	.overlay {
		display: flex;
		flex-direction: column;
		position: absolute;
		color: white;
	}
	.bg {
		/* z-index: -1; */
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
