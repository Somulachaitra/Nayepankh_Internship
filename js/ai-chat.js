/* ===========================================
   AI Chat - Intelligent Pattern Matcher
   Simulated NLP engine for NayePankh
   =========================================== */

class NPChatBot {
  constructor() {
    this.knowledge = {
      donate: {
        keywords: ['donate', 'donation', 'money', 'contribute', 'fund', 'give', 'pay', ' rupees', '₹', 'gift', 'support financially'],
        response: `Thank you for wanting to support our cause! 💛

You can donate in several ways:
• **One-time donation** – Any amount via our secure gateway
• **Monthly sponsorship** – Sponsor a child's education (₹2,500/month)
• **In-kind gifts** – Clothes, food, sanitary pads, books
• **Corporate CSR partnerships** – Partner your company

All donations are **80G tax-exempted**. Visit our <a href="pages/donate.html">Donate page</a> or contact us at contact@nayepankh.com.

Every ₹500 you donate provides school supplies for 5 children for a month! 🎓`,
        suggestions: ['How much should I donate?', 'What does my donation fund?', 'Is donation tax-deductible?']
      },
      volunteer: {
        keywords: ['volunteer', 'join', 'help', 'time', 'work with', 'be part', 'member', 'contribute time', 'sign up'],
        response: `Wonderful! We love welcoming new volunteers 🙌

Here's how you can join us:
• **On-ground volunteering** – Food distribution, teaching, event support
• **Skill-based volunteering** – Design, content writing, social media, tech
• **Remote volunteering** – Translation, research, fundraising support
• **Internships** – For students looking to gain NGO experience

Just fill the form on our <a href="pages/volunteer.html">Volunteer page</a> and we'll match you with the right opportunity based on your skills and availability!

🧑‍🤝‍🧑 Join 500+ active volunteers across Kanpur, Ghaziabad & other cities.`,
        suggestions: ['What skills are needed?', 'Time commitment?', 'Is there an age requirement?']
      },
      programs: {
        keywords: ['program', 'initiative', 'project', 'work', 'what do you do', 'activities', 'mission', 'service'],
        response: `We run several impactful programs across India:

📚 **Padho Padhao** – Free education & school supplies for underprivileged children
🍱 **Anna Daan** – Nutritious meal distribution in slum areas
🩹 **Sakhi** – Menstrual hygiene & sanitary pad distribution
👕 **Vastra Daan** – Clothing drives for families in need
🌱 **Skill Shakti** – Vocational training & livelihood programs
💻 **Digital Saksharta** – Computer & digital literacy workshops

Each program has impacted thousands of lives. Want to know about a specific one?`,
        suggestions: ['Tell me about Sakhi', 'What is Anna Daan?', 'How can I sponsor a program?']
      },
      impact: {
        keywords: ['impact', 'how many', 'people helped', 'numbers', 'statistics', 'achievement', 'success', 'reach'],
        response: `We're proud of the impact we've made together! 🌟

📊 **Our Impact So Far:**
• **2,00,000+** lives touched directly
• **50,000+** meals served
• **15,000+** children educated
• **8,000+** women supported with hygiene products
• **120+** active student volunteers
• Operations in **10+ cities** across UP

And we're just getting started! Each day, our team reaches more families who need support. Your contribution – big or small – fuels this impact. 🚀`,
        suggestions: ['Where do you operate?', 'How do I track my donation impact?', 'Annual report?']
      },
      contact: {
        keywords: ['contact', 'reach', 'phone', 'email', 'address', 'call', 'message', 'talk to', 'office', 'location'],
        response: `We'd love to hear from you! 📞

📧 **Email:** contact@nayepankh.com
📱 **Phone:** +91-8318500748
📍 **Head Office:** Kanpur, Uttar Pradesh, India

🌐 **Social Media:**
• Instagram: @nayepankhfoundation
• LinkedIn: NayePankh Foundation
• Facebook: /nayepankhfoundation
• YouTube: @nayepankhfoundation
• Twitter: @nayepankh

You can also fill the form on our <a href="pages/contact.html">Contact page</a>. We typically respond within 24 hours! ⚡`,
        suggestions: ['Office hours?', 'Visit the foundation?', 'Speak to founder?']
      },
      founder: {
        keywords: ['founder', 'prashant', 'shukla', 'president', 'leader', 'who started', 'history', 'about founder'],
        response: `Meet our inspiring leader! ✨

**Prashant Shukla** – Founder & President

*"If we all do something, then together there is no problem that we cannot solve!"*

Prashant founded NayePankh Foundation in 2020 with a vision to empower India's underprivileged communities. Starting as a student-led initiative, he has built it into one of the largest student-led NGOs in India, touching over 2 lakh lives.

His leadership philosophy centers on grassroots impact, student empowerment, and sustainable change. He continues to mentor a new generation of change-makers across the country.

Want to know more about our journey? Visit the <a href="pages/about.html">About page</a>. 🌟`,
        suggestions: ['When was it founded?', 'Team members?', 'Vision and mission?']
      },
      certificate: {
        keywords: ['certificate', 'registration', 'legal', '80g', '12a', 'registered', 'verification', 'authentic', 'trust'],
        response: `NayePankh Foundation is fully registered and transparent! ✅

📜 **Our Credentials:**
• **UP Government Registered NGO**
• **80G Certified** – All donations are tax-deductible
• **12A Registered** – Income tax exemption
• **CSR Registered** – Eligible for corporate CSR funding

All certificates are publicly available. View them on our <a href="pages/certificates.html">Certificates page</a>.

Trust and transparency are at the core of everything we do. We publish annual reports and maintain complete financial transparency. 🔍`,
        suggestions: ['How to verify?', 'Annual report?', 'Financial transparency?']
      },
      education: {
        keywords: ['education', 'teach', 'school', 'learn', 'student', 'child', 'kid', 'tuition', 'class', 'padho'],
        response: `Education is the heart of our mission! 📚

🎓 **Our Education Initiatives:**
• **Padho Padhao** – Free tuition centers in slum communities
• **Digital Saksharta** – Computer literacy for first-generation learners
• **School Kit Distribution** – Bags, books, uniforms for underprivileged kids
• **Scholarship Programs** – Higher education support for meritorious students
• **Mentorship** – Connecting students with professionals

We've supported **15,000+ students** in continuing their education. Many of our sponsored students are now in colleges and pursuing careers!

Want to teach or donate books? <a href="pages/volunteer.html">Join us →</a>`,
        suggestions: ['Sponsor a child?', 'Donate books?', 'Teach a class?']
      },
      women: {
        keywords: ['women', 'sakhi', 'sanitary', 'hygiene', 'pad', 'menstrual', 'girl', 'female', 'empower'],
        response: `Empowering women & girls is one of our pillars! 🌸

🩷 **Sakhi – Menstrual Hygiene Program**
• Free sanitary pad distribution
• Awareness workshops in schools & communities
• Breaking taboos around menstruation
• Supporting 8,000+ women & girls annually

👩‍🎓 **Other Women-Centric Programs:**
• Self-defense workshops
• Skill training (tailoring, beauty, computer skills)
• Health & nutrition camps
• Micro-enterprise support

We believe empowered women transform entire communities. Together, we're making this real. ✊`,
        suggestions: ['How to support Sakhi?', 'Volunteer for women programs?', 'Sponsor a workshop?']
      },
      food: {
        keywords: ['food', 'meal', 'anna', 'hungry', 'eat', 'lunch', 'dinner', 'ration', 'nutrition'],
        response: `No one should sleep hungry. 🍱

🥗 **Anna Daan – Food Distribution Program**
• Daily meals for slum families
• Weekend food drives in 10+ cities
• Ration kit distribution during crises
• Nutrition support for malnourished children

📊 **By the numbers:**
• **50,000+ meals served**
• **12,000+ ration kits distributed**
• **Partnerships** with local restaurants & caterers

Every contribution helps put a meal on someone's plate. Even ₹50 can feed a child for a day! 🍚`,
        suggestions: ['Sponsor meals?', 'Partner as a restaurant?', 'Food drive events?']
      },
      greeting: {
        keywords: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'good morning', 'good evening', 'greetings', 'hola'],
        response: `Namaste! 🙏 I'm Pankh AI, your virtual guide to NayePankh Foundation!

I can help you with:
• 🤝 Information about our programs & initiatives
• 💰 Donation guidance & tax benefits
• 🙌 Volunteer opportunities
• 📊 Impact statistics & success stories
• 📞 Contact information & office locations

What would you like to know today? Feel free to ask in any way you like! 😊`,
        suggestions: ['What programs do you run?', 'How can I donate?', 'How do I volunteer?']
      },
      thanks: {
        keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'wonderful', 'amazing', 'helpful'],
        response: `You're so welcome! 😊 It means a lot to us.

Together, we're creating real change in the lives of those who need it most. Whether you donate, volunteer, or simply spread the word — every action matters. 🌟

Is there anything else I can help you with?`,
        suggestions: ['Tell me about impact', 'How to donate?', 'Other questions']
      }
    };

    this.fallback = `That's a great question! 🤔 While I'm still learning, here's how I can help:

• Learn about our **programs** and **initiatives**
• Get info on **donations** and tax benefits
• Explore **volunteer** opportunities
• Check our **impact** statistics
• Reach our **contact** team

Try asking me about any of these topics, or rephrase your question. Our human team is also just a message away at contact@nayepankh.com! 💛`;

    this.greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar'];
    this.farewells = ['bye', 'goodbye', 'see you', 'take care', 'cya'];
  }

  findBestMatch(message) {
    const msg = message.toLowerCase().trim();
    let best = { key: null, score: 0 };

    for (const [key, data] of Object.entries(this.knowledge)) {
      let score = 0;
      for (const kw of data.keywords) {
        if (msg.includes(kw)) {
          score += kw.length > 5 ? 2 : 1;
        }
      }
      if (score > best.score) best = { key, score };
    }

    return best.score > 0 ? this.knowledge[best.key] : null;
  }

  respond(message) {
    const msg = message.toLowerCase().trim();

    if (this.farewells.some(f => msg.includes(f))) {
      return `Goodbye! 👋 Thank you for your interest in NayePankh Foundation. Together, we make a difference. Come back anytime! 🌟`;
    }

    const match = this.findBestMatch(message);
    return match ? match.response : this.fallback;
  }

  getSuggestions(message) {
    const match = this.findBestMatch(message);
    return match ? match.suggestions : ['What programs do you run?', 'How can I donate?', 'How do I volunteer?'];
  }
}

