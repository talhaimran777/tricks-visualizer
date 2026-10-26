import { Roadmap } from "@/components/Roadmap";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Roadmap</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Work top-down. Each topic has a handful of tricks that unlock most of its problems — pick one to see them.
        </p>
      </div>
      <Roadmap />
    </div>
  );
}
