/* OFFSCRIPT interactions: mobile navigation, wishlist, quick add, filters and newsletter demo. */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  let bagCount = 0;
  const bagCountEl = document.getElementById("bag-count");
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      bagCount += 1;
      if (bagCountEl) bagCountEl.textContent = String(bagCount);
      const bag = document.querySelector(".bag-button");
      if (bag) bag.setAttribute("aria-label", `Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`);
      showToast("Added to your bag — demo only.");
    });
  });

  document.querySelectorAll(".heart").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const saved = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(saved));
      button.textContent = saved ? "♥" : "♡";
      showToast(saved ? "Saved to your wishlist — demo only." : "Removed from your wishlist.");
    });
  });

  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", event => {
      event.preventDefault();
      const email = document.getElementById("email");
      const message = document.getElementById("form-message");
      if (email && email.checkValidity() && message) {
        message.textContent = "Thanks for joining the list! This is a front-end demo.";
        newsletterForm.reset();
      }
    });
  }

  const searchButton = document.querySelector(".search-toggle");
  if (searchButton) searchButton.addEventListener("click", () => showToast("Search is a visual demo in this version."));

  // Collection filtering/sorting.
  const productContainer = document.getElementById("collection-products");
  if (productContainer) {
    const cards = Array.from(productContainer.querySelectorAll(".product-card"));
    const filterPanel = document.getElementById("filter-panel");
    const filterToggle = document.getElementById("filter-toggle");
    const resultCount = document.getElementById("result-count");
    const emptyState = document.getElementById("empty-state");
    const sortSelect = document.getElementById("sort-select");
    const loadMore = document.getElementById("load-more");

    if (filterToggle && filterPanel) {
      filterToggle.addEventListener("click", () => {
        const isOpen = filterPanel.classList.toggle("open");
        filterToggle.setAttribute("aria-expanded", String(isOpen));
        filterToggle.textContent = isOpen ? "− Filters" : "＋ Filters";
      });
    }

    function applyFilters() {
      const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(input => input.value);
      const checkedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(input => input.value);
      const priceChoice = document.querySelector('input[name="price"]:checked')?.value || "all";
      let visible = 0;
      cards.forEach(card => {
        const categoryMatch = checkedCategories.length === 0 || checkedCategories.includes(card.dataset.category);
        const availableSizes = card.dataset.size.split(" ");
        const sizeMatch = checkedSizes.length === 0 || checkedSizes.some(size => availableSizes.includes(size));
        const price = Number(card.dataset.price);
        const priceMatch = priceChoice === "all" || (priceChoice === "under2000" && price < 2000) || (priceChoice === "over2000" && price >= 2000);
        const show = categoryMatch && sizeMatch && priceMatch;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? "piece" : "pieces"}`;
      if (emptyState) emptyState.hidden = visible !== 0;
      if (loadMore) loadMore.hidden = visible <= 6;
    }

    document.querySelectorAll('#filter-panel input').forEach(input => input.addEventListener("change", applyFilters));
    const clearFilters = document.getElementById("clear-filters");
    if (clearFilters) clearFilters.addEventListener("click", () => {
      document.querySelectorAll('#filter-panel input[name="category"], #filter-panel input[name="size"]').forEach(input => input.checked = false);
      const allPrice = document.querySelector('#filter-panel input[name="price"][value="all"]');
      if (allPrice) allPrice.checked = true;
      applyFilters();
    });

    if (sortSelect) sortSelect.addEventListener("change", () => {
      const mode = sortSelect.value;
      const sorted = [...cards].sort((a, b) => {
        if (mode === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
        if (mode === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
        if (mode === "name") return a.dataset.name.localeCompare(b.dataset.name);
        return cards.indexOf(a) - cards.indexOf(b);
      });
      sorted.forEach(card => productContainer.appendChild(card));
      applyFilters();
    });

    if (loadMore) {
      loadMore.addEventListener("click", () => {
        showToast("You are viewing all available demo pieces.");
        loadMore.textContent = "You're all caught up ✓";
        loadMore.disabled = true;
      });
    }

    // Read an optional category query from category tiles on the homepage.
    const queryCategory = new URLSearchParams(window.location.search).get("category");
    const matchingCategory = document.querySelector(`#filter-panel input[name="category"][value="${queryCategory}"]`);
    if (matchingCategory) {
      matchingCategory.checked = true;
      applyFilters();
    }
  }
});
