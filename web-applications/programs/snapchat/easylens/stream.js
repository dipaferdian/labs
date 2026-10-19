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
  --url 'https://gcp.api.snapchat.com/lens-studio-web-ailc/assistant/v1/conversations/events/06ad6445-24fd-704d-8000-1bd4841e855d' \
  -H 'accept: text/event-stream' \
  -H 'accept-language: en-US,en;q=0.9,id;q=0.8' \
  -H 'authorization: Bearer hCgwKCjE3OTExNjIwMTASuQFz09Y2CIwkd3chA04kSFH91gu4yYH7tDZ3tOwBZSr4F7g7PMJZraGU8Hxt_rq6CyKTn1lAatGFbk6CCezcBK7VUcYomgyHudaGiO6bzPxX73okcTYZqyew91vzjgzPC5-ZpOYVX8dBxsrOAgWnJReSquF1A4w8n54VzNh9My4WxWBE0HL8EKwsY7iW7QtnAGF76TsNAY9YbBCsUWYgqRYzLOVkQ1432nb4ib435odmSsgslJFHUL7uWQ' \
  -H 'cache-control: no-cache' \
  -b 'sc-cookies-accepted=true; EssentialSession=true; Preferences=true; Performance=true; Marketing=true; blizzard_client_id=f3c234c8-c107-42f8-9460-eb61d460f398:1790439162850; _gcl_au=1.1.169116524.1790439163; sc-wcid=4ea83d85-b64c-4e9a-885f-81925d411918; sc-language=en-US; _scid=rpOiRILENQxgZv-kEcc-Yb2obtxtcBUf; _scid_r=vBOiRILENQxgZv-kEcc-Yb2obtxtcBUf3L9LpQ; sc_at=v2|H4sIAAAAAAAA/03GwREAIQgEsIqYEURh7UZEqrD4+15e2dr5Zl2CS5KKBEHsUC+cjOGI0sfaFht4THW392v7APYEUfdAAAAA; _sctr=1%7C1791478800000; sc-dweb-allocation=19; _ga_KKNBL4WWPH=GS2.1.s1791820296$o2$g0$t1791820296$j60$l0$h0; sc-a-nonce=932c720c-f037-4693-94ab-a0e42d5babbb; blizzard_web_session_id=XaNMMq1DQiSkNrOg; _gid=GA1.2.173262143.1792426436; _ga_DPDHJB4310=GS2.1.s1792426435$o5$g1$t1792426551$j8$l0$h0; _ga=GA1.1.788716378.1790439163; _ga_QB5Z5X9KGR=GS2.1.s1792426108$o2$g1$t1792427017$j30$l0$h0; _ga_D2YQCD9KF4=GS2.1.s1792424901$o8$g1$t1792428486$j51$l0$h0' \
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
