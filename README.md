# 🚀 Analytics Intelligence Platform (AIP)

> **AI-powered Digital Analytics Auditor**

Analytics Intelligence Platform est une application SaaS développée en **Next.js** qui permet de réaliser un premier audit Digital Analytics à partir d'une simple URL.

L'objectif est d'automatiser le travail de pré-audit d'un consultant Analytics en détectant les technologies de tracking présentes sur un site et en générant un rapport intelligent assisté par IA.

---

# 🌍 Démonstration

## Application

👉 https://agent-ia-lilac.vercel.app/

---

# 🎯 Objectif

Réduire le temps nécessaire à un consultant Digital Analytics pour :

- identifier les solutions Analytics installées
- détecter les technologies de tracking
- produire un premier audit
- générer des recommandations
- préparer un plan de taggage

---

# ✨ Fonctionnalités V1

✅ Analyse d'une URL

✅ Récupération du HTML

✅ Détection automatique de :

- Google Tag Manager
- Google Analytics 4
- Adobe Analytics
- Piano Analytics
- Eulerian Analytics

✅ Génération d'un audit via OpenAI

✅ Déploiement sur Vercel

---

# 🛠️ Technologies

- Next.js 16
- TypeScript
- OpenAI API
- Vercel
- GitHub

---

# 📂 Architecture actuelle

```
app
│
├── api
│     └── agent
│
├── prompts
│
├── page.tsx
│
└── layout.tsx

lib
│
├── analytics-detector.ts
├── html-fetcher.ts
└── types.ts
```

---

# 🚀 Roadmap

## ✅ Version 1

- Interface utilisateur
- OpenAI
- Analyse HTML
- Détection Analytics
- Déploiement

---

## 🚧 Version 2 (en cours)

Architecture modulaire

Moteur de détection indépendant

JSON structuré

Détecteurs spécialisés :

- Google Tag Manager
- Google Analytics 4
- Adobe Analytics
- Piano Analytics
- Eulerian Analytics

---

## 🔜 Version 3

Détection :

- Consent Mode v2
- Didomi
- OneTrust
- Axeptio
- Cookiebot

Pixels :

- Meta Pixel
- TikTok Pixel
- LinkedIn Insight
- Floodlight
- Snap Pixel

Analyse :

- DataLayer
- Events
- Variables
- KPIs

---

## 🔥 Version 4

Playwright

Analyse JavaScript Runtime

Cookies

Network

Requêtes Analytics

---

## ⭐ Version 5

Analytics Maturity Score

Recommandations

Rapport PDF

Export PowerPoint

Historique des audits

---

# 📈 Vision

À terme, Analytics Intelligence Platform permettra à un consultant de saisir simplement :

```
https://www.client.com
```

et d'obtenir automatiquement :

- ✅ Technologies Analytics détectées
- ✅ Measurement IDs
- ✅ GTM Container
- ✅ Consent Mode
- ✅ Pixels Marketing
- ✅ DataLayer
- ✅ KPIs recommandés
- ✅ Plan de taggage
- ✅ Rapport PDF professionnel

---

# 💡 Pourquoi ce projet ?

Lors des missions de conseil Digital Analytics, les phases de pré-audit sont souvent longues et répétitives.

L'objectif de ce projet est d'utiliser l'IA pour automatiser ces tâches tout en conservant une approche fiable, basée sur des preuves techniques observables.

---
## 🧠 V3 — Moteur de connaissances Analytics

La V3 introduira un moteur de connaissances métier permettant d’enrichir les résultats techniques avec des bonnes pratiques, des points d’attention et des recommandations propres à chaque outil.

Objectif :

- Séparer la détection technique de la connaissance métier
- Associer chaque outil détecté à ses bonnes pratiques
- Identifier les erreurs fréquentes
- Fournir des recommandations contextualisées
- Améliorer la qualité des rapports générés par l’IA

Exemples de connaissances futures :

- GA4 : Consent Mode, conversions, événements personnalisés, cross-domain
- GTM : structure du conteneur, gouvernance, naming convention
- Adobe Analytics : Report Suite, AppMeasurement, Adobe Launch
- Piano Analytics : collection domain, site ID, tagging events
- Consent : Didomi, OneTrust, Axeptio, Cookiebot

# 👨‍💻 Auteur

**Brice Goye**

Digital Analytics Consultant

Projet personnel en cours de développement.

---

# 📄 Licence

MIT