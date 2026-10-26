import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TrickList } from "@/components/TrickList";
import { categories, getCategory } from "@/lib/roadmap";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata(props: PageProps<"/[category]">) {
  const { category } = await props.params;
  return { title: `${getCategory(category)?.title ?? "Topic"} · Tricks Visualizer` };
}

export default function CategoryPage(props: PageProps<"/[category]">) {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <Category params={props.params} />
    </Suspense>
  );
}

async function Category({ params }: Pick<PageProps<"/[category]">, "params">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← Roadmap
      </Link>
      <h1 className="text-2xl font-semibold">{cat.title}</h1>
      <p className="text-sm text-zinc-400">Learn these in order. Tick a trick once you can explain it without looking.</p>
      <TrickList categoryId={cat.id} />
    </div>
  );
}
