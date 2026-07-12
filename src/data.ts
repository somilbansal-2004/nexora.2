import { ServiceItem, PortfolioProject, TechnologyItem, ContactInfo } from './types';

export const servicesData: ServiceItem[] = [
  {
    id: 'mech-design',
    title: 'Mechanical Design',
    description: 'High-precision mechanical engineering, structural finite element analysis (FEA), static/dynamic load simulations, and thermal calculations for complex assemblies.',
    category: 'engineering',
    iconName: 'Cpu',
  },
  {
    id: 'cad-modeling',
    title: 'CAD Modeling',
    description: 'High-fidelity parametric solid and surface modeling, tolerance stack-up analysis, and standard-compliant assembly structures in SolidWorks, Fusion 360, & Inventor.',
    category: 'engineering',
    iconName: 'Layers',
  },
  {
    id: 'product-design',
    title: 'Product Design',
    description: 'End-to-end product prototyping, balancing functional mechanical integrity with premium modern user-facing aesthetics.',
    category: 'engineering',
    iconName: 'PenTool',
  },
  {
    id: '3d-rendering',
    title: '3D Modeling & Rendering',
    description: 'High-fidelity realistic materials mapping, professional studio lighting, and cinematic keyframe animations for high-end product showcasing.',
    category: 'engineering',
    iconName: 'Tv',
  },
  {
    id: 'tech-drawings',
    title: 'Technical Drawings',
    description: 'Manufacturing blueprint drafting with complete GD&T callouts, section views, bill of materials (BOM), and rigorous standard alignments.',
    category: 'engineering',
    iconName: 'FileText',
  },
  {
    id: 'elec-design',
    title: 'Electrical Design',
    description: 'Custom PCB routing, electrical cabinet architectures, power grid modeling, and system integrations for deep tech setups.',
    category: 'engineering',
    iconName: 'Zap',
  },
  {
    id: 'wiring-diagrams',
    title: 'Wiring Diagrams',
    description: 'Detailed high-fidelity circuit pathways, schematic layouts, sensor connectivity boards, and control wiring maps.',
    category: 'engineering',
    iconName: 'GitBranch',
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Premium custom digital graphics, layout designs, and high-impact visual resources optimized for engineering briefs and digital channels.',
    category: 'digital',
    iconName: 'Palette',
  },
  {
    id: 'logo-branding',
    title: 'Logo & Branding',
    description: 'Distinctive pixel-inspired and modern technical vector logos, custom corporate identity guides, and typography matching.',
    category: 'digital',
    iconName: 'Sparkles',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Modern, highly responsive light-themed dashboard layouts, mobile app interfaces, and fluid user journey maps.',
    category: 'digital',
    iconName: 'Laptop',
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Cinematic promotional cuts, technical showcase videos, custom transitions, motion tracking, and high-impact audio syncs.',
    category: 'digital',
    iconName: 'Video',
  },
  {
    id: 'photo-editing',
    title: 'Photo Editing',
    description: 'Studio-grade photo post-processing, advanced lighting manipulation, object isolation, and visual assets detailing.',
    category: 'digital',
    iconName: 'Image',
  },
  {
    id: 'resume-portfolio',
    title: 'Resume & Portfolio Design',
    description: 'Professional visual resumes and interactive portfolios tailored specifically for developers, freelancers, and engineering consultants.',
    category: 'digital',
    iconName: 'BookOpen',
  },
];

