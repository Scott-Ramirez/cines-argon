import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar, PublicSection } from './components/layout/Navbar';
import { BillboardView } from './views/BillboardView';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

export function App() {
  const [publicSection, setPublicSection] = useState<PublicSection>('billboard');

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-amber-500 selection:text-black relative">
      
      {/* Public Client Navigation Bar */}
      <Navbar
        activeSection={publicSection}
        onSectionChange={setPublicSection}
      />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsAppButton />

      {/* Public Billboard & Experiences Main View */}
      <main>
        <BillboardView activeSection={publicSection} />
      </main>

      {/* Vercel Analytics */}
      <Analytics />

    </div>
  );
}

export default App;
