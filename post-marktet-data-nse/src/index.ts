import * as selenium from "selenium-webdriver"
import * as fs from 'fs';
import { CookieInterface, CONFIG } from './constants'
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

async function fetchData(): Promise<void> {
    try {
        const cookies = await getCookies();
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: CONFIG.API_URL as string,
            headers: {
                'cookie': cookies,
                'user-agent': CONFIG.USER_AGENT
            },
        };
        const response: AxiosResponse = await axios(config)
        const csvText: string = response.data
        const filePath: string = `post-data/${new Date().toDateString()}.csv`;
        await saveDataToFile(csvText, filePath);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getCookies(): Promise<string> {
    let driver = await new selenium.Builder().forBrowser("chrome").build();
    try {
        await driver.get(CONFIG.COOKIE_URL);
        const cookies: Array<CookieInterface> = await driver.manage().getCookies();
        const combinedCookieString: string = cookies.map((cookie: CookieInterface) => `${cookie.name}=${cookie.value}`).join("; ");
        return combinedCookieString;
    } finally {
        await driver.quit();
    }
}

async function saveDataToFile(csvText: string, filePath: string): Promise<void> {
    const cleanedCsvText = await cleanCsv(csvText);
    console.log(cleanedCsvText)
    const writeStream = fs.createWriteStream(filePath, { encoding: 'utf-8' });
    writeStream.write(cleanedCsvText, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data successfully written to file.');
        }
        writeStream.end();
    });
}

async function cleanCsv(csvText: string): Promise<string> {
    const removedCommasText = csvText.replace(/(\d),(?=\d)/g, "$1");
    const removedDashes = removedCommasText.replace(/(?<!\w)-(?!\w)/g, "");
    return removedDashes;
}

fetchData()