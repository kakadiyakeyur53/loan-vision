# LoanVision 🏦

A comprehensive React-based loan calculator that helps users analyze loan options with detailed payment schedules, scenario comparisons, and multi-currency support.

## Features

- 🌍 **Multi-currency support** (USD, EUR, GBP, INR)
- 📊 **Interactive loan input form** with sliders and validation
- 💰 **Additional payment scenarios** (3, 6, or 12-month intervals)
- 📈 **Visual charts** - pie charts and balance timeline
- 📋 **Detailed payment schedules** - monthly and yearly views
- ⚖️ **Scenario comparison** between different loan terms
- 📄 **PDF export** for comprehensive loan analysis reports
- 📱 **Responsive design** for desktop and mobile

## Live Demo

Visit the live application: [https://yourusername.github.io/loan-vision/](https://yourusername.github.io/loan-vision/)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/loan-vision.git
cd loan-vision
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

The repository includes GitHub Actions for automatic deployment:

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://yourusername.github.io/loan-vision/`

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy using the provided script:
```bash
node deploy-gh-pages.js
```

Or use the bash script:
```bash
./build-for-gh-pages.sh
```

## Repository Setup Steps

1. **Create a new GitHub repository** named `loan-vision`

2. **Initialize git and connect to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - LoanVision loan calculator"
git branch -M main
git remote add origin https://github.com/yourusername/loan-vision.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "gh-pages" branch and "/" (root) folder
   - Click "Save"

4. **Wait for deployment:**
   - GitHub Actions will automatically build and deploy your site
   - Check the "Actions" tab to monitor deployment progress
   - Your site will be available at `https://yourusername.github.io/loan-vision/`

## Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI Components:** shadcn/ui, Radix UI
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **PDF Export:** jsPDF with autoTable
- **Form Handling:** React Hook Form with Zod validation
- **Deployment:** GitHub Pages with GitHub Actions

## Project Structure

```
loan-vision/
├── client/src/           # React frontend source
├── .github/workflows/    # GitHub Actions deployment
├── dist/                 # Built files (generated)
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using React and deployed on GitHub Pages