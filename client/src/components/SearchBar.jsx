import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({search, setSearch}){
    return (
        <div className="bg-[var(--card)] backdrop-blur-md border border-[var(--border)] px-4 py-3 rounded-2xl transition-all duration-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20">
            <div className="group flex items-center gap-3">
                <FaSearch className="text-[var(--muted)] group-focus-within:text-blue-400 transition" />
                <input
                    type="text"
                    placeholder="Search links..."
                    value={search}
                    onChange={(e)=> setSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[var(--text)] placeholder-gray-500"
                />
                {search && (
                    <button
                        onClick={()=>setSearch("")}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-[var(--muted)] hover:text-white transition"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
}