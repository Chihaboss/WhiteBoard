const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    undo = document.querySelector("#undo"),
    saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");
    body = document.querySelector("body");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

let restoreArry = [];

let index = -1;

var mouseX = 0;
var mouseY = 0;
var startingX = 0;

var recentWords = [];
var undoList = [];
let color = "#202835";




document.querySelector(".theme_btn").addEventListener("click", () => {
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        color = "#fff";
     }else{
         color = "#202835";
     }
    setCanvasBackground();
})








const setCanvasBackground = () => {
  
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

// window.addEventListener("load", () => {
//     // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
//     setCanvasBackground();
// });
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
setCanvasBackground();

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here



    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

undo.addEventListener("click", () => {
    if (index <= 0) {
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        restoreArry = [];
        index = -1
    } else {
        index--
        restoreArry.pop();
        ctx.putImageData(restoreArry[index], 0, 0)
        console.log(index);
    }
})








function saveState() {
    undoList.push(canvas.toDataURL());
}

saveState();

function undoText() {
    undoList.pop();

    var imgData = undoList[undoList.length - 1];
    var image = new Image()

    image.src = imgData;
    image.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    }
}



canvas.addEventListener("click", function (e) {
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
    startingX = mouseX;

    recentWords = [];

    return false;
}, false);




document.addEventListener("keydown", function (e) {
    ctx.font = "16px Arial";

    if (e.keyCode === 8) {

        undoText();

        var recentWord = recentWords[recentWords.length - 1];

        mouseX -= ctx.measureText(recentWord).width;
        recentWords.pop();

        
    } else if (e.keyCode === 13) {
        mouseX = startingX;
        mouseY += 20;
    } else {
        ctx.fillText(e.key, mouseX, mouseY);
        mouseX += ctx.measureText(e.key).width;
        saveState();
        recentWords.push(e.key)
    }

}, false)

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    if (isDrawing === false) {
        restoreArry.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        index++;
        console.log(restoreArry);
    }
});





// const canvas = document.querySelector("canvas");
// ctx = canvas.getctx("2d");

// let isDrawing = false;

// window.addEventListener("load", () => {
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
//     // console.log(canvas.offsetHeight)
//     // console.log(canvas.offsetWidth)
// })

// const startDraw = () => {
//     isDrawing = true;
//     ctx.beginPath();
// }


// const drawing = (e) => {
//     if(!isDrawing) return;
//     ctx.lineTo(e.offsetX, e.offsetY);
//     ctx.stroke()
//     console.log(e.offsetX, e.offsetY);
//     console.log(e.moveTo);
// }



// canvas.addEventListener("mousemove", drawing);
// canvas.addEventListener("mousedown", startDraw);
// canvas.addEventListener("mouseup", () => isDrawing = false);
// canvas.addEventListener("click",(e) => {
//     console.log(e.offsetX,)
//     console.log(e.offsetY)
//     console.log(e)
// })