function test(params) {
  const ALLOWED_HOSTS = ["shop.alibaba.com", "pay.alibaba.com"];

  try {
    const userInputUrl = params;
    urlParser = new URL(userInputUrl);

    if (ALLOWED_HOSTS.includes(urlParser.hostname)) {
      return "redirect";
    }

    return "login, default home";
  } catch (error) {
    return "Invalid URL format";
  }
}

console.log(test("https://shop.alibaba.com"));
