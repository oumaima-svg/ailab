document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // Dynamic Footer Year (all pages)
  // -------------------------------
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------
  // Projects Page: Fetch Papers
  // -------------------------------
  const resultsDiv = document.getElementById("results");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  async function searchPapers() {
    if (!resultsDiv) return;

    const query = searchInput ? searchInput.value || "AI" : "AI";
    resultsDiv.innerHTML = "Loading...";

    try {
      const res = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=6`);
      const data = await res.json();
      resultsDiv.innerHTML = "";

      data.message.items.forEach(paper => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <div class="card-content">
            <h3>${paper.title[0]}</h3>
            <p>Year: ${paper.created["date-parts"][0][0]}</p>
            <p>Author: ${paper.author ? paper.author.map(a=>a.family).join(", ") : "N/A"}</p>
            <a href="${paper.URL}" target="_blank">View Paper</a>
          </div>
        `;
        resultsDiv.appendChild(div);
      });

    } catch (error) {
      resultsDiv.innerHTML = "Error loading papers.";
      console.error(error);
    }
  }

  // Attach search button listener if exists
  if (searchBtn) {
    searchBtn.addEventListener("click", searchPapers);
  }

  // -------------------------------
  // Contact Page: LocalStorage + Animation
  // -------------------------------
  const contactForm = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");

  if (contactForm && successMsg) {
    // Load saved data
    const savedData = JSON.parse(localStorage.getItem("contactFormData"));
    if (savedData) {
      contactForm.name.value = savedData.name || "";
      contactForm.email.value = savedData.email || "";
      contactForm.message.value = savedData.message || "";
      contactForm.newsletter.checked = savedData.newsletter || false;
    }

    // Form submit
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const contactData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value,
        newsletter: contactForm.newsletter.checked
      };

      localStorage.setItem("contactFormData", JSON.stringify(contactData));

      successMsg.classList.add("show");
      contactForm.reset();

      setTimeout(() => successMsg.classList.remove("show"), 3000);
    });
  }

});
