import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLogOut,
  FiPieChart,
  FiBox,
  FiLayers,
  FiMessageSquare,
  FiUsers,
  FiSettings,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiFolder,
  FiSearch,
  FiArrowRight,
  FiBriefcase,
  FiUploadCloud,
  FiUserCheck
} from 'react-icons/fi';
import { getApiUrl, getYouTubeId } from '../utils/api';

import pexels1 from '../assets/projects/pexels-1.webp';
import pexels2 from '../assets/projects/pexels-2.webp';
import pexels3 from '../assets/projects/pexels-3.webp';
import pexels4 from '../assets/projects/pexels-4.webp';
import pexels5 from '../assets/projects/pexels-5.webp';

import arrowsImg from '../assets/projects/arrows.webp';
import chantalleImg from '../assets/projects/chantalle.webp';
import papyrusImg from '../assets/projects/papyrus.webp';
import londonMuseumImg from '../assets/projects/london-museum.webp';
import bullseyeImg from '../assets/projects/bullseye.webp';
import interferenceImg from '../assets/projects/interference.webp';
import servicesHeroRender from '../assets/services-hero-render.webp';
import { resolveServiceDetail } from '../data/services';

import bgCanvasStudio from '../assets/pexels-canvastudio-3153198.webp';
import bgMikhailNilov from '../assets/pexels-mikhail-nilov-6930549.webp';
import heroImage from '../assets/hero-image.webp';

const testimonialImageMap: Record<string, string> = {
  "hero-image.webp": heroImage,
  "pexels-mikhail-nilov-6930549.webp": bgMikhailNilov,
  "pexels-canvastudio-3153198.webp": bgCanvasStudio,
};


const customImageMap: Record<string, string> = {
  "arrows": arrowsImg,
  "chantalle": chantalleImg,
  "papyrus": papyrusImg,
  "london-museum": londonMuseumImg,
  "bullseye": bullseyeImg,
  "interference": interferenceImg,
};

const imageMap: Record<string, string> = {
  "pexels-1.webp": pexels1,
  "pexels-2.webp": pexels2,
  "pexels-3.webp": pexels3,
  "pexels-4.webp": pexels4,
  "pexels-5.webp": pexels5,
};

