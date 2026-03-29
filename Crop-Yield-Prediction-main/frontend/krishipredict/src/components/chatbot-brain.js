/**
 * KrishiPredict Chatbot Brain
 * ─────────────────────────────────────────────────────────────────
 * Fully self-contained — zero API dependencies.
 * Supports: English · Bengali (বাংলা) · Hindi (हिंदी)
 * Features: intent detection, navigation, crop advice, file context,
 *           voice input/output via Web APIs.
 */

/* ── Language detection ─────────────────────────────────────────── */
export function detectLanguage(text) {
  // Bengali unicode range: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  // Devanagari (Hindi) range: \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  return "en";
}

/* ── Navigation map ──────────────────────────────────────────────── */
export const NAV_ROUTES = {
  predict:       { path: "/predict",       label: "Crop Prediction",      labelBn: "ফসল পূর্বাভাস",    labelHi: "फसल पूर्वानुमान" },
  result:        { path: "/result",        label: "Results",              labelBn: "ফলাফল",            labelHi: "परिणाम" },
  marketplace:   { path: "/marketplace",   label: "Marketplace",          labelBn: "মার্কেটপ্লেস",     labelHi: "बाज़ार" },
  notifications: { path: "/notifications", label: "Govt. Schemes",        labelBn: "সরকারি প্রকল্প",   labelHi: "सरकारी योजनाएं" },
  login:         { path: "/login",         label: "Login",                labelBn: "লগইন",             labelHi: "लॉगिन" },
  register:      { path: "/register",      label: "Register",             labelBn: "নিবন্ধন",          labelHi: "पंजीकरण" },
  admin:         { path: "/admin",         label: "Admin Dashboard",      labelBn: "অ্যাডমিন ড্যাশবোর্ড", labelHi: "एडमिन डैशबोर्ड" },
  home:          { path: "/",             label: "Home",                 labelBn: "হোম",              labelHi: "होम" },
};

