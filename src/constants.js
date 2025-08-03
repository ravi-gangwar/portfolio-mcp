// Resume data constants
const PERSONAL_INFO = {
  name: "Ravi Gangwar",
  title: "Software Engineer (Full-Stack, React native & DevOps)",
  location: "Kanpur, India",
  email: "ravigangwar7465@gmail.com",
  phone: "+91 9389968605",
  lastUpdated: "UPDATED AT 03 AUGUST 2025",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/ravi-gangwar/",
    github: "https://github.com/ravi-gangwar",
    leetcode: "https://leetcode.com/u/ravigangwar/",
    hackerrank: "https://www.hackerrank.com/profile/ravigangwar",
    instagram: "#",
    twitter: "https://x.com/ravigangwar_"
  }
};

const SUMMARY = {
  title: "About",
  content: "Final-year B.Tech IT student with 1+ year experience at Wyvate building scalable apps (React Native, Next.js, Node.js) with AI/LLM integrations (OpenAI). Focused on full-stack development, DevOps (AWS/Docker), and performance optimization. Passionate about creating efficient, user-centric solutions and staying current with emerging technologies."
};

const EXPERIENCE = [
  {
    company: "Wyvate",
    position: "Software Engineer",
    location: "Kanpur",
    duration: "May 2024 - now",
    links: [
      {
        name: "Play Store",
        link: "https://play.google.com/store/apps/details?id=com.wyvate.app"
      },
      {
        name: "App Store",
        link: "https://apps.apple.com/in/app/wyvate/id6749400000"
      },
      {
        name: "Website",
        link: "https://wyvate.com"
      }
    ],
    achievements: [
      "Developed Wyvate's customer platform from scratch for Android, iOS and Web, using React Native CLI and Next.js",
      "Optimized Node.js backend and PostgreSQL queries, reducing latency by 20%",
      "Integrated Google Maps APIs, geolocation, deep linking, and push/in-app/time-based notifications",
      "Engineered dynamic cart logic using Redux Toolkit for offers, add-ons, and pricing calculations",
      "Built AI-powered chatbot using OpenAI APIs and MCP servers for natural language interactions",
      "Implemented payments via PhonePe, HDFC SDKs, and real-time updates with WebSockets",
      "Used re-animated and React Query, Firestore, Redux Persist for caching and seamless data sync",
      "Integrated: vision camera, QR scanner, PDF generation, and voice input",
      "Followed clean architecture principles and tested using Jest and React Native Testing Library"
    ]
  }
];

const EDUCATION = {
  institution: "Dr. A. P. J. Abdul Kalam University, Lucknow",
  degree: "B.Tech in Information Technology",
  duration: "Sept 2022 - May 2026",
  details: [
    "CGPA: 7.2/10 (Percentage: 75%)",
    "12th: 83% (2021)",
    "10th: 82.6% (2019)",
    "Areas of Interest: Data Structure & Algorithms, Operating System, DBMS, OOPs"
  ]
};

