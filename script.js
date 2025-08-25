// تحميل البيانات من ملف data.json (كـ static) + دمجها مع localStorage
async function loadData() {
  const response = await fetch("data.json"); // ملفك الأصلي ثابت
  const weeks = await response.json();

  // لو فيه بيانات محفوظة في localStorage ندمجها
  const saved = JSON.parse(localStorage.getItem("weeksProgress")) || [];
  if (saved.length) {
    weeks.forEach((week, wIndex) => {
      week.days.forEach((day, dIndex) => {
        if (saved[wIndex]?.days[dIndex]?.completed) {
          day.completed = true;
        }
      });
    });
  }

  renderWeeks(weeks);
  setupScrollButtons();
}

// عرض الأسابيع والكاردز
function renderWeeks(weeks) {
  const container = document.getElementById("content");
  container.innerHTML = "";

  weeks.forEach((week, wIndex) => {
    const section = document.createElement("section");
    section.id = `week${wIndex + 1}`;
    section.className = "py-8";

    section.innerHTML = `<h2 class="text-xl font-bold mb-4">${week.title}</h2>`;

    const cardsDiv = document.createElement("div");
    cardsDiv.className = "grid gap-4 md:grid-cols-2 lg:grid-cols-3";

    week.days.forEach((day, dIndex) => {
      const card = document.createElement("div");
      card.className = `p-4 border rounded-lg shadow ${day.completed ? "bg-green-100" : "bg-white"}`;

      card.innerHTML = `
        <label class="flex items-center gap-2">
          <input type="checkbox" ${day.completed ? "checked" : ""} 
            onchange="toggleTask(${wIndex}, ${dIndex}, this.checked)">
          <span>${day.name}</span>
        </label>
        <p class="text-gray-600 text-sm">${day.topic}</p>
        <a class="text-blue-500 underline text-sm" href="${day.link}" target="_blank">Resource</a>
      `;
      cardsDiv.appendChild(card);
    });

    section.appendChild(cardsDiv);
    container.appendChild(section);
  });

  // حفظ نسخة محدثة
  localStorage.setItem("weeksProgress", JSON.stringify(weeks));
}

// تحديث حالة التشييك
function toggleTask(wIndex, dIndex, state) {
  const saved = JSON.parse(localStorage.getItem("weeksProgress"));
  if (saved && saved[wIndex] && saved[wIndex].days[dIndex]) {
    saved[wIndex].days[dIndex].completed = state;
    localStorage.setItem("weeksProgress", JSON.stringify(saved));
  }
  loadData(); // إعادة الرندر
}

// زرار التنقل مع أوفست الهيدر
function setupScrollButtons() {
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-scroll");
      const el = document.getElementById(id);
      if (!el) return;

      const header = document.querySelector("header");
      const headerOffset = header.offsetHeight; // ديناميكي حسب حجم الهيدر
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    };
  });
}

loadData();
