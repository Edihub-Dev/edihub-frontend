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
import { getApiUrl } from '../utils/api';

import pexels1 from '../assets/projects/pexels-1.jpg';
import pexels2 from '../assets/projects/pexels-2.jpg';
import pexels3 from '../assets/projects/pexels-3.jpg';
import pexels4 from '../assets/projects/pexels-4.jpg';
import pexels5 from '../assets/projects/pexels-5.jpg';

import arrowsImg from '../assets/projects/arrows.png';
import chantalleImg from '../assets/projects/chantalle.png';
import papyrusImg from '../assets/projects/papyrus.png';
import londonMuseumImg from '../assets/projects/london-museum.png';
import bullseyeImg from '../assets/projects/bullseye.png';
import interferenceImg from '../assets/projects/interference.png';

const customImageMap: Record<string, string> = {
  "arrows": arrowsImg,
  "chantalle": chantalleImg,
  "papyrus": papyrusImg,
  "london-museum": londonMuseumImg,
  "bullseye": bullseyeImg,
  "interference": interferenceImg,
};

const imageMap: Record<string, string> = {
  "pexels-1.jpg": pexels1,
  "pexels-2.jpg": pexels2,
  "pexels-3.jpg": pexels3,
  "pexels-4.jpg": pexels4,
  "pexels-5.jpg": pexels5,
};

