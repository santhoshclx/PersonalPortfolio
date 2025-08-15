# Personal Portfolio Website

A modern, responsive personal portfolio website showcasing my work as a Software Engineer specializing in AI/ML, DevOps, and Web Development.

## 🚀 Release Notes - v0.9.0

### New Features

#### Dynamic Content Loading
- **Single-page application experience** with seamless navigation between sections
- **Project detail pages** load dynamically without page refresh using `loadProjectContent()`
- **Blog posts** integrate smoothly into the main portfolio interface

#### Interactive Code Examples
- **Copy-to-clipboard functionality** for all code snippets across projects and blog posts
- **Syntax highlighting** support for multiple programming languages
- **Interactive code blocks** with visual feedback on copy actions

#### Enhanced Project Showcase
- **Linear Regression from Scratch** - Complete implementation with mathematical explanations
- **Pattern Matching with RegEx** - Interactive regex demonstration and guide
- **Detailed project pages** with comprehensive code examples and usage instructions

#### Blog Integration
- **Regular Expressions Guide** - Comprehensive tutorial with practical examples
- **Technical articles** with proper formatting and code highlighting
- **Responsive blog layout** that matches the overall portfolio design

### UI/UX Improvements
- **Mobile-first responsive design** optimized for all screen sizes
- **Smooth transitions** and animations throughout the interface
- **Modern color scheme** using CSS custom properties
- **Professional typography** with Google Fonts (Poppins)
- **Enhanced project cards** with hover effects

### Technical Improvements
- **Modular CSS structure** with well-organized custom properties
- **Clean JavaScript implementation** for navigation and dynamic content
- **Semantic HTML structure** for better accessibility and SEO
- **Performance optimizations** with efficient asset loading

## 🌟 Features

- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **Dynamic Content Loading** - Projects and blog posts load dynamically without page refresh
- **Interactive Navigation** - Smooth transitions between different sections
- **Project Showcase** - Detailed project pages with code examples and copy functionality
- **Blog Integration** - Technical blog posts with syntax highlighting
- **Contact Form** - Direct contact functionality
- **Social Media Links** - Easy access to professional profiles

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: Ionicons
- **Fonts**: Google Fonts (Poppins)
- **Deployment**: Static hosting ready

## 📁 Project Structure

```
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── script.js          # Main JavaScript functionality
│   └── images/                # Images and icons
├── projects/
│   ├── PatternMatchingRegEx.html
│   └── LinearRegressionFromSCRATCH.html
├── blogs/
│   └── RegularExpressionsGuide.html
├── index.html                 # Main portfolio page
└── README.md
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/santhoshclx/portfolio.git
   cd portfolio
   ```

2. **Open locally**
   - Open `index.html` in your browser, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using VS Code Live Server extension
     ```

3. **View the portfolio**
   - Navigate to `http://localhost:8000` (if using local server)
   - Or simply open `index.html` in your browser

## 📱 Sections

- **About** - Personal introduction and services offered
- **Resume** - Professional experience and education
- **Projects** - Showcase of technical projects with interactive demos
- **Blog** - Technical articles and tutorials
- **Contact** - Contact form and social media links

## 🎨 Customization

### Colors
The website uses CSS custom properties for easy theming. Main colors can be modified in `assets/css/style.css`:

```css
:root {
  --orange-yellow-crayola: #ffdb70;
  --smoky-black: #0c0c0c;
  --eerie-black-1: #1e1e1f;
  /* ... other color variables */
}
```

### Content
- Update personal information in `index.html`
- Add new projects in the `projects/` directory
- Add new blog posts in the `blogs/` directory
- Update project/blog links in the main `index.html` file

## 🔧 Key Features Implementation

### Dynamic Content Loading
Projects and blog posts are loaded dynamically using the `loadProjectContent()` function, providing a seamless single-page application experience.

### Copy Code Functionality
Code snippets include copy-to-clipboard functionality for better user experience.

### Responsive Navigation
Mobile-friendly navigation with smooth transitions and active state management.

## 🎯 What's Next (v1.0.0)
- Additional project showcases
- More technical blog posts
- Enhanced animations and micro-interactions
- Dark/light theme toggle
- Advanced contact form features

## 📞 Contact

- **Email**: santhoshkumar007r@gmail.com
- **Phone**: +91 86676 74914
- **LinkedIn**: [santhoshkumar--r](https://www.linkedin.com/in/santhoshkumar--r/)
- **GitHub**: [santhoshclx](https://github.com/santhoshclx)
- **Medium**: [@santhoshkumar007r](https://medium.com/@santhoshkumar007r)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern portfolio trends
- Icons provided by [Ionicons](https://ionicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

⭐ Star this repository if you found it helpful!
