# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Project Manager - Rapport LaTeX

Ce dossier contient le rapport LaTeX du projet Project Manager.

## Prérequis

Pour compiler ce document, vous aurez besoin de :

1. Une distribution LaTeX (recommandée : TeX Live ou MiKTeX)
2. Les packages LaTeX suivants :
   - inputenc
   - babel
   - graphicx
   - hyperref
   - listings
   - xcolor
   - amsmath
   - float
   - geometry
   - titlesec
   - fancyhdr
   - enumitem
   - booktabs
   - multirow
   - makeidx
   - glossaries

## Structure des Fichiers

```
project-manager/
├── rapport.tex           # Fichier principal du rapport
├── images/              # Dossier pour les images
│   ├── diagrams/        # Diagrammes UML
│   └── screenshots/     # Captures d'écran
└── references.bib       # Fichier de références bibliographiques
```

## Compilation du Document

Pour compiler le document, suivez ces étapes :

1. Première compilation (génère les fichiers auxiliaires) :
   ```bash
   pdflatex rapport.tex
   ```

2. Génération de l'index :
   ```bash
   makeindex rapport.idx
   ```

3. Génération de la bibliographie :
   ```bash
   bibtex rapport
   ```

4. Compilations supplémentaires (pour les références croisées) :
   ```bash
   pdflatex rapport.tex
   pdflatex rapport.tex
   ```

Le fichier PDF final sera généré sous le nom `rapport.pdf`.

## Ajout d'Images

Pour ajouter des images au rapport :

1. Placez les images dans le dossier `images/`
2. Utilisez la commande `\includegraphics` dans le document
3. Référencez les images avec `\ref` et `\label`

## Personnalisation

Pour personnaliser le rapport :

1. Modifiez les informations dans la page de titre
2. Ajustez les marges dans le préambule
3. Modifiez les styles dans les configurations

## Dépannage

Problèmes courants et solutions :

1. Erreurs de compilation :
   - Vérifiez que tous les packages sont installés
   - Assurez-vous que les chemins des images sont corrects

2. Références croisées manquantes :
   - Exécutez les compilations dans l'ordre indiqué
   - Vérifiez les labels dans le document

3. Images manquantes :
   - Vérifiez les chemins des images
   - Assurez-vous que les formats sont supportés

## Support

Pour toute question ou problème, veuillez :
1. Vérifier la documentation LaTeX
2. Consulter les logs de compilation
3. Vérifier les messages d'erreur
