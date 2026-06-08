"use client";

import type { ReactNode } from "react";

import type {
  SkinJournalDateRangeFilter,
  SkinJournalFilterOptions,
  SkinJournalFilterState,
} from "@/modules/journals/skin-journal-filters";
import {
  getProductDisplayName,
  type ProductLookup,
} from "@/modules/journals/skin-journal-product-display";
import type {
  SkinJournalStressLevel,
  SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type SkinJournalFilterPanelProps = {
  filters: SkinJournalFilterState;
  hasActiveFilters: boolean;
  matchingCount: number;
  onChange: (filters: SkinJournalFilterState) => void;
  onClear: () => void;
  options: SkinJournalFilterOptions;
  productLookup: ProductLookup;
  totalCount: number;
};

const allValue = "all";

const symptomLabels: Record<SkinJournalSymptom, string> = {
  dryness: "Khô da",
  oiliness: "Đổ dầu",
  redness: "Đỏ da",
  stinging: "Châm chích",
  new_breakouts: "Nổi mụn mới",
  itchiness: "Ngứa",
  other: "Khác",
};

const stressLabels: Record<SkinJournalStressLevel, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const dateRangeLabels: Record<SkinJournalDateRangeFilter, string> = {
  all: "Tất cả nhật ký đã tải",
  last7Days: "7 ngày gần đây",
  last14Days: "14 ngày gần đây",
  last30Days: "30 ngày gần đây",
};

export function SkinJournalFilterPanel({
  filters,
  hasActiveFilters,
  matchingCount,
  onChange,
  onClear,
  options,
  productLookup,
  totalCount,
}: SkinJournalFilterPanelProps) {
  return (
    <Card data-testid="skin-journal-filter-panel">
      <CardHeader>
        <CardTitle>Bộ lọc nhật ký da</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p
          className="text-sm leading-6 text-muted-foreground"
          data-testid="skin-journal-filter-disclaimer"
        >
          Bộ lọc này giúp bạn xem lại ghi chú chăm sóc da đã tự ghi nhận. Thông
          tin chỉ hỗ trợ phản ánh thói quen và quan sát cá nhân, không dùng để
          chẩn đoán, kết luận nguyên nhân, hoặc thay thế tư vấn y khoa.
        </p>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            dataTestId="skin-journal-symptom-filter"
            disabled={options.symptoms.length === 0}
            id="skin-journal-symptom-filter"
            label="Triệu chứng/ghi nhận"
            onValueChange={(value) =>
              onChange({
                ...filters,
                symptom:
                  value === allValue ? undefined : (value as SkinJournalSymptom),
              })
            }
            value={filters.symptom ?? allValue}
          >
            <SelectItem value={allValue}>Tất cả dấu hiệu đã tải</SelectItem>
            {options.symptoms.map((symptom) => (
              <SelectItem key={symptom} value={symptom}>
                {symptomLabels[symptom]}
              </SelectItem>
            ))}
          </FilterSelect>

          <FilterSelect
            dataTestId="skin-journal-stress-filter"
            disabled={options.stressLevels.length === 0}
            id="skin-journal-stress-filter"
            label="Mức độ căng thẳng"
            onValueChange={(value) =>
              onChange({
                ...filters,
                stressLevel:
                  value === allValue
                    ? undefined
                    : (value as SkinJournalStressLevel),
              })
            }
            value={filters.stressLevel ?? allValue}
          >
            <SelectItem value={allValue}>Tất cả mức đã tải</SelectItem>
            {options.stressLevels.map((stressLevel) => (
              <SelectItem key={stressLevel} value={stressLevel}>
                {stressLabels[stressLevel]}
              </SelectItem>
            ))}
          </FilterSelect>

          <FilterSelect
            dataTestId="skin-journal-product-filter"
            disabled={options.productIds.length === 0}
            id="skin-journal-product-filter"
            label="Sản phẩm đã dùng"
            onValueChange={(value) =>
              onChange({
                ...filters,
                productId: value === allValue ? undefined : value,
              })
            }
            value={filters.productId ?? allValue}
          >
            <SelectItem value={allValue}>Tất cả sản phẩm đã tải</SelectItem>
            {options.productIds.map((productId) => (
              <SelectItem key={productId} value={productId}>
                {getProductDisplayName(productLookup[productId])}
              </SelectItem>
            ))}
          </FilterSelect>

          <FilterSelect
            dataTestId="skin-journal-date-range-filter"
            id="skin-journal-date-range-filter"
            label="Khoảng thời gian"
            onValueChange={(value) =>
              onChange({
                ...filters,
                dateRange: value as SkinJournalDateRangeFilter,
              })
            }
            value={filters.dateRange ?? "all"}
          >
            {Object.entries(dateRangeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </FilterSelect>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p
              className="text-sm font-medium text-foreground"
              data-testid="skin-journal-filter-result-count"
            >
              {getResultCountCopy({
                hasActiveFilters,
                matchingCount,
                totalCount,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              Bộ lọc chỉ áp dụng cho danh sách nhật ký đã tải.
            </p>
          </div>
          <Button
            data-testid="skin-journal-filter-clear-button"
            disabled={!hasActiveFilters}
            onClick={onClear}
            type="button"
            variant="outline"
          >
            Xóa bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type FilterSelectProps = {
  children: ReactNode;
  dataTestId: string;
  disabled?: boolean;
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

function FilterSelect({
  children,
  dataTestId,
  disabled = false,
  id,
  label,
  onValueChange,
  value,
}: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full" data-testid={dataTestId} id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {disabled ? (
        <p className="text-xs text-muted-foreground">Chưa có dữ liệu đã tải.</p>
      ) : null}
    </div>
  );
}

function getResultCountCopy({
  hasActiveFilters,
  matchingCount,
  totalCount,
}: {
  hasActiveFilters: boolean;
  matchingCount: number;
  totalCount: number;
}) {
  if (hasActiveFilters && matchingCount === 0) {
    return "Không có nhật ký nào phù hợp với bộ lọc hiện tại.";
  }

  if (hasActiveFilters) {
    return `Hiển thị ${matchingCount} nhật ký phù hợp.`;
  }

  return `Hiển thị ${totalCount} nhật ký đã tải.`;
}
