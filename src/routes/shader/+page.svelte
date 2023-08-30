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

	import fragmentShader from './shaders/fragment';
	import vertexShader from './shaders/vertex';

	let t = 0;
	const PLANE_SIZE = 8.0;

	let uniforms = {
		u_time: { value: 0.0 },
		u_meshPosition: new THREE.Uniform(new THREE.Vector3()),
		u_meshPosition2: new THREE.Uniform(new THREE.Vector3()),
		u_meshPosition3: new THREE.Uniform(new THREE.Vector3()),
		u_size: {value: PLANE_SIZE}
	};

	let controls: OrbitControls;
	let dragControls: DragControls;
	let draggable: THREE.Group;
	let clock: THREE.Clock;
	let plane: THREE.Mesh;
	let aspectRatio: number;

	onMount(() => {
		init();
		animate();
	});

	let dot: THREE.Mesh;
	let dot2: THREE.Mesh;
	let dot3: THREE.Mesh;
	
	function init() {
		scene = new THREE.Scene();
		aspectRatio = window.innerWidth / window.innerHeight;
		scene.background = new THREE.Color(0x151515);
		camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 100);

		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 10;
		camera.zoom = 0.5

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		element.appendChild(renderer.domElement);

		const ambientLight = new THREE.AmbientLight(0xffffff);

		controls = new OrbitControls(camera, renderer.domElement);

		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(1, 1, 1);
		scene.add(pointLight, ambientLight);

		draggable = new THREE.Group();

		clock = new THREE.Clock();

		dot = createControlDot();
		dot.position.x = -1.0;
		dot.position.y = -0.5;
		dot2 = createControlDot();
		dot2.position.x = 1.0;
		dot2.position.y = -0.5;
		draggable.add(dot, dot2);
		dot3 = createControlDot();
		dot3.position.x = 0;
		dot3.position.y = 1.0;
		draggable.add(dot, dot3);

		const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
		const material = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms,
			transparent: true,
		});

		plane = new THREE.Mesh(geometry, material);
		scene.add(plane);

		scene.add(draggable);

		dragControls = new DragControls(draggable.children, camera, renderer.domElement);

		dragControls.addEventListener('drag', function (event) {
			event.object.position.z = 0;
		});

		document.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize() {
		aspectRatio = window.innerWidth / window.innerHeight;

		camera.left = -aspectRatio
		camera.right = aspectRatio
		camera.top = 1
		camera.bottom = -1
			renderer.setSize(window.innerWidth, window.innerHeight);
		camera.updateProjectionMatrix();
	}

	function animate() {
		uniforms.u_time.value = clock.getElapsedTime();
		uniforms.u_meshPosition.value = dot.position.clone();
		uniforms.u_meshPosition2.value = dot2.position.clone();
		uniforms.u_meshPosition3.value = dot3.position.clone();

		camera.updateMatrixWorld();
		raycaster.setFromCamera(pointer, camera);

		const intersects = raycaster.intersectObjects(draggable.children, false);

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

		const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
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
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
