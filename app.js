const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const username = signUpForm.querySelector("input[type='text']").value;
  const email = signUpForm.querySelector("input[type='email']").value;
  const password = signUpForm.querySelector("input[type='password']").value;

  if (username && email && password) {
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    alert("Sign-up successful! You can now log in.");
    container.classList.remove("sign-up-mode");
  } else {
    alert("Please fill in all fields.");
  }
});

signInForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = signInForm.querySelector("input[type='text']").value;
  const password = signInForm.querySelector("input[type='password']").value;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    alert("Login successful! Redirecting...");
    window.location.href = "dashboard.html"; // Redirect to an empty page
  } else {
    alert("Invalid username or password. Please sign up first.");
  }
});
