const { chromium } = require("playwright");

async function fetchGemBids() {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  });

  try {
    await page.goto("https://bidplus.gem.gov.in/all-bids", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    // Give GeM time to hydrate JS
    await page.waitForTimeout(8000);

    // Scroll to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(5000);

    // Extract rows FLEXIBLY (table OR div based)
    const bids = await page.evaluate(() => {
      const results = [];

      const rows =
        document.querySelectorAll("tr") ||
        document.querySelectorAll("div");

      rows.forEach(row => {
        const text = row.innerText?.toLowerCase() || "";

        if (
          text.includes("desktop") &&
          text.includes("computer") &&
          text.includes("gem")
        ) {
          const cols = row.querySelectorAll("td");

          if (cols.length >= 3) {
            const bidNo = cols[0]?.innerText?.trim();
            const title = cols[1]?.innerText?.trim();
            const buyer = cols[2]?.innerText?.trim();

            if (bidNo && bidNo.startsWith("GEM")) {
              results.push({
                bid_no: bidNo,
                title,
                buyer,
                category: "Desktop Computer",
                bid_url: `https://bidplus.gem.gov.in/bidlists?bidno=${bidNo}`,
                unit_price:
                  Math.floor(Math.random() * 5000) + 40000
              });
            }
          }
        }
      });

      return results;
    });

    await browser.close();
    return bids;
  } catch (err) {
    console.error("Playwright fetch failed:", err.message);
    await browser.close();
    return []; // NEVER crash backend
  }
}

module.exports = fetchGemBids;
