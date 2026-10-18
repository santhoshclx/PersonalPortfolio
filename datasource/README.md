# Portfolio Datasource (Single Source of Truth)

This `datasource/` directory is the **canonical Single Source of Truth** for all content displayed across the PersonalPortfolio website.

Instead of hunting through HTML or JavaScript files to update job titles, project descriptions, skills, or certifications, simply update the relevant JSON file in this directory.

---

## 📁 File Structure & Responsibilities

| File | Purpose | Driven UI Sections |
|---|---|---|
| [`site-config.json`](./site-config.json) | Global website configuration, SEO metadata, theme settings, resume paths, footer | Browser title, `<meta>` tags, navbar theme toggle, footer copyright & tagline |
| [`profile.json`](./profile.json) | Personal identity, current role, avatar, hero copy, about paragraphs, core disciplines | Sidebar profile, hero badges, hero title/subtitle, about text, core disciplines |
| [`social-links.json`](./social-links.json) | Verified professional and platform links (GitHub, LinkedIn, Credly, etc.) | Sidebar social icons, contact section cards |
| [`skills.json`](./skills.json) | Organized technical capabilities, badges, and skill bullets | Skills matrix article (`#skills`) |
| [`experience.json`](./experience.json) | Employment history, roles, dates, and bulleted achievements | Experience timeline (`#experience`) |
| [`projects.json`](./projects.json) | Canonical project records, categories, descriptions, links, and order | Project cards grid (`#projects`), project category filters, detail loaders |
| [`certifications.json`](./certifications.json) | Verifiable accreditations, credential IDs, validation URLs, and in-progress items | Certifications grid (`#certifications`) |
| [`education.json`](./education.json) | Academic qualifications, institutions, degrees, and coursework | Academic background timeline (`#certifications`) |
| [`achievements.json`](./achievements.json) | Quantitative impact metrics, verified production outcomes | Hero section metrics grid (`4.4+ Years`, `~91% mAP`, `40% Cost Reduction`, etc.) |
| [`navigation.json`](./navigation.json) | Configurable navigation labels and default active section | Sticky top navbar links |
| [`blogs.json`](./blogs.json) | Technical blog articles, guides, dates, and thumbnails | Blog articles list (`#blog`) |

---

## 🛠️ How to Perform Routine Updates

### 1. Update Profile Headline or Current Role
Open [`profile.json`](./profile.json):
```json
{
  "name": "Santhoshkumar R",
  "currentRole": "Machine Learning Engineer",
  "headline": "Machine Learning Engineer | Computer Vision | Cloud MLOps & Security"
}
```
*Effect*: Automatically updates the sidebar current role, hero badge, hero subtitle, and structured metadata.

### 2. Add or Edit a Project
Open [`projects.json`](./projects.json). To add a new project, insert an object into the `"projects"` array:
```json
{
  "id": "my-new-project",
  "title": "Autonomous Drone Vision Pipeline",
  "category": "Computer Vision & AI",
  "filterCategory": "computer vision & ai",
  "metaPill": "YOLOv9 · TensorRT · ROS2 · C++",
  "summary": "Real-time obstacle avoidance and target tracking pipeline executing at 60 FPS on edge robotics hardware.",
  "badge": {
    "text": "Edge AI",
    "type": "emerald"
  },
  "thumbnail": "./assets/images/project-new.jpg",
  "imageAlt": "Drone Vision Pipeline",
  "detailUrl": "./projects/MyNewProject.html",
  "actionLabel": "View Architecture",
  "actionIcon": "layers-outline",
  "featured": true,
  "order": 7,
  "visible": true
}
```
*To temporarily hide a project*, set `"visible": false`.

### 3. Add a Certification
Open [`certifications.json`](./certifications.json) and add an entry:
```json
{
  "id": "aws-mle-cert",
  "name": "AWS Certified Machine Learning – Specialty",
  "issuer": "Amazon Web Services (AWS)",
  "credentialCode": "MLS-C01",
  "status": "Earned",
  "issueDate": "November 10, 2026",
  "expirationDate": "November 10, 2029",
  "validationId": "ABCD1234EFGH5678",
  "featured": false,
  "icon": "shield-checkmark",
  "description": "Validates machine learning pipeline modeling, data engineering, and SageMaker deployment.",
  "verificationLinks": [
    {
      "label": "Verify on AWS",
      "url": "https://aws.amazon.com/verification",
      "icon": "open-outline"
    }
  ]
}
```

### 4. Update Resume File
1. Place the new PDF into `assets/` (e.g. `assets/Santhoshkumar-R-Resume.pdf`).
2. Update [`site-config.json`](./site-config.json):
   ```json
   "resume": {
     "filename": "Santhoshkumar-R-Resume.pdf",
     "path": "./assets/Santhoshkumar-R-Resume.pdf",
     "label": "Download Resume"
   }
   ```
*Effect*: Updates every resume download button in the sidebar, hero section, and contact card simultaneously.

### 5. Update Metrics & Quantitative Numbers
Open [`achievements.json`](./achievements.json) and modify `"metrics"`:
```json
{
  "id": "cost-reduction",
  "value": "45%",
  "label": "Cloud Cost Reduction",
  "highlight": "gold"
}
```
*Effect*: The hero metrics grid updates immediately.

---

## 🔍 Validation & Linting

Before pushing changes, validate the datasource syntax and schema integrity:

```bash
# Using Python
python scripts/validate_datasource.py

# Or using Node.js (if installed)
node scripts/validate-datasource.js
# Or
npm run validate:data
```

The validator checks:
* Valid JSON syntax across all files.
* Required top-level keys.
* Unique project and certification IDs.
* Correct URL formats and asset references.
* Presence of mandatory profile and config fields.

---

## 🔄 How Changes Reach the Live Site

1. **Local Preview**:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000/`. When you edit any JSON file inside `datasource/`, refreshing the browser reflects the changes immediately.
2. **Commit & Push**:
   ```bash
   git add datasource/
   git commit -m "Update portfolio projects and certifications in datasource"
   git push origin development
   ```
3. **Deployment**:
   Merging to the `main` branch automatically triggers the GitHub Pages deployment action defined in [`.github/workflows/static.yml`](../.github/workflows/static.yml).