/* ── Crop knowledge base ─────────────────────────────────────────── */
const CROP_INFO = {
  rice: {
    en: "🌾 **Rice (Dhan)** — Best grown in Kharif season (Jun–Nov). Requires 20–40°C, 100–200 cm rainfall. Ideal soil pH: 5.5–6.5. Apply 80 kg N, 48 kg P, 40 kg K per hectare. Average yield in Eastern India: 2.5–3.5 tonnes/ha.",
    bn: "🌾 **ধান** — খরিফ মৌসুমে (জুন-নভেম্বর) সবচেয়ে ভালো জন্মায়। ২০-৪০°সে তাপমাত্রা এবং ১০০-২০০ সেমি বৃষ্টিপাত প্রয়োজন। আদর্শ মাটির pH: ৫.৫-৬.৫। প্রতি হেক্টরে ৮০ কেজি N, ৪৮ কেজি P, ৪০ কেজি K দিন। গড় ফলন: ২.৫-৩.৫ টন/হেক্টর।",
    hi: "🌾 **धान** — खरीफ सीजन (जून-नवंबर) में सबसे अच्छा उगता है। 20–40°C तापमान और 100–200 cm वर्षा चाहिए। आदर्श मिट्टी pH: 5.5–6.5। प्रति हेक्टेयर 80 kg N, 48 kg P, 40 kg K डालें। औसत पैदावार: 2.5–3.5 टन/हेक्टेयर।",
  },
  maize: {
    en: "🌽 **Maize** — Grows in both Kharif and Rabi. Needs 25–30°C, well-drained loamy soil. pH 6.0–7.5. Apply 150 kg N, 75 kg P, 40 kg K/ha. Yield: 3–4 tonnes/ha.",
    bn: "🌽 **ভুট্টা** — খরিফ ও রবি উভয় মৌসুমে জন্মায়। ২৫-৩০°সে এবং ভালো নিষ্কাশনযুক্ত মাটি প্রয়োজন। pH ৬.০-৭.৫। প্রতি হেক্টরে ১৫০ কেজি N, ৭৫ কেজি P, ৪০ কেজি K দিন। ফলন: ৩-৪ টন/হেক্টর।",
    hi: "🌽 **मक्का** — खरीफ और रबी दोनों में उगता है। 25–30°C और अच्छी जल निकासी वाली दोमट मिट्टी चाहिए। pH 6.0–7.5। प्रति हेक्टेयर 150 kg N, 75 kg P, 40 kg K। पैदावार: 3–4 टन/हेक्टेयर।",
  },
  jute: {
    en: "🌿 **Jute** — Kharif crop. Needs 24–37°C, 150–200 cm rainfall, alluvial soil. pH 6–7. Requires high N. Yield: 2–3 tonnes/ha of dry fibre.",
    bn: "🌿 **পাট** — খরিফ ফসল। ২৪-৩৭°সে, ১৫০-২০০ সেমি বৃষ্টি, পলি মাটি দরকার। pH ৬-৭। উচ্চ N প্রয়োজন। ফলন: ২-৩ টন/হেক্টর শুকনো আঁশ।",
    hi: "🌿 **जूट** — खरीफ फसल। 24–37°C, 150–200 cm वर्षा, जलोढ़ मिट्टी चाहिए। pH 6–7। अधिक N चाहिए। पैदावार: 2–3 टन/हेक्टेयर सूखा रेशा।",
  },
  banana: {
    en: "🍌 **Banana** — Grows year-round. Needs 20–35°C, 75–100 cm water. Rich loamy soil, pH 6–7.5. Heavy feeder: 200 kg N, 60 kg P, 300 kg K/ha/year. Yield: 15–25 tonnes/ha.",
    bn: "🍌 **কলা** — সারা বছর জন্মায়। ২০-৩৫°সে, ৭৫-১০০ সেমি জল প্রয়োজন। সমৃদ্ধ দোআঁশ মাটি, pH ৬-৭.৫। প্রচুর সার: ২০০ কেজি N, ৬০ কেজি P, ৩০০ কেজি K/হেক্টর/বছর। ফলন: ১৫-২৫ টন/হেক্টর।",
    hi: "🍌 **केला** — साल भर उगता है। 20–35°C, 75–100 cm पानी चाहिए। उपजाऊ दोमट मिट्टी, pH 6–7.5। भारी उर्वरक: 200 kg N, 60 kg P, 300 kg K/हेक्टेयर/वर्ष। पैदावार: 15–25 टन/हेक्टेयर।",
  },
  coconut: {
    en: "🥥 **Coconut** — Perennial crop. Needs 20–32°C, 100–300 cm rainfall, sandy loam. pH 5.2–8.0. Apply 500g N, 320g P, 1200g K per palm/year. Yield: 80–120 nuts/palm/year.",
    bn: "🥥 **নারকেল** — বহুবর্ষজীবী ফসল। ২০-৩২°সে, ১০০-৩০০ সেমি বৃষ্টি, বেলে দোআঁশ মাটি। pH ৫.২-৮.০। প্রতি গাছে বছরে ৫০০গ N, ৩২০গ P, ১২০০গ K। ফলন: ৮০-১২০ বাদাম/গাছ/বছর।",
    hi: "🥥 **नारियल** — बहुवर्षीय फसल। 20–32°C, 100–300 cm वर्षा, बलुई दोमट मिट्टी। pH 5.2–8.0। प्रति पेड़/वर्ष 500g N, 320g P, 1200g K। पैदावार: 80–120 फल/पेड़/वर्ष।",
  },
};

