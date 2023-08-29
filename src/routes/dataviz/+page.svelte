<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import type { PageData } from './$types';

	export let data: PageData;
	import fragmentShader from './shaders/fragment';
	import vertexShader from './shaders/vertex';
	import { scaleLinear, scaleLog, scaleSymlog } from 'd3-scale';
	import { extent } from 'd3-array';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { DragControls } from 'three/examples/jsm/controls/DragControls';

	const yearExtent = extent(data.data.tidy, (d) => d.year) as [number, number];
	const popExtent = extent(data.data.tidy, (d) => d.population) as [number, number];
	const scaleX = scaleLinear().domain(yearExtent).range([-1, 1]);
	const scaleY = scaleSymlog().domain(popExtent).range([-2, 2]);

	console.log(scaleY(2887398));

	let element: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let renderer: THREE.Renderer;
	let cube: THREE.Mesh;

	let pointLight: THREE.PointLight;

	let INTERSECTED: any;

	const raycaster = new THREE.Raycaster();
	raycaster.params = {
		Line: { threshold: 0.01 }
	};
	const pointer = new THREE.Vector2();

	let t = 0;
	const PLANE_SIZE = 8.0;

	let uniforms = {
		u_time: { value: 0.0 },
		u_meshPosition: new THREE.Uniform(new THREE.Vector3()),
		u_meshPosition2: new THREE.Uniform(new THREE.Vector3()),
		u_meshPosition3: new THREE.Uniform(new THREE.Vector3()),
		u_size: { value: PLANE_SIZE }
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
		// camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 100);

		camera.position.z = 20;
		camera.zoom = 0.5;
		// camera.rotateZ(Math.PI * 2);

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
		// scene.add(gridHelper);

		// addStars(scene);
		draggable = new THREE.Group();

		clock = new THREE.Clock();

		Object.values(data.data.groupedByCountry)
			.sort((a, b) => a[0].population - b[0].population)
			.forEach((countryData, i) => {
				const material = new THREE.LineBasicMaterial({ color: 0xffffff });
				const points = countryData.map(
					(d) => new THREE.Vector3(scaleX(d.year), scaleY(d.population), i * -0.01)
				);
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				const line = new THREE.Line(geometry, material);
				scene.add(line);

				// Create a curve path from the points
				const curvePath = new THREE.CurvePath();
				for (let j = 0; j < countryData.length - 1; j++) {
					const start = new THREE.Vector3(
						scaleX(countryData[j].year),
						scaleY(countryData[j].population),
						i * -0.01
					);
					const end = new THREE.Vector3(
						scaleX(countryData[j + 1].year),
						scaleY(countryData[j + 1].population),
						i * -0.01
					);

					const lineCurve = new THREE.LineCurve3(start, end);
					curvePath.add(lineCurve);
				}

				// Create a TubeGeometry based on the curve path
				const segments = 8; // Number of segments along the tube
				const radius = 0.01; // Radius of the tube
				const radialSegments = 8; // Number of segments around the tube
				const closed = false; // Whether the tube should be closed or not

				// const tubeGeometry = new THREE.TubeGeometry(
				// 	curvePath,
				// 	segments,
				// 	radius,
				// 	radialSegments,
				// 	closed
				// );

				// Create material and mesh
				// const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
				// const mesh = new THREE.Mesh(tubeGeometry, material);

				const tubeGeometry2 = new THREE.TubeGeometry(
					curvePath,
					segments,
					radius,
					radialSegments,
					closed
				);

				// Create material and mesh
				const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0 });
				const mesh2 = new THREE.Mesh(tubeGeometry2, material2);

				// Add tube to the scene
				// scene.add(mesh);
				scene.add(mesh2);
			});

		dragControls = new DragControls(draggable.children, camera, renderer.domElement);

		// dragControls.addEventListener('drag', function (event) {
		// 	event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
		// });

		document.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize() {
		// (camera.left = window.innerWidth / -2),
		// 	(camera.right = window.innerWidth / 2),
		// 	(camera.top = window.innerHeight / 2),
		// 	(camera.bottom = window.innerHeight / -2),
		aspectRatio = window.innerWidth / window.innerHeight;

		camera.left = -aspectRatio;
		camera.right = aspectRatio;
		camera.top = 1;
		camera.bottom = -1;
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
		// uniforms.u_meshPosition.value = dot.position.clone();
		// uniforms.u_meshPosition2.value = dot2.position.clone();
		// uniforms.u_meshPosition3.value = dot3.position.clone();

		camera.updateMatrixWorld();
		raycaster.setFromCamera(pointer, camera);

		const intersects = raycaster.intersectObjects(scene.children);

		// TODO: mix()? GLSL

		// for (let i = 0; i < intersects.length; i++) {
		// 	intersects[i].object.material.color.set(0xff0000);
		// }
		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				if (INTERSECTED) {
					INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
				}

				INTERSECTED = intersects[0].object;
				INTERSECTED.currentOpacity = INTERSECTED.material.opacity
				INTERSECTED.material.opacity = 0.8;
			}
		} else {
			if (INTERSECTED) {
				INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
			}

			INTERSECTED = null;
		}

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
	<!-- <pre>
{JSON.stringify(data.data, null, 4)}
	</pre> -->
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
