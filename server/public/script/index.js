import { preload } from "./preloader.js";

//! Load content if DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    //* Load functions
    await initIndex();
    await preload();
    return Promise.resolve();
  } catch (error) {
    console.error("Failed to load index", error);
    throw new Error("Failed to load index");
  }
});

//! Initialize index page
const initIndex = () => {
  return Promise.all([toggleFormDisplay(), setupForms()]);
};

//! Hide all forms
const hideAllForms = () => {
  const forms = document.querySelectorAll(".sign-in, .sign-up, .forgot-password");
  if (!forms || forms.length <= 0) return Promise.resolve();
  forms.forEach((form) => {
    form.style.display = "none";
  });
  return Promise.resolve();
};

//! Show selected form
const showForm = (formClass) => {
  const form = document.querySelector(`.${formClass}`);
  if (!form) return;
  form.style.display = "flex";
  document.querySelector("section").style.top = "0";
  return;
};

//! Change form display
const toggleFormDisplay = () => {
  //* Check if elements exist
  const buttons = document.querySelectorAll(
    ".sign-up-button, .sign-in-button, .forgot-password-button"
  );
  //* Error message
  if (buttons.length === 0) return Promise.reject();
  //* Add event listeners
  buttons.forEach((button) => {
    const newButton = button.cloneNode(true);
    button.replaceWith(newButton);
    newButton.addEventListener("click", (e) => {
      //* Get form class
      const formToShow = e.target.classList[0].replace("-button", "");
      //* Hide all forms
      hideAllForms();
      //* Show selected form
      showForm(formToShow);
    });
  });
  return Promise.resolve();
};

//! Initialize forms functions
export const setupForms = () => {
  return Promise.all([loginFormFunction(), registerFormFunction(), resetPasswordFormFunction()]);
};

//! Change submit button state
const submitOff = (submit) => {
  const submitOldValue = submit.value;
  submit.disabled = true;
  submit.style.cursor = "wait";
  submit.value = "Proszę czekać...";
  return submitOldValue;
};

//! Change submit button state
const submitOn = (submit, submitOldValue) => {
  submit.disabled = false;
  submit.style.cursor = "pointer";
  submit.value = submitOldValue;
  return Promise.resolve();
};

//! Universal form function
const formFunction = (formClass, apiEndpoint, getRequestBody, onSuccessRedirect) => {
  //* Check if elements exist
  const target = document.querySelector(formClass);
  if (!target) return Promise.reject();
  //* Form event listener
  target.addEventListener("submit", async (e) => {
    e.preventDefault();
    //* Get form elements
    const submit = e.target.querySelector("input[type='submit']");
    const body = getRequestBody(e.target);
    //* Change submit button state
    const submitOldValue = submitOff(submit);
    //* Fetch request
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        //* Display error message
        const data = await response.json();
        console.log(data);
        submitOn(submit, submitOldValue);
        return;
      }
      //* Redirect on success
      window.location.href = onSuccessRedirect;
      return Promise.resolve();
    } catch (err) {
      console.error(err);
      submitOn(submit, submitOldValue);
      window.location.href = "/";
    }
  });
  return Promise.resolve();
};

//! Login form validation
const loginFormFunction = () => {
  formFunction(
    ".sign-in",
    "/api/login",
    (target) => ({
      email: target["sign-in-email"].value,
      password: target["sign-in-password"].value,
    }),
    "/cloud"
  );
  return Promise.resolve();
};

//! Register form validation
const registerFormFunction = () => {
  formFunction(
    ".sign-up",
    "/api/register",
    (target) => ({
      email: target["sign-up-email"].value,
      username: target["sign-up-email"].value.split("@")[0],
      password: target["sign-up-password"].value,
      repassword: target["sign-up-password-repeat"].value,
    }),
    "/cloud"
  );
  return Promise.resolve();
};

//! Reset password form validation
const resetPasswordFormFunction = () => {
  //TODO
  return;
  formFunction(
    ".forgot-password",
    "/api/resetpassword",
    (target) => ({
      email: target["forgot-password-email"].value,
      password: target["forgot-password-password"].value,
      repassword: target["forgot-password-password-repeat"].value,
      code: target["forgot-password-code"].value.toUpperCase(),
    }),
    "/api/main"
  );
  return Promise.resolve();
};
