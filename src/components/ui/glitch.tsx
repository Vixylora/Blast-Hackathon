import type React from "react"
import { forwardRef } from "react"
import { Shader } from "react-shaders"
import { cn } from "@/lib/utils"

export interface GlitchShadersProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Glitch animation speed
   * @default 1.0
   */
  speed?: number

  /**
   * Overall corruption intensity
   * @default 1.0
   */
  intensity?: number

  /**
   * Data moshing displacement strength
   * @default 1.0
   */
  distortion?: number

  /**
   * Color corruption cycling speed
   * @default 1.0
   */
  colorShift?: number

  /**
   * Scan line density multiplier
   * @default 1.0
   */
  scanlines?: number
}

const fragmentShader = `
// Hash function for pseudo-random values
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Noise function
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Block-based glitch effect
float blockNoise(vec2 p, float blockSize) {
    vec2 blockPos = floor(p / blockSize) * blockSize;
    return hash(blockPos);
}

// RGB Channel separation for chromatic aberration
vec3 chromaticAberration(vec2 uv, float time, float intensity) {
    float aberration = intensity * 0.01;

    // Different offsets for each color channel
    vec2 redOffset = vec2(aberration * sin(time * 3.0), 0.0);
    vec2 greenOffset = vec2(0.0, aberration * cos(time * 2.0));
    vec2 blueOffset = vec2(-aberration * sin(time * 1.5), aberration * cos(time * 4.0));

    // Sample base colors (procedural pattern)
    float redBase = noise(uv * 5.0 + redOffset);
    float greenBase = noise(uv * 5.0 + greenOffset + 100.0);
    float blueBase = noise(uv * 5.0 + blueOffset + 200.0);

    return vec3(redBase, greenBase, blueBase);
}

// Digital corruption effect
float digitalCorruption(vec2 uv, float time) {
    // Create vertical stripes of corruption
    float stripeNoise = hash(vec2(floor(uv.x * 50.0), floor(time * 10.0)));
    float corruption = step(0.95, stripeNoise);

    // Add horizontal scan line corruption
    float scanCorruption = hash(vec2(floor(time * 20.0), floor(uv.y * 100.0)));
    corruption += step(0.98, scanCorruption) * 0.5;

    return corruption;
}

// Data moshing displacement
vec2 dataMosh(vec2 uv, float time, float intensity) {
    vec2 moshUV = uv;

    // Create displacement blocks
    float blockSize = 0.1;
    vec2 blockIndex = floor(uv / blockSize);
    float blockHash = hash(blockIndex + floor(time * 2.0));

    if (blockHash > 0.9) {
        // Random displacement
        float displaceX = (hash(blockIndex + 123.0) - 0.5) * intensity * 0.1;
        float displaceY = (hash(blockIndex + 456.0) - 0.5) * intensity * 0.1;
        moshUV += vec2(displaceX, displaceY);
    }

    return moshUV;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    float time = iTime * u_speed;

    // Apply data moshing displacement
    vec2 moshUV = dataMosh(uv, time, u_distortion);

    // Base chromatic aberration effect
    vec3 color = chromaticAberration(moshUV, time, u_intensity);

    // Add digital noise patterns
    float digitalNoise = noise(moshUV * 20.0 + time);
    float blockGlitch = blockNoise(moshUV, 0.05 + sin(time) * 0.02);

    // Glitch color mixing
    color = mix(color, vec3(blockGlitch), 0.3);
    color += digitalNoise * 0.2;

    // Scan line effect
    float scanLine = sin(moshUV.y * iResolution.y * 0.5 * u_scanlines + time * 10.0);
    scanLine = smoothstep(0.0, 1.0, scanLine * 0.5 + 0.5);
    color *= (0.8 + scanLine * 0.4);

    // Add horizontal glitch lines
    float glitchLine = step(0.99, hash(vec2(floor(time * 30.0), floor(moshUV.y * 50.0))));
    if (glitchLine > 0.0) {
        // Horizontal displacement for glitch lines
        float displacement = (hash(vec2(floor(time * 30.0), 0.0)) - 0.5) * 0.1;
        vec2 glitchUV = vec2(moshUV.x + displacement, moshUV.y);
        vec3 glitchColor = chromaticAberration(glitchUV, time, u_intensity * 2.0);
        color = mix(color, glitchColor, 0.8);
    }

    // Color shifting and corruption
    float colorCorruption = digitalCorruption(moshUV, time);
    if (colorCorruption > 0.0) {
        // Shift hue and invert colors
        color.rgb = color.gbr; // Channel shift
        color = 1.0 - color; // Invert
        color *= vec3(1.0, 0.2, 0.8); // Cyberpunk pink/cyan tint
    }

    // Apply overall color shifting
    float hueShift = sin(time * u_colorShift) * 0.1;
    color.r += hueShift;
    color.g += hueShift * 0.5;
    color.b -= hueShift * 0.3;

    // Add static noise
    float staticNoise = hash(moshUV * 100.0 + time * 50.0);
    color += (staticNoise - 0.5) * 0.1 * u_intensity;

    // Pixelation effect
    float pixelSize = 1.0 + floor(noise(vec2(time * 5.0)) * 3.0);
    vec2 pixelUV = floor(moshUV * iResolution.xy / pixelSize) * pixelSize / iResolution.xy;
    float pixelMix = step(0.95, noise(vec2(time * 3.0)));
    color = mix(color, chromaticAberration(pixelUV, time, u_intensity), pixelMix * 0.3);

    // Digital artifacts
    float artifact = step(0.98, hash(moshUV * 200.0 + time * 100.0));
    color += artifact * vec3(0.5, 1.0, 0.5) * u_intensity;

    // Vignette with digital edge
    float vignette = 1.0 - length(uv - 0.5) * 1.2;
    vignette = mix(vignette, 1.0, 0.3); // Subtle vignette
    color *= vignette;

    // Clamp and output
    color = clamp(color, 0.0, 1.0);

    fragColor = vec4(color, 1.0);
}
`

export const GlitchShaders = forwardRef<HTMLDivElement, GlitchShadersProps>(
  (
    {
      className,
      speed = 1.0,
      intensity = 1.0,
      distortion = 1.0,
      colorShift = 1.0,
      scanlines = 1.0,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("w-full h-full", className)} ref={ref} {...(props as any)}>
        <Shader
          fs={fragmentShader}
          style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
          uniforms={{
            u_speed: { type: "1f", value: speed },
            u_intensity: { type: "1f", value: intensity },
            u_distortion: { type: "1f", value: distortion },
            u_colorShift: { type: "1f", value: colorShift },
            u_scanlines: { type: "1f", value: scanlines },
          }}
        />
      </div>
    )
  },
)

GlitchShaders.displayName = "GlitchShaders"

export default GlitchShaders
