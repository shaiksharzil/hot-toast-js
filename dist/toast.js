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
    showProgressBar = false,
    progressBarColor = "black",
    progressBarHeight = "3px",
    progressBarPosition = "bottom",
    background,
    color,
    border,
    borderRadius = "5px",
    fontSize,
    fontFamily,
    opacity,
    showCloseButton = true,
    closeButtonColor = color,
    closeButtonSize = "14px",
    showActionButton = false,
    actionButtonThemeName = themeName,
    actionButtonLabel = "test",
    onAction,
    actionButtonColor,
    actionButtonBackground,
    actionButtonPadding = "5px",
    actionButtonMargin = "0px 0px 0px 10px",
    actionButtonBorder,
    actionButtonBorderRadius = "5px",
    actionButtonFontSize = fontSize,
    actionButtonFontFamily = fontFamily,
    actionButtonOpacity = opacity,
    actionButtonShadow,
  } = options;

  let container = document.querySelector(`.toast-container.${position}`);

  if (!container) {
    container = document.createElement("div");
    container.classList.add("toast-container", position);
    container.style.position = "fixed";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.zIndex = "1000";

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
  toast.style.padding = "12px 16px";
  toast.style.borderRadius = borderRadius;
  toast.style.position = "relative";
  toast.style.display = "flex";
  toast.style.justifyContent = "space-between";
  toast.style.alignItems = "center";
  (toast.style.border = border),
    (toast.style.opacity = opacity),
    (toast.style.animation = `${entryAnimation} 0.4s ease`);
  toast.style.background = background;
  toast.style.color = color;
  toast.style.fontSize = fontSize;
  toast.style.fontFamily = fontFamily;

  if (showProgressBar) {
    const progressBar = document.createElement("div");
    progressBar.style.height = progressBarHeight;
    progressBar.style.width = "100%";
    progressBar.style.position = "absolute";
    if (progressBarPosition == "top") progressBar.style.top = 0;
    else progressBar.style.bottom = 0;
    progressBar.style.left = 0;
    progressBar.style.borderRadius = "0px 0px 5px 5px";
    progressBar.style.background = progressBarColor;

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

  const toastMessage = document.createElement("div");
  toastMessage.innerHTML = `${message.replace(/\n/g, "<br>")}`;
  toastMessage.style.flex = "1";
  toastMessage.style.maxWidth = "300px";
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
    actionBtn.style.background = actionButtonBackground;
    actionBtn.style.color = actionButtonColor;
    actionBtn.style.fontFamily = actionButtonFontFamily;
    actionBtn.style.fontSize = actionButtonFontSize;
    actionBtn.style.border = actionButtonBorder;
    actionBtn.style.opacity = actionButtonOpacity;
    actionBtn.style.shadow = actionButtonShadow;
    toast.appendChild(actionBtn);
    actionBtn.addEventListener("click", () => {
      onAction();
    });
  }

  if (showCloseButton) {
    const closeBtn = document.createElement("div");
    closeBtn.textContent = "✖";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "12px";
    closeBtn.style.fontSize = closeButtonSize;
    closeBtn.style.color = closeButtonColor;
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
