# Inside Jay’s Brain & Heart

A five-page, responsive introduction to Jay Ryan Mapanao: his work, research, family, friends, dogs, community, and adventures. Uses the supplied main portrait and 37 additional photographs, with professional content based on the supplied CV.

## Preview locally

From the extracted project folder, run:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. There is no installation or build step.

## Deploy to GitHub Pages

1. Create a GitHub repository and add this package’s contents at its root. Include the `.github` folder, which may be hidden by your file manager.
2. Push the files to the `main` branch.
3. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the deployment source.
4. Open **Actions → Deploy GitHub Pages → Run workflow**, or push another change to `main`.
5. When the workflow finishes, open the URL shown in the deployment.

The included workflow publishes `dist/`. Relative links support both a root domain and a repository subdirectory. GitHub Pages availability depends on your account plan and repository visibility.

Reference: [GitHub’s custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Edit the website

| File | Content |
| --- | --- |
| `dist/index.html` | Main portrait, introduction, brain/heart switch, personal facts |
| `dist/brain.html` | Career timeline, selected projects, research, education, teaching |
| `dist/heart.html` | Family, six dogs, friends, community |
| `dist/adventures.html` | Travel, water, curiosity, and purpose |
| `dist/album.html` | Complete photo album and category filters |
| `dist/assets/styles.css` | Colors, typography, layouts, mobile styling |
| `dist/assets/app.js` | Navigation, tabs, filters, gallery viewer, favorites |
| `dist/assets/photos.js` | Photo titles, captions, categories, and image paths |
| `dist/assets/photos/` | Optimized WebP images and smaller thumbnails |

Edit text directly in the HTML files. Update both `photos.js` and the relevant HTML card when changing a photograph’s caption. To add a photograph, add image files, a unique metadata entry, and its corresponding album card. Existing photographs provide examples.

The gallery supports arrow keys and Escape while the viewer is open. Favorite photographs are stored only in the visitor’s browser; they are not shared across devices. Essential content remains readable without JavaScript. The original CV is not included in this website package.

## Content notes

The professional page preserves the CV’s degree status, employment dates, and distinction between work led and personally implemented. UP graduate study is shown as 27 units earned. Research entries do not claim publication where the CV does not specify it. Personal stories follow Jay’s supplied introduction; photo captions avoid assigning unconfirmed names or places.

The supplied personal photographs and profile remain Jay’s content. No stock photographs, remote font dependencies, tracking scripts, or paid services are required.
