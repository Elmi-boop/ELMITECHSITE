(() => {
  const WA = '254729111898';
  const language = () => localStorage.getItem('elmitech-language') || document.documentElement.lang || 'en';
  const textFor = (item, field) => item[`${field}${language() === 'sw' ? 'Sw' : language() === 'so' ? 'So' : ''}`] || item[field] || '';
  const node = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
  const imagePath = value => value ? (value.startsWith('/') || /^https?:/i.test(value) ? value : `/${value.replace(/^\.\//, '')}`) : '';
  const whatsapp = (name) => `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Elmitech, I’m interested in the ${name}. Please confirm today’s price, availability, condition, photos and delivery cost.`)}`;

  function productCard(item, compact = false) {
    const card = node('article', compact ? 'product-card cms-product-card' : 'catalog-card cms-product-card');
    card.id = item.slug || '';
    const photo = node('div', compact ? 'product-image' : 'catalog-photo');
    if (item.images?.length) {
      if (compact) { const badge = node('span', 'product-tag', 'FEATURED PICK'); photo.append(badge); }
      const img = node('img'); img.src = imagePath(item.images[0]); img.alt = `${item.name} laptop`;
      photo.append(img);
      if (item.images.length > 1) {
        const gallery = node('div', 'cms-gallery-thumbs');
        item.images.forEach((path, index) => {
          const thumb = node('button', 'cms-gallery-thumb'); thumb.type = 'button';
          thumb.setAttribute('aria-label', `Show photo ${index + 1} of ${item.images.length}`);
          const image = node('img'); image.src = imagePath(path); image.alt = `${item.name} photo ${index + 1}`;
          thumb.append(image);
          thumb.addEventListener('click', () => { img.src = imagePath(path); img.alt = image.alt; });
          gallery.append(thumb);
        });
        photo.append(gallery);
      }
    } else {
      photo.classList.add('catalog-photo-placeholder');
      const placeholder = node('div'); placeholder.append(node('span', '', 'ELMITECH FEATURED'), node('strong', '', item.name));
      placeholder.append(node('p', '', 'Ask us for current unit photos'));
      photo.append(placeholder);
    }
    const copy = node('div', compact ? 'product-info' : 'catalog-copy');
    copy.append(node('div', compact ? 'product-kicker' : 'eyebrow', `${item.brand || 'ELMITECH'} · ${item.category || 'TECH'}${item.condition ? ` · ${item.condition}` : ''}`));
    const title = node(compact ? 'h3' : 'h2', '', textFor(item, 'name')); copy.append(title);
    copy.append(node('p', compact ? 'product-summary' : '', textFor(item, 'description')));
    const spec = item.specifications || {};
    const specEntries = [['Processor', spec.processor], ['Memory', spec.memory], ['Storage', spec.storage], ['Display', spec.display], ['Graphics', spec.graphics], ['Battery', spec.battery], ['Ports', spec.ports]].filter(([, value]) => value);
    if (specEntries.length) {
      if (compact) {
        const grid = node('div', 'spec-grid');
        specEntries.slice(0, 4).forEach(([label, value]) => { const cell = node('div'); cell.append(node('span', '', label.toUpperCase()), node('strong', '', value)); grid.append(cell); });
        copy.append(grid);
      } else {
        const ul = node('ul', 'catalog-specs');
        specEntries.forEach(([label, value]) => { const li = node('li'); const strong = node('strong', '', `${label}: `); li.append(strong, document.createTextNode(value)); ul.append(li); });
        copy.append(ul);
      }
    }
    if (item.warranty) copy.append(node('p', 'cms-warranty', `Warranty: ${item.warranty}`));
    const bottom = node('div', compact ? 'product-bottom' : 'cms-product-actions');
    const price = item.price ? `KSh ${Number(item.price).toLocaleString('en-KE')}` : (item.priceLabel || 'Ask us for today’s price');
    bottom.append(node('span', compact ? 'ask-price' : 'catalog-price', price));
    const ask = node('a', compact ? 'button button-dark' : 'button button-dark', compact ? 'Ask on WhatsApp ↗' : 'Ask on WhatsApp');
    ask.href = whatsapp(item.name); ask.target = '_blank'; ask.rel = 'noreferrer'; bottom.append(ask); copy.append(bottom);
    if (!compact) {
      const more = node('details', 'cms-more'); more.append(node('summary', '', 'More details'));
      specEntries.slice(4).forEach(([label, value]) => { const p = node('p'); p.append(node('strong', '', `${label}: `), document.createTextNode(value)); more.append(p); });
      if (item.warranty) more.append(node('p', '', `Warranty: ${item.warranty}`));
      copy.append(more);
    }
    card.append(photo, copy); return card;
  }

  function articleCard(item) {
    const card = node('article', 'info-card cms-article');
    if (item.coverImage) { const image = node('img', 'cms-article-cover'); image.src = imagePath(item.coverImage); image.alt = ''; card.append(image); }
    card.append(node('div', 'eyebrow', `${item.category || 'TECH GUIDE'}${item.date ? ` · ${item.date}` : ''}`));
    card.append(node('h2', '', textFor(item, 'title')));
    card.append(node('p', '', textFor(item, 'summary')));
    if (textFor(item, 'body')) {
      const body = node('details', 'cms-article-expand'); body.append(node('summary', '', language() === 'so' ? 'Akhri maqaalka' : language() === 'sw' ? 'Soma makala' : 'Read article'));
      body.append(node('p', 'cms-article-body', textFor(item, 'body'))); card.append(body);
    }
    return card;
  }

  function getVideoId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0];
      if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || u.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] || '';
    } catch (_) {}
    return '';
  }
  function videoCard(item) {
    const card = node('article', 'video-card cms-video-card');
    card.append(node('div', 'eyebrow', `${item.platform || 'VIDEO'}${item.topic ? ` · ${item.topic}` : ''}`));
    card.append(node('h2', '', textFor(item, 'title')));
    if (item.summary) card.append(node('p', '', textFor(item, 'summary')));
    const id = getVideoId(item.url || '');
    if (id) {
      const start = node('button', 'cms-video-start'); start.type = 'button';
      if (item.thumbnail) { const img = node('img'); img.src = imagePath(item.thumbnail); img.alt = ''; start.append(img); }
      start.append(node('span', 'cms-play-icon', '▶'));
      start.setAttribute('aria-label', `Play ${textFor(item, 'title')}`);
      start.addEventListener('click', () => {
        const frame = document.createElement('iframe'); frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
        frame.title = textFor(item, 'title'); frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.allowFullscreen = true; frame.loading = 'lazy';
        start.replaceWith(frame);
      }, { once: true });
      card.append(start);
    }
    const link = node('a', 'text-link', 'Watch on YouTube ↗'); link.href = item.url || 'https://www.youtube.com/@elmitech'; link.target = '_blank'; link.rel = 'noreferrer'; card.append(link);
    return card;
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `.cms-product-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:22px}.cms-product-actions .button{white-space:nowrap}.cms-warranty,.cms-more,.cms-article-expand{font-size:12px;color:#66697b}.cms-more,.cms-article-expand{margin-top:12px}.cms-more summary,.cms-article-expand summary{cursor:pointer;color:#293fe0}.cms-gallery-thumbs{display:flex;gap:7px;position:absolute;left:10px;right:10px;bottom:10px;overflow:auto}.cms-gallery-thumb{width:48px;height:42px;flex:0 0 auto;padding:2px;border:1px solid #ddd;background:white;cursor:pointer}.cms-gallery-thumb img{width:100%;height:100%;object-fit:cover}.cms-product-card .catalog-photo,.cms-product-card .product-image{position:relative}.cms-video-start{position:relative;display:block;width:100%;aspect-ratio:16/9;border:0;background:#171747;cursor:pointer;overflow:hidden;margin:18px 0}.cms-video-start img{width:100%;height:100%;object-fit:cover}.cms-play-icon{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;border-radius:50%;width:58px;height:58px;color:#fff;background:#293fe0;font-size:21px}.cms-video-card iframe{display:block;width:100%;aspect-ratio:16/9;border:0;margin:18px 0}.cms-article-cover{width:100%;max-height:220px;object-fit:cover;margin-bottom:18px}.cms-article-body{white-space:pre-line}.cms-video-card .text-link{display:inline-block;margin-top:14px}`;
    document.head.append(style);
  }

  async function loadContent() {
    try {
      const [productsRes, articlesRes, videosRes] = await Promise.all([
        fetch('/content/products.json', { cache: 'no-cache' }),
        fetch('/content/articles.json', { cache: 'no-cache' }),
        fetch('/content/videos.json', { cache: 'no-cache' })
      ]);
      if (![productsRes, articlesRes, videosRes].every(r => r.ok)) return;
      const [productsData, articlesData, videosData] = await Promise.all([productsRes.json(), articlesRes.json(), videosRes.json()]);
      const products = (productsData.products || []).filter(x => x.published && x.status !== 'sold');
      const articles = (articlesData.articles || []).filter(x => x.published);
      const videos = (videosData.videos || []).filter(x => x.published);
      addStyles();
      const catalog = document.querySelector('.catalog-grid');
      if (catalog && products.length) { catalog.replaceChildren(...products.map(x => productCard(x))); }
      const homeProduct = document.querySelector('.product-layout .product-card');
      const featured = products.find(x => x.featured) || products[0];
      if (homeProduct && featured) homeProduct.replaceWith(productCard(featured, true));
      const guideGrid = location.pathname.endsWith('/guides.html') ? document.querySelector('.info-grid') : null;
      if (guideGrid && articles.length) guideGrid.replaceChildren(...articles.map(articleCard));
      const videoGrid = document.querySelector('.video-page-grid');
      if (videoGrid && videos.length) videoGrid.replaceChildren(...videos.map(videoCard));
    } catch (_) { /* Keep the hand-written site view if content cannot be fetched. */ }
  }
  loadContent();
  document.getElementById('language')?.addEventListener('change', () => setTimeout(loadContent, 0));
})();