export const portfolioData: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Aerospace Propulsion Core',
    subtitle: 'Mechanical Design & CAD Modeling',
    description: 'High-precision parametric solid assembly of a next-generation turbine engine. Features custom optimized blades, CFD thermal routing, and detailed structural tolerances.',
    category: 'mechanical',
    imageUrl: '/src/assets/images/mechanical_cad_1783798067954.jpg',
    specifications: ['Solid Assembly (320+ parts)', 'CFD Thermal Mesh', '8K Blueprint Blueprinting', 'FEA Structural Safety: 2.4x'],
  },
  {
    id: 'proj-2',
    title: 'Cybernetic Assembly System',
    subtitle: 'Robotics & Industrial Automation',
    description: '6-axis articulating robotic workstation. Programmed for high-speed microscopic PCB micro-soldering, including dynamic laser guidance and integrated sensor feedback loops.',
    category: 'automation',
    imageUrl: '/src/assets/images/robotic_arm_1783798080349.jpg',
    specifications: ['6-Axis Trajectory Sync', 'Laser Guide Precision (±0.02mm)', 'Real-time PLC Integration', 'Cycle Time reduction: 34%'],
  },
  {
    id: 'proj-3',
    title: 'Smart PLC Control Matrix',
    subtitle: 'Electrical Design & PLC Systems',
    description: 'High-density industrial control panel integrated with advanced PLC controllers, surge protections, modular terminal relays, and custom thermal ventilation grids.',
    category: 'electrical',
    imageUrl: '/src/assets/images/control_panel_1783798095652.jpg',
    specifications: ['IEC-61439 Compliance', 'EtherNet/IP & Modbus RTU', '120-Point IO Mapping', 'Advanced PLC Safety Rings'],
  },
  {
    id: 'proj-4',
    title: 'Bio-Telematic Interface Device',
    subtitle: 'Product Design & IoT Solutions',
    description: 'Premium wearable medical diagnostics console featuring metallic gold contacts, curved glassmorphism casing, and low-latency Bluetooth Telemetry.',
    category: 'mechanical',
    imageUrl: '/src/assets/images/product_render_1783798107967.jpg',
    specifications: ['Ergonomic Enclosure Design', 'FDM/SLA Prototyping Ready', 'IP67 Ingress Rated', 'Low-power ESP32 Core'],
  },
  {
    id: 'proj-5',
    title: 'Design Dynamo Production Rig',
    subtitle: 'Graphic Design & Video Editing',
    description: 'High-fidelity cinematic workstation interface designed for advanced rendering, showing futuristic video rendering timelines, spatial branding, and LUT color matrices.',
    category: 'creative',
    imageUrl: '/src/assets/images/creative_studio_1783798122776.jpg',
    specifications: ['4K Cinematic Color Deck', '3D Motion Templates', 'Vector Branding Guides', 'Dolby Atmos Spatial Mix'],
  },
];

export const technologiesData: TechnologyItem[] = [
  // Hardware / CAD
  { name: 'SolidWorks', category: 'hardware', logoText: 'SW', rating: 95 },
  { name: 'Autodesk Fusion 360', category: 'hardware', logoText: 'F360', rating: 90 },
  { name: 'AutoCAD & Inventor', category: 'hardware', logoText: 'ACAD', rating: 85 },
  { name: 'Altium Designer', category: 'hardware', logoText: 'AD', rating: 80 },

  // Automation / IoT
  { name: 'Siemens TIA Portal', category: 'automation', logoText: 'PLC', rating: 88 },
  { name: 'Arduino & ESP32 SDK', category: 'automation', logoText: 'MCU', rating: 92 },
  { name: 'ROS (Robot Operating System)', category: 'automation', logoText: 'ROS', rating: 78 },
  { name: 'Modbus & EtherNet/IP', category: 'automation', logoText: 'NET', rating: 85 },

  // Software / AI
  { name: 'Python & TensorFlow', category: 'software', logoText: 'AI', rating: 86 },
  { name: 'TypeScript & React', category: 'software', logoText: 'WEB', rating: 94 },
  { name: 'Three.js & WebGL', category: 'software', logoText: '3D', rating: 90 },
  { name: 'C++ Embedded Development', category: 'software', logoText: 'C++', rating: 82 },

  // Creative
  { name: 'Premiere Pro & After Effects', category: 'creative', logoText: 'PR/AE', rating: 95 },
  { name: 'Photoshop & Illustrator', category: 'creative', logoText: 'PS/AI', rating: 90 },
  { name: 'Blender 3D Modeling', category: 'creative', logoText: 'BL', rating: 88 },
  { name: 'Unity 3D / VR', category: 'creative', logoText: 'VR', rating: 80 },
];

export const contactData: ContactInfo = {
  name: 'Somil Bansal',
  brand: 'NEXORA',
  phone: '+91 89395 90511',
  email: '1asomillbansal@gmail.com',
  whatsapp: '+91 89395 90511',
  linkedin: 'https://linkedin.com/in/somil-bansal-044a67382',
  grabcad: 'https://grabcad.com/somil.bansal-1',
  youtube: 'https://www.youtube.com/@Nexora-k9x',
  instagram: 'https://www.instagram.com/nexora.official20/',
};