const getProjectImage = (imageName: string) => {
  if (!imageName) return pexels1;
  if (imageName.startsWith('data:image/') || imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  return imageMap[imageName] || pexels1;
};

const imageOptions = [
  { value: 'pexels-1.jpg', label: 'Dark Tech Sphere (Pexels 1)' },
  { value: 'pexels-2.jpg', label: 'Minimalist Workspace (Pexels 2)' },
  { value: 'pexels-3.jpg', label: 'Creative Layout (Pexels 3)' },
  { value: 'pexels-4.jpg', label: 'Modern Architectural Detail (Pexels 4)' },
  { value: 'pexels-5.jpg', label: 'Premium Branding Texture (Pexels 5)' }
];

export function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'services' | 'testimonials' | 'team' | 'settings' | 'requests' | 'blogs'>('overview');
  
  // Data lists
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    testimonials: 0,
    blogs: 0
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
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
    image: 'pexels-1.jpg'
  });

  const [imageSource, setImageSource] = useState<'template' | 'upload' | 'url'>('template');

  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: 'web',
  });

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
      const [projectsRes, servicesRes, testimonialsRes, blogsRes] = await Promise.all([
        fetch(`${apiUrl}/projects`),
        fetch(`${apiUrl}/services`),
        fetch(`${apiUrl}/testimonials`),
        fetch(`${apiUrl}/blogs`)
      ]);

      const projectsData = await projectsRes.json();
      const servicesData = await servicesRes.json();
      const testimonialsData = await testimonialsRes.json();
      const blogsData = await blogsRes.json();

      setProjects(projectsData);
      setServices(servicesData);
      setTestimonials(testimonialsData);
      setBlogs(blogsData);
      
      setStats({
        projects: projectsData.length,
        services: servicesData.length,
        testimonials: testimonialsData.length,
        blogs: blogsData.length
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
      image: 'pexels-1.jpg'
    });
    setEditingProject(null);
    setImageSource('template');
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
      image: project.image || 'pexels-1.jpg'
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
    setServiceForm({ title: '', description: '', icon: 'web' });
    setEditingService(null);
    setErrorMsg('');
    setIsServiceFormOpen(true);
  };

  const handleEditServiceClick = (srv: any) => {
    setServiceForm({
      title: srv.title || '',
      description: srv.description || '',
      icon: srv.icon || 'web',
    });
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
            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
              activeSection === 'overview' 
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
            { id: 'team', name: 'Team', icon: <FiUsers /> },
            { id: 'requests', name: 'Access Requests', icon: <FiUserCheck />, badge: accessRequests.filter(r => r.status === 'pending').length },
            { id: 'settings', name: 'Settings', icon: <FiSettings /> },
          ].map(item => (
            <div 
              key={item.id} 
              onClick={() => setActiveSection(item.id as any)}
              className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                activeSection === item.id 
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Portfolio Projects', value: stats.projects, trend: 'Dynamic cloud storage', color: 'from-blue-600 to-blue-400' },
                  { label: 'Offered Services', value: stats.services, trend: 'Managed frontend items', color: 'from-indigo-600 to-indigo-400' },
                  { label: 'Testimonials / Feedback', value: stats.testimonials, trend: 'Verified customer reviews', color: 'from-violet-600 to-violet-400' },
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-6 gap-4">
                  {[
                    { title: 'Project Portfolio', desc: 'Create, update, year, client and services', action: 'projects', count: stats.projects, icon: <FiBox className="w-6 h-6 text-blue-500" /> },
                    { title: 'Core Services', desc: 'Manage strategic agency operations', action: 'services', count: stats.services, icon: <FiLayers className="w-6 h-6 text-indigo-500" /> },
                    { title: 'Testimonials', desc: 'Publish verified customer statements', action: 'testimonials', count: stats.testimonials, icon: <FiMessageSquare className="w-6 h-6 text-violet-500" /> },
                    { title: 'Articles & Blogs', desc: 'Insights and thoughts publication', action: 'blogs', count: stats.blogs, icon: <FiFolder className="w-6 h-6 text-amber-500" /> },
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
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Testimonials</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage validated customer quotes, reviews, and client ratings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-650 italic leading-relaxed">
                        "{t.text || t.quote || t.content}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {(t.author || t.name || 'C').charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{t.author || t.name}</h4>
                        <p className="text-xs text-slate-400">{t.company || t.role || 'Client'}</p>
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
          )}

          {/* BLOGS VIEW */}
          {activeSection === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Articles & Blogs</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Publish articles, updates, and thoughts. Syncs instantly with the live frontend.</p>
                </div>
                
                <button
                  onClick={() => {
                    const title = window.prompt("Enter Blog Title:");
                    if (!title) return;
                    const category = window.prompt("Enter Category (Design, Development, Strategy):", "Design");
                    if (!category) return;
                    const author = window.prompt("Enter Author Name:", admin?.name || "Lokesh Kumawat");
                    if (!author) return;
                    const excerpt = window.prompt("Enter Short Excerpt:");
                    if (!excerpt) return;
                    const content = window.prompt("Enter Content paragraphs:");
                    if (!content) return;
                    
                    fetch(`${apiUrl}/blogs`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, category, author, excerpt, content })
                    })
                    .then(res => {
                      if (res.ok) {
                        showNotification('success', 'Blog post published successfully!');
                        fetchAllData();
                      } else {
                        showNotification('error', 'Failed to publish blog.');
                      }
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FiPlus className="w-4 h-4 stroke-[3]" />
                  <span>Publish New Post</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogs.map((b, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{b.category}</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">{b.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{b.date} • {b.readTime}</p>
                        <p className="text-sm text-slate-500 line-clamp-2">{b.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-150 pt-4">
                        <span className="text-xs font-bold text-slate-400">By {b.author}</span>
                        <button
                          onClick={() => {
                            if (!window.confirm("Are you sure you want to delete this blog post?")) return;
                            fetch(`${apiUrl}/blogs/${b.slug}`, { method: 'DELETE' })
                              .then(res => {
                                if (res.ok) {
                                  showNotification('success', 'Blog post deleted successfully!');
                                  fetchAllData();
                                } else {
                                  showNotification('error', 'Failed to delete blog.');
                                }
                              });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Post"
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
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                reqItem.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : reqItem.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  reqItem.status === 'pending'
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
                        setProjectForm(prev => ({ ...prev, image: 'pexels-1.jpg' }));
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
                      value={projectForm.image.startsWith('data:image/') || projectForm.image.startsWith('http') ? 'pexels-1.jpg' : projectForm.image}
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
                      <img
                        src={
                          editingProject && customImageMap[editingProject.slug] && projectForm.image === editingProject.image
                            ? customImageMap[editingProject.slug]
                            : getProjectImage(projectForm.image)
                        }
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                        No image selected yet
                      </div>
                    )}
                    {projectForm.image && (
                      <div className="absolute inset-0 bg-black/10 flex items-end p-3 pointer-events-none">
                        <span className="text-[10px] font-bold text-white bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur">
                          Live Preview Selected
                        </span>
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Card Icon</label>
                  <select
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
                  >
                    {serviceIconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
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