/* ── Government schemes quick-ref ────────────────────────────────── */
const SCHEMES_INFO = {
  en: "🏛️ **Key Govt. Schemes:**\n• **PM-KISAN** — ₹6,000/year direct income support\n• **PMFBY** — Crop insurance from 1.5% premium\n• **KCC** — Kisan Credit Card loans @ 4% p.a.\n• **PM-KSSY** — Drip/sprinkler irrigation subsidy\n• **Krishak Bandhu (WB)** — ₹10,000/acre/year\n• **KALIA (Odisha)** — ₹10,000/season support\n\nVisit /notifications for full details.",
  bn: "🏛️ **মূল সরকারি প্রকল্প:**\n• **PM-KISAN** — বার্ষিক ₹৬,০০০ সরাসরি সহায়তা\n• **PMFBY** — ১.৫% প্রিমিয়ামে ফসল বীমা\n• **KCC** — কিসান ক্রেডিট কার্ড ৪% সুদে ঋণ\n• **কৃষক বন্ধু (WB)** — ₹১০,০০০/একর/বছর\n• **KALIA (ওড়িশা)** — প্রতি মৌসুমে ₹১০,০০০\n\n/notifications-এ সম্পূর্ণ বিবরণ দেখুন।",
  hi: "🏛️ **मुख्य सरकारी योजनाएं:**\n• **PM-KISAN** — ₹6,000/वर्ष सीधी सहायता\n• **PMFBY** — 1.5% प्रीमियम पर फसल बीमा\n• **KCC** — 4% ब्याज पर किसान क्रेडिट कार्ड\n• **PM-KSSY** — ड्रिप/स्प्रिंकलर सिंचाई सब्सिडी\n• **कृषक बंधु (WB)** — ₹10,000/एकड़/वर्ष\n\n/notifications पर पूरी जानकारी देखें।",
};

