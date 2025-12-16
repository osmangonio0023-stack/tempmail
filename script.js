let email = "";
let password = "123456";
let token = "";

async function createMail() {
  // 1. domain
  let d = await fetch("https://api.mail.tm/domains");
  let domain = (await d.json())["hydra:member"][0].domain;

  email = "user" + Math.floor(Math.random() * 9999) + "@" + domain;

  // 2. create account
  await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password })
  });

  // 3. login
  let login = await fetch("https://api.mail.tm/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password })
  });

  let data = await login.json();
  token = data.token;

  document.getElementById("email").innerText = email;
  document.getElementById("messages").innerText = "Waiting for messages...";

  loadInbox();
}

async function loadInbox() {
  if (!token) return;

  let r = await fetch("https://api.mail.tm/messages", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  let data = await r.json();
  let box = document.getElementById("messages");

  if (data["hydra:member"].length === 0) {
    box.innerText = "No messages yet...";
    return;
  }

  box.innerHTML = "";
  data["hydra:member"].forEach(msg => {
    let div = document.createElement("div");
    div.style.borderBottom = "1px dashed #00ff99";
    div.style.padding = "5px";
    div.innerHTML = `
      <b>From:</b> ${msg.from.address}<br>
      <b>Subject:</b> ${msg.subject}
    `;
    box.appendChild(div);
  });

  setTimeout(loadInbox, 5000); // auto refresh
}

function copyMail() {
  navigator.clipboard.writeText(email);
  alert("Email copied!");
}

