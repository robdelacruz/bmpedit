let cv = document.querySelector("#canvas1");
let c = cv.getContext("2d");
let preview = document.querySelector("#preview");
let cvbuf = document.createElement("canvas");
let cbuf = cvbuf.getContext("2d");

let gridxcells = document.querySelector("[name=gridxcells]");
let gridycells = document.querySelector("[name=gridycells]");
let cellw = document.querySelector("[name=cellw]");
let imgcellw = document.querySelector("[name=imgcellw]");

let G = {};

function Reset(gridxcells, gridycells, cellw, imgcellw) {
    G.gridxcells = gridxcells;
    G.gridycells = gridycells;
    G.cellw = cellw;
    G.imgcellw = imgcellw;

    // Set grid canvas dimensions
    cv.width = gridxcells * cellw;
    cv.height = gridycells * cellw;

    // Set image dimensions
    preview.width = gridxcells * imgcellw;
    preview.height = gridycells * imgcellw;

    // Set offscreen canvas dimensions
    cvbuf.width = preview.width;
    cvbuf.height = preview.height;

    // Clear grid and offscreen canvas
    cbuf.clearRect(0,0, cvbuf.width,cvbuf.height);
    c.strokeStyle = "#fff";
    c.fillRect(0,0, cv.width,cv.height);

    // Draw grid lines
    c.strokeStyle = "#fff";
    c.fillStyle = "#fff";
    c.lineWidth = 1;
    c.beginPath();
    for (let y=cellw; y < cv.height; y+=cellw) {
        c.fillRect(0,y, cv.width,1);
    }

    for (let x=cellw; x < cv.width; x+=cellw) {
        c.fillRect(x,0, 1,cv.height);
    }
    c.stroke();

    preview.src = cvbuf.toDataURL();
}

cv.addEventListener("mousedown", function(e) {
    let cellx = Math.trunc(e.offsetX / G.cellw);
    let celly = Math.trunc(e.offsetY / G.cellw);

    c.fillStyle = "#ff0";
    c.fillRect(cellx*G.cellw, celly*G.cellw, G.cellw,G.cellw);

    cbuf.fillStyle = "#ff0";
    cbuf.fillRect(cellx*G.imgcellw, celly*G.imgcellw, G.imgcellw, G.imgcellw);
    preview.src = cvbuf.toDataURL();
});

Reset(parseInt(gridxcells.value), parseInt(gridycells.value), parseInt(cellw.value), parseInt(imgcellw.value));

document.querySelector("#reset").addEventListener("click", function(e) {
    e.preventDefault();

    Reset(parseInt(gridxcells.value), parseInt(gridycells.value), parseInt(cellw.value), parseInt(imgcellw.value));
});