import { cn } from "@/lib/utils";

function BrowserFrame({ path, children, className }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border bg-slate-50 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
        <div className="ml-2 flex h-5 min-w-0 flex-1 items-center rounded-md border border-border bg-white px-2">
          <span className="truncate text-[9px] text-slate-400">{path}</span>
        </div>
        <span className="shrink-0 rounded-full border border-violet-100 bg-violet-50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-primary">
          Concept Demo
        </span>
      </div>
      <div className="min-h-0 flex-1 bg-slate-50/80">{children}</div>
    </div>
  );
}

function Sidebar({ items, active = 0 }) {
  return (
    <aside className="flex w-10 shrink-0 flex-col items-center gap-1.5 border-r border-border bg-white py-2.5 sm:w-[3.25rem] sm:gap-2 sm:px-1.5" aria-hidden>
      <div className="mb-1 h-6 w-6 rounded-lg bg-violet-100 sm:h-7 sm:w-7" />
      {items.map((item, i) => (
        <div
          key={item}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md sm:h-7 sm:w-7",
            i === active ? "bg-violet-50 ring-1 ring-violet-100" : "bg-slate-50"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i === active ? "bg-primary" : "bg-slate-300"
            )}
          />
        </div>
      ))}
    </aside>
  );
}

function Kpi({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-border bg-white px-2 py-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-2.5 sm:py-2">
      <div className="text-[8px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold tracking-tight text-slate-800 sm:text-base">{value}</div>
      {hint ? <div className="mt-0.5 text-[8px] text-slate-400">{hint}</div> : null}
    </div>
  );
}

export function ClinicMockup({ className }) {
  const schedule = [
    { time: "09:30", type: "Consult", status: "In room" },
    { time: "10:15", type: "Follow-up", status: "Waiting" },
    { time: "11:00", type: "Review", status: "Booked" },
  ];

  return (
    <BrowserFrame path="preview / clinic-os" className={className}>
      <div className="flex h-full min-h-[220px]">
        <Sidebar items={["Home", "Visit", "Notes", "Rx", "Chat"]} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold text-violet-700">Clinic OS</div>
              <div className="text-xs font-bold text-slate-800">Today&apos;s board</div>
            </div>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[8px] font-medium text-sky-700">
              WhatsApp booking
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Kpi label="Visits" value="12" hint="Today" />
            <Kpi label="Notes" value="8" hint="Drafted" />
            <Kpi label="Follow-up" value="5" hint="Queued" />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
            <div className="rounded-lg border border-violet-100 bg-white p-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-violet-700">AI Scribe</span>
                <span className="text-[8px] text-slate-400">SOAP</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {["S", "O", "A", "P"].map((letter, i) => (
                  <div key={letter} className="flex items-center gap-1.5">
                    <span className="w-3 text-[8px] font-bold text-violet-500">{letter}</span>
                    <div
                      className="h-1.5 rounded-full bg-violet-100"
                      style={{ width: `${88 - i * 16}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-md bg-violet-50 px-2 py-1 text-[8px] font-medium text-violet-700">
                Prescription draft ready
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-2">
              <div className="text-[9px] font-semibold text-slate-600">Schedule</div>
              <div className="mt-1.5 space-y-1">
                {schedule.map((row) => (
                  <div
                    key={row.time}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1"
                  >
                    <div className="min-w-0">
                      <div className="text-[9px] font-medium text-slate-700">{row.type}</div>
                      <div className="text-[8px] text-slate-400">{row.time}</div>
                    </div>
                    <span className="text-[8px] font-medium text-primary">{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function LeadsMockup({ className }) {
  const columns = [
    {
      name: "New",
      cards: ["Website enquiry", "WhatsApp lead"],
    },
    {
      name: "Contacted",
      cards: ["Callback booked"],
    },
    {
      name: "Qualified",
      cards: ["Demo requested", "Proposal sent"],
    },
    {
      name: "Won",
      cards: ["Kickoff scheduled"],
    },
  ];

  return (
    <BrowserFrame path="preview / lead-platform" className={className}>
      <div className="flex h-full min-h-[220px]">
        <Sidebar items={["Home", "Leads", "CRM", "Tasks", "Stats"]} active={1} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold text-violet-700">Lead platform</div>
              <div className="text-xs font-bold text-slate-800">Pipeline</div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-medium text-emerald-700">
              Auto follow-up on
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Kpi label="New leads" value="36" hint="This week" />
            <Kpi label="In pipeline" value="18" hint="Active" />
            <Kpi label="Follow-ups" value="9" hint="Due today" />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-white p-2">
            <div className="grid h-full grid-cols-4 gap-1.5">
              {columns.map((col) => (
                <div key={col.name} className="min-w-0">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                      {col.name}
                    </span>
                    <span className="text-[8px] text-slate-400">{col.cards.length}</span>
                  </div>
                  <div className="space-y-1">
                    {col.cards.map((card) => (
                      <div
                        key={card}
                        className="rounded-md border border-border bg-slate-50 px-1.5 py-1.5 text-[8px] font-medium leading-tight text-slate-700"
                      >
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function BusinessMockup({ className }) {
  const rows = [
    ["SKU-104", "In stock", "842"],
    ["SKU-118", "Low", "14"],
    ["SKU-221", "On order", "60"],
  ];
  const bars = [42, 58, 36, 74, 51, 67, 80];

  return (
    <BrowserFrame path="preview / operations" className={className}>
      <div className="flex h-full min-h-[220px]">
        <Sidebar items={["Home", "Stock", "People", "Sales", "Reports"]} active={0} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold text-violet-700">Business OS</div>
              <div className="text-xs font-bold text-slate-800">Operations</div>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-medium text-slate-600">
              Sample data
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Kpi label="SKUs" value="1,248" />
            <Kpi label="Orders" value="64" />
            <Kpi label="Customers" value="312" />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-5 gap-2">
            <div className="col-span-2 rounded-lg border border-border bg-white p-2">
              <div className="text-[9px] font-semibold text-slate-600">Weekly movement</div>
              <div className="mt-2 flex h-[4.5rem] items-end gap-1">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-indigo-200"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-3 overflow-hidden rounded-lg border border-border bg-white p-2">
              <div className="text-[9px] font-semibold text-slate-600">Inventory</div>
              <div className="mt-1.5 grid grid-cols-3 gap-1 border-b border-slate-100 pb-1 text-[7px] font-semibold uppercase tracking-wide text-slate-400">
                <span>Item</span>
                <span>Status</span>
                <span>Qty</span>
              </div>
              {rows.map(([item, status, qty]) => (
                <div
                  key={item}
                  className="grid grid-cols-3 gap-1 border-b border-slate-50 py-1 text-[8px] text-slate-600 last:border-0"
                >
                  <span className="font-medium">{item}</span>
                  <span
                    className={
                      status === "Low"
                        ? "text-amber-600"
                        : status === "On order"
                          ? "text-sky-600"
                          : "text-emerald-600"
                    }
                  >
                    {status}
                  </span>
                  <span>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

const MOCKUP_MAP = {
  clinic: ClinicMockup,
  leads: LeadsMockup,
  business: BusinessMockup,
};

export function ProjectMockup({ type, className }) {
  const Comp = MOCKUP_MAP[type] || ClinicMockup;
  return <Comp className={className} />;
}
