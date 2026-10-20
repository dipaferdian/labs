let buffer = "";
let receivedData = false;

function logError(title, message) {
  console.error(`\n❌ ${title}`);
  if (message) console.error(message);
}

function printEvent(block) {
  const dataLines = [];
  const metadata = [];

  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith(":")) continue;

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).replace(/^ /, ""));
    } else if (
      line.startsWith("event:") ||
      line.startsWith("id:") ||
      line.startsWith("retry:")
    ) {
      metadata.push(line);
    }
  }

  const eventType = metadata.find((line) => line.startsWith("event:"));

  if (eventType) {
    console.log(`\n📨 ${eventType}`);
  }

  if (dataLines.length === 0) {
    for (const line of metadata) {
      if (line !== eventType) console.log(line);
    }
    return;
  }

  const raw = dataLines.join("\n");
  receivedData = true;

  try {
    const json = JSON.parse(raw);

    if (json.error || json.errors) {
      logError("Server mengembalikan error", JSON.stringify(json, null, 2));
      return;
    }

    console.log(JSON.stringify(json, null, 2));
  } catch {
    // Data SSE tidak selalu berupa JSON.
    console.log(raw);
  }

  for (const line of metadata) {
    if (line !== eventType) console.log(line);
  }
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  buffer += chunk;

  const events = buffer.split(/\r?\n\r?\n/);
  buffer = events.pop();

  for (const event of events) {
    if (event.trim()) printEvent(event);
  }
});

process.stdin.on("end", (data) => {
  if (buffer.trim()) printEvent(buffer);

  console.log("data", data);

  if (!receivedData) {
    console.error(
      "\n⚠️ Stream selesai, tetapi tidak ada event data yang diterima.",
    );
    console.error(
      "Periksa HTTP status, autentikasi, URL, dan response server.",
    );
  }
});

process.stdin.on("error", (error) => {
  logError("Gagal membaca stream", error.message);

  console.log(error);
});

process.on("uncaughtException", (error) => {
  logError("Unhandled exception", error.stack || error.message);
  process.exitCode = 1;
});
