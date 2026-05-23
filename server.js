import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

function classifyIntent(message = "") {
  message = message.toLowerCase();

  if (message.includes("hack") || message.includes("hacked")) {
    return "account_hacked";
  }

  if (
    message.includes("scam") ||
    message.includes("fraud") ||
    message.includes("phishing")
  ) {
    return "scam";
  }

  if (
    message.includes("threat") ||
    message.includes("blackmail")
  ) {
    return "threat";
  }

  return "unknown";
}

function getResponse(intent, lang = "en") {
  const responses = {
    account_hacked: {
      en: "Your account may be compromised. Change your password immediately, enable 2FA, and review recent login activity.",
      np: "तपाईंको खाता ह्याक भएको हुन सक्छ। तुरुन्त पासवर्ड परिवर्तन गर्नुहोस् र 2FA सक्षम गर्नुहोस्।"
    },
    scam: {
      en: "Avoid sharing personal details. Report the scam to the Cyber Bureau and change sensitive passwords.",
      np: "व्यक्तिगत जानकारी नदिनुहोस्। साइबर ब्यूरोलाई रिपोर्ट गर्नुहोस्।"
    },
    threat: {
      en: "Do not respond to threats or blackmail. Save screenshots and contact authorities immediately.",
      np: "धम्कीको जवाफ नदिनुहोस्। प्रमाण सुरक्षित गर्नुहोस् र सम्बन्धित निकायमा सम्पर्क गर्नुहोस्।"
    },
    unknown: {
      en: "Please describe the issue in more detail so I can help you better.",
      np: "कृपया समस्याको थप विवरण दिनुहोस्।"
    }
  };

  return responses[intent]?.[lang] || responses[intent]?.en;
}

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "CERA+ backend is running"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message, lang } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const intent = classifyIntent(message);
    const reply = getResponse(intent, lang);

    res.json({
      success: true,
      intent,
      reply
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
