const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const sharp = require('sharp'); // Image processing library
const { exec } = require('child_process');

const PREVIEW_WIDTH = 500;

// Loop through the command line arguments to find the '--imageDir' flag
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--imageDir') {
    // Set imageDir to the value following the '--imageDir' flag
    imageDir = args[i + 1];
    break;
  }
}

fs.readdir(imageDir, async (err, files) => {
  if (err) {
    console.log("Error getting directory information.")
  } else {
    // Map files to an array of promises which resolve to an object containing the image path and dimensions
    const imagePromises = files.map(file => {
      const imagePath = path.join(imageDir, file);

      // Detect the width and height of mp4 videos
      if (imagePath.endsWith('.mp4')) {
        const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${imagePath}"`;

        return new Promise((resolve, reject) => {
          exec(cmd, (err, stdout, stderr) => {
            if (err) {
              console.error(`ffprobe - Error reading dimensions of ${imagePath}: ${err}`);
              reject(err);
              return;
            }

            const [width, height] = stdout.trim().split(',');
            resolve({
              path: imagePath,
              width: parseInt(width),
              height: parseInt(height),
              previewWidth: PREVIEW_WIDTH,
              previewHeight: Math.round(PREVIEW_WIDTH * (parseInt(height) / parseInt(width)))
            });
          });
        });
      }

      return sharp(imagePath).metadata()
        .then(({ width, height }) => ({
          path: imagePath,
          width,
          height,
          previewWidth: PREVIEW_WIDTH,
          previewHeight: Math.round(PREVIEW_WIDTH * (height / width))
        }))
        .catch(err => {
          console.error(`sharp - Error reading dimensions of ${imagePath}: ${err}`);
          return null;
        });
    });

    // Wait for all promises to resolve
    const images = (await Promise.all(imagePromises)).filter(image => image != null);
    
    // Render EJS to a string
    ejs.renderFile('views/gallery.ejs', { images }, (err, str) => {
      if (err) {
        console.log("Error rendering template.");
        return;
      }
      
      // Write the result to an HTML file
      /*
      fs.writeFile('result.html', str, (err) => {
        if (err) {
          console.log("Error writing HTML file.");
          return;
        }
        console.log("HTML file created successfully.");
      });*/
      // Print the result to the console too.
      console.log(str);
    });
  }
});
