const buttons = document.querySelectorAll(".service-nav button");
const frames = document.querySelectorAll(".service-frame");

function activate(service) {
  for (const button of buttons) {
    button.classList.toggle("active", button.dataset.service === service);
  }
  for (const frame of frames) {
    const isActive = frame.dataset.service === service;
    frame.hidden = !isActive;
    if (isActive && !frame.src) {
      frame.src = frame.dataset.src;
    }
  }
}

for (const button of buttons) {
  button.addEventListener("click", () => activate(button.dataset.service));
}

activate(buttons[0].dataset.service);
