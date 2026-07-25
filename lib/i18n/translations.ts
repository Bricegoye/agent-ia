export type Language = "fr" | "en";

export const translations = {
  fr: {
    common: {
      language: "Langue",
      french: "Français",
      english: "English",
    },

    nav: {
      features: "Fonctionnalités",
      howItWorks: "Comment ça marche",
      startAudit: "Lancer un audit",
    },

    hero: {
      badge: "Plateforme Analytics propulsée par l’IA",
      title: "Analytics Intelligence Platform",
      subtitle:
        "Détectez, analysez et optimisez votre implémentation Digital Analytics grâce à l’IA.",
      description:
        "Auditez instantanément n’importe quel site web, détectez les outils Analytics, évaluez la qualité des données, identifiez les problèmes de conformité et obtenez des recommandations générées par l’IA.",
      startAudit: "Lancer un audit gratuit",
      viewDemo: "Voir la démo",
    },

    features: {
      eyebrow: "Intelligence Analytics avancée",
      title: "Tout ce qu’il faut pour auditer votre Analytics",
      description:
        "AIP combine détection automatisée, scoring Analytics et recommandations générées par l’IA pour vous aider à comprendre et améliorer votre implémentation Digital Analytics.",

      detectionTitle: "Détection Analytics",
      detectionDescription:
        "Détectez automatiquement GA4, GTM, Adobe Analytics, Meta Pixel et d’autres technologies Analytics et Marketing.",

      scoringTitle: "Scoring de l’implémentation",
      scoringDescription:
        "Obtenez instantanément un score de maturité Analytics basé sur la qualité de votre implémentation.",

      consentTitle: "Consentement & Conformité",
      consentDescription:
        "Identifiez les problèmes liés à la gestion du consentement, à la confidentialité et à la conformité du tracking sur votre site.",

      dataQualityTitle: "Qualité des données",
      dataQualityDescription:
        "Évaluez la fiabilité et la qualité de votre implémentation Analytics et de votre collecte de données.",

      aiInsightsTitle: "Insights propulsés par l’IA",
      aiInsightsDescription:
        "Transformez les constats techniques en analyses claires et en recommandations prioritaires générées par l’IA.",

      recommendationsTitle: "Recommandations actionnables",
      recommendationsDescription:
        "Identifiez précisément ce qui doit être corrigé, amélioré ou implémenté pour renforcer votre stack Analytics.",
    },

    howItWorks: {
      eyebrow: "Comment ça marche",
      title: "De l’URL aux insights en quelques secondes",
      description:
        "Auditez votre implémentation Analytics en trois étapes simples. Aucune configuration complexe requise.",

      step1Title: "Saisissez votre site web",
      step1Description:
        "Indiquez l’URL du site que vous souhaitez auditer. Aucune installation ni configuration requise.",

      step2Title: "AIP analyse votre stack",
      step2Description:
        "Nos moteurs de détection et de scoring analysent votre implémentation Analytics, la qualité des données et les signaux de conformité.",

      step3Title: "Obtenez des insights exploitables",
      step3Description:
        "Recevez votre score Analytics, les problèmes détectés et des recommandations générées par l’IA pour améliorer votre implémentation.",
    },

    audit: {
      eyebrow: "Lancer votre audit",
      title: "Analysez votre site web en quelques secondes",
      description:
        "Saisissez l’URL de votre site et laissez AIP analyser votre implémentation Digital Analytics.",

      analyze: "Analyser le site",
      analyzing: "Analyse en cours...",

      helper:
        "Aucune installation requise. Saisissez simplement l’URL d’un site public.",

      loadingTitle: "Analyse de votre site en cours...",
      loadingDescription:
        "AIP inspecte votre implémentation Analytics. Cela peut prendre quelques secondes.",

      connecting: "Connexion au site",
      detecting: "Détection des technologies Analytics",
      evaluating: "Évaluation de la qualité de l’implémentation",
      generating: "Génération des recommandations IA",

      failed: "Échec de l’audit",
    },

    results: {
      report: "Rapport d’audit Analytics",
      completed: "Terminé",

      implementationAnalysis:
        "Analyse de l’implémentation Digital Analytics",

      healthScore: "Score global",
      grade: "Note",

      detectedTechnologies: "Technologies détectées",
      detected: "Détecté",
      detectedId: "Identifiant détecté",

      categoryScores: "Scores par catégorie",
      maturityBreakdown: "Évaluation de la maturité Analytics",

      categories: {
        analytics: "Analytics",
        tagManagement: "Gestion des tags",
        consent: "Consentement & Conformité",
        marketing: "Marketing",
        dataQuality: "Qualité des données",
      },

      aiAnalysis: "Analyse IA",

      executiveSummary: "Synthèse",
      executiveSummaryDescription:
        "Analyse de votre implémentation Analytics générée par l’IA.",

      auditFindings: "Résultats de l’audit",
      findingsDescription:
        "Principaux points forts et axes d’amélioration identifiés pendant l’audit.",

      strengths: "Points forts",
      strengthsDescription: "Ce qui fonctionne bien",

      weaknesses: "Points faibles",
      weaknessesDescription: "Points nécessitant votre attention",

      actionPlan: "Plan d’action",

      priorityActions: "Actions prioritaires",
      priorityDescription:
        "Actions recommandées classées par ordre de priorité.",
      priority: "Priorité",

      aiInsights: "Recommandations IA",

      recommendations: "Recommandations",
      recommendationsDescription:
        "Recommandations stratégiques générées à partir de votre audit Analytics.",
      recommendation: "Recommandation",

      technicalDetails: "Détails techniques",

      technicalAnalysis: "Analyse technique",
      technicalDescription:
        "Interprétation technique détaillée des résultats de l’audit.",

      viewTechnicalAnalysis: "Voir l’analyse technique",
      expandTechnicalAnalysis:
        "Développez cette section pour consulter l’analyse détaillée.",

      auditCompleted: "Audit terminé",
      poweredBy: "Propulsé par AIP",
    },
  },

  en: {
    common: {
      language: "Language",
      french: "Français",
      english: "English",
    },

    nav: {
      features: "Features",
      howItWorks: "How It Works",
      startAudit: "Start Audit",
    },

    hero: {
      badge: "AI-Powered Analytics Platform",
      title: "Analytics Intelligence Platform",
      subtitle:
        "Detect, analyze and optimize your Digital Analytics implementation with AI.",
      description:
        "Instantly audit any website, detect Analytics tools, evaluate data quality, identify compliance issues and receive AI-powered recommendations.",
      startAudit: "Start Free Audit",
      viewDemo: "View Demo",
    },

    features: {
      eyebrow: "Powerful Analytics Intelligence",
      title: "Everything you need to audit your analytics",
      description:
        "AIP combines automated detection, analytics scoring and AI-powered recommendations to help you understand and improve your digital analytics implementation.",

      detectionTitle: "Analytics Detection",
      detectionDescription:
        "Automatically detect GA4, GTM, Adobe Analytics, Meta Pixel and other analytics and marketing technologies.",

      scoringTitle: "Implementation Scoring",
      scoringDescription:
        "Get an instant analytics maturity score based on the quality of your implementation.",

      consentTitle: "Consent & Compliance",
      consentDescription:
        "Identify consent management, privacy and tracking compliance issues across your website.",

      dataQualityTitle: "Data Quality",
      dataQualityDescription:
        "Evaluate the reliability and quality of your analytics implementation and data collection.",

      aiInsightsTitle: "AI-Powered Insights",
      aiInsightsDescription:
        "Turn technical findings into clear insights and prioritized recommendations powered by AI.",

      recommendationsTitle: "Actionable Recommendations",
      recommendationsDescription:
        "Know exactly what should be fixed, improved or implemented to strengthen your analytics stack.",
    },

    howItWorks: {
      eyebrow: "How It Works",
      title: "From URL to insights in seconds",
      description:
        "Audit your Analytics implementation in three simple steps. No complex setup required.",

      step1Title: "Enter your website",
      step1Description:
        "Submit the URL of the website you want to audit. No installation or configuration required.",

      step2Title: "AIP analyzes your stack",
      step2Description:
        "Our detection and scoring engines analyze your Analytics implementation, data quality and compliance signals.",

      step3Title: "Get actionable insights",
      step3Description:
        "Receive your Analytics score, detected issues and AI-powered recommendations to improve your implementation.",
    },

    audit: {
      eyebrow: "Start Your Audit",
      title: "Analyze your website in seconds",
      description:
        "Enter your website URL and let AIP analyze your Digital Analytics implementation.",

      analyze: "Analyze Website",
      analyzing: "Analyzing...",

      helper:
        "No installation required. Enter a public website URL to get started.",

      loadingTitle: "Analyzing your website...",
      loadingDescription:
        "AIP is inspecting your Analytics implementation. This may take a few seconds.",

      connecting: "Connecting to website",
      detecting: "Detecting Analytics technologies",
      evaluating: "Evaluating implementation quality",
      generating: "Generating AI recommendations",

      failed: "Audit failed",
    },

    results: {
      report: "Analytics Audit Report",
      completed: "Completed",

      implementationAnalysis:
        "Digital analytics implementation analysis",

      healthScore: "Health Score",
      grade: "Grade",

      detectedTechnologies: "Detected Technologies",
      detected: "Detected",
      detectedId: "Detected ID",

      categoryScores: "Category Scores",
      maturityBreakdown: "Analytics maturity breakdown",

      categories: {
        analytics: "Analytics",
        tagManagement: "Tag Management",
        consent: "Consent & Compliance",
        marketing: "Marketing",
        dataQuality: "Data Quality",
      },

      aiAnalysis: "AI Analysis",

      executiveSummary: "Executive Summary",
      executiveSummaryDescription:
        "AI-powered analysis of your Analytics implementation.",

      auditFindings: "Audit Findings",
      findingsDescription:
        "Key strengths and weaknesses identified during the audit.",

      strengths: "Strengths",
      strengthsDescription: "What is working well",

      weaknesses: "Weaknesses",
      weaknessesDescription: "Areas requiring attention",

      actionPlan: "Action Plan",

      priorityActions: "Priority Actions",
      priorityDescription:
        "Recommended actions ordered by priority.",
      priority: "Priority",

      aiInsights: "AI Insights",

      recommendations: "AI Recommendations",
      recommendationsDescription:
        "Strategic recommendations generated from your Analytics audit.",
      recommendation: "Recommendation",

      technicalDetails: "Technical Details",

      technicalAnalysis: "Technical Analysis",
      technicalDescription:
        "Detailed technical interpretation of the audit findings.",

      viewTechnicalAnalysis: "View technical analysis",
      expandTechnicalAnalysis:
        "Expand to review the detailed audit interpretation.",

      auditCompleted: "Audit completed",
      poweredBy: "Powered by AIP",
    },
  },
} as const;

export type Translations = typeof translations;