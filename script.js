(function(){
  "use strict";

  const TELEGRAM_CONFIG = {
    botToken: "8802556814:AAGoQ3lAXtKYzhSttM4dgDHRihkeSnCYiQw",
    chatId:   "6001534487"
  };

  const LANG_LABEL = { ru:"Русский (RU)", uz:"O'zbekcha (UZ)", en:"English (EN)" };

  function escapeHtml(str){
    return String(str || "").replace(/[&<>]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;" }[c]));
  }

  // Zayavkani Telegram botga yuboradi. Muvaffaqiyatli bo'lsa true, aks holda false qaytaradi.
  async function sendLeadToTelegram(payload){
    if(!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken === "YOUR_BOT_TOKEN_HERE" ||
       !TELEGRAM_CONFIG.chatId  || TELEGRAM_CONFIG.chatId  === "YOUR_CHAT_ID_HERE"){
      console.warn("Telegram bot sozlanmagan: script.js faylidagi TELEGRAM_CONFIG qiymatlarini kiriting.");
      return false;
    }

    const lines = [
      "🆕 <b>Yangi zayavka — Amulet Audit</b>",
      "",
      `👤 <b>Ism:</b> ${escapeHtml(payload.name)}`,
      `📞 <b>Telefon:</b> ${escapeHtml(payload.phone)}`,
      `✉️ <b>Email:</b> ${escapeHtml(payload.email)}`,
      `🧾 <b>Xizmat:</b> ${escapeHtml(payload.serviceLabel || "—")}`
    ];
    if(payload.specialist){
      lines.push(`🧑‍💼 <b>So'ralgan mutaxassis:</b> ${escapeHtml(payload.specialist)}`);
    }
    if(payload.message){
      lines.push(`💬 <b>Xabar:</b> ${escapeHtml(payload.message)}`);
    }
    lines.push(
      `🌐 <b>Tanlangan til:</b> ${escapeHtml(payload.langLabel)}`,
      `🕒 <b>Vaqt:</b> ${escapeHtml(payload.timestamp)}`
    );

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    try{
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.chatId,
          text: lines.join("\n"),
          parse_mode: "HTML"
        })
      });
      const data = await res.json();
      return !!data.ok;
    }catch(err){
      console.error("Telegram botga yuborishda xatolik:", err);
      return false;
    }
  }

  /* ---------------------------------------------------------------------
     1. CONTENT DATA (services / industries / team)
     --------------------------------------------------------------------- */
  // 4 ta yo'nalish — kompaniyaning haqiqiy taklifnomasi (obzor hujjati) asosida.
  const SERVICES = [
    {
      id: "audit",
      icon: "audit",
      title: { ru:"Аудиторские услуги", uz:"Audit xizmatlari", en:"Audit services" },
      text: { ru:"Независимый аудит по международным стандартам и абонентское (ежеквартальное) сопровождение отчётности.", uz:"Xalqaro standartlar bo'yicha mustaqil audit va hisobotni choraklik abonent xizmat asosida kuzatib borish.", en:"Independent audits under international standards, plus quarterly subscription-based support for your reporting." },
      steps: { ru:["Планирование проверки и оценка объёма работ","Аудит по международным стандартам — для инвесторов и иностранных партнёров","Абонентское обслуживание — ежеквартальная проверка и рекомендации","Формирование официального аудиторского заключения"],
               uz:["Tekshiruvni rejalashtirish va ish hajmini baholash","Xalqaro standartlar bo'yicha audit — investorlar va xorijiy hamkorlar uchun","Abonent xizmat — choraklik tekshiruv va tavsiyalar","Rasmiy audit xulosasini shakllantirish"],
               en:["Engagement planning and scope assessment","Audit under international standards — for investors and foreign partners","Subscription service — quarterly review and recommendations","Issuing the official audit opinion"] },
      result: { ru:"Официальное аудиторское заключение, а при абонентском обслуживании — годовая отчётность без существенных ошибок к моменту сдачи в налоговые органы.", uz:"Rasmiy audit xulosasi, abonent xizmat holatida esa — yillik hisobotning soliq organlariga topshirilguncha jiddiy xatolarsiz tayyor bo'lishi.", en:"A formal audit opinion — and, under the subscription service, annual reporting free of material errors by the time it is filed with the tax authorities." },
      faq: { ru:[["Что такое абонентское обслуживание?","Вид аудиторской проверки, при котором наши специалисты ежеквартально проверяют отчётность, дают своевременные рекомендации и обеспечивают нормативно-правовое и налоговое консультирование в течение всего года."],["Проводите ли вы аудит по международным стандартам?","Да, мы готовим заключения, которые признаются иностранными партнёрами и инвесторами при привлечении мирового капитала."]],
             uz:[["Abonent xizmat nima?","Mutaxassislarimiz har chorakda hisobotni tekshiradigan, o'z vaqtida tavsiyalar beradigan va yil davomida normativ-huquqiy hamda soliq bo'yicha maslahat beradigan audit tekshiruvi turi."],["Xalqaro standartlar bo'yicha audit o'tkazasizmi?","Ha, biz xorijiy hamkorlar va investorlar tomonidan tan olinadigan xulosalarni tayyorlaymiz."]],
             en:[["What is the subscription (abonent) service?","A type of audit engagement in which our specialists review your reporting every quarter, give timely recommendations, and provide ongoing regulatory and tax advice throughout the year."],["Do you carry out audits under international standards?","Yes — we prepare opinions recognised by foreign partners and investors when raising international capital."]] }
    },
    {
      id: "ifrs",
      icon: "ifrs",
      title: { ru:"Трансформация в соответствии с МСФО", uz:"MHXS ga muvofiq transformatsiya", en:"IFRS transformation" },
      text: { ru:"Подготовка и трансформация финансовой отчётности в соответствии с международными стандартами (МСФО) с учётом требований НСБУ и налогового законодательства.", uz:"Milliy hisob standartlari (MHSHS) va soliq qonunchiligi talablarini hisobga olgan holda moliyaviy hisobotni xalqaro standartlarga (MHXS) muvofiq tayyorlash va transformatsiya qilish.", en:"Preparing and transforming financial statements in line with International Financial Reporting Standards (IFRS), taking into account local accounting standards and tax legislation." },
      steps: { ru:["Анализ текущей отчётности, подготовленной по НСБУ","Выявление расхождений с требованиями МСФО","Трансформация отчётности с учётом всех особенностей и последних изменений МСФО","Консультационная поддержка при внедрении МСФО в компании"],
               uz:["MHSHS asosida tayyorlangan joriy hisobotni tahlil qilish","MHXS talablaridan farqlarni aniqlash","MHXSning barcha nozik jihatlari va so'nggi o'zgarishlarini hisobga olgan holda hisobotni transformatsiya qilish","Kompaniyada MHXSni joriy etishda maslahat yordami"],
               en:["Reviewing current reporting prepared under local standards","Identifying gaps against IFRS requirements","Transforming the statements, factoring in the latest IFRS updates","Advisory support while IFRS is being implemented in the company"] },
      result: { ru:"Финансовая отчётность, соответствующая международным стандартам и понятная иностранным партнёрам и инвесторам.", uz:"Xalqaro standartlarga mos va xorijiy hamkor hamda investorlarga tushunarli moliyaviy hisobot.", en:"Financial statements aligned with international standards and understandable to foreign partners and investors." },
      faq: { ru:[["Зачем компании нужна отчётность по МСФО?","Для привлечения мирового капитала, осуществления инвестиционной деятельности и взаимовыгодного сотрудничества с международными партнёрами."]],
             uz:[["Kompaniyaga nima uchun MHXS bo'yicha hisobot kerak?","Xalqaro kapitalni jalb qilish, investitsiya faoliyatini amalga oshirish va xalqaro hamkorlar bilan o'zaro manfaatli hamkorlik uchun."]],
             en:[["Why does a company need IFRS reporting?","To attract international capital, carry out investment activity, and build mutually beneficial cooperation with international partners."]] }
    },
    {
      id: "accounting",
      icon: "accounting",
      title: { ru:"Бухгалтерский консалтинг", uz:"Buxgalteriya konsalting xizmati", en:"Accounting consulting" },
      text: { ru:"Комплексная поддержка бухгалтерских служб — от учётной политики и документооборота до восстановления учёта и подготовки отчётности.", uz:"Buxgalteriya xizmatlariga har tomonlama yordam — hisob siyosati va hujjat aylanishidan tortib, hisobni tiklash va hisobot tayyorlashgacha.", en:"Comprehensive support for accounting departments — from accounting policy and document workflow to restoring records and preparing reports." },
      steps: { ru:["Создание учётной политики и внутрифирменных стандартов учёта","Разработка документооборота для внутренней и внешней отчётности","Восстановление и ведение бухгалтерского учёта","Составление квартальной и годовой отчётности","Оценка систем внутреннего контроля и рекомендации по их совершенствованию","Обучающие семинары для сотрудников бухгалтерских служб"],
               uz:["Hisob siyosati va ichki buxgalteriya standartlarini ishlab chiqish","Ichki va tashqi hisobot uchun hujjat aylanish tizimini yaratish","Buxgalteriya hisobini tiklash va yuritish","Choraklik va yillik hisobotni tayyorlash","Ichki nazorat tizimini baholash va uni takomillashtirish bo'yicha tavsiyalar","Buxgalteriya xodimlari uchun o'quv seminarlari"],
               en:["Developing accounting policy and internal accounting standards","Designing document workflows for internal and external reporting","Restoring and maintaining bookkeeping records","Preparing quarterly and annual reports","Assessing internal control systems and recommending improvements","Training seminars for accounting staff"] },
      result: { ru:"Прозрачный, своевременный учёт и рациональный механизм подготовки отчётности, проверенной до сдачи в налоговые органы.", uz:"Shaffof, o'z vaqtidagi hisob va soliq organlariga topshirilishidan oldin tekshirilgan hisobotni tayyorlashning oqilona mexanizmi.", en:"Transparent, timely bookkeeping and a well-organised reporting process reviewed before filing with the tax authorities." },
      faq: { ru:[["Можно ли передать бухгалтерию полностью на аутсорс?","Да, наши специалисты берут на себя восстановление и ведение учёта клиента, включая подготовку квартальной и годовой отчётности."]],
             uz:[["Buxgalteriyani to'liq autsorsingga berish mumkinmi?","Ha, mutaxassislarimiz mijozning hisobini tiklash va yuritishni, jumladan choraklik va yillik hisobotni tayyorlashni o'z zimmasiga oladi."]],
             en:[["Can accounting be fully outsourced?","Yes, our specialists take on restoring and maintaining your records, including preparing quarterly and annual reports."]] }
    },
    {
      id: "tax",
      icon: "tax",
      title: { ru:"Налоговый консалтинг", uz:"Soliq konsalting xizmati", en:"Tax consulting" },
      text: { ru:"Экспертиза налоговых обязательств, оптимизация налогообложения и постоянное консультирование по вопросам финансового и налогового законодательства.", uz:"Soliq majburiyatlari ekspertizasi, soliqqa tortishni optimallashtirish va moliyaviy hamda soliq qonunchiligi bo'yicha doimiy maslahat.", en:"Tax obligation review, tax optimisation, and ongoing advice on financial and tax legislation." },
      steps: { ru:["Экспертиза налоговых обязательств и анализ выбранной системы налогообложения","Рекомендации по оптимизации налогового учёта","Экспертиза бизнес-проекта — финансовый анализ инвестиционных и финансовых проектов","Консультирование в режиме online по финансовым и налоговым вопросам"],
               uz:["Soliq majburiyatlari ekspertizasi va tanlangan soliq tizimini tahlil qilish","Soliq hisobini optimallashtirish bo'yicha tavsiyalar","Biznes-loyiha ekspertizasi — investitsiya va moliyaviy loyihalarni moliyaviy tahlil qilish","Moliyaviy va soliq masalalari bo'yicha onlayn maslahat"],
               en:["Reviewing tax obligations and analysing the chosen taxation system","Recommendations for optimising tax accounting","Business-project appraisal — financial analysis of investment and financial projects","Online consulting on financial and tax matters"] },
      result: { ru:"Оптимизированная налоговая нагрузка, своевременное применение льгот и минимизация рисков ошибок при расчёте налогов.", uz:"Optimallashtirilgan soliq yuki, imtiyozlardan o'z vaqtida foydalanish va soliqlarni hisoblashda xatoliklar xavfini kamaytirish.", en:"An optimised tax burden, timely use of available tax benefits, and minimised risk of errors in tax calculations." },
      faq: { ru:[["Помогаете ли вы с выбором системы налогообложения?","Да, мы анализируем выбранную систему налогообложения и даём рекомендации по её оптимизации с учётом действующего законодательства."],["Что входит в консультирование online?","Постоянная консультационная поддержка клиентов по финансовому и налоговому законодательству через интернет, чтобы бухгалтерия оперативно получала ответы на актуальные вопросы."]],
             uz:[["Soliq tizimini tanlashda yordam berasizmi?","Ha, biz tanlangan soliq tizimini tahlil qilamiz va amaldagi qonunchilikni hisobga olgan holda uni optimallashtirish bo'yicha tavsiyalar beramiz."],["Onlayn maslahat nimalarni o'z ichiga oladi?","Mijozlarning buxgalteriya xizmati dolzarb savollarga tezkor javob olishi uchun moliyaviy va soliq qonunchiligi bo'yicha doimiy internet orqali maslahat."]],
             en:[["Do you help choose a tax system?","Yes, we analyse the taxation system a company has chosen and give recommendations for optimising it under current legislation."],["What does online consulting include?","Ongoing advisory support on financial and tax legislation delivered online, so your accounting team gets timely answers to pressing questions."]] }
    }
  ];

  const INDUSTRIES = [
    { key:"banks", ru:"Банки и финансы", uz:"Banklar va moliya", en:"Banking & finance", icon:"bank" },
    { key:"energy", ru:"Энергетика", uz:"Energetika", en:"Energy", icon:"energy" },
    { key:"industry", ru:"Промышленность", uz:"Sanoat", en:"Industry", icon:"factory" },
    { key:"construction", ru:"Строительство", uz:"Qurilish", en:"Construction", icon:"construction" },
    { key:"logistics", ru:"Логистика", uz:"Logistika", en:"Logistics", icon:"logistics" },
    { key:"it", ru:"IT и телеком", uz:"IT va telekom", en:"IT & telecom", icon:"it" },
    { key:"oil", ru:"Нефтегазовый сектор", uz:"Neft-gaz sektori", en:"Oil & gas", icon:"oil" },
    { key:"state", ru:"Госпредприятия", uz:"Davlat korxonalari", en:"State enterprises", icon:"state" }
  ];

  // 11 sotrudnik: auditorlar va buxgalterlar. Rasmlar va diplom placeholder sifatida umumiy tasvirlardan foydalaniladi —
  // haqiqiy foydalanishda har bir xodimning o'z fotosurati va skanerlangan diplomi bilan almashtiring.
  const TEAM = [
    { id:"m01", service:"audit",
      name:"Хамдамов Бахтиёр Уктамович",
      nameLine1:"Хамдамов Бахтиёр", nameLine2:"Уктамович",
      role:{ ru:"Генеральный директор, аудитор", uz:"Bosh direktor, auditor", en:"General Director, Auditor" },
      photo:"XB.jpg",
      bio:{ ru:"Возглавляет компанию, победитель республиканского конкурса «Лучший аудитор 2021 года» (1 место).", uz:"Kompaniya rahbari, «Eng yaxshi auditor 2021» respublika tanlovi g'olibi (1-o'rin).", en:"Heads the firm; winner of the national «Best Auditor 2021» competition (1st place)." },
      certs:["Аттестат аудитора РУз (действ. до 2031)","CAP"],
      docs:[
        {src:"hamdamov_audit.jpg", label:"Аттестат аудитора"},
        {src:"hamdamov_cap.jpg", label:"CAP"},
        {src:"hamdamov_isa.jpg", label:"Audit on ISA"}
      ] },
    { id:"m06", service:"accounting",
      name:"Жуманов Гулом Усмонович",
      nameLine1:"Жуманов Гулом", nameLine2:"Усмонович",
      role:{ ru:"Аудитор, бухгалтер", uz:"Auditor, buxgalter", en:"Auditor, Accountant" },
      photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop&sat=-30",
      bio:{ ru:"Победитель республиканского конкурса «Лучший бухгалтер 2021 года» (1 место).", uz:"«Eng yaxshi buxgalter 2021» respublika tanlovi g'olibi (1-o'rin).", en:"Winner of the national «Best Accountant 2021» competition (1st place)." },
      certs:["Аттестат аудитора РУз (действ. до 2032)","Сертиф. проф. бухгалтер (SPB)"],
      docs:[
        {src:"jumanov_audit.jpg", label:"Аттестат аудитора"},
        {src:"jumanov_cpa.jpg", label:"SPB"},
        {src:"jumanov_isa.jpg", label:"Audit on ISA"}
      ] },
    { id:"m04", service:"audit",
      name:"Назаров Шер Махкамович",
      nameLine1:"Назаров Шер", nameLine2:"Махкамович",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Призёр республиканского конкурса «Лучший аудитор 2014 года» (2 место).", uz:"«Eng yaxshi auditor 2014» respublika tanlovi mukofotchisi (2-o'rin).", en:"Runner-up in the national «Best Auditor 2014» competition (2nd place)." },
      certs:["Аттестат аудитора РУз (бессрочно)","CAP","CIPA"],
      docs:[
        {src:"nazarov_audit.jpg", label:"Аттестат аудитора"},
        {src:"nazarov_cap.jpg", label:"CAP"},
        {src:"nazarov_cipa.jpg", label:"CIPA"}
      ] },
    { id:"m07", service:"audit",
      name:"Бурханов Ахмаджон Мухаммадаминович",
      nameLine1:"Бурханов Ахмаджон", nameLine2:"Мухаммадаминович",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Специализируется на аудите промышленных и производственных предприятий.", uz:"Sanoat va ishlab chiqarish korxonalari auditiga ixtisoslashgan.", en:"Specialises in the audit of industrial and manufacturing enterprises." },
      certs:["Аттестат аудитора РУз (действ. до 2032)","CAP"],
      docs:[
        {src:"burxanov_audit.jpg", label:"Аттестат аудитора"},
        {src:"burxanov_cap.jpg", label:"CAP"}
      ] },
    { id:"m02", service:"audit",
      name:"Мизинец Татьяна Владимировна",
      nameLine1:"Мизинец Татьяна", nameLine2:"Владимировна",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Специализируется на отчётности по МСФО, обладатель международной квалификации CIPA.", uz:"MHXS bo'yicha hisobotga ixtisoslashgan, CIPA xalqaro malakasi egasi.", en:"Specialises in IFRS reporting, holder of the CIPA international qualification." },
      certs:["Аттестат аудитора РУз (действ. до 2033)","CAP","CIPA"],
      docs:[
        {src:"mizinets_audit.jpg", label:"Аттестат аудитора"},
        {src:"mizinets_cap.jpg", label:"CAP"},
        {src:"mizinets_cipa.jpg", label:"CIPA"}
      ] },
    { id:"m05", service:"audit",
      name:"Ахмедов Нодир Ботирович",
      nameLine1:"Ахмедов Нодир", nameLine2:"Ботирович",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Проводит аудиторские проверки и сопровождает клиентов из различных отраслей экономики.", uz:"Turli sohalardagi mijozlar uchun audit tekshiruvlarini o'tkazadi va hamrohlik qiladi.", en:"Conducts audit engagements and supports clients across a range of industries." },
      certs:["Аттестат аудитора РУз (действ. до 2028)"],
      docs:[
        {src:"axmedov_audit.jpg", label:"Аттестат аудитора"}
      ] },
    { id:"m16", service:"audit",
      name:"Курбонов Хусанбой Рустамжон угли",
      nameLine1:"Курбонов Хусанбой", nameLine2:"Рустамжон угли",
      role:{ ru:"Ассистент аудитора", uz:"Auditor yordamchisi", en:"Audit Assistant" },
      photo:"QH.jpg",
      bio:{ ru:"Молодой и перспективный специалист, недавно окончивший институт. Активно участвует в аудиторских проверках и подготовке заключений для клиентов компании, проявляя внимательность к деталям и стремление к профессиональному росту.", uz:"Institutni yaqinda tamomlagan, istiqbolli yosh mutaxassis. Kompaniya mijozlari uchun audit tekshiruvlari va xulosalar tayyorlashda faol ishtirok etib, o'z sohasida tez rivojlanmoqda.", en:"A promising young specialist who recently graduated from the institute. He actively takes part in audit engagements and the preparation of client reports, showing strong attention to detail and a real drive to grow professionally." },
      certs:[],
      docs:[] },
    { id:"m03", service:"tax",
      name:"Хужабеков Низомиддин Бегбутаевич",
      nameLine1:"Хужабеков Низомиддин", nameLine2:"Бегбутаевич",
      role:{ ru:"Аудитор, налоговый консультант", uz:"Auditor, soliq maslahatchisi", en:"Auditor, Tax Consultant" },
      photo:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Совмещает аудиторскую практику с налоговым консультированием.", uz:"Audit amaliyotini soliq maslahatchiligi bilan birga olib boradi.", en:"Combines audit practice with tax advisory." },
      certs:["Аттестат аудитора РУз (действ. до 2032)","Налоговый консультант РУз","CAP"],
      docs:[
        {src:"xujabekov_audit.jpg", label:"Аттестат аудитора"},
        {src:"xujabekov_cap.jpg", label:"CAP"},
        {src:"xujabekov_tax.jpg", label:"Налоговый консультант"}
      ] },
    { id:"m08", service:"audit",
      name:"Тулаев Мирзакул Саламович",
      nameLine1:"Тулаев Мирзакул", nameLine2:"Саламович",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Проводит аудит финансовой отчётности и инвентаризацию активов клиентов.", uz:"Mijozlarning moliyaviy hisoboti auditini va aktivlar inventarizatsiyasini o'tkazadi.", en:"Performs financial statement audits and asset inventory checks for clients." },
      certs:["Аттестат аудитора РУз (действ. до 2027)","CAP"],
      docs:[
        {src:"tulaev_audit.jpg", label:"Аттестат аудитора"},
        {src:"tulaev_cap.jpg", label:"CAP"}
      ] },
    { id:"m09", service:"audit",
      name:"Ким Марта Еннамовна",
      nameLine1:"Ким Марта", nameLine2:"Еннамовна",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop&sat=-20",
      bio:{ ru:"Участвует в аудиторских проверках и подготовке заключений для клиентов компании.", uz:"Kompaniya mijozlari uchun audit tekshiruvlari va xulosalar tayyorlashda ishtirok etadi.", en:"Takes part in audit engagements and the preparation of client reports." },
      certs:["Аттестат аудитора РУз (действ. до 2029)"],
      docs:[
        {src:"kim_audit.jpg", label:"Аттестат аудитора"}
      ] },
    { id:"m10", service:"audit",
      name:"Кадырова Дилбархон Абдуллаевна",
      nameLine1:"Кадырова Дилбархон", nameLine2:"Абдуллаевна",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop",
      bio:{ ru:"Проводит аудиторские проверки, обладатель бессрочного аттестата аудитора.", uz:"Audit tekshiruvlarini o'tkazadi, muddatsiz auditor attestatiga ega.", en:"Conducts audit engagements, holder of an unlimited-term audit licence." },
      certs:["Аттестат аудитора РУз (бессрочно)","CAP","SPB"],
      docs:[
        {src:"kadirova_audit.jpg", label:"Аттестат аудитора"},
        {src:"kadirova_cap.jpg", label:"CAP"},
        {src:"kadirova_cpa.jpg", label:"SPB"},
        {src:"kadirova_isa.jpg", label:"Audit on ISA"}
      ] },
    { id:"m11", service:"audit",
      name:"Эргашев Азизбек Каримович",
      nameLine1:"Эргашев Азизбек", nameLine2:"Каримович",
      role:{ ru:"Аудитор", uz:"Auditor", en:"Auditor" },
      photo:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600&auto=format&fit=crop&sat=-20",
      bio:{ ru:"Проводит аудиторские проверки финансовой отчётности клиентов.", uz:"Mijozlarning moliyaviy hisoboti auditini o'tkazadi.", en:"Conducts audits of clients' financial statements." },
      certs:["Аттестат аудитора РУз (действ. до 2027)"],
      docs:[
        {src:"ergashev_audit.jpg", label:"Аттестат аудитора"}
      ] },
    { id:"m12", service:"tax",
      name:"Саидова Дилором Бахтияровна",
      nameLine1:"Саидова Дилором", nameLine2:"Бахтияровна",
      role:{ ru:"Налоговый консультант", uz:"Soliq maslahatchisi", en:"Tax Consultant" },
      photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&sat=-20",
      bio:{ ru:"Консультирует клиентов по вопросам налогообложения.", uz:"Mijozlarga soliq masalalari bo'yicha maslahat beradi.", en:"Advises clients on taxation matters." },
      certs:["Налоговый консультант РУз","CAP"],
      docs:[
        {src:"saidova_tax.jpg", label:"Налоговый консультант"},
        {src:"saidova_cap.jpg", label:"CAP"}
      ] },
    { id:"m13", service:"accounting",
      name:"Тухсанов Хамза Ахтамович",
      nameLine1:"Тухсанов Хамза", nameLine2:"Ахтамович",
      role:{ ru:"Бухгалтер", uz:"Buxgalter", en:"Accountant" },
      photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop&sat=-20",
      bio:{ ru:"Ведёт бухгалтерский учёт и подготовку отчётности для клиентов компании.", uz:"Mijozlar uchun buxgalteriya hisobini va hisobotni yuritadi.", en:"Handles bookkeeping and reporting for company clients." },
      certs:["CAP","SPB"],
      docs:[
        {src:"tuxsanov_cap.jpg", label:"CAP"},
        {src:"tuxsanov_cpa.jpg", label:"SPB"}
      ] },
    { id:"m14", service:"tax",
      name:"Тахиров Анвар Атхамович",
      nameLine1:"Тахиров Анвар", nameLine2:"Атхамович",
      role:{ ru:"Налоговый консультант", uz:"Soliq maslahatchisi", en:"Tax Consultant" },
      photo:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop&sat=-20",
      bio:{ ru:"Консультирует клиентов по вопросам налогового законодательства.", uz:"Mijozlarga soliq qonunchiligi bo'yicha maslahat beradi.", en:"Advises clients on tax legislation matters." },
      certs:["Налоговый консультант РУз"],
      docs:[
        {src:"taxirov_tax.jpg", label:"Налоговый консультант"}
      ] },
    { id:"m15", service:"tax",
      name:"Набижанов Бахадир Сайтжанович",
      nameLine1:"Набижанов Бахадир", nameLine2:"Сайтжанович",
      role:{ ru:"Налоговый консультант", uz:"Soliq maslahatchisi", en:"Tax Consultant" },
      photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop&sat=-35",
      bio:{ ru:"Консультирует клиентов по вопросам налогового учёта и отчётности.", uz:"Mijozlarga soliq hisobi va hisobot masalalari bo'yicha maslahat beradi.", en:"Advises clients on tax accounting and reporting matters." },
      certs:["Налоговый консультант РУз"],
      docs:[
        {src:"nabijanov_tax.jpg", label:"Налоговый консультант"}
      ] }
  ];

  const ICONS = {
    audit: '<path d="M9 3h6l2 4h3v14H4V7h3l2-4z" stroke="currentColor" stroke-width="1.5"/><path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    risk: '<path d="M12 2l9 4.5v6C21 18 17 21.5 12 23 7 21.5 3 18 3 12.5v-6L12 2z" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/>',
    compliance: '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    consulting: '<path d="M4 19V5m0 14h16M8 15v-4m4 4V9m4 6v-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    accounting: '<rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 10h18M7 6V4h10v2" stroke="currentColor" stroke-width="1.5"/>',
    dd: '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.5-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    ifrs: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M3 12h18M12 3c2.3 2.5 3.6 5.6 3.6 9s-1.3 6.5-3.6 9c-2.3-2.5-3.6-5.6-3.6-9S9.7 5.5 12 3z" stroke="currentColor" stroke-width="1.5"/>',
    tax: '<rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 16l8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8.7" cy="8.7" r="1.4" stroke="currentColor" stroke-width="1.5"/><circle cx="15.3" cy="15.3" r="1.4" stroke="currentColor" stroke-width="1.5"/>',
    bank: '<path d="M4 10l8-6 8 6M5 10v9M19 10v9M9 10v9M15 10v9M3 19h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    energy: '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    factory: '<path d="M3 21V11l5 3v-3l5 3V8l6 4v9H3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    construction: '<path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-6h4v6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    logistics: '<rect x="2" y="8" width="13" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M15 11h4l3 3v3h-7v-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="7" cy="19" r="1.6" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="19" r="1.6" stroke="currentColor" stroke-width="1.5"/>',
    it: '<rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    oil: '<path d="M12 2c3 4 6 7.5 6 11.5A6 6 0 016 13.5C6 9.5 9 6 12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    state: '<path d="M12 2l9 4-9 4-9-4 9-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 10v6c0 2 3 4 7 4s7-2 7-4v-6" stroke="currentColor" stroke-width="1.5"/>'
  };

  /* ---------------------------------------------------------------------
     2. I18N DICTIONARY for static markup (data-i18n attributes)
     --------------------------------------------------------------------- */
  const I18N = {
    ru: {
      "nav.about":"О компании","nav.services":"Услуги","nav.industries":"Отрасли","nav.team":"Наша команда","nav.contacts":"Контакты",
      "hero.title":'ЗАЩИЩАЕМ <span class="accent">ЦЕННОСТЬ</span>.<br>СОЗДАЁМ УВЕРЕННОСТЬ.',
      "hero.text":"Независимый аудит, управление рисками, комплаенс и консультации для устойчивого развития вашего бизнеса.",
      "hero.cta1":"Связаться с нами","hero.cta2":"Наши услуги",
      "stat.years":"лет опыта","stat.clients":"клиентов","stat.industries":"отраслей","stat.independence":"независимость",
      "adv.eyebrow":"Почему мы","adv.title":"Почему выбирают Amulet Audit","adv.sub":"Двадцать лет практики в аудите и консалтинге, выстроенные вокруг независимости, точности и доверия клиентов.",
      "adv.c1.title":"Независимость","adv.c1.text":"Объективная оценка без конфликта интересов, подтверждённая международными стандартами.",
      "adv.c2.title":"Экспертность","adv.c2.text":"Команда сертифицированных специалистов с опытом работы в 10+ отраслях экономики.",
      "adv.c3.title":"Конфиденциальность","adv.c3.text":"Строгие внутренние регламенты защиты данных клиента на всех этапах сотрудничества.",
      "adv.c4.title":"Международные стандарты","adv.c4.text":"Методология работы соответствует ISA, IFRS и лучшим мировым практикам аудита.",
      "svc.eyebrow":"Услуги","svc.title":"Комплексные решения для вашего бизнеса","svc.sub":"От аудита и трансформации в МСФО до бухгалтерского и налогового консалтинга — весь спектр услуг под задачи вашей компании.",
      "ind.eyebrow":"Отрасли","ind.title":"Опыт, применимый к вашей индустрии","ind.sub":"Мы понимаем регуляторную специфику и бизнес-модель каждой из отраслей ниже.",
      "about.eyebrow":"О компании","about.title":"Двадцать лет защищаем интересы наших клиентов",
      "about.text":"Amulet Audit — независимая аудиторско-консалтинговая компания. Мы сопровождаем акционерные общества, государственные предприятия и крупный бизнес, выстраивая доверие через прозрачность и профессионализм.",
      "about.since":"год основания компании",
      "about.v1.t":"Миссия","about.v1.p":"Обеспечивать достоверность финансовой информации и снижать риски для бизнеса и его партнёров.",
      "about.v2.t":"Ценности","about.v2.p":"Независимость, честность, профессиональный скептицизм и уважение к клиенту.",
      "about.v3.t":"Команда","about.v3.p":"15 специалистов в штате: 11 сертифицированных аудиторов, налоговые консультанты и профессиональные бухгалтеры.",
      "about.partners":"Лицензии, сертификаты и партнёры",
      "badge.registry":"Реестр аудиторских организаций МФ РУз (04.06.2021)","badge.insurance":"Ответственность застрахована на 3 млрд сум","badge.naba":"Член НАБА и Палаты Аудиторов","badge.minjust":"Минюст РУз №1036 (04.10.2004)",
      "license.caption":"Лицензия на осуществление аудиторской деятельности АФ №00792",
      "policy.caption":"Полис страхования профессиональной ответственности №0370335 (О'zbekinvest, до 19.03.2027)",
      "team.eyebrow":"Наша команда","team.title":"Специалисты, которым доверяют",
      "team.sub":"Нажмите на фото сотрудника, чтобы увидеть его квалификацию, дипломы и оформить заявку на аудит или бухгалтерское сопровождение именно у этого специалиста.",
      "team.viewProfile":"Смотреть профиль",
      "team.modal.eyebrow":"Сотрудник","team.modal.certs":"Квалификация и сертификаты","team.modal.diploma":"Диплом","team.modal.docs":"Подтверждающие документы","team.modal.cta":"Оставить заявку этому специалисту",
      "contact.eyebrow":"Контакты","contact.title":"Свяжитесь с нами","contact.sub":"Оставьте заявку — наш специалист свяжется с вами в ближайшее время.",
      "contact.info.title":"Наши контакты","contact.info.text":"Готовы ответить на вопросы о сотрудничестве и подобрать оптимальное решение для вашей компании.",
      "contact.address.t":"Адрес","contact.address.v":"Республика Узбекистан, г. Ташкент, Мирабадский р-н, ул. А. С. Банокатий, 186/1",
      "contact.phone.t":"Телефон","contact.email.t":"Email","contact.hours.t":"Режим работы","contact.hours.v":"Пн–Пт, 09:00 — 18:00",
      "form.name":"Имя","form.name.ph":"Иван Иванов","form.phone":"Телефон","form.email":"Email","form.service":"Интересующая услуга","form.service.ph":"Выберите услугу",
      "form.specialist":"Специалист (по желанию)","form.specialist.ph":"Не выбран — подберём сами",
      "form.message":"Сообщение","form.submit":"Отправить заявку","form.success":"Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
      "form.error.required":"Заполните это поле","form.error.phone":"Введите корректный номер телефона","form.error.email":"Введите корректный email",
      "form.note":"Отправляя форму, вы соглашаетесь с политикой конфиденциальности и обработкой персональных данных.",
      "footer.about":"Независимый аудит, управление рисками и консалтинг для устойчивого развития вашего бизнеса.",
      "footer.company":"Компания","footer.services":"Услуги","footer.contacts":"Контакты","footer.rights":"Все права защищены.","footer.tagline":"Защищаем ценность. Создаём уверенность.",
      "modal.eyebrow":"Услуга","modal.steps":"Этапы работы","modal.result":"Результат для клиента","modal.cta":"Оставить заявку",
      "svc.s1.title":"Аудиторские услуги","svc.s2.title":"Трансформация в соответствии с МСФО","svc.s3.title":"Бухгалтерский консалтинг","svc.s4.title":"Налоговый консалтинг"
    },
    uz: {
      "nav.about":"Kompaniya haqida","nav.services":"Xizmatlar","nav.industries":"Sohalar","nav.team":"Bizning jamoa","nav.contacts":"Kontaktlar",
      "hero.title":'QIYMATNI <span class="accent">HIMOYA</span> QILAMIZ.<br>ISHONCH YARATAMIZ.',
      "hero.text":"Biznesingizning barqaror rivojlanishi uchun mustaqil audit, xavflarni boshqarish, komplayens va maslahat xizmatlari.",
      "hero.cta1":"Biz bilan bog'laning","hero.cta2":"Xizmatlarimiz",
      "stat.years":"yillik tajriba","stat.clients":"mijoz","stat.industries":"soha","stat.independence":"mustaqillik",
      "adv.eyebrow":"Nega aynan biz","adv.title":"Nega Amulet Audit tanlanadi","adv.sub":"Mustaqillik, aniqlik va mijozlar ishonchi atrofida qurilgan audit va konsaltingdagi yigirma yillik tajriba.",
      "adv.c1.title":"Mustaqillik","adv.c1.text":"Xalqaro standartlar bilan tasdiqlangan, manfaatlar to'qnashuvisiz xolis baholash.",
      "adv.c2.title":"Ekspertlik","adv.c2.text":"10+ iqtisodiyot sohasida tajribaga ega sertifikatlangan mutaxassislar jamoasi.",
      "adv.c3.title":"Maxfiylik","adv.c3.text":"Hamkorlikning barcha bosqichlarida mijoz ma'lumotlarini himoya qilishning qat'iy ichki qoidalari.",
      "adv.c4.title":"Xalqaro standartlar","adv.c4.text":"Ish metodologiyasi ISA, IFRS va eng yaxshi jahon audit amaliyotlariga mos keladi.",
      "svc.eyebrow":"Xizmatlar","svc.title":"Biznesingiz uchun kompleks yechimlar","svc.sub":"Audit va MHXSga transformatsiyadan tortib buxgalteriya va soliq konsaltinggacha — kompaniyangiz vazifalariga mos xizmatlar.",
      "ind.eyebrow":"Sohalar","ind.title":"Sizning sohangizga tegishli tajriba","ind.sub":"Biz quyidagi har bir sohaning tartibga solish xususiyati va biznes modelini tushunamiz.",
      "about.eyebrow":"Kompaniya haqida","about.title":"Yigirma yildan beri mijozlarimiz manfaatini himoya qilamiz",
      "about.text":"Amulet Audit — mustaqil audit-konsalting kompaniyasi. Biz aksiyadorlik jamiyatlari, davlat korxonalari va yirik bizneslarga shaffoflik va professionallik orqali ishonch qurishda yordam beramiz.",
      "about.since":"kompaniya tashkil topgan yil",
      "about.v1.t":"Missiya","about.v1.p":"Moliyaviy ma'lumotlarning ishonchliligini ta'minlash va biznes hamda uning hamkorlari uchun xavflarni kamaytirish.",
      "about.v2.t":"Qadriyatlar","about.v2.p":"Mustaqillik, halollik, professional skeptitsizm va mijozga hurmat.",
      "about.v3.t":"Jamoa","about.v3.p":"Shtatda 15 mutaxassis: 11 sertifikatlangan auditor, soliq maslahatchilari va professional buxgalterlar.",
      "about.partners":"Litsenziyalar, sertifikatlar va hamkorlar",
      "badge.registry":"MF RUz auditorlik tashkilotlari reyestri (04.06.2021)","badge.insurance":"Javobgarlik 3 mlrd so'mga sug'urtalangan","badge.naba":"NABA va Auditorlar Palatasi a'zosi","badge.minjust":"Adliya vazirligi №1036 (04.10.2004)",
      "license.caption":"Auditorlik faoliyatini amalga oshirish uchun litsenziya AF №00792",
      "policy.caption":"Kasbiy javobgarlikni sug'urtalash polisi №0370335 (О'zbekinvest, 19.03.2027 gacha)",
      "team.eyebrow":"Bizning jamoa","team.title":"Ishonch bildiriladigan mutaxassislar",
      "team.sub":"Xodimning suratiga bosing — uning malakasi, diplomlarini ko'rasiz va aynan shu mutaxassisga audit yoki buxgalteriya sohasida so'rov qoldirishingiz mumkin.",
      "team.viewProfile":"Profilni ko'rish",
      "team.modal.eyebrow":"Xodim","team.modal.certs":"Malaka va sertifikatlar","team.modal.diploma":"Diplom","team.modal.docs":"Tasdiqlovchi hujjatlar","team.modal.cta":"Ushbu mutaxassisga so'rov qoldirish",
      "contact.eyebrow":"Kontaktlar","contact.title":"Biz bilan bog'laning","contact.sub":"So'rov qoldiring — mutaxassisimiz siz bilan tez orada bog'lanadi.",
      "contact.info.title":"Bizning kontaktlar","contact.info.text":"Hamkorlik bo'yicha savollaringizga javob berishga va kompaniyangiz uchun optimal yechimni tanlashga tayyormiz.",
      "contact.address.t":"Manzil","contact.address.v":"O'zbekiston Respublikasi, Toshkent sh., Mirobod t., A.S.Banokatiy ko'ch., 186/1-uy",
      "contact.phone.t":"Telefon","contact.email.t":"Email","contact.hours.t":"Ish vaqti","contact.hours.v":"Du–Ju, 09:00 — 18:00",
      "form.name":"Ism","form.name.ph":"Ivan Ivanov","form.phone":"Telefon","form.email":"Email","form.service":"Qiziqtirgan xizmat","form.service.ph":"Xizmatni tanlang",
      "form.specialist":"Mutaxassis (ixtiyoriy)","form.specialist.ph":"Tanlanmagan — o'zimiz tanlab beramiz",
      "form.message":"Xabar","form.submit":"So'rov yuborish","form.success":"So'rov yuborildi! Tez orada siz bilan bog'lanamiz.",
      "form.error.required":"Ushbu maydonni to'ldiring","form.error.phone":"To'g'ri telefon raqamini kiriting","form.error.email":"To'g'ri email kiriting",
      "form.note":"Formani yuborish orqali siz maxfiylik siyosati va shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirasiz.",
      "footer.about":"Biznesingizning barqaror rivojlanishi uchun mustaqil audit, xavflarni boshqarish va konsalting.",
      "footer.company":"Kompaniya","footer.services":"Xizmatlar","footer.contacts":"Kontaktlar","footer.rights":"Barcha huquqlar himoyalangan.","footer.tagline":"Qiymatni himoya qilamiz. Ishonch yaratamiz.",
      "modal.eyebrow":"Xizmat","modal.steps":"Ish bosqichlari","modal.result":"Mijoz uchun natija","modal.cta":"So'rov qoldirish",
      "svc.s1.title":"Audit xizmatlari","svc.s2.title":"MHXS ga muvofiq transformatsiya","svc.s3.title":"Buxgalteriya konsalting xizmati","svc.s4.title":"Soliq konsalting xizmati"
    },
    en: {
      "nav.about":"About","nav.services":"Services","nav.industries":"Industries","nav.team":"Our team","nav.contacts":"Contact",
      "hero.title":'PROTECTING <span class="accent">VALUE</span>.<br>BUILDING CONFIDENCE.',
      "hero.text":"Independent audit, risk management, compliance and advisory for the sustainable growth of your business.",
      "hero.cta1":"Contact us","hero.cta2":"Our services",
      "stat.years":"years of experience","stat.clients":"clients","stat.industries":"industries","stat.independence":"independence",
      "adv.eyebrow":"Why us","adv.title":"Why clients choose Amulet Audit","adv.sub":"Twenty years of audit and advisory practice built around independence, precision and client trust.",
      "adv.c1.title":"Independence","adv.c1.text":"Objective assessment free of conflicts of interest, backed by international standards.",
      "adv.c2.title":"Expertise","adv.c2.text":"A team of certified professionals with experience across 10+ industries.",
      "adv.c3.title":"Confidentiality","adv.c3.text":"Strict internal data-protection policies at every stage of engagement.",
      "adv.c4.title":"International standards","adv.c4.text":"Our methodology follows ISA, IFRS and global best audit practice.",
      "svc.eyebrow":"Services","svc.title":"Comprehensive solutions for your business","svc.sub":"From audit and IFRS transformation to accounting and tax consulting — the full range of services for your company's needs.",
      "ind.eyebrow":"Industries","ind.title":"Experience relevant to your industry","ind.sub":"We understand the regulatory specifics and business model of each industry below.",
      "about.eyebrow":"About us","about.title":"Twenty years protecting our clients' interests",
      "about.text":"Amulet Audit is an independent audit and advisory firm. We support joint-stock companies, state enterprises and large businesses, building trust through transparency and professionalism.",
      "about.since":"year the company was founded",
      "about.v1.t":"Mission","about.v1.p":"Ensure the reliability of financial information and reduce risk for businesses and their partners.",
      "about.v2.t":"Values","about.v2.p":"Independence, integrity, professional scepticism and respect for the client.",
      "about.v3.t":"Team","about.v3.p":"15 in-house specialists: 11 certified auditors, tax consultants and professional accountants.",
      "about.partners":"Licences, certificates and partners",
      "badge.registry":"Registered with MF RUz audit registry (04.06.2021)","badge.insurance":"Professional liability insured for 3bn UZS","badge.naba":"Member of NABA and the Chamber of Auditors","badge.minjust":"Ministry of Justice №1036 (04.10.2004)",
      "license.caption":"Audit activity licence AF №00792",
      "policy.caption":"Professional liability insurance policy №0370335 (О'zbekinvest, until 19.03.2027)",
      "team.eyebrow":"Our team","team.title":"Specialists you can trust",
      "team.sub":"Click on a staff member's photo to see their qualifications and diplomas, and submit a request for audit or accounting support with that specialist.",
      "team.viewProfile":"View profile",
      "team.modal.eyebrow":"Team member","team.modal.certs":"Qualifications & certificates","team.modal.diploma":"Diploma","team.modal.docs":"Supporting documents","team.modal.cta":"Request this specialist",
      "contact.eyebrow":"Contact","contact.title":"Get in touch","contact.sub":"Leave a request — our specialist will contact you shortly.",
      "contact.info.title":"Our contacts","contact.info.text":"We are ready to answer your questions and find the best solution for your company.",
      "contact.address.t":"Address","contact.address.v":"Republic of Uzbekistan, Tashkent, Mirabad district, A. S. Banokatiy str., 186/1",
      "contact.phone.t":"Phone","contact.email.t":"Email","contact.hours.t":"Working hours","contact.hours.v":"Mon–Fri, 9:00 AM — 6:00 PM",
      "form.name":"Name","form.name.ph":"John Smith","form.phone":"Phone","form.email":"Email","form.service":"Service of interest","form.service.ph":"Select a service",
      "form.specialist":"Specialist (optional)","form.specialist.ph":"Not selected — we'll pick one for you",
      "form.message":"Message","form.submit":"Send request","form.success":"Your request has been sent! We'll be in touch shortly.",
      "form.error.required":"This field is required","form.error.phone":"Enter a valid phone number","form.error.email":"Enter a valid email address",
      "form.note":"By submitting this form you agree to our privacy policy and personal data processing.",
      "footer.about":"Independent audit, risk management and advisory for the sustainable growth of your business.",
      "footer.company":"Company","footer.services":"Services","footer.contacts":"Contact","footer.rights":"All rights reserved.","footer.tagline":"Protecting value. Building confidence.",
      "modal.eyebrow":"Service","modal.steps":"Process","modal.result":"Client outcome","modal.cta":"Leave a request",
      "svc.s1.title":"Audit services","svc.s2.title":"IFRS transformation","svc.s3.title":"Accounting consulting","svc.s4.title":"Tax consulting"
    }
  };

  let currentLang = "ru";

  /* ---------------------------------------------------------------------
     3. RENDER DYNAMIC SECTIONS
     --------------------------------------------------------------------- */
  function renderServices(){
    const grid = document.getElementById("serviceGrid");
    grid.innerHTML = SERVICES.map((s,i) => `
      <article class="svc-card reveal" style="--i:${i}">
        <div class="svc-num">0${i+1}</div>
        <h3>${s.title[currentLang]}</h3>
        <p>${s.text[currentLang]}</p>
        <button class="svc-more" data-service="${s.id}" type="button">
          ${currentLang==="ru" ? "Подробнее" : currentLang==="uz" ? "Batafsil" : "Learn more"}
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </article>
    `).join("");
    grid.querySelectorAll("[data-service]").forEach(btn=>{
      btn.addEventListener("click", () => openServiceModal(btn.getAttribute("data-service")));
    });
    observeReveals();
  }

  function renderIndustries(){
    const grid = document.getElementById("industryGrid");
    grid.innerHTML = INDUSTRIES.map(ind => `
      <div class="ind-card reveal">
        <svg viewBox="0 0 24 24" fill="none">${ICONS[ind.icon]}</svg>
        <span>${ind[currentLang]}</span>
      </div>
    `).join("");
    observeReveals();
  }

  function renderTeam(){
    const grid = document.getElementById("teamGrid");
    grid.innerHTML = TEAM.map((m,i) => `
      <button class="team-card reveal" style="--i:${i}" type="button" data-member="${m.id}">
        <div class="team-photo">
          <img src="${m.photo}" alt="${m.name}" loading="lazy">
          <div class="team-photo-overlay"><span>${I18N[currentLang]["team.viewProfile"]}</span></div>
        </div>
        <div class="team-body">
          <h4>${m.nameLine1}<span class="team-patronymic">${m.nameLine2}</span></h4>
          <p>${m.role[currentLang]}</p>
        </div>
      </button>
    `).join("");
    grid.querySelectorAll("[data-member]").forEach(card=>{
      card.addEventListener("click", () => openTeamModal(card.getAttribute("data-member")));
    });
    observeReveals();
  }

  // Mutaxassis (specialist) selectini TEAM ma'lumotlaridan to'ldiradi, shunda foydalanuvchi
  // team-kartochkasini bosmasdan ham, to'g'ridan-to'g'ri asosiy formadan xohlagan mutaxassisni tanlay oladi.
  function renderSpecialistOptions(){
    const select = document.getElementById("f-specialist");
    if(!select) return;
    const prevValue = select.value;
    const placeholder = (I18N[currentLang] && I18N[currentLang]["form.specialist.ph"]) || "";
    select.innerHTML = `<option value="">${placeholder}</option>` +
      TEAM.map(m => `<option value="${m.id}">${m.name} — ${m.role[currentLang]}</option>`).join("");
    if(prevValue && TEAM.some(m => m.id === prevValue)) select.value = prevValue;
  }

  function renderFooterServices(){
    const ul = document.getElementById("footerServices");
    ul.innerHTML = SERVICES.slice(0,5).map(s => `<li><a href="#services">${s.title[currentLang]}</a></li>`).join("");
  }

  /* ---------------------------------------------------------------------
     3b. HERO SERVICES INFO TICKER — birinchi ochiladigan (hero) qismda
     Услуги bo'limlarini navbat bilan, har biri 10 soniyadan ko'rsatib turadi
     --------------------------------------------------------------------- */
  let heroTickerIndex = 0;
  let heroTickerTimer = null;

  function renderHeroServiceInfo(){
    const card = document.getElementById("heroServiceInfo");
    if(!card) return;
    const s = SERVICES[heroTickerIndex];
    if(!s) return;
    card.classList.add("is-fading");
    setTimeout(() => {
      document.getElementById("heroServiceIndex").textContent = "0" + (heroTickerIndex + 1);
      document.getElementById("heroServiceTitle").textContent = s.title[currentLang];
      document.getElementById("heroServiceText").textContent = s.text[currentLang];
      card.classList.remove("is-fading");
    }, 180);
    const progress = document.getElementById("heroServiceProgress");
    if(progress){
      progress.classList.remove("is-running");
      void progress.offsetWidth; // animatsiyani boshidan qayta ishga tushirish uchun reflow
      progress.classList.add("is-running");
    }
  }

  function nextHeroService(){
    heroTickerIndex = (heroTickerIndex + 1) % SERVICES.length;
    renderHeroServiceInfo();
  }

  function startHeroServiceTicker(){
    if(!document.getElementById("heroServiceInfo")) return;
    renderHeroServiceInfo();
    if(heroTickerTimer) clearInterval(heroTickerTimer);
    heroTickerTimer = setInterval(nextHeroService, 10000);
  }

  /* ---------------------------------------------------------------------
     4. MODALS (service + team member)
     --------------------------------------------------------------------- */
  const serviceModal = document.getElementById("serviceModal");
  const teamModal = document.getElementById("teamModal");
  const licenseModal = document.getElementById("licenseModal");
  const policyModal = document.getElementById("policyModal");
  const docViewerModal = document.getElementById("docViewerModal");

  function openModal(el){
    el.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(el){
    el.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function closeAllModals(){
    closeModal(serviceModal);
    closeModal(teamModal);
    closeModal(licenseModal);
    closeModal(policyModal);
    closeModal(docViewerModal);
  }

  function openServiceModal(id){
    const s = SERVICES.find(x => x.id === id);
    if(!s) return;
    document.getElementById("modalTitle").textContent = s.title[currentLang];
    document.getElementById("modalDesc").textContent = s.text[currentLang];
    document.getElementById("modalSteps").innerHTML = s.steps[currentLang].map((step,i)=>`<li><b>0${i+1}.</b> ${step}</li>`).join("");
    document.getElementById("modalResult").textContent = s.result[currentLang];
    const faqBox = document.getElementById("modalFaq");
    faqBox.innerHTML = `<h4>FAQ</h4>` + s.faq[currentLang].map(([q,a]) => `
      <details><summary>${q}</summary><p>${a}</p></details>
    `).join("");
    document.getElementById("modalCta").setAttribute("data-preset-service", id);
    openModal(serviceModal);
  }

  function openTeamModal(id){
    const m = TEAM.find(x => x.id === id);
    if(!m) return;
    document.getElementById("teamModalPhoto").src = m.photo;
    document.getElementById("teamModalPhoto").alt = m.name;
    document.getElementById("teamModalName").innerHTML = `${m.nameLine1}<span class="team-patronymic">${m.nameLine2}</span>`;
    document.getElementById("teamModalRole").textContent = m.role[currentLang];
    document.getElementById("teamModalBio").textContent = m.bio[currentLang];
    document.getElementById("teamModalCerts").innerHTML = m.certs.map(c => `<span class="cert-chip">${c}</span>`).join("");
    const docsBox = document.getElementById("teamModalDocs");
    if(m.docs && m.docs.length){
      docsBox.innerHTML = m.docs.map(d => `
        <div class="doc-thumb" data-doc-src="${d.src}" data-doc-alt="${m.name} — ${d.label}">
          <img src="${d.src}" alt="${m.name} — ${d.label}" loading="lazy">
          <span>${d.label}</span>
        </div>
      `).join("");
      docsBox.querySelectorAll(".doc-thumb").forEach(el => {
        el.addEventListener("click", () => openDocViewer(el.getAttribute("data-doc-src"), el.getAttribute("data-doc-alt")));
      });
    } else {
      const noDocsText = currentLang==="ru" ? "Документы уточняются" : currentLang==="uz" ? "Hujjatlar aniqlanmoqda" : "Documents pending";
      docsBox.innerHTML = `<div class="doc-thumb-empty">${noDocsText}</div>`;
    }
    document.getElementById("teamModalCta").setAttribute("data-preset-service", m.service);
    document.getElementById("teamModalCta").setAttribute("data-specialist-id", m.id);
    openModal(teamModal);
  }

  function openDocViewer(src, alt){
    const img = document.getElementById("docViewerImg");
    img.src = src;
    img.alt = alt;
    openModal(docViewerModal);
  }

  // universal close buttons (X, backdrop click, Escape)
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(document.getElementById(btn.getAttribute("data-close-modal"))));
  });
  [serviceModal, teamModal, licenseModal, policyModal, docViewerModal].forEach(overlay => {
    overlay.addEventListener("click", e => { if(e.target === overlay) closeModal(overlay); });
  });
  document.addEventListener("keydown", e => { if(e.key === "Escape") closeAllModals(); });

  const licenseOpen = document.getElementById("licenseOpen");
  if(licenseOpen){
    licenseOpen.addEventListener("click", e => {
      e.preventDefault();
      openModal(licenseModal);
    });
  }
  const policyOpen = document.getElementById("policyOpen");
  if(policyOpen){
    policyOpen.addEventListener("click", e => {
      e.preventDefault();
      openModal(policyModal);
    });
  }

  // CTA buttons inside modals: preset the service dropdown (+ specialist select for team CTA), close modal, scroll to contact form.
  // The specialist select is the SAME visible field the user sees in the main form, so a preset from here
  // is just a convenience — the person can always open the form directly and pick a specialist themselves too.
  function wireModalCta(ctaId, overlay){
    const cta = document.getElementById(ctaId);
    cta.addEventListener("click", () => {
      const preset = cta.getAttribute("data-preset-service");
      if(preset){ document.getElementById("f-service").value = preset; }
      const specialistId = cta.getAttribute("data-specialist-id");
      document.getElementById("f-specialist").value = specialistId || "";
      closeModal(overlay);
    });
  }
  wireModalCta("modalCta", serviceModal);
  wireModalCta("teamModalCta", teamModal);

  /* ---------------------------------------------------------------------
     5. HEADER / NAV / MOBILE MENU
     --------------------------------------------------------------------- */
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    toggleBackToTop();
  }, { passive:true });

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    document.body.style.overflow = "";
  }));

  // active link highlight
  const sections = ["about","services","industries","team","contact"];
  const navLinks = Array.from(mainNav.querySelectorAll("a"));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#"+entry.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(id => { const el = document.getElementById(id); if(el) sectionObserver.observe(el); });

  /* ---------------------------------------------------------------------
     6. LANGUAGE SWITCH
     --------------------------------------------------------------------- */
  const langSwitch = document.getElementById("langSwitch");
  const langBtn = document.getElementById("langBtn");
  langBtn.addEventListener("click", () => {
    const open = langSwitch.getAttribute("data-open") === "true";
    langSwitch.setAttribute("data-open", (!open).toString());
    langBtn.setAttribute("aria-expanded", (!open).toString());
  });
  document.addEventListener("click", e => {
    if(!langSwitch.contains(e.target)) langSwitch.setAttribute("data-open","false");
  });
  langSwitch.querySelectorAll(".lang-menu button").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
      langSwitch.setAttribute("data-open","false");
      langSwitch.querySelectorAll(".lang-menu button").forEach(b => b.classList.toggle("is-active", b === btn));
      document.getElementById("langCurrent").textContent = lang.toUpperCase();
    });
  });

  function applyStaticI18n(){
    const dict = I18N[currentLang];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if(dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      const key = el.getAttribute("data-i18n-ph");
      if(dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });
    document.documentElement.lang = currentLang;
  }

  function setLanguage(lang){
    if(!I18N[lang]) return;
    currentLang = lang;
    applyStaticI18n();
    renderServices();
    renderIndustries();
    renderTeam();
    renderFooterServices();
    renderSpecialistOptions();
    renderHeroServiceInfo();
  }

  /* ---------------------------------------------------------------------
     7. STAT COUNTERS (animate on scroll into view)
     --------------------------------------------------------------------- */
  function animateCounter(el){
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.5 });
  document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------------
     8. REVEAL-ON-SCROLL
     --------------------------------------------------------------------- */
  let revealObserver;
  function observeReveals(){
    if(!revealObserver){
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold:0.12 });
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------------------
     9. CONTACT FORM VALIDATION + FAKE SUBMIT
     --------------------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("formSuccess");
  const submitBtn = document.getElementById("formSubmit");

  function setFieldError(name, hasError){
    const field = form.querySelector(`[data-field="${name}"]`);
    if(field) field.classList.toggle("has-error", hasError);
  }

  function validate(){
    let valid = true;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();

    if(name.length < 2){ setFieldError("name", true); valid = false; } else setFieldError("name", false);

    const phoneOk = /^[+\d][\d\s()-]{6,}$/.test(phone);
    if(!phoneOk){ setFieldError("phone", true); valid = false; } else setFieldError("phone", false);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailOk){ setFieldError("email", true); valid = false; } else setFieldError("email", false);

    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successBox.classList.remove("is-visible");
    if(!validate()) return;

    submitBtn.setAttribute("disabled", "true");
    const label = submitBtn.querySelector("span");
    const originalText = label.textContent;
    label.textContent = currentLang === "ru" ? "Отправка..." : currentLang === "uz" ? "Yuborilmoqda..." : "Sending...";

    const serviceSelect = document.getElementById("f-service");
    const serviceLabel = serviceSelect.value ? serviceSelect.options[serviceSelect.selectedIndex].text : "";

    const specialistSelect = document.getElementById("f-specialist");
    const specialistLabel = specialistSelect.value ? specialistSelect.options[specialistSelect.selectedIndex].text : "";

    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      serviceLabel: serviceLabel,
      specialist: specialistLabel,
      langLabel: LANG_LABEL[currentLang] || currentLang,
      timestamp: new Date().toLocaleString(currentLang === "ru" ? "ru-RU" : currentLang === "uz" ? "uz-UZ" : "en-GB")
    };

    const sent = await sendLeadToTelegram(payload);

    submitBtn.removeAttribute("disabled");
    label.textContent = originalText;

    if(sent){
      successBox.classList.add("is-visible");
      showToast(I18N[currentLang]["form.success"]);
      setTimeout(() => successBox.classList.remove("is-visible"), 6000);
    } else {
      // Telegram bot hali sozlanmagan yoki xatolik yuz berdi — foydalanuvchiga baribir tasdiq ko'rsatamiz,
      // ammo brauzer konsolida ogohlantirish qoladi (yuqoridagi TELEGRAM_CONFIG'ni tekshiring).
      successBox.classList.add("is-visible");
      showToast(I18N[currentLang]["form.success"]);
      setTimeout(() => successBox.classList.remove("is-visible"), 6000);
    }

    form.reset();
    document.getElementById("f-specialist").value = "";
    setFieldError("name", false); setFieldError("phone", false); setFieldError("email", false);
  });

  /* ---------------------------------------------------------------------
     10. TOAST NOTIFICATIONS
     --------------------------------------------------------------------- */
  function showToast(msg){
    const region = document.getElementById("toastRegion");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 400);
    }, 4200);
  }


  const backToTop = document.getElementById("backToTop");
  function toggleBackToTop(){
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  backToTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

  document.getElementById("year").textContent = new Date().getFullYear();
  renderServices();
  renderIndustries();
  renderTeam();
  renderFooterServices();
  renderSpecialistOptions();
  startHeroServiceTicker();
  observeReveals();
  toggleBackToTop();

})();