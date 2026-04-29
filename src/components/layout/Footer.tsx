import logoFull from "@/assets/logo-full.png";
import euFlag from "@/assets/eu-flag.jpg";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3 items-center">
          {/* Project Coordinator */}
          <div>
            <h4 className="mb-3 text-base font-bold text-primary">Project Coordinator</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Assoc. Prof. Katarina Pažur Aničić, Ph. D.
              </p>
              <p className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /></svg>
                Faculty of Organization and Informatics, University of Zagreb
              </p>
              <p className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                sumos@foi.unizg.hr
              </p>
            </div>
          </div>

          {/* SuMoS Logo */}
          <div className="flex items-center justify-center">
            <img src={logoFull} alt="SuMoS - Strengthening the ecosystem for sustainable student mobility" className="h-24 w-auto" />
          </div>

          {/* EU Funding */}
          <div className="flex items-center justify-end gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-primary leading-snug">Co-funded by the</p>
              <p className="text-sm font-medium text-primary leading-snug">Erasmus+ Programme</p>
              <p className="text-sm font-medium text-primary leading-snug">of the European Union</p>
            </div>
            <img src={euFlag} alt="European Union flag" className="h-10 w-auto" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-sumos-gray py-3">
        <div className="container text-center text-[11px] text-muted-foreground leading-relaxed">
          The sole responsibility for the content of this website lies with the authors. It does not necessarily reflect the opinion of the European Union.
          <br />
          Copyright © {new Date().getFullYear()} FOI Varaždin. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
