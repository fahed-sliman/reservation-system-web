// Category types
export interface Category {
  id: number;
  ar_title: string;
  en_title: string;
  image: string; // URL from asset()
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface CreateCategoryRequest {
  arTitle: string;
  enTitle: string;
  image: File;
}

export interface SearchCategoriesRequest {
  search?: string;
}