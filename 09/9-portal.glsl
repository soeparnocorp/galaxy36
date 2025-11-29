// 9-portal.glsl — Black Hole Accretion fragment shader (prototype)
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform sampler2D u_tex;

vec2 warp(vec2 uv, float t){
  vec2 c = uv - 0.5;
  float r = length(c);
  float a = atan(c.y, c.x);
  float ripple = sin(12.0 * r - t*1.6) * 0.004;
  float twist = 0.22 * smoothstep(0.0,0.7,1.0 - r);
  float rr = r + ripple;
  float aa = a + twist;
  return 0.5 + vec2(rr * cos(aa), rr * sin(aa));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 w = warp(uv, u_time);
  vec3 col = texture2D(u_tex, w).rgb;
  // photon ring chromatic
  float r = length(uv-0.5);
  float vign = smoothstep(0.95, 0.4, r);
  vec3 gold = vec3(0.79, 0.66, 0.32);
  col = mix(col, gold * 0.8, pow(1.0 - smoothstep(0.35,0.5,r), 1.5)*0.12);
  gl_FragColor = vec4(col * vign, 1.0);
}
