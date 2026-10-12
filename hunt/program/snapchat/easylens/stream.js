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

/*

curl -NsS --fail-with-body \
  --connect-timeout 15 \
  --max-time 0 \
  -w '\n\n[HTTP Status: %{http_code}]\n[Content Type: %{content_type}]\n[Remote IP: %{remote_ip}]\n' \
  --url 'https://gcp.api.snapchat.com/lens-studio-web-ailc/assistant/v1/conversations/events/06aca5c1-7da4-701d-8000-41ca4c7a1bb6?last_message_id=06aca761-2280-7629-8000-1ee33f3710ca' \
  -H 'accept: text/event-stream' \
  -H 'accept-language: en-US,en;q=0.9,id;q=0.8' \
  -H 'authorization: Bearer hCgwKCjE3OTA1NTcyMTASuQFYuFFe-aw0kNcMGAXNT6VSPEQnFskAczpaKi2jUglxSUHVI0EGve-98yKF4fGwGbV_5tiWX4WY20touCW4JyXoIkNYlBFE52LZmUUXN7Nb2vG5iQVZKEXPBPXmkiRDl-zQMeuKFmicQYma7BVGv_Bg1Nsa4K2zKpL3mbNCa4gA6i7phlkm0kf5eidUMxpONNZxiL7jh191zs0pCwo3U8MU8brxjc7WY6t_cEcM4jELcWGjc6oiJEdUUg' \
  -H 'cache-control: no-cache' \
  -b 'sc-cookies-accepted=true; EssentialSession=true; Preferences=true; Performance=true; Marketing=true; blizzard_client_id=f3c234c8-c107-42f8-9460-eb61d460f398:1790439162850; _gcl_au=1.1.169116524.1790439163; sc-wcid=4ea83d85-b64c-4e9a-885f-81925d411918; sc-language=en-US; _scid=rpOiRILENQxgZv-kEcc-Yb2obtxtcBUf; _scid_r=vBOiRILENQxgZv-kEcc-Yb2obtxtcBUf3L9LpQ; sc_at=v2|H4sIAAAAAAAA/03GwREAIQgEsIqYEURh7UZEqrD4+15e2dr5Zl2CS5KKBEHsUC+cjOGI0sfaFht4THW392v7APYEUfdAAAAA; _sctr=1%7C1791478800000; _ga=GA1.1.788716378.1790439163; _ga_DPDHJB4310=GS2.1.s1791566792$o1$g1$t1791566931$j60$l0$h0; sc-a-nonce=0b4cbb4c-4bab-4a26-a6de-2d80dec39c0b; sc-dweb-allocation=19; blizzard_web_session_id=KSnQMtX5snL6kq+M; _ga_D2YQCD9KF4=GS2.1.s1791644855$o4$g1$t1791658363$j60$l0$h0' \
  -H 'origin: https://easylens.snapchat.com' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://easylens.snapchat.com/' \
  -H 'sec-ch-ua: "Chromium";v="154", "Google Chrome";v="154", "Not A(Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36' \
  -H 'x-snap-client-user-agent: LensStudioWeb/2.60.1 PROD (X11; linux ) Chrome/154 Core/377 AppId/easylens.snapchat.com' |
node stream.js

echo "curl exit code: ${PIPESTATUS[0]}"


*/
