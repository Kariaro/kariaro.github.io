let slideType = 'none';
let slideIndex = 0;
window.addEventListener('load', e => {
	// Show the slideshow
	let slideshow = document.getElementById('project-slideshow');
	slideshow.style.display = 'block';
	
	// Update simplified tags
	let projectTags = document.getElementsByClassName('project');
	for (let i = 0; i < projectTags.length; i++) {
		generateProject(projectTags[i]);
	}
	
	// Set the slide index
	updateStyle(slideType);
	showProjectSlide(slideIndex);
});

function updateStyle(type) {
	let index = document.getElementById('slideshow-index');
	let next = document.getElementById('slideshow-next');
	let prev = document.getElementById('slideshow-prev');
	
	if (type == 'slideshow') {
		if (index) index.style.display = 'block';
		if (next) next.style.display = 'block';
		if (prev) prev.style.display = 'block';
	} else {
		if (index) index.style.display = 'none';
		if (next) next.style.display = 'none';
		if (prev) prev.style.display = 'none';
	}
}

function getStars(elm, projectLink) {
	// This is rate limited
	// TODO: Implement cookies to only make this request once every hour
	
	/*
	let starElement = elm.getElementsByClassName('stars')[0];
	console.log(`https://api.github.com/repos/${projectLink.substring(19)}/stargazers`);
	let request = new Request(`https://api.github.com/repos/${projectLink.substring(19)}/stargazers`);
	fetch(request)
		.then((res) => res.text())
		.then((res) => JSON.parse(res))
		.then((json) => {
		console.log(starElement);
		console.log(json.data.length);
	});
	*/
}

function generateProject(elm) {
	let elmTitle = elm.getAttribute('title');
	let elmImage = elm.getAttribute('image');
	let elmLink = elm.getAttribute('link');
	let isGithub = elmLink.startsWith('https://github.com/');
	
	let newElement = document.createElement('div');
	newElement.id = elmTitle;
	newElement.classList.add('project');
	newElement.classList.add('fade');
	newElement.innerHTML = `
<div class="project-title">
	<div>
		<a href="${elmLink}" target="blank">
			<img class="pragma" src="/images/link-icon.svg"/>
			${elmTitle}
		</a>
		<!-- ${isGithub ? '<a class="stars"><img class="pragma" src="/images/star-icon.svg"/></a>' : ''} -->
	</div>
</div>
<img src="${elmImage}" alt="${elmTitle}"/>
<div class="project-description">
	<div>
		${elm.innerHTML.trim()}
	</div>
</div>`;
	elm.parentNode.replaceChild(newElement, elm);
	
	if (isGithub) {
		getStars(newElement, elmLink);
	}
}

function incrementSlides(count) {
	showProjectSlide(slideIndex + count);
}

// Display a specific project slide
function showProjectSlide(index) {
	// Values
	let projectSlides = document.getElementsByClassName('project');
	let indexElement = document.getElementById('slideshow-index');
	let totalSlides = projectSlides.length;

	// Normalize the index to be within [0, totalSlides)
	slideIndex = ((index % totalSlides) + totalSlides) % totalSlides;
	index = slideIndex;
	
	// Display the slideshow index
	if (indexElement) {
		indexElement.innerHTML = `${index + 1} / ${totalSlides}`;
	}
	
	// Hide all slides not indexed
	for (let i = 0; i < totalSlides; i++) {
		if (slideType == 'slideshow') {
			projectSlides[i].style.display = (i == index) ? 'block' : 'none';
		} else {
			projectSlides[i].style.display = 'block';
		}
	}
}
