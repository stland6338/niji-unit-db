'use client';

import { useState } from 'react';
import { SearchFilters as SearchFiltersType, UnitCategory, UnitStatus, Branch } from '@/types/unit';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories: { value: UnitCategory; label: string }[] = [
    { value: 'gaming', label: 'ゲーミング' },
    { value: 'music', label: '音楽' },
    { value: 'variety', label: 'バラエティ' },
    { value: 'collaboration', label: 'コラボ' },
    { value: 'other', label: 'その他' },
  ];

  const statuses: { value: UnitStatus; label: string }[] = [
    { value: 'active', label: '活動中' },
    { value: 'inactive', label: '活動休止' },
    { value: 'unknown', label: '不明' },
  ];

  const branches: { value: Branch; label: string }[] = [
    { value: 'jp', label: 'にじさんじ' },
    { value: 'en', label: 'NIJISANJI EN' },
    { value: 'id', label: 'NIJISANJI ID' },
    { value: 'kr', label: 'NIJISANJI KR' },
    { value: 'ex', label: '卒業済み' },
  ];

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const toggleCategory = (category: UnitCategory) => {
    const current = filters.category || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, category: updated });
  };

  const toggleStatus = (status: UnitStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFiltersChange({ ...filters, status: updated });
  };

  const toggleBranch = (branch: Branch) => {
    const current = filters.branch || [];
    const updated = current.includes(branch)
      ? current.filter(b => b !== branch)
      : [...current, branch];
    onFiltersChange({ ...filters, branch: updated });
  };

  const clearFilters = () => {
    onFiltersChange({ query: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">検索・絞り込み</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '折りたたむ' : '詳細検索'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="ユニット名、メンバー名で検索..."
            value={filters.query || ''}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        {isExpanded && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">カテゴリ</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(({ value, label }) => (
                  <Badge
                    key={value}
                    variant={filters.category?.includes(value) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(value)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">活動状況</h4>
              <div className="flex flex-wrap gap-2">
                {statuses.map(({ value, label }) => (
                  <Badge
                    key={value}
                    variant={filters.status?.includes(value) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(value)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">ブランチ</h4>
              <div className="flex flex-wrap gap-2">
                {branches.map(({ value, label }) => (
                  <Badge
                    key={value}
                    variant={filters.branch?.includes(value) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => toggleBranch(value)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                フィルターをクリア
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}