/**
 * هذا الملف يحتوي على قائمة مفاتيح API الخاصة بك ويديرها.
 * This file contains and manages your list of API keys.
 */

// قائمة مفاتيح API الخاصة بك. يمكنك إضافة أو إزالة المفاتيح هنا.
// Your list of API keys. You can add or remove keys here.
const apiKeys = [

    "AIzaSyBN3C93CB-Cog1SycjlGoLWgDzN4deYtoI",
    "AIzaSyD1tOVALG03EH2rj-pB7vP3nnVRd_qvZ3U",
    "AIzaSyC_7JP4WCxvmBeIuLcNQYg9ZA9Bgp9SiDQ",
    "AIzaSyB86pxAvG1BXy3g8D3C8oQ7VSivdxS3MbI",
    "AIzaSyDPGuCiNDbWF8D3rncXwv_EipMTMTcv4-I",
    "AIzaSyDcaT51JOe-0_4_H41xqSPPviHmWmMfxj8",
    "AIzaSyDb9V1vqXcilDJx8D2iHk52--sZhioeG2w",
    "AIzaSyB4-UD8LcVD7WCN_U2F9u4hqHaP_-BGmRk",
    "AIzaSyCzxAi7UxnvJFollr0lVaQMd8TfwHj__oo",
    "AIzaSyDl51ZgJjb5K1kzorMkzDu3PLjWMTMR_co",
    "AIzaSyDinruhBeVGIy_giyRtfyNnZ8fPxdRqpcE",
    "AIzaSyC1YC5FFYe16W0QpfAA1PCDmwSlULPYwQw",
    "AIzaSyDs1QUbBaAnuZpNcd20TQGg5imiBMYV5Jo",
    "AIzaSyCgWiKSkc_bnldCRAy130TXd5jWsg8qKHI",
    "AIzaSyD-SM2M0jOOP0BnwAJRbGd5HS3irqOFzqc",
    "AIzaSyAnJicjY8-aorsNe-tnf-sss5ZWT11cPVo",
    "AIzaSyCSB4fZ9QSURj-xl37HYqeNUSQUeAwdA2g",
    "AIzaSyDdGWI0svALRkqbZtub9UfBk9vvmF76OrM",
    "AIzaSyAoxmkZK8aLjNIWDiQczwTVMcEwJ76gxJw",
    "AIzaSyCceLxDnjyMAOPbo2JicvlD7K9_miPAQfE",
    "AIzaSyB2IzTFYPHQp0ctEa1iaoU82WbL09mKpvg",
    "AIzaSyC_FAGDSUL_vnIoprdsgPqvYppuKceJP2w",
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
