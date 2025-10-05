// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeIcon = document.getElementById('dark-mode-icon');
const topicsContainer = document.getElementById('topics-container');
const systemDesignContainer = document.getElementById('system-design-container');

// Dark Mode Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Check for saved theme preference or respect OS setting
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Navigate between sections
function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Trigger animations
    setTimeout(() => {
        const elements = targetSection.querySelectorAll('.fade-in, .topic-card, .system-card, .practice-card, .progress-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// Load topics data from JSON
let topicsData = [];
const topicFiles = [
    { id: 1, name: 'jvm-internals.json', icon: 'microchip', description: 'Deep dive into class loading, JIT compilation, garbage collection, and performance profiling.' },
    { id: 2, name: 'advanced-concurrency.json', icon: 'bolt', description: 'Master Java Memory Model, advanced synchronization, concurrent data structures, and reactive programming.' },
    { id: 3, name: 'modern-java.json', icon: 'code', description: 'Functional programming, Streams API, CompletableFuture, and Project Loom virtual threads.' },
    { id: 4, name: 'design-patterns.json', icon: 'sitemap', description: 'Creational, Structural, and Behavioral patterns with real-world enterprise applications.' },
    { id: 5, name: 'distributed-patterns.json', icon: 'network-wired', description: 'Resilience patterns, data patterns, service communication, and deployment strategies.' },
    { id: 6, name: 'spring-framework.json', icon: 'leaf', description: 'IoC container internals, AOP, transaction management, and Spring Boot internals.' },
    { id: 7, name: 'spring-boot.json', icon: 'cogs', description: 'Monitoring, security, testing strategies, and production-ready implementations.' },
    { id: 8, name: 'microservices.json', icon: 'server', description: 'Service design, communication, discovery, API gateways, and observability.' },
    { id: 9, name: 'kafka.json', icon: 'exchange-alt', description: 'Core concepts, performance optimization, exactly-once semantics, and Kafka Streams.' },
    { id: 10, name: 'advanced-sql.json', icon: 'database', description: 'Query optimization, advanced SQL, transaction management, and database scaling.' },
    { id: 11, name: 'jpa-hibernate.json', icon: 'tasks', description: 'Entity management, performance tuning, advanced mappings, and concurrency.' },
    { id: 12, name: 'scalability-ha.json', icon: 'expand-arrows-alt', description: 'Load balancing, caching strategies, horizontal scaling, and reliability patterns.' },
    { id: 13, name: 'dsa-advanced.json', icon: 'hashtag', description: 'Complex data structures, graph algorithms, advanced tree problems, and string algorithms.' },
    { id: 14, name: 'aws-deep-dive.json', icon: 'cloud', description: 'Compute, storage, database, networking, monitoring, and security on AWS.' },
    { id: 15, name: 'kubernetes.json', icon: 'ship', description: 'Core concepts, advanced topics, and production patterns for container orchestration.' },
    { id: 16, name: 'cicd-devops.json', icon: 'sync-alt', description: 'Pipeline design, infrastructure as code, and monitoring & alerting strategies.' },
    { id: 17, name: 'application-security.json', icon: 'shield-alt', description: 'OWASP Top 10, secure coding, authentication/authorization, and API security.' },
    { id: 18, name: 'performance-engineering.json', icon: 'tachometer-alt', description: 'Application profiling, optimization strategies, scalability testing, and production optimization.' },
    { id: 19, name: 'technical-leadership.json', icon: 'users', description: 'Architecture decision records, code review best practices, technical debt management, and mentoring.' },
    { id: 20, name: 'stakeholder-management.json', icon: 'handshake', description: 'Communication, estimation, risk management, and meeting facilitation skills.' },
    { id: 21, name: 'machine-learning.json', icon: 'brain', description: 'ML fundamentals, ML in production, recommendation systems, and NLP & search.' },
    { id: 22, name: 'real-time-systems.json', icon: 'bolt', description: 'Stream processing, real-time analytics, and WebSocket & Server-Sent Events.' },
    { id: 23, name: 'data-engineering.json', icon: 'chart-line', description: 'Batch processing, data warehousing, data lake architecture, and data pipeline orchestration.' },
    { id: 24, name: 'api-design.json', icon: 'mobile-alt', description: 'RESTful API best practices, GraphQL, gRPC, and mobile-specific considerations.' },
    { id: 25, name: 'testing-strategies.json', icon: 'vial', description: 'Test pyramid, advanced testing, test automation, and TDD & BDD.' },
    { id: 26, name: 'domain-driven-design.json', icon: 'project-diagram', description: 'Strategic design, tactical design, and event storming for domain modeling.' },
    { id: 27, name: 'platform-engineering.json', icon: 'layer-group', description: 'Developer experience, infrastructure abstractions, and developer productivity.' },
    { id: 28, name: 'cost-optimization.json', icon: 'money-bill-wave', description: 'Cloud cost management, application efficiency, and FinOps practices.' },
    { id: 29, name: 'faang-patterns.json', icon: 'trophy', description: 'Company-specific preparation strategies for Meta, Google, Amazon, Apple, Netflix, and other top tech companies.' }
];

async function loadTopicsData() {
    try {
        const fetchPromises = topicFiles.map(async (fileInfo) => {
            const response = await fetch(`assets/data/topics/${fileInfo.name}`);
            const data = await response.json();
            return {
                id: fileInfo.id,
                title: data.title,
                icon: fileInfo.icon,
                description: fileInfo.description,
                subtopics: data.subtopics.map(st => st.name)
            };
        });
        topicsData = await Promise.all(fetchPromises);
        renderTopics();
    } catch (error) {
        console.error('Error loading topics data:', error);
        // Fallback to a simplified structure or error message if loading fails
        topicsData = topicFiles.map(fileInfo => ({
            id: fileInfo.id,
            title: fileInfo.name.replace('.json', '').replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            icon: fileInfo.icon,
            description: fileInfo.description,
            subtopics: ["Error loading subtopics"]
        }));
        renderTopics();
    }
}

// Load system design scenarios from JSON
let systemDesignScenarios = [];
async function loadSystemDesignData() {
    try {
        const response = await fetch('assets/data/system-design.json');
        const data = await response.json();
        
        // Format the data for our UI
        systemDesignScenarios = data.system_design_scenarios.map(scenario => ({
            id: scenario.id,
            title: scenario.title,
            category: scenario.category,
            description: scenario.description
        }));
        
        // Re-render system design after data is loaded if needed
        renderSystemDesign();
    } catch (error) {
        console.error('Error loading system design data:', error);
        // Fallback to original data if loading fails
        systemDesignScenarios = [
            {
                id: 1,
                title: "Design WhatsApp/Messenger",
                category: "Social Media & Communication",
                description: "Design a messaging platform with real-time communication, file sharing, and end-to-end encryption."
            },
            {
                id: 2,
                title: "Design Instagram Feed",
                category: "Social Media & Communication",
                description: "Design a social media feed system with billions of users, real-time updates, and personalization."
            },
            {
                id: 3,
                title: "Design Twitter Timeline",
                category: "Social Media & Communication",
                description: "Design a timeline service that handles millions of tweets per second with personalized feeds."
            },
            {
                id: 4,
                title: "Design Netflix Streaming",
                category: "Streaming & Media",
                description: "Design a video streaming platform with content delivery, personalization, and offline capabilities."
            },
            {
                id: 5,
                title: "Design Amazon Product Catalog",
                category: "E-commerce & Marketplace",
                description: "Design a product catalog for the world's largest online retailer with inventory management."
            },
            {
                id: 6,
                title: "Design Uber/Lyft Ride Matching",
                category: "E-commerce & Marketplace",
                description: "Design a ride-hailing platform with real-time matching, geolocation, and surge pricing."
            },
            {
                id: 7,
                title: "Design Google Search",
                category: "Search & Discovery",
                description: "Design a web search engine with indexing, ranking, and query processing at global scale."
            },
            {
                id: 8,
                title: "Design URL Shortener",
                category: "Infrastructure & Tools",
                description: "Design a service that creates short aliases for long URLs with high availability and scalability."
            },
            {
                id: 9,
                title: "Design Notification System",
                category: "Infrastructure & Tools",
                description: "Design a system to send millions of notifications across multiple channels (SMS, email, push)."
            },
            {
                id: 10,
                title: "Design Real-time Analytics Dashboard",
                category: "Analytics & Monitoring",
                description: "Design a system for real-time metrics collection, processing, and visualization."
            },
            {
                id: 11,
                title: "Design TikTok Video Recommendation",
                category: "Social Media & Communication",
                description: "Design a video recommendation system that serves personalized feeds to billions of users."
            },
            {
                id: 12,
                title: "Design LinkedIn Connection System",
                category: "Social Media & Communication",
                description: "Design a professional network with connection requests, recommendations, and job matching."
            },
            {
                id: 13,
                title: "Design Slack Messaging Platform",
                category: "Social Media & Communication",
                description: "Design a team communication platform with channels, direct messaging, and integrations."
            },
            {
                id: 14,
                title: "Design Discord Voice/Video Chat",
                category: "Social Media & Communication",
                description: "Design a gaming communication platform with voice, video, and text channels."
            },
            {
                id: 15,
                title: "Design Food Delivery (DoorDash/Uber Eats)",
                category: "E-commerce & Marketplace",
                description: "Design a food delivery platform connecting restaurants, customers, and delivery drivers."
            },
            {
                id: 16,
                title: "Design Dynamic Pricing System",
                category: "E-commerce & Marketplace",
                description: "Design a system that dynamically adjusts prices based on demand, inventory, and competition."
            },
            {
                id: 17,
                title: "Design Inventory Management",
                category: "E-commerce & Marketplace",
                description: "Design a system to manage inventory across multiple warehouses and sales channels."
            },
            {
                id: 18,
                title: "Design Payment Gateway",
                category: "E-commerce & Marketplace",
                description: "Design a secure payment processing system supporting multiple payment methods."
            },
            {
                id: 19,
                title: "Design YouTube Video Platform",
                category: "Streaming & Media",
                description: "Design a video sharing platform with upload, transcoding, and recommendation systems."
            },
            {
                id: 20,
                title: "Design Spotify Recommendation",
                category: "Streaming & Media",
                description: "Design a music streaming platform with personalized recommendations and social features."
            },
            {
                id: 21,
                title: "Design Live Streaming (Twitch)",
                category: "Streaming & Media",
                description: "Design a live streaming platform for gamers with real-time interaction."
            },
            {
                id: 22,
                title: "Design Video Transcoding Pipeline",
                category: "Streaming & Media",
                description: "Design a system to convert uploaded videos into multiple formats and resolutions."
            },
            {
                id: 23,
                title: "Design CDN for Media Delivery",
                category: "Streaming & Media",
                description: "Design a content delivery network optimized for media content."
            },
            {
                id: 24,
                title: "Design Autocomplete/Typeahead",
                category: "Search & Discovery",
                description: "Design a system that provides search suggestions in real-time as users type."
            },
            {
                id: 25,
                title: "Design Web Crawler",
                category: "Search & Discovery",
                description: "Design a system to crawl and index web pages for a search engine."
            },
            {
                id: 26,
                title: "Design Recommendation System",
                category: "Search & Discovery",
                description: "Design a recommendation engine for e-commerce or content discovery."
            },
            {
                id: 27,
                title: "Design Personalized News Feed",
                category: "Search & Discovery",
                description: "Design a system to curate personalized news feeds for users."
            },
            {
                id: 28,
                title: "Design Rate Limiter",
                category: "Infrastructure & Tools",
                description: "Design a system to limit the rate of requests for APIs or services."
            },
            {
                id: 29,
                title: "Design Distributed Cache",
                category: "Infrastructure & Tools",
                description: "Design a distributed caching system for high-performance applications."
            },
            {
                id: 30,
                title: "Design Job Scheduler",
                category: "Infrastructure & Tools",
                description: "Design a system for scheduling and executing background jobs."
            },
            {
                id: 31,
                title: "Design Distributed Task Queue",
                category: "Infrastructure & Tools",
                description: "Design a system for distributing and processing tasks across multiple workers."
            },
            {
                id: 32,
                title: "Design API Gateway",
                category: "Infrastructure & Tools",
                description: "Design a system that manages API requests, authentication, and routing."
            },
            {
                id: 33,
                title: "Design Service Mesh",
                category: "Infrastructure & Tools",
                description: "Design a dedicated infrastructure layer to handle service-to-service communication."
            },
            {
                id: 34,
                title: "Design Logging System (ELK alternative)",
                category: "Analytics & Monitoring",
                description: "Design a distributed logging system for collecting and analyzing logs."
            },
            {
                id: 35,
                title: "Design Metrics Aggregation System",
                category: "Analytics & Monitoring",
                description: "Design a system for collecting, aggregating, and storing application metrics."
            },
            {
                id: 36,
                title: "Design A/B Testing Platform",
                category: "Analytics & Monitoring",
                description: "Design a system to run A/B tests and analyze results."
            },
            {
                id: 37,
                title: "Design Fraud Detection System",
                category: "Analytics & Monitoring",
                description: "Design a real-time fraud detection system for financial transactions."
            },
            {
                id: 38,
                title: "Design Google Docs Collaborative Editing",
                category: "Collaboration & Productivity",
                description: "Design a system for real-time collaborative document editing."
            },
            {
                id: 39,
                title: "Design Dropbox File Storage",
                category: "Collaboration & Productivity",
                description: "Design a cloud-based file storage and synchronization service."
            },
            {
                id: 40,
                title: "Design Calendar Scheduling System",
                category: "Collaboration & Productivity",
                description: "Design a calendar system with scheduling and availability management."
            },
            {
                id: 41,
                title: "Design Ticketing System (JIRA)",
                category: "Collaboration & Productivity",
                description: "Design a project management and issue tracking system."
            },
            {
                id: 42,
                title: "Design Code Repository (GitHub)",
                category: "Collaboration & Productivity",
                description: "Design a Git-based code hosting and collaboration platform."
            },
            {
                id: 43,
                title: "Design Stock Trading Platform",
                category: "Financial Systems",
                description: "Design a high-frequency trading platform with real-time market data."
            },
            {
                id: 44,
                title: "Design Wallet System",
                category: "Financial Systems",
                description: "Design a digital wallet system for payments and transactions."
            },
            {
                id: 45,
                title: "Design Ledger for Cryptocurrency",
                category: "Financial Systems",
                description: "Design a blockchain-based ledger system for cryptocurrency transactions."
            },
            {
                id: 46,
                title: "Design High-Frequency Trading System",
                category: "Financial Systems",
                description: "Design a system optimized for trading millions of orders per second."
            },
            {
                id: 47,
                title: "Design Multiplayer Game Backend",
                category: "Gaming & Real-time",
                description: "Design a backend system for real-time multiplayer games."
            },
            {
                id: 48,
                title: "Design Leaderboard System",
                category: "Gaming & Real-time",
                description: "Design a system for tracking and ranking player scores."
            },
            {
                id: 49,
                title: "Design Real-time Bidding System",
                category: "Gaming & Real-time",
                description: "Design an ad exchange for real-time bidding on ad impressions."
            },
            {
                id: 50,
                title: "Design Parking Lot System",
                category: "Specialized Systems",
                description: "Design a system to manage parking spaces in a multi-level parking facility."
            },
            {
                id: 51,
                title: "Design Hotel Booking System",
                category: "Specialized Systems",
                description: "Design an online hotel reservation system with availability management."
            },
            {
                id: 52,
                title: "Design Library Management System",
                category: "Specialized Systems",
                description: "Design a system to manage books, members, and borrowing in a library."
            },
            {
                id: 53,
                title: "Design LRU Cache (System-level)",
                category: "Specialized Systems",
                description: "Design an in-memory LRU cache with O(1) time complexity."
            },
            {
                id: 54,
                title: "Design Distributed Lock Manager",
                category: "Specialized Systems",
                description: "Design a system to provide distributed locking across multiple services."
            },
            {
                id: 55,
                title: "Design URL Shortener",
                category: "Infrastructure & Tools",
                description: "Design a service that creates short aliases for long URLs with high availability and scalability."
            }
        ];
        
        renderSystemDesign();
    }
}

// Render topics
function renderTopics() {
    topicsContainer.innerHTML = '';
    
    topicsData.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card fade-in';
        
        let subtopicsHTML = '<div class="topic-subtopics"><h4>Key Areas:</h4><ul>';
        topic.subtopics.forEach(subtopic => {
            subtopicsHTML += `<li><i class="fas fa-check-circle"></i> ${subtopic}</li>`;
        });
        subtopicsHTML += '</ul></div>';
        
        topicCard.innerHTML = `
            <h3><i class="fas fa-${topic.icon}"></i> ${topic.title}</h3>
            <p>${topic.description}</p>
            ${subtopicsHTML}
            <button class="btn btn-outline" onclick="startTopic(${topic.id})">Start Learning</button>
        `;
        
        topicsContainer.appendChild(topicCard);
    });
}

// Render system design scenarios
function renderSystemDesign() {
    systemDesignContainer.innerHTML = '';
    
    systemDesignScenarios.forEach(scenario => {
        const scenarioCard = document.createElement('div');
        scenarioCard.className = 'system-card fade-in';
        
        scenarioCard.innerHTML = `
            <div class="system-category">${scenario.category}</div>
            <h3><i class="fas fa-project-diagram"></i> ${scenario.title}</h3>
            <p>${scenario.description}</p>
            <button class="btn btn-outline" onclick="startSystemDesign(${scenario.id})">Design Challenge</button>
        `;
        
        systemDesignContainer.appendChild(scenarioCard);
    });
}

// Placeholder functions for interactive features
function startTopic(topicId) {
    // Navigate to topic detail page with the topic ID
    window.location.href = `topic-detail.html?id=${topicId}`;
}

function startSystemDesign(scenarioId) {
    alert(`Starting system design challenge: ${systemDesignScenarios.find(s => s.id === scenarioId).title}`);
}

// Progress tracking
function updateProgress() {
    // Get progress from localStorage or initialize
    const progress = JSON.parse(localStorage.getItem('interviewProgress')) || {
        topicsMastered: 0,
        questionsAnswered: 0,
        systemDesignsCompleted: 0
    };
    
    // Update the progress bars
    document.getElementById('topics-progress').style.width = `${(progress.topicsMastered / 29) * 100}%`;
    document.getElementById('topics-progress-text').textContent = `${progress.topicsMastered}/29`;
    
    document.getElementById('questions-progress').style.width = `${Math.min((progress.questionsAnswered / 2000) * 100, 100)}%`;
    document.getElementById('questions-progress-text').textContent = `${progress.questionsAnswered}/2000+`;
    
    document.getElementById('designs-progress').style.width = `${(progress.systemDesignsCompleted / 55) * 100}%`;
    document.getElementById('designs-progress-text').textContent = `${progress.systemDesignsCompleted}/55`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Set initial theme
    setInitialTheme();
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Theme toggle
    themeIcon.addEventListener('click', toggleTheme);
    
    // CTA buttons
    document.getElementById('start-learning').addEventListener('click', () => {
        navigateToSection('topics');
    });
    
    document.getElementById('view-topics').addEventListener('click', () => {
        navigateToSection('topics');
    });
    
    // Practice buttons
    document.getElementById('coding-practice').addEventListener('click', () => {
        alert('Coding practice module would open here');
    });
    
    document.getElementById('system-design-practice').addEventListener('click', () => {
        navigateToSection('system-design');
    });
    
    document.getElementById('behavioral-practice').addEventListener('click', () => {
        alert('Behavioral practice module would open here');
    });
    
    document.getElementById('mock-interview').addEventListener('click', () => {
        alert('Mock interview simulation would start here');
    });
    
    // Progress tracking
    document.getElementById('reset-progress').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your progress?')) {
            localStorage.removeItem('interviewProgress');
            updateProgress();
        }
    });
    
    document.getElementById('export-progress').addEventListener('click', () => {
        const progress = JSON.parse(localStorage.getItem('interviewProgress')) || {
            topicsMastered: 0,
            questionsAnswered: 0,
            systemDesignsCompleted: 0
        };
        
        const dataStr = JSON.stringify(progress, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'interview-progress.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
    
    // Initialize content
    await Promise.all([loadTopicsData(), loadSystemDesignData()]);  // Wait for both data loads
    
    // Update progress display
    updateProgress();
});

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Set initial theme
    setInitialTheme();
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Theme toggle
    themeIcon.addEventListener('click', toggleTheme);
    
    // CTA buttons
    document.getElementById('start-learning').addEventListener('click', () => {
        navigateToSection('topics');
    });
    
    document.getElementById('view-topics').addEventListener('click', () => {
        navigateToSection('topics');
    });
    
    // Practice buttons
    document.getElementById('coding-practice').addEventListener('click', () => {
        alert('Coding practice module would open here');
    });
    
    document.getElementById('system-design-practice').addEventListener('click', () => {
        navigateToSection('system-design');
    });
    
    document.getElementById('behavioral-practice').addEventListener('click', () => {
        alert('Behavioral practice module would open here');
    });
    
    document.getElementById('mock-interview').addEventListener('click', () => {
        alert('Mock interview simulation would start here');
    });
    
    // Initialize content
    await Promise.all([loadTopicsData(), loadSystemDesignData()]);  // Wait for both data loads
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});