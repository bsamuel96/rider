export type RoadsideSafetyMode = "roadside" | "tow";

export const roadsideSafetyInstructions: Record<RoadsideSafetyMode, { title: string; items: string[] }> = {
  roadside: {
    title: "Înainte să ajungă ajutorul",
    items: [
      "Pornește luminile de avarie.",
      "Îmbracă vesta reflectorizantă înainte să cobori, dacă o ai la îndemână.",
      "Ieși din zona de trafic și stai într-un loc sigur.",
      "Dacă este sigur, amplasează triunghiul reflectorizant în spatele mașinii, la distanța recomandată de regulile locale.",
      "Nu sta între mașină și traficul din spate.",
      "Dacă ești pe autostradă sau drum rapid, treci în spatele parapetului dacă poți face asta în siguranță.",
      "Dacă vine poliția sau un echipaj de intervenție, spune că ajutorul este deja pe drum.",
      "Ține telefonul aproape. Operatorul te poate contacta pentru detalii.",
      "Dacă situația devine periculoasă, sună imediat la 112."
    ]
  },
  tow: {
    title: "Până ajunge platforma",
    items: [
      "Nu rămâne în mașină dacă ești într-o zonă expusă traficului.",
      "Pornește avariile.",
      "Stai într-un loc sigur până ajunge platforma.",
      "Pregătește actele vehiculului dacă sunt necesare.",
      "Dacă este sigur și permis local, amplasează triunghiul la aproximativ 50 de pași în spatele mașinii.",
      "Dacă situația este periculoasă, sună la 112."
    ]
  }
};