/* ── Intent patterns ─────────────────────────────────────────────── */
const INTENTS = [
  // Greetings
  {
    patterns: { en: /^(hi|hello|hey|good\s?(morning|evening|afternoon)|namaste|namaskar)/i, bn: /নমস্কার|হ্যালো|হ্যালো|হেই|সুপ্রভাত|শুভ/i, hi: /नमस्ते|नमस्कार|हेलो|हाय|सुप्रभात/i },
    respond: (lang, user) => ({
      en: `👋 Hello${user?.name ? ", " + user.name.split(" ")[0] : ""}! I'm **Krishi**, your farming assistant. I can help you with:\n\n🌾 Crop advice & yield prediction\n🏛️ Government schemes & subsidies\n🛒 Marketplace navigation\n📂 File analysis\n🎤 Voice messages\n\nWhat would you like to know?`,
      bn: `👋 নমস্কার${user?.name ? ", " + user.name.split(" ")[0] : ""}! আমি **কৃষি**, আপনার কৃষি সহায়ক। আমি সাহায্য করতে পারি:\n\n🌾 ফসলের পরামর্শ ও ফলন পূর্বাভাস\n🏛️ সরকারি প্রকল্প ও ভর্তুকি\n🛒 মার্কেটপ্লেস\n📂 ফাইল বিশ্লেষণ\n\nআপনি কী জানতে চান?`,
      hi: `👋 नमस्ते${user?.name ? ", " + user.name.split(" ")[0] : ""}! मैं **कृषि** हूं, आपका कृषि सहायक। मैं इनमें मदद कर सकता हूं:\n\n🌾 फसल सलाह और पैदावार पूर्वानुमान\n🏛️ सरकारी योजनाएं\n🛒 बाज़ार\n📂 फ़ाइल विश्लेषण\n\nआप क्या जानना चाहते हैं?`,
    }[lang]),
    type: "text",
  },

  // Navigate — predict
  {
    patterns: { en: /predict|yield|forecast|फसल पूर्वाभास|ফসল পূর্বাভাস/i, bn: /পূর্বাভাস|ফলন|ভবিষ্যদ্বাণী|predict/i, hi: /पूर्वानुमान|उत्पादन|फसल|predict/i },
    respond: (lang) => ({
      en: "📊 I'll take you to the **Crop Yield Prediction** page! Fill in your farm details and our AI model will predict your yield with 90% confidence.",
      bn: "📊 আমি আপনাকে **ফসল ফলন পূর্বাভাস** পৃষ্ঠায় নিয়ে যাচ্ছি! আপনার খামারের তথ্য দিন এবং আমাদের AI মডেল ৯০% আস্থায় ফলন পূর্বাভাস দেবে।",
      hi: "📊 मैं आपको **फसल पैदावार पूर्वानुमान** पृष्ठ पर ले जा रहा हूं! अपने खेत की जानकारी भरें और हमारा AI मॉडल 90% विश्वास के साथ पैदावार बताएगा।",
    }[lang]),
    navigate: "/predict",
    type: "nav",
  },

  // Navigate — marketplace
  {
    patterns: { en: /market|buy|sell|shop|product|listing|বাজার|বাজারে/i, bn: /মার্কেট|কিনতে|বিক্রি|পণ্য|বাজার/i, hi: /बाज़ार|खरीद|बेच|मार्केट|उत्पाद/i },
    respond: (lang) => ({
      en: "🛒 Going to the **Marketplace**! You can browse crops, seeds, fertilisers, equipment and more — or list your own products as a seller.",
      bn: "🛒 **মার্কেটপ্লেসে** যাচ্ছি! আপনি ফসল, বীজ, সার, সরঞ্জাম দেখতে বা বিক্রেতা হিসেবে পণ্য যোগ করতে পারেন।",
      hi: "🛒 **बाज़ार** में जा रहे हैं! आप फसल, बीज, उर्वरक, उपकरण देख सकते हैं या विक्रेता के रूप में अपने उत्पाद सूचीबद्ध कर सकते हैं।",
    }[lang]),
    navigate: "/marketplace",
    type: "nav",
  },

  // Navigate — schemes / notifications
  {
    patterns: { en: /scheme|subsid|government|yojana|kisan|pmfby|pm.?kisan|notification/i, bn: /প্রকল্প|ভর্তুকি|সরকার|যোজনা|বিজ্ঞপ্তি/i, hi: /योजना|सब्सिडी|सरकार|अधिसूचना|किसान/i },
    respond: (lang) => ({
      en: "🏛️ Let me show you all **Government Schemes & Subsidies** available for farmers!\n\n" + SCHEMES_INFO.en,
      bn: "🏛️ আমি আপনাকে কৃষকদের জন্য সব **সরকারি প্রকল্প ও ভর্তুকি** দেখাচ্ছি!\n\n" + SCHEMES_INFO.bn,
      hi: "🏛️ मैं आपको किसानों के लिए सभी **सरकारी योजनाएं और सब्सिडी** दिखा रहा हूं!\n\n" + SCHEMES_INFO.hi,
    }[lang]),
    navigate: "/notifications",
    type: "nav",
  },

  // Navigate — login
  {
    patterns: { en: /log\s?in|sign\s?in|লগইন|login/i, bn: /লগইন|সাইন ইন/i, hi: /लॉगिन|साइन इन/i },
    respond: (lang) => ({
      en: "🔐 Taking you to the **Login** page.",
      bn: "🔐 **লগইন** পৃষ্ঠায় নিয়ে যাচ্ছি।",
      hi: "🔐 **लॉगिन** पृष्ठ पर ले जा रहे हैं।",
    }[lang]),
    navigate: "/login",
    type: "nav",
  },

  // Navigate — register
  {
    patterns: { en: /register|sign\s?up|create.?account|নিবন্ধন/i, bn: /নিবন্ধন|নিবন্ধিত|রেজিস্টার/i, hi: /पंजीकरण|रजिस्टर|अकाउंट बनाएं/i },
    respond: (lang) => ({
      en: "📝 Taking you to **Register**. Choose Farmer, Seller or Admin role!",
      bn: "📝 **নিবন্ধন** পৃষ্ঠায় নিয়ে যাচ্ছি। কৃষক, বিক্রেতা বা অ্যাডমিন ভূমিকা বেছে নিন!",
      hi: "📝 **पंजीकरण** पृष्ठ पर ले जा रहे हैं। किसान, विक्रेता या एडमिन भूमिका चुनें!",
    }[lang]),
    navigate: "/register",
    type: "nav",
  },

  // Crop queries
  {
    patterns: { en: /\b(rice|paddy|dhan|ধান|धान)\b/i, bn: /ধান|চাল|পাকা/i, hi: /धान|चावल|पैडी/i },
    respond: (lang) => CROP_INFO.rice[lang],
    type: "text",
  },
  {
    patterns: { en: /\b(maize|corn|ভুট্টা|मक्का)\b/i, bn: /ভুট্টা|ভুট্টার/i, hi: /मक्का|मकई|भुट्टा/i },
    respond: (lang) => CROP_INFO.maize[lang],
    type: "text",
  },
  {
    patterns: { en: /\b(jute|পাট|जूट)\b/i, bn: /পাট|পাটের/i, hi: /जूट|पाट/i },
    respond: (lang) => CROP_INFO.jute[lang],
    type: "text",
  },
  {
    patterns: { en: /\b(banana|kela|কলা|केला)\b/i, bn: /কলা|কলার/i, hi: /केला|केले/i },
    respond: (lang) => CROP_INFO.banana[lang],
    type: "text",
  },
  {
    patterns: { en: /\b(coconut|narikel|নারকেল|नारियल)\b/i, bn: /নারকেল|নারকেলের/i, hi: /नारियल|नारिकेल/i },
    respond: (lang) => CROP_INFO.coconut[lang],
    type: "text",
  },

  // Soil / fertiliser questions
  {
    patterns: { en: /soil|fertilizer|fertiliser|npk|nitrogen|phosphorus|potassium|ph|মাটি|সার|মৃদা/i, bn: /মাটি|সার|নাইট্রোজেন|ফসফরাস|পটাশিয়াম/i, hi: /मिट्टी|उर्वरक|खाद|नाइट्रोजन|फास्फोरस/i },
    respond: (lang) => ({
      en: "🧪 **Soil & Fertiliser Guide:**\n\n**N (Nitrogen)** — Promotes leaf growth. Deficiency: yellowing leaves. Apply urea.\n**P (Phosphorus)** — Root development. Deficiency: purple leaves. Apply DAP.\n**K (Potassium)** — Disease resistance. Deficiency: brown leaf edges. Apply MOP.\n**pH** — Ideal 6.0–7.0 for most crops. Below 6: add lime. Above 7.5: add sulphur.\n\nUse our **Strip Scanner** in the Predict page to auto-read your soil values from a test strip! 📷",
      bn: "🧪 **মাটি ও সার গাইড:**\n\n**N (নাইট্রোজেন)** — পাতার বৃদ্ধি বাড়ায়। ঘাটতি: হলুদ পাতা। ইউরিয়া দিন।\n**P (ফসফরাস)** — শিকড়ের বিকাশ। ঘাটতি: বেগুনি পাতা। DAP দিন।\n**K (পটাশিয়াম)** — রোগ প্রতিরোধ। ঘাটতি: পাতার কিনারা বাদামী। MOP দিন।\n**pH** — বেশিরভাগ ফসলের জন্য ৬.০-৭.০ আদর্শ।\n\nপ্রেডিক্ট পৃষ্ঠায় **স্ট্রিপ স্ক্যানার** ব্যবহার করে মাটির মান স্বয়ংক্রিয়ভাবে পড়ুন! 📷",
      hi: "🧪 **मिट्टी और उर्वरक गाइड:**\n\n**N (नाइट्रोजन)** — पत्ती वृद्धि। कमी: पीली पत्तियां। यूरिया डालें।\n**P (फास्फोरस)** — जड़ विकास। कमी: बैंगनी पत्तियां। DAP डालें।\n**K (पोटेशियम)** — रोग प्रतिरोध। कमी: भूरी पत्ती किनारे। MOP डालें।\n**pH** — अधिकांश फसलों के लिए 6.0–7.0 आदर्श।\n\nभविष्यवाणी पृष्ठ पर **स्ट्रिप स्कैनर** से मिट्टी मान स्वचालित रूप से पढ़ें! 📷",
    }[lang]),
    type: "text",
  },

  // Weather / climate
  {
    patterns: { en: /weather|rainfall|temperature|humidity|climate|আবহাওয়া|বৃষ্টি|मौसम/i, bn: /আবহাওয়া|বৃষ্টিপাত|তাপমাত্রা|আর্দ্রতা/i, hi: /मौसम|वर्षा|तापमान|आर्द्रता|जलवायु/i },
    respond: (lang) => ({
      en: "🌦️ **Climate Data:** Our app auto-fetches rainfall, temperature and humidity from the **NASA POWER API** when you select your state in the Predict form. No manual entry needed!\n\nEastern India averages:\n• Rainfall: 1200–1800 mm/year\n• Temperature: 15–40°C\n• Humidity: 60–85%",
      bn: "🌦️ **জলবায়ু তথ্য:** আমাদের অ্যাপ **NASA POWER API** থেকে স্বয়ংক্রিয়ভাবে বৃষ্টিপাত, তাপমাত্রা ও আর্দ্রতা নিয়ে আসে যখন আপনি রাজ্য বেছে নেন।\n\nপূর্ব ভারতের গড়:\n• বৃষ্টিপাত: ১২০০-১৮০০ মিমি/বছর\n• তাপমাত্রা: ১৫-৪০°সে\n• আর্দ্রতা: ৬০-৮৫%",
      hi: "🌦️ **जलवायु डेटा:** हमारा ऐप **NASA POWER API** से स्वचालित रूप से वर्षा, तापमान और आर्द्रता लाता है जब आप राज्य चुनते हैं।\n\nपूर्वी भारत औसत:\n• वर्षा: 1200–1800 mm/वर्ष\n• तापमान: 15–40°C\n• आर्द्रता: 60–85%",
    }[lang]),
    type: "text",
  },

  // Voice input help
  {
    patterns: { en: /voice|speak|microphone|mic|বাংলায় বলুন|hindi/i, bn: /ভয়েস|কথা বলুন|মাইক্রোফোন/i, hi: /आवाज़|बोलें|माइक्रोफोन/i },
    respond: (lang) => ({
      en: "🎤 **Voice Input:** Click the 🎤 button in this chat or on the Predict page. Speak in:\n• **Bengali** (বাংলা) — say crop names like 'ধান, কলা'\n• **Hindi** (हिंदी) — say 'धान, मक्का'\n• **English** — 'rice, kharif, West Bengal'\n\nI'll convert your speech to text automatically!",
      bn: "🎤 **ভয়েস ইনপুট:** এই চ্যাটে বা প্রেডিক্ট পৃষ্ঠায় 🎤 বোতামে ক্লিক করুন। বলুন:\n• **বাংলায়** — 'ধান, কলা, খরিফ'\n• **ইংরেজিতে** — 'rice, Kharif, West Bengal'\n\nআমি স্বয়ংক্রিয়ভাবে বক্তৃতা টেক্সটে রূপান্তর করব!",
      hi: "🎤 **वॉयस इनपुट:** इस चैट या भविष्यवाणी पृष्ठ पर 🎤 बटन क्लिक करें। बोलें:\n• **हिंदी में** — 'धान, मक्का, खरीफ'\n• **अंग्रेज़ी में** — 'rice, West Bengal'\n\nमैं स्वचालित रूप से भाषण को टेक्स्ट में बदलूंगा!",
    }[lang]),
    type: "text",
  },

  // About / what can you do
  {
    patterns: { en: /what.*(you|can|do|help)|about|feature|কী করতে|কী পারো/i, bn: /কী করতে|কী পারো|সম্পর্কে|ফিচার/i, hi: /क्या कर|कर सकते|जानकारी|फीचर/i },
    respond: (lang) => ({
      en: "🤖 **I'm Krishi — your AI farming assistant!**\n\nI can:\n🌾 Give crop-specific advice (Rice, Maize, Jute, Banana, Coconut)\n🧪 Explain soil health & fertiliser needs\n🌦️ Share climate information\n🏛️ Inform about government schemes\n🛒 Navigate you to the Marketplace\n📂 Read & summarise uploaded files\n🎤 Understand voice messages in 3 languages\n🗺️ Take you anywhere on the site\n\nJust ask me anything in **English**, **বাংলা** or **हिंदी**!",
      bn: "🤖 **আমি কৃষি — আপনার AI কৃষি সহায়ক!**\n\nআমি পারি:\n🌾 ফসল-নির্দিষ্ট পরামর্শ দিতে\n🧪 মাটির স্বাস্থ্য ব্যাখ্যা করতে\n🌦️ জলবায়ু তথ্য দিতে\n🏛️ সরকারি প্রকল্প জানাতে\n🛒 মার্কেটপ্লেসে নিয়ে যেতে\n📂 আপলোড করা ফাইল পড়তে\n🎤 ৩ ভাষায় ভয়েস বুঝতে\n\n**ইংরেজি**, **বাংলা** বা **হিন্দিতে** যেকোনো কিছু জিজ্ঞেস করুন!",
      hi: "🤖 **मैं कृषि — आपका AI कृषि सहायक!**\n\nमैं कर सकता हूं:\n🌾 फसल-विशिष्ट सलाह देना\n🧪 मिट्टी स्वास्थ्य समझाना\n🌦️ जलवायु जानकारी देना\n🏛️ सरकारी योजनाएं बताना\n🛒 बाज़ार में ले जाना\n📂 अपलोड फ़ाइलें पढ़ना\n🎤 3 भाषाओं में आवाज़ समझना\n\n**अंग्रेज़ी**, **बांग्ला** या **हिंदी** में कुछ भी पूछें!",
    }[lang]),
    type: "text",
  },

  // Thank you
  {
    patterns: { en: /thank|thanks|dhanyabad|ধন্যবাদ|धन्यवाद/i, bn: /ধন্যবাদ|আপনাকে ধন্যবাদ|শুক্রিয়া/i, hi: /धन्यवाद|शुक्रिया|थैंक/i },
    respond: (lang) => ({
      en: "🙏 You're welcome! Happy farming! 🌾 Feel free to ask anything anytime.",
      bn: "🙏 আপনাকে স্বাগতম! শুভ চাষাবাদ! 🌾 যেকোনো সময় যেকোনো প্রশ্ন করুন।",
      hi: "🙏 स्वागत है! खुशहाल खेती! 🌾 कभी भी कुछ भी पूछें।",
    }[lang]),
    type: "text",
  },

  // Goodbye
  {
    patterns: { en: /bye|goodbye|exit|close|বিদায়|अलविदा/i, bn: /বিদায়|আবার দেখা হবে/i, hi: /अलविदा|बाय|जाता हूं/i },
    respond: (lang) => ({
      en: "👋 Goodbye! Come back anytime for farming help. Good luck with your harvest! 🌾",
      bn: "👋 বিদায়! যেকোনো সময় কৃষি সহায়তার জন্য ফিরে আসুন। আপনার ফসলের জন্য শুভকামনা! 🌾",
      hi: "👋 अलविदा! खेती में मदद के लिए कभी भी वापस आएं। आपकी फसल के लिए शुभकामनाएं! 🌾",
    }[lang]),
    type: "text",
  },
];

