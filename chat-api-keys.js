/**
 * هذا الملف يحتوي على قائمة مفاتيح API الخاصة بك ويديرها.
 * This file contains and manages your list of API keys.
 */

// قائمة مفاتيح API الخاصة بك. يمكنك إضافة أو إزالة المفاتيح هنا.
// Your list of API keys. You can add or remove keys here.
const apiKeys = [
    "AIzaSyBMdu5xEUCs-QE7u49rjHdFZYGeMJMC_Tk",
    "AIzaSyDngozc3tFYKVZHk3NRNCy4rrl1geEp0n4", 
    "AIzaSyAhE7K0v4R7fzPemP-2FVtK_14N57RaC3g",
    "AIzaSyA0nv6qsVyLpvUQdytqUjqjGQfj4zGciYk",
    "AIzaSyD4cnNRkh482o07U3HfoDuYX3A71xkz8z8",
    "AIzaSyAjS_A3LuFs-1oI255mFDn2rL7Eto5c9I0",
    "AIzaSyCkBBjXLs-lKAfwbdZcACZJ79C_CNjzENs",
    "AIzaSyB8Dg7alT2cEWtRCuTj37MkCrqg6f-z9MY",
    "AIzaSyC1zY8mEfG6wUCBE9MccyA_gtMPQEtenIY",
    "AIzaSyDno6x2_85j79UnsfjN7AnoaA9uidsjppM",
    "AIzaSyBtjJO4hWnA-YCmQdaUuqiqLkt18YAL7_I",
    "AIzaSyA6W2S0e5uJI3Uw5rHQoWjr2i_Qy6YQVzg",
    "AIzaSyBeivg37E6dehHPWp85SsHtN1N0o-MUB8Q",
    "AIzaSyDx-f4Ms0J9ZIwUINavmMuIFnBtgi7Bk1E",
    "AIzaSyDn6aa1RS2gHDwi0tPZZsi4AsJVd3vEW-Y",
    "AIzaSyBStP5ltrP8k88TyaP8NdV1DRD24byzM8E",
    "AIzaSyDVFCnfF9se6nE3bwIhIQOu91_HLxpfZDY",
    "AIzaSyCC7QY0D1mBzMgDymahmqriw_t-Q1RgEUo",
    "AIzaSyBEj0kvZTSrHPvwZAQLiiio0DQYBoGugVU",
    "AIzaSyB_mbku4fzxrStOwLdtGDyALYpPmZZz2WE",
    "AIzaSyDAxnpdAta5N78jy6pQDgsHaE5rjXDfJ4s",
    "AIzaSyDsL1KCgookMuWlFP1Zk8wf2w91HDo9LzY",
    "AIzaSyB-ooWktZ4UffBZgl3ScpK50yywdRV5YtU",
    "AIzaSyC093aL2JapVjTy_09iD7aeVpREoP1Ea1o",
    "AIzaSyCkuvWA16ky5xNMmZShvIq-EO_zO3_kIy4",
    "AIzaSyA0PGYnOVunEuUJHIEPcAZoHeszwaYzLBI",
    "AIzaSyCTtc0P7C5XczrB0u5shYTeK2HfgqMAAiU",
    "AIzaSyAfche8yDzTKtj92-WQoek_yvpXuTgzMoo",
    "AIzaSyCJmHFF_jdG-iHDx7T_lcT4a3gg--iQNWA",
    "AIzaSyA_OorLkiCcBmUEVTg7ArRMFbzNZavblus"
  ];

let currentIndex = 0;

/**
 * مدير مفاتيح API للتبديل بينها بشكل دائري ومعالجة الأخطاء.
 * API key manager to cycle through keys and handle errors.
 */
export const apiKeyManager = {
    /**
     * يحصل على مفتاح API التالي في القائمة.
     * Gets the next API key in the list.
     * @returns {string} The next API key.
     */
    getNextKey: () => {
        // احصل على المفتاح الحالي
        const key = apiKeys[currentIndex];
        // انتقل إلى المفتاح التالي للاستخدام في المرة القادمة
        currentIndex = (currentIndex + 1) % apiKeys.length;
        return key;
    },

    /**
     * يُرجع عدد المفاتيح الإجمالي المتاح.
     * Returns the total number of available keys.
     * @returns {number} The total number of keys.
     */
    getTotalKeys: () => apiKeys.length
};
