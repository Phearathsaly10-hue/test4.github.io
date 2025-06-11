// const imgContElm = document.querySelector(".img-container");
// const imgElm = document.querySelector(".img-container img");
// const listProductsElm = document.querySelector(".list-products");


// let zoomScale = 1;


// imgContElm.addEventListener('mouseenter', () => {
//     imgElm.style.transform = `scale(${zoomScale})`;
// });
// imgContElm.addEventListener('mouseleave', () => {
//     imgElm.style.transform = 'scale(1)';
// });


// imgContElm.addEventListener('mousemove', function(mouseEvent) {
//     let rect = imgContElm.getBoundingClientRect();
//     let xpos = mouseEvent.pageX || mouseEvent.clientX + window.scrollX;
//     let ypos = mouseEvent.pageY || mouseEvent.clientY + window.scrollY;

    
//     xpos -= rect.left + window.scrollX;
//     ypos -= rect.top + window.scrollY;

//     const imgWidth = imgElm.offsetWidth;
//     const imgHeight = imgElm.offsetHeight;

    
//     const left = -((imgWidth - rect.width) * xpos / rect.width);
//     const top = -((imgHeight - rect.height) * ypos / rect.height);

//     imgElm.style.transformOrigin = `${xpos / rect.width * 100}% ${ypos / rect.height * 100}%`;
//     imgElm.style.transform = `scale(${zoomScale})`;
//     imgElm.style.position = 'absolute';
//     imgElm.style.left = left + 'px';
//     imgElm.style.top = top + 'px';
// });


// Array.from(listProductsElm.children).forEach((productElm) => {
//     productElm.addEventListener('click', () => {
//         const newSrc = productElm.querySelector('img').src;
//         imgElm.src = newSrc;

//         Array.from(listProductsElm.children).forEach(prod => prod.classList.remove('active'));
//         productElm.classList.add('active');
//     });
// });


// function changeHeight() {
//     imgContElm.style.height = imgContElm.clientWidth + 'px';
// }
// changeHeight();
// window.addEventListener('resize', changeHeight);


// imgContElm.addEventListener('wheel', (e) => {
//     e.preventDefault();

//     const delta = Math.sign(e.deltaY);
   
//     zoomScale = Math.min(Math.max(0.5, zoomScale - delta * 0.1), 3); // limit zoom between 0.5x and 3x

//     imgElm.style.transform = `scale(${zoomScale})`;
//     imgElm.style.transformOrigin = 'center center';
// });


// let initialDistance = null;

// function getDistance(touches) {
//     const [touch1, touch2] = touches;
//     return Math.hypot(
//         touch2.pageX - touch1.pageX,
//         touch2.pageY - touch1.pageY
//     );
// }

// imgContElm.addEventListener('touchstart', (e) => {
//     if (e.touches.length === 2) {
//         initialDistance = getDistance(e.touches);
//     }
// });
// imgContElm.addEventListener('touchmove', (e) => {
//     if (e.touches.length === 2 && initialDistance) {
//         const currentDistance = getDistance(e.touches);
//         const scaleChange = currentDistance / initialDistance;
//         zoomScale = Math.min(Math.max(0.5, scaleChange), 3);
        
//         imgElm.style.transform = `scale(${zoomScale})`;
//         imgElm.style.transformOrigin = 'center center';
//         e.preventDefault(); 
//     }
// });
// imgContElm.addEventListener('touchend', () => {
//     initialDistance = null;
// });

const imgContElm = document.querySelector(".img-container");
const imgElm = imgContElm.querySelector("img");
const listProductsElm = document.querySelector(".list-products");

let zoomScale = 1;
let isDragging = false;
let startX = 0, startY = 0;
let imgPosX = 0, imgPosY = 0;

function updateImageTransform() {
    imgElm.style.transform = `scale(${zoomScale}) translate(${imgPosX}px, ${imgPosY}px)`;
    imgElm.style.transformOrigin = 'center center';
}

// Mouse wheel zoom (desktop)
imgContElm.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = Math.sign(e.deltaY);
        zoomScale = Math.min(Math.max(0.5, zoomScale - delta * 0.1), 3);
        updateImageTransform();
    }
}, { passive: false });

// Drag with mouse
imgContElm.addEventListener('mousedown', (e) => {
    if (zoomScale <= 1) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    imgContElm.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    imgPosX += dx;
    imgPosY += dy;
    updateImageTransform();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    imgContElm.style.cursor = 'default';
});

// Touch pinch zoom + drag
let initialDistance = null;
let lastTouchPos = null;

function getDistance(touches) {
    const [t1, t2] = touches;
    return Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
}

imgContElm.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
    } else if (e.touches.length === 1 && zoomScale > 1) {
        lastTouchPos = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
}, { passive: true });

imgContElm.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialDistance) {
        const currentDistance = getDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;
        zoomScale = Math.min(Math.max(0.5, scaleChange), 3);
        updateImageTransform();
        e.preventDefault();
    } else if (e.touches.length === 1 && lastTouchPos && zoomScale > 1) {
        const touch = e.touches[0];
        const dx = touch.pageX - lastTouchPos.x;
        const dy = touch.pageY - lastTouchPos.y;
        lastTouchPos = { x: touch.pageX, y: touch.pageY };
        imgPosX += dx;
        imgPosY += dy;
        updateImageTransform();
        e.preventDefault();
    }
}, { passive: false });

imgContElm.addEventListener('touchend', () => {
    initialDistance = null;
    lastTouchPos = null;
});
