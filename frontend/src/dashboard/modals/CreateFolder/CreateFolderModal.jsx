// src/dashboard/modals/CreateFolder/CreateFolderModal.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoldersService from '../../../services/folders.service';
import toast from 'react-hot-toast';

const COLORS = [
  '#6B7280', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16',
];

const ICONS = [
  '📁', '⚡', '🎨', '📈', '📚', '🔬', '💻', '🎵',
  '🎮', '📷', '✈️', '💰', '🛒', '📰', '🔧', '🏠',
];

export default function CreateFolderModal({ isOpen, onClose, onCreated, parentId = null }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('📁');
  const [showCustomize, setShowCustomize] = useState(false);
  const [saving, setSaving] = useState(false);

  const [screenType, setScreenType] = useState(() => {
    const width = window.innerWidth;
    if (width >= 768) return 'desktop';
    if (width >= 640) return 'tablet';
    if (width >= 430) return 'large-mobile';
    if (width >= 390) return 'medium-mobile';
    if (width >= 375) return 'small-mobile';
    return 'mini-mobile';
  });

  const inputRef = useRef(null);
  const handleSubmitRef = useRef(null);

  useEffect(() => {
    const detectScreen = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setScreenType('desktop');
      } else if (width >= 640) {
        setScreenType('tablet');
      } else if (width >= 430) {
        setScreenType('large-mobile');
      } else if (width >= 390) {
        setScreenType('medium-mobile');
      } else if (width >= 375) {
        setScreenType('small-mobile');
      } else {
        setScreenType('mini-mobile');
      }
    };

    window.addEventListener('resize', detectScreen);
    return () => window.removeEventListener('resize', detectScreen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setColor('#3B82F6');
      setIcon('📁');
      setShowCustomize(false);
      setSaving(false);
      setTimeout(() => {
        if (screenType === 'desktop' || screenType === 'tablet') {
          inputRef.current?.focus();
        }
      }, 200);
    }
  }, [isOpen, screenType]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && name.trim()) {
        e.preventDefault();
        handleSubmitRef.current?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, name]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    try {
      const result = await FoldersService.createFolder({
        name: trimmed,
        color,
        icon,
        parent_id: parentId,
      });
      if (result.success) {
        toast.success(`Folder "${trimmed}" created`);
        onCreated?.(result.data);
        onClose();
      } else {
        toast.error(result.error || 'Failed to create folder');
      }
    } finally {
      setSaving(false);
    }
  }, [name, color, icon, parentId, saving, onCreated, onClose]);

  handleSubmitRef.current = handleSubmit;

  const getModalStyles = () => {
    const isMobile = ['mini-mobile', 'small-mobile', 'medium-mobile', 'large-mobile'].includes(screenType);

    if (isMobile) {
      const pad = screenType === 'mini-mobile' ? 'p-3' : 'p-4';
      const headerPad = screenType === 'mini-mobile' ? 'px-3 py-2.5' : 'px-4 py-3';
      return {
        wrapper: 'items-end',
        modal: 'w-screen rounded-t-2xl rounded-b-none max-h-[85vh]',
        padding: pad,
        headerPadding: headerPad,
      };
    }

    return {
      wrapper: 'items-center',
      modal: 'w-full max-w-[400px] rounded-xl mx-4',
      padding: 'p-5',
      headerPadding: 'px-5 py-4',
    };
  };

  const getInputStyles = () => {
    switch (screenType) {
      case 'mini-mobile':
      case 'small-mobile':
        return { height: 'h-10', text: 'text-[14px]', label: 'text-[11px]' };
      case 'medium-mobile':
      case 'large-mobile':
        return { height: 'h-11', text: 'text-[15px]', label: 'text-[11px]' };
      default:
        return { height: 'h-11', text: 'text-[14px]', label: 'text-[12px]' };
    }
  };

  const styles = getModalStyles();
  const inputStyles = getInputStyles();
  const isMobile = ['mini-mobile', 'small-mobile', 'medium-mobile', 'large-mobile'].includes(screenType);
  const isSmallMobile = ['mini-mobile', 'small-mobile'].includes(screenType);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[200] flex justify-center bg-black/80 backdrop-blur-sm
            ${styles.wrapper}`}
          style={{
            paddingTop: isMobile ? '0' : 'max(env(safe-area-inset-top), 20px)',
            paddingBottom: isMobile ? '0' : 'env(safe-area-inset-bottom)',
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={isMobile
              ? { y: '100%', opacity: 1 }
              : { opacity: 0, scale: 0.96, y: 10 }
            }
            animate={isMobile
              ? { y: 0, opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
            }
            exit={isMobile
              ? { y: '100%', opacity: 1 }
              : { opacity: 0, scale: 0.96, y: 10 }
            }
            transition={isMobile
              ? { type: 'spring', damping: 30, stiffness: 350 }
              : { duration: 0.2 }
            }
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={`bg-[#111] shadow-2xl overflow-hidden flex flex-col
              ${isMobile ? 'border-t border-gray-800/60' : 'border-t border-x border-gray-800/60'}
              ${styles.modal}`}
            style={{
              paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : '0',
              margin: isMobile ? 0 : undefined,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isMobile && (
              <div className="flex justify-center pt-2 pb-0.5 flex-shrink-0">
                <div className="w-8 h-1 rounded-full bg-gray-700" />
              </div>
            )}

            <div className={`flex items-center justify-between border-b border-gray-800/40
              flex-shrink-0 ${styles.headerPadding}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`rounded-lg flex items-center justify-center flex-shrink-0
                    ${isMobile ? 'w-7 h-7 text-base' : 'w-8 h-8 text-lg'}`}
                  style={{
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}30`
                  }}
                >
                  {icon}
                </div>
                <div className="min-w-0">
                  <h2 className={`font-semibold text-white truncate
                    ${isMobile ? 'text-[14px]' : 'text-[15px]'}`}>
                    New Folder
                  </h2>
                  {parentId && (
                    <p className={`text-gray-500 truncate
                      ${isMobile ? 'text-[11px] mt-0' : 'text-[11px] mt-0.5'}`}>
                      Creating subfolder
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className={`text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]
                  rounded-lg transition-colors flex-shrink-0
                  ${isMobile ? 'p-2 -mr-1' : 'p-2 -mr-1'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto overscroll-contain ${styles.padding}`}>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className={isMobile ? 'mb-3.5' : 'mb-4'}>
                  <label className={`block font-medium text-gray-400 ${inputStyles.label}
                    ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                    Folder name
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Untitled folder"
                    maxLength={255}
                    className={`w-full px-3 text-white bg-gray-900/50 border border-gray-800
                      rounded-xl outline-none transition-all placeholder-gray-600
                      focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                      ${inputStyles.height} ${inputStyles.text}`}
                    autoFocus={!isMobile}
                    enterKeyHint="done"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowCustomize(!showCustomize)}
                  className={`flex items-center gap-1.5 text-gray-500 hover:text-gray-300
                    active:text-gray-200 transition-colors touch-manipulation
                    ${isMobile ? 'text-[12px] mb-3 py-0.5' : 'text-[12px] mb-1'}`}
                >
                  <motion.svg
                    className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    animate={{ rotate: showCustomize ? 90 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </motion.svg>
                  Customize
                </button>

                <AnimatePresence>
                  {showCustomize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={isMobile ? 'space-y-3.5 pt-2 pb-3' : 'space-y-4 pt-3 pb-4'}>
                        
                        <div>
                          <label className={`block font-medium text-gray-400 ${inputStyles.label}
                            ${isMobile ? 'mb-2' : 'mb-2'}`}>
                            Icon
                          </label>
                          <div className={`grid gap-1.5 ${isSmallMobile ? 'grid-cols-6' : 'grid-cols-8'}`}>
                            {ICONS.map((i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setIcon(i)}
                                className={`flex items-center justify-center rounded-lg
                                  text-lg transition-all active:scale-95
                                  ${isSmallMobile ? 'w-full aspect-square' : 'w-9 h-9'}
                                  ${icon === i
                                    ? 'bg-primary/20 ring-2 ring-primary/50 scale-105'
                                    : 'bg-gray-900/50 border border-gray-800/50 hover:bg-gray-800/50 hover:scale-105'
                                  }`}
                              >
                                {i}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={`block font-medium text-gray-400 ${inputStyles.label}
                            ${isMobile ? 'mb-2' : 'mb-2'}`}>
                            Color
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {COLORS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`flex-shrink-0 border-2 rounded-full transition-all
                                  active:scale-95
                                  ${isSmallMobile ? 'w-6 h-6' : 'w-7 h-7'}
                                  ${color === c
                                    ? 'border-white scale-110 ring-2 ring-white/20'
                                    : 'border-transparent hover:border-white/30 hover:scale-105'
                                  }`}
                                style={{ backgroundColor: c }}
                                aria-label={`Color ${c}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className={`flex items-center gap-3 rounded-xl bg-gray-900/30
                          border border-gray-800/40
                          ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
                          <div
                            className={`rounded-xl flex items-center justify-center flex-shrink-0
                              ${isMobile ? 'w-9 h-9 text-lg' : 'w-10 h-10 text-xl'}`}
                            style={{
                              backgroundColor: `${color}15`,
                              border: `1px solid ${color}30`
                            }}
                          >
                            {icon}
                          </div>
                          <span className={`font-medium text-white truncate
                            ${isMobile ? 'text-[13px]' : 'text-[14px]'}`}>
                            {name.trim() || 'Untitled folder'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            <div
              className={`flex-shrink-0 border-t border-gray-800/40
                ${isMobile ? 'px-4 pt-3 pb-1' : styles.padding}`}
              style={{
                paddingBottom: isMobile
                  ? 'max(env(safe-area-inset-bottom), 12px)'
                  : undefined,
              }}
            >
              {!isMobile && (
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-600 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800
                      border border-gray-700/50 rounded">⌘</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800
                      border border-gray-700/50 rounded">↵</kbd>
                    <span className="ml-1">to create</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-[13px] font-medium text-gray-400
                        hover:text-gray-200 hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!name.trim() || saving}
                      className="px-5 py-2 text-[13px] font-medium text-white bg-primary
                        hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed
                        rounded-lg transition-all flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white
                            rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isMobile && (
                <div className="space-y-2">
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || saving}
                    className={`w-full font-semibold text-white bg-primary
                      hover:bg-primary-light active:brightness-90
                      disabled:opacity-50 disabled:cursor-not-allowed
                      rounded-xl transition-all flex items-center justify-center gap-2
                      ${isSmallMobile ? 'py-2.5 text-[13px]' : 'py-3 text-[14px]'}`}
                  >
                    {saving ? (
                      <>
                        <div className={`border-2 border-white/30 border-t-white rounded-full animate-spin
                          ${isSmallMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                        Creating...
                      </>
                    ) : (
                      'Create Folder'
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className={`w-full font-medium text-gray-400 hover:text-gray-200
                      active:bg-white/[0.05] rounded-xl transition-colors
                      ${isSmallMobile ? 'py-2 text-[12px]' : 'py-2.5 text-[13px]'}`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}