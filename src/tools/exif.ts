import { isArray, isNumber } from 'lodash';

import ExifReader from 'exifreader';

export function numberFix(num: number, fix: number = 1) {
  return Number.isInteger(num) ? num : Number(Number(num).toFixed(fix));
}

function calcReal(obj: ExifReader.NumberTag, unit?: string) {
  if (isArray(obj.value) && obj.value.length === 2) {
    return `${numberFix(obj.value[0]/obj.value[1])}${unit || ''}`;
  }
  else if (isNumber(obj.value)) {
    return `${obj.value}${unit || ''}`;
  }
  else if (unit && obj.description && String(obj.description).endsWith(` ${unit}`)) {
    return String(obj.description).replace(new RegExp(`\\s${unit}$`), unit);
  }
  else {
    return obj.description;
  }
}

function getArrayFirst(obj: ExifReader.XmpTag | ExifReader.StringArrayTag) {
  if (Array.isArray(obj.value) && obj.value.length === 1) {
    return obj.value[0];
  }
  return obj.description;
}

interface imageInfoTypePart {
  PixelXDimension: number;
  PixelYDimension: number;
  unnormal: boolean;

}

export interface imageInfoType extends imageInfoTypePart {
  Orientation: number;
  filename: string;
  common: Array<{
    name: string;
    value: string;
    key: string;
  }>
}
export const imageTypes = ['jpeg', 'png', 'tiff', 'heic', 'heif'];
export async function getImageInfo(image: File): Promise<imageInfoType | imageInfoTypePart | string> {
  try {
    const res = await ExifReader.load(image);

    console.log('tags', res);

    if (!(res?.PixelXDimension && res?.PixelYDimension) && !(res['Image Width'] && res['Image Height'])) {
      return '无法识别图片的信息';
    }

    if (!res.Make || !res.ISOSpeedRatings) {
      return {
        PixelXDimension: Number(res.PixelXDimension?.value || res['Image Width']?.value),
        PixelYDimension: Number(res.PixelYDimension?.value || res['Image Height']?.value),
        unnormal: true
      };
    }

    const common = [
      res.Make && {
        value: getArrayFirst(res.Make),
        name: '相机品牌',
        key: 'make'
      },
      res.Model && {
        value: getArrayFirst(res.Model),
        name: '相机型号',
        key: 'model'
      },
      res.LensMake && {
        value: getArrayFirst(res.LensMake),
        name: '镜头品牌',
        key: 'lensMake'
      },
      res.LensModel && {
        value: getArrayFirst(res.LensModel),
        name: '镜头型号',
        key: 'lensModel'
      },
      res.FNumber && {
        value: res.FNumber?.description,
        name: '光圈值',
        key: 'fNumber'
      },
      res.ISOSpeedRatings && {
        value: 'ISO' + res.ISOSpeedRatings?.value,
        name: 'ISO',
        key: 'ISOSpeedRatings'
      },
      res.ExposureTime && {
        value: res.ExposureTime?.description + 's',
        name: '快门速度',
        key: 'ShutterSpeedValue'
      },
      res.FocalLength && {
        value: calcReal(res.FocalLength as ExifReader.NumberTag, 'mm'),
        name: '焦距',
        key: 'FocalLength'
      },
      res.FocalLengthIn35mmFilm && {
        value: calcReal(res.FocalLengthIn35mmFilm as ExifReader.NumberTag, 'mm'),
        name: '等效焦距',
        key: 'FocalLengthIn35mmFilm'
      },
      res.DateTime && {
        value: res.DateTime?.description,
        name: '拍摄时间',
        key: 'DateTime'
      }
    ].filter(Boolean)
    
    return {
      PixelXDimension: Number(res.PixelXDimension?.value),
      PixelYDimension: Number(res.PixelYDimension?.value),
      Orientation: Number(res.Orientation?.value),
      // @ts-expect-error 不知道为啥，艹
      common
    }
  }
  catch (e) {
    return 'false';
  }

}

export function sleep(time: number) {

  if(!isNumber(time) || time <= 0) {
    return;
  }

  return new Promise((resolve) => setTimeout(resolve, time))
}

export function download(link: string, filename: string){
  const a = document.createElement('a')
  a.href = link
  a.download = filename || 'default.jpg'
  a.dispatchEvent(new MouseEvent('click'))
}