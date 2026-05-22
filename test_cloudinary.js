import fs from 'fs';
import path from 'path';

async function testUpload() {
  const cloudName = 'dibofn6p1';
  const uploadPreset = 'cazdeco';
  
  const form = new FormData();
  
  // Create a minimal 1x1 png image
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const binaryString = atob(base64Image);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'image/png' });
  
  form.append('file', blob, 'test.png');
  form.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form
    });
    
    console.log(response.status, response.statusText);
    const json = await response.text();
    console.log(json);
  } catch (e) {
    console.error(e);
  }
}

testUpload();
