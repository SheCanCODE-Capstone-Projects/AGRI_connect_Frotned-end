export default function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 ${className}`}>
            {children}
        </div>
    );
}