(() => {
  const widget = `<section class="assistant" aria-label="Elmitech AI assistant">
    <div class="assistant-panel" id="assistant-panel" aria-labelledby="assistant-title" hidden>
      <div class="assistant-header"><span class="assistant-mark" aria-hidden="true">e</span><div><strong id="assistant-title">Elmitech AI</strong><small data-assistant-copy="subtitle">Friendly tech help · AI assistant</small></div><button class="assistant-close" type="button" aria-label="Close chat">×</button></div>
      <div class="assistant-disclosure" data-assistant-copy="disclosure">I’m Elmitech’s AI assistant. I can help with listed laptops and everyday tech questions. Prices and stock need human confirmation.</div>
      <div class="assistant-messages" id="assistant-messages" aria-live="polite" aria-relevant="additions text"></div>
      <div class="assistant-prompts" id="assistant-prompts"><button type="button" data-prompt="Help me choose a laptop">Help me choose</button><button type="button" data-prompt="Is the HP EliteBook 840 G6 good for video editing?">Video editing?</button></div>
      <form class="assistant-form" id="assistant-form"><label class="sr-only" for="assistant-input" data-assistant-copy="inputLabel">Ask Elmitech AI</label><input id="assistant-input" name="message" maxlength="600" autocomplete="off" placeholder="Ask me anything about tech…" required><button type="submit" aria-label="Send message">↑</button></form>
      <div class="assistant-foot"><span data-assistant-copy="privacy">Please don’t share passwords or payment details.</span><a href="https://wa.me/254729111898" target="_blank" rel="noreferrer" data-assistant-copy="human">Talk to our team ↗</a></div>
    </div>
    <button class="assistant-launcher" id="assistant-launcher" type="button" aria-expanded="false" aria-controls="assistant-panel"><span class="assistant-launcher-icon" aria-hidden="true">✳</span><span data-assistant-copy="open">Ask Elmitech AI</span></button>
  </section>`;
  if (document.querySelector('.assistant')) return;
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'assistant.css';
  document.head.append(css);
  document.body.insertAdjacentHTML('beforeend', widget);
  const script = document.createElement('script');
  script.src = 'assistant.js';
  script.defer = true;
  document.body.append(script);
})();
