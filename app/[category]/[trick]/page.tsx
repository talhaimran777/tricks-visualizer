import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TrickPlayer } from "@/components/TrickPlayer";
import { getCategory } from "@/lib/roadmap";
import { getTrick, tricksByCategory } from "@/lib/tricks";

export function generateStaticParams() {
  return Object.entries(tricksByCategory).flatMap(([category, tricks]) =>
    tricks.filter((t) => t.viz).map((t) => ({ category, trick: t.id })),
  );
}

export async function generateMetadata(props: PageProps<"/[category]/[trick]">) {
  const { category, trick } = await props.params;
  return { title: `${getTrick(category, trick)?.title ?? "Trick"} · Tricks Visualizer` };
}

export default function TrickPage(props: PageProps<"/[category]/[trick]">) {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <TrickContent params={props.params} />
    </Suspense>
  );
}

async function TrickContent({ params }: Pick<PageProps<"/[category]/[trick]">, "params">) {
  const { category, trick: trickId } = await params;
  const cat = getCategory(category);
  const trick = getTrick(category, trickId);
  if (!cat || !trick?.viz) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/${cat.id}`} className="text-sm text-zinc-400 hover:text-zinc-200">
        ← {cat.title}
      </Link>
      <h1 className="text-2xl font-semibold">{trick.title}</h1>
      <TrickPlayer categoryId={cat.id} trickId={trick.id} />
      {trick.problems.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <span className="text-zinc-500">Practice:</span>
          {trick.problems.map((p) => (
            <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-indigo-100 hover:underline">
              {p.name} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
