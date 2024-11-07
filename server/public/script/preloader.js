//! Preloader
export const preload = async (state = false) => {
  try {
    //* Check if elements exist
    const preloader = document.querySelector(".preloader");
    if (!preloader) return;
    //* Show or hide preloader
    if (state) {
      //* Show preloader
      preloader.classList.remove("hide");
      preloader.style.display = "flex";
    } else {
      //* Hide preloader
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 300); //? 300ms => 250ms (CSS transition) + 50ms (JS delay)
    }
  } catch (error) {
    console.error("Failed to load preloader", error);
  }
};
