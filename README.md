# 🛡️ LinkedIn Cyber Risk Index (LCRI) v1.0

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)
![Client-Side](https://img.shields.io/badge/Execution-100%25_Client--Side-green)
![Privacy](https://img.shields.io/badge/Data-Zero_Collection-success)
![License](https://img.shields.io/badge/License-Academic_Research-blue)

The **LinkedIn Cyber Risk Index (LCRI)** is a web-based assessment tool designed to evaluate a user's vulnerability to social engineering attacks based on their LinkedIn profile disclosure, platform behaviour, and susceptibility to targeted scenarios. 

Developed as a **Design Science Research Artifact** at Robert Gordon University, this application leverages a specialized Knowledge Graph Ontology to map individual vulnerability factors to complete attack chains.

---

## 🎯 Purpose
In today's interconnected professional landscape, LinkedIn profiles serve as rich sources of personal and professional information that can be exploited by malicious actors. The LCRI bridges the gap between security awareness and practical action by:

- **Quantifying** social engineering vulnerability through a structured scoring system

- **Identifying** specific risk factors across three key dimensions

- **Providing** personalized recommendations to mitigate identified risks

- **Educating** users about social engineering tactics and attack vectors

- **Visualizing** risk profiles through interactive charts and gauges

## ✨ Key Features

- **Three-Dimensional Assessment**: Evaluates risk across Disclosure (40%), Platform Behaviour (35%), and Susceptibility (25%).
- **Scenario-Based Testing**: Presents realistic social engineering narratives (e.g., fake recruiters, spear-phishing, authority pressure) to gauge user responses.
- **Knowledge Graph Risk Paths (P1–P5)**: Detects cross-dimensional interaction effects to identify complete attack chains (e.g., *Authority Pretexting*, *Direct Phishing*, *Reconnaissance*).
- **Interactive Data Visualization**: Features custom-built, lightweight SVG components including an animated Score Gauge and a dynamic Vulnerability Radar Chart.
- **Actionable Intelligence**: Generates factor-level recommendations and elaboration texts explaining the causal chains of identified threats.
- **100% Anonymous & Private**: All scoring, logic, and state management are executed entirely client-side. **No data is stored, tracked, or transmitted to any server.**

---

## 🧮 The LCRI Methodology

The LCRI score (0–100) is calculated using a **two-step normalized weighted sum**. 

### Dimensions & Weights
| Dimension | Weight | Max Points | Focus Area |
| :--- | :---: | :---: | :--- |
| **🔓 Disclosure** | 40% | 40 | Visibility of supervisor names, research titles, contact details, and timelines. |
| **⚡ Platform Behaviour** | 35% | 35 | Connection habits, public posting, and engagement with unverified accounts. |
| **🎯 Susceptibility** | 25% | 25 | Responses to 5 distinct social engineering scenarios. |

### Scoring Formula
1. **Dimension Percentage**: `(Raw Score / Max Points) × 100`
2. **Total LCRI Score**: `(Disclosure% × 0.40) + (Behaviour% × 0.35) + (Susceptibility% × 0.25)`

### Risk Bands
| Band | Score Range | Indicator |
| :--- | :--- | :--- |
| **Low Risk** | 0 – 33 | 🟢 Minimal social engineering risk. |
| **Medium Risk** | 34 – 66 | 🟡 Moderate exposure; some vulnerable habits. |
| **High Risk** | 67 – 100 | 🔴 Significantly exposed; urgent review recommended. |

---


## 🖥️ Application Flow

The UI is built as a seamless, three-screen single-page application (SPA):

1. **Landing Page**: Introduces the LCRI with plain-English dimension descriptions (no complex formulas) and initiates the assessment.
2. **Assessment Flow**: Walks the user through 15 sequential factors with an auto-advancing UI, progress tracking, and dedicated scenario panels for susceptibility questions.
3. **Results Dashboard**: 
   - Animated Score Gauge & Risk Band Badge.
   - Dimension Breakdown Bars.
   - Vulnerability Profile Radar Chart (SVG).
   - **Risk Path Summary Card**: Displays active P1-P5 attack chains with causal elaboration texts.
   - **Recommendations Card**: Displays factor-specific advice sorted by severity (Red/Amber/Green).

---

## 🚀 Getting Started

This project is built as a self-contained React component utilizing inline styling and raw SVG generation, requiring minimal external dependencies.

### Prerequisites
- Node.js (v14 or higher)
- A React environment (e.g., Vite, Create React App, or Next.js)

### Installation & Usage

1. Clone the repository and navigate to your React project's `src` folder.
2. Save the provided code as `LCRIApp.jsx` (or `.tsx`).
3. Import and render the component in your main `App.js`:

## Project Structure
```
LCRI-Web-Based-Artifact/
├── src/
│   ├── App.jsx          # Main application component with all logic
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```
   
## Technology Stack

- **React 18**: Frontend framework for building the interactive UI
- **Vite**:	Next-generation build tool for fast development
- **Vanilla CSS**: Styling with custom design system
- **SVG**: Interactive data visualizations (radar chart, gauge)

---
4. Start your development server
   ```
   npm run dev
   ```

## 🏛️ Academic & Research Context
This artifact was developed to support academic research into social engineering vulnerabilities on professional networking platforms.

- *Author*: Elijah Elorm Adzigblie
- *Institution*: School of Computing, Engineering and Technology, Robert Gordon University, Aberdeen
- *Date*: July 2026
- *Artifact Type*: Design Science Research (DSR) Web-Based Artifact
  
### References & Foundations
Wang et al. (2021): Social Engineering Domain Ontology.
Omowumi, McDermott and Munasinghe (2025): Extended Ontology for LinkedIn-specific attack vectors.

## 📄 License & Disclaimer
This project is an academic research artifact. It is provided for educational and research purposes. The LCRI assessment is a heuristic tool and does not guarantee absolute security or immunity from social engineering attacks. Users should always follow their organization's official cybersecurity policies.

```© 2026 Elijah Elorm Adzigblie | Robert Gordon University```