/* ===========================================
   Chat UI Controller
   =========================================== */

class ChatUI {
  constructor(bot, options = {}) {
    this.bot = bot;
    this.options = { widgetSelector: '.ai-chat-widget', fullPage: false, ...options };
    this.init();
  }

  init() {
    if (this.options.fullPage) {
      this.body = document.querySelector('.ai-chat-full .chat-body');
      this.form = document.querySelector('.ai-chat-full .chat-input-area');
      this.input = this.form?.querySelector('.chat-input');
      this.sendBtn = this.form?.querySelector('.chat-send');
      this.suggestionsEl = document.querySelector('.ai-chat-full .chat-suggestions');
    } else {
      this.body = document.querySelector('.chat-window .chat-body');
      this.form = document.querySelector('.chat-window .chat-input-area');
      this.input = this.form?.querySelector('.chat-input');
      this.sendBtn = this.form?.querySelector('.chat-send');
      this.suggestionsEl = document.querySelector('.chat-window .chat-suggestions');
      this.bindToggle();
    }

    if (!this.body) return;
    this.bindSend();
    this.greet();
  }

  bindToggle() {
    const widget = document.querySelector(this.options.widgetSelector);
    if (!widget) return;
    const toggle = widget.querySelector('.chat-toggle');
    const close = widget.querySelector('.chat-close');
    const win = widget.querySelector('.chat-window');

    toggle?.addEventListener('click', () => {
      win.classList.add('open');
      this.input?.focus();
    });
    close?.addEventListener('click', () => {
      win.classList.remove('open');
    });
  }

