import { categoryIcons } from "../../constants/categoryIcons";

export default function CategoryCard({ category, selectedCategory, onSelect }) {
    
   const { icon: Icon, color } = categoryIcons[category];
    const isSelected = selectedCategory === category;

    return (
        <button
            type="button"
            className={`p-6 rounded-2xl bg-base-100 shadow-sm hover:shadow-md transition flex flex-col items-center gap-3 ${isSelected ? "ring-2 ring-primary" : ""
                }`}
            onClick={() => onSelect(category)}
        >

            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
              <Icon size={28} className={color} />
            </div>
             <span className="font-semibold text-lg">
                {category}
            </span>

        </button>

    )
}