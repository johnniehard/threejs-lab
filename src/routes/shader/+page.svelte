<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { DragControls } from 'three/examples/jsm/controls/DragControls';

	let element: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let renderer: THREE.Renderer;
	let cube: THREE.Mesh;

	let pointLight: THREE.PointLight;

	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2(1, 1);

	import fragmentShader from '$lib/shaders/fragment';
	import vertexShader from '$lib/shaders/vertex';

	let t = 0;

	let uniforms = {
		u_time: { value: 0.0 },
		u_meshPosition: new THREE.Uniform(new THREE.Vector3())
	};

	let INTERSECTED: any;
	let controls: OrbitControls;
	let dragControls: DragControls;
	let draggable: THREE.Group;
	let clock: THREE.Clock;
	let plane: THREE.Mesh;

	onMount(() => {
		init();
		animate();
	});

	let dot: THREE.Mesh;

	function init() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x151515);
		// camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

		camera.zoom = 200;

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

		dot = createControlDot();
		draggable.add(dot);

		plane = new THREE.Mesh(geometry, material);
		scene.add(plane);

		plane.position.y = 1;

		scene.add(draggable);

		dragControls = new DragControls(draggable.children, camera, renderer.domElement);

		dragControls.addEventListener('drag', function (event) {
			event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
		});

		document.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize() {
		(camera.left = window.innerWidth / -2),
			(camera.right = window.innerWidth / 2),
			(camera.top = window.innerHeight / 2),
			(camera.bottom = window.innerHeight / -2),
			renderer.setSize(window.innerWidth, window.innerHeight);
		camera.updateProjectionMatrix();
	}

	// function createCube() {
	// 	const geometry = new THREE.BoxGeometry(1, 1, 1);
	// 	const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
	// 	return new THREE.Mesh(geometry, material);
	// }

	function animate() {
		uniforms.u_time.value = clock.getElapsedTime();
		uniforms.u_meshPosition.value = dot.position.clone()

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
		requestAnimationFrame(animate);
	}

	function createControlDot() {
		const geometry = new THREE.SphereGeometry(0.1, 24, 24);

		const material = new THREE.MeshStandardMaterial({ color: 0x0050ff });
		const dot = new THREE.Mesh(geometry, material);

		return dot;
	}

	function handleMouseMove(e: MouseEvent) {
		pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
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
