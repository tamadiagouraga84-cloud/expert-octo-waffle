# CurriculumAI 🎯

Générateur de CV propulsé par Claude (Anthropic). Aucune clé API visible par les utilisateurs.

---

## 🚀 Déploiement sur Vercel (5 minutes)

### Étape 1 — Préparer les fichiers
Téléchargez ce dossier et placez-le dans un dépôt GitHub.

### Étape 2 — Créer un projet sur Vercel
1. Allez sur [vercel.com](https://vercel.com) et connectez-vous avec GitHub
2. Cliquez **"Add New Project"**
3. Importez votre dépôt GitHub

### Étape 3 — Ajouter la clé API (⚠️ étape cruciale)
Dans le dashboard Vercel de votre projet :
1. Allez dans **Settings → Environment Variables**
2. Ajoutez :
   - **Nom** : `ANTHROPIC_API_KEY`
   - **Valeur** : votre clé `sk-ant-api03-...`
   - **Environnement** : Production, Preview, Development
3. Optionnel : `MAX_CV_PER_HOUR` = `5` (limite par IP)

### Étape 4 — Déployer
Cliquez **Deploy** — votre app est en ligne en 1 minute ! 🎉

---

## 🏗️ Structure du projet

```
curriculumai/
├── api/
│   └── generate-cv.js    ← Fonction serverless (clé API cachée ici)
├── public/
│   └── index.html        ← Interface utilisateur
├── vercel.json           ← Configuration Vercel
├── package.json
├── .env.example          ← Template de variables d'environnement
└── README.md
```

---

## 💻 Développement local

```bash
# Installer Vercel CLI
npm i -g vercel

# Copier les variables d'environnement
cp .env.example .env.local
# Editez .env.local et ajoutez votre clé API

# Lancer en local
vercel dev
# → App disponible sur http://localhost:3000
```

---

## ⚙️ Configuration

| Variable | Description | Défaut |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clé API Anthropic (obligatoire) | — |
| `MAX_CV_PER_HOUR` | Limite de génération par IP/heure | `5` |

---

## 💰 Coûts estimés

| Usage | Coût estimé |
|---|---|
| 1 CV généré | ~0.02–0.05€ |
| 100 CV/mois | ~2–5€ |
| 1000 CV/mois | ~20–50€ |

Suivez votre consommation sur [console.anthropic.com](https://console.anthropic.com).

---

## 🔒 Sécurité

- ✅ Clé API **jamais exposée** au navigateur
- ✅ Rate limiting par IP (configurable)
- ✅ Validation des entrées côté serveur
- ⚠️ Pour production à grande échelle, remplacez le rate limiting en mémoire par **Upstash Redis**
