(() => {
  const panel = document.getElementById('assistant-panel');
  const launcher = document.getElementById('assistant-launcher');
  const closeButton = document.querySelector('.assistant-close');
  const form = document.getElementById('assistant-form');
  const input = document.getElementById('assistant-input');
  const messages = document.getElementById('assistant-messages');
  const prompts = document.getElementById('assistant-prompts');
  const languageSelect = document.getElementById('language');
  if (!panel || !launcher || !form || !input || !messages) return;

  const copy = {
    en: {
      subtitle: 'Friendly tech help · AI assistant',
      disclosure: 'I’m Elmitech’s AI assistant. I can help with listed laptops and everyday tech questions. Prices and stock need human confirmation.',
      privacy: 'Please don’t share passwords or payment details.',
      human: 'Talk to our team ↗',
      open: 'Ask Elmitech AI',
      close: 'Close chat',
      inputLabel: 'Ask Elmitech AI',
      placeholder: 'Ask me anything about tech…',
      send: 'Send message',
      help: 'Help me choose',
      editing: 'Video editing?',
      welcome: 'Hi! Tell me what you want to use a laptop for and, if you have one, your budget. I’ll help you compare that with what Elmitech has listed.',
      setup: 'I’m still being connected. You can ask our team on WhatsApp while I’m being set up.',
      error: 'Sorry, I couldn’t answer just now. Please try again or ask our team on WhatsApp.',
      limited: 'That’s a lot for one message. Please shorten it and try again.',
      waiting: 'One moment…',
      unavailable: 'AI chat is temporarily unavailable.'
    },
    sw: {
      subtitle: 'Msaada wa teknolojia · Msaidizi wa AI',
      disclosure: 'Mimi ni msaidizi wa AI wa Elmitech. Naweza kusaidia kuhusu laptop zilizoorodheshwa na maswali ya kawaida ya teknolojia. Bei na upatikanaji vinahitaji kuthibitishwa na mtu.',
      privacy: 'Tafadhali usishiriki nywila au maelezo ya malipo.',
      human: 'Zungumza na timu yetu ↗',
      open: 'Uliza Elmitech AI',
      close: 'Funga mazungumzo',
      inputLabel: 'Uliza Elmitech AI',
      placeholder: 'Uliza kuhusu teknolojia…',
      send: 'Tuma ujumbe',
      help: 'Nisaidie kuchagua',
      editing: 'Kuhariri video?',
      welcome: 'Habari! Niambie unataka kutumia laptop kwa kazi gani na bajeti yako ikiwa unayo. Nitakusaidia kulinganisha mahitaji yako na laptop zilizoorodheshwa Elmitech.',
      setup: 'Bado naunganishwa. Unaweza kuuliza timu yetu kupitia WhatsApp ninapoandaliwa.',
      error: 'Samahani, sikuweza kujibu sasa. Jaribu tena au uliza timu yetu kupitia WhatsApp.',
      limited: 'Ujumbe ni mrefu sana. Tafadhali ufupishe kisha ujaribu tena.',
      waiting: 'Subiri kidogo…',
      unavailable: 'Msaidizi wa AI hapatikani kwa sasa.'
    },
    so: {
      subtitle: 'Caawimo tiknoolajiyadeed · Kaaliye AI',
      disclosure: 'Waxaan ahay kaaliyaha AI ee Elmitech. Waxaan kaa caawin karaa laptop-yada bogga ku qoran iyo su’aalaha guud ee tiknoolajiyada. Qiimaha iyo helitaanka waa in qof xaqiijiyaa.',
      privacy: 'Fadlan ha wadaagin furaha sirta ah ama xogta lacag-bixinta.',
      human: 'La hadal kooxdayada ↗',
      open: 'Weydii Elmitech AI',
      close: 'Xir sheekada',
      inputLabel: 'Weydii Elmitech AI',
      placeholder: 'Wax iga weydii tiknoolajiyada…',
      send: 'Dir fariinta',
      help: 'Iga caawi doorashada',
      editing: 'Tafatirka muuqaalka?',
      welcome: 'Salaan! Ii sheeg waxa aad laptop-ka u adeegsanayso iyo miisaaniyaddaada haddii aad leedahay. Waxaan kaa caawin doonaa inaad baahidaada la barbar dhigto laptop-yada Elmitech ku qoran.',
      setup: 'Weli waa la ii diyaarinayaa. Inta la i xiriirinayo, waxaad kooxdayada kala xiriiri kartaa WhatsApp.',
      error: 'Waan ka xunnahay, hadda kama jawaabi karo. Mar kale isku day ama WhatsApp kala xiriir kooxdayada.',
      limited: 'Fariintu aad bay u dheer tahay. Fadlan soo gaabi oo mar kale isku day.',
      waiting: 'Hal daqiiqo…',
      unavailable: 'Kaaliyaha AI si ku-meel-gaar ah uma shaqaynayo.'
    }
  };

  const history = [];
  let greeted = false;
  let busy = false;
  const currentCopy = () => copy[document.documentElement.lang] || copy.en;

  function updateLanguage() {
    const text = currentCopy();
    document.querySelectorAll('[data-assistant-copy]').forEach((element) => {
      const key = element.dataset.assistantCopy;
      if (text[key]) element.textContent = text[key];
    });
    closeButton.setAttribute('aria-label', text.close);
    input.setAttribute('aria-label', text.inputLabel);
    input.placeholder = text.placeholder;
    form.querySelector('button').setAttribute('aria-label', text.send);
    prompts.querySelector('[data-prompt="Help me choose a laptop"]').textContent = text.help;
    prompts.querySelector('[data-prompt="Is the HP EliteBook 840 G6 good for video editing?"]').textContent = text.editing;
  }

  function addMessage(text, kind) {
    const item = document.createElement('div');
    item.className = `assistant-message ${kind}`;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!greeted) {
        addMessage(currentCopy().welcome, 'assistant-reply');
        greeted = true;
      }
      input.focus();
    } else {
      launcher.focus();
    }
  }

  async function sendMessage(value) {
    const message = value.trim();
    if (!message || busy) return;
    if (message.length > 600) {
      addMessage(currentCopy().limited, 'assistant-reply assistant-error');
      return;
    }

    addMessage(message, 'user-message');
    history.push({ role: 'user', content: message });
    input.value = '';
    prompts.hidden = true;
    busy = true;
    const sendButton = form.querySelector('button');
    sendButton.disabled = true;
    const pending = addMessage(currentCopy().waiting, 'assistant-reply');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ language: document.documentElement.lang, messages: history.slice(-8) })
      });
      const result = await response.json().catch(() => ({}));
      pending.remove();
      if (!response.ok) {
        if (result.error === 'assistant_not_configured') addMessage(currentCopy().setup, 'assistant-reply assistant-error');
        else addMessage(currentCopy().error, 'assistant-reply assistant-error');
        return;
      }
      const answer = typeof result.answer === 'string' && result.answer.trim() ? result.answer.trim() : currentCopy().error;
      addMessage(answer, 'assistant-reply');
      history.push({ role: 'assistant', content: answer });
      if (history.length > 8) history.splice(0, history.length - 8);
    } catch {
      pending.remove();
      addMessage(currentCopy().error, 'assistant-reply assistant-error');
    } finally {
      busy = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });
  prompts.addEventListener('click', (event) => {
    const button = event.target.closest('[data-prompt]');
    if (button) sendMessage(button.dataset.prompt);
  });
  languageSelect.addEventListener('change', () => requestAnimationFrame(updateLanguage));
  updateLanguage();
})();

