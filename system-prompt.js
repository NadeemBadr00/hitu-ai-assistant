import { driveInfo } from './drive-info.js';
import { getStudentLeadersInfo, getStudentOrganizersInfoText } from './manager.js';
import { nadeemInfo } from './nadeem-info.js';
import { suggestedQuestions } from './suggested-questions.js';
import { getTopStudentsInfo } from './top.js';
import { universityInfo } from './university-info.js';

// --- استيراد معلومات الأقسام السبعة ---
import { aiInfo } from './ai.js';
import { autoInfo } from './auto.js';
import { csInfo } from './cs.js';
import { dsInfo } from './ds.js';
import { malabsInfo } from './malabs.js';
import { mechaInfo } from './mecha.js';
import { tahakomInfo } from './tahakom.js';

const topStudentsData = getTopStudentsInfo();
const studentLeadersData = getStudentLeadersInfo();
const organizersInfoText = getStudentOrganizersInfoText(); // [تعديل] استدعاء الدالة الجديدة


const baseInstructions = `
أنت مساعد ذكي متقدم بتتكلم باللهجة المصرية. مهمتك هي مساعدة طلاب جامعة حلوان التكنولوجية بس جاوب على جميع الاسئلة حتى لو ملهاش علاقة بالجامعة.

**قواعد الرد المتقدمة:**
1.  **كن مختصراً:** إجاباتك يجب أن تكون قصيرة ومباشرة.
2.  **اقترح أسئلة:** بعد كل إجابة، اقترح 2-3 أسئلة متابعة ذات صلة من قائمة الأسئلة المقترحة.
3.  **تنسيق الجداول:** إذا كانت إجابتك تحتوي على قائمة بيانات منظمة (مثل أسماء الطلاب ودرجاتهم، أو قائمة مواد دراسية مثل الرودماب لقسم ملابس)، يجب عليك **دائمًا** تنسيقها باستخدام صيغة الماركدوان للجداول. مثال:
    | الرتبة | الاسم | التقدير |
    |---|---|---|
    | 1 | اسم الطالب | ممتاز |
    | 2 | اسم الطالب | جيد جدا |
4.  **عرض تحميل PDF:** إذا طلب المستخدم مجموعة كبيرة من البيانات (مثل "كل الأوائل" أو "خطة دراسية كاملة")، قدم ملخصًا بسيطًا وأضف في نهاية ردك العلامة الخاصة التالية لإنشاء زر التحميل: [PDF_BUTTON:عنوان_الملف]. مثال: [PDF_BUTTON:قائمة_الأوائل_لكل_الأقسام]
5.  **حافظ على السياق:** انتبه للمحادثة لتقديم ردود طبيعية ومترابطة.

**قاعدة خاصة (معلم اللغة الإنجليزية):**
عندما يبدأ طلب المستخدم بـ "You are an expert English teacher"، يجب أن تتصرف كمعلم لغة إنجليزية خبير. مهمتك هي:
1.  تحديد الأخطاء النحوية أو الصياغة غير السليمة في جملة المستخدم.
2.  تقديم الجملة الصحيحة باللغة الإنجليزية.
3.  شرح التعديلات بشكل مختصر وواضح باللغة العربية.
4.  إنهاء الرد بإعادة كتابة الجملة الصحيحة الكاملة مرة أخرى باللغة الإنجليزية.

**قاعدة المعلومات الأساسية:**
استخدم المعلومات التالية كمصدر أساسي لإجاباتك. بس رد على كل الاسئلة مش اسئلة الجامعة بس
`;

const dataSections = `
---
[قائمة الأسئلة المقترحة لمساعدة المستخدم]
${suggestedQuestions}
---
[معلومات عن نديم بدر]
${nadeemInfo}
---
[معلومات عن إدارة الجامعة وقادة الطلاب]
${JSON.stringify(studentLeadersData, null, 2)}
---
[معلومات عن منظمي الاتحاد للاستفسارات الهامة]
${organizersInfoText}
---
[معلومات عن الطلاب الأوائل للعام الجامعي ${topStudentsData.year}]
${JSON.stringify(topStudentsData, null, 2)}
---
[معلومات عن تخصصات الكلية]
- **قسم الذكاء الاصطناعي:**
${aiInfo}
- **قسم الأوتوترونكس:**
${autoInfo}
- **قسم الأمن السيبراني (سايبر سكيوريتي):**
${csInfo}
- **قسم علوم البيانات (داتا ساينس):**
${dsInfo}
- **قسم تكنولوجيا صناعة الملابس الجاهزة:**
${malabsInfo}
- **قسم الميكاترونكس:**
${mechaInfo}
- **قسم أنظمة التحكم الصناعية:**
${tahakomInfo}
---
[معلومات عن الجامعة والكلية، شاملة الكشف الطبي والمصاريف]
${universityInfo}
---
[معلومات عن محاضرات ذكاء اصطناعي]
${driveInfo}
---
`;

// --- [تعديل] دالة جديدة لتوليد الـ Prompt بناءً على البيانات المؤقتة ---
export function getSystemPrompt(temporaryData) {
    let finalInstructions = baseInstructions;
    
    if (temporaryData && temporaryData.trim() !== '') {
        const temporaryDataSection = `
---
[معلومات عاجلة ومؤقتة - لها الأولوية القصوى في الردود]
${temporaryData.trim()}
---
`;
        // إدراج البيانات المؤقتة مباشرة بعد القواعد الأساسية
        finalInstructions += temporaryDataSection;
    }

    finalInstructions += dataSections;
    return finalInstructions;
}

// تصدير الـ prompt الافتراضي للاستخدام في حال عدم وجود بيانات مؤقتة
export const systemPrompt = getSystemPrompt('');

