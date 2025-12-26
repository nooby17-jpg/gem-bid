const axios = require("axios");
const cheerio = require("cheerio");

async function fetchCpppTenders(page = 1) {
  try {
    const url =
      `https://eprocure.gov.in/cppp/latestactivetenders?page=${page}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        Accept: "text/html",
        Referer: "https://eprocure.gov.in/cppp/"
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const tenders = [];

    $("table tbody tr").each((_, row) => {
      const cols = $(row).find("td");
      if (cols.length < 6) return;

      const bidId = $(cols[0]).text().trim();
      const title = $(cols[1]).text().trim();
      const buyer = $(cols[2]).text().trim();
      const endDate = $(cols[4]).text().trim();
      const link = $(cols[1]).find("a").attr("href");

      if (!bidId || !link) return;

      tenders.push({
        bid_id: bidId,
        title,
        buyer,
        category: "Public Tender",
        price: null,
        end_date: endDate,
        url: "https://eprocure.gov.in" + link,
        source: "CPPP"
      });
    });

    console.log(`✅ CPPP fetched: ${tenders.length}`);
    return tenders;
  } catch (err) {
    console.error("❌ CPPP fetch failed:", err.response?.status || err.message);
    return [];
  }
}

module.exports = fetchCpppTenders;
