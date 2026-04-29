import logoSumos from "@/assets/logo-sumos.png";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-sumos-gray">
      <div className="container flex items-center justify-between py-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <img src={logoSumos} alt="SuMoS" className="h-10 w-auto" />
      </div>
      <div className="h-1 bg-primary" />
    </div>
  );
}