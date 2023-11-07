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
	// inputs
	const hoveredInput = document.querySelector(".search .hovered-input");
	const input = document.querySelector(".search input");
	input.addEventListener("input", () => {
		hoveredInput.innerHTML = "";
		const names = data.filter((el) => el.name.toLowerCase().includes(input.value.toLowerCase()));
		if (names.length >= 1 && input.value.length > 0) {
			hoveredInput.style.display = "block";
			input.style.borderRadius = "20px 20px 0 0";
		} else {
			hoveredInput.style.display = "none";
			input.style.borderRadius = "20px";
		}

		names.map((el) => {
			text = `<li><a href="${el.name.toLowerCase()}.html">${el.name}</a></li>`;
			hoveredInput.insertAdjacentHTML("beforeend", text);
		});
	});

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
				if (d.details.sitesOfMemory.length > 0) {
					var li = outerLi
						.selectAll("li")
						.data(d.details.sitesOfMemory)
						.enter()
						.append("li")
						.text((d) => {
							return d.name;
						});
				} else {
					outerLi._groups[0][0].insertAdjacentHTML("beforeend", "No information provided");
				}

				var horizontalTime = document.querySelector(".horizontal-timeline");

				// hoveredHorizontalTimeline = d3.select(".horizontal-timeline");
				if (d.details.memoryInitiative.length > 0) {
					d.details.memoryInitiativeSlug.map((el) => {
						const timeline = `<div class="time"><strong>${el.date}</strong><div class="line"><div class="arrow first left"></div><div class="arrow left"></div></div></div>`;
						horizontalTime.insertAdjacentHTML("beforeend", timeline);
					});
				} else {
					horizontalTime.insertAdjacentHTML("beforeend", "No information provided");
				}

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
			var name = `${d.details.name.split(" ").join("").toLowerCase()}.html`; // The HTML page you want to load
			// Construct the URL hash by prepending '#' to the 'name'
			var fullURL = window.location.origin + "/" + name;

			// Change the window location to load the specified HTML page
			window.location.href = fullURL;

			// Prevent the default behavior of an anchor element
			d3.event.preventDefault();
		});
}
