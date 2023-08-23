<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let element: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.Renderer;
	let cube: THREE.Mesh;

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		element.appendChild(renderer.domElement);

		cube = createCube();
		scene.add(cube);

		camera.position.z = 5;

		animate();
	});

	function createCube() {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		return new THREE.Mesh(geometry, material);
	}

	function animate() {
		requestAnimationFrame(animate);

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		renderer.render(scene, camera);
	}
</script>

<div bind:this={element} />
