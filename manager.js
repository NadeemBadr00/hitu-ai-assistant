/**
 * هذا الملف يحتوي على بيانات قادة الطلاب، اتحاد الطلاب، وإدارة جامعة حلوان التكنولوجية الدولية.
 * تم تنسيقه ككائن JavaScript (JSON) ليسهل على الأنظمة مثل Gemini chatbot
 * الوصول إلى معلومات الاتصال الخاصة بكل قائد.
 * تم تحديثه ليشمل الأسماء باللغة العربية وأرقام الهواتف ومسارات الصور.
 */

const studentLeadersData = {
  administration: {
    title: "إدارة الجامعة والكلية",

    universityPresident: {
      name: "الدكتور السيد قنديل",
      aliases: ["رئيس الجامعة", "سيد قنديل", "السيد إبراهيم محمد قنديل"],
      title: "رئيس جامعة حلوان",
      images: ["images/qandil.jpg", "images/qandil2.jpg"],
      details: "فنان تشكيلي وأكاديمي، يشغل منصب رئيس جامعة حلوان منذ عام 2022. حاصل على درجة الدكتوراه في الفنون الجميلة تخصص الجرافيك. تدرج في العديد من المناصب الأكاديمية أبرزها عميد كلية الفنون الجميلة بجامعة القاهرة، وقائم بعمل عميد كلية الفنون الجميلة بجامعة حلوان. له مسيرة فنية حافلة بالعديد من المعارض الخاصة والجماعية داخل مصر وخارجها، وهو حاصل على جائزة الدولة التشجيعية في الفنون."
    },

    universityVicePresident: {
      name: "الدكتور حسام الرفاعي",
      aliases: ["نائب رئيس الجامعة", "حسام محمد كمال رفاعى"],
      title: "نائب رئيس جامعة حلوان لشئون التعليم والطلاب",
      images: [],
      details: "يشغل منصب نائب رئيس الجامعة لشئون التعليم والطلاب، ومسؤول عن الشؤون الثقافية والرياضية والاجتماعية للطلاب. شغل سابقًا منصب نائب رئيس الجامعة لشؤون خدمة المجتمع وتنمية البيئة. لديه خبرة أكاديمية واسعة كأستاذ بقسم الإرشاد السياحي وعميد كلية السياحة والفنادق، ومدير مكتب ضمان الجودة بجامعة البحرين. يعمل كمنسق لبرامج ماجستير دولية مشتركة مع جامعات ألمانية."
    },

    collegeDean: {
      name: "دكتور أسامة القبيصي",
      aliases: ["اسامة القبيصي", "العميد", "عميد الكلية"],
      title: "عميد الكلية التكنولوجية بالقاهرة – جامعة حلوان التكنولوجية الدولية",
      images: ["images/Osama.jpg"],
      details: "خبير في تاريخ النسيج المصري، ويقود جهودًا لإحياء وتطوير حرفة النسيج اليدوي في مدينة أخميم. يسعى لدمج الهوية المصرية الأصيلة مع أساليب التصميم الحديثة لزيادة رواج المنتجات التراثية في الأسواق المحلية والعالمية."
    },
    collegeViceDean: {
      name: "الدكتور حلمي الزغبي",
      aliases: ["وكيل الكلية"],
      title: "وكيل الكلية التكنولوجية بالقاهرة",
      images: []
    },
    generalSupervisor: {
      name: "الاستاذ احمد صلاح",
      aliases: ["المشرف العام"],
      title: "المشرف العام على الكلية التكنولوجية بالقاهرة",
      images: []
    },
    deanSecretariat: {
      name: "الاستاذة ايمان وشيماء واسامة",
      title: "سكرتارية الدكتور اسامة القبيصي",
      images: []
    },
    youthWelfareOfficer: {
      name: "الاستاذة نورا",
      aliases: ["رعاية الشباب"],
      title: "مسؤولة رعاية الشباب",
      images: []
    }
  },
  studentUnion: {
    title: "اتحاد طلاب الجامعة",
    president: {
      name: "محمد عمرو",
      aliases: ["رئيس اتحاد الطلاب"],
      phone: "+201116076731",
      details: "رابعة ذكاء اصطناعي + شاعر",
      images: ["images/Moamr.jpg", "images/Moamr2.jpg"]
    },
    vicePresident: {
      name: "محمود خلف",
      aliases: ["نائب رئيس الاتحاد"],
      phone: "+201129464914",
      details: "تالتة ذكاء اصطناعي",
      images: ["images/khalaf.jpg"]
    },
    committees: {
      scientific: {
        title: "اللجنة العلمية",
        president: { name: "محمد عبد العزيز", phone: "+201012106358", details: "رابعة ذكاء اصطناعي", images: [], aliases: ["محمد احمد محمد عبدالعزيز"] },
        vicePresident: { name: "نديم محمد بدر", phone: "+201222977345", details: "تالتة ذكاء اصطناعي", images: ["images/Nadeem.jpg"], aliases: ["نديم بدر"] }
      },
      technical: {
        title: "اللجنة الفنية",
        president: { name: "هاجر اسامة", phone: "+201112201781", details: "تانية امن سيبراني", images: [] },
        vicePresident: { name: "يوسف هشام وليم", phone: "+201204282078", details: "تالتة ذكاء اصطناعي", images: ["images/hesham.jpg"] }
      },
      cultural: {
        title: "اللجنة الثقافية",
        president: { name: "ابراهيم هشام", phone: "+201149591002", details: "تالتة امن سيبراني", images: ["images/ebrahim.jpg"] },
        vicePresident: { name: "محمد جميل", phone: "+201125673933", details: "تالتة ذكاء اصطناعي", images: ["images/gamel.jpg"] }
      },
      sports: {
        title: "اللجنة الرياضية",
        president: { name: "محمد عاشور حلمي", phone: "+201104166942", details: "تالتة امن سيبراني", images: [] },
        vicePresident: { name: "منى", phone: "+201151844597", details: "تالتة ميكاترونكس", images: [] }
      },
      scouting: {
        title: "لجنة الكشافة",
        president: { name: "مهند", phone: "+201152099464", details: "", images: [] },
        vicePresident: { name: "محمد شعبان", phone: "+201012106358", details: "رابعة ذكاء اصطناعي", images: [] }
      },
      families: {
        title: "لجنة الأسر",
        president: { name: "عمر خالد", phone: "+201124347685", details: "رابعة اوتوترونكس", images: [] },
        vicePresident: { name: "حسن سعيد", phone: "+201032644676", details: "تالتة ذكاء اصطناعي", images: ["images/hassan.jpg"] }
      },
      social: {
        title: "اللجنة الاجتماعية",
        president: { name: "يوسف يوسف", phone: "+201080499096", details: "", images: [] },
        vicePresident: { name: "عمر فوزي", phone: "+201011792820", details: "تانية ميكاترونكس", images: [] }
      }
    }
  },
  studentUnionOrganizers: {
    title: "منظمين اتحاد الطلاب",
    medicalCheckupContact: {
      name: "يوسف اسامه حسن سليم (تيتو)",
      role: "احد منظمين الاتحاد",
      details: "مسؤول عن استفسارات الكشف الطبي للطلاب الجدد - الفرقه الثانيه قسم ذكاء اصطناعي",
      phone: "+201156042516",
      images: ["images/teto.jpg", "images/teto2.jpg"]
    },
    paymentContact: {
      name: "علي السعيد علي متولي عرب",
      role: "احد منظمين اتحاد الطلاب",
      details: "مسؤول عن استفسارات دفع المصاريف - الفرقه الثانيه قسم Data science",
      phone: "+201552246558",
      images: ["images/arab.jpg", "images/arab2.jpg"]
    }
  },
  departmentLeaders: {
    artificialIntelligence: {
      departmentName: "الذكاء الاصطناعي",
      fourthYear: { name: "زياد جامايكا", phone: "+201276044436", images: ["images/jamaija.jpg"] },
      thirdYear: { name: "نديم بدر", phone: "+201222977345", images: ["images/Nadeem.jpg"], aliases: ["نديم محمد بدر"] },
      secondYear: { name: "عاصم حاتم", phone: "+201204804966", images: ["images/assem.jpg"] }
    },
    dataScience: {
      departmentName: "علوم البيانات",
      fourthYear: { name: "عمر جدو (OGY)", phone: "+201098034093", images: ["images/gomaa.jpg"] },
      thirdYear: { name: "محمد هاني", phone: "+201155676429", images: ["images/hany.jpg"] },
      secondYear: { name: "نور عماد", phone: "+201207082127", images: ["images/nour.jpg"] }
    },
    cyberSecurity: {
      departmentName: "الأمن السيبراني",
      fourthYear: { name: "فكري", phone: "+201002113973", images: [] },
      thirdYear: { name: "أندرو ممدوح", phone: "+201200517894", images: ["images/andrew.jpg"] },
      secondYear: { name: "يوسف حمدي", phone: "+201011233662", images: [] }
    },
    mechatronics: {
      departmentName: "الميكاترونكس",
      fourthYear: { name: "زياد سنوسي", phone: "+201122080023", images: [] },
      thirdYear: { name: "معاذ", phone: "+201029755003", images: [] },
      secondYear: { name: "جمال", phone: "+201003368870", images: [] }
    },
    autotronics: {
      departmentName: "الأوتوترونكس",
      fourthYear: { name: "إسلام جمعة", phone: "+201011550294", images: [] },
      thirdYear: { name: "علي دوشة", phone: "+201272630822", images: [] },
      secondYear: { name: "إبراهيم محمد", phone: "+201149443778", images: [] }
    },
    industrialControl: {
      departmentName: "أنظمة التحكم الصناعي",
      fourthYear: { name: "كيمو", phone: "+201500488618", images: [] },
      thirdYear: { name: "سيف", phone: "+201125755890", images: [] },
      secondYear: { name: "أحمد محمد", phone: "+201044524426", images: [] }
    },
    readyMadeGarments: {
      departmentName: "تكنولوجيا صناعة الملابس الجاهزة",
      fourthYear: { name: "عبدالحميد محمد", phone: "+201010051665", images: [] },
      thirdYear: { name: "محمود محمد", phone: "+201113323781", images: [] },
      secondYear: { name: "رحمة", phone: "+201129246663", images: [] }
    }
  }
};

