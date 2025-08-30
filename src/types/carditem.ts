export interface CardItem {
  id: number;
  ar_title: string;
  en_title: string;
  ar_description: string;
  en_description: string;
  image: string;
  price?: number | null;   // مو كل العناصر فيها سعر
  location?: string | null;
  capacity?: number | null;
  is_closed?: boolean;
  closed_from?: string | null;
  closed_until?: string | null;
  start_date?: string | null; // للرحلات والأحداث
  end_date?: string | null;   // للرحلات والأحداث
}
