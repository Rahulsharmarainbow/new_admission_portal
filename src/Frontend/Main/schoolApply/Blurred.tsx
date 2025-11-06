import * as tf from '@tensorflow/tfjs';

export async function isImageBlurred(imageSrc, width, height) {
  const img = new Image();

   if (!width || !height) {
    console.warn('Width or height not provided. Skipping blur check.');
    return false;
  }
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        // Resize image to target resolution
        let tensor = tf.browser.fromPixels(img).toFloat();
        tensor = tf.image.resizeBilinear(tensor, [height, width]); // Note: height first

        const gray = tf.image.rgbToGrayscale(tensor);

        // Laplacian kernel (8-neighbor)
        const kernel = tf.tensor2d([
          1, 1, 1,
          1, -8, 1,
          1, 1, 1
        ], [3, 3], 'float32');

        const edges = tf.conv2d(
          gray.expandDims(0),
          kernel.expandDims(2).expandDims(3),
          [1, 1], 'same'
        ).squeeze();

        // Variance computation
        const mean = tf.mean(edges);
        const variance = tf.mean(tf.square(tf.sub(edges, mean))).dataSync()[0];

        // Select threshold based on resolution
        let blurThreshold = 3000; // Default for 180x180

        if (width === 150 && height === 40) {
          blurThreshold = 30000;
        }

        const isBlurred = variance < blurThreshold;
        console.log(`Resolution: ${width}x${height} | Variance: ${variance.toFixed(2)} | Threshold: ${blurThreshold} | Blurred: ${isBlurred}`);

        resolve(isBlurred);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = reject;
  });
}