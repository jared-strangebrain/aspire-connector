export interface CatalogItemCategory {
  CatalogItemCategoryID?: number;
  CategoryName?: string;
  Active?: boolean;
}

export type CatalogItemCategoriesGetOutput = CatalogItemCategory[];
