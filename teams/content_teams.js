const onInit = () => {
  document.querySelectorAll(".bg-white").forEach(a => a.style.setProperty("background-color", "#121212", "important"))
}

setTimeout(onInit, 1500)