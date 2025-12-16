let currentEmail = "";

async function createMail() {
  let d = await fetch("https://api.mail.tm/domains");
  let domain = (await d.json())["hydra:member"][0].domain;

  currentEmail = "user" + Math.floor(Math.random()*9999) + "@" + domain;

  await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      address: currentEmail,
      password: "123456"
    })
  });

  document.getElementById("email").innerText = currentEmail;
  document.getElementById("messages").innerText = "Waiting for messages...";
}

function copyMail() {
  if (!currentEmail) return;
  navigator.clipboard.writeText(currentEmail);
  alert("Email copied!");
}
