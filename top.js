/**
 * هذا الملف يحتوي على بيانات الطلاب الأوائل في جامعة حلوان التكنولوجية الدولية
 * للعام الجامعي 2024 / 2025.
 * تم تنسيقه ككائن JavaScript (JSON) ليسهل على الأنظمة مثل Gemini chatbot
 * قراءة ومعالجة المعلومات بشكل دقيق.
 */

const topStudentsData = {
  year: "2024 / 2025",
  announcement: "تتقدَّم إدارة الكلية والجامعة بخالص التهنئة والتقدير لأبنائنا المتفوقين أوائل العام الجامعي 2024 / 2025 من جميع الأقسام العلمية، الذين أثبتوا بتفوقهم وتميّزهم أن الإرادة والاجتهاد هما طريق الريادة.",
  levels: {
    thirdYear: {
      dataScience: [
        { rank: 1, name: "جون رزيق عزيز جرجس", totalScore: 1408, percentage: 88, grade: "ممتاز" },
        { rank: 2, name: "زينب محمد رضوان عبد الجواد", totalScore: 1402, percentage: 87.62, grade: "ممتاز" },
        { rank: 3, name: "شهد يحيي محمد عبد العال", totalScore: 1399, percentage: 87.43, grade: "ممتاز" },
        { rank: 4, name: "محمد ابراهيم محمد ابراهيم محمد", totalScore: 1376, percentage: 86, grade: "ممتاز" },
        { rank: 5, name: "ريمون فايز نسيم عيد", totalScore: 1354, percentage: 84.62, grade: "جيدجدا" },
        { rank: 6, name: "عمر احمد عبد المنعم عبد الوهاب", totalScore: 1354, percentage: 84.62, grade: "جيدجدا" },
        { rank: 7, name: "حبيبه سعيد السيد احمد", totalScore: 1341, percentage: 83.81, grade: "جيدجدا" },
        { rank: 8, name: "احمد محمد إبراهيم عبد الصادق", totalScore: 1336, percentage: 83.5, grade: "جيدجدا" },
        { rank: 9, name: "محمد ابو العال رجب محفوظ", totalScore: 1336, percentage: 83.5, grade: "جيدجدا" },
        { rank: 10, name: "علي موسي علي السيد العرمان", totalScore: 1325, percentage: 82.81, grade: "جيدجدا" }
      ],
      cyberSecurity: [
        { rank: 1, name: "ردينه محمد الهادى محمود عثمان", totalScore: 1450, percentage: 90.62, grade: "ممتاز" },
        { rank: 2, name: "امنيه حلمى محمد حلمى بيومى", totalScore: 1447, percentage: 90.43, grade: "ممتاز" },
        { rank: 3, name: "ماريز ايهاب سمير غالى", totalScore: 1447, percentage: 90.43, grade: "ممتاز" },
        { rank: 4, name: "شهد باهر حسين محمد", totalScore: 1433, percentage: 89.56, grade: "ممتاز" },
        { rank: 5, name: "ريم امين محمود اسماعيل يوسف", totalScore: 1429, percentage: 89.31, grade: "ممتاز" },
        { rank: 6, name: "عمر خالد ابو الفتوح عبد المجيد", totalScore: 1420, percentage: 88.75, grade: "ممتاز" },
        { rank: 7, name: "محمد احمد فكرى على", totalScore: 1414, percentage: 88.37, grade: "ممتاز" },
        { rank: 8, name: "فهد احمد فضل محمود", totalScore: 1409, percentage: 88.06, grade: "ممتاز" },
        { rank: 9, name: "مهند وليد الشحات احمد سيد احمد", totalScore: 1398, percentage: 87.37, grade: "ممتاز" },
        { rank: 10, name: "اسالم خالد رمضان عبد العزيز", totalScore: 1395, percentage: 87.18, grade: "ممتاز" }
      ],
      artificialIntelligence: [
        { rank: 1, name: "هاجر محمود بركات تغيان", totalScore: 1522, percentage: 95.12, grade: "ممتاز" },
        { rank: 2, name: "محمد عمرو محمد كامل", totalScore: 1481, percentage: 92.56, grade: "ممتاز" },
        { rank: 3, name: "يوستينا سامى ثابت هارون", totalScore: 1480, percentage: 92.5, grade: "ممتاز" },
        { rank: 4, name: "هاجر سليمان حمدان سليمان", totalScore: 1478, percentage: 92.37, grade: "ممتاز" },
        { rank: 5, name: "احمد وليد عبد الغفار عبد الوهاب الديب", totalScore: 1473, percentage: 92.06, grade: "ممتاز" },
        { rank: 6, name: "ملك محمد عبد الحميد محمد", totalScore: 1462, percentage: 91.37, grade: "ممتاز" },
        { rank: 7, name: "مروه احمد عبد الدايم شحاته", totalScore: 1461, percentage: 91.31, grade: "ممتاز" },
        { rank: 8, name: "احمد امين عبد النبى امين", totalScore: 1452, percentage: 90.75, grade: "ممتاز" },
        { rank: 9, name: "زياد سيد محمد احمد علي", totalScore: 1441, percentage: 90.06, grade: "ممتاز" },
        { rank: 10, name: "احمد محمد رمضان السيد", totalScore: 1440, percentage: 90, grade: "ممتاز" }
      ],
      garmentIndustryTech: [
        { rank: 1, name: "عماد صبرى عبد اللطيف محمود", totalScore: 1542, percentage: 96.37, grade: "ممتاز" },
        { rank: 2, name: "محمد حسن حامد عثمان سيد احمد", totalScore: 1541, percentage: 96.31, grade: "ممتاز" },
        { rank: 3, name: "مصطفي ايمن انبساط خليل", totalScore: 1509, percentage: 94.31, grade: "ممتاز" },
        { rank: 4, name: "محمد مصطفى عشرى عبد المقصود", totalScore: 1473, percentage: 92.06, grade: "ممتاز" },
        { rank: 5, name: "االء اشرف عبد الفتاح فرج", totalScore: 1469, percentage: 91.81, grade: "ممتاز" },
        { rank: 6, name: "احمد جمال احمد محمد عبد الجليل", totalScore: 1452, percentage: 90.75, grade: "ممتاز" },
        { rank: 7, name: "احمد محمد محمود بهنسى", totalScore: 1450, percentage: 90.62, grade: "ممتاز" },
        { rank: 8, name: "احمد سالمه عبد العظيم محمد", totalScore: 1449, percentage: 90.56, grade: "ممتاز" },
        { rank: 9, name: "عبد العزيز صبرى عبد العزيز عطيه", totalScore: 1449, percentage: 90.56, grade: "ممتاز" },
        { rank: 10, name: "احمد شحات على امين عبد اللطيف حمزه", totalScore: 1442, percentage: 90.12, grade: "ممتاز" }
      ],
      industrialControlSystems: [
        { rank: 1, name: "احمد محمود محمد فتيان", totalScore: 1445, percentage: 90.31, grade: "ممتاز" },
        { rank: 2, name: "عبد هللا شحاته محمود نصار", totalScore: 1431, percentage: 89.43, grade: "ممتاز" },
        { rank: 3, name: "احمد محمد محمود راغب", totalScore: 1401, percentage: 87.56, grade: "ممتاز" },
        { rank: 4, name: "احمد سمير عبد العزيز محمد الطيار", totalScore: 1398, percentage: 87.37, grade: "ممتاز" },
        { rank: 5, name: "عبد الرحمن رضا حسن مبروك", totalScore: 1377, percentage: 86.06, grade: "ممتاز" },
        { rank: 6, name: "االء سعد السيد السيد", totalScore: 1367, percentage: 85.43, grade: "ممتاز" },
        { rank: 7, name: "احمد عبد النبى ظاهر احمد خليل", totalScore: 1339, percentage: 83.68, grade: "جيدجدا" },
        { rank: 8, name: "احمد كمال مشحوت احمد", totalScore: 1335, percentage: 83.43, grade: "جيدجدا" },
        { rank: 9, name: "عمرو خيرى عباس شلبى", totalScore: 1333, percentage: 83.31, grade: "جيدجدا" },
        { rank: 10, name: "عبد الرحمن محمد محمد البوسطى", totalScore: 1329, percentage: 83.06, grade: "جيدجدا" }
      ],
      autotronics: [
        { rank: 1, name: "يوسف محمد حسن السيد", totalScore: 1543, percentage: 96.43, grade: "ممتاز" },
        { rank: 2, name: "عبد الرحمن اسامه محمد بكر", totalScore: 1512, percentage: 94.5, grade: "ممتاز" },
        { rank: 3, name: "مصطفي هشام جبريل محمد", totalScore: 1507, percentage: 94.18, grade: "ممتاز" },
        { rank: 4, name: "حسين سيد عبد المغنى عبد الهادى عبد الفتاح", totalScore: 1465, percentage: 91.56, grade: "ممتاز" },
        { rank: 5, name: "ماريا ماهر سعيد حبيب", totalScore: 1456, percentage: 91, grade: "ممتاز" },
        { rank: 6, name: "سلمى احمد عبد المنعم المزين", totalScore: 1455, percentage: 90.93, grade: "ممتاز" },
        { rank: 7, name: "بدور محمود ظاهر على حسن", totalScore: 1429, percentage: 89.31, grade: "ممتاز" },
        { rank: 8, name: "هدير خليل محمد خليل", totalScore: 1422, percentage: 88.87, grade: "ممتاز" },
        { rank: 9, name: "يوسف محمد احمد احمد حسين", totalScore: 1402, percentage: 87.62, grade: "ممتاز" },
        { rank: 10, name: "منه هللا عبد الهادي احمد عباس", totalScore: 1385, percentage: 86.56, grade: "ممتاز" }
      ],
      mechatronics: [
        { rank: 1, name: "عبد هللا عادل عبده عبد القادر", totalScore: 1476, percentage: 92.25, grade: "ممتاز" },
        { rank: 2, name: "احمد احمد زغلول على", totalScore: 1467, percentage: 91.68, grade: "ممتاز" },
        { rank: 3, name: "ياسمين محمود حسن ابوزيد", totalScore: 1465, percentage: 91.56, grade: "ممتاز" },
        { rank: 4, name: "روزان محمود احمد سليمان", totalScore: 1461, percentage: 91.31, grade: "ممتاز" },
        { rank: 5, name: "زياد محمد عبد ربه توفيق", totalScore: 1453, percentage: 90.81, grade: "ممتاز" },
        { rank: 6, name: "محمد ايمن محمد السيد", totalScore: 1449, percentage: 90.56, grade: "ممتاز" },
        { rank: 7, name: "ايه وحيد السيد شحاته", totalScore: 1441, percentage: 90.06, grade: "ممتاز" },
        { rank: 8, name: "عبد الرحمن صبرى كمال محمد", totalScore: 1441, percentage: 90.06, grade: "ممتاز" },
        { rank: 9, name: "اسراء اشرف صالح محمد الديب", totalScore: 1436, percentage: 89.75, grade: "ممتاز" },
        { rank: 10, name: "روان ابراهيم دسوقى ابراهيم على", totalScore: 1435, percentage: 89.68, grade: "ممتاز" }
      ]
    },
    secondYear: {
      dataScience: [
        { rank: 1, name: "مازن عبدالرحيم محمد عثمان", totalScore: 1577, percentage: 92.76, grade: "ممتاز" },
        { rank: 2, name: "محمد هانى مصطفى عبدالرحمن مصطفى", totalScore: 1520, percentage: 89.41, grade: "ممتاز" },
        { rank: 3, name: "ماركو عادل فهيم ابراهيم", totalScore: 1506, percentage: 88.58, grade: "ممتاز" },
        { rank: 4, name: "احمد حمدتو على مغازى", totalScore: 1489, percentage: 87.58, grade: "ممتاز" },
        { rank: 5, name: "احمد محمد مختار مصطفى", totalScore: 1477, percentage: 86.88, grade: "ممتاز" },
        { rank: 6, name: "يوحنا جورج يعقوب ابراهيم", totalScore: 1469, percentage: 86.41, grade: "ممتاز" },
        { rank: 7, name: "مصطفى مجدى عبدالحميد رمضان", totalScore: 1462, percentage: 86, grade: "ممتاز" },
        { rank: 8, name: "انجيل عاطف ميالد تكال", totalScore: 1441, percentage: 84.76, grade: "جيدجدا" },
        { rank: 9, name: "احمد محمد حامد الدرسي", totalScore: 1433, percentage: 84.29, grade: "جيدجدا" },
        { rank: 10, name: "محمد محمد احمد محمد حسن", totalScore: 1426, percentage: 83.88, grade: "جيدجدا" }
      ],
      cyberSecurity: [
        { rank: 1, name: "على اكرم عبدالمحسن السيد", totalScore: 1569, percentage: 92.29, grade: "ممتاز" },
        { rank: 2, name: "ابراهيم هشام عوض امام جويد", totalScore: 1550, percentage: 91.17, grade: "ممتاز" },
        { rank: 3, name: "أحمد وليد محمد محمود", totalScore: 1549, percentage: 91.11, grade: "ممتاز" },
        { rank: 4, name: "عبد الباسط محمد عبد الباسط سيد", totalScore: 1535, percentage: 90.29, grade: "ممتاز" },
        { rank: 5, name: "حسين احمد محمد دردير محمد", totalScore: 1529, percentage: 89.94, grade: "ممتاز" },
        { rank: 6, name: "اياد محمود على عبد الهادى حسين", totalScore: 1519, percentage: 89.35, grade: "ممتاز" },
        { rank: 7, name: "كريم طارق السيد محمد عبد العال", totalScore: 1510, percentage: 88.82, grade: "ممتاز" },
        { rank: 8, name: "حبيبة اسامة احمد مصطفي", totalScore: 1506, percentage: 88.58, grade: "ممتاز" },
        { rank: 9, name: "محمد السيد محمد عبد العال اسماعيل", totalScore: 1504, percentage: 88.47, grade: "ممتاز" },
        { rank: 10, name: "دميانه اكرم مالك حبيب عوض", totalScore: 1500, percentage: 88.23, grade: "ممتاز" }
      ],
      artificialIntelligence: [
        { rank: 1, name: "شهد رافت محمد على بخيت", totalScore: 1666, percentage: 95.2, grade: "ممتاز" },
        { rank: 2, name: "نديم محمد بدر الدين احمد", totalScore: 1655, percentage: 94.57, grade: "ممتاز" },
        { rank: 3, name: "يوسف هشام وليم عازر", totalScore: 1654, percentage: 94.51, grade: "ممتاز" },
        { rank: 4, name: "روان راضى حسن راضى عبد القادر", totalScore: 1629, percentage: 93.08, grade: "ممتاز" },
        { rank: 5, name: "حسن سعيد حسن علي", totalScore: 1623, percentage: 92.74, grade: "ممتاز" },
        { rank: 6, name: "فتحى محسن فتحى ابواليزيد", totalScore: 1620, percentage: 92.57, grade: "ممتاز" },
        { rank: 7, name: "احمد حسين فرج حسين", totalScore: 1619, percentage: 92.51, grade: "ممتاز" },
        { rank: 8, name: "جوليان اشرف كميل عبدالعالي", totalScore: 1615, percentage: 92.28, grade: "ممتاز" },
        { rank: 9, name: "سهيله سالمه عبدالرحمن محمد عبدالرحمن", totalScore: 1608, percentage: 91.88, grade: "ممتاز" },
        { rank: 10, name: "جنى هانى محمد شاكر مصطفى السواق", totalScore: 1602, percentage: 91.54, grade: "ممتاز" }
      ],
      garmentIndustryTech: [
        { rank: 1, name: "رودينا وائل عباس على", totalScore: 1508, percentage: 94.25, grade: "ممتاز" },
        { rank: 2, name: "مها جمال محمود سرحان", totalScore: 1496, percentage: 93.5, grade: "ممتاز" },
        { rank: 3, name: "عبدالرحمن صابر على مصلح على", totalScore: 1475, percentage: 92.18, grade: "ممتاز" },
        { rank: 4, name: "محمود محمد محمد على ابو هاشم", totalScore: 1462, percentage: 91.37, grade: "ممتاز" },
        { rank: 5, name: "عمر ممدوح محمد سنوسي", totalScore: 1422, percentage: 88.87, grade: "ممتاز" },
        { rank: 6, name: "هاله نسيم فؤاد عدلي", totalScore: 1418, percentage: 88.62, grade: "ممتاز" },
        { rank: 7, name: "يوسف محمد احمد محمد عيد", totalScore: 1398, percentage: 87.37, grade: "ممتاز" },
        { rank: 8, name: "عمار عبدهللا اسماعيل محمد", totalScore: 1377, percentage: 86.06, grade: "ممتاز" },
        { rank: 9, name: "سها هيسم احمد محمد عبدهللا", totalScore: 1376, percentage: 86, grade: "ممتاز" },
        { rank: 10, name: "محمد احمد سعيد سيد السمان", totalScore: 1373, percentage: 85.81, grade: "ممتاز" }
      ],
      industrialControlSystems: [
        { rank: 1, name: "كمال سعيد علي عيد عودة", totalScore: 1495, percentage: 93.43, grade: "ممتاز" },
        { rank: 2, name: "احمد عزت محمد واطفه", totalScore: 1426, percentage: 89.12, grade: "ممتاز" },
        { rank: 3, name: "عمر عبدالعزيز ركابى على", totalScore: 1395, percentage: 87.18, grade: "ممتاز" },
        { rank: 4, name: "ساره ميالد جاد هللا الجندى", totalScore: 1390, percentage: 86.87, grade: "ممتاز" },
        { rank: 5, name: "امنية زاهر رزق احمد االعرج", totalScore: 1370, percentage: 85.62, grade: "ممتاز" },
        { rank: 6, name: "محمد جمال ابووردة عليم", totalScore: 1367, percentage: 85.43, grade: "ممتاز" },
        { rank: 7, name: "محمد ابراهيم محمد محمد مصطفى", totalScore: 1365, percentage: 85.31, grade: "ممتاز" },
        { rank: 8, name: "مريم محمد عبدالعزيز محمد السيد", totalScore: 1364, percentage: 85.25, grade: "ممتاز" },
        { rank: 9, name: "اهداء عمرو السيد عبدالسالم خطاب", totalScore: 1361, percentage: 85.06, grade: "ممتاز" },
        { rank: 10, name: "يوسف محمد يوسف عبدهللا", totalScore: 1361, percentage: 85.06, grade: "ممتاز" }
      ],
      autotronics: [
        { rank: 1, name: "محمد ايمن عبدالمنعم محمد احمد", totalScore: 1479, percentage: 92.43, grade: "ممتاز" },
        { rank: 2, name: "محمد على خليل حسن", totalScore: 1455, percentage: 90.93, grade: "ممتاز" },
        { rank: 3, name: "اسماعيل على احمد اسماعيل", totalScore: 1407, percentage: 87.93, grade: "ممتاز" },
        { rank: 4, name: "عبدهللا احمد خضر محمد رمضان", totalScore: 1401, percentage: 87.56, grade: "ممتاز" },
        { rank: 5, name: "محمد عادل محمد صديق", totalScore: 1401, percentage: 87.56, grade: "ممتاز" },
        { rank: 6, name: "يوسف محمود محمد ندا محمد", totalScore: 1384, percentage: 86.5, grade: "ممتاز" },
        { rank: 7, name: "صبحى رفاعى صبحى رفاعى سالم شوشه", totalScore: 1382, percentage: 86.37, grade: "ممتاز" },
        { rank: 8, name: "محمد رضا محمد فرج فرج", totalScore: 1378, percentage: 86.12, grade: "ممتاز" },
        { rank: 9, name: "كيرلس سعيد رياض سعيد", totalScore: 1373, percentage: 85.81, grade: "ممتاز" },
        { rank: 10, name: "مينا هانى سعيد البير لطيف", totalScore: 1370, percentage: 85.62, grade: "ممتاز" }
      ],
      mechatronics: [
        { rank: 1, name: "مؤمن طارق خليل السيد", totalScore: 1549, percentage: 96.81, grade: "ممتاز" },
        { rank: 2, name: "ناصر عبدالرحمن ناصر عبدالالهى", totalScore: 1547, percentage: 96.68, grade: "ممتاز" },
        { rank: 3, name: "دميانه ظريف جميل غيطي", totalScore: 1540, percentage: 96.25, grade: "ممتاز" },
        { rank: 4, name: "مها يسري محمود ابو هنيدي", totalScore: 1535, percentage: 95.93, grade: "ممتاز" },
        { rank: 5, name: "رضوى وارف عبد الوهاب احمد", totalScore: 1509, percentage: 94.31, grade: "ممتاز" },
        { rank: 6, name: "مارينا الفونس عياد لوقا", totalScore: 1508, percentage: 94.25, grade: "ممتاز" },
        { rank: 7, name: "فاتن فريد شوقى على ابوشريده", totalScore: 1502, percentage: 93.87, grade: "ممتاز" },
        { rank: 8, name: "نوران محمد محمود ابراهيم محمد", totalScore: 1498, percentage: 93.62, grade: "ممتاز" },
        { rank: 9, name: "مازن احمد محمد محمد عبدالهادى", totalScore: 1495, percentage: 93.43, grade: "ممتاز" },
        { rank: 10, name: "كمال محمد كمال سعد عيسى", totalScore: 1488, percentage: 93, grade: "ممتاز" }
      ]
    },
    firstYear: {
      dataScience: [
        { rank: 1, name: "ثائر إبراهيم كامل حسن حبيب", totalScore: 1506, percentage: 94.12, grade: "ممتاز" },
        { rank: 2, name: "يوسف حسن عبدهللا علي احمد", totalScore: 1496, percentage: 93.5, grade: "ممتاز" },
        { rank: 3, name: "عمر احمد محمدى المليح", totalScore: 1465, percentage: 91.56, grade: "ممتاز" },
        { rank: 4, name: "احمد عماد سيد اسماعيل", totalScore: 1448, percentage: 90.5, grade: "ممتاز" },
        { rank: 5, name: "ايمان اشرف السيد ابوزيد حسين محمد سابق", totalScore: 1445, percentage: 90.31, grade: "ممتاز" },
        { rank: 6, name: "محمد جمال حسن محمد محمد ضيف", totalScore: 1445, percentage: 90.31, grade: "ممتاز" },
        { rank: 7, name: "يوسف محمد عبدالوهاب عثمان", totalScore: 1426, percentage: 89.12, grade: "ممتاز" },
        { rank: 8, name: "هاجر محمود صابر عطيه عبدالنبى", totalScore: 1422, percentage: 88.87, grade: "ممتاز" },
        { rank: 9, name: "رشيدى عماد رشيدى كردى", totalScore: 1400, percentage: 87.5, grade: "ممتاز" },
        { rank: 10, name: "زياد عبدالروؤف العبد السيد", totalScore: 1395, percentage: 87.18, grade: "ممتاز" }
      ],
      cyberSecurity: [
        { rank: 1, name: "فيلوباتير ميخائيل فارس اقالديوس", totalScore: 1537, percentage: 96.06, grade: "ممتاز" },
        { rank: 2, name: "منصور ابراهيم منصور أحمد عبدالجواد", totalScore: 1522, percentage: 95.12, grade: "ممتاز" },
        { rank: 3, name: "فاطمة حاتم غباشى عبدالعاطى ابوعطا", totalScore: 1502, percentage: 93.87, grade: "ممتاز" },
        { rank: 4, name: "مؤمن طارق الشربيني عبد المنعم الشربيني", totalScore: 1498, percentage: 93.62, grade: "ممتاز" },
        { rank: 5, name: "منه هللا جمعه اسماعيل ابراهيم", totalScore: 1496, percentage: 93.5, grade: "ممتاز" },
        { rank: 6, name: "يوسف ايمن جابر على", totalScore: 1496, percentage: 93.5, grade: "ممتاز" },
        { rank: 7, name: "حبيبه صالح الدين محمد شبل البيلى", totalScore: 1494, percentage: 93.37, grade: "ممتاز" },
        { rank: 8, name: "اياد محمد مصطفى امين", totalScore: 1492, percentage: 93.25, grade: "ممتاز" },
        { rank: 9, name: "زياد مصطفى عبدالفتاح ابراهيم", totalScore: 1491, percentage: 93.18, grade: "ممتاز" },
        { rank: 10, name: "منة هللا ماهر جوده احمد عبد الرحمن", totalScore: 1484, percentage: 92.75, grade: "ممتاز" }
      ],
      artificialIntelligence: [
        { rank: 1, name: "مصطفى عادل حماد ابراهيم", totalScore: 1547, percentage: 96.68, grade: "ممتاز" },
        { rank: 2, name: "فاطمه حسام فتحي عبد المقصود خلف هللا", totalScore: 1533, percentage: 95.81, grade: "ممتاز" },
        { rank: 3, name: "احمد عادل عبدالمنعم محمد سرور", totalScore: 1528, percentage: 95.5, grade: "ممتاز" },
        { rank: 4, name: "عبد الرحمن الحسين محمد موسى الننى", totalScore: 1527, percentage: 95.43, grade: "ممتاز" },
        { rank: 5, name: "ملك محمد صالح محمد داود", totalScore: 1514, percentage: 94.62, grade: "ممتاز" },
        { rank: 6, name: "يوسف هاني كامل ابراهيم ابو المجد", totalScore: 1511, percentage: 94.43, grade: "ممتاز" },
        { rank: 7, name: "عمرو الدسوقى توفيق احمد", totalScore: 1509, percentage: 94.31, grade: "ممتاز" },
        { rank: 8, name: "عمرو مدكور مخلوف جاد الكريم", totalScore: 1507, percentage: 94.18, grade: "ممتاز" },
        { rank: 9, name: "محمود محمد فؤاد عبدالغنى", totalScore: 1503, percentage: 93.93, grade: "ممتاز" },
        { rank: 10, name: "سدره سمير محمد ابراهيم", totalScore: 1502, percentage: 93.87, grade: "ممتاز" }
      ],
      garmentIndustryTech: [
        { rank: 1, name: "ملك وائل عبد المعطى ابراهيم", totalScore: 1545, percentage: 96.56, grade: "ممتاز" },
        { rank: 2, name: "ايه مختار مصطفى السيد محمد وهبه", totalScore: 1482, percentage: 92.62, grade: "ممتاز" },
        { rank: 3, name: "شروق محمد احمد حسن زغله", totalScore: 1468, percentage: 91.75, grade: "ممتاز" },
        { rank: 4, name: "فرح احمد محمد عبدالرحمن سالم", totalScore: 1467, percentage: 91.68, grade: "ممتاز" },
        { rank: 5, name: "شهد سعد علي سعد سليم", totalScore: 1456, percentage: 91, grade: "ممتاز" },
        { rank: 6, name: "بسنت اشرف احمد عبدالقادر فراج", totalScore: 1455, percentage: 90.93, grade: "ممتاز" },
        { rank: 7, name: "روان حسن ابراهيم عبدالمطلب السنتريسى", totalScore: 1444, percentage: 90.25, grade: "ممتاز" },
        { rank: 8, name: "مريم خالد شريف محمد", totalScore: 1437, percentage: 89.81, grade: "ممتاز" },
        { rank: 9, name: "مى احمد محمد احمد الكريدى", totalScore: 1428, percentage: 89.25, grade: "ممتاز" },
        { rank: 10, name: "ميار ابراهيم عبداللطيف ابراهيم منصور", totalScore: 1425, percentage: 89.06, grade: "ممتاز" }
      ],
      industrialControlSystems: [
        { rank: 1, name: "محمد احمد محمد شحاته السيد", totalScore: 1498, percentage: 93.62, grade: "ممتاز" },
        { rank: 2, name: "عبدالرحمن على بيومى حنفى", totalScore: 1489, percentage: 93.06, grade: "ممتاز" },
        { rank: 3, name: "محمد احمد فتحي علي", totalScore: 1488, percentage: 93, grade: "ممتاز" },
        { rank: 4, name: "حازم ياسر عبدالعال محمد محمد", totalScore: 1479, percentage: 92.43, grade: "ممتاز" },
        { rank: 5, name: "محمود احمد محمود محمد", totalScore: 1460, percentage: 91.25, grade: "ممتاز" },
        { rank: 6, name: "مريم سيد احمد سيد محمد", totalScore: 1445, percentage: 90.31, grade: "ممتاز" },
        { rank: 7, name: "مصطفى عيد مصطفى ابراهيم", totalScore: 1442, percentage: 90.12, grade: "ممتاز" },
        { rank: 8, name: "احمد سعيد سيد حامد عبدهللا", totalScore: 1434, percentage: 89.62, grade: "ممتاز" },
        { rank: 9, name: "يسى مكرم ناجى فؤاد جرجس", totalScore: 1432, percentage: 89.5, grade: "ممتاز" },
        { rank: 10, name: "ابراهيم محمد محمد محمد سيد احمد سالمه", totalScore: 1427, percentage: 89.18, grade: "ممتاز" }
      ],
      autotronics: [
        { rank: 1, name: "احمد جمال ممدوح حسن ابراهيم", totalScore: 1515, percentage: 94.68, grade: "ممتاز" },
        { rank: 2, name: "منه هللا قدرى رزق محمد رزق السيسى", totalScore: 1495, percentage: 93.43, grade: "ممتاز" },
        { rank: 3, name: "عمر عبدالنبى محمد محمد اللبان", totalScore: 1494, percentage: 93.37, grade: "ممتاز" },
        { rank: 4, name: "محمد خالد محمود عبدالعزيز محمود", totalScore: 1457, percentage: 91.06, grade: "ممتاز" },
        { rank: 5, name: "احمد قاسم السيد قاسم", totalScore: 1454, percentage: 90.87, grade: "ممتاز" },
        { rank: 6, name: "زياد محمد ناجح فرج عبدالناصر", totalScore: 1453, percentage: 90.81, grade: "ممتاز" },
        { rank: 7, name: "ابراهيم محمد حسن عبدالباسط", totalScore: 1449, percentage: 90.56, grade: "ممتاز" },
        { rank: 8, name: "معتز محمد عبدالمنعم احمد احمد هاشم", totalScore: 1431, percentage: 89.43, grade: "ممتاز" },
        { rank: 9, name: "عبدالرحمن محمد على حسين على", totalScore: 1424, percentage: 89, grade: "ممتاز" },
        { rank: 10, name: "عبدالرحمن انس مصيلحى صالح مصطفى", totalScore: 1418, percentage: 88.62, grade: "ممتاز" }
      ],
      mechatronics: [
        { rank: 1, name: "عبدهللا حسين عبدهللا رجب", totalScore: 1533, percentage: 95.81, grade: "ممتاز" },
        { rank: 2, name: "صفيه هشام مصطفى السعيد بدر", totalScore: 1529, percentage: 95.56, grade: "ممتاز" },
        { rank: 3, name: "زياد شعبان محمد محمد موسي", totalScore: 1523, percentage: 95.18, grade: "ممتاز" },
        { rank: 4, name: "لوجين هاني سيد احمد", totalScore: 1523, percentage: 95.18, grade: "ممتاز" },
        { rank: 5, name: "شيماء رضا عبدالمجيد عبدهللا جاد هللا", totalScore: 1521, percentage: 95.06, grade: "ممتاز" },
        { rank: 6, name: "عبير ايمن عيد فرج زهران", totalScore: 1506, percentage: 94.12, grade: "ممتاز" },
        { rank: 7, name: "يحيى خالد نعمان امين حسنين", totalScore: 1502, percentage: 93.87, grade: "ممتاز" },
        { rank: 8, name: "حازم نزيه على عبدالعزيز", totalScore: 1498, percentage: 93.62, grade: "ممتاز" },
        { rank: 9, name: "حسن عالء حسين انور", totalScore: 1497, percentage: 93.56, grade: "ممتاز" },
        { rank: 10, name: "جني احمد عبد النبي محمد الغوري", totalScore: 1494, percentage: 93.37, grade: "ممتاز" }
      ]
    }
  }
};

// يمكن استخدام هذه الدالة لتصدير كل البيانات للشاتبوت
export function getTopStudentsInfo() {
  return topStudentsData;
}
