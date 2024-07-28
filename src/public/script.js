let imageOriginalWidth = 0;
let imageOriginalHeight = 0;
let imageAspectRatio = 0.00;
let allColorCodes = '';

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  const imageInput = document.getElementById('imageInput');
  formData.append('image', imageInput.files[0]);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (response.ok) {
    const uploadedImage = document.getElementById('uploadedImage');
    const imageControls = document.getElementById('image-controls');
        
    uploadedImage.src = data.imagePath;
    uploadedImage.style.display = 'block';
    imageControls.style.display = 'block';
    
  } else {
    console.error('Upload failed:', data);
  }
});

document.getElementById('imageInput').addEventListener('change', (event) => {
  document.getElementById('upload-button').disabled=false;
});

document.getElementById('uploadedImage').addEventListener('load', (event) => {
  imageOriginalWidth = uploadedImage.width;
  imageOriginalHeight = uploadedImage.height;
  imageAspectRatio = (imageOriginalWidth / imageOriginalHeight).toFixed(2);
});

document.getElementById('uploadedImage').addEventListener('mousemove', (event) => {
  document.getElementById('mt').innerHTML = `
    ${event.offsetX} , ${event.offsetY}
  `;
  displayColorInfo(event.target);
});

document.getElementById('zoom-in').addEventListener('click', (event) => {
  const displayedImage = document.getElementById('uploadedImage');
  const width = displayedImage.width + 50;
  //const height = displayedImage.height;
  const height = (width / imageAspectRatio).toFixed(2);
  displayedImage.style.width = (width) + "px";
  //displayedImage.style.height = (height + (50 * imageAspectRatio).toFixed(2)) + "px";
  displayedImage.style.height = (height) + "px";
});

document.getElementById('zoom-out').addEventListener('click', (event) => {
  const displayedImage = document.getElementById('uploadedImage');
  const width = displayedImage.width;
  const height = displayedImage.height;
  displayedImage.style.width = (width - 50) + "px";
  displayedImage.style.height = (height - 50) + "px";
});

document.getElementById('zoom-reset').addEventListener('click', (event) => {
  const displayedImage = document.getElementById('uploadedImage');
  displayedImage.style.width = imageOriginalWidth + "px";
  displayedImage.style.height = imageOriginalHeight + "px";
});

document.getElementById('uploadedImage').addEventListener('click', (event) => {
  const img = event.target;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const { offsetX: x, offsetY: y } = event;
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
  const hsl = rgbToHsl(pixel[0], pixel[1], pixel[2]);

  //copy color codes to clipboard
  allColorCodes = `${rgb} | ${hex} | ${hsl}`;
  navigator.clipboard.writeText(`${allColorCodes}`);
  
  document.getElementById('colorInfo').innerHTML = `
    <div id="color-box">  
      <div id="color-swatch" style="background-color:${rgb};"></div>
      <div>
        <p>RGB:  ${rgb}</p>
        <p>HEX: ${hex}</p>
        <p>HSL: ${hsl}</p>
        <p>CLP: ${allColorCodes}</p>
      </div>
    </div>
  `;
});

function displayColorInfo(evt) {
  const img = evt;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const { offsetX: x, offsetY: y } = event;
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
  const hsl = rgbToHsl(pixel[0], pixel[1], pixel[2]);

  document.getElementById('colorInfo').innerHTML = `
    <div id="color-box">  
      <div id="color-swatch" style="background-color:${rgb};"></div>
      <div>
        <p>RGB: ${rgb}</p>
        <p>HEX: ${hex}</p>
        <p>HSL: ${hsl}</p>
        <p>CLP: ${allColorCodes}</p>
      </div>
    </div>
  `;
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${(h * 360).toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%)`;
}
