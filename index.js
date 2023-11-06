// d3.select("div").style("color", "red").attr("class", "fromjs");

// d3.selectAll();

// d3.select("h1").style("color", "blue");

// const dataset = [200, 240, 300, 321, 222, 130];

// const svgWidth = 500,
// 	svgHeight = 500,
// 	barPadding = 5;
// const barWidth = svgWidth / dataset.length;

// const svg = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight);

// const barChart = svg
// 	.selectAll("rect")
// 	.data(dataset)
// 	.enter()
// 	.append("rect")
// 	.attr("y", (d) => svgHeight - d)
// 	.attr("height", (d) => d)
// 	.attr("width", barWidth - barPadding)
// 	.attr("transform", (d, i) => {
// 		let translate = [barWidth * i, 0];
// 		return `translate(${translate})`;
// 	});

// const labels = svg
// 	.selectAll("text")
// 	.data(dataset)
// 	.enter()
// 	.append("text")
// 	.text((d) => d)
// 	.attr("y", (d) => svgHeight - d)
// 	.attr("fill", "purple")
// 	.attr("x", (d, i) => barWidth * i);

// const datavalues = [100, 201, 293, 281, 128];

// const svgHeight = 400;
// const svgWidth = 400;
// const barPadding = 5;
// const barWidth = svgWidth / datavalues.length;

// const svg = d3.select("svg").attr("height", svgHeight).attr("width", svgWidth);
// const barChart = svg
// 	.selectAll("rect")
// 	.data(datavalues)
// 	.enter()
// 	.append("rect")
// 	.attr("y", (d) => svgHeight - d)
// 	.attr("height", (d) => d)
// 	.attr("width", (d) => barWidth - barPadding)
// 	.attr("transform", (d, i) => {
// 		let translate = [barWidth * i, 0];
// 		return `translate(${translate})`;
// 	});

// ====================================================================

const memorInitiative = [];

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
	height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var svg = d3.select("body").append("svg");

svg.attr("viewBox", "50 10 " + width + " " + height).attr("preserveAspectRatio", "xMinYMin");

var zoom = d3.zoom().on("zoom", function () {
	var transform = d3.zoomTransform(this);
	map.attr("transform", transform);
});

// svg.call(zoom);

var map = svg.append("g").attr("class", "map");

d3.queue()
	.defer(d3.json, "data/combined_america.json")
	.defer(d3.json, "data/data.json")
	.await(function (error, world, data) {
		if (error) {
			console.error("Oh dear, something went wrong: " + error);
		} else {
			drawMap(world, data);
		}
	});

