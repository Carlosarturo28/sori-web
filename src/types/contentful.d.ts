import { Document } from '@contentful/rich-text-types';

export interface Terms {
  title: string;
  content: Document;
  updatedAt: string;
}

export interface ContentfulAsset {
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}
