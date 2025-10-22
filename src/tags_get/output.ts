export interface Tag {
  TagID?: number;
  TagName?: string;
  TagType?: string;
  Active?: boolean;
}

export type TagsGetOutput = Tag[];