  bindSend() {
    this.sendBtn?.addEventListener('click', () => this.send());
    this.input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });

    // Click suggestions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('chat-suggestion')) {
        const text = e.target.textContent;
        this.handleUser(text);
        this.refreshSuggestions('');
      }
    });
  }

  greet() {
    this.addMessage(this.bot.respond('hello'), 'bot');
    this.refreshSuggestions('hello');
  }

  send() {
    const text = this.input.value.trim();
    if (!text) return;
    this.handleUser(text);
    this.input.value = '';
  }

  handleUser(text) {
    this.addMessage(text, 'user');
    this.showTyping();

    // Try Gemini API via backend, fall back to local keyword matching
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
      .then(res => res.json())
      .then(data => {
        this.removeTyping();
        if (data.response) {
          // Convert markdown bold (**text**) to HTML <strong> for display
          const formatted = data.response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
          this.addMessage(formatted, 'bot');
        } else {
          // API returned fallback flag — use local matcher
          const response = this.bot.respond(text);
          this.addMessage(response, 'bot');
        }
        this.refreshSuggestions(text);
      })
      .catch(() => {
        // Network error — use local keyword matcher as fallback
        this.removeTyping();
        const response = this.bot.respond(text);
        this.addMessage(response, 'bot');
        this.refreshSuggestions(text);
      });
  }

  addMessage(html, who) {
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    div.innerHTML = html;
    this.body.appendChild(div);
    this.body.scrollTop = this.body.scrollHeight;
  }

  showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    div.id = 'typing-indicator';
    this.body.appendChild(div);
    this.body.scrollTop = this.body.scrollHeight;
  }

  removeTyping() {
    document.getElementById('typing-indicator')?.remove();
  }

  refreshSuggestions(lastMsg) {
    if (!this.suggestionsEl) return;
    const suggestions = this.bot.getSuggestions(lastMsg);
    this.suggestionsEl.innerHTML = '';
    suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = s;
      this.suggestionsEl.appendChild(btn);
    });
  }
}

/* ---------- Initialize ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const bot = new NPChatBot();

  // Floating widget on every page (except full-page AI page)
  const isAIPage = !!document.querySelector('.ai-chat-full');
  if (!isAIPage) {
    new ChatUI(bot, { fullPage: false });
  } else {
    new ChatUI(bot, { fullPage: true });
  }

  // Expose globally for impact calculator & other pages
  window.NPBot = bot;
});
