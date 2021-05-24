var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext('2d');

canvas.width = 2000;
canvas.height = 2000;

var stars = [], // Array that contains the stars
	FPS = 15, // Frames per second
	LEN = 100 // Number of stars

// Push stars to array
for(var i = 0; i < LEN; i++) {
	stars.push({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		radius: Math.random() * 1 + 1,
		vx: Math.floor(Math.random() * 50) - 25,
		vy: Math.floor(Math.random() * 50) - 25
	});
}

// Draw the scene
function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.globalCompositeOperation = "lighter";
	ctx.globalAlpha = 1;
	
	for(var i = 0; i < LEN; i++) {
		var s = stars[i];
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	//ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'white';
	for(var i = 0; i < LEN; i++) {
		var s1 = stars[i];
		for(var j = i; j < LEN; j++) {
			var s2 = stars[j];
			var dist = distance(s1, s2);
			if(dist < 300) {
				ctx.beginPath();
				ctx.moveTo(s1.x,s1.y); 
				ctx.lineTo(s2.x,s2.y);
				ctx.globalAlpha = 1 - (dist / 300.0);
				ctx.stroke();
			}
		}
	}

	//ctx.lineWidth = 1;
	//ctx.strokeStyle = 'white';
	//ctx.stroke();
}

function distance( point1, point2 ){
	var xx = point2.x - point1.x;
	var yy = point2.y - point1.y;
	return Math.sqrt( xx*xx + yy*yy );
}

// Update star locations
function update() {
	for(var i = 0; i < LEN; i++) {
		var s = stars[i];
		s.x += s.vx / (FPS * 4);
		s.y += s.vy / (FPS * 4);

		if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
		if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
	}
}

// Update and draw
function tick() {
	draw();
	update();
	requestAnimationFrame(tick);
}

tick();
