/**
 * هذا الملف يحتوي على قائمة مفاتيح API الخاصة بك ويديرها.
 * This file contains and manages your list of API keys.
 */

// قائمة مفاتيح API الخاصة بك. يمكنك إضافة أو إزالة المفاتيح هنا.
// Your list of API keys. You can add or remove keys here.
const apiKeys = [       
    "AIzaSyDLnCHwiIwD02EHGBy_CLsscZ4dPMCNHwc",
    "AIzaSyCYo2P_S4qJsMRc0YEARnsxDNNNYze9v5A",
    "AIzaSyADUyYvlMfp2WxgquGR4AzdmgXbIQDxbE0",
    "AIzaSyDiHwnKVfAKJWcmsDJCpncJlGe72VOZLuM",
    "AIzaSyBrQ_CN3zK0hHXnYZri-cWKgnI6kvV_Drk",
    "AIzaSyC4JYl9BPiZciRiL3dasbJazUYGAw-JVNE",
    "AIzaSyDYGrljCh01gorEPQk1aXtIRiUnp0EN6fM",
    "AIzaSyDlLhk2fiU9-aN2SIxgmVWafHF77Z7r_Ec",
    "AIzaSyD3TFTBZ_tiIj3uHXYlMhERXNRuxRScZ_8",
    "AIzaSyBbBIzg-tJLRUkIPECvC_Tqe2eOsG2ZTmg",
    "AIzaSyDsL1KCgookMuWlFP1Zk8wf2w91HDo9LzY",
    "AIzaSyB-ooWktZ4UffBZgl3ScpK50yywdRV5YtU",
    "AIzaSyC093aL2JapVjTy_09iD7aeVpREoP1Ea1o",
    "AIzaSyCkuvWA16ky5xNMmZShvIq-EO_zO3_kIy4",
    "AIzaSyA0PGYnOVunEuUJHIEPcAZoHeszwaYzLBI",
    "AIzaSyCTtc0P7C5XczrB0u5shYTeK2HfgqMAAiU",
    "AIzaSyAfche8yDzTKtj92-WQoek_yvpXuTgzMoo",
    "AIzaSyCJmHFF_jdG-iHDx7T_lcT4a3gg--iQNWA",
    "AIzaSyA_OorLkiCcBmUEVTg7ArRMFbzNZavblus"];

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
