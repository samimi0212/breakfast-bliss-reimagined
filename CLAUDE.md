# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Site vitrine + e-commerce pour **Breakfast Time**, boulangerie-traiteur basée à Antibes.
- Framework : Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- Repo GitHub : https://github.com/samimi0212/breakfast-time
- Déploiement : **Vercel** (auto-deploy depuis la branche `main`)
- Auth + BDD : Supabase
- Paiement : Stripe (via fonctions serverless Vercel dans `api/`)
- Emails transactionnels : Resend (via `api/send-*.ts`)

## Commandes

```bash
npm run dev          # Dev local
npm run build        # Build de vérification avant déploiement
npm run lint         # Lint ESLint
npm run test         # Tests unitaires (vitest, run once)
npm run test:watch   # Tests en mode watch
```

> Package manager : **npm uniquement** (ne pas switcher vers bun/yarn — Vercel l'exige).

## Workflow de déploiement

Vercel surveille `main` sur GitHub. Pour mettre en ligne :

```bash
# Depuis le répertoire principal
cd /Users/deborah/Documents/Breakfast\ Time/breakfast-time-site

git merge claude/NOM-DU-WORKTREE   # fusionner la branche de travail
git push origin main               # déclenche Vercel automatiquement
```

> `vercel` CLI et `gh` CLI ne sont pas installés.

## Architecture

### Routage bilingue FR/EN

Toutes les routes existent en double dans `App.tsx` :
- FR : `/carte`, `/panier`, `/evenements`, etc.
- EN : `/en/carte`, `/en/panier`, `/en/evenements`, etc.

La langue est déterminée par le préfixe `/en` dans l'URL (pas par le navigateur). Utiliser le hook `useLangPath()` pour tous les `navigate()` et `<Link href>` internes — il préfixe automatiquement par `/en` si nécessaire.

```ts
const { lp } = useLangPath();
navigate(lp("/panier")); // → "/panier" ou "/en/panier" selon la langue active
```

Les traductions sont dans `src/locales/fr.json` et `src/locales/en.json`. Les composants utilisent `useTranslation()` de react-i18next.

### Données produits (`src/data/products.ts`)

Tout le catalogue est statique dans `allProducts`. Chaque `Product` peut avoir des `options` (type `ProductOption`) pour les choix personnalisables (viennoiserie, nappage, taille, etc.). Les options ont des champs `label`/`label_en` et `choices`/`choices_en` pour le bilinguisme.

Règle importante : les prix des options `firstFree` permettent d'offrir les N premiers choix gratuits — ne pas casser cette logique dans `ProductPage.tsx`.

### Images produits

Il y a **deux emplacements** d'images à maintenir en cohérence :
- `src/assets/` : images référencées dans `products.ts` (chemin `/nom-image.png` servi depuis `public/`)
- `public/` : les mêmes images copiées ici pour être servies statiquement

Quand on remplace une image produit : copier le nouveau fichier dans `public/`, mettre à jour le champ `img` dans `products.ts` ET vérifier `CartePage.tsx` si elle y est référencée directement.

### Panier (`src/context/CartContext.tsx`)

Le panier est géré via Context + `localStorage` ("breakfast-cart"). Un produit avec des options différentes crée deux entrées distinctes dans le panier (comparaison par `JSON.stringify(options)`).

### Fonctions serverless (`api/`)

Les fichiers `api/*.ts` sont des fonctions Vercel Edge/Serverless. Fonctions présentes :
- `create-payment-intent.ts` — Stripe
- `create-delivery.ts` — livraison Uber Direct (unique transporteur ; logique partagée dans `_lib/delivery-providers.ts`)
- `get-delivery-price.ts`, `autocomplete-address.ts`, `place-details.ts` — adresses
- `send-*.ts` — emails via Resend (commande, bienvenue, événement, RDV, newsletter, contact)

### Auth (Supabase)

`PrivateRoute` protège les routes `/commande`, `/mon-compte`, `/confirmation`, `/mes-commandes`. Après login, la redirection post-auth est stockée dans `localStorage` ("post_auth_redirect") et consommée dans `App.tsx`.

### Popup promo (`PromoPopup.tsx`)

Affiché automatiquement sur la page d'accueil. Le code promo s'applique dans le panier (`Cart.tsx`) et est affiché de façon simplifiée (nom + "appliqué").

## Notes importantes

- Le routage côté client est géré par `vercel.json` (rewrites vers `/index.html`)
- Le dossier `dist/` est le build de production (ignoré par git)
- Les fichiers avec " 2" dans le nom (ex: `"api/send-newsletter-email 2.ts"`) sont des doublons accidentels — ne pas en créer de nouveaux
