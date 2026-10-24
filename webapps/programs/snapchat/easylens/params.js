action_id: [...crypto.getRandomValues(new Uint8Array(6))]
  .map((n) => n.toString(16).padStart(2, "0"))
  .join("");
