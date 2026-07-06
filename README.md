# 🚀 Analytics Intelligence Platform (AIP)

> **Plateforme d'audit Digital Analytics assistée par Intelligence Artificielle**

## 🌍 Démonstration

**Application en ligne**

👉 https://agent-ia-lilac.vercel.app/

---

# 📖 Présentation

Analytics Intelligence Platform (AIP) est un projet personnel développé dans le but d'automatiser les premières phases d'un audit Digital Analytics.

À partir d'une simple URL, la plateforme analyse un site web afin de détecter les principales technologies Analytics et Marketing, puis utilise l'Intelligence Artificielle pour produire un premier rapport d'audit destiné aux consultants.

L'objectif est de réduire le temps consacré aux pré-audits techniques tout en proposant une analyse fiable et structurée.

---

# 🎯 Objectifs

L'application permet de :

- Analyser une URL
- Détecter les solutions Analytics installées
- Identifier les technologies de tracking
- Générer un premier audit
- Proposer des KPIs adaptés
- Préparer un plan de taggage
- Faciliter le travail des consultants Digital Analytics

---

# ✅ Fonctionnalités disponibles (Version 1)

- Analyse d'une URL
- Récupération du HTML d'une page
- Détection initiale de :
  - Google Tag Manager
  - Google Analytics 4
  - Adobe Analytics
  - Piano Analytics
  - Eulerian Analytics
- Génération d'un rapport via OpenAI
- Déploiement sur Vercel

---

# 🚧 Développement de la Version 2

La Version 2 introduit une architecture beaucoup plus robuste reposant sur un véritable moteur de détection Analytics.

Travaux en cours :

- Architecture modulaire TypeScript
- Moteur de détection indépendant
- Détection structurée des technologies
- Préparation d'un JSON d'analyse avant l'appel à l'IA

---

# 🔍 Technologies détectées

## Analytics

- Google Tag Manager
- Google Analytics 4
- Adobe Analytics
- Piano Analytics
- Eulerian Analytics

## Marketing

- Meta Pixel *(à venir)*
- LinkedIn Insight *(à venir)*
- TikTok Pixel *(à venir)*
- Floodlight *(à venir)*

## Consentement

- Consent Mode v2 *(à venir)*
- Didomi *(à venir)*
- OneTrust *(à venir)*
- Axeptio *(à venir)*
- Cookiebot *(à venir)*

---

# 🛠️ Stack technique

- Next.js
- TypeScript
- OpenAI API
- Git / GitHub
- Vercel

---

# 🏗️ Architecture

```text
URL

↓

Récupération du HTML

↓

Moteur de détection Analytics

↓

JSON structuré

↓

Intelligence Artificielle

↓

Rapport d'audit
```

---

# 🗺️ Roadmap

## ✅ V1

- Interface utilisateur
- Intégration OpenAI
- Analyse HTML
- Premier audit Analytics
- Déploiement Vercel

---

## 🚧 V2

- Détecteurs indépendants
- Architecture modulaire
- JSON structuré
- Analyse enrichie

---

## 🔜 V3

- Consent Mode
- CMP
- Pixels Marketing
- DataLayer
- KPIs avancés

---

## 🔥 V4

- Analyse JavaScript avec Playwright
- Analyse des requêtes réseau
- Analyse des cookies
- Détection dynamique des tags

---

## ⭐ V5

- Score de maturité Analytics
- Génération PDF
- Historique des audits
- Fonctionnalités SaaS

---

# 🎯 Vision du projet

À terme, Analytics Intelligence Platform permettra à un consultant de saisir simplement :

```text
https://www.client.com
```

et d'obtenir automatiquement :

- Technologies Analytics détectées
- Measurement IDs
- GTM Container IDs
- Analyse du Consent Mode
- Pixels Marketing
- Analyse du DataLayer
- KPIs recommandés
- Plan de taggage
- Rapport PDF professionnel

---

# 👨‍💻 Auteur

**Brice Goye**

Consultant Digital Analytics

Projet personnel développé dans le cadre d'une démarche d'innovation autour du Digital Analytics et de l'Intelligence Artificielle.

---

# 📌 Statut

🚧 Projet en cours de développement.