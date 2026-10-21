# KezPos website

Static React site (Vite + TanStack Router + Tailwind). Deploys to GitHub Pages.

## 1. Add the screenshots (required, one time)

Copy your app screenshots into `public/images/` using exactly these names:

| File                | Used for                    |
| ------------------- | --------------------------- |
| `app-home.png`      | Android home screen         |
| `checkout.png`      | Android checkout            |
| `elecreceipt.png`   | Electronics receipt         |
| `reports.png`       | Reports                     |
| `inventory.png`     | Inventory                   |
| `laptop_sales.png`  | Windows sales screen        |
| `laptop_cashier.png`| Windows cashier screen      |

## 2. Run locally

    npm install
    npm run dev

## 3. Deploy to GitHub Pages

1. Push this folder to a GitHub repo (branch `main`).
2. On GitHub: Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` builds and deploys automatically.

Site URL: `https://YOUR_USERNAME.github.io/REPO_NAME/`

## Where to edit things

- Prices, download links, email, WhatsApp: `src/components/site/config.ts`
- Privacy / Terms text: `src/components/site/legal-content.json`
- Page content: `src/routes/*.tsx`
- Colors and theme: `src/styles.css`
