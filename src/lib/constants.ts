import { UnitCategory, Branch, UnitStatus } from '@/types';

export const UNIT_CATEGORIES: { value: UnitCategory; label: string }[] = [
  { value: 'gaming', label: 'ゲーミング' },
  { value: 'music', label: '音楽' },
  { value: 'variety', label: 'バラエティ' },
  { value: 'collaboration', label: 'コラボ' },
  { value: 'other', label: 'その他' },
];

export const BRANCHES: { value: Branch; label: string }[] = [
  { value: 'jp', label: '本家' },
  { value: 'en', label: 'EN' },
  { value: 'id', label: 'ID' },
  { value: 'kr', label: 'KR' },
  { value: 'ex', label: '元メンバー' },
];

export const UNIT_STATUSES: { value: UnitStatus; label: string }[] = [
  { value: 'active', label: 'アクティブ' },
  { value: 'inactive', label: '非アクティブ' },
  { value: 'unknown', label: '不明' },
];

export const MEMBER_COUNT_OPTIONS = [
  { value: 2, label: '2人' },
  { value: 3, label: '3人' },
  { value: 4, label: '4人' },
  { value: 5, label: '5人' },
  { value: 6, label: '6人以上' },
];

export const SITE_CONFIG = {
  name: 'にじユニットDB',
  description: 'にじさんじのコラボ・ユニット情報をまとめたデータベース',
  url: 'https://niji-unit-db.vercel.app',
  ogImage: '/og-image.png',
} as const;