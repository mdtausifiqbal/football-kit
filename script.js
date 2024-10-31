var colors = {
    primary: "#ff0000",
    secondary: "#7F7F7F",
    tertiary: "#000000",
};

var scale = 0.5;

var svgContainer = document.getElementById("svg-container");
var primaryColorInput = document.getElementById("primaryColor");
var secondaryColorInput = document.getElementById("secondaryColor");
var tertiaryColorInput = document.getElementById("tertiaryColor");
var dressPattern = document.getElementById("dressPattern");

document.addEventListener("DOMContentLoaded", function () {
    ["primary", "secondary", "tertiary"].forEach((color) => {
        document.querySelectorAll(`input[name=${color}]`).forEach((input) => {
            input.value = colors[color];
            input.addEventListener("input", changeColor);
        });
    });

    dressPattern.addEventListener("change", async () => {
        const pattern = dressPattern.value;
        await loadSVG(`./svgs/${pattern}.svg`, svgContainer);
        updateSVGColor();
    });

    (async () => {
        await loadSVG("./svgs/plain.svg", svgContainer);
        updateSVGColor();
    })();
});

function updateSVGColor() {
    const svgElement = svgContainer.querySelector("svg");
    const updateColor = (color) => {
        svgElement.querySelectorAll("." + color).forEach((element) => {
            element.style.fill = colors[color];
        });
    };
    updateColor("primary");
    updateColor("secondary");
    updateColor("tertiary");
    drawSVGOnCanvas();
}

function changeColor(e) {
    colors[e.target.name] = e.target.value;

    document
        .querySelectorAll(`input[name=${e.target.name}]`)
        .forEach((input) => {
            input.value = e.target.value;
        });

    updateSVGColor();
}

// Function to load and display the SVG
async function loadSVG(url, parentNode) {
    const response = await fetch(url);
    const svgContent = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

    const svgElement = svgDoc.documentElement;
    svgElement.style.display = "block";

    parentNode.innerHTML = "";
    parentNode.appendChild(svgElement);
}

// Function to draw the SVG on the canvas
function drawSVGOnCanvas() {
    const svgElement = svgContainer.querySelector("svg");
    const canvas = document.getElementById("canvas");

    if (!svgElement || !canvas) return;

    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
        const width = img.width * scale;
        const height = img.height * scale;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height); // Clear the canvas before drawing
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
    };

    img.src = url;
}
