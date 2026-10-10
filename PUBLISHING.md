# Elmitech site: updating and publishing

## Current version

The public website is in `index.html`, `styles.css`, and `script.js`. The laptop images are in `assets/`. The first product's details are kept in `content/products/hp-elitebook-840-g6.json`; article and video examples are in their content folders. The visitor chat interface is in `assistant.js` and `assistant.css`, with its server endpoint in `functions/api/assistant.js`.

The customer-facing order link opens WhatsApp. The visitor AI reads the published laptop record and answers general everyday tech questions. It does not know live stock or price, save chat history, or publish content. New products, articles, and videos still need a publishing layer before they automatically appear on the public site.

The AI endpoint requires a Cloudflare Workers AI binding named `AI`; without it, the chat stays in a clear “being connected” state and directs people to WhatsApp. Cloudflare currently provides 10,000 Neurons/day free, after which inference stops on the Workers Free plan. Workers Paid usage above that allocation is billed. Monitor usage before promoting the assistant widely. See [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).

## Updating this draft

You can edit page text and layout in `index.html`; styles in `styles.css`; language strings and menu behavior in `script.js`; and the product record in `content/products/`. The article and video examples describe the fields to prepare. After edits, refresh the browser preview.

Do not open `admin/index.html` directly as a `file://` URL. Browsers block the CMS from fetching `admin/config.yml` from local files, so Decap reports “Failed to fetch.” The local editor page now explains this. The CMS is designed to load from the deployed website over HTTPS, after GitHub and OAuth are configured.

## Publishing and shared editing

An initial Decap CMS editor configuration is in `admin/`. The content model covers laptops and equipment, articles, and video/social links. The CMS uses GitHub as its content store, so each editor needs a GitHub account with write access to the repository. You can invite the second person later.

The CMS needs a GitHub OAuth service to authenticate the editors. Decap documents an OAuth proxy approach and also offers Decap Turbo as hosted authentication. The `admin/config.template.yml` is a template with placeholders for the GitHub repo and OAuth hostname; it is not loaded by the public editor page. Do not put tokens or secrets in it. Set up the authentication service first, then make a real `admin/config.yml` using the correct repository and auth endpoint. Protect the OAuth client secret as a hosting secret/environment variable.

### Enable the visitor AI

1. In Cloudflare, open **Workers & Pages → elmitechsite → Settings → Functions → Bindings → Add → Workers AI**.
2. Set the variable name to `AI`, save the binding for Production (and Preview if desired), then redeploy the Pages project.
3. The public chat endpoint is `/api/assistant`. It reads the published HP EliteBook product JSON and uses the `@cf/zai-org/glm-4.7-flash` model. It is instructed not to invent prices or stock and to hand those questions to WhatsApp.
4. Test the chat in English, Swahili, and Somali. Review translations before advertising language support. The widget tells visitors it is AI and warns them not to share passwords or payment details. The server does not persist conversation history.
5. Monitor Workers AI usage. The endpoint has request-size and answer-length limits, but it does not yet have a robust per-visitor abuse limiter. Before promoting the chat heavily, add bot protection or a rate-limit service.

### Recommended account setup

1. Use the dedicated `Elmi-boop/ELMITECHSITE` repository for this website. Keep the separate `Elmi-boop/Elmitech` repository unchanged; it contains the e‑Ledger project.
2. Upload the contents of this website folder to `ELMITECHSITE` on its `main` branch.
3. In Cloudflare, create a Pages project by importing `ELMITECHSITE`. For this plain HTML site, set the production branch to `main`, leave the build command empty (or `exit 0`), and use `.` as the output directory. GitHub changes then trigger deployment and branch previews.
4. Enable the visitor AI by following the steps above.
5. Configure Decap's documented GitHub OAuth proxy/hosted authentication. Set the CMS `repo` value to `Elmi-boop/ELMITECHSITE`, and replace the OAuth hostname placeholder only after the auth endpoint is deployed and restricted to the correct GitHub OAuth application.
6. Test editor login with your own account first. Give the second editor repository write access when you are ready to invite them.
7. Confirm CMS changes are visible on the deployed site. New product/article/video CMS records do not automatically become public listings yet; a content-rendering step is still needed before relying on CMS publishing for public pages.

Cloudflare can connect a Pages project to GitHub and deploy automatically on pushes. GitHub Pages is not recommended for this shop: GitHub says Pages is not intended as free hosting for online businesses or sites primarily facilitating commercial transactions. Vercel's free Hobby plan is personal/non-commercial. Verify current plan limits and terms when you connect accounts. [Cloudflare integration](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Decap GitHub auth](https://decapcms.org/docs/github-backend/) · [Decap CMS](https://decapcms.org/docs/intro/)

A custom domain is optional and usually has an annual registration cost. Keep original copies of all content and images in the GitHub repository so the site can be moved to another host.

## Before launch

- Confirm laptop condition, actual stock, price, and whether the provided photo depicts the exact unit being sold.
- Add additional genuine product photos if available.
- Review English, Swahili, and Somali translations with fluent speakers, especially the Somali wording.
- Add a privacy page before enabling analytics or applying for Google AdSense. AdSense acceptance is Google's decision and requires useful original content and clear navigation.
- Add a clear return/warranty and delivery policy that matches Elmitech's real practices.

