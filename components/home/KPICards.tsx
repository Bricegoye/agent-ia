import {
  Search,
  Activity,
  BrainCircuit,
  TriangleAlert,
} from "lucide-react";

export default function KPICards() {
  const cards = [
    {
      title: "Tools Detected",
      value: "8",
      icon: Search,
      color: "text-sky-600",
      bg: "bg-sky-100",
    },
    {
      title: "Health Score",
      value: "91%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "AI Insights",
      value: "14",
      icon: BrainCircuit,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      title: "Warnings",
      value: "2",
      icon: TriangleAlert,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}
            >
              <Icon className={`h-6 w-6 ${card.color}`} />
            </div>

            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {card.value}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-500">
              {card.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}