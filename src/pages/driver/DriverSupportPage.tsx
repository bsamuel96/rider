import { useEffect, useState } from "react";
import { BookOpen, LifeBuoy, MessageCircle, Send } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DriverSupportCaseList } from "@/components/driver/support/DriverSupportCaseList";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

type SupportTab = "open" | "closed";

export function DriverSupportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { caseId } = useParams();
  const { toast } = useToast();
  const [tab, setTab] = useState<SupportTab>("open");
  const [messageOpen, setMessageOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.endsWith("/messages")) {
      setMessageOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Ajutor</p>
        <h1 className="mt-1 text-2xl font-semibold">Asistență șoferi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cazuri, mesaje și ghiduri utile pentru ture.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <ActionCard icon={LifeBuoy} title="Obține ajutor cu o cursă" onClick={() => navigate("/driver/rides")} />
        <ActionCard icon={MessageCircle} title="Trimite-ne un mesaj" onClick={() => navigate("/driver/support/messages")} />
        <ActionCard icon={BookOpen} title="Răsfoiește articolele utile" onClick={() => navigate("/driver/support/guides")} />
      </section>

      <div className="grid grid-cols-2 rounded-2xl border border-border/60 bg-muted p-1">
        {(["open", "closed"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "min-h-10 rounded-xl text-sm font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tab === item && "bg-background text-foreground shadow-sm"
            )}
          >
            {item === "open" ? "Deschise" : "Închise"}
          </button>
        ))}
      </div>

      <DriverSupportCaseList status={tab} />

      {caseId && (
        <MinimizableBottomSheet
          title={`Caz suport ${caseId}`}
          description="Detaliu demo pentru conversația cu suportul."
          initialState="half"
          dismissible
          onStateChange={(state) => state === "closed" && navigate("/driver/support/cases")}
        >
          <div className="space-y-3">
            <div className="rounded-2xl bg-muted/60 p-3">
              <p className="text-sm font-semibold">Plată cash neconfirmată</p>
              <p className="mt-1 text-sm text-muted-foreground">Echipa verifică istoricul cursei și confirmarea cash.</p>
            </div>
            <Button type="button" className="w-full" onClick={() => toast({ title: "Răspuns trimis", description: "Mesajul a fost adăugat în demo.", tone: "success" })}>
              Trimite răspuns demo
            </Button>
          </div>
        </MinimizableBottomSheet>
      )}

      {messageOpen && (
        <MinimizableBottomSheet
          title="Trimite mesaj"
          description="Scrie către echipa de suport."
          initialState="half"
          dismissible
          onStateChange={(state) => {
            if (state === "closed") {
              setMessageOpen(false);
              navigate("/driver/support");
            }
          }}
        >
          <div className="space-y-3">
            <Textarea placeholder="Descrie problema..." className="min-h-28" />
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setMessageOpen(false);
                navigate("/driver/support");
                toast({ title: "Mesaj trimis", description: "Suportul va răspunde în conversația demo.", tone: "success" });
              }}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Trimite
            </Button>
          </div>
        </MinimizableBottomSheet>
      )}
    </div>
  );
}

function ActionCard({ icon: Icon, title, onClick }: { icon: typeof LifeBuoy; title: string; onClick: () => void }) {
  return (
    <Card className="p-4">
      <button type="button" onClick={onClick} className="flex min-h-20 w-full flex-col items-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="mt-3 text-sm font-semibold">{title}</span>
      </button>
    </Card>
  );
}