/* ── File analysis ───────────────────────────────────────────────── */
export function analyseFile(file, lang = "en") {
  const name = file.name;
  const ext  = name.split(".").pop().toLowerCase();
  const size = (file.size / 1024).toFixed(1) + " KB";

  const typeMap = { pdf:"PDF document", txt:"text file", csv:"CSV spreadsheet",
    jpg:"JPEG image", jpeg:"JPEG image", png:"PNG image", xlsx:"Excel spreadsheet",
    docx:"Word document", json:"JSON data file" };

  const friendly = typeMap[ext] || `${ext.toUpperCase()} file`;

  const msgs = {
    en: `📄 I've received your **${friendly}** (${name}, ${size}).\n\n${ext === "csv" || ext === "xlsx" ? "This looks like farm data! I can help you understand yield records, soil test results, or expense sheets." : ext === "pdf" ? "This could be a soil health card, scheme document or farm report." : ext === "jpg" || ext === "jpeg" || ext === "png" ? "This looks like a photo — could be a crop, soil strip, or farm image. If it's a soil test strip, use the Strip Scanner on the Predict page for precise readings!" : "I can see the file has been uploaded."}\n\nWhat would you like me to help you with regarding this file?`,
    bn: `📄 আপনার **${friendly}** (${name}, ${size}) পেয়েছি।\n\n${ext === "csv" || ext === "xlsx" ? "এটি খামারের ডেটা মনে হচ্ছে! ফলন রেকর্ড, মাটি পরীক্ষার ফলাফল বুঝতে সাহায্য করতে পারি।" : ext === "jpg" || ext === "jpeg" || ext === "png" ? "এটি একটি ছবি — ফসল, মাটি স্ট্রিপ বা খামারের ছবি হতে পারে। মাটি পরীক্ষার স্ট্রিপ হলে প্রেডিক্ট পৃষ্ঠায় স্ট্রিপ স্ক্যানার ব্যবহার করুন!" : "ফাইলটি আপলোড হয়েছে।"}\n\nএই ফাইল নিয়ে আমি কীভাবে সাহায্য করতে পারি?`,
    hi: `📄 आपकी **${friendly}** (${name}, ${size}) मिल गई।\n\n${ext === "csv" || ext === "xlsx" ? "यह खेत का डेटा लगता है! पैदावार रिकॉर्ड, मिट्टी परीक्षण परिणाम समझने में मदद कर सकता हूं।" : ext === "jpg" || ext === "jpeg" || ext === "png" ? "यह एक फोटो लगती है — फसल, मिट्टी स्ट्रिप या खेत की तस्वीर हो सकती है। मिट्टी परीक्षण स्ट्रिप है तो भविष्यवाणी पृष्ठ पर स्ट्रिप स्कैनर उपयोग करें!" : "फ़ाइल अपलोड हो गई है।"}\n\nइस फ़ाइल के बारे में मैं कैसे मदद करूं?`,
  };
  return msgs[lang] || msgs.en;
}

