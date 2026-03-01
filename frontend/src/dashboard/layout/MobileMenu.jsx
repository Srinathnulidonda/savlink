// src/dashboard/layout/MobileMenu.jsx
import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../auth/services/auth.service';
import logo from '../../assets/s-avlink.png';

export default function MobileMenu({
  isOpen, onClose, stats, activeView, onViewChange,
  folders, onTogglePin, onToggleStar, onAddLink, onCreateFolder,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFolders, setShowFolders] = useState(true);

  const handleLogout = useCallback(async () => {
    onClose();
    await AuthService.logout();
    navigate('/');
  }, [onClose, navigate]);

  const handleNavClick = useCallback((path) => {
    navigate(path);
    onClose();
  }, [navigate, onClose]);

  const isActiveRoute = useCallback((path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  }, [location.pathname]);

  const mainNavItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/dashboard/home',
      icon: <HomeIcon />,
      count: null,
    },
    {
      id: 'starred',
      label: 'Starred',
      path: '/dashboard/links/starred',
      icon: <StarIcon />,
      count: stats?.starred || 0,
    },
    {
      id: 'recent',
      label: 'Recent',
      path: '/dashboard/links/recent',
      icon: <ClockIcon />,
      count: stats?.recent || 0,
    },
    {
      id: 'archive',
      label: 'Archive',
      path: '/dashboard/links/archive',
      icon: <ArchiveIcon />,
      count: stats?.archive || 0,
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 z-50 h-full w-[280px] bg-[#0a0a0a]
                   border-r border-gray-800/60 md:hidden overflow-hidden flex flex-col"
      >
       <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Savlink" className="h-10 w-auto object-contain" />
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-400 hover:bg-white/[0.05]
                         rounded-lg transition-colors active:scale-95"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-3 py-2">
          <nav className="space-y-0.5 mb-4">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                count={item.count}
                isActive={isActiveRoute(item.path)}
                onClick={() => handleNavClick(item.path)}
              />
            ))}
          </nav>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-800/60 to-transparent my-3" />

          <div className="mb-4">
            <button
              onClick={() => setShowFolders(!showFolders)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                         text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]
                         transition-colors active:scale-[0.98] touch-manipulation"
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                </svg>
                <span className="text-[13px] font-medium">Folders</span>
                <span className="text-[11px] text-gray-700">({folders?.length || 0})</span>
              </div>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ rotate: showFolders ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {showFolders && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {folders && folders.length > 0 ? (
                    <div className="mt-1 space-y-0.5 pl-2">
                      {folders.slice(0, 8).map((folder) => (
                        <FolderItem
                          key={folder.id}
                          folder={folder}
                          isActive={location.pathname.includes(`/myfiles/${folder.slug}`)}
                          onClick={() => handleNavClick(`/dashboard/myfiles/${folder.slug}`)}
                        />
                      ))}
                      {folders.length > 8 && (
                        <button
                          onClick={() => handleNavClick('/dashboard/myfiles')}
                          className="w-full px-3 py-2 text-left text-[12px] text-gray-500
                                     hover:text-gray-300 hover:bg-white/[0.03] rounded-lg
                                     transition-colors"
                        >
                          View all {folders.length} folders →
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 px-3 py-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gray-900/50 
                                      flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                        </svg>
                      </div>
                      <p className="text-[12px] text-gray-600 mb-2">No folders yet</p>
                      <button
                        onClick={() => { onClose(); onCreateFolder?.(); }}
                        className="text-[12px] text-primary hover:text-primary-light font-medium"
                      >
                        Create your first folder
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-800/40">
          <div className="p-3 space-y-0.5">
            <FooterButton
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => handleNavClick('/dashboard/settings')}
            />
            <FooterButton
              icon={<LogoutIcon />}
              label="Sign out"
              onClick={handleLogout}
              danger
            />
          </div>

          <div className="px-4 py-3 bg-gradient-to-b from-transparent to-black/20">
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-700">
              <span>Terms</span>
              <span>·</span>
              <span>Privacy</span>
              <span>·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function NavItem({ icon, label, count, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                 text-[13px] font-medium transition-all active:scale-[0.98]
                 touch-manipulation group
                 ${isActive
          ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
        }`}
    >
      <div className={`w-[18px] h-[18px] flex-shrink-0 transition-transform
                      ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      <span className="flex-1 text-left truncate">{label}</span>
      {count != null && count > 0 && (
        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md
                         ${isActive
            ? 'text-primary bg-primary/10'
            : 'text-gray-600 bg-gray-800/50'
          }`}>
          {count > 999 ? '999+' : count}
        </span>
      )}
    </button>
  );
}

function FolderItem({ folder, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
                 text-[13px] font-medium transition-all active:scale-[0.98]
                 touch-manipulation
                 ${isActive
          ? 'bg-primary/10 text-primary'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
        }`}
    >
      <span className="text-base flex-shrink-0">{folder.emoji || folder.icon || '📁'}</span>
      <span className="flex-1 text-left truncate">{folder.name}</span>
      {folder.link_count > 0 && (
        <span className="text-[10px] text-gray-600 font-normal">
          {folder.link_count}
        </span>
      )}
    </button>
  );
}

function FooterButton({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                 text-[13px] font-medium transition-all active:scale-[0.98]
                 touch-manipulation
                 ${danger
          ? 'text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06]'
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
        }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function HomeIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}