// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeIcon = document.getElementById('dark-mode-icon');
const topicTitle = document.getElementById('topic-title');
const topicDescription = document.getElementById('topic-description');
const subtopicsList = document.getElementById('subtopics-list');
const faangQuestionsList = document.getElementById('faang-questions-list');
const backToTopicsBtn = document.getElementById('back-to-topics');

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

// Get topic ID from URL parameters
function getTopicIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load and display topic details
async function loadTopicDetails() {
    try {
        // Get topic ID from URL
        const topicId = getTopicIdFromUrl();
        
        if (!topicId) {
            topicTitle.textContent = 'Topic Not Found';
            topicDescription.textContent = 'Please select a valid topic from the topics page.';
            return;
        }
        
        // Define topic file names and their corresponding IDs
        const topicFiles = [
            { id: 1, name: 'jvm-internals.json' },
            { id: 2, name: 'advanced-concurrency.json' },
            { id: 3, name: 'modern-java.json' },
            { id: 4, name: 'design-patterns.json' },
            { id: 5, name: 'distributed-patterns.json' },
            { id: 6, name: 'spring-framework.json' },
            { id: 7, name: 'spring-boot.json' },
            { id: 8, name: 'microservices.json' },
            { id: 9, name: 'kafka.json' },
            { id: 10, name: 'advanced-sql.json' },
            { id: 11, name: 'jpa-hibernate.json' },
            { id: 12, name: 'scalability-ha.json' },
            { id: 13, name: 'dsa-advanced.json' },
            { id: 14, name: 'aws-deep-dive.json' },
            { id: 15, name: 'kubernetes.json' },
            { id: 16, name: 'cicd-devops.json' },
            { id: 17, name: 'application-security.json' },
            { id: 18, name: 'performance-engineering.json' },
            { id: 19, name: 'technical-leadership.json' },
            { id: 20, name: 'stakeholder-management.json' },
            { id: 21, name: 'machine-learning.json' },
            { id: 22, name: 'real-time-systems.json' },
            { id: 23, name: 'data-engineering.json' },
            { id: 24, name: 'api-design.json' },
            { id: 25, name: 'testing-strategies.json' },
            { id: 26, name: 'domain-driven-design.json' },
            { id: 27, name: 'platform-engineering.json' },
            { id: 28, name: 'cost-optimization.json' },
            { id: 29, name: 'faang-patterns.json' }
        ];

        const topicFile = topicFiles.find(file => file.id === topicId);

        if (!topicFile) {
            topicTitle.textContent = 'Topic Not Found';
            topicDescription.textContent = 'The requested topic is not available. Please select a valid topic from the topics page.';
            return;
        }
        
        // Load specific topic data
        const response = await fetch(`assets/data/topics/${topicFile.name}`);
        const topicData = await response.json();
        
        // Update topic title and description
        topicTitle.textContent = topicData.title;
        topicDescription.textContent = topicData.description || 'Comprehensive guide to mastering this critical topic for technical leadership roles.';
        
        // Render subtopics
        subtopicsList.innerHTML = '';
        topicData.subtopics.forEach(subtopic => {
            const subtopicCard = document.createElement('div');
            subtopicCard.className = 'subtopic-card';
            
            // Add details for this subtopic
            let detailsHTML = '<div class="subtopic-details"><h4>Key Concepts:</h4><ul>';
            subtopic.details.forEach(detail => {
                detailsHTML += `<li><i class="fas fa-check-circle"></i> ${detail}</li>`;
            });
            detailsHTML += '</ul></div>';
            
            subtopicCard.innerHTML = `
                <div class="subtopic-header">
                    <h3><i class="fas fa-chevron-right"></i> ${subtopic.name}</h3>
                </div>
                ${detailsHTML}
            `;
            
            subtopicsList.appendChild(subtopicCard);
        });
        
        // Render FAANG questions
        faangQuestionsList.innerHTML = '';
        if (topicData.faang_questions && topicData.faang_questions.length > 0) {
            topicData.faang_questions.forEach((question, index) => {
                const questionCard = document.createElement('div');
                questionCard.className = 'question-card';
                questionCard.innerHTML = `
                    <div class="question-number">${index + 1}.</div>
                    <div class="question-text">${question}</div>
                `;
                faangQuestionsList.appendChild(questionCard);
            });
        } else {
            faangQuestionsList.innerHTML = '<p class="no-questions">No specific FAANG interview questions available for this topic yet.</p>';
        }

        // Render Resources
        const resourcesSection = document.getElementById('resources-section');
        if (resourcesSection) {
            resourcesSection.innerHTML = `
                <h2><i class="fas fa-graduation-cap"></i> Learning Resources</h2>
                <div class="resources-list">
                    <div class="resource-card">
                        <h3><i class="fas fa-file-alt"></i> Articles</h3>
                        <ul>
                            ${topicData.resources.articles.map(link => `<li><a href="${link}" target="_blank">${link.split('/').pop().replace(/-/g, ' ').replace(/\.html|\.pdf/, '')}</a></li>`).join('')}
                        </ul>
                    </div>
                    <div class="resource-card">
                        <h3><i class="fas fa-video"></i> Videos</h3>
                        <ul>
                            ${topicData.resources.videos.map(link => `<li><a href="${link}" target="_blank">${link.split('v=').pop().substring(0, 20)}...</a></li>`).join('')}
                        </ul>
                    </div>
                    <div class="resource-card">
                        <h3><i class="fas fa-code"></i> Practice Problems</h3>
                        <ul>
                            ${topicData.resources.practice_problems.map(link => `<li><a href="${link}" target="_blank">${link.split('/').pop().replace(/-/g, ' ').replace(/\.html|\.pdf/, '')}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading topic details:', error);
        topicTitle.textContent = 'Error Loading Topic';
        topicDescription.textContent = 'There was an error loading the topic details. Please try again.';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Set initial theme
    setInitialTheme();
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Theme toggle
    themeIcon.addEventListener('click', toggleTheme);
    
    // Back to topics button
    backToTopicsBtn.addEventListener('click', () => {
        window.history.back();
    });
    
    // Load topic details
    await loadTopicDetails();
    
    // Trigger animations
    setTimeout(() => {
        const elements = document.querySelectorAll('.subtopic-card, .question-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});