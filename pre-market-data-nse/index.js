const { Builder, By } = require("selenium-webdriver");
const { API_URL, COOKIE_URL } = require("./constants");
const fs = require("fs");

let livePreOpenTimeText;
async function fetchData() {
  const cookies = await getCookies();
  const response = await fetch(API_URL, {
    headers: {
      cookie: cookies,
    },
    method: "GET",
  });

  const csvText = await response.text();
  const fileName = livePreOpenTimeText || `ERROR_${new Date().toDateString()}`;
  const filePath = `/Users/sarveshjnikas1/Desktop/ml/Data/pre-market-data/${fileName}.csv`;
  await saveDataToFile(csvText, filePath);
}

async function getCookies() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get(COOKIE_URL);
  let cookies = await driver.manage().getCookies();
  let combinedCookieString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  await delay(10000);

  const livePreOpenTimeElement = await driver.findElement(
    By.id("livepreOpenTime")
  );
  livePreOpenTimeText = (await livePreOpenTimeElement.getText()).split(" ")[0];
  
  await driver.quit();
  return combinedCookieString;
}

async function saveDataToFile(csvText, filePath) {
  const cleanedCsvText = await cleanCsv(csvText);
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(cleanedCsvText, "utf-8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    writeStream.end();
  });
}

async function cleanCsv(csvText) {
  const removeCommasDashes = await removeCommasAndDashes(csvText);
  return removeCommasDashes;
}

async function removeCommasAndDashes(csvText) {
  const removedCommasText = csvText.replace(/(\d),(?=\d)/g, "$1");
  const removedDashes = removedCommasText.replace(/(?<!\w)-(?!\w)/g, "");
  return removedDashes;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

fetchData();
