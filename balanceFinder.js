const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: `./user-data-dir1`,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 480 }); // Устанавливаем маленький размер экрана
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
  );
  await page.goto(
    "https://the-pixels.pages.dev/?tgWebAppStartParam=0_f552c1ba-9422-4c99-a67e-e67b4c6027bb_2_play_from_bot#tgWebAppData=user%3D%257B%2522id%2522%253A5499493097%252C%2522first_name%2522%253A%2522%25D0%2590%25D1%2580%25D1%2582%25D0%25B5%25D0%25BC%2522%252C%2522last_name%2522%253A%2522%25D0%2591%25D0%25BE%25D0%25BD%25D0%25BE%25D1%2585%25D0%25BE%25D0%25B2%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D3573236582578687840%26chat_type%3Dprivate%26start_param%3D0_f552c1ba-9422-4c99-a67e-e67b4c6027bb_2_play_from_bot%26auth_date%3D1711042400%26hash%3D1b79a357fbc0cf16250031ac3487ae2e1cd47299544662e0937e9a0f97257e5d&tgWebAppVersion=7.0&tgWebAppPlatform=web&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%233390ec%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23707579%22%2C%22link_color%22%3A%22%2300488f%22%2C%22secondary_bg_color%22%3A%22%23f4f4f5%22%2C%22text_color%22%3A%22%23000000%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22accent_text_color%22%3A%22%233390ec%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%233390ec%22%2C%22subtitle_text_color%22%3A%22%23707579%22%2C%22destructive_text_color%22%3A%22%23df3f40%22%7D"
  );
  // Далее выполните ваш код на странице
  //await browser.close();
})();
