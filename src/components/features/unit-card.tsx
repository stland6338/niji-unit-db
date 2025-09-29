import { UnitData } from '@/types/unit';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UnitCardProps {
  unit: UnitData;
  onClick?: () => void;
}

export function UnitCard({ unit, onClick }: UnitCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gaming':
        return 'default';
      case 'music':
        return 'success';
      case 'variety':
        return 'warning';
      case 'collaboration':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'gaming':
        return 'ゲーミング';
      case 'music':
        return '音楽';
      case 'variety':
        return 'バラエティ';
      case 'collaboration':
        return 'コラボ';
      default:
        return 'その他';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '活動中';
      case 'inactive':
        return '活動休止';
      default:
        return '不明';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{unit.name}</CardTitle>
            {unit.nameReading && (
              <p className="text-sm text-gray-500 mt-1">{unit.nameReading}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant={getCategoryColor(unit.category)}>
              {getCategoryLabel(unit.category)}
            </Badge>
            <Badge variant={getStatusColor(unit.status)}>
              {getStatusLabel(unit.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">メンバー ({unit.memberCount}人)</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {unit.members.slice(0, 3).map((member) => (
                <span
                  key={member.name}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {member.name}
                </span>
              ))}
              {unit.members.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{unit.members.length - 3}人
                </span>
              )}
            </div>
          </div>
          
          {unit.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {unit.description}
            </p>
          )}
          
          {unit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {unit.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {unit.tags.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{unit.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}