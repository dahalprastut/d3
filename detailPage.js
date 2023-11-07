let title = document.URL.split("/")[3].split(".")[0].toLowerCase();

if (title == "ELSALVADOR") {
	title = "El Salvador";
}

fetch("./data/data.json")
	.then((res) => res.json())
	.then((json) => {
		data = json.find((el) => el.name.split(" ").join("").toLowerCase() === title);
		const name = document.querySelector(".detail-info .name");
		const text = document.querySelector(".detail-info .text");
		const chip = document.querySelector(".chip");
		const verticalTimeline = document.querySelector(".section .center");
		const tabs = document.querySelector(".tabs");
		const contentDescription = document.querySelector(".content-description p");
		const contentHeading = document.querySelector(".content-description h2");
		const hoveredStateName = document.querySelector(".hovered-state h3");
		const hoveredStateChip = document.querySelector(".hovered-state .chip");
		const hoveredSitesOfMemory = document.querySelector(".hovered-state ol .outer-li");
		const hoveredHorizontalTimeline = document.querySelector(".hovered-state .horizontal-timeline");
		const parallaxOne = document.querySelector(".parallax-one");
		const parallaxTwo = document.querySelector(".parallax-two");
		name.innerText = data?.name;
		text.innerText = data?.title;
		contentDescription.innerText = data?.organizations[0].description;
		contentHeading.innerText = data?.organizations[0].name;
		hoveredStateName.innerText = data?.name;

		parallaxOne.style.background = `url(${data?.parallaxOne}) fixed`;
		parallaxTwo.style.background = `url(${data?.parallaxTwo}) fixed`;

		data.categories.map((el) => {
			const text = `<span> ${el} </span>`;
			chip.insertAdjacentHTML("beforeend", text);
			hoveredStateChip.insertAdjacentHTML("beforeend", text);
		});
		for (j = 0; j < data.keyEvents.length; j = j + 2) {
			const text = `<div class="vertical-timeline"><div><h3 class="date">${
				data.keyEvents[j].date
			}</h3><div class="line"><div class="arrow top"></div></div><p>${
				data.keyEvents[j].descriptionOne
			}</p></div></div><div class="vertical-timeline"><div><p>${
				data.keyEvents[j + 1].descriptionOne
			}</p><div class="line"><div class="arrow top"></div></div><h3 class="date">${
				data.keyEvents[j + 1].date
			}</h3></div></div>`;
			verticalTimeline.insertAdjacentHTML("beforeend", text);
		}
		data.organizations.map((el) => {
			const text = `<button>${el.slug}</button>`;
			tabs.insertAdjacentHTML("beforeend", text);
		});
		const buttons = document.querySelectorAll(".tabs button");
		const buttonsArr = Array.from(buttons);
		buttonsArr[0].classList.add("active");

		buttonsArr.forEach((el) => {
			el.addEventListener("click", (e) => {
				buttonsArr.forEach((button) => {
					button.classList.remove("active");
				});

				// Add "active" class to the clicked button
				el.classList.add("active");

				const name = e.target.innerText;
				const text = data.organizations.find((element) => element.slug === name).description;
				const heading = data.organizations.find((element) => element.slug === name).name;
				contentDescription.textContent = text;
				contentHeading.textContent = heading;
			});
		});

		data.sitesOfMemory.map((el) => {
			const text = `<li>${el.name}</li>`;
			hoveredSitesOfMemory.insertAdjacentHTML("beforeend", text);
		});
		data.memoryInitiativeSlug.map((el) => {
			const timeline = `<div class="time"><strong>${el.date}</strong><div class="line"><div class="arrow first left"></div><div class="arrow left"></div></div></div>`;
			hoveredHorizontalTimeline.insertAdjacentHTML("beforeend", timeline);
		});
	});
