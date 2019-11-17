let D = {};
D.cvgrid = document.querySelector("#canvas1");
D.ccgrid = D.cvgrid.getContext("2d");
D.cvbuf = document.createElement("canvas");
D.ccbuf = D.cvbuf.getContext("2d");
D.preview = document.querySelector("#preview");
D.previewdl = document.querySelector("#previewdl");

D.gridxcells = document.querySelector("[name=gridxcells]");
D.gridycells = document.querySelector("[name=gridycells]");
D.cellw = document.querySelector("[name=cellw]");
D.imgcellw = document.querySelector("[name=imgcellw]");
D.palette = document.querySelector(".palette");
D.reset = document.querySelector("#reset");

let C = {};
let transparentbg = document.querySelector("#transparentbg");
C.transparentPattern = D.ccgrid.createPattern(transparentbg, "repeat");

let G = {};

function initPalettePanel() {
    let divs = document.querySelectorAll(".palette [color]");
    for (let i=0; i < divs.length; i++) {
        let div = divs[i];
        let clr = div.getAttribute("color");
        div.style.backgroundColor = clr;
    }

    let divStartColor = document.querySelector(".palette [startcolor]");
    let startColor = divStartColor.getAttribute("color");
    setBrush(startColor);
}

function setBrush(fg) {
    G.fg = fg;

    let divfg = document.querySelector(".brush .fg");
    divfg.style.backgroundColor = fg;
    divfg.style.backgroundImage = "";
    divfg.style.backgroundRepeat = "";

    if (fg == C.transparentPattern) {
        divfg.style.backgroundImage = "url(transparentbg.png)";
        divfg.style.backgroundRepeat = "repeat";
    }
}

function Reset(gridxcells, gridycells, cellw, imgcellw) {
    G.gridxcells = gridxcells;
    G.gridycells = gridycells;
    G.cellw = cellw;
    G.imgcellw = imgcellw;

    // Set grid canvas dimensions
    D.cvgrid.width = gridxcells * cellw;
    D.cvgrid.height = gridycells * cellw;

    // Set image dimensions
    D.preview.width = gridxcells * imgcellw;
    D.preview.height = gridycells * imgcellw;

    // Set offscreen canvas dimensions
    D.cvbuf.width = D.preview.width;
    D.cvbuf.height = D.preview.height;

    // Clear grid and offscreen canvas
    D.ccgrid.fillStyle = C.transparentPattern;
    D.ccgrid.fillRect(0,0, D.cvgrid.width,D.cvgrid.height);
    D.ccbuf.clearRect(0,0, D.cvbuf.width,D.cvbuf.height);

    // Draw grid lines
    D.ccgrid.fillStyle = "#fff";
    for (let y=cellw; y < D.cvgrid.height; y+=cellw) {
        D.ccgrid.fillRect(0,y, D.cvgrid.width,1);
    }

    for (let x=cellw; x < D.cvgrid.width; x+=cellw) {
        D.ccgrid.fillRect(x,0, 1,D.cvgrid.height);
    }

    D.preview.src = D.cvbuf.toDataURL();
    D.previewdl.setAttribute("href", D.cvbuf.toDataURL());
}

D.cvgrid.addEventListener("mousedown", function(e) {
    let cellx = Math.trunc(e.offsetX / G.cellw);
    let celly = Math.trunc(e.offsetY / G.cellw);

    D.ccgrid.fillStyle = G.fg;
    // If grid square too small, just fill over the gridlines.
    // Else if we have room, preserve the gridlines.
    if (G.cellw < 8) {
        D.ccgrid.fillRect(cellx*G.cellw, celly*G.cellw, G.cellw,G.cellw);
    } else {
        D.ccgrid.fillRect(cellx*G.cellw+1, celly*G.cellw+1, G.cellw-1,G.cellw-1);
    }

    D.ccbuf.fillStyle = G.fg;
    D.ccbuf.fillRect(cellx*G.imgcellw, celly*G.imgcellw, G.imgcellw, G.imgcellw);

    // Make transparent color see through
    if (D.ccbuf.fillStyle == C.transparentPattern) {
        D.ccbuf.clearRect(cellx*G.imgcellw,celly*G.imgcellw, G.imgcellw,G.imgcellw);
    }

    D.preview.src = D.cvbuf.toDataURL();
    D.previewdl.setAttribute("href", D.cvbuf.toDataURL());
});

D.palette.addEventListener("mousedown", function(e) {
    let seldiv = e.target;
    if (seldiv.getAttribute("color") == "") return;

    let clr = seldiv.getAttribute("color");
    if (seldiv.getAttribute("title") == "transparent") {
        clr = C.transparentPattern;
    }
    setBrush(clr);
});

initPalettePanel();

Reset(parseInt(D.gridxcells.value), parseInt(D.gridycells.value), parseInt(D.cellw.value), parseInt(D.imgcellw.value));

D.reset.addEventListener("click", function(e) {
    e.preventDefault();

    Reset(parseInt(D.gridxcells.value), parseInt(D.gridycells.value), parseInt(D.cellw.value), parseInt(D.imgcellw.value));
});
