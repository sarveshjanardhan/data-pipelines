export const enum CONFIG {
COOKIE_URL = 'https://www.nseindia.com/market-data/pre-open-market-cm-and-emerge-market',
API_URL = 'https://www.nseindia.com/api/equity-stockIndices?csv=true&index=NIFTY%20500&selectValFormat=crores',
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
//somehow user-agent is needed for post market data and not pre market data. find this header as per your settings. 
}

export interface CookieInterface {
    name: string;
    value: string
}