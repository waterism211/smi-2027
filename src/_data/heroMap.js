// Builds the home page artwork: an original, schematic axial "slice" drawn as voxels
// with a statistical map on top. It is decorative and not based on real imaging data.
const WIDTH = 48;
const HEIGHT = 56;

const FILLS = {
  tissue1: "#242424",
  tissue2: "#333333",
  tissue3: "#464646",
  stat1: "#8f1023",
  stat2: "#e21833",
  stat3: "#f36f21",
  stat4: "#ffd200",
};

const noise = (x, y) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const blobs = [
  [-0.42, -0.34, 0.26],
  [0.46, -0.28, 0.22],
  [-0.2, 0.46, 0.2],
  [0.3, 0.52, 0.17],
  [0.04, 0.02, 0.14],
];

function binFor(x, y) {
  const nx = (x - WIDTH / 2 + 0.5) / (WIDTH / 2);
  const ny = (y - HEIGHT / 2 + 0.5) / (HEIGHT / 2);
  const radius = Math.hypot(nx / 0.92, ny / 0.98) + (noise(x, y) - 0.5) * 0.05;
  if (radius >= 1) return null;

  const inFissure = Math.abs(nx) < 0.035 && (ny < -0.3 || ny > 0.72);
  const inVentricle =
    Math.hypot((Math.abs(nx) - 0.14) / 0.08, (ny + 0.02) / 0.24) < 1;
  if (inFissure || inVentricle) return null;

  const stat =
    blobs.reduce(
      (sum, [cx, cy, size]) =>
        sum + Math.exp(-(((nx - cx) ** 2 + (ny - cy) ** 2) / (2 * size ** 2))),
      0,
    ) +
    (noise(y, x) - 0.5) * 0.28;

  if (stat > 0.9) return "stat4";
  if (stat > 0.72) return "stat3";
  if (stat > 0.54) return "stat2";
  if (stat > 0.4) return "stat1";

  const shade = (radius > 0.82 ? 0.65 : 0.25) + noise(x + 3, y + 7) * 0.45;
  if (shade > 0.8) return "tissue3";
  return shade > 0.45 ? "tissue2" : "tissue1";
}

export default function () {
  const paths = Object.fromEntries(Object.keys(FILLS).map((key) => [key, ""]));
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const bin = binFor(x, y);
      if (bin) paths[bin] += `M${x} ${y}h.9v.9h-.9z`;
    }
  }
  return {
    width: WIDTH,
    height: HEIGHT,
    layers: Object.entries(FILLS).map(([key, fill]) => ({ fill, path: paths[key] })),
  };
}
