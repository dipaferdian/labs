const express = require("express");
const app = express();

// Daftar domain partner yang diizinkan (Strict Whitelist)
const ALLOWED_HOSTS = ["shop.alibaba.com", "pay.alibaba.com"];

app.get("/secure-redirect", (req, res) => {
  const userInputUrl = req.query.next;

  if (!userInputUrl) {
    return res.status(400).send("Bad Request");
  }

  try {
    const urlParser = new URL(userInputUrl);

    if (ALLOWED_HOSTS.includes(urlParser.hostname)) {
      return res.redirect(redirectUrl);
    }
  } catch (error) {
    // Jika 'new URL()' gagal memparsing karena format tidak valid (bukan URL),
    // otomatis jatuh ke blok catch ini.
    return res.status(400).send("Invalid URL format");
  }
});
