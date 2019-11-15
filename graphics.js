function putPixel(c, x,y) {
    c.fillRect(x,y, 1,1);
}

function putImgPixel(img, x,y, r,g,b) {
    let offs = (y*img.width*4) + (x*4);
    img.data[offs+0] = r;
    img.data[offs+1] = g;
    img.data[offs+2] = b;
    img.data[offs+3] = 255;
}

function getCanvasImage(c) {
    return c.getImageData(0,0, c.canvas.width,c.canvas.height);
}


