import React, { useState } from 'react';
import './CSS/About.css'; // Import the custom CSS

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState('about');

  const personalInfo = {
    name: "Abhinav Kumar",
    title: "Software Developer",
    contact: {
      phone: "+91 9971029451",
      email: "ak2711474@gmail.com",
      linkedin: "linkedin.com/in/abhinavkumar03",
      github: "github.com/abhinavkumar03"
    }
  };

  const skills = [
    { category: "Languages", items: ["PHP", "Python", "JavaScript", "SQL", "C/C++", "Java"] },
    { category: "Frameworks & Libraries", items: ["ReactJS", "Laravel", "Livewire", "HTML", "CSS", "AJAX", "Spring"] },
    { category: "Cloud & DevOps", items: ["AWS (DynamoDB, S3, SQS, Lambda)", "Kubernetes", "Docker", "CI/CD"] },
    { category: "Databases & Data", items: ["MongoDB", "SQL", "Elasticsearch", "Kafka", "Spark"] }
  ];

  const experience = [
    {
      company: "Collegedunia",
      position: "Software Developer",
      location: "Gurgoan, Haryana",
      period: "Sep 2024 – Present",
      achievements: [
        "Improved system performance by 30% through strategic debugging and optimization techniques",
        "Reduced development cycles by 15% while maintaining quality via streamlined Agile processes",
        "Increased user feedback by 25% through architected scalable software solutions"
      ],
      projects: [
        {
          name: "CRM System",
          description: [
            {
               title: "Problem Context",
               content: ["The admissions team was handling over 5,000 monthly student inquiries using spreadsheets, resulting in 20% of follow-ups being delayed beyond 48 hours"]
            },
            {
               title: "Technical Implementation",
               content: ["Built a modular Laravel application with a service-oriented architecture to handle different aspects of the student journey",
                "Implemented queuing systems using Laravel Jobs and MySQL for handling high-volume operations",
                "Created custom algorithms to score and prioritize leads based on 15+ data points"
               ]
            },
            {
               title: "Impact Demonstration",
               content: ["The 40% reduction in response time translated to counselors responding to all inquiries within 12 hours instead of the previous 20+ hours",
                "The 25% conversion increase represented approximately 50 additional enrollments per month",
                "Counselors previously handling 60-70 prospects simultaneously could now effectively manage 180-210"
               ]
            },
          ]
        },
        {
          name: "Education Platform (Prepp IAS)",
          description: [
            {
               title: "Problem Context",
               content: ["Online preparation for civil services examinations required managing 1,000+ hours of content across 50+ subjects with personalized study paths"]
            },
            {
               title: "Technical Solution",
               content: ["Implemented a React frontend using context API for state management and custom hooks for performance optimization",
                "Developed a Node.js backend with Express, creating RESTful services for content delivery, user progress tracking, and assessment management",
                "Used WebSockets for real-time progress updates and notifications"
               ]
            },
            {
               title: "Measurable Outcomes",
               content: ["The 35% engagement improvement came from students spending an average of 95 minutes per session versus the previous 70 minutes",
                "Course completion rates increased from approximately 52% to 80%, directly impacting revenue retention",
                "Administrative tasks that previously took 15 staff hours daily were reduced to 7.5 hours through automated grading and progress reports"
               ]
            },
          ]
        }
      ]
    },
    {
      company: "Pinsout Innovation",
      position: "PHP Laravel Developer",
      location: "Noida, Uttar Pradesh",
      period: "Jan 2024 – July 2024",
      achievements: [
        "Enhanced API performance by 25% and supported 40% more concurrent users through RESTful optimization",
        "Accelerated database queries by 20% and reduced system downtime by 35% through advanced troubleshooting",
        "Reduced post-deployment bugs by 30% by implementing custom scripting solutions and CI/CD pipelines"
      ],
      projects: [
        {
          name: "College-Student Management (OyeCollege)",
          description: [
            {
               title: "Problem Context",
               content: ["A network of 15 colleges was struggling with fragmented communication across departments, resulting in students missing critical deadlines and information"]
            },
            {
               title: "Technical Approach",
               content: ["Deployed a microservices architecture with five separate services handling different aspects of the college-student relationship",
                "Implemented event-driven communication between services using message queues",
                "Developed a unified frontend interface with role-based access for administrators, faculty, and students"
               ]
            },
            {
               title: "Result Validation",
               content: ["Administrative processing time for student requests dropped from an average of 4 days to 2.2 days",
                "Student satisfaction scores in quarterly surveys improved from 6.5/10 to 8.5/10",
                "Centralized information reduced repetitive inquiries by 25%, saving approximately 30 staff hours weekly"
               ]
            },
          ]
        },
        {
          name: "Financial Services Platform (EarnPie)",
          description: [
            {
               title: "Problem Context",
               content: ["Financial advisors needed a compliant system to replace error-prone manual processes handling sensitive data for 2,000+ clients"]
            },
            {
               title: "Security-Focused Implementation",
               content: ["Developed with Laravel's security features including encrypted storage for sensitive data",
                "Implemented PostgreSQL with advanced indexing and partitioning for handling large transaction datasets",
                "Created an audit logging system tracking all data access and modifications"
               ]
            },
            {
               title: "Business Impact",
               content: ["Reduced financial processing errors from approximately 12% to under 5% of transactions",
                "Decreased monthly reporting time from 40 hours to 10 hours through automated data aggregation",
                "Implemented encryption, access controls, and compliance checks that passed all regulatory audits"
               ]
            },
          ]
        }
      ]
    }
  ];

  const education = [
    {
      institution: "Lloyd Institute of Engineering and Technology",
      degree: "Bachelor of Technology, Computer Science and Engineering",
      graduation: "Jul 2025",
      coursework: "Data Structures & Algorithms, Object-Oriented Programming, Databases, Operating Systems, Computer Networks"
    }
  ];

  const projects = [
    {
      name: "Full Stack Ecommerce Website",
      status: "Open",
      features: [
        "User Authentication & Security: Secure login/registration with JWT and encryption, including role-based access control (admin/user)",
        "Admin Dashboard: Admin panel for user management, product inventory control, and order processing",
        "Product Management: Dynamic product catalog with full CRUD operations across multiple categories",
        "Shopping Cart & Checkout: Built intuitive cart system with persistent storage, quantity adjustment, and secure payment processing",
        "Order Management: Implemented order history tracking, transaction records, and status updates",
        "Technologies Used: React, Node.js, Express.js, MongoDB, JWT, Multer, Git/GitHub"
      ],
      description: [
        {
           title: "Problem Overview",
           content: ["Independently developed complete ecommerce solution handling product catalog, user management, and order processing"]
        },
        {
           title: "Key Technical Implementations",
           content: ["Built secure authentication system using JWT with refresh token rotation and password hashing",
            "Developed an admin dashboard with real-time analytics and inventory management capabilities",
            "Created a responsive product catalog supporting advanced filtering, sorting, and search functionality",
            "Implemented a cart system with persistent storage using MongoDB and local storage synchronization",
            "Integrated multiple payment gateways with proper error handling and transaction verification",
           ]
        },
        {
           title: "Learning Outcomes",
           content: ["Gained practical experience in full-stack development workflow from concept to deployment",
            "Developed skills in state management, API security, and responsive design",
            "Learned payment processing integration and PCI compliance requirements"
           ]
        }
      ]
    }
  ];

  return (
    <div className="about-container">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-info">
            <h1 className="header-name">{personalInfo.name}</h1>
            <h2 className="header-title">{personalInfo.title}</h2>
            <div className="contact-links">
              <a href={`mailto:${personalInfo.contact.email}`} className="contact-link">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>{personalInfo.contact.email}</span>
              </a>
              <a href={`tel:${personalInfo.contact.phone}`} className="contact-link">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>{personalInfo.contact.phone}</span>
              </a>
            </div>
          </div>
          <div className="social-buttons">
            <a href={`https://${personalInfo.contact.github}`} target="_blank" rel="noopener noreferrer" className="social-button">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a href={`https://${personalInfo.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-button">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-tabs">
            <button 
              onClick={() => setActiveSection('about')}
              className={`nav-tab ${activeSection === 'about' ? 'active' : ''}`}
            >
              About Me
            </button>
            <button 
              onClick={() => setActiveSection('experience')}
              className={`nav-tab ${activeSection === 'experience' ? 'active' : ''}`}
            >
              Experience
            </button>
            <button 
              onClick={() => setActiveSection('skills')}
              className={`nav-tab ${activeSection === 'skills' ? 'active' : ''}`}
            >
              Skills
            </button>
            <button 
              onClick={() => setActiveSection('projects')}
              className={`nav-tab ${activeSection === 'projects' ? 'active' : ''}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveSection('education')}
              className={`nav-tab ${activeSection === 'education' ? 'active' : ''}`}
            >
              Education
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === 'about' && (
          <div className="section-container">
            <h2 className="section-title">About Me</h2>
            <div className="card">
              <p className="project-description" style={{fontSize: '1rem', marginBottom: '1rem'}}>
                I am a dedicated Software Developer with expertise in full-stack development, currently working at Collegedunia. 
                My experience spans across various technologies including PHP, Laravel, React, and cloud services.
              </p>
              <p className="project-description" style={{fontSize: '1rem', marginBottom: '1rem'}}>
                I specialize in building scalable web applications with a focus on performance optimization and user experience. 
                Throughout my career, I've worked on diverse projects ranging from CRM systems to education platforms and e-commerce solutions.
              </p>
              <p className="project-description" style={{fontSize: '1rem'}}>
                I'm passionate about creating efficient, maintainable code and continuously exploring new technologies to enhance my skill set. 
                Currently pursuing my Bachelor's degree in Computer Science, I balance academic knowledge with practical industry experience.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="section-container">
            <h2 className="section-title">Work Experience</h2>
            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{job.position}</h3>
                      <h4 className="card-subtitle">{job.company}</h4>
                      <p className="card-location">{job.location}</p>
                    </div>
                    <div>
                      <span className="badge">
                        {job.period}
                      </span>
                    </div>
                  </div>
                  <div style={{marginBottom: '1rem'}}>
                    <h5 className="section-subtitle">Key Achievements</h5>
                    <ul className="list">
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} className="list-item">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                  <h5 className="section-subtitle">Projects</h5>
                    <div className="space-y-3">
                        {job.projects.map((project, idx) => (
                        <div key={idx} className="project-card">
                            <h6 className="project-title">{project.name}</h6>
                            {project.description.map((desc, descIdx) => (
                            <div key={descIdx} className="project-description">
                                <h6 className="project-subtitle">{desc.title}</h6>
                                <ul>
                                {desc.content.map((content, contentIdx) => (
                                    <li key={contentIdx}>{content}</li>
                                ))}
                                </ul>
                            </div>
                            ))}
                        </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="section-container">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {skills.map((skillGroup, index) => (
                <div key={index} className="card">
                  <h3 className="card-title" style={{marginBottom: '1rem'}}>{skillGroup.category}</h3>
                  <div className="flex flex-wrap">
                    {skillGroup.items.map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="section-container">
            <h2 className="section-title">Projects</h2>
            <div className="space-y-8">
              {projects.map((project, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{project.name}</h3>
                    {project.status && (
                      <span className="badge" style={{backgroundColor: '#dcfce7', color: '#166534'}}>
                        {project.status}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="section-subtitle">Key Features</h4>
                    <div className="space-y-3">
                      {project.features.map((feature, idx) => (
                        <div key={idx} className="project-feature">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                    <h5 className="section-subtitle">Projects</h5>
                    <div className="space-y-3">
                        {project.map((project, idx) => (
                        <div key={idx} className="project-card">
                            <h6 className="project-title">{project.name}</h6>
                            {project.description.map((desc, descIdx) => (
                            <div key={descIdx} className="project-description">
                                <h6 className="project-subtitle">{desc.title}</h6>
                                <ul>
                                {desc.content.map((content, contentIdx) => (
                                    <li key={contentIdx}>{content}</li>
                                ))}
                                </ul>
                            </div>
                            ))}
                        </div>
                        ))}
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'education' && (
          <div className="section-container">
            <h2 className="section-title">Education</h2>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{edu.institution}</h3>
                      <p className="card-subtitle">{edu.degree}</p>
                    </div>
                    <div>
                      <span className="badge">
                        Graduation: {edu.graduation}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="section-subtitle">Relevant Coursework</h4>
                    <p className="project-description" style={{fontSize: '1rem'}}>{edu.coursework}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">© 2025 {personalInfo.name}. All rights reserved.</p>
          <div className="footer-social">
            <a href={`mailto:${personalInfo.contact.email}`} className="footer-icon">
              <svg className="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </a>
            <a href={`https://${personalInfo.contact.github}`} target="_blank" rel="noopener noreferrer" className="footer-icon">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href={`https://${personalInfo.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="footer-icon">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;