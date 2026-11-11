type Props = {
  title: string;
  intro: string;
  phase: string;
};

/** Página en construcción: deja explícito qué fase la implementa, sin simular funcionalidad. */
export function PlaceholderPage({ title, intro, phase }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zf-coral">{title}</h1>
      <p className="mt-4 text-lg text-zf-navy">{intro}</p>
      <p
        role="status"
        className="mt-8 rounded-lg border border-zf-border bg-zf-surface px-4 py-3 text-zf-muted"
      >
        Sección en construcción · se implementa en {phase}.
      </p>
    </section>
  );
}
