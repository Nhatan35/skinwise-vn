import Link from "next/link";

import type { TodayJournalPromptState } from "@/modules/routine-logs/today-journal-prompt";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type TodayJournalPromptCardProps = {
  journalHref: string;
  state: TodayJournalPromptState;
};

const promptCopy = {
  journal_done: {
    title: "Bạn đã ghi nhật ký da hôm nay",
    description:
      "Bạn đã có dữ liệu routine và nhật ký cho hôm nay. Hãy tiếp tục theo dõi đều đặn để dễ xem lại thói quen và cảm nhận của da theo thời gian.",
    cta: "Đi đến Journal",
    secondary:
      "Nhật ký giúp bạn quan sát thói quen cá nhân, không thay thế tư vấn chuyên môn.",
  },
  journal_unknown: {
    title: "Bạn đã ghi nhận routine hôm nay",
    description:
      "Bạn có thể viết nhật ký da hôm nay để ghi lại cảm nhận của da, sản phẩm đã dùng hoặc thay đổi nổi bật.",
    cta: "Đi đến Journal",
    secondary:
      "Không cần kết luận quá sớm sau một vài lần dùng. Nếu cảm giác bất thường kéo dài, hãy tìm tư vấn chuyên môn.",
  },
  write_journal: {
    title: "Bạn đã ghi nhận routine hôm nay",
    description:
      "Tiếp theo, hãy viết nhật ký da hôm nay để ghi lại cảm nhận của da, thói quen liên quan hoặc thay đổi bạn tự quan sát.",
    cta: "Viết nhật ký da hôm nay",
    secondary:
      "Nhật ký giúp bạn theo dõi cá nhân, không thay thế tư vấn chuyên môn.",
  },
} as const satisfies Record<
  Exclude<TodayJournalPromptState, "hidden">,
  {
    cta: string;
    description: string;
    secondary: string;
    title: string;
  }
>;

export function TodayJournalPromptCard({
  journalHref,
  state,
}: TodayJournalPromptCardProps) {
  if (state === "hidden") {
    return null;
  }

  const copy = promptCopy[state];

  return (
    <Card className="border-border bg-card" data-testid="today-journal-prompt">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.description}
        </p>
        <p className="text-xs leading-5 text-muted-foreground">
          {copy.secondary}
        </p>
        <Button asChild>
          <Link href={journalHref}>{copy.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
