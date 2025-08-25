async function loadData() {
  const response = await fetch("/data");
  const weeks = await response.json();
  renderWeeks(weeks);
}

function renderWeeks(weeks) {
  const container = document.getElementById("content");
  container.innerHTML = "";

  weeks.forEach((week, wIndex) => {
    const section = document.createElement("section");
    section.id = `week${wIndex + 1}`;
    section.innerHTML = `<h2>${week.title}</h2>`;

    const cardsDiv = document.createElement("div");
    cardsDiv.className = "cards";

    week.days.forEach((day, dIndex) => {
      const card = document.createElement("div");
      card.className = "card " + (day.completed ? "completed" : "");
      card.innerHTML = `
        <label>
          <input type="checkbox" ${day.completed ? "checked" : ""} 
            onchange="toggleTask(${wIndex}, ${dIndex}, this.checked)">
          <strong>${day.name}</strong>
        </label>
        <p>${day.topic}</p>
        <a href="${day.link}" target="_blank">Resource</a>
      `;
      cardsDiv.appendChild(card);
    });

    section.appendChild(cardsDiv);
    container.appendChild(section);
  });
}

function scrollToWeek(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

async function toggleTask(wIndex, dIndex, state) {
  const response = await fetch("/data");
  const weeks = await response.json();
  weeks[wIndex].days[dIndex].completed = state;

  await fetch("/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(weeks, null, 2),
  });

  renderWeeks(weeks);
}

loadData();