function drawMap(world, data) {
	// geoMercator projection
	var projection = d3
		.geoMercator() //d3.geoOrthographic()
		.scale(400)
		.translate([width / 1.4, height / 3]);

	// geoPath projection
	var path = d3.geoPath().projection(projection);

	var features = topojson.feature(world, world.objects.countries).features;
	var populationById = {};
	const infoById = {};

	const countriesName = data.map((element) => {
		return element.name;
	});

	data.forEach((d) => {
		infoById[d.name] = {
			name: d?.name,
			title: d?.title || "",
			categories: d?.categories || [],
			actors: d?.actors || [],
			keyEvents: d?.keyEvents || [],
			memoryInitiative: d?.memoryInitiative || [],
			memoryInitiativeSlug: d?.memoryInitiativeSlug || [],
			sitesOfMemory: d?.sitesOfMemory || [],
			organizations: d?.organizations || [],
		};
	});
	features.forEach((d) => {
		d.details = infoById[d.properties.name] ? infoById[d.properties.name] : {};
	});
	map.append("g")
		.selectAll("path")
		.data(features)
		.enter()
		.append("path")
		.attr("name", function (d) {
			return d.properties.name;
		})
		.attr("id", function (d) {
			return d.id;
		})
		.attr("d", path)
		.style("fill", function (d) {
			const hasElem = countriesName.includes(d.properties.name);
			if (hasElem) {
				return "#D3D2CE";
			} else {
				return "rgba(211, 210, 206, 0.3)";
			}
		})
		.style("stroke", "#0A142D")
		.style("stroke-width", 0.6)
		.on("mouseover", function (d) {
			// memorInitiative.push()
			const hasElem = countriesName.includes(d.properties.name);
			if (hasElem) {
				d3.select(this)
					.style("stroke", "#0A142D")
					.style("stroke-width", 2)
					.style("cursor", "pointer")
					.style("fill", "#FF2444");
				// Create a shadow effect by duplicating the path

				d3.select(".hovered-state h3").text(d.properties.name);

				var chipDiv = d3.select(".chip");

				// Use D3's data binding to add spans
				var spans = chipDiv
					.selectAll("span")
					.data(d.details.categories)
					.enter()
					.append("span")
					.text(function (d) {
						return d;
					});

				var outerLi = d3.select(".outer-li");
				var li = outerLi
					.selectAll("li")
					.data(d.details.sitesOfMemory)
					.enter()
					.append("li")
					.text((d) => {
						return d.name;
					});

				var horizontalTime = document.querySelector(".horizontal-timeline");

				// hoveredHorizontalTimeline = d3.select(".horizontal-timeline");
				d.details.memoryInitiativeSlug.map((el) => {
					const timeline = `<div class="time"><strong>${el.date}</strong><div class="line"><div class="arrow first left"></div><div class="arrow left"></div></div></div>`;
					horizontalTime.insertAdjacentHTML("beforeend", timeline);
				});

				// d.details.memoryInitiativeSlug.forEach(function (dates) {
				// 	var timeElement = timeline.append("div").attr("class", "time");

				// 	timeElement.append("strong").text(dates.year);

				// 	var lineElement = timeElement.append("div").attr("class", "line");

				// 	dates.arrows.forEach(function (arrowClass) {
				// 		lineElement.append("div").attr("class", "arrow " + arrowClass);
				// 	});
				// });
				d3.select(".hovered-state").style("visibility", "visible");
			}
		})
		.on("mouseleave", function (d) {
			d3.select(this).style("stroke", "#0A142D").style("stroke-width", 0.6);
			const hasElem = countriesName.includes(d.properties.name);
			if (hasElem) {
				d3.select(this).style("fill", "#D3D2CE");
			}

			d3.select(".chip").html("");
			d3.select(".outer-li").html("");

			d3.select(".hovered-state").style("visibility", "hidden");
			var horizontalTime = document.querySelector(".horizontal-timeline");
			horizontalTime.innerHTML = "";
		})
		.on("click", function (d) {
			console.log("d");
			var name = `${d.details.name.toLowerCase()}.html`; // The HTML page you want to load
			// Construct the URL hash by prepending '#' to the 'name'
			var fullURL = window.location.origin + "/" + name;

			// Change the window location to load the specified HTML page
			window.location.href = fullURL;

			// Prevent the default behavior of an anchor element
			d3.event.preventDefault();
		});
}
// ==========================================================

// const width = 975;
// const height = 610;

// const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

// const svg = d3
// 	.create("svg")
// 	.attr("viewBox", [0, 0, width, height])
// 	.attr("width", width)
// 	.attr("height", height)
// 	.attr("style", "max-width: 100%; height: auto;")
// 	.on("click", reset);

// const path = d3.geoPath();

// const g = svg.append("g");
// function zoomed(event) {
// 	const { transform } = event;
// 	g.attr("transform", transform);
// 	g.attr("stroke-width", 1 / transform.k);
// }
// function reset() {
// 	states.transition().style("fill", null);
// 	svg.transition()
// 		.duration(750)
// 		.call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
// }

// d3.json("/data/america.json", function (error, us) {
// 	if (error) {
// 		console.error("Error loading data:", error);
// 		return;
// 	}
// 	const states = g
// 		.append("g")
// 		.attr("fill", "#444")
// 		.attr("cursor", "pointer")
// 		.selectAll("path")
// 		.data(topojson.feature(us, us.objects.countries).features)
// 		.enter()
// 		.append("path")
// 		.on("click", clicked)
// 		.attr("d", path);
// 	states.append("title").text((d) => d.properties.name);

// 	g.append("path")
// 		.attr("fill", "none")
// 		.attr("stroke", "white")
// 		.attr("stroke-linejoin", "round")
// 		.attr("d", path(topojson.mesh(us, us.objects.countries, (a, b) => a !== b)));

// 	svg.call(zoom);

// 	function clicked(event, d) {
// 		const [[x0, y0], [x1, y1]] = path.bounds(d);
// 		event.stopPropagation();
// 		states.transition().style("fill", null);
// 		d3.select(this).transition().style("fill", "red");
// 		svg.transition()
// 			.duration(750)
// 			.call(
// 				zoom.transform,
// 				d3.zoomIdentity
// 					.translate(width / 2, height / 2)
// 					.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
// 					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
// 				d3.pointer(event, svg.node())
// 			);
// 	}
// });

// document.getElementById("map-container").appendChild(svg.node());

// return svg.node();
