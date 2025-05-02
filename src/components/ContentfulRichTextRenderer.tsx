'use client';

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {
  BLOCKS,
  INLINES,
  Node,
  Block,
  Inline,
  Document,
} from '@contentful/rich-text-types';
import Image from 'next/image';

interface ContentfulRichTextRendererProps {
  document: Document;
}

const ContentfulRichTextRenderer: React.FC<ContentfulRichTextRendererProps> = ({
  document,
}) => {
  if (!document) {
    return null;
  }

  const options = {
    renderNode: {
      // --- Block Nodes ---
      [BLOCKS.PARAGRAPH]: (_node: Node, children: React.ReactNode) => {
        return <p className='mb-4 text-gray-700'>{children}</p>;
      },

      [BLOCKS.HEADING_1]: (_node: Node, children: React.ReactNode) => {
        return (
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mt-8 mb-4'>
            {children}
          </h1>
        );
      },
      [BLOCKS.HEADING_2]: (_node: Node, children: React.ReactNode) => {
        return (
          <h2 className='text-2xl md:text-3xl font-semibold text-gray-700 mt-6 mb-3'>
            {children}
          </h2>
        );
      },
      [BLOCKS.HEADING_3]: (_node: Node, children: React.ReactNode) => {
        return (
          <h3 className='text-xl md:text-2xl font-semibold text-gray-700 mt-5 mb-2'>
            {children}
          </h3>
        );
      },
      [BLOCKS.HEADING_4]: (_node: Node, children: React.ReactNode) => {
        return (
          <h4 className='text-lg md:text-xl font-semibold text-gray-700 mt-4 mb-2'>
            {children}
          </h4>
        );
      },
      [BLOCKS.HEADING_5]: (_node: Node, children: React.ReactNode) => {
        return (
          <h5 className='text-lg font-semibold text-gray-700 mt-3 mb-1'>
            {children}
          </h5>
        );
      },
      [BLOCKS.HEADING_6]: (_node: Node, children: React.ReactNode) => {
        return (
          <h6 className='text-base font-semibold text-gray-700 mt-2 mb-1'>
            {children}
          </h6>
        );
      },

      [BLOCKS.UL_LIST]: (_node: Node, children: React.ReactNode) => {
        return <ul className='list-disc pl-6 mb-4 space-y-2'>{children}</ul>;
      },
      [BLOCKS.OL_LIST]: (_node: Node, children: React.ReactNode) => {
        return <ol className='list-decimal pl-6 mb-4 space-y-2'>{children}</ol>;
      },
      [BLOCKS.LIST_ITEM]: (_node: Node, children: React.ReactNode) => {
        return <li className='text-gray-700'>{children}</li>;
      },

      [BLOCKS.QUOTE]: (_node: Node, children: React.ReactNode) => {
        return (
          <blockquote className='border-l-4 border-blue-600 italic pl-4 mb-4 text-gray-600'>
            {children}
          </blockquote>
        );
      },

      [BLOCKS.HR]: () => {
        return <hr className='my-8 border-gray-300' />;
      },

      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => {
        const typedNode = node as Block & {
          data: {
            target: {
              fields?: {
                file?: {
                  url?: string;
                };
                description?: string;
              };
            };
          };
        };

        const asset = typedNode.data.target;
        if (asset?.fields?.file?.url) {
          const imageUrl = asset.fields.file.url;
          const altText = asset.fields.description || '';
          return (
            <div className='flex justify-center my-6'>
              <Image
                src={imageUrl}
                alt={altText}
                className='rounded-lg shadow-md max-w-full h-auto'
              />
            </div>
          );
        }
        return null;
      },

      // --- Inline Nodes ---
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => {
        const typedNode = node as Inline & { data: { uri: string } };
        return (
          <a
            href={typedNode.data.uri}
            className='text-blue-600 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className='rich-text-content'>
      {documentToReactComponents(document, options)}
    </div>
  );
};

export default ContentfulRichTextRenderer;
