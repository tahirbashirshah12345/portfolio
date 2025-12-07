

document.addEventListener("DOMContentLoaded", function () {

  initThemeToggle();
  initNavigation();
  initScrollEffects();
  initContactForm();
  initScrollToTop();
  initAnimationsOnScroll();
  initMobileMenu();
  initProjectLinks();
});


function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");


  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);


  updateThemeIcon(currentTheme);

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

   
    document.documentElement.style.transition = "all 0.3s ease";

  
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

   
    updateThemeIcon(newTheme);

  
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 300);
  });

  function updateThemeIcon(theme) {
    themeIcon.style.transform = "rotate(360deg)";

    setTimeout(() => {
      if (theme === "dark") {
        themeIcon.className = "fas fa-sun theme-icon";
      } else {
        themeIcon.className = "fas fa-moon theme-icon";
      }
      themeIcon.style.transform = "rotate(0deg)";
    }, 150);
  }
}


function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 60; 
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }

      
      const navMenu = document.getElementById("nav-menu");
      const navToggle = document.getElementById("nav-toggle");
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  });

  
  function updateActiveNavLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

 
  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink(); // Initial call
}


function initMobileMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    
    document.addEventListener("click", function (e) {
      const themeToggle = document.getElementById("theme-toggle");
      if (
        !navToggle.contains(e.target) &&
        !navMenu.contains(e.target) &&
        !themeToggle.contains(e.target)
      ) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });

    
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }
}


function initScrollEffects() {
  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });
}


function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

   
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

     
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

    
      showNotification(
        "Thank you for your message! I'll get back to you soon.",
        "success"
      );
      contactForm.reset();
    });
  }
}


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function showNotification(message, type = "info") {
  
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

  
  const theme = document.documentElement.getAttribute("data-theme");
  let bgColor, textColor;

  switch (type) {
    case "success":
      bgColor = "#10b981";
      textColor = "white";
      break;
    case "error":
      bgColor = "#ef4444";
      textColor = "white";
      break;
    default:
      bgColor = "#3b82f6";
      textColor = "white";
  }


  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
    `;

  // Add close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: ${textColor};
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;

  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease forwards";
    setTimeout(() => notification.remove(), 300);
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.opacity = "1";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.opacity = "0.8";
  });

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Scroll to top functionality
function initScrollToTop() {
  const scrollTopBtn = document.getElementById("scroll-top");

  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Animations on scroll
function initAnimationsOnScroll() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".skill-category, .project-card, .education-item, .contact-item, .stat"
  );
  animatedElements.forEach((element) => {
    element.classList.add("animate-on-scroll");
    observer.observe(element);
  });
}

// Project links functionality
function initProjectLinks() {
  const projectLinks = document.querySelectorAll(".project-link");

  projectLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Add a small delay for the hover effect
      e.preventDefault();
      const href = this.getAttribute("href");

      setTimeout(() => {
        window.open(href, "_blank");
      }, 100);
    });
  });
}

// Utility function for smooth animations
function animateValue(element, start, end, duration, suffix = "") {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Initialize counter animations when stats come into view
function initCounterAnimations() {
  const stats = document.querySelectorAll(".stat h3");
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const finalValue = target.textContent;
          const isPercentage = finalValue.includes("%");
          const isDecimal = finalValue.includes(".");

          let numericValue;
          let suffix = "";

          if (isPercentage) {
            numericValue = parseFloat(finalValue.replace("%", ""));
            suffix = "%";
          } else if (isDecimal) {
            numericValue = parseFloat(finalValue);
          } else {
            numericValue = parseInt(finalValue.replace("+", ""));
            suffix = finalValue.includes("+") ? "+" : "";
          }

          target.textContent = "0" + suffix;
          animateValue(target, 0, numericValue, 2000, suffix);
          statsObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => statsObserver.observe(stat));
}

// Initialize counter animations after DOM is loaded
document.addEventListener("DOMContentLoaded", initCounterAnimations);

// Add enhanced CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    [data-theme="dark"] .navbar.scrolled {
        background: rgba(15, 23, 42, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .theme-toggle {
        position: relative;
        overflow: hidden;
    }
    
    .theme-toggle::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        border-radius: 50%;
        transition: all 0.3s ease;
        z-index: -1;
    }
    
    .theme-toggle:hover::before {
        width: 100px;
        height: 100px;
    }
    
    .theme-icon {
        transition: transform 0.3s ease;
    }
    
    /* Enhanced theme transition */
    html[data-theme="dark"] {
        color-scheme: dark;
    }
    
    html[data-theme="light"] {
        color-scheme: light;
    }
`;
document.head.appendChild(style);
