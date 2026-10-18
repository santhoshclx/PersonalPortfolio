# Personal Portfolio Website — Santhoshkumar R

A modern, high-performance, responsive personal portfolio website engineered for **Santhoshkumar R**, specializing in **AI/ML & GenAI Engineering, Computer Vision & MLOps, and Enterprise Cloud Security**.

Hosted on GitHub Pages: [https://santhoshclx.github.io/PersonalPortfolio/](https://santhoshclx.github.io/PersonalPortfolio/)

---

## 🚀 Release Notes — v1.0.0 (Production Modernization)

### 🌟 Key Modernizations & Highlights

1. **Brand Positioning & Hero Overview**:
   - Redesigned around verified professional background: *AI/ML & GenAI Engineer | Computer Vision & MLOps | Enterprise Cloud Security*.
   - Live pulse availability indicator.
   - Verified resume impact metrics: **4.4+ Years Experience**, **~91% mAP@0.5 YOLO Detection**, **35–45 FPS Jetson Edge Inference**, **40% Cloud Cost Reduction**, and **80% Security Score**.
   - Direct download link for authentic PDF resume (`assets/Santhoshkumar-R-Resume-20260718.pdf`).

2. **Dark & Light Mode Theming**:
   - Clean, modern light theme set as default.
   - High-contrast Obsidian/Slate dark mode accessible on-demand via the navbar toggle switch.
   - Persistent theme state saved in `localStorage`.

3. **Technical Skills Matrix**:
   - Replaced arbitrary percentage progress bars with a structured capability matrix:
     - Computer Vision & Object Detection
     - Face Embeddings & Vector Search (InsightFace, ArcFace, PostgreSQL pgvector)
     - Edge AI & GPU Infrastructure (Jetson Orin Nano, GStreamer, CUDA, RTX 5090)
     - Cloud ML Services & MLOps (AWS SageMaker, ECR, Docker, CodePipeline)
     - Cloud Infrastructure & DevOps (Terraform, ECS Fargate, Aurora RDS, WAF)
     - Cloud Security & Compliance (AWS Certified Security – Specialty, HIPAA, SOC 2, SSM)
     - Programming & Frameworks (Python, SQL, JavaScript, Bash)
     - CI/CD & Observability (CloudWatch, SNS, Jenkins, GitHub Actions)

4. **Flagship Production Projects**:
   - **AI-Powered CCTV Surveillance & Intelligence Platform**: Custom YOLO fine-tuning (mAP@0.5 ~82% to ~91%), 35–45 FPS edge inference on NVIDIA Jetson Orin Nano, ArcFace face recognition in PostgreSQL pgvector (HNSW), SageMaker real-time endpoints (ml.g5.xlarge), and LLM CCTV summarization with RAG search. Includes 4-stage SVG architecture diagram.
   - **AWS IaaS Multi-Tenant Automation Using Terraform**: 3-tier VPC, ECS Fargate, Aurora RDS, API Gateway, WAF, and CodePipeline CI/CD.
   - **HIPAA & SOC 2 Cloud Security & Zero-Trust Automation**: SSM Session Manager ProxyCommand tunneling eliminating public SSH ports, KMS encryption, GuardDuty threat detection, and 80% security benchmark.
   - Plus interactive showcase projects: AWS CodePipeline CI/CD with CloudFormation, Linear Regression From Scratch, and Interactive Regex Pattern Matcher.

5. **Verifiable Certifications & Education**:
   - **AWS Certified Security – Specialty (SCS-C03)**: Includes official validation number (`3f1b61349dcc49dbb308e938016c7e33`), direct links to AWS verification portal and Credly profile.
   - **AWS Certified Generative AI Developer – Professional (AIP-C01)**: In Progress / Preparing.
   - **HIPAA Awareness for Business Associates Certificate**: HIPAA Training.
   - **Data Science Using R Certificate**: Vani Analytics.
   - **Academic Credentials**: Master of Science (M.Sc.) in Artificial Intelligence from Sri Ramachandra Institute of Higher Education and Research, and Bachelor of Computer Applications (BCA) from Guru Nanak College, University of Madras.

6. **Centralized Single Source of Truth (`datasource/`)**:
   - All profile data, projects, metrics, skills, certifications, and links are managed in canonical JSON records under `datasource/`.
   - Dynamic UI hydration via `assets/js/datasource.js`.
   - Automated schema & integrity validator scripts in `scripts/validate_datasource.py` and `scripts/validate-datasource.js`.
   - CI validation gate integrated into GitHub Actions deployment workflow.

---

## 🛠️ Technology Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+), CSS3 Custom Properties
- **Architecture**: Centralized `datasource/` Single Source of Truth + Dynamic Hydration
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Fira Code*)
- **Icons**: Ionicons (CDN)
- **Deployment**: GitHub Pages via `.github/workflows/static.yml`
- **Zero Heavy Dependencies**: Pure static web standards for sub-second load times and 100% reliability

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── static.yml                      # GitHub Actions static deployment workflow with validation
├── datasource/                             # Single Source of Truth for all portfolio content
│   ├── site-config.json                    # Global metadata, theme settings, resume paths, SEO
│   ├── profile.json                        # Name, role, bio, hero copy, core disciplines
│   ├── social-links.json                   # Verified links (GitHub, LinkedIn, Credly, etc.)
│   ├── skills.json                         # Technical capabilities matrix
│   ├── experience.json                     # Employment history and verified achievements
│   ├── projects.json                       # Projects, categories, thumbnails, and detail links
│   ├── certifications.json                 # Verifiable certifications, credential IDs, and URLs
│   ├── education.json                      # Academic background and degrees
│   ├── achievements.json                   # Quantitative metrics & production impact numbers
│   ├── navigation.json                     # Configurable navigation bar items
│   ├── blogs.json                          # Technical articles and guides
│   └── README.md                           # Content maintainer guide & schema documentation
├── assets/
│   ├── Santhoshkumar-R-Resume.pdf          # Verified PDF resume
│   ├── css/
│   │   └── style.css                       # Modern design system (Dark/Light themes)
│   ├── js/
│   │   ├── datasource.js                   # Data-access layer and dynamic hydration
│   │   └── script.js                       # Theme toggle, routing, dynamic loading, forms
│   └── images/                             # Project thumbnails and icons
├── projects/                               # Deep-dive project architecture and detail pages
├── blogs/                                  # Technical engineering write-ups
├── scripts/
│   ├── validate_datasource.py              # Python 3 schema & integrity validator
│   ├── validate-datasource.js              # Node.js schema validator
│   └── sync_datasource.py                  # Static fallback synchronization tool
├── index.html                              # Main portfolio single-page application
├── package.json                            # Local development & validation script aliases
└── README.md                               # Project documentation
```

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/santhoshclx/PersonalPortfolio.git
   cd PersonalPortfolio
   git checkout development
   ```

2. **Start a local static server**:
   ```bash
   # Using Python
   python -m http.server 8088

   # Or using Node.js
   npx serve .
   ```

3. **Access in browser**:
   Navigate to `http://localhost:8088/`

---

## 🚢 Deployment to GitHub Pages

The repository contains an automated GitHub Actions deployment workflow at `.github/workflows/static.yml` targeting the `main` branch.

To review and deploy updates:
1. Review changes on the `development` branch.
2. Commit and push the updated branch.
3. Open a Pull Request from `development` to `main`.
4. Merging into `main` automatically triggers GitHub Pages deployment.

---

## 📞 Contact Channels

- **Email**: [santhoshkumar007r@gmail.com](mailto:santhoshkumar007r@gmail.com)
- **LinkedIn**: [linkedin.com/in/santhoshkumar--r](https://www.linkedin.com/in/santhoshkumar--r)
- **GitHub**: [github.com/santhoshclx](https://github.com/santhoshclx)
- **Credly**: [credly.com/users/santhoshkumar-r-2806/badges/credly](https://www.credly.com/users/santhoshkumar-r-2806/badges/credly)
- **Medium**: [@santhoshkumar007r](https://medium.com/@santhoshkumar007r)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
