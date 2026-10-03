(() => {
  "use strict";

  document.body.classList.add("app-mode");

  const viewLabels = {
    cores: "헨치 찾기",
    zones: "사냥터",
    mix: "믹스트리",
    saved: "즐겨찾기",
    contact: "문의하기",
    updates: "업데이트 내역"
  };

  const visibleView = () => {
    const el = document.querySelector(".view.active");
    return el ? el.id.replace("view-", "") : "cores";
  };

  const syncAppNavigation = () => {
    const id = visibleView();
    document.querySelectorAll(".app-nav-item").forEach(button => {
      const active = button.dataset.appView === id;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    const title = document.getElementById("appViewTitle");
    if (title) title.textContent = viewLabels[id] || "헨치 탐색기";
  };

  const openView = id => {
    const desktopTab = document.querySelector(`.tab[data-view="${id}"]`);
    if (desktopTab) desktopTab.click();
    syncAppNavigation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.querySelectorAll(".app-nav-item").forEach(button => {
    button.addEventListener("click", () => openView(button.dataset.appView));
  });

  const infoButton = document.getElementById("appInfoButton");
  if (infoButton) infoButton.addEventListener("click", () => openView("updates"));

  const controls = document.querySelector("#view-cores .controls");
  if (controls) {
    const filterButton = document.createElement("button");
    filterButton.type = "button";
    filterButton.className = "app-filter-toggle";
    filterButton.setAttribute("aria-label", "상세 필터 열기");
    filterButton.setAttribute("aria-expanded", "false");
    filterButton.textContent = "☷";
    controls.appendChild(filterButton);
    filterButton.addEventListener("click", () => {
      const open = controls.classList.toggle("filters-open");
      filterButton.classList.toggle("active", open);
      filterButton.setAttribute("aria-expanded", String(open));
      filterButton.setAttribute("aria-label", open ? "상세 필터 닫기" : "상세 필터 열기");
    });
  }

  const countSource = document.getElementById("savedTabCount");
  const countTarget = document.getElementById("appSavedCount");
  const syncSavedCount = () => {
    if (!countSource || !countTarget) return;
    const count = Number.parseInt(countSource.textContent || "0", 10) || 0;
    countTarget.textContent = String(count);
    countTarget.style.display = count > 0 ? "grid" : "none";
  };
  if (countSource) new MutationObserver(syncSavedCount).observe(countSource, { childList: true, characterData: true, subtree: true });

  document.querySelectorAll(".view").forEach(view => {
    new MutationObserver(syncAppNavigation).observe(view, { attributes: true, attributeFilter: ["class"] });
  });

  syncSavedCount();
  syncAppNavigation();
})();