/**
 * دالة لتصدير كل بيانات الإدارة وقادة الطلاب.
 * @returns {object} The complete student leaders data object.
 */
export function getStudentLeadersInfo() {
  return studentLeadersData;
}

/**
 * [إضافة جديدة] دالة لتجهيز نص صريح بمعلومات منظمي الاتحاد.
 * هذا النص المباشر يسهل على النموذج اللغوي إيجاد المعلومة بسرعة.
 * @returns {string} A formatted string with organizers' contact info.
 */
export function getStudentOrganizersInfoText() {
  const organizers = studentLeadersData.studentUnionOrganizers;
  const medical = organizers.medicalCheckupContact;
  const payment = organizers.paymentContact;

  return `
### معلومات عن منظمين الاتحاد (للاستفسارات الهامة)

**للاستفسارات عن الكشف الطبي للطلاب الجدد:**
- **الاسم:** ${medical.name}
- **الدور:** ${medical.role}
- **التفاصيل:** ${medical.details}
- **رقم الهاتف:** ${medical.phone}

**للاستفسارات عن دفع المصروفات:**
- **الاسم:** ${payment.name}
- **الدور:** ${payment.role}
- **التفاصيل:** ${payment.details}
- **رقم الهاتف:** ${payment.phone}
`;
}

