export const vertexShaderSrc = `      
	attribute vec2 a_position;
	uniform mat4 u_model_matrix;
	uniform vec2 u_resolution;

	void main () {             
		vec2 position = vec2(u_model_matrix * vec4(a_position, 0, 1));

		// converts positions from pixel space to 0.0 -> 1.0 space
		vec2 zeroToOne = position / u_resolution;

		//converts 0.0 -> 1.0 space to 0.0 -> 2.0 then -1.0 -> 1.0
		vec2 zeroToTwo = zeroToOne * 2.0;
		vec2 clipSpace = zeroToTwo - 1.0;

		gl_Position =  vec4(clipSpace * vec2(1, -1), 0, 1);
	}
`;