const PROJECTS = [
  {
    name: "Wyvate Customer App",
    status: "Live",
    duration: "May 2024 - now",
    liveLinks: [
      {
        name: "Play Store",
        link: "https://play.google.com/store/apps/details?id=com.wyvate_native&pcampaignid=web_share"
      },
      {
        name: "App Store",
        link: "https://apps.apple.com/in/app/wyvate/id6740251470"
      }
    ],
    githubLinks: [],
    description: "Wyvate Customer App is a powerful mobile solution that extends the functionality of the Wyvate Customer Web platform to iOS and Android devices. Built with React Native and TypeScript, this app provides on-the-go access to customer management tools and real-time updates.",
    features: [
      "Mobile customer profiles with offline capabilities and push notifications",
      "Nearby vendors finder with location services and QR code scanning",
      "Order management with real-time delivery tracking and payment gateway integration",
      "Customer support system with real-time chat, email, and phone support",
      "Payment gateway integration with PhonePe and HDFC Bank for seamless transactions"
    ],
    techStack: "React Native, TypeScript, Redux Toolkit, React Navigation, AsyncStorage, Push Notifications, Socket.io, Payment Gateway"
  },
  {
    name: "Wyvate Customer Web",
    status: "Live",
    duration: "May 2024 - now",
    liveLinks: [
      {
        name: "Live Demo",
        link: "https://app.wyvate.com"
      }
    ],
    githubLinks: [],
    description: "Wyvate Customer Web is a comprehensive customer management platform designed to streamline business operations and enhance customer relationships. Built with Next.js and TypeScript, this web application provides powerful tools for customer data management, communication, and analytics.",
    features: [
      "Customer profile management with comprehensive data storage and organization",
      "Communication hub with integrated messaging and notification system",
      "Analytics dashboard with real-time insights and reporting tools",
      "Task management for creating and tracking customer-related tasks",
      "Document management with secure storage and sharing capabilities"
    ],
    techStack: "Next.js, TypeScript, Tailwind CSS, tRPC, Prisma, PostgreSQL, NextAuth.js, React Query"
  },
  {
    name: "GreenEarth v2",
    status: "Live",
    duration: "Oct 2023 - Feb 2024",
    liveLinks: [
      {
        name: "Live Demo",
        link: "https://greenearth2.vercel.app/"
      }
    ],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/greenEarth2.0"
      }
    ],
    description: "GreenEarth is an innovative web platform dedicated to promoting environmental sustainability and conscious living. This comprehensive solution combines e-commerce, education, and practical tools to help individuals and businesses reduce their environmental impact.",
    features: [
      "Eco-friendly marketplace connecting verified sustainable sellers with conscious consumers",
      "Real-time carbon footprint tracking with visualization and impact analytics",
      "Sustainability education with comprehensive resources and guides for green living",
      "Community platform for connecting with like-minded individuals and sharing practices",
      "Green business directory for discovering and supporting sustainable businesses"
    ],
    techStack: "Next.js, Tailwind CSS, Node.js, MongoDB, tRPC, Firebase, Payment Processing"
  },
  {
    name: "GreenEarth v1",
    status: "Live",
    duration: "Oct 2023 - Feb 2024",
    liveLinks: [
      {
        name: "Live Demo",
        link: "https://greenearth1.ravigangwar.cv/"
      }
    ],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/greenEarth"
      }
    ],
    description: "GreenEarth v1 is the initial implementation of our sustainable living platform, built using the MERN stack. This version established the core functionality and user experience that would later be enhanced in GreenEarth v2.",
    features: [
      "Eco-friendly marketplace for browsing and purchasing sustainable products from verified vendors",
      "Carbon footprint tracker for monitoring and visualizing environmental impact",
      "Sustainability education with comprehensive resources for green living",
      "Community platform for connecting with like-minded individuals and sharing practices",
      "Impact analytics for tracking environmental contributions over time"
    ],
    techStack: "MongoDB, Express.js, React.js, Node.js, JWT Authentication, Redux, Material UI, RESTful API, Stripe"
  },
  {
    name: "Code Editor",
    status: "Live Demo",
    duration: "Jan 2025 - now",
    liveLinks: [
      {
        name: "Live Demo",
        link: "https://codeeditor.ravigangwar.cv"
      }
    ],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/code-editor-frontend"
      }
    ],
    description: "Code Editor is a secure and efficient online code execution platform that allows users to write, execute, and review code in multiple programming languages. The system provides a sandboxed execution environment with robust security measures to prevent vulnerabilities.",
    features: [
      "Multi-language support for Java, JavaScript, Python, and more with Monaco Editor integration",
      "Secure execution with Docker-based sandboxing and resource limits",
      "Real-time feedback with instant execution results, errors, and performance metrics",
      "Code history for saving and reviewing past code submissions",
      "Anti-cheating system with plagiarism detection and execution fingerprinting"
    ],
    techStack: "React.js, TypeScript, TailwindCSS, Node.js, Express.js, Docker, JWT Authentication, PostgreSQL, Monaco Editor"
  },
  {
    name: "GuideX",
    status: "Live",
    duration: "Dec 2024 - Jan 2025",
    liveLinks: [
      {
        name: "Chrome Store",
        link: "https://chrome.google.com/webstore/detail/guidex"
      }
    ],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/guidex"
      }
    ],
    description: "GuideX is a powerful Chrome extension designed to enhance browser navigation and automate repetitive tasks. Built with React.js and the Chrome Extension API, this tool helps users streamline their browsing experience and increase productivity.",
    features: [
      "Custom navigation shortcuts for creating and managing personalized keyboard shortcuts",
      "Action automation for recording and replaying browser actions to automate repetitive tasks",
      "Smart bookmarks with intelligent categorization and organization",
      "Tab management for efficiently organizing and switching between browser tabs",
      "User scripts for creating and running custom scripts to enhance website functionality"
    ],
    techStack: "React.js, JavaScript, Chrome Extension API, HTML/CSS, Chrome Storage API, Manifest V3"
  },
  {
    name: "URL Shortener",
    status: "Live",
    duration: "Nov 2024 - Dec 2024",
    liveLinks: [
      {
        name: "Live Demo",
        link: "https://url-shortener.ravigangwar.cv"
      }
    ],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/url-shortener"
      }
    ],
    description: "URL Shortener is a robust REST API that transforms long URLs into short, manageable links. Built with Node.js and Express.js, this backend service provides secure URL shortening with comprehensive analytics and rate limiting capabilities.",
    features: [
      "URL shortening with custom codes and comprehensive validation",
      "Click analytics for tracking and visualizing click statistics for each shortened URL",
      "Rate limiting with configurable limits per user/IP to prevent abuse",
      "Expiration logic for setting custom expiration dates for temporary links",
      "Error handling with robust error handling and meaningful HTTP status codes"
    ],
    techStack: "Node.js, Express.js, TypeScript, MongoDB, JWT Authentication, Rate Limiting, URL Validation, Analytics"
  },
  {
    name: "StackIt",
    status: "Live",
    duration: "Oct 2024 - Nov 2024",
    liveLinks: [
      {
        name: "Live Demo",
        link: "https://stackit.ravigangwar.cv"
      }
    ],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/stackit"
      }
    ],
    description: "StackIt is a collaborative Q&A forum platform designed for structured knowledge sharing and learning. Built with Next.js and TypeScript, this platform provides a modern interface for asking questions, providing answers, and engaging in meaningful discussions.",
    features: [
      "Rich text editor with advanced formatting, emojis, images, and hyperlinks",
      "Voting system for upvoting/downvoting questions and answers to highlight quality content",
      "Tagging system with multi-select tags for better content organization and discovery",
      "Real-time notifications for instant notifications for answers, comments, and mentions",
      "User roles with Guest, User, and Admin roles with appropriate permissions"
    ],
    techStack: "Next.js, TypeScript, Tailwind CSS, MongoDB, tRPC, NextAuth.js, Rich Text Editor, Socket.io"
  },
  {
    name: "WebWatch",
    status: "ONGOING",
    liveLinks: [],
    githubLinks: [
      {
        name: "GitHub",
        link: "https://github.com/ravi-gangwar/webwatch"
      }
    ],
    description: "WebWatch is a web application that allows users to monitor and analyze website performance. The system provides a dashboard with real-time metrics and analytics to help users track website performance and identify issues.",
    features: [
      "Website monitoring for monitoring multiple websites and tracking their performance",
      "Performance analytics for analyzing website performance metrics and identifying issues",
      "User authentication with secure login and rate limiting",
      "User management for managing user accounts and permissions",
      "Notification system for sending notifications about website performance"
    ],
    techStack: "Next.js, Tailwind CSS, Node.js, MongoDB, tRPC, Socket.io, Real-time Analytics"
  }
];

