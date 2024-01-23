import { CustomElement, ImageBlockElement } from '@/containers/wysiwyg/types';

import { VerboseResponse } from '@/api/types/request';

import { ImageToCreate } from './types';

export class ImageMapper {
  private static mapChildren(
    elements: CustomElement[],
    {
      imageElements,
      elementsCopy,
    }: {
      imageElements: ImageBlockElement[];
      elementsCopy: CustomElement[];
    }
  ) {
    elements.forEach((element) => {
      const elementCopy = element.children ? { ...element, children: [] } : { ...element };

      if (elementCopy.type === 'image') {
        const imageElement = elementCopy as ImageBlockElement;

        imageElements.push(imageElement);
        elementsCopy.push(imageElement);
      } else {
        elementsCopy.push(elementCopy);
      }

      if (element.children?.length) {
        this.mapChildren(element.children as CustomElement[], {
          imageElements,
          elementsCopy: elementsCopy.at(-1)!.children as CustomElement[],
        });
      }
    });
  }

  private static getImagesToCreateMap(imageElements: ImageBlockElement[]) {
    const imagesToCreate: ImageToCreate[] = [];

    const imagesToCreateMap = imageElements.reduce<{ [id: number]: ImageBlockElement }>(
      (acc, imageElement, index) => {
        acc[index] = imageElement;

        const imageProps = imageElement.url.split(';base64,');

        if (!imageProps[1]) {
          return acc;
        }

        const format = imageProps[0].split('/')[1];
        const base64 = imageProps[1];

        imagesToCreate.push({
          base64,
          format,
          id: index,
        });

        return acc;
      },
      {}
    );

    return { imagesToCreateMap, imagesToCreate };
  }

  public static getImagesToCreate(elements: CustomElement[]) {
    const elementsCopy: CustomElement[] = [];
    const imageElements: ImageBlockElement[] = [];

    this.mapChildren(elements, { imageElements, elementsCopy });

    const { imagesToCreate, imagesToCreateMap } = this.getImagesToCreateMap(imageElements);

    return {
      imagesToCreate,
      imagesToCreateMap,
      elementsCopy,
    };
  }

  public static updateImageElements(
    createdImages: { id: number; uri: string }[],
    imagesToCreateMap: { [id: number]: ImageBlockElement },
    elementsCopy: CustomElement[]
  ) {
    createdImages.forEach((createdImage) => {
      imagesToCreateMap[createdImage.id].url = createdImage.uri;
    });

    return JSON.stringify(elementsCopy);
  }

  public static composeChunks<T>(chunks: VerboseResponse<T[]>[]): T[] | null {
    const composedChunks: T[] = [];

    for (const chunk of chunks) {
      if (chunk.status === 'error') {
        return null;
      }

      chunk.result.forEach((item) => {
        composedChunks.push(item);
      });
    }

    return composedChunks;
  }

  public static splitOnChunks(
    imagesToCreate: ImageToCreate[],
    chunkSize: number
  ): ImageToCreate[][] {
    const imagesToCreateChunks: ImageToCreate[][] = [];

    const chunkDetails = imagesToCreate.reduce<{ chunk: ImageToCreate[]; size: number }>(
      (chunkDetails, imageToCreate) => {
        if (chunkDetails.size + imageToCreate.base64.length > chunkSize) {
          if (chunkDetails.chunk.length) {
            imagesToCreateChunks.push(chunkDetails.chunk);
          }

          return {
            chunk: [imageToCreate],
            size: imageToCreate.base64.length,
          };
        }

        chunkDetails.chunk.push(imageToCreate);
        chunkDetails.size += imageToCreate.base64.length;

        return chunkDetails;
      },
      { chunk: [], size: 0 }
    );

    imagesToCreateChunks.push(chunkDetails.chunk);

    return imagesToCreateChunks;
  }
}
