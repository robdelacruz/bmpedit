let cv = document.querySelector("#canvas1");
let c = cv.getContext("2d");
let preview = document.querySelector("#preview");
let previewdl = document.querySelector("#previewdl");
let cvbuf = document.createElement("canvas");
let cbuf = cvbuf.getContext("2d");

let dotted = document.querySelector("#dotted");
let transparentPattern = c.createPattern(dotted, "repeat");

let gridxcells = document.querySelector("[name=gridxcells]");
let gridycells = document.querySelector("[name=gridycells]");
let cellw = document.querySelector("[name=cellw]");
let imgcellw = document.querySelector("[name=imgcellw]");
let palette = document.querySelector(".palette");

let G = {};
setBrush("#FFF1E8");

function initPalettePanel() {
    let divs = document.querySelectorAll(".palette [color]");
    for (let i=0; i < divs.length; i++) {
        let div = divs[i];
        let clr = div.getAttribute("color");
        div.style.backgroundColor = clr;
    }

}

function setBrush(fg) {
    G.fg = fg;

    let divfg = document.querySelector(".brush .fg");
    divfg.style.backgroundColor = fg;
    if (fg == transparentPattern) {
        divfg.style.backgroundImage = "url(dotted.png)";
        divfg.style.backgroundRepeat = "repeat";
    }
}

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
    c.fillStyle = transparentPattern;
    c.fillRect(0,0, cv.width,cv.height);
    cbuf.clearRect(0,0, cvbuf.width,cvbuf.height);

    // Draw grid lines
    c.fillStyle = "#fff";
    for (let y=cellw; y < cv.height; y+=cellw) {
        c.fillRect(0,y, cv.width,1);
    }

    for (let x=cellw; x < cv.width; x+=cellw) {
        c.fillRect(x,0, 1,cv.height);
    }

    preview.src = cvbuf.toDataURL();
    previewdl.setAttribute("href", cvbuf.toDataURL());
}

cv.addEventListener("mousedown", function(e) {
    let cellx = Math.trunc(e.offsetX / G.cellw);
    let celly = Math.trunc(e.offsetY / G.cellw);

    c.fillStyle = G.fg;
    c.fillRect(cellx*G.cellw, celly*G.cellw, G.cellw,G.cellw);

    cbuf.fillStyle = G.fg;
    cbuf.fillRect(cellx*G.imgcellw, celly*G.imgcellw, G.imgcellw, G.imgcellw);

    // Make transparent color see through
    if (cbuf.fillStyle == transparentPattern) {
        cbuf.clearRect(cellx*G.imgcellw,celly*G.imgcellw, G.imgcellw,G.imgcellw);
    }

    preview.src = cvbuf.toDataURL();
    previewdl.setAttribute("href", cvbuf.toDataURL());
});

palette.addEventListener("mousedown", function(e) {
    let seldiv = e.target;
    if (seldiv.getAttribute("color") == "") return;

    let clr = seldiv.getAttribute("color");
    if (seldiv.getAttribute("name") == "transparent") {
        clr = transparentPattern;
    }
    setBrush(clr);
});

initPalettePanel();

Reset(parseInt(gridxcells.value), parseInt(gridycells.value), parseInt(cellw.value), parseInt(imgcellw.value));

document.querySelector("#reset").addEventListener("click", function(e) {
    e.preventDefault();

    Reset(parseInt(gridxcells.value), parseInt(gridycells.value), parseInt(cellw.value), parseInt(imgcellw.value));
});