/* ── Main respond function ───────────────────────────────────────── */
export function getBotResponse(text, lang, user) {
  const t = text.trim();
  if (!t) return null;

  // Match intents
  for (const intent of INTENTS) {
    const pat = intent.patterns[lang] || intent.patterns.en;
    if (pat && pat.test(t)) {
      const response = typeof intent.respond === "function"
        ? intent.respond(lang, user)
        : intent.respond;
      return { text: response, navigate: intent.navigate || null, type: intent.type || "text" };
    }
  }

  // Fallback
  const fallbacks = {
    en: `🤔 I'm not sure about that. Try asking me about:\n• A specific crop (rice, maize, jute, banana, coconut)\n• Government schemes\n• Soil & fertilisers\n• Or say "go to marketplace" / "predict yield"\n\nYou can also type in **বাংলা** or **हिंदी**!`,
    bn: `🤔 আমি নিশ্চিত নই। এগুলো জিজ্ঞেস করে দেখুন:\n• কোনো ফসল (ধান, ভুট্টা, পাট, কলা, নারকেল)\n• সরকারি প্রকল্প\n• মাটি ও সার\n• অথবা বলুন "মার্কেটপ্লেসে যাও" / "ফলন পূর্বাভাস"\n\nআপনি **English** বা **हिंदी**-তেও লিখতে পারেন!`,
    hi: `🤔 मुझे यकीन नहीं है। इनके बारे में पूछें:\n• कोई फसल (धान, मक्का, जूट, केला, नारियल)\n• सरकारी योजनाएं\n• मिट्टी और उर्वरक\n• या कहें "बाज़ार जाएं" / "पैदावार पूर्वानुमान"\n\nआप **English** या **বাংলা** में भी लिख सकते हैं!`,
  };
  return { text: fallbacks[lang] || fallbacks.en, navigate: null, type: "text" };
}
