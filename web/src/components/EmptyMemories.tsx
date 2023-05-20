import Link from "next/link";

export const EmptyMemories = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[360px] text-center leading-relaxed">
        You haven&apos;t registered any memories yet, start{" "}
        <Link href="/memories/new" className="underline hover:text-gray-50">
          creating now
        </Link>
        !
      </p>
    </div>
  );
};
