'use client';

import { useState, useMemo } from 'react';
import { UnitData, SearchFilters as SearchFiltersType } from '@/types/unit';
import { UnitCard } from '@/components/features/unit-card';
import { SearchFilters } from '@/components/features/search-filters';
import { searchUnits } from '@/lib/search';
import unitsData from '@/data/units.json';

export default function Home() {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);

  const filteredUnits = useMemo(() => {
    return searchUnits(unitsData as UnitData[], filters);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          にじさんじユニットデータベース
        </h1>
        <p className="text-gray-600">
          にじさんじライバーのコラボユニット情報を検索・閲覧できます
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredUnits.length}件のユニットが見つかりました
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                onClick={() => setSelectedUnit(unit)}
              />
            ))}
          </div>

          {filteredUnits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                検索条件に一致するユニットが見つかりませんでした
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedUnit.name}</h2>
                  {selectedUnit.nameReading && (
                    <p className="text-gray-500">{selectedUnit.nameReading}</p>
                  )}
                  {selectedUnit.nameEnglish && (
                    <p className="text-gray-500">{selectedUnit.nameEnglish}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {selectedUnit.description && (
                  <div>
                    <h3 className="font-semibold mb-2">説明</h3>
                    <p className="text-gray-700">{selectedUnit.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">メンバー ({selectedUnit.memberCount}人)</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedUnit.members.map((member) => (
                      <div key={member.name} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{member.name}</p>
                        {member.nameReading && (
                          <p className="text-sm text-gray-500">{member.nameReading}</p>
                        )}
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {member.branch.toUpperCase()}
                          </span>
                          {member.generation && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {member.generation}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedUnit.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUnit.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUnit.games && selectedUnit.games.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">主なゲーム</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUnit.games.map((game) => (
                        <span
                          key={game}
                          className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
