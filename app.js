// app.js
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

// Animation to toggle sign-up mode
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Use Firebase auth for sign-up
signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const username = signUpForm.querySelector("input[type='text']").value;
  const email = signUpForm.querySelector("input[type='email']").value;
  const password = signUpForm.querySelector("input[type='password']").value;

  if (username && email && password) {
    signUpUser(email, password, username)
      .then((user) => {
        alert("Sign-up successful! You can now log in.");
        container.classList.remove("sign-up-mode");
      })
      .catch((error) => {
        alert("Error during sign-up: " + error.message);
      });
  } else {
    alert("Please fill in all fields.");
  }
});

// Use Firebase auth for sign-in
signInForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Now selecting the email input field correctly.
  const email = signInForm.querySelector("input[type='email']").value;
  const password = signInForm.querySelector("input[type='password']").value;

  signInUser(email, password)
    .then((user) => {
      alert("Login successful! Redirecting...");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Error during sign-in: " + error.message);
    });
});
