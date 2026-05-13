import {
  dashboardPlaceholderCards,
  dashboardRoute,
} from "@/modules/dashboard/dashboard-shell.config";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">{dashboardRoute}</p>
        <h2 className="mt-2 text-3xl font-semibold">Protected dashboard shell</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Task 6 chỉ dựng shell được bảo vệ và các placeholder an toàn. Khu vực
          này không hiển thị dữ liệu skincare, routine, journal, product,
          ingredient hoặc AI giả.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardPlaceholderCards.map((card) => (
          <Card className="border-stone-200 bg-white" key={card.label}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{card.label}</CardTitle>
                <Badge variant="outline">{card.scopeText}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-stone-600">
                {card.connectionText}.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
