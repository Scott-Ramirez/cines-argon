import React, { useState, useEffect } from 'react';
import { User } from './core/types';
import { authService } from './services/authService';
import { Navbar, PublicSection } from './components/layout/Navbar';
import { StaffNavbar, StaffTab } from './components/layout/StaffNavbar';
import { LoginModal } from './components/auth/LoginModal';
import { BillboardView } from './views/BillboardView';
import { PosView } from './views/PosView';
import { ValidatorView } from './views/ValidatorView';
import { AdminView } from './views/AdminView';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [publicSection, setPublicSection] = useState<PublicSection>('billboard');
  const [staffTab, setStaffTab] = useState<StaffTab>('pos');

  // Load auth state on init
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      if (user.role === 'PORTER') setStaffTab('validator');
      else if (user.role === 'CASHIER') setStaffTab('pos');
      else setStaffTab('pos');
    }

    const handleAuthUpdate = (e: CustomEvent<User | null>) => {
      const updatedUser = e.detail;
      setCurrentUser(updatedUser);
      if (updatedUser) {
        if (updatedUser.role === 'PORTER') setStaffTab('validator');
        else if (updatedUser.role === 'CASHIER') setStaffTab('pos');
        else setStaffTab('pos');
      }
    };

    window.addEventListener('argon_auth_update', handleAuthUpdate as EventListener);
    return () => window.removeEventListener('argon_auth_update', handleAuthUpdate as EventListener);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setPublicSection('billboard');
  };

  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      if (user.role === 'PORTER') setStaffTab('validator');
      else if (user.role === 'CASHIER') setStaffTab('pos');
      else setStaffTab('pos');
    }
  };

  const isViewingPublicPortal = !currentUser || staffTab === 'public_preview';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. PUBLIC PORTAL NAVBAR (for general clients/lobby) */}
      {isViewingPublicPortal && (
        <Navbar
          activeSection={publicSection}
          onSectionChange={setPublicSection}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* 2. INTRANET STAFF NAVBAR (for logged-in employees) */}
      {currentUser && !isViewingPublicPortal && (
        <StaffNavbar
          currentUser={currentUser}
          activeStaffTab={staffTab}
          onStaffTabChange={setStaffTab}
          onLogout={handleLogout}
          onViewPublic={() => setStaffTab('public_preview')}
        />
      )}

      {/* Floating back button when logged in and previewing public billboard */}
      {currentUser && isViewingPublicPortal && (
        <div className="fixed bottom-6 right-6 z-40 no-print animate-bounce">
          <button
            onClick={() => {
              if (currentUser.role === 'PORTER') setStaffTab('validator');
              else if (currentUser.role === 'CASHIER') setStaffTab('pos');
              else setStaffTab('pos');
            }}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-2xl shadow-amber-500/40 flex items-center gap-2 border-2 border-slate-950 transition-all transform hover:scale-105"
          >
            <span>VOLVER A MI PANEL ({currentUser.role})</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main>
        {/* Public Portal View */}
        {isViewingPublicPortal && (
          <BillboardView
            activeSection={publicSection}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* Protected Staff Modules */}
        {!isViewingPublicPortal && currentUser && (
          <>
            {staffTab === 'pos' && <PosView />}
            {staffTab === 'validator' && <ValidatorView />}
            {staffTab === 'admin' && currentUser.role === 'ADMIN' && <AdminView />}
          </>
        )}
      </main>

      {/* Staff Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
