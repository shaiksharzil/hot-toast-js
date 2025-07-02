(function injectLiquidGlassSVG() {
  if (document.getElementById("glass-distortion")) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("style", "position:absolute; width:0; height:0");

  svg.innerHTML = `
    <filter id="glass-distortion">
      <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" seed="5" result="turbulence"/>
      <feGaussianBlur in="turbulence" stdDeviation="0.1" result="softMap"/>
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="100"/>
    </filter>
  `;

  document.body.appendChild(svg);
})();

function toast(options = {}) {
  let resolvePromise;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });
  const {
    message = "Hello from toastify-css!",
    duration = 3000,
    position = "top-center",
    orderReversed = false,
    entryAnimation = "fadeIn",
    exitAnimation = "fadeOut",
    themeName = "default",
    autoClose = true,
    pauseOnHover = true,
    showProgressBar = true,
    progressBarColor,
    progressBarHeight = "0.2rem",
    progressBarPosition = "bottom",
    background,
    color,
    border,
    borderRadius = "0.3rem",
    fontSize,
    fontFamily,
    opacity,
    showCloseButton = true,
    closeButtonColor,
    closeButtonSize = "1rem",
    showActionButton = false,
    actionButtonThemeName = themeName,
    actionButtonLabel = "Click",
    onAction,
    actionButtonColor,
    actionButtonBackground,
    actionButtonPadding = "0.4rem",
    actionButtonMargin = "0rem 0rem 0rem 0.8rem",
    actionButtonBorder,
    actionButtonBorderRadius = "0.3rem",
    actionButtonFontSize,
    actionButtonFontFamily,
    actionButtonOpacity,
    actionButtonShadow,
    showIcon = false,
    iconType,
    icon,
    iconBackground,
    iconColor,
    iconBorderRadius = "50%",
    iconAnimation = "iconPulse",
    iconTimingFunction = "ease",
  } = options;

  let container = document.querySelector(`.toast-container.${position}`);
  if (!container) {
    container = document.createElement("div");
    container.classList.add("toast-container", position);
    container.style.position = "fixed";
    container.style.display = "flex";
    container.style.gap = "0.8rem";
    container.style.zIndex = "1000";
    container.style.pointerEvents = "none";
    container.style.width = "100%";

    const positions = {
      "top-left": () => {
        container.style.top = "1rem";
        container.style.left = "1rem";
        container.style.alignItems = "flex-start";
      },
      "top-center": () => {
        container.style.top = "1rem";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        container.style.alignItems = "center";
      },
      "top-right": () => {
        container.style.top = "1rem";
        container.style.right = "1rem";
        container.style.alignItems = "flex-end";
      },
      "bottom-left": () => {
        container.style.bottom = "1rem";
        container.style.left = "1rem";
        container.style.alignItems = "flex-start";
      },
      "bottom-center": () => {
        container.style.bottom = "1rem";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        container.style.alignItems = "center";
      },
      "bottom-right": () => {
        container.style.bottom = "1rem";
        container.style.right = "1rem";
        container.style.alignItems = "flex-end";
      },
    };

    positions[position]?.();
    document.body.appendChild(container);
  }

  if (position.startsWith("bottom"))
    container.style.flexDirection = orderReversed ? "column-reverse" : "column";
  else
    container.style.flexDirection = orderReversed ? "column" : "column-reverse";

  const toast = document.createElement("div");
  toast.className = `${themeName}`;
  toast.style.padding = "0.85rem 1rem";
  toast.style.position = "relative";
  toast.style.display = "flex";
  toast.style.justifyContent = "space-between";
  toast.style.alignItems = "center";
  toast.style.animation = `${entryAnimation} 0.4s ease`;
  if (border) toast.style.border = border;
  if (opacity) toast.style.opacity = opacity;
  if (borderRadius) toast.style.borderRadius = borderRadius;
  if (background) toast.style.background = background;
  if (color) toast.style.color = color;
  if (fontSize) toast.style.fontSize = fontSize;
  if (fontFamily) toast.style.fontFamily = fontFamily;
  toast.style.pointerEvents = "auto";
  if (window.innerWidth <= 450) {
    toast.style.maxWidth = "80%";
  }
  const theme = document.createElement("div");
  theme.className = `${themeName}`;
  theme.style.display = "none";
  document.body.appendChild(theme);

  if (showProgressBar) {
    const progressBar = document.createElement("div");
    progressBar.style.height = progressBarHeight;
    progressBar.style.width = "100%";
    progressBar.style.position = "absolute";
    if (progressBarPosition == "top") progressBar.style.top = 0;
    else progressBar.style.bottom = 0;
    progressBar.style.left = 0;
    progressBar.style.borderRadius = "0.3rem";
    if (progressBarColor) progressBar.style.background = progressBarColor;
    else if (color) progressBar.style.background = color;
    else progressBar.style.background = getComputedStyle(theme).color;

    if (autoClose) {
      progressBar.style.animation = `progress ${
        duration / 1000
      }s linear forwards`;

      if (pauseOnHover) {
        toast.addEventListener("mouseenter", () => {
          progressBar.style.animationPlayState = "paused";
        });

        toast.addEventListener("mouseleave", () => {
          progressBar.style.animationPlayState = "running";
        });
      }
    }
    toast.appendChild(progressBar);
  }
  let opac = getComputedStyle(theme).backgroundColor.match(
    /rgba?\(\s*\d+,\s*\d+,\s*\d+,\s*([0-9.]+)\s*\)/
  );
  
  if (showIcon) {
    const Icon = document.createElement("div");
    if ((iconType == "success" || iconType == "error" || iconType=="warn" || iconType=="loader") && (!icon)) {
      if (getComputedStyle(theme).backgroundColor == "rgba(0, 0, 0, 0)") {
        Icon.style.color = "white";
        if (getComputedStyle(theme).color == "rgb(255, 255, 255)")
          Icon.style.color = "black";
      } else {
        Icon.style.color = getComputedStyle(theme).backgroundColor;
      }

      if (opac) {
        if (parseFloat(opac[1]) <= 0.3) {
          Icon.style.color = "white";
          if (getComputedStyle(theme).color == "rgb(255, 255, 255)") {
            Icon.style.color = "black";
          }
        }
      }
      Icon.style.background = getComputedStyle(theme).color;
      if (background) Icon.style.color = background;
      if (color) Icon.style.background = color;
      if (iconType == "loader") {
        Icon.className = "loader";
        Icon.style.background = "transparent";
        Icon.style.borderTop = `3px solid ${getComputedStyle(theme).color}`;
        if (color) Icon.style.borderTop = `3px solid ${color}`;
        Icon.style.animation = "spin 0.4s infinite";
      }
      if (iconType == "success") Icon.innerHTML = "&#10004";
      if (iconType == "error") Icon.innerHTML = "&#x2718";
      if (iconType == "warn") Icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path></svg>`;
    }

    if (icon) Icon.innerHTML = icon;
  if (iconBackground) Icon.style.background = iconBackground;
  if (iconColor) Icon.style.color = iconColor;
  Icon.style.fontSize = "1.2rem";
  Icon.style.height = "1.3rem";
  Icon.style.width = "1.3rem";
  Icon.style.display = "flex";
  Icon.style.alignItems = "center";
  Icon.style.justifyContent = "center";
  Icon.style.borderRadius = iconBorderRadius;
    Icon.style.marginRight = "0.5rem";
    if (!(iconType == "loader")) Icon.style.animation = `${iconAnimation} 0.6s ${iconTimingFunction}`;
  toast.appendChild(Icon);
  }
  const toastMessage = document.createElement("div");
  toastMessage.innerHTML = `${message.replace(/\n/g, "<br>")}`;
  toastMessage.style.flex = "1";
  toastMessage.style.maxWidth = "19rem";
  toastMessage.style.overflow = "hidden";
  toast.appendChild(toastMessage);

  let timeout;
  let startTime = Date.now();
  let remaining = duration;
  let pauseTime;

  const controller = {
    close: () => {
      if (autoClose) {
        toastExit("manual");
      }
    },
    promise,
  };

  if (showActionButton && actionButtonLabel) {
    const actionBtn = document.createElement("div");
    actionBtn.className = `${actionButtonThemeName}`;
    actionBtn.textContent = actionButtonLabel;
    actionBtn.style.cursor = "pointer";
    actionBtn.style.padding = actionButtonPadding;
    actionBtn.style.borderRadius = actionButtonBorderRadius;
    actionBtn.style.margin = actionButtonMargin;
    actionBtn.style.overflow = "hidden";
    let borStr = getComputedStyle(theme).border;
    if (borStr[0] + borStr[1] + borStr[2] == "0px" || !getComputedStyle(theme).border) actionBtn.style.border = `1px solid ${getComputedStyle(theme).color}`;
    if(color)actionBtn.style.border=`1px solid ${color}`
    if (actionButtonBackground) actionBtn.style.background = actionButtonBackground;
    else if (background) actionBtn.style.background = background;
    if (actionButtonColor) actionBtn.style.color = actionButtonColor;
    else if (color) actionBtn.style.color = color;
    if (actionButtonFontFamily) actionBtn.style.fontFamily = actionButtonFontFamily;
    if (actionButtonFontSize) actionBtn.style.fontSize = actionButtonFontSize;
    if (actionButtonBorder) actionBtn.style.border = actionButtonBorder;
    if (actionButtonOpacity) actionBtn.style.opacity = actionButtonOpacity;
    if (actionButtonShadow) actionBtn.style.shadow = actionButtonShadow;
    toast.appendChild(actionBtn);
    actionBtn.addEventListener("click", () => {
      onAction();
    });
  }

  if (showCloseButton) {
    const closeBtn = document.createElement("div");
    closeBtn.innerHTML = "&#10005";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "0.9rem";
    closeBtn.style.fontWeight = 900;
    if (closeButtonSize) closeBtn.style.fontSize = closeButtonSize;
    if (closeButtonColor) closeBtn.style.color = closeButtonColor;
    toast.appendChild(closeBtn);
    closeBtn.addEventListener("click", () => {
      clearTimeout(timeout);
      toastExit("cancel");
    });
  }

  container.appendChild(toast);

  if (duration > 0) {
    timeout = setTimeout(() => {
      if (autoClose) {
        toastExit("timeout");
      }
    }, duration);
  }

  if (pauseOnHover && autoClose) {
    toast.addEventListener("mouseenter", () => {
      if (timeout) {
        clearTimeout(timeout);
        pauseTime = Date.now();
        remaining -= pauseTime - startTime;
      }
    });

    toast.addEventListener("mouseleave", () => {
      if (duration > 0) {
        startTime = Date.now();
        timeout = setTimeout(() => {
          if (autoClose) {
            toastExit("timeout");
          }
        }, remaining);
      }
    });
  }
  function toastExit(action) {
    toast.style.animation = `${exitAnimation} 0.4s ease`;
    toast.addEventListener(
      "animationend",
      () => {
        toast.remove();
        if (container.childElementCount === 0) container.remove();
        resolvePromise({ action });
      },
      { once: true }
    );
  }

  return controller;
}
// export default toast;
