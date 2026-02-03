import { categories } from "@/lib/categories";
import { mockPrompts } from "@/lib/data";

export default function Stats() {
  const totalPrompts = mockPrompts.length;
  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + cat.subcategories.length,
    0,
  );

  const stats = [
    { label: "提示词总数", value: "10,000+", suffix: "" },
    { label: "职业分类", value: totalCategories.toString(), suffix: "+" },
    { label: "细分场景", value: totalSubcategories.toString(), suffix: "+" },
    { label: "活跃用户", value: "50,000", suffix: "+" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {stat.value}
                <span className="text-primary-200">{stat.suffix}</span>
              </div>
              <div className="text-primary-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
