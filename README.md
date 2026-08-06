# 🌤️ Atmos Weather

Bienvenue sur **Atmos Weather**, une application météo moderne, rapide et réactive. J'ai construit ce projet pour offrir une expérience utilisateur fluide tout en gardant une interface épurée et agréable à utiliser au quotidien.

L'objectif principal était de créer une application simple qui donne les informations météorologiques essentielles en un clin d'œil, sans surcharger l'écran.

## ✨ Fonctionnalités

- **Recherche de villes** : Trouvez instantanément la météo de n'importe quelle ville dans le monde.
- **Météo en temps réel** : Température actuelle, conditions climatiques, humidité, vent, et visibilité.
- **Prévisions détaillées** : Obtenez les tendances pour les jours à venir.
- **Design Responsive** : Une interface soignée qui s'adapte parfaitement sur mobile, tablette ou desktop.

## 🛠️ Stack Technique

Pour ce projet, j'ai fait le choix d'utiliser des outils modernes et performants :

- **[Next.js 14](https://nextjs.org/)** - Pour l'architecture et le routage
- **[React 18](https://reactjs.org/)** - Pour l'interface utilisateur
- **[Tailwind CSS](https://tailwindcss.com/)** - Pour un styling rapide et sur-mesure
- **[React Query](https://tanstack.com/query/latest)** - Pour la gestion du cache et des appels API
- **[Jotai](https://jotai.org/)** - Pour une gestion d'état global légère et flexible
- **[Axios](https://axios-http.com/)** - Pour les requêtes HTTP

## 🚀 Lancer le projet en local

Si vous voulez faire tourner l'app sur votre machine, voici les étapes :

1. **Clonez le dépôt**
   ```bash
   git clone https://github.com/sami-dev-dz/atmos-weather.git
   cd atmos-weather
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   # ou yarn install / pnpm install
   ```

3. **Variables d'environnement**
   Créez un fichier `.env.local` à la racine et ajoutez votre clé API (ex: OpenWeatherMap) :
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=votre_cle_api_ici
   ```

4. **Démarrez le serveur**
   ```bash
   npm run dev
   ```
   Et voilà ! Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## 🤝 Contribuer

Si vous repérez un bug ou si vous avez une idée pour améliorer le projet, vos retours sont les bienvenus. N'hésitez pas à ouvrir une *issue* ou à faire une *pull request* !

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Ajout de AmazingFeature'`)
4. Pushez sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Distribué sous la licence MIT. Vous êtes libre de l'utiliser et de le modifier.
