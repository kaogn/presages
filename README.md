# Présages Premium

Prototype web app mobile-first pour générer un profil astrologique immersif.

## Lancer en local

```bash
npm run dev
```

Puis ouvrir `http://localhost:4173`.

Alternative sans npm :

```bash
python3 -m http.server 4173
```

## Ce qui est inclus

- Formulaire immersif (avec option « je ne connais pas mon heure »)
- Moteurs séparés : occidental, chinois, cycles énergétiques type vietnamien
- Fusion narrative des 3 systèmes
- Expérience de génération 15–30s
- Résultat gratuit + phrase impact virale
- Upsell PDF (4,99€) et compatibilité (2,99€)
- Radar de compatibilité
- Partage / téléchargement d'un visuel social
- Ambiance visuelle + fond étoilé + son désactivable

## À connecter pour la prod

- API géocodage pour autosuggestion robuste
- Calculs astrologiques astronomiquement exacts (éphémérides)
- Génération PDF parchemin réelle (HTML→PDF ou moteur dédié)
- Paiements Stripe
- Liens partagés uniques (backend)
