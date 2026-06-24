import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, CheckCircle2, Gift, MapPin, Trophy } from "lucide-react";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

const campaigns = [
  { id: "bonus-11", title: "Bonus 60 RON la 11 curse", reward: 60, target: 11, progress: 4, city: "București", window: "Lun 08:00 - Joi 23:59" },
  { id: "bonus-12", title: "Bonus 66 RON la 12 curse", reward: 66, target: 12, progress: 0, city: "Ilfov", window: "Vin 10:00 - Dum 23:59" }
];

export function DriverCampaignsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState<(typeof campaigns)[number] | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    setSelectedCampaign(campaigns.find((campaign) => campaign.id === id) || campaigns[0]);
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Câștigă mai mult</p>
        <h1 className="mt-1 text-2xl font-semibold">Campanii și bonusuri</h1>
        <p className="mt-1 text-sm text-muted-foreground">Urmărește progresul și condițiile pentru bonusuri demo.</p>
      </header>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Trophy className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Săptămâna curentă</p>
            <p className="text-2xl font-semibold">{formatCurrency(1840)}</p>
          </div>
        </div>
      </Card>

      <section className="grid gap-3 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Campanie</p>
                <h2 className="mt-1 text-lg font-semibold">{campaign.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                  {campaign.window}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  {campaign.city}
                </p>
              </div>
              <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold">
                <span>Curse: {campaign.progress}/{campaign.target}</span>
                <span>{Math.round((campaign.progress / campaign.target) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${(campaign.progress / campaign.target) * 100}%` }} />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                setSelectedCampaign(campaign);
                navigate(`/driver/campaigns/${campaign.id}`);
              }}
            >
              Vezi toate condițiile
            </Button>
          </Card>
        ))}
      </section>

      {selectedCampaign && (
        <MinimizableBottomSheet
          title={selectedCampaign.title}
          description="Condiții și progres campanie."
          initialState="expanded"
          dismissible
          onStateChange={(state) => {
            if (state === "closed") {
              setSelectedCampaign(null);
              navigate("/driver/campaigns");
            }
          }}
        >
          <div className="space-y-3">
            {[
              ["Reward", formatCurrency(selectedCampaign.reward)],
              ["Fereastră", selectedCampaign.window],
              ["Categorii eligibile", "Standard, Premium"],
              ["Zonă eligibilă", selectedCampaign.city],
              ["Progres", `${selectedCampaign.progress}/${selectedCampaign.target} curse`],
              ["Termeni", "Cursele anulate sau respinse nu intră în progresul demo."]
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 rounded-2xl bg-muted/60 p-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <strong className="text-right">{value}</strong>
              </div>
            ))}
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setSelectedCampaign(null);
                navigate("/driver/campaigns");
              }}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Înțeles
            </Button>
          </div>
        </MinimizableBottomSheet>
      )}
    </div>
  );
}