const SKILLS = {
  languages: ["JavaScript", "TypeScript", "Java", "C", "SQL"],
  frontend: ["React Native", "Next.js", "React.js", "ReduxToolkit", "Tailwind CSS", "ShadCN", "Chakra UI"],
  backend: ["Node.js", "Express.js", "Jest", "MongoDB", "PostgreSQL", "PrismaORM", "TRPC", "Redis"],
  devops: ["GitHub", "Docker", "CI/CD", "PM2", "EC2 (AWS)", "S3 (AWS)", "CloudFront (AWS)", "Auto-scaling groups"],
  ai: ["Model Context Protocol (MCP servers)", "LLM APIs (GPT, GEMINI)"],
  softSkills: ["Team Collaboration", "Problem-Solving", "Agile Workflow", "Communication", "Adaptability"]
};

const ACHIEVEMENTS = [
  {
    title: "Published Wyvate App",
    description: "Published Wyvate App on Play Store and App Store, achieving 500+ Downloads on Android and 100+ on iOS"
  },
  {
    title: "Certifications",
    items: ["iOS Development Certificate", "MERN Certification", "AgeBlazer Champion Salesforce Trailhead"]
  }
];

module.exports = {
  PERSONAL_INFO,
  SUMMARY,
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
  SKILLS,
  ACHIEVEMENTS
}; 