const getProjectImage = (imageName: string) => {
  if (!imageName) return pexels1;
  if (imageName.startsWith('data:image/') || imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  return imageMap[imageName] || pexels1;
};

const imageOptions = [
  { value: 'pexels-1.webp', label: 'Dark Tech Sphere (Pexels 1)' },
  { value: 'pexels-2.webp', label: 'Minimalist Workspace (Pexels 2)' },
  { value: 'pexels-3.webp', label: 'Creative Layout (Pexels 3)' },
  { value: 'pexels-4.webp', label: 'Modern Architectural Detail (Pexels 4)' },
  { value: 'pexels-5.webp', label: 'Premium Branding Texture (Pexels 5)' }
];

export function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'services' | 'testimonials' | 'team' | 'settings' | 'requests' | 'blogs' | 'careers' | 'applications'>('overview');

  // Data lists
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);

  // Dashboard stats
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    testimonials: 0,
    blogs: 0,
    careers: 0,
    applications: 0
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Career Form States
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [isCareerFormOpen, setIsCareerFormOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<any | null>(null);
  const [careerSubmitting, setCareerSubmitting] = useState(false);
  const [careerForm, setCareerForm] = useState({
    title: '',
    department: 'Design',
    employmentType: 'Full-time',
    location: 'Anywhere',
    experience: '3+ Years',
    isNew: false,
    icon: 'ui',
    description: '',
    aboutRole: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',
    image: '',
    benefits: [] as { title: string; description: string; icon: string }[]
  });

  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitDesc, setBenefitDesc] = useState('');
  const [benefitIcon, setBenefitIcon] = useState('globe');


  // Profile Modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Project Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Notification states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    client: '',
    year: new Date().getFullYear().toString(),
    tags: '',
    description: '',
    image: 'pexels-1.webp',
    gallery: [] as string[],
    videos: [] as string[]
  });

  const [imageSource, setImageSource] = useState<'template' | 'upload' | 'url'>('template');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [blogImageSource, setBlogImageSource] = useState<'upload' | 'url'>('url');
  const [serviceHeroImageSource, setServiceHeroImageSource] = useState<'upload' | 'url'>('url');

  const [serviceOverviewGalleryUrlInput, setServiceOverviewGalleryUrlInput] = useState('');
  const [serviceOverviewYoutubeUrlInput, setServiceOverviewYoutubeUrlInput] = useState('');
  const [serviceOverviewVideoSource, setServiceOverviewVideoSource] = useState<'youtube' | 'upload'>('youtube');

  const [serviceRelatedWorkGalleryUrlInput, setServiceRelatedWorkGalleryUrlInput] = useState('');
  const [serviceRelatedWorkYoutubeUrlInput, setServiceRelatedWorkYoutubeUrlInput] = useState('');
  const [serviceRelatedWorkVideoSource, setServiceRelatedWorkVideoSource] = useState<'youtube' | 'upload'>('youtube');

  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: 'web',
    overviewHeading: '',
    overviewBody: '',
    overviewImage: '',
    overviewGallery: [] as string[],
    overviewVideos: [] as { type: 'youtube' | 'upload'; url: string }[],
    relatedWorkTitle: '',
    relatedWorkDescription: '',
    relatedWorkSlug: '',
    relatedWorkImage: '',
    relatedWorkGallery: [] as string[],
    relatedWorkVideos: [] as { type: 'youtube' | 'upload'; url: string }[],
    heroImage: '',
  });

  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Design',
    author: '',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    gallery: [] as string[],
    videos: [] as { type: 'youtube' | 'upload'; url: string }[]
  });

  const [blogGalleryUrlInput, setBlogGalleryUrlInput] = useState('');
  const [blogYoutubeUrlInput, setBlogYoutubeUrlInput] = useState('');
  const [blogVideoSource, setBlogVideoSource] = useState<'youtube' | 'upload'>('youtube');
  const [careerImageSource, setCareerImageSource] = useState<'upload' | 'url'>('url');


  // Testimonials Form State
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    company: '',
    role: '',
    text: '',
    rating: 5,
    avatar: 'hero-image.webp',
    bgImage: 'hero-image.webp'
  });
  const [avatarSource, setAvatarSource] = useState<'template' | 'upload' | 'url'>('template');
  const [bgImageSource, setBgImageSource] = useState<'template' | 'upload' | 'url'>('template');

  const serviceIconOptions = [
    { value: 'brand', label: 'Brand Identity' },
    { value: 'web', label: 'Web Design' },
    { value: 'ui', label: 'UI/UX Design' },
    { value: 'code', label: 'Development' },
    { value: 'motion', label: 'Motion Design' },
    { value: 'strategy', label: 'Digital Strategy' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is a bit large! Please try to upload an image under 2MB for faster loading.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setProjectForm(prev => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`Image "${file.name}" is too large! Please upload images under 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setProjectForm(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), result]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setProjectForm(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), galleryUrlInput.trim()]
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setProjectForm(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleServiceOverviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please try to upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const result = reader.result;
        setServiceForm(prev => ({ ...prev, overviewImage: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleServiceRelatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please try to upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const result = reader.result;
        setServiceForm(prev => ({ ...prev, relatedWorkImage: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Overview Gallery ──────────────────────────────────────────────
  const handleServiceOverviewGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) { alert(`"${file.name}" is too large! Max 2MB.`); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string')
          setServiceForm(prev => ({ ...prev, overviewGallery: [...(prev.overviewGallery || []), reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleServiceOverviewAddGalleryUrl = () => {
    if (!serviceOverviewGalleryUrlInput.trim()) return;
    setServiceForm(prev => ({ ...prev, overviewGallery: [...(prev.overviewGallery || []), serviceOverviewGalleryUrlInput.trim()] }));
    setServiceOverviewGalleryUrlInput('');
  };

  const handleServiceOverviewRemoveGalleryImage = (i: number) => {
    setServiceForm(prev => ({ ...prev, overviewGallery: (prev.overviewGallery || []).filter((_, idx) => idx !== i) }));
  };

  // ── Overview Videos ───────────────────────────────────────────────
  const handleServiceOverviewVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 15 * 1024 * 1024) { alert("Video too large! Max 15MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string')
        setServiceForm(prev => ({ ...prev, overviewVideos: [...(prev.overviewVideos || []), { type: 'upload', url: reader.result as string }] }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleServiceOverviewAddYoutubeUrl = () => {
    if (!serviceOverviewYoutubeUrlInput.trim()) return;
    setServiceForm(prev => ({ ...prev, overviewVideos: [...(prev.overviewVideos || []), { type: 'youtube', url: serviceOverviewYoutubeUrlInput.trim() }] }));
    setServiceOverviewYoutubeUrlInput('');
  };

  const handleServiceOverviewRemoveVideo = (i: number) => {
    setServiceForm(prev => ({ ...prev, overviewVideos: (prev.overviewVideos || []).filter((_, idx) => idx !== i) }));
  };

  // ── Related Work Gallery ──────────────────────────────────────────
  const handleServiceRelatedWorkGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) { alert(`"${file.name}" is too large! Max 2MB.`); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string')
          setServiceForm(prev => ({ ...prev, relatedWorkGallery: [...(prev.relatedWorkGallery || []), reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleServiceRelatedWorkAddGalleryUrl = () => {
    if (!serviceRelatedWorkGalleryUrlInput.trim()) return;
    setServiceForm(prev => ({ ...prev, relatedWorkGallery: [...(prev.relatedWorkGallery || []), serviceRelatedWorkGalleryUrlInput.trim()] }));
    setServiceRelatedWorkGalleryUrlInput('');
  };

  const handleServiceRelatedWorkRemoveGalleryImage = (i: number) => {
    setServiceForm(prev => ({ ...prev, relatedWorkGallery: (prev.relatedWorkGallery || []).filter((_, idx) => idx !== i) }));
  };

  // ── Related Work Videos ───────────────────────────────────────────
  const handleServiceRelatedWorkVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 15 * 1024 * 1024) { alert("Video too large! Max 15MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string')
        setServiceForm(prev => ({ ...prev, relatedWorkVideos: [...(prev.relatedWorkVideos || []), { type: 'upload', url: reader.result as string }] }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleServiceRelatedWorkAddYoutubeUrl = () => {
    if (!serviceRelatedWorkYoutubeUrlInput.trim()) return;
    setServiceForm(prev => ({ ...prev, relatedWorkVideos: [...(prev.relatedWorkVideos || []), { type: 'youtube', url: serviceRelatedWorkYoutubeUrlInput.trim() }] }));
    setServiceRelatedWorkYoutubeUrlInput('');
  };

  const handleServiceRelatedWorkRemoveVideo = (i: number) => {
    setServiceForm(prev => ({ ...prev, relatedWorkVideos: (prev.relatedWorkVideos || []).filter((_, idx) => idx !== i) }));
  };

  const handleServiceHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please try to upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const result = reader.result;
        setServiceForm(prev => ({ ...prev, heroImage: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBlogCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please try to upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setBlogForm(prev => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCareerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCareerForm(prev => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };


  const handleTestimonialAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please upload a file under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setTestimonialForm(prev => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTestimonialBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please upload a file under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setTestimonialForm(prev => ({ ...prev, bgImage: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBlogGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`Image "${file.name}" is too large! Please upload images under 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setBlogForm(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), result]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleBlogAddGalleryUrl = () => {
    if (!blogGalleryUrlInput.trim()) return;
    setBlogForm(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), blogGalleryUrlInput.trim()]
    }));
    setBlogGalleryUrlInput('');
  };

  const handleBlogRemoveGalleryImage = (indexToRemove: number) => {
    setBlogForm(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleBlogVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Video file is too large! Please try to upload a video file under 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setBlogForm(prev => ({
          ...prev,
          videos: [...(prev.videos || []), { type: 'upload', url: reader.result as string }]
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBlogAddYoutubeUrl = () => {
    if (!blogYoutubeUrlInput.trim()) return;
    setBlogForm(prev => ({
      ...prev,
      videos: [...(prev.videos || []), { type: 'youtube', url: blogYoutubeUrlInput.trim() }]
    }));
    setBlogYoutubeUrlInput('');
  };

  const handleBlogRemoveVideo = (indexToRemove: number) => {
    setBlogForm(prev => ({
      ...prev,
      videos: (prev.videos || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };



  const navigate = useNavigate();
  const apiUrl = getApiUrl();

  const fetchAccessRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiUrl}/auth/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAccessRequests(data);
      }
    } catch (err) {
      console.error('Error fetching access requests:', err);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiUrl}/auth/requests/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMsg('Access request approved successfully!');
        fetchAccessRequests();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Failed to approve request.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiUrl}/auth/requests/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMsg('Access request rejected successfully.');
        fetchAccessRequests();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Failed to reject request.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this access request and revoke their admin access?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiUrl}/auth/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMsg('Access request and admin account deleted successfully.');
        fetchAccessRequests();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message || 'Failed to delete request.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error deleting request:', err);
      setErrorMsg('Failed to connect to server.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileName,
          profilePic: profilePic,
          password: profilePassword || undefined
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Profile updated successfully!');
        setAdmin(data.user);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setIsProfileOpen(false);
        setProfilePassword('');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Failed to update profile.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg('Failed to connect to server.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert("Image is too large! Please upload a profile picture under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setProfilePic(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [projectsRes, servicesRes, testimonialsRes, blogsRes, careersRes, applicationsRes] = await Promise.all([
        fetch(`${apiUrl}/projects`),
        fetch(`${apiUrl}/services`),
        fetch(`${apiUrl}/testimonials`),
        fetch(`${apiUrl}/blogs`),
        fetch(`${apiUrl}/careers`),
        fetch(`${apiUrl}/careers/applications`)
      ]);

      const projectsData = await projectsRes.json();
      const servicesData = await servicesRes.json();
      const testimonialsData = await testimonialsRes.json();
      const blogsData = await blogsRes.json();
      const careersData = await careersRes.json();
      const applicationsData = await applicationsRes.json();

      setProjects(projectsData);
      setServices(servicesData);
      setTestimonials(testimonialsData);
      setBlogs(blogsData);
      setCareers(careersData);
      setApplications(applicationsData);

      setStats({
        projects: projectsData.length,
        services: servicesData.length,
        testimonials: testimonialsData.length,
        blogs: blogsData.length,
        careers: careersData.length,
        applications: applicationsData.length
      });

      fetchAccessRequests();
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setErrorMsg('Failed to sync dashboard data with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      navigate('/admin-login');
      return;
    }

    const adminObj = JSON.parse(user);
    setAdmin(adminObj);
    setProfileName(adminObj.name || '');
    setProfilePic(adminObj.profilePic || '');
    fetchAllData();
  }, [navigate]);

  useEffect(() => {
    if (activeSection === 'requests') {
      fetchAccessRequests();
    }
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  // CRUD Actions
  const handleAddNewClick = () => {
    setProjectForm({
      title: '',
      category: '',
      client: '',
      year: new Date().getFullYear().toString(),
      tags: '',
      description: '',
      image: 'pexels-1.webp',
      gallery: [],
      videos: []
    });
    setEditingProject(null);
    setImageSource('template');
    setVideoUrlInput('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleEditClick = (project: any) => {
    setProjectForm({
      title: project.title,
      category: project.category,
      client: project.client,
      year: project.year,
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      description: project.description,
      image: project.image || 'pexels-1.webp',
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      videos: Array.isArray(project.videos) ? project.videos : []
    });

    // Determine image mode dynamically
    const img = project.image || '';
    if (img.startsWith('data:image/')) {
      setImageSource('upload');
    } else if (img.startsWith('http://') || img.startsWith('https://')) {
      setImageSource('url');
    } else {
      setImageSource('template');
    }

    setVideoUrlInput('');
    setEditingProject(project);
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (slug: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;

    try {
      const res = await fetch(`${apiUrl}/projects/${slug}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete project.');
      }

      showNotification('success', 'Project successfully deleted!');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error occurred during deletion.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Secondary frontend validation safeguard
    if (
      !projectForm.title.trim() ||
      !projectForm.category.trim() ||
      !projectForm.client.trim() ||
      !projectForm.year.trim() ||
      !projectForm.description.trim()
    ) {
      showNotification('error', 'Please fill out all required fields first (Title, Category, Client, Year, Description).');
      return;
    }

    setSubmitting(true);

    try {
      const isEditing = !!editingProject;
      const url = isEditing
        ? `${apiUrl}/projects/${editingProject.slug}`
        : `${apiUrl}/projects`;

      const method = isEditing ? 'PUT' : 'POST';

      const tagsArray = projectForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        ...projectForm,
        tags: tagsArray
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save project metadata.');
      }

      showNotification('success', isEditing ? 'Project details updated successfully!' : 'New project published successfully!');
      setIsFormOpen(false);
      fetchAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while publishing.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddServiceClick = () => {
    setServiceForm({
      title: '',
      description: '',
      icon: 'web',
      overviewHeading: '',
      overviewBody: '',
      overviewImage: '',
      overviewGallery: [],
      overviewVideos: [],
      relatedWorkTitle: '',
      relatedWorkDescription: '',
      relatedWorkSlug: '',
      relatedWorkImage: '',
      relatedWorkGallery: [],
      relatedWorkVideos: [],
      heroImage: '',
    });
    setServiceHeroImageSource('url');
    setServiceOverviewGalleryUrlInput('');
    setServiceOverviewYoutubeUrlInput('');
    setServiceOverviewVideoSource('youtube');
    setServiceRelatedWorkGalleryUrlInput('');
    setServiceRelatedWorkYoutubeUrlInput('');
    setServiceRelatedWorkVideoSource('youtube');
    setEditingService(null);
    setErrorMsg('');
    setIsServiceFormOpen(true);
  };

  const handleEditServiceClick = (srv: any) => {
    const fallback = resolveServiceDetail(undefined, srv.slug);
    setServiceForm({
      title: srv.title || (fallback ? fallback.title : ''),
      description: srv.description || (fallback ? fallback.heroDescription : ''),
      icon: srv.icon || (fallback ? fallback.icon : 'web'),
      overviewHeading: srv.overviewHeading || (fallback ? fallback.overviewHeading : ''),
      overviewBody: srv.overviewBody || (fallback ? fallback.overviewBody : ''),
      overviewImage: srv.overviewImage || (fallback ? fallback.overviewImage : ''),
      overviewGallery: Array.isArray(srv.overviewGallery) ? srv.overviewGallery : [],
      overviewVideos: Array.isArray(srv.overviewVideos) ? srv.overviewVideos : [],
      relatedWorkTitle: srv.relatedWorkTitle || (fallback ? fallback.relatedWork.title : ''),
      relatedWorkDescription: srv.relatedWorkDescription || (fallback ? fallback.relatedWork.description : ''),
      relatedWorkSlug: srv.relatedWorkSlug || (fallback ? fallback.relatedWork.slug : ''),
      relatedWorkImage: srv.relatedWorkImage || (fallback ? fallback.relatedWork.image : ''),
      relatedWorkGallery: Array.isArray(srv.relatedWorkGallery) ? srv.relatedWorkGallery : [],
      relatedWorkVideos: Array.isArray(srv.relatedWorkVideos) ? srv.relatedWorkVideos : [],
      heroImage: srv.heroImage || '',
    });

    const img = srv.heroImage || '';
    if (img.startsWith('data:image/')) {
      setServiceHeroImageSource('upload');
    } else {
      setServiceHeroImageSource('url');
    }

    setServiceOverviewGalleryUrlInput('');
    setServiceOverviewYoutubeUrlInput('');
    setServiceOverviewVideoSource('youtube');
    setServiceRelatedWorkGalleryUrlInput('');
    setServiceRelatedWorkYoutubeUrlInput('');
    setServiceRelatedWorkVideoSource('youtube');

    setEditingService(srv);
    setErrorMsg('');
    setIsServiceFormOpen(true);
  };

  const handleDeleteServiceClick = async (slug: string) => {
    if (!window.confirm('Delete this service card? It will be removed from the public services page.')) return;

    try {
      const res = await fetch(`${apiUrl}/services/${slug}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete service.');
      }
      showNotification('success', 'Service deleted successfully!');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error deleting service.');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      showNotification('error', 'Please enter a title and description.');
      return;
    }

    setServiceSubmitting(true);
    try {
      const isEditing = !!editingService;
      const url = isEditing
        ? `${apiUrl}/services/${editingService.slug}`
        : `${apiUrl}/services`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save service.');
      }

      showNotification('success', isEditing ? 'Service updated!' : 'New service added!');
      setIsServiceFormOpen(false);
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving service.');
    } finally {
      setServiceSubmitting(false);
    }
  };

  const handleAddBlogClick = () => {
    setBlogForm({
      title: '',
      category: 'Design',
      author: admin?.name || 'Lokesh Kumawat',
      readTime: '5 min read',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
      gallery: [],
      videos: []
    });
    setBlogImageSource('url');
    setBlogGalleryUrlInput('');
    setBlogYoutubeUrlInput('');
    setBlogVideoSource('youtube');
    setEditingBlog(null);
    setErrorMsg('');
    setIsBlogFormOpen(true);
  };

  const handleEditBlogClick = (b: any) => {
    setBlogForm({
      title: b.title || '',
      category: b.category || 'Design',
      author: b.author || admin?.name || 'Lokesh Kumawat',
      readTime: b.readTime || '5 min read',
      excerpt: b.excerpt || '',
      content: b.content || '',
      image: b.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
      gallery: Array.isArray(b.gallery) ? b.gallery : [],
      videos: Array.isArray(b.videos) ? b.videos : []
    });
    const img = b.image || '';
    if (img.startsWith('data:image/')) {
      setBlogImageSource('upload');
    } else {
      setBlogImageSource('url');
    }
    setBlogGalleryUrlInput('');
    setBlogYoutubeUrlInput('');
    setBlogVideoSource('youtube');
    setEditingBlog(b);
    setErrorMsg('');
    setIsBlogFormOpen(true);
  };

  const handleDeleteBlogClick = async (slug: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;

    try {
      const res = await fetch(`${apiUrl}/blogs/${slug}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete blog.');
      }

      showNotification('success', 'Blog post successfully deleted!');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error occurred during deletion.');
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !blogForm.title.trim() ||
      !blogForm.category.trim() ||
      !blogForm.author.trim() ||
      !blogForm.excerpt.trim() ||
      !blogForm.content.trim()
    ) {
      showNotification('error', 'Please fill out all required fields.');
      return;
    }

    setBlogSubmitting(true);

    try {
      const isEditing = !!editingBlog;
      const url = isEditing
        ? `${apiUrl}/blogs/${editingBlog.slug}`
        : `${apiUrl}/blogs`;

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogForm)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save blog post.');
      }

      showNotification('success', isEditing ? 'Blog post updated successfully!' : 'New blog post published successfully!');
      setIsBlogFormOpen(false);
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Something went wrong while publishing.');
    } finally {
      setBlogSubmitting(false);
    }
  };

  // Testimonials Handlers
  const handleAddNewTestimonialClick = () => {
    setTestimonialForm({
      name: '',
      company: '',
      role: '',
      text: '',
      rating: 5,
      avatar: 'hero-image.webp',
      bgImage: 'hero-image.webp'
    });
    setAvatarSource('template');
    setBgImageSource('template');
    setEditingTestimonial(null);
    setIsTestimonialFormOpen(true);
  };

  const handleEditTestimonialClick = (t: any) => {
    setTestimonialForm({
      name: t.name || t.author || '',
      company: t.company || '',
      role: t.role || '',
      text: t.text || t.quote || t.content || '',
      rating: t.rating || 5,
      avatar: t.avatar || 'hero-image.webp',
      bgImage: t.bgImage || 'hero-image.webp'
    });

    const av = t.avatar || '';
    if (av.startsWith('data:image/')) {
      setAvatarSource('upload');
    } else if (av.startsWith('http://') || av.startsWith('https://')) {
      setAvatarSource('url');
    } else {
      setAvatarSource('template');
    }

    const bg = t.bgImage || '';
    if (bg.startsWith('data:image/')) {
      setBgImageSource('upload');
    } else if (bg.startsWith('http://') || bg.startsWith('https://')) {
      setBgImageSource('url');
    } else {
      setBgImageSource('template');
    }

    setEditingTestimonial(t);
    setIsTestimonialFormOpen(true);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.text.trim()) {
      showNotification('error', 'Please fill in Name and Testimonial Text.');
      return;
    }

    try {
      const isEditing = !!editingTestimonial;
      const url = isEditing
        ? `${apiUrl}/testimonials/${editingTestimonial.id}`
        : `${apiUrl}/testimonials`;
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        name: testimonialForm.name,
        company: testimonialForm.company,
        role: testimonialForm.role || 'Client',
        text: testimonialForm.text,
        quote: testimonialForm.text,
        rating: testimonialForm.rating,
        avatar: testimonialForm.avatar,
        bgImage: testimonialForm.bgImage
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to ${isEditing ? 'update' : 'add'} testimonial`);
      }

      showNotification('success', `Testimonial ${isEditing ? 'updated' : 'added'} successfully!`);
      setIsTestimonialFormOpen(false);
      setTestimonialForm({ name: '', company: '', role: '', text: '', rating: 5, avatar: 'hero-image.webp', bgImage: 'hero-image.webp' });
      setEditingTestimonial(null);
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`${apiUrl}/testimonials/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete testimonial');
      }

      showNotification('success', 'Testimonial deleted successfully!');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error deleting testimonial');
    }
  };
 
  const handleAddNewCareerClick = () => {
    setCareerForm({
      title: '',
      department: 'Design',
      employmentType: 'Full-time',
      location: 'Anywhere',
      experience: '3+ Years',
      isNew: false,
      icon: 'ui',
      description: '',
      aboutRole: '',
      responsibilities: '',
      requirements: '',
      niceToHave: '',
      image: '',
      benefits: []
    });
    setBenefitTitle('');
    setBenefitDesc('');
    setBenefitIcon('globe');
    setCareerImageSource('url');
    setEditingCareer(null);
    setIsCareerFormOpen(true);
  };

  const handleEditCareerClick = (c: any) => {
    setCareerForm({
      title: c.title || '',
      department: c.department || 'Design',
      employmentType: c.employmentType || 'Full-time',
      location: c.location || 'Anywhere',
      experience: c.experience || '3+ Years',
      isNew: !!c.isNew,
      icon: c.icon || 'ui',
      description: c.description || '',
      aboutRole: c.aboutRole || '',
      responsibilities: Array.isArray(c.responsibilities) ? c.responsibilities.join('\n') : '',
      requirements: Array.isArray(c.requirements) ? c.requirements.join('\n') : '',
      niceToHave: Array.isArray(c.niceToHave) ? c.niceToHave.join('\n') : '',
      image: c.image || '',
      benefits: Array.isArray(c.benefits) ? c.benefits : []
    });
    setBenefitTitle('');
    setBenefitDesc('');
    setBenefitIcon('globe');

    const img = c.image || '';
    if (img.startsWith('data:image/')) {
      setCareerImageSource('upload');
    } else {
      setCareerImageSource('url');
    }

    setEditingCareer(c);
    setIsCareerFormOpen(true);
  };


  const handleDeleteCareerClick = async (slug: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this career listing?')) return;
    try {
      const res = await fetch(`${apiUrl}/careers/${slug}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete position.');
      }
      showNotification('success', 'Career listing deleted successfully!');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error occurred during deletion.');
    }
  };

  const handleDeleteApplicationClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this job application?')) return;
    try {
      const res = await fetch(`${apiUrl}/careers/applications/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete application.');
      }
      showNotification('success', 'Application deleted successfully!');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error occurred during deletion.');
    }
  };

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!careerForm.title.trim() || !careerForm.description.trim() || !careerForm.aboutRole.trim()) {
      showNotification('error', 'Please fill in Title, Description, and About Role.');
      return;
    }

    setCareerSubmitting(true);
    try {
      const isEditing = !!editingCareer;
      const url = isEditing ? `${apiUrl}/careers/${editingCareer.slug}` : `${apiUrl}/careers`;
      const method = isEditing ? 'PUT' : 'POST';

      const parseLines = (text: string) => text.split('\n').map(l => l.trim()).filter(Boolean);

      const payload = {
        ...careerForm,
        responsibilities: parseLines(careerForm.responsibilities),
        requirements: parseLines(careerForm.requirements),
        niceToHave: parseLines(careerForm.niceToHave)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save career listing.');
      }

      showNotification('success', isEditing ? 'Career listing updated successfully!' : 'New career position published!');
      setIsCareerFormOpen(false);
      fetchAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving career listing.');
    } finally {
      setCareerSubmitting(false);
    }
  };

  const filteredCareers = careers.filter(c =>
    c.title.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
    c.experience.toLowerCase().includes(careerSearchQuery.toLowerCase())
  );

  const showNotification = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!admin) return null;

  return (
    <div className="w-full h-screen overflow-hidden bg-[#F8FAFC] flex font-sans selection:bg-blue-600/10 selection:text-blue-600">

      {/* Notifications Popups */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto"
            >
              <div className="p-1.5 bg-emerald-500 rounded-full text-white">
                <FiCheck className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold flex-1">{successMsg}</p>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto"
            >
              <div className="p-1.5 bg-rose-500 rounded-full text-white">
                <FiAlertCircle className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold flex-1">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar navigation */}
      <aside className="w-64 bg-[#0F172A] text-white hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800/80">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            EDI<span className="text-blue-500">HUB</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-normal">v1.1</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4 overflow-y-auto">
          <div
            onClick={() => setActiveSection('overview')}
            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${activeSection === 'overview'
              ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
          >
            <FiPieChart className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard Overview</span>
          </div>

          {[
            { id: 'projects', name: 'Projects', icon: <FiBox /> },
            { id: 'services', name: 'Services', icon: <FiLayers /> },
            { id: 'testimonials', name: 'Testimonials', icon: <FiMessageSquare /> },
            { id: 'blogs', name: 'Blogs', icon: <FiFolder /> },
            { id: 'careers', name: 'Careers', icon: <FiBriefcase /> },
            { id: 'applications', name: 'Applications', icon: <FiUsers />, badge: stats.applications },
            { id: 'team', name: 'Team', icon: <FiUsers /> },
            { id: 'requests', name: 'Access Requests', icon: <FiUserCheck />, badge: accessRequests.filter(r => r.status === 'pending').length },
            { id: 'settings', name: 'Settings', icon: <FiSettings /> },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${activeSection === item.id
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg opacity-85">{item.icon}</div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-amber-500 text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full p-3 flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group font-medium"
          >
            <FiLogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Welcome back,{' '}
              <span
                onClick={() => setIsProfileOpen(true)}
                className="text-blue-600 hover:text-blue-700 cursor-pointer underline decoration-dotted transition-all"
              >
                {admin?.name}
              </span>
            </h1>
            <p className="text-xs text-slate-500">System status: <span className="text-emerald-500 font-semibold flex items-center gap-1 inline-flex"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online</span></p>
          </div>

          <div className="flex items-center gap-6">
            <div
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 border-r border-slate-200 pr-6 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{admin?.email}</div>
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{admin?.role}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10 overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all">
                {admin?.profilePic ? (
                  <img src={admin.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  admin?.name?.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 group font-semibold"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider hidden xl:block">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-8 max-w-7xl mx-auto w-full flex-1">

          {/* 1. OVERVIEW VIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Total Portfolio Projects', value: stats.projects, trend: 'Dynamic cloud storage', color: 'from-blue-600 to-blue-400' },
                  { label: 'Offered Services', value: stats.services, trend: 'Managed frontend items', color: 'from-indigo-600 to-indigo-400' },
                  { label: 'Testimonials / Feedback', value: stats.testimonials, trend: 'Verified customer reviews', color: 'from-violet-600 to-violet-400' },
                  { label: 'Open Positions', value: stats.careers, trend: 'Active job openings', color: 'from-emerald-600 to-emerald-400' },
                  { label: 'Job Applications', value: stats.applications, trend: 'Resumes received', color: 'from-rose-600 to-rose-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-xs text-blue-600 font-semibold">{stat.trend}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Navigation Cards */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Manage Sections</h2>
                  <span className="text-xs text-slate-400 font-medium">Quick routing links</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 p-6 gap-4">
                  {[
                    { title: 'Project Portfolio', desc: 'Create, update, year, client and services', action: 'projects', count: stats.projects, icon: <FiBox className="w-6 h-6 text-blue-500" /> },
                    { title: 'Core Services', desc: 'Manage strategic agency operations', action: 'services', count: stats.services, icon: <FiLayers className="w-6 h-6 text-indigo-500" /> },
                    { title: 'Testimonials', desc: 'Publish verified customer statements', action: 'testimonials', count: stats.testimonials, icon: <FiMessageSquare className="w-6 h-6 text-violet-500" /> },
                    { title: 'Articles & Blogs', desc: 'Insights and thoughts publication', action: 'blogs', count: stats.blogs, icon: <FiFolder className="w-6 h-6 text-amber-500" /> },
                    { title: 'Careers', desc: 'Manage open positions & listings', action: 'careers', count: stats.careers, icon: <FiBriefcase className="w-6 h-6 text-emerald-500" /> },
                    { title: 'Applications', desc: 'Review candidate resumes & CVs', action: 'applications', count: stats.applications, icon: <FiUserCheck className="w-6 h-6 text-rose-500" /> },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveSection(card.action as any)}
                      className="p-5 border border-slate-150 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all duration-300 flex flex-col justify-between h-40 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">{card.icon}</div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{card.count} items</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                          {card.title}
                          <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. PROJECTS MANAGEMENT VIEW */}
          {activeSection === 'projects' && (
            <div className="space-y-6">

              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Project Portfolio</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Add, modify and showcase your work. Syncs instantly with the live frontend.</p>
                </div>

                <button
                  onClick={handleAddNewClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FiPlus className="w-4 h-4 stroke-[3]" />
                  Add Portfolio Project
                </button>
              </div>

              {/* Filtering and search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by title, category, services or client..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div className="text-xs font-semibold text-slate-400 sm:pr-2">
                  Showing {filteredProjects.length} of {projects.length} projects
                </div>
              </div>

              {/* Projects Grid List */}
              {loading ? (
                <div className="h-64 bg-white rounded-3xl border border-slate-200/80 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <span className="text-sm font-semibold text-slate-500">Loading catalog...</span>
                  </div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 mb-4">
                    <FiFolder className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No projects found</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">No items matched your search query or database is empty. Click 'Add Portfolio Project' to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      key={project.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                    >
                      {/* Image Preview & category */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={customImageMap[project.slug] || getProjectImage(project.image)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-[10px] font-black uppercase text-slate-800 tracking-wider px-3 py-1 rounded-full border border-white/20">
                          {project.category}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>

                          {/* Metadata row */}
                          <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-3 text-xs">
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Client</span>
                              <span className="text-slate-700 font-bold">{project.client}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Year</span>
                              <span className="text-slate-700 font-bold">{project.year}</span>
                            </div>
                          </div>

                          {/* Services / tags list */}
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block mb-2">Services</span>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Challenge description short */}
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block mb-1">Challenge & Solution</span>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons panel */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-6">
                          <button
                            onClick={() => handleEditClick(project)}
                            className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            Edit details
                          </button>

                          <button
                            onClick={() => handleDeleteClick(project.slug)}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl transition-colors"
                            title="Delete project"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 rounded-xl transition-colors"
                            title="View live page"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. CORE SERVICES MANAGEMENT */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-2"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Services
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Core Agency Services</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Add, edit, or delete service cards. Changes sync instantly to the public <Link to="/services" target="_blank" className="text-blue-600 hover:underline">/services</Link> page.
                  </p>
                </div>
                <button
                  onClick={handleAddServiceClick}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FiPlus className="w-4 h-4 stroke-[3]" />
                  Add Service Card
                </button>
              </div>

              {loading ? (
                <div className="h-48 bg-white rounded-3xl border border-slate-200/80 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                </div>
              ) : services.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
                  <div className="p-4 bg-indigo-50 text-indigo-500 rounded-3xl inline-flex mb-4">
                    <FiLayers className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No services yet</h3>
                  <p className="text-sm text-slate-400 mt-1">Click &quot;Add Service Card&quot; to create your first service.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {services.map((srv: any, idx: number) => (
                    <motion.div
                      key={srv.slug || idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            #{srv.number || String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900">{srv.title}</h3>
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">{srv.description}</p>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Icon: <span className="text-indigo-600">{srv.icon || 'web'}</span>
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400 font-mono">/services/{srv.slug}</p>
                      </div>

                      <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-6">
                        <button
                          onClick={() => handleEditServiceClick(srv)}
                          className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteServiceClick(srv.slug)}
                          className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl"
                          title="Delete service"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/services/${srv.slug}`}
                          target="_blank"
                          className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/60 rounded-xl"
                          title="View on site"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. TESTIMONIALS PLACEHOLDER */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Testimonials</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Manage validated customer quotes, reviews, and client ratings.</p>
                </div>
                <button
                  onClick={handleAddNewTestimonialClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FiPlus className="w-4 h-4 stroke-[3]" />
                  Add Testimonial
                </button>
              </div>

              {/* Add/Edit Form */}
              {isTestimonialFormOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
                  </h3>

                  <div className="space-y-4">
                    {/* Rating */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Rating (1-5 stars)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                            className={`text-3xl transition-all ${testimonialForm.rating >= star
                                ? 'text-amber-400 scale-110'
                                : 'text-slate-200 hover:text-amber-200'
                              }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Client Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        placeholder="e.g. Sarah Mitchell"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Product/Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={testimonialForm.company}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                        placeholder="e.g. Nexora Inc"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Role/Position */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Role/Position (Optional)
                      </label>
                      <input
                        type="text"
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                        placeholder="e.g. Marketing Director"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Avatar Image Selection */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                      <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Avatar Picture</span>
                      <div className="flex gap-4 text-xs font-semibold">
                        {[
                          { id: 'template', label: 'Choose Template' },
                          { id: 'upload', label: 'Upload File' },
                          { id: 'url', label: 'Image URL' }
                        ].map(opt => (
                          <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="avatarSource"
                              checked={avatarSource === opt.id}
                              onChange={() => setAvatarSource(opt.id as any)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>

                      {avatarSource === 'template' && (
                        <select
                          value={testimonialForm.avatar}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="hero-image.webp">Default Hero Image (hero-image.webp)</option>
                          <option value="pexels-mikhail-nilov-6930549.webp">Mikhail Nilov Office (pexels-mikhail-nilov-6930549.webp)</option>
                          <option value="pexels-canvastudio-3153198.webp">Canvas Studio Team (pexels-canvastudio-3153198.webp)</option>
                        </select>
                      )}

                      {avatarSource === 'upload' && (
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition-colors">
                            <FiUploadCloud className="w-4 h-4 text-slate-500" />
                            Upload Profile Pic
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleTestimonialAvatarUpload}
                              className="hidden"
                            />
                          </label>
                          {testimonialForm.avatar && testimonialForm.avatar.startsWith('data:image/') && (
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                              <img src={testimonialForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}

                      {avatarSource === 'url' && (
                        <input
                          type="text"
                          value={testimonialForm.avatar}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                          placeholder="https://example.com/avatar.webp"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>

                    {/* Background Image Selection */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                      <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Background Picture</span>
                      <div className="flex gap-4 text-xs font-semibold">
                        {[
                          { id: 'template', label: 'Choose Template' },
                          { id: 'upload', label: 'Upload File' },
                          { id: 'url', label: 'Image URL' }
                        ].map(opt => (
                          <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="bgImageSource"
                              checked={bgImageSource === opt.id}
                              onChange={() => setBgImageSource(opt.id as any)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>

                      {bgImageSource === 'template' && (
                        <select
                          value={testimonialForm.bgImage}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, bgImage: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="hero-image.webp">Default Hero Image (hero-image.webp)</option>
                          <option value="pexels-mikhail-nilov-6930549.webp">Mikhail Nilov Office (pexels-mikhail-nilov-6930549.webp)</option>
                          <option value="pexels-canvastudio-3153198.webp">Canvas Studio Team (pexels-canvastudio-3153198.webp)</option>
                        </select>
                      )}

                      {bgImageSource === 'upload' && (
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition-colors">
                            <FiUploadCloud className="w-4 h-4 text-slate-500" />
                            Upload Background Pic
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleTestimonialBgImageUpload}
                              className="hidden"
                            />
                          </label>
                          {testimonialForm.bgImage && testimonialForm.bgImage.startsWith('data:image/') && (
                            <div className="w-16 h-10 rounded overflow-hidden border border-slate-200">
                              <img src={testimonialForm.bgImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}

                      {bgImageSource === 'url' && (
                        <input
                          type="text"
                          value={testimonialForm.bgImage}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, bgImage: e.target.value })}
                          placeholder="https://example.com/background.webp"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>

                    {/* Testimonial Text */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Testimonial Text
                      </label>
                      <textarea
                        value={testimonialForm.text}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                        placeholder="Enter the client's feedback or testimonial..."
                        rows={4}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setIsTestimonialFormOpen(false);
                          setEditingTestimonial(null);
                          setTestimonialForm({ name: '', company: '', role: '', text: '', rating: 5, avatar: 'hero-image.webp', bgImage: 'hero-image.webp' });
                        }}
                        className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleTestimonialSubmit}
                        disabled={!testimonialForm.name || !testimonialForm.text}
                        className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                      >
                        Save Testimonial
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Display Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t, idx) => (
                  <div key={t.id || idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-650 italic leading-relaxed">
                        "{t.text || t.quote || t.content}"
                      </p>

                      {/* Background Image Reference / Preview */}
                      {t.bgImage && (
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg w-fit">
                          <span className="font-bold text-slate-500">Bg Image:</span>
                          <span className="truncate max-w-[200px]" title={t.bgImage}>
                            {t.bgImage.startsWith('data:image/') ? 'Custom Uploaded Image' : t.bgImage}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase overflow-hidden shrink-0">
                          {t.avatar ? (
                            <img src={testimonialImageMap[t.avatar] || t.avatar} alt={t.name || t.author} className="w-full h-full object-cover" />
                          ) : (
                            (t.author || t.name || 'C').charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{t.author || t.name}</h4>
                          <p className="text-xs text-slate-400 truncate">{t.company || t.role || 'Client'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTestimonialClick(t)}
                          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all"
                          title="Edit testimonial"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id || idx)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl transition-all"
                          title="Delete testimonial"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TEAM PLACEHOLDER */}
          {activeSection === 'team' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agency Team Directory</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage details of designers, developers, and professional team profiles.</p>
              </div>

              <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                <div className="max-w-md mx-auto flex flex-col items-center">
                  <div className="p-4 bg-emerald-50 text-emerald-500 rounded-3xl mb-4">
                    <FiUsers className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Team Directory Portal</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Team directory customization module is pending database migration. The public layout currently renders static agency profiles with premium animations.
                  </p>
                </div>
              </div>
            </div>
          )}          {/* BLOGS VIEW */}
          {activeSection === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Articles & Blogs</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Publish articles, updates, and thoughts. Syncs instantly with the live frontend.</p>
                </div>

                <button
                  onClick={handleAddBlogClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FiPlus className="w-4 h-4 stroke-[3]" />
                  <span>Publish New Post</span>
                </button>
              </div>

              {loading ? (
                <div className="h-64 bg-white rounded-3xl border border-slate-200/80 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <span className="text-sm font-semibold text-slate-500">Loading blogs catalog...</span>
                  </div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 mb-4">
                    <FiFolder className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No blog posts found</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">No blog posts are published yet. Click 'Publish New Post' to write your first article.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blogs.map((b, idx) => (
                    <motion.div
                      key={b.slug || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                    >
                      {/* Image Preview & category */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={b.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop'}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <span className="absolute bottom-4 left-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                          {b.category}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {b.title}
                          </h3>

                          {/* Metadata row */}
                          <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-3 text-xs">
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Author</span>
                              <span className="text-slate-700 font-bold">{b.author}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Read Time</span>
                              <span className="text-slate-700 font-bold">{b.readTime || '5 min read'}</span>
                            </div>
                          </div>

                          {/* Excerpt */}
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block mb-1">Excerpt</span>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {b.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons panel */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-6">
                          <button
                            onClick={() => handleEditBlogClick(b)}
                            className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            Edit details
                          </button>

                          <button
                            onClick={() => handleDeleteBlogClick(b.slug)}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl transition-colors"
                            title="Delete blog post"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/blog/${b.slug}`}
                            target="_blank"
                            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 rounded-xl transition-colors"
                            title="View live post"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. SETTINGS VIEW */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h2>
                <p className="text-sm text-slate-500 mt-0.5">Configure operational values, e-mail variables, and database sync status.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Admin Authorization</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-slate-400 block font-semibold">Active Login Email</span>
                      <span className="text-slate-800 font-bold mt-1 block">{admin.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Security Role</span>
                      <span className="text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-3 py-0.5 rounded-full font-bold text-xs inline-block mt-1 uppercase">
                        {admin.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Connection Config</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-slate-400 block font-semibold">Target API URL</span>
                      <code className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-150 font-mono mt-1 block select-all">
                        {apiUrl}
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Database Driver</span>
                      <span className="text-slate-800 font-bold mt-1 block flex items-center gap-1">
                        JSON Persistence / Atlas Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* 7. ACCESS REQUESTS VIEW */}
          {activeSection === 'requests' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Access Requests
                  <span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/25 px-2.5 py-1 rounded-full font-bold">
                    {accessRequests.filter(r => r.status === 'pending').length} Pending
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">Approve or reject platform access requests from team members and other individuals.</p>
              </div>

              {accessRequests.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
                    <FiUserCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No requests found</h3>
                  <p className="text-sm text-slate-400 mt-1">There are currently no access requests in the queue.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                          <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</th>
                          <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Request Date</th>
                          <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessRequests.map((reqItem) => (
                          <tr key={reqItem._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700 uppercase">
                                  {reqItem.name.charAt(0)}
                                </div>
                                <div className="text-sm font-bold text-slate-800">{reqItem.name}</div>
                              </div>
                            </td>
                            <td className="p-5 text-sm font-medium text-slate-600">{reqItem.email}</td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${reqItem.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : reqItem.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${reqItem.status === 'pending'
                                  ? 'bg-amber-500 animate-pulse'
                                  : reqItem.status === 'approved'
                                    ? 'bg-emerald-500'
                                    : 'bg-rose-500'
                                  }`}></span>
                                {reqItem.status.charAt(0).toUpperCase() + reqItem.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-5 text-xs font-semibold text-slate-400">
                              {new Date(reqItem.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-5 text-right">
                              {reqItem.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleApproveRequest(reqItem._id)}
                                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <FiCheck className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(reqItem._id)}
                                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <FiX className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-3">
                                  <span className="text-xs font-semibold text-slate-400">Processed</span>
                                  {admin?.email?.toLowerCase().trim() === 'lk.dansroli@gmail.com' && (
                                    <button
                                      onClick={() => handleDeleteRequest(reqItem._id)}
                                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                      title="Delete Access Request & Admin Account"
                                    >
                                      <FiTrash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. CARERS MANAGEMENT VIEW */}
          {activeSection === 'careers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Open Positions (Careers)</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Add, modify and manage job positions. Syncs instantly with the careers page.</p>
                </div>

                <button
                  onClick={handleAddNewCareerClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FiPlus className="w-4 h-4 stroke-[3]" />
                  Add New Position
                </button>
              </div>

              {/* Filtering and search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={careerSearchQuery}
                    onChange={(e) => setCareerSearchQuery(e.target.value)}
                    placeholder="Search careers by title, department or experience..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div className="text-xs font-semibold text-slate-400 sm:pr-2">
                  Showing {filteredCareers.length} of {careers.length} positions
                </div>
              </div>

              {/* Careers Table/List */}
              {careers.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 mb-4">
                    <FiBriefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No positions found</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">Database is empty. Click 'Add New Position' to create your first career listing.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                          <th className="p-5">Title / Role</th>
                          <th className="p-5">Department</th>
                          <th className="p-5">Type</th>
                          <th className="p-5">Location</th>
                          <th className="p-5">Experience</th>
                          <th className="p-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-semibold">
                        {filteredCareers.map((c) => (
                          <tr key={c.slug} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-5">
                              <div className="font-bold text-slate-900">{c.title}</div>
                              <div className="text-xs text-slate-400 font-medium">{c.slug}</div>
                            </td>
                            <td className="p-5">{c.department}</td>
                            <td className="p-5">
                              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200/40">
                                {c.employmentType}
                              </span>
                            </td>
                            <td className="p-5">{c.location}</td>
                            <td className="p-5">{c.experience}</td>
                            <td className="p-5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleEditCareerClick(c)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCareerClick(c.slug)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. APPLICATIONS VIEW */}
          {activeSection === 'applications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Job Applications</h2>
                <p className="text-sm text-slate-500 mt-0.5">Review and manage candidates who have submitted applications through the careers page.</p>
              </div>

              {applications.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 mb-4">
                    <FiUsers className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No applications received yet</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">When candidates submit their resume details on the job postings, their applications will show up here.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                          <th className="p-5">Applicant Details</th>
                          <th className="p-5">Target Role</th>
                          <th className="p-5">Resume Link</th>
                          <th className="p-5">Date Submitted</th>
                          <th className="p-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-semibold">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-5">
                              <div className="font-bold text-slate-900">{app.name}</div>
                              <div className="text-xs text-slate-500 font-medium">{app.email} • {app.phone}</div>
                              {app.coverLetter && (
                                <div className="mt-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100 p-2.5 rounded-lg max-w-md italic whitespace-pre-wrap">
                                  "{app.coverLetter}"
                                </div>
                              )}
                            </td>
                            <td className="p-5">
                              <div className="font-bold text-slate-800">{app.careerTitle}</div>
                              <div className="text-xs text-slate-400 font-medium">{app.careerSlug}</div>
                            </td>
                            <td className="p-5">
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-xs"
                              >
                                View Resume
                                <FiExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </td>
                            <td className="p-5 text-xs text-slate-400 font-bold">{app.dateSubmitted}</td>
                            <td className="p-5 text-right">
                              <button
                                onClick={() => handleDeleteApplicationClick(app.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Elegant Add/Edit Drawer Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">

            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px]"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-slate-200"
            >

              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <FiBriefcase className="text-blue-500" />
                    {editingProject ? 'Edit Portfolio Project' : 'Publish New Project'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Fill out project metadata below to sync with frontend pages.</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-200/80 rounded-xl transition-colors text-slate-500"
                  title="Close form"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Arrows, Chantalle, Papyrus"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>

                {/* Sub Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="e.g. Visual Identity"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                  {/* Client */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Client *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.client}
                      onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                      placeholder="e.g. Arrows Global"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Year *</label>
                    <input
                      type="number"
                      required
                      value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                </div>

                {/* Services / Tags */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Services / Tags *</span>
                    <span className="text-[10px] text-slate-400 normal-case font-medium">Separate with commas</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    placeholder="e.g. Branding, Web Design, Motion, Development"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>

                {/* Visual Media Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Portfolio Hero Image *</label>

                  {/* Premium Tab Switcher */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold text-slate-600">
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('template');
                        setProjectForm(prev => ({ ...prev, image: 'pexels-1.webp' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${imageSource === 'template' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Presets Templates
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('upload');
                        setProjectForm(prev => ({ ...prev, image: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${imageSource === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Upload Picture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('url');
                        setProjectForm(prev => ({ ...prev, image: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${imageSource === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Paste Image Link
                    </button>
                  </div>

                  {/* Mode A: Preset Template Select Dropdown */}
                  {imageSource === 'template' && (
                    <select
                      value={projectForm.image.startsWith('data:image/') || projectForm.image.startsWith('http') ? 'pexels-1.webp' : projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-bold mb-4"
                    >
                      {imageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Mode B: Upload Local Image file */}
                  {imageSource === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors text-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        id="custom-file-upload"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="custom-file-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <FiUploadCloud className="w-8 h-8 text-blue-500 mb-1 mx-auto" />
                          <span className="text-sm font-bold text-slate-700 block">Choose Image File</span>
                          <span className="text-xs text-slate-400 block">Supports JPG, PNG, WEBP (under 2MB)</span>
                        </div>
                      </label>
                      {projectForm.image && projectForm.image.startsWith('data:image/') && (
                        <div className="mt-3 text-xs text-emerald-600 font-semibold bg-emerald-50 py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 border border-emerald-100 mx-auto">
                          <FiCheck className="w-3.5 h-3.5" /> File loaded successfully!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode C: Paste Image Link */}
                  {imageSource === 'url' && (
                    <div className="mb-4">
                      <input
                        type="url"
                        placeholder="Paste image link here (e.g. https://images.unsplash.com/...)"
                        value={projectForm.image.startsWith('data:image/') ? '' : projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Paste any visual URL from Unsplash, Pexels, or your custom asset server.</span>
                    </div>
                  )}

                  {/* Dynamic Image Preview */}
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {projectForm.image ? (
                      <>
                        <img
                          src={
                            editingProject && customImageMap[editingProject.slug] && projectForm.image === editingProject.image
                              ? customImageMap[editingProject.slug]
                              : getProjectImage(projectForm.image)
                          }
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setProjectForm(prev => ({ ...prev, image: '' }))}
                          className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center pointer-events-auto"
                          title="Remove project image"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                        No image selected yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenge & Solution (description) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">The Challenge & Solution *</label>
                  <textarea
                    required
                    rows={6}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Provide a descriptive overview explaining the project scope, client issues, and your strategic design approach..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 leading-relaxed font-medium"
                  ></textarea>
                </div>

                {/* Gallery Images (Challenge & Solution pics) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Gallery Images (Challenge & Solution)</span>
                    <span className="text-[10px] text-slate-400 normal-case font-medium">Add additional showcase pictures</span>
                  </label>

                  {/* Upload & Url Input controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Local File Uploader */}
                    <div className="border border-slate-200 border-dashed rounded-xl p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-center flex flex-col items-center justify-center min-h-[90px]">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        id="gallery-file-upload"
                        className="hidden"
                        onChange={handleGalleryUpload}
                      />
                      <label htmlFor="gallery-file-upload" className="cursor-pointer block w-full">
                        <div className="flex items-center justify-center gap-2 text-slate-600">
                          <FiUploadCloud className="w-5 h-5 text-blue-500" />
                          <span className="text-xs font-bold text-slate-700">Upload Gallery Images</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">Supports multiple files under 2MB</span>
                      </label>
                    </div>

                    {/* External URL adder */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Add External Image URL</span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={galleryUrlInput}
                          onChange={(e) => setGalleryUrlInput(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-550 focus:border-blue-500 transition-all text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryUrl}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Grid Previews */}
                  {projectForm.gallery && projectForm.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      {projectForm.gallery.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-white group shadow-sm">
                          <img
                            src={getProjectImage(imgUrl)}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors shadow"
                              title="Remove image"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      No additional gallery images added
                    </div>
                  )}
                </div>

                {/* ── Video Section (Challenge & Solution) ── */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Videos (Challenge &amp; Solution)</span>
                    <span className="text-[10px] text-slate-400 normal-case font-medium">YouTube links or direct mp4 URLs</span>
                  </label>

                  {/* Add video URL */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-2 mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Add Video Link</span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="YouTube URL or direct mp4 link (https://...)"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const trimmed = videoUrlInput.trim();
                            if (trimmed) {
                              setProjectForm(prev => ({ ...prev, videos: [...(prev.videos || []), trimmed] }));
                              setVideoUrlInput('');
                            }
                          }
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = videoUrlInput.trim();
                          if (!trimmed) return;
                          setProjectForm(prev => ({ ...prev, videos: [...(prev.videos || []), trimmed] }));
                          setVideoUrlInput('');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        Add Video
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">Supports YouTube (youtu.be / youtube.com/watch) or direct .mp4 video links.</span>
                  </div>

                  {/* Video list */}
                  {projectForm.videos && projectForm.videos.length > 0 ? (
                    <div className="space-y-3">
                      {projectForm.videos.map((vidUrl, idx) => {
                        const ytId = getYouTubeId(vidUrl);

                        return (
                          <div key={idx} className="relative flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 group">
                            {ytId ? (
                              <img
                                src={`https://img.youtube.com/vi/${ytId}/hqdefault.webp`}
                                alt={`Video ${idx + 1}`}
                                className="w-24 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-24 h-14 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ytId ? 'YouTube' : 'Direct Video'}</p>
                              <p className="text-xs text-slate-600 truncate font-mono mt-0.5">{vidUrl}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setProjectForm(prev => ({ ...prev, videos: (prev.videos || []).filter((_, i) => i !== idx) }))}
                              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow shrink-0"
                              title="Remove video"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      No videos added yet
                    </div>
                  )}
                </div>

              </form>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-3 hover:bg-slate-200 rounded-xl text-slate-655 text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="project-form"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98]"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Service Drawer */}
      <AnimatePresence>
        {isServiceFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsServiceFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <FiLayers className="text-indigo-500" />
                    {editingService ? 'Edit Service Card' : 'Add Service Card'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Synced to the public services page grid.</p>
                </div>
                <button
                  onClick={() => setIsServiceFormOpen(false)}
                  className="p-2 hover:bg-slate-200/80 rounded-xl text-slate-500"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form id="service-form" onSubmit={handleServiceSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g. Web Design"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Card Description *</label>
                  <textarea
                    required
                    rows={5}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Short text shown on the service card..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 leading-relaxed"
                  />
                </div>                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Card Icon</label>
                  <select
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium animate-none"
                  >
                    {serviceIconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Service Hero Image Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Service Hero Image</label>

                  {/* Premium Tab Switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold text-slate-600">
                    <button
                      type="button"
                      onClick={() => {
                        setServiceHeroImageSource('upload');
                        setServiceForm(prev => ({ ...prev, heroImage: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${serviceHeroImageSource === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Upload Picture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setServiceHeroImageSource('url');
                        setServiceForm(prev => ({ ...prev, heroImage: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${serviceHeroImageSource === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Paste Image Link
                    </button>
                  </div>

                  {/* Mode A: Upload Local Image file */}
                  {serviceHeroImageSource === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors text-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        id="service-hero-file-upload"
                        className="hidden"
                        onChange={handleServiceHeroImageUpload}
                      />
                      <label htmlFor="service-hero-file-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <FiUploadCloud className="w-8 h-8 text-indigo-500 mb-1 mx-auto" />
                          <span className="text-sm font-bold text-slate-700 block">Choose Image File</span>
                          <span className="text-xs text-slate-400 block">Supports JPG, PNG, WEBP (under 2MB)</span>
                        </div>
                      </label>
                      {serviceForm.heroImage && serviceForm.heroImage.startsWith('data:image/') && (
                        <div className="mt-3 text-xs text-emerald-600 font-semibold bg-emerald-50 py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 border border-emerald-100 mx-auto">
                          <FiCheck className="w-3.5 h-3.5" /> File loaded successfully!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode B: Paste Image Link */}
                  {serviceHeroImageSource === 'url' && (
                    <div className="mb-4">
                      <input
                        type="url"
                        placeholder="Paste image link here (e.g. https://images.unsplash.com/...)"
                        value={serviceForm.heroImage.startsWith('data:image/') ? '' : serviceForm.heroImage}
                        onChange={(e) => setServiceForm({ ...serviceForm, heroImage: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Paste any visual URL from Unsplash, Pexels, or your custom asset server.</span>
                    </div>
                  )}

                  {/* Dynamic Image Preview */}
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {serviceForm.heroImage ? (
                      <>
                        <img
                          src={serviceForm.heroImage}
                          alt="Hero thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setServiceForm(prev => ({ ...prev, heroImage: '' }))}
                          className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center pointer-events-auto"
                          title="Remove custom image"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <img
                          src={servicesHeroRender}
                          alt="Default Hero render"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-slate-900/5 flex items-end p-3 pointer-events-none">
                          <span className="text-[10px] font-bold text-slate-500 bg-white/95 border border-slate-250/50 px-2 py-0.5 rounded-md shadow-sm">
                            Default 3D Render active
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Service Overview Customizations */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Service Overview Section</h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Overview Heading</label>
                    <input
                      type="text"
                      value={serviceForm.overviewHeading}
                      onChange={(e) => setServiceForm({ ...serviceForm, overviewHeading: e.target.value })}
                      placeholder="e.g. Brands that stand out — and stay consistent everywhere."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Overview Body</label>
                    <textarea
                      rows={3}
                      value={serviceForm.overviewBody}
                      onChange={(e) => setServiceForm({ ...serviceForm, overviewBody: e.target.value })}
                      placeholder="Detailed explanation of what this service covers..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Overview Image</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="service-overview-upload"
                        className="hidden"
                        onChange={handleServiceOverviewImageUpload}
                      />
                      <label htmlFor="service-overview-upload" className="cursor-pointer py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1">
                        <FiUploadCloud className="w-3.5 h-3.5" /> Upload File
                      </label>
                      <input
                        type="url"
                        value={serviceForm.overviewImage}
                        onChange={(e) => setServiceForm({ ...serviceForm, overviewImage: e.target.value })}
                        placeholder="Or paste external image link..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-505 text-slate-800"
                      />
                    </div>
                    {serviceForm.overviewImage && (
                      <div className="mt-2 relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img src={getProjectImage(serviceForm.overviewImage)} alt="Overview preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setServiceForm(prev => ({ ...prev, overviewImage: '' }))}
                          className="absolute top-2 right-2 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center pointer-events-auto"
                          title="Remove overview image"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overview Gallery ─────────────────────────── */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Overview Gallery (More Pics)</h4>
                  <div className="flex gap-2">
                    <input type="file" multiple accept="image/*" id="svc-ov-gallery-upload" className="hidden" onChange={handleServiceOverviewGalleryUpload} />
                    <label htmlFor="svc-ov-gallery-upload" className="cursor-pointer py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 border border-slate-200">
                      <FiUploadCloud className="w-3.5 h-3.5" /> Upload Pics
                    </label>
                    <input
                      type="url"
                      value={serviceOverviewGalleryUrlInput}
                      onChange={(e) => setServiceOverviewGalleryUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleServiceOverviewAddGalleryUrl(); } }}
                      placeholder="Or paste image URL..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                    <button type="button" onClick={handleServiceOverviewAddGalleryUrl} className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">Add</button>
                  </div>
                  {serviceForm.overviewGallery && serviceForm.overviewGallery.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {serviceForm.overviewGallery.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                          <img src={getProjectImage(img)} alt={`OV ${idx + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => handleServiceOverviewRemoveGalleryImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">No overview gallery images yet</span>
                  )}
                </div>

                {/* Overview Videos ─────────────────────────── */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Overview Videos</h4>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
                    <button type="button" onClick={() => setServiceOverviewVideoSource('youtube')} className={`py-1.5 rounded-md text-center transition-all ${serviceOverviewVideoSource === 'youtube' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-800'}`}>YouTube Link</button>
                    <button type="button" onClick={() => setServiceOverviewVideoSource('upload')} className={`py-1.5 rounded-md text-center transition-all ${serviceOverviewVideoSource === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-800'}`}>Upload Video</button>
                  </div>
                  {serviceOverviewVideoSource === 'youtube' ? (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={serviceOverviewYoutubeUrlInput}
                        onChange={(e) => setServiceOverviewYoutubeUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleServiceOverviewAddYoutubeUrl(); } }}
                        placeholder="Paste YouTube URL..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                      <button type="button" onClick={handleServiceOverviewAddYoutubeUrl} className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">Add</button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50 text-center">
                      <input type="file" accept="video/*" id="svc-ov-video-upload" className="hidden" onChange={handleServiceOverviewVideoUpload} />
                      <label htmlFor="svc-ov-video-upload" className="cursor-pointer block">
                        <FiUploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-slate-600 block">Choose Video File</span>
                        <span className="text-[9px] text-slate-400">(MP4/WebM under 15MB)</span>
                      </label>
                    </div>
                  )}
                  {serviceForm.overviewVideos && serviceForm.overviewVideos.length > 0 ? (
                    <div className="space-y-1.5">
                      {serviceForm.overviewVideos.map((vid, idx) => {
                        const ytId = vid.type === 'youtube' ? (vid.url.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1] || null) : null;
                        return (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                            {ytId ? (
                              <img src={`https://img.youtube.com/vi/${ytId}/default.webp`} alt="yt" className="w-16 h-10 object-cover rounded shrink-0" />
                            ) : vid.type === 'upload' ? (
                              <div className="w-16 h-10 bg-black rounded shrink-0 relative overflow-hidden">
                                <video src={vid.url} className="w-full h-full object-cover opacity-80" muted />
                              </div>
                            ) : (
                              <div className="w-16 h-10 bg-slate-200 rounded shrink-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{vid.type === 'youtube' ? 'YouTube' : 'Upload'}</p>
                              <p className="text-[10px] text-slate-600 truncate font-mono">{vid.url.substring(0, 40)}...</p>
                            </div>
                            <button type="button" onClick={() => handleServiceOverviewRemoveVideo(idx)} className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shrink-0">
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">No overview videos yet</span>
                  )}
                </div>

                {/* Related Showcase Work */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Related Case Study (Project)</h4>


                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Select Portfolio Project</label>
                    <select
                      value={serviceForm.relatedWorkSlug}
                      onChange={(e) => {
                        const selectedSlug = e.target.value;
                        const matchedProj = projects.find(p => p.slug === selectedSlug);
                        setServiceForm(prev => ({
                          ...prev,
                          relatedWorkSlug: selectedSlug,
                          relatedWorkTitle: prev.relatedWorkTitle || (matchedProj ? matchedProj.title : ''),
                          relatedWorkDescription: prev.relatedWorkDescription || (matchedProj ? matchedProj.description : ''),
                          relatedWorkImage: prev.relatedWorkImage || (matchedProj ? (matchedProj.image.startsWith('data:image/') || matchedProj.image.startsWith('http') ? matchedProj.image : matchedProj.image) : '')
                        }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium"
                    >
                      <option value="">-- Choose project --</option>
                      {projects.map(proj => (
                        <option key={proj.slug} value={proj.slug}>{proj.title} ({proj.slug})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Showcase Title</label>
                    <input
                      type="text"
                      value={serviceForm.relatedWorkTitle}
                      onChange={(e) => setServiceForm({ ...serviceForm, relatedWorkTitle: e.target.value })}
                      placeholder="e.g. Arrows rebranding case study"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Showcase Description</label>
                    <textarea
                      rows={3}
                      value={serviceForm.relatedWorkDescription}
                      onChange={(e) => setServiceForm({ ...serviceForm, relatedWorkDescription: e.target.value })}
                      placeholder="Short teaser description for this case study..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Showcase Image</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="service-related-upload"
                        className="hidden"
                        onChange={handleServiceRelatedImageUpload}
                      />
                      <label htmlFor="service-related-upload" className="cursor-pointer py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1">
                        <FiUploadCloud className="w-3.5 h-3.5" /> Upload File
                      </label>
                      <input
                        type="url"
                        value={serviceForm.relatedWorkImage}
                        onChange={(e) => setServiceForm({ ...serviceForm, relatedWorkImage: e.target.value })}
                        placeholder="Or paste external image link..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    {serviceForm.relatedWorkImage && (
                      <div className="mt-2 relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img src={getProjectImage(serviceForm.relatedWorkImage)} alt="Related work preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setServiceForm(prev => ({ ...prev, relatedWorkImage: '' }))}
                          className="absolute top-2 right-2 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center pointer-events-auto"
                          title="Remove showcase image"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Related Work Gallery ─────────────────── */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <span className="block text-[11px] font-bold text-indigo-500 uppercase tracking-widest">Related Work Gallery (More Pics)</span>
                    <div className="flex gap-2">
                      <input type="file" multiple accept="image/*" id="svc-rw-gallery-upload" className="hidden" onChange={handleServiceRelatedWorkGalleryUpload} />
                      <label htmlFor="svc-rw-gallery-upload" className="cursor-pointer py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 border border-slate-200">
                        <FiUploadCloud className="w-3.5 h-3.5" /> Upload Pics
                      </label>
                      <input
                        type="url"
                        value={serviceRelatedWorkGalleryUrlInput}
                        onChange={(e) => setServiceRelatedWorkGalleryUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleServiceRelatedWorkAddGalleryUrl(); } }}
                        placeholder="Or paste image URL..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                      <button type="button" onClick={handleServiceRelatedWorkAddGalleryUrl} className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">Add</button>
                    </div>
                    {serviceForm.relatedWorkGallery && serviceForm.relatedWorkGallery.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {serviceForm.relatedWorkGallery.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                            <img src={getProjectImage(img)} alt={`RW ${idx + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => handleServiceRelatedWorkRemoveGalleryImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No related work gallery images yet</span>
                    )}
                  </div>

                  {/* Related Work Videos ─────────────────── */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <span className="block text-[11px] font-bold text-indigo-500 uppercase tracking-widest">Related Work Videos</span>
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
                      <button type="button" onClick={() => setServiceRelatedWorkVideoSource('youtube')} className={`py-1.5 rounded-md text-center transition-all ${serviceRelatedWorkVideoSource === 'youtube' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-800'}`}>YouTube Link</button>
                      <button type="button" onClick={() => setServiceRelatedWorkVideoSource('upload')} className={`py-1.5 rounded-md text-center transition-all ${serviceRelatedWorkVideoSource === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-800'}`}>Upload Video</button>
                    </div>
                    {serviceRelatedWorkVideoSource === 'youtube' ? (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={serviceRelatedWorkYoutubeUrlInput}
                          onChange={(e) => setServiceRelatedWorkYoutubeUrlInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleServiceRelatedWorkAddYoutubeUrl(); } }}
                          placeholder="Paste YouTube URL..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                        <button type="button" onClick={handleServiceRelatedWorkAddYoutubeUrl} className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">Add</button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50 text-center">
                        <input type="file" accept="video/*" id="svc-rw-video-upload" className="hidden" onChange={handleServiceRelatedWorkVideoUpload} />
                        <label htmlFor="svc-rw-video-upload" className="cursor-pointer block">
                          <FiUploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                          <span className="text-[11px] font-bold text-slate-600 block">Choose Video File</span>
                          <span className="text-[9px] text-slate-400">(MP4/WebM under 15MB)</span>
                        </label>
                      </div>
                    )}
                    {serviceForm.relatedWorkVideos && serviceForm.relatedWorkVideos.length > 0 ? (
                      <div className="space-y-1.5">
                        {serviceForm.relatedWorkVideos.map((vid, idx) => {
                          const ytId = vid.type === 'youtube' ? (vid.url.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1] || null) : null;
                          return (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                              {ytId ? (
                                <img src={`https://img.youtube.com/vi/${ytId}/default.webp`} alt="yt" className="w-16 h-10 object-cover rounded shrink-0" />
                              ) : vid.type === 'upload' ? (
                                <div className="w-16 h-10 bg-black rounded shrink-0 relative overflow-hidden">
                                  <video src={vid.url} className="w-full h-full object-cover opacity-80" muted />
                                </div>
                              ) : (
                                <div className="w-16 h-10 bg-slate-200 rounded shrink-0 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{vid.type === 'youtube' ? 'YouTube' : 'Upload'}</p>
                                <p className="text-[10px] text-slate-600 truncate font-mono">{vid.url.substring(0, 40)}...</p>
                              </div>
                              <button type="button" onClick={() => handleServiceRelatedWorkRemoveVideo(idx)} className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shrink-0">
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No related work videos yet</span>
                    )}
                  </div>
                </div>

                {editingService?.slug && (
                  <p className="text-xs text-slate-400">
                    Live URL: <span className="font-mono text-indigo-600">/services/{editingService.slug}</span>
                  </p>
                )}
              </form>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceFormOpen(false)}
                  className="px-5 py-3 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="service-form"
                  disabled={serviceSubmitting}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl flex items-center gap-2"
                >
                  {serviceSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingService ? 'Save Service' : 'Add Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Blog Drawer */}
      <AnimatePresence>
        {isBlogFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">

            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBlogFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px]"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-slate-200"
            >

              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <FiFolder className="text-blue-500" />
                    {editingBlog ? 'Edit Blog Post' : 'Publish New Blog Post'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Fill out blog post content below to sync with frontend pages.</p>
                </div>
                <button
                  onClick={() => setIsBlogFormOpen(false)}
                  className="p-2 hover:bg-slate-200/80 rounded-xl transition-colors text-slate-500"
                  title="Close form"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <form id="blog-form" onSubmit={handleBlogSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Blog Title *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Design That Converts: Our Approach"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>

                {/* Sub Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category *</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Strategy">Strategy</option>
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      placeholder="e.g. Lokesh Kumawat"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Read Time *</label>
                    <input
                      type="text"
                      required
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                      placeholder="e.g. 5 min read"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Short Excerpt *</label>
                  <textarea
                    required
                    rows={3}
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Provide a brief one or two sentence summary of the post..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium leading-relaxed"
                  />
                </div>

                {/* Content paragraphs */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Content Paragraphs *</label>
                  <textarea
                    required
                    rows={8}
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Type or paste the full content of the article here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium leading-relaxed"
                  />
                </div>

                {/* Cover Image Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Cover Image *</label>

                  {/* Premium Tab Switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold text-slate-600">
                    <button
                      type="button"
                      onClick={() => {
                        setBlogImageSource('upload');
                        setBlogForm(prev => ({ ...prev, image: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${blogImageSource === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Upload Picture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBlogImageSource('url');
                        setBlogForm(prev => ({ ...prev, image: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-all ${blogImageSource === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Paste Image Link
                    </button>
                  </div>

                  {/* Mode A: Upload Local Image file */}
                  {blogImageSource === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors text-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        id="blog-file-upload"
                        className="hidden"
                        onChange={handleBlogCoverImageUpload}
                      />
                      <label htmlFor="blog-file-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <FiUploadCloud className="w-8 h-8 text-blue-500 mb-1 mx-auto" />
                          <span className="text-sm font-bold text-slate-700 block">Choose Image File</span>
                          <span className="text-xs text-slate-400 block">Supports JPG, PNG, WEBP (under 2MB)</span>
                        </div>
                      </label>
                      {blogForm.image && blogForm.image.startsWith('data:image/') && (
                        <div className="mt-3 text-xs text-emerald-600 font-semibold bg-emerald-50 py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 border border-emerald-100 mx-auto">
                          <FiCheck className="w-3.5 h-3.5" /> File loaded successfully!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode B: Paste Image Link */}
                  {blogImageSource === 'url' && (
                    <div className="mb-4">
                      <input
                        type="url"
                        placeholder="Paste image link here (e.g. https://images.unsplash.com/...)"
                        value={blogForm.image.startsWith('data:image/') ? '' : blogForm.image}
                        onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Paste any visual URL from Unsplash, Pexels, or your custom asset server.</span>
                    </div>
                  )}
                </div>

                {/* Dynamic Image Preview */}
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {blogForm.image ? (
                    <>
                      <img
                        src={blogForm.image}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBlogForm(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center pointer-events-auto"
                        title="Remove cover image"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                      No cover image selected
                    </div>
                  )}
                </div>

                {/* Blog Gallery Section */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-widest text-left">Blog Gallery (More Pics)</span>

                  <div className="flex gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="blog-gallery-upload"
                      className="hidden"
                      onChange={handleBlogGalleryUpload}
                    />
                    <label htmlFor="blog-gallery-upload" className="cursor-pointer py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 border border-slate-200">
                      <FiUploadCloud className="w-4 h-4 text-slate-500" /> Upload Images
                    </label>
                    <input
                      type="url"
                      value={blogGalleryUrlInput}
                      onChange={(e) => setBlogGalleryUrlInput(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleBlogAddGalleryUrl}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-500/10 shrink-0"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Gallery image thumbnails */}
                  {blogForm.gallery && blogForm.gallery.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {blogForm.gallery.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 group">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleBlogRemoveGalleryImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 shadow pointer-events-auto"
                            title="Remove image"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      No gallery images added yet
                    </div>
                  )}
                </div>

                {/* Blog Videos Section */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-widest text-left">Blog Videos</span>

                  {/* Video source tabs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-655 w-fit">
                    <button
                      type="button"
                      onClick={() => setBlogVideoSource('youtube')}
                      className={`py-1.5 px-3 rounded-lg text-center transition-all ${blogVideoSource === 'youtube' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      YouTube URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlogVideoSource('upload')}
                      className={`py-1.5 px-3 rounded-lg text-center transition-all ${blogVideoSource === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Upload Video
                    </button>
                  </div>

                  {blogVideoSource === 'youtube' ? (
                    <div className="flex gap-3 items-center">
                      <input
                        type="url"
                        value={blogYoutubeUrlInput}
                        onChange={(e) => setBlogYoutubeUrlInput(e.target.value)}
                        placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={handleBlogAddYoutubeUrl}
                        className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-500/10 shrink-0"
                      >
                        Add Video
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors text-center">
                      <input
                        type="file"
                        accept="video/*"
                        id="blog-video-upload"
                        className="hidden"
                        onChange={handleBlogVideoUpload}
                      />
                      <label htmlFor="blog-video-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <FiUploadCloud className="w-8 h-8 text-blue-500 mb-1 mx-auto" />
                          <span className="text-sm font-bold text-slate-700 block">Choose Video File</span>
                          <span className="text-xs text-slate-400 block">Supports MP4, WEBM (under 15MB)</span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Videos List */}
                  {blogForm.videos && blogForm.videos.length > 0 ? (
                    <div className="space-y-3">
                      {blogForm.videos.map((vid, idx) => {
                        const ytId = vid.type === 'youtube' ? getYouTubeId(vid.url) : null;

                        return (
                          <div key={idx} className="relative flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 group">
                            {vid.type === 'youtube' && ytId ? (
                              <img
                                src={`https://img.youtube.com/vi/${ytId}/hqdefault.webp`}
                                alt={`YouTube Video ${idx + 1}`}
                                className="w-24 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                            ) : vid.type === 'upload' ? (
                              <div className="w-24 h-14 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                                <video src={vid.url} className="w-full h-full object-cover opacity-80" muted />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                                </div>
                              </div>
                            ) : (
                              <div className="w-24 h-14 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{vid.type === 'youtube' ? 'YouTube link' : 'Uploaded Video file'}</p>
                              <p className="text-xs text-slate-600 truncate font-mono mt-0.5">{vid.url}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleBlogRemoveVideo(idx)}
                              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow shrink-0"
                              title="Remove video"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      No videos added yet
                    </div>
                  )}
                </div>

              </form>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsBlogFormOpen(false)}
                  className="px-5 py-3 hover:bg-slate-200 rounded-xl text-slate-500 text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="blog-form"
                  disabled={blogSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98]"
                >
                  {blogSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editingBlog ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Career Drawer */}
      <AnimatePresence>
        {isCareerFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">

            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCareerFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px]"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: '105%' }}
              animate={{ x: 0 }}
              exit={{ x: '105%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-slate-200"
            >

              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <FiBriefcase className="text-blue-500" />
                    {editingCareer ? 'Edit Career Position' : 'Publish New Career Position'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Define role requirements, duties, and metadata for public listings.</p>
                </div>
                <button
                  onClick={() => setIsCareerFormOpen(false)}
                  className="p-2 hover:bg-slate-200/80 rounded-xl transition-colors text-slate-500"
                  title="Close form"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <form id="career-form" onSubmit={handleCareerSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={careerForm.title}
                    onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>

                {/* Sub Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Department *</label>
                    <select
                      value={careerForm.department}
                      onChange={(e) => setCareerForm({ ...careerForm, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Content">Content</option>
                    </select>
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employment Type *</label>
                    <select
                      value={careerForm.employmentType}
                      onChange={(e) => setCareerForm({ ...careerForm, employmentType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Icon representation *</label>
                    <select
                      value={careerForm.icon}
                      onChange={(e) => setCareerForm({ ...careerForm, icon: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="ui">UI/UX Layout (ui)</option>
                      <option value="code">Development / Tech (code)</option>
                      <option value="brand">Branding Identity (brand)</option>
                      <option value="marketing">Growth & Campaign (marketing)</option>
                      <option value="operations">PM & Operations (operations)</option>
                      <option value="writer">Content Copywriting (writer)</option>
                    </select>
                  </div>

                </div>

                {/* Location & Experience & Checkbox */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      value={careerForm.location}
                      onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                      placeholder="e.g. Anywhere / Remote"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience level *</label>
                    <input
                      type="text"
                      required
                      value={careerForm.experience}
                      onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })}
                      placeholder="e.g. 3+ Years"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>

                  {/* New checkbox toggle */}
                  <div className="flex items-center pt-8">
                    <label className="relative flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={careerForm.isNew}
                        onChange={(e) => setCareerForm({ ...careerForm, isNew: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-350 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-655 uppercase tracking-wider">Mark as 'New' role</span>
                    </label>
                  </div>

                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Short Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={careerForm.description}
                    onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                    placeholder="Short summary of the position shown in listings..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium leading-relaxed"
                  />
                </div>

                {/* Role Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Role Card Image (Optional)</label>

                  {/* Tab Switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold text-slate-600 w-fit">
                    <button
                      type="button"
                      onClick={() => {
                        setCareerImageSource('upload');
                        setCareerForm(prev => ({ ...prev, image: '' }));
                      }}
                      className={`py-1.5 px-3 rounded-lg text-center transition-all ${careerImageSource === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Upload Picture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCareerImageSource('url');
                        setCareerForm(prev => ({ ...prev, image: '' }));
                      }}
                      className={`py-1.5 px-3 rounded-lg text-center transition-all ${careerImageSource === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-800'}`}
                    >
                      Paste Image Link
                    </button>
                  </div>

                  {/* Mode A: Upload Local Image file */}
                  {careerImageSource === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors text-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        id="career-file-upload"
                        className="hidden"
                        onChange={handleCareerImageUpload}
                      />
                      <label htmlFor="career-file-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <FiUploadCloud className="w-8 h-8 text-blue-500 mb-1 mx-auto" />
                          <span className="text-sm font-bold text-slate-700 block">Choose Image File</span>
                          <span className="text-xs text-slate-400 block">Supports JPG, PNG, WEBP (under 2MB)</span>
                        </div>
                      </label>
                      {careerForm.image && careerForm.image.startsWith('data:image/') && (
                        <div className="mt-3 text-xs text-emerald-600 font-semibold bg-emerald-50 py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 border border-emerald-100 mx-auto">
                          <FiCheck className="w-3.5 h-3.5" /> File loaded successfully!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode B: Paste Image Link */}
                  {careerImageSource === 'url' && (
                    <div className="mb-4">
                      <input
                        type="url"
                        placeholder="Paste image link here (e.g. https://images.unsplash.com/...)"
                        value={careerForm.image.startsWith('data:image/') ? '' : careerForm.image}
                        onChange={(e) => setCareerForm({ ...careerForm, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Paste any visual URL from Unsplash, Pexels, or your custom asset server.</span>
                    </div>
                  )}

                  {/* Dynamic Image Preview */}
                  {careerForm.image && (
                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 mb-4">
                      <img
                        src={careerForm.image}
                        alt="Career thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCareerForm(prev => ({ ...prev, image: '' }))}
                        className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center"
                        title="Remove image"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* About Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">About the Role *</label>
                  <textarea
                    required
                    rows={4}
                    value={careerForm.aboutRole}
                    onChange={(e) => setCareerForm({ ...careerForm, aboutRole: e.target.value })}
                    placeholder="Provide a detailed overview of the role, scope, and team fit..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium leading-relaxed"
                  />
                </div>

                {/* Responsibilities (newline-separated) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Key Responsibilities</span>
                    <span className="text-[10px] text-slate-400 normal-case font-semibold">Enter each responsibility on a new line</span>
                  </label>
                  <textarea
                    rows={5}
                    value={careerForm.responsibilities}
                    onChange={(e) => setCareerForm({ ...careerForm, responsibilities: e.target.value })}
                    placeholder="e.g.&#10;Design digital products from concepts to launch&#10;Maintain design system components&#10;Collaborate with front-end developers"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-850 font-mono leading-relaxed text-xs"
                  />
                </div>

                {/* Requirements (newline-separated) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Job Requirements</span>
                    <span className="text-[10px] text-slate-400 normal-case font-semibold">Enter each requirement on a new line</span>
                  </label>
                  <textarea
                    rows={5}
                    value={careerForm.requirements}
                    onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value })}
                    placeholder="e.g.&#10;3+ years of professional engineering experience&#10;Proficient in React, Tailwind, and Vite&#10;Solid communication skills"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-855 font-mono leading-relaxed text-xs"
                  />
                </div>

                {/* Nice To Have (newline-separated) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Nice to Have (Bonus points)</span>
                    <span className="text-[10px] text-slate-400 normal-case font-semibold">Enter each bonus skill on a new line</span>
                  </label>
                  <textarea
                    rows={4}
                    value={careerForm.niceToHave}
                    onChange={(e) => setCareerForm({ ...careerForm, niceToHave: e.target.value })}
                    placeholder="e.g.&#10;Experience with Framer Motion or canvas animation&#10;Familiarity with local json databases&#10;Previous agency environment work"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-860 font-mono leading-relaxed text-xs"
                  />
                </div>

                {/* What We Offer / Benefits */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">What We Offer (Custom Benefits / Perks)</label>
                    <span className="text-[10px] text-slate-400 font-semibold normal-case">Optional: falls back to default 5 perks if empty</span>
                  </div>

                  {/* Add Benefit Inputs Grid */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Icon select */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Icon</label>
                        <select
                          value={benefitIcon}
                          onChange={(e) => setBenefitIcon(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-semibold"
                        >
                          <option value="globe">🌐 Globe (Remote)</option>
                          <option value="heart">❤️ Heart (Health/Wellness)</option>
                          <option value="trending">📈 Trending (Growth/Learning)</option>
                          <option value="calendar">📅 Calendar (Flexible schedule)</option>
                          <option value="users">👥 Users (Great Team)</option>
                        </select>
                      </div>

                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Offer Title</label>
                        <input
                          type="text"
                          value={benefitTitle}
                          onChange={(e) => setBenefitTitle(e.target.value)}
                          placeholder="e.g. Work from anywhere"
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Offer Description</label>
                      <input
                        type="text"
                        value={benefitDesc}
                        onChange={(e) => setBenefitDesc(e.target.value)}
                        placeholder="e.g. Fully remote team with flexibility that fits your life."
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                      />
                    </div>

                    {/* Add Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!benefitTitle.trim() || !benefitDesc.trim()) {
                            alert("Please fill in both the Title and Description for this benefit.");
                            return;
                          }
                          setCareerForm(prev => ({
                            ...prev,
                            benefits: [
                              ...prev.benefits,
                              { title: benefitTitle.trim(), description: benefitDesc.trim(), icon: benefitIcon }
                            ]
                          }));
                          setBenefitTitle('');
                          setBenefitDesc('');
                          setBenefitIcon('globe');
                        }}
                        className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                      >
                        Add Offer
                      </button>
                    </div>
                  </div>

                  {/* List of current benefits */}
                  {careerForm.benefits && careerForm.benefits.length > 0 ? (
                    <div className="space-y-2.5">
                      {careerForm.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-blue-600 font-bold text-sm">
                              {benefit.icon === 'globe' && '🌐'}
                              {benefit.icon === 'heart' && '❤️'}
                              {benefit.icon === 'trending' && '📈'}
                              {benefit.icon === 'calendar' && '📅'}
                              {benefit.icon === 'users' && '👥'}
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-800 truncate">{benefit.title}</h5>
                              <p className="text-[10px] text-slate-400 truncate leading-relaxed">{benefit.description}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCareerForm(prev => ({
                                ...prev,
                                benefits: prev.benefits.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-250/20 shadow-sm"
                            title="Remove benefit"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Default company benefits active
                    </div>
                  )}
                </div>

              </form>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCareerFormOpen(false)}
                  className="px-5 py-3 hover:bg-slate-200 rounded-xl text-slate-500 text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="career-form"
                  disabled={careerSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98]"
                >
                  {careerSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editingCareer ? 'Save Changes' : 'Publish Position'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden relative z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Edit Admin Profile</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your details, avatar, and security credentials.</p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">

                {/* Profile Picture Uploader */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 border-4 border-slate-100 shadow-lg overflow-hidden flex items-center justify-center text-white text-2xl font-black relative">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        admin?.name?.charAt(0).toUpperCase() || 'L'
                      )}
                    </div>
                    <label htmlFor="profile-avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border border-white hover:bg-blue-500 transition-colors shadow-md cursor-pointer">
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        id="profile-avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicUpload}
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upload Profile Avatar</span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Lokesh Kumawat"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-bold"
                  />
                </div>

                {/* Email Address (View only) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Registered Email (Locked)</label>
                  <input
                    type="email"
                    disabled
                    value={admin?.email || ''}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-450 font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Password (Change option) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Update Password (Optional)</label>
                  <input
                    type="password"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Enter new password to change"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>

                {/* Modal actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="px-4 py-2 hover:bg-slate-100 rounded-xl text-slate-500 text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98]"
                  >
                    {profileSubmitting && (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    Save Profile
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
