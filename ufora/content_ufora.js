const IS_COURSE_PAGE = /^https:\/\/ufora\.ugent\.be\/d2l\/home\/.*$/.test(window.location.href)
let THIS_COURSE = ''

const onInit = () => {
  console.log("BetterUfora loaded")

  // Fix course names
  let sLinks = document.getElementsByClassName("d2l-navigation-s-link")
  for (let i = 0; i < sLinks.length; i++) {
    const a = sLinks[i]
    if (a.innerText.includes(" - ")) {
      a.innerText = a.innerText.split(' - ')[1]
      THIS_COURSE = a.innerText;
    }
  }

  // Resize navbar
  const mainHeader = document.querySelector("d2l-navigation-main-header")
  mainHeader.shadowRoot.querySelector(".d2l-navigation-header-container").style.height = '50px'
  mainHeader.style.borderBottom = "1px solid #2a2a2a";

  // Remove top screen border
  document.querySelector("d2l-navigation").shadowRoot.querySelector("d2l-navigation-band").remove()

  // Change logo
  logos = document.querySelectorAll("d2l-navigation-link-image[text=\"Mijn startpagina\"]")
  for (let i = 0; i < logos.length; i++) {
    const a = logos[i]
    const img = a.shadowRoot.querySelector("img")
    img.src = chrome.runtime.getURL('logo.svg')
    img.style.height = "30px"
    a.shadowRoot.querySelector(".d2l-navigation-highlight-border").remove()
  }

  // Left column
  document.querySelectorAll("d2l-expand-collapse-content").forEach(a => {
    // Remove courses and footer
    if (a.querySelector("d2l-my-courses") ||
      a.querySelector('[title="Ugent Footer"]') ||
      a.querySelector('[title="Visual Table of Contents"]')) {
      a.remove();
    }

    //Edit Posts
    const items = a.querySelectorAll("li")
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const b = items[i];
        b.style.borderTopColor = 'var(--color-background-light)';
        const textParts = b.querySelectorAll(":scope > .d2l-datalist-item-content > div")
        if (textParts.length > 1) {
          textParts[1].style.color = 'var(--color-text-medium)'
          textParts[2].style.color = 'var(--color-text-medium)'
        }
      }
      items[0].style.borderTopColor = 'transparent'
    }

  })

  // Remove corresponding headers
  document.querySelectorAll(".d2l-widget-header").forEach(e => {
    const textContent = e.querySelector("h2")?.innerText
    const toDelete = ['Mijn cursussen', 'Visual Table of Contents']
    if (toDelete.includes(textContent)) {
      e.remove();
    }
  })

  //Remove ufora link and announcements link and groups link
  const topUrls = document.querySelectorAll('.d2l-navigation-s-main-wrapper > div');
  topUrls[0].remove();
  topUrls[2].remove();
  topUrls[3].remove();


  // Right column
  const rightEntries = document.querySelectorAll(".homepage-col-4 > .d2l-widget")

  // Year
  rightEntries[0].remove();

  // Updates
  const updatesFrame = rightEntries[2].querySelector("iframe").contentDocument
  updatesFrame.querySelectorAll(".dco_c").forEach(a => a.style.backgroundColor = "#121212")
  updatesFrame.querySelectorAll("a").forEach(a => a.style.color = "rgba(255, 255, 255, 0.87)")

  // Bookmarks
  rightEntries[3].remove();

  // Dropdowns
  document.querySelectorAll("d2l-dropdown-menu").forEach(a => {
    const wrapper = a.shadowRoot.querySelector("#d2l-dropdown-wrapper");
    wrapper.style.backgroundColor = "#181818"
    wrapper.style.border = "none"
    wrapper.style.borderRadius = "0"

    const links = a.querySelectorAll("d2l-menu-item-link")
    links.forEach(b => {
      const childA = b.shadowRoot.querySelector("a")
      childA.style.padding = '0.3em'
      childA.style.borderTop = '1px solid #2a2a2a'
    })

    const items = a.querySelectorAll("d2l-menu-item");
    items.forEach(b => {
      b.style.padding = '0.3em'
      b.style.backgroundColor = "#181818"
      b.style.color = "rgba(255, 255, 255, 0.87)"
      b.style.setProperty('border-top', '1px solid #2a2a2a', 'important')
      b.style.borderBottom = '1px solid #2a2a2a'
    })

    const first = a.querySelector("d2l-menu-item-link, d2l-menu-item")
    if (first.tagName === "D2L-MENU-ITEM-LINK") {
      first.shadowRoot.querySelector("a").style.borderTop = 'none'
    } else {
      first.style.setProperty('border-top', 'none', 'important')
    }

    const diamond = a.shadowRoot.querySelector(".d2l-dropdown-content-pointer > div")
    diamond.style.backgroundColor = '#181818'
    diamond.style.border = 'none'
  })

  // Notifications
  document.querySelectorAll("d2l-dropdown-content").forEach(a => {
    const wrapper = a.shadowRoot.querySelector("#d2l-dropdown-wrapper");
    wrapper.style.backgroundColor = "#181818"
    wrapper.style.border = "none"
    wrapper.style.borderRadius = "0"
  })

  // Remove tooltips
  document.querySelectorAll('d2l-navigation-dropdown-button-icon').forEach(a => {
    a.setAttribute("tooltip-offset", "100000") // Ez fix to get rid of the tooltips
  })

  // Add shortcuts to all subjects
  document.querySelector("d2l-navigation-dropdown-button-icon").dispatchEvent(new Event("d2l-dropdown-opener-click"));
  setTimeout(next, 500)
}

const next = () => {
  document.querySelector("d2l-navigation-dropdown-button-icon").click()
  const container = document.createElement("div");
  container.classList.toggle("d2l-navigation-s-main-wrapper");
  document.querySelector(".d2l-navigation-s-main-wrapper").parentNode.appendChild(container);

  document.querySelectorAll(".vui-selected").forEach(a => {
    const subLink = a.querySelector(".d2l-link")
    const name = a.innerText.split(" - ")[1]
    const parent = document.createElement("div")
    parent.classList.add("d2l-navigation-s-item")
    parent.setAttribute("role", "listitem")
    const newLink = document.createElement("a")
    newLink.setAttribute("href", subLink.getAttribute("href"))
    newLink.classList.add("d2l-navigation-s-link")
    newLink.classList.add("custom_link")
    newLink.innerText = name;
    parent.appendChild(newLink)
    container.appendChild(parent)
    console.log(name)
    console.log(THIS_COURSE)
    if (name === THIS_COURSE) {
      newLink.style.setProperty('color', '#2a2a2a', 'important')
    }
  })
}


setTimeout(onInit, 1500)
