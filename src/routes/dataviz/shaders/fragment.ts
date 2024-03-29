export default /* glsl */`
varying vec2 vUv;
uniform vec2 u_resolution;
uniform vec3 u_meshPosition;
uniform vec3 u_meshPosition2;
uniform vec3 u_meshPosition3;
uniform float u_time;
uniform float u_size;

float sdfCircle(vec2 p, float r){
	return length(p) - r;
}

void main() {
	vec2 uv = vUv;
	uv = uv - vec2(0.5);

	vec3 c = vec3(0.0, 1.0, 1.0);
	vec3 m = vec3(1.0, 0.0, 1.0);
	vec3 y = vec3(1.0, 1.0, 0.0);
	vec3 r = vec3(1.0, 0.0, 0.5);
	vec3 g = vec3(0.5, 1.0, 0.0);
	vec3 b = vec3(0.0, 0.5, 1.0);

	vec4 color = vec4(0.0);

	float distance1 = distance(uv, u_meshPosition.xy / u_size  );
	float distance2 = distance(uv, u_meshPosition2.xy / u_size );
	float distance3 = distance(uv, u_meshPosition3.xy / u_size );

	float distancePoints = distance(uv, (u_meshPosition.xy + u_meshPosition2.xy + u_meshPosition3.xy) );

	float step1 = smoothstep(.3, .0, distance1 );
	vec4 circleColor1 = vec4( step1 * c, step1);
	float step2 = smoothstep(.3, .0, distance2 );
	vec4 circleColor2 = vec4( step2 * m, step2);
	float step3 = smoothstep(.3, .0, distance3 );
	vec4 circleColor3 = vec4( step3 * y, step3);

	// color = color + mix(color, circleColor1, 0.5);
	// color = color +  mix(color, circleColor2, 0.5);
	// color = color + mix(color, circleColor3, 0.5);
	color = circleColor1 + circleColor2 + circleColor3;

	gl_FragColor = color;
}
`;