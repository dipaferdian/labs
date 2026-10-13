const result = document.getElementById("result");
const backendInput = document.getElementById("backend-url");

document.getElementById("frontend-origin").textContent =
  window.location.origin;

async function sendRequest(useCustomHeader = false) {
  const backendURL = backendInput.value.trim().replace(/\/$/, "");

  const options = {
    method: "OPTIONS"
  };

  if (useCustomHeader) {
    options.headers = {
      "X-Lab-Header": "hello"
    };
  }

  result.textContent = "Mengirim request...";

  try {
    const response = await fetch(
      `${backendURL}/api/hello`,
      options
    );

    const data = await response.json();

    result.textContent = JSON.stringify(
      {
        status: response.status,
        responseHeaders: {
          contentType: response.headers.get("Content-Type"),
          allowOrigin: response.headers.get(
            "Access-Control-Allow-Origin"
          )
        },
        body: data
      },
      null,
      2
    );
  } catch (error) {
    result.textContent =
      `${error.name}: ${error.message}\n` +
      "Periksa Console dan Network di Chrome DevTools.";
  }
}

document
  .getElementById("get-button")
  .addEventListener("click", () => sendRequest(false));

document
  .getElementById("custom-button")
  .addEventListener("click", () => sendRequest(true));