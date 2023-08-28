export default /* glsl */`
varying vec2 vUv;
uniform vec2 u_resolution;
uniform vec3 u_meshPosition;
uniform float u_time;
uniform float u_size;

float sdfCircle(vec2 p, float r){
	return length(p) - r;
}

void main() {

	// vec2 uv = gl_FragCoord.xy;
	vec2 uv = vUv - vec2(0.5);

	// uv -= 0.5;
	// uv *= 10.0;
	
	vec3 black = vec3(0.0);
	vec3 white = vec3(1.0);
	vec3 blue = vec3(0.5, 0.5, 1.0);
	vec3 red = vec3(1.0, 0.0, 0.0);

	vec3 color = red;

	// float radius = 1.0;
	// vec2 center = vec2(0.0);
	// center = vec2(sin(2.0 * u_time), 0.0);
	// center = position.xy * 4.;
	// float distanceToCircle = sdfCircle(uv - center, radius);

	float distance = length(uv - (u_meshPosition.xy / u_size) );


	// color = vec3(uv.x, uv.y, 0.0);
	color = distance > 0.05 ? white : red;
	// color = color * exp(distanceToCircle);
	color = color * vec3(1.0, vec2(1.0 - exp(-10.0 * abs(distance))));

	gl_FragColor = vec4( color, 1.0 );
}


`;