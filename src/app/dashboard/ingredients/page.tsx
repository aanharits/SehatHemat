import prisma from "@/lib/prisma"

function formatRp(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

export default async function IngredientsPage() {
  let ingredients: {
    id: bigint
    name: string | null
    category: string | null
    price: bigint | null
    protein: number | null
    calories: bigint | null
    unit: string | null
  }[] = []

  try {
    ingredients = await prisma.ingridients.findMany({
      orderBy: { category: "asc" },
    })
  } catch {
    // handle silently
  }

  const grouped = ingredients.reduce<Record<string, typeof ingredients>>(
    (acc, item) => {
      const cat = item.category || "Uncategorized"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {}
  )

  const categories = Object.keys(grouped).sort()

  return (
    <div className="space-y-8">


      {categories.length === 0 ? (
        <p className="text-[var(--text-tertiary)] text-center py-24 text-[15px]">
          No ingredients found in database.
        </p>
      ) : (
        <div className="space-y-8">
          {categories.map((category, catIdx) => (
            <div
              key={category}
              className={`animate-fade-in-up ${catIdx < 7 ? `stagger-${catIdx + 1}` : ""}`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--accent-400)] to-[var(--accent-600)]" />
                <h2 className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight">
                  {category}
                </h2>
                <span className="text-[12px] font-medium text-[var(--text-tertiary)]">
                  {grouped[category].length} items
                </span>
              </div>

              {/* Table */}
              <div className="glass-card-static overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Calories</th>
                      <th className="text-right">Protein</th>
                      <th className="text-right">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[category].map((item) => (
                      <tr key={Number(item.id)}>
                        <td className="text-left font-medium text-[var(--text-primary)]">
                          {item.name}
                        </td>
                        <td className="text-right font-bold text-[var(--accent-700)] tabular-nums">
                          Rp {formatRp(Number(item.price || 0))}
                        </td>
                        <td className="text-right text-[var(--text-secondary)] tabular-nums">
                          {Number(item.calories || 0)} kcal
                        </td>
                        <td className="text-right text-[var(--text-secondary)] tabular-nums">
                          {item.protein || 0}g
                        </td>
                        <td className="text-right text-[var(--text-tertiary)]">
                          {item.unit || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
