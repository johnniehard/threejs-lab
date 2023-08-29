export default /* glsl */`
varying vec2 vUv;
uniform vec2 u_resolution;
uniform vec3 u_meshPosition;
uniform vec3 u_meshPosition2;
uniform float u_time;
uniform float u_size;

float sdfCircle(vec2 p, float r){
	return length(p) - r;
}

void main() {

	// vec2 uv = gl_FragCoord.xy;
	vec2 uv = vUv;
	uv = uv - vec2(0.5);

	// uv -= 0.5;
	// uv *= 10.0;
	
	vec3 black = vec3(0.0);
	vec3 white = vec3(1.0);
	vec3 blue = vec3(0.5, 0.5, 1.0);
	vec3 red = vec3(1.0, 0.0, 0.0);
	vec3 c = vec3(0.0, 1.0, 1.0);
	vec3 m = vec3(1.0, 0.0, 1.0);

	vec3 color = red;

	// float radius = 1.0;
	// vec2 center = vec2(0.0);
	// center = vec2(sin(2.0 * u_time), 0.0);
	// center = position.xy * 4.;
	// float distanceToCircle = sdfCircle(uv - center, radius);

	float distance1 = distance(uv, (u_meshPosition.xy) / u_size  );
	float distance2 = distance(uv, u_meshPosition2.xy / u_size );

	// color = vec3(uv.x, uv.y, 0.0);
	// vec3 circleColor1 = distance1 > 0.05 ? white : c;
	vec3 circleColor1 = smoothstep(.5, .0, distance1) * c;
	// vec3 circleColor = (0.5 - distance) * c;
	color = circleColor1;

	// vec3 circleColor2 = distance2 > 0.05 ? white : m;
	// vec3 circleColor2 = step(distance2, 0.05) * m;
	vec3 circleColor2 = smoothstep(.5, .0, distance2) * m;


	// vec3 circleColor2 = (0.5 - distance) * m;

	// color = mix( color , circleColor2, 0.5) ;
	color = color + circleColor2;


	// color = vec3(uv.x / 2.0, 0.0, 0.0);

	gl_FragColor = vec4( color, 1.0 );
}


`;