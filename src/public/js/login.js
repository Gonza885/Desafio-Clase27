const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  await fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => {
      if (res.status !== 200) {
        alert(`Invalid credentials`);
      } else {
        alert(`Loged`);
        window.location.replace("/");
      }
    })
    .catch((err) => console.log(`Catch error: ${err}`));
});
