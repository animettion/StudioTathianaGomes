const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const pageLoader = document.getElementById("pageLoader");
const leadForm = document.getElementById("leadForm");
const formFeedback = document.getElementById("formFeedback");
const galleryModal = document.getElementById("galleryModal");
const galleryModalTitle = document.getElementById("galleryModalTitle");
const galleryModalDescription = document.getElementById("galleryModalDescription");
const currentYear = document.getElementById("currentYear");

const whatsappBase = "https://wa.me/5521996050685?text=";

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

window.addEventListener("load", () => {
  if (pageLoader) {
    pageLoader.classList.add("is-hidden");
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40
    });
  }
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delay = entry.target.getAttribute("data-reveal-delay");
        if (delay) {
          entry.target.style.setProperty("--reveal-delay", `${delay}ms`);
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function setFieldState(field, message) {
  const group = field.closest(".field-group");
  const error = group ? group.querySelector(".field-error") : null;

  if (!group || !error) {
    return;
  }

  if (message) {
    group.classList.add("is-invalid");
    error.textContent = message;
  } else {
    group.classList.remove("is-invalid");
    error.textContent = "";
  }
}

function validateName(value) {
  return value.trim().length >= 3 ? "" : "Informe um nome com pelo menos 3 caracteres.";
}

function validatePhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 ? "" : "Informe um WhatsApp valido com DDD.";
}

function validateGoal(value) {
  return value.trim().length >= 12 ? "" : "Descreva rapidamente o objetivo do atendimento.";
}

if (leadForm) {
  const nameInput = leadForm.querySelector("#name");
  const phoneInput = leadForm.querySelector("#phone");
  const goalInput = leadForm.querySelector("#goal");

  [nameInput, phoneInput, goalInput].forEach((field) => {
    if (!field) {
      return;
    }

    field.addEventListener("input", () => {
      if (field === nameInput) {
        setFieldState(field, validateName(field.value));
      }

      if (field === phoneInput) {
        setFieldState(field, validatePhone(field.value));
      }

      if (field === goalInput) {
        setFieldState(field, validateGoal(field.value));
      }
    });
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!nameInput || !phoneInput || !goalInput) {
      return;
    }

    const nameError = validateName(nameInput.value);
    const phoneError = validatePhone(phoneInput.value);
    const goalError = validateGoal(goalInput.value);

    setFieldState(nameInput, nameError);
    setFieldState(phoneInput, phoneError);
    setFieldState(goalInput, goalError);

    if (nameError || phoneError || goalError) {
      if (formFeedback) {
        formFeedback.textContent = "Revise os campos destacados antes de continuar.";
      }
      return;
    }

    const message = [
      "Ola! Vim pelo site do Studio Tathiana Gomes.",
      `Meu nome e ${nameInput.value.trim()}.`,
      `Meu WhatsApp e ${phoneInput.value.trim()}.`,
      `Gostaria de agendar uma avaliacao. Objetivo: ${goalInput.value.trim()}.`
    ].join(" ");

    if (formFeedback) {
      formFeedback.textContent = "Tudo certo. Abrindo o WhatsApp com sua mensagem...";
    }

    window.open(`${whatsappBase}${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    leadForm.reset();
  });
}

const galleryTriggers = document.querySelectorAll("[data-gallery]");

function openGalleryModal(title, description, image) {
  if (!galleryModal || !galleryModalTitle || !galleryModalDescription) {
    return;
  }

  galleryModalTitle.textContent = title;
  galleryModalDescription.textContent = description;

  const visual = galleryModal.querySelector(".gallery-modal__visual");
  if (visual) {
    visual.className = "gallery-modal__visual";
    if (image) {
      visual.style.backgroundImage = `url("${image}")`;
    } else {
      visual.style.backgroundImage = "";
    }
  }

  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeGalleryModal() {
  if (!galleryModal) {
    return;
  }

  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openGalleryModal(
      trigger.getAttribute("data-title") || "Imagem",
      trigger.getAttribute("data-description") || "",
      trigger.getAttribute("data-image") || ""
    );
  });
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeGalleryModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGalleryModal();
  }
});
