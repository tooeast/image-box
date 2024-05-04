import { debounce, isNumber, throttle } from 'lodash';
import { Component } from 'react';

import { RollbackOutlined } from '@ant-design/icons'
import { Tabs, Button, Flex } from 'antd';
import type { TabsProps } from 'antd';
import {imageInfoType} from './tools/exif'

import BaseOptions from './Options/BaseOptions';
import BackgroundOptions from './Options/BackgroundOptions';
import ShadowOptions from './Options/ShadowOptions';
import ParamsOptions from './Options/ParamsOptions';
import OutputImage from './Options/OutputImage';

import './Setting.scss'

export const fontFamilies = [
  {
    value: 'unset',
    label: '（默认）'
  },
  {
    value: 'deyihei',
    label: '得意黑'
  },
  {
    value: 'hutu',
    label: 'PF频凡胡涂体'
  },
  {
    value: 'hanchan',
    label: '寒蝉点阵体'
  },
  {
    value: 'pangmen',
    label: '庞门正道细线体'
  },
  {
    value: 'pangpang',
    label: '胖胖猪肉体'
  },
  {
    value: 'bifeng',
    label: '千图笔锋手写体'
  },
  {
    value: 'fengyuan',
    label: '粉圆'
  },
  {
    value: 'yinxiong',
    label: '英椎行书'
  },
  {
    value: 'ximai',
    label: '字制区喜脉体'
  },
  {
    value: 'harmony',
    label: '鸿蒙字体'
  },
  {
    value: 'en_ddin',
    label: 'D-DIN-PRO（英文）'
  },
  {
    value: 'en_harmony',
    label: '鸿蒙英文（英文）'
  },
  {
    value: 'en_krone',
    label: 'KronaOne（英文）'
  },
]

export interface SettingOption {
  top: number;
  left: number;
  right: number;
  bottom: number;
  radius?: number;
  background: {
    type: 'color' | 'image' | 'blur';
    color?: string;
    opacity?: number;
    blur?: number;
    blurClear?: number;
    size?: 'cover' | 'contain' | 'customize';
    sizeNum?: number;
    positionX?: number;
    positionY?: number;
  };
  shadow: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    inset?: boolean;
    color: string;
  };
  params: Array<{
    left: number;
    top: number;
    content?: string | string[];
    fontSize: number;
    color: string;
    type: 'exif' | 'customize';
    contentSpace?: number;
    fontWeight?: number;
    shadow?: boolean;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowBlur?: number;
    shadowColor?: string;
    fontFamily?: string;
    italic?: boolean;
  }>
}

export type settingKey = keyof SettingOption;
export type backgroundKey = keyof SettingOption['background'];
export type shadowKey = keyof SettingOption['shadow'];
export type ParamKey = keyof SettingOption['params'][number];


export const baseParamInfo: SettingOption['params'][number] = {
  type: 'exif',
  top: 20,
  left: 40,
  fontSize: 30,
  color: 'red',
  fontWeight: 400,
  shadow: false,
  fontFamily: 'unset'
}

export const defaultContentSpace = 12;
export const defaultParamType = 'exif';
const defaultSetting: SettingOption = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 25,
  radius: 0,
  background: {
    type: 'color',
    color: '#fff',
    opacity: 10,
    blur: 15
  },
  shadow: {
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0,
    color: 'rgb(0, 0, 0)'
  },
  params: []
}

interface SettingProps {
  imageInfo: imageInfoType;
  reUpload: () => void;
  imageUrl: string;
}

export interface SettingState {
  settingOptions: SettingOption,
  imgStyle: {
    width?: number;
    height?: number;
    position?: 'absolute';
    left?: number;
    top?: number;
    bottom?: number;
    right?: number;
    borderRadius?: string | number;
    boxShadow?: string;
  };
  bgStyle: {
    width?: string;
    height?: string;
    left?: string;
    top?: string;
    backgroundImage?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    filter?: string;
    opacity?: number | string;
    backgroundPositionX?: string;
    backgroundPositionY?: string;
  };
  canvasStyle: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  showBgImg: boolean;
  items?: TabsProps['items']
  showImg?: boolean
}

export default class Setting extends Component<SettingProps, SettingState> {
  state: SettingState = {
    settingOptions: defaultSetting,
    imgStyle: {},
    bgStyle: {},
    canvasStyle: {
      width: 0,
      height: 0,
      backgroundColor: '#fff'
    },
    showBgImg: false,
    items: [],
    showImg: true
  }

  componentDidMount(): void {
    this.setState({

    });

    this.drawImage = this.drawImage.bind(this);
    this.drawImage(this.state.settingOptions);


    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize)
  }

  showBg = () => {
    this.setState({
      showImg: true
    })
  }

  drawImageThrottle = throttle(this.drawImage, 250)
  drawImageDebounce = debounce(this.drawImage, 250)
  showDebounce = debounce(this.showBg, 250)



  handleResize = async () => {
    if (this.state.showImg) {
      this.setState({
        showImg: false
      })
    }

    this.drawImageDebounce(this.state.settingOptions);
    this.showDebounce()
  }

  calcMargin = (width: number, height: number, ops: SettingOption) => {
    const baseX = width / 100;
    const baseY = height / 100;

    return [
      Math.floor(baseY * ops.top),
      Math.floor(baseX * ops.right),
      Math.floor(baseY * ops.bottom),
      Math.floor(baseX * ops.left),
    ]
  }

  setCanvasSize = (imgWidth: number, imgHeight: number, ops: SettingOption)=> {
    // setCanvasWidth(imgWidth);
    // setCanvasHeight(imgHeight);
    // 照片的长宽elelelttt 像素
    const {imageUrl} = this.props;

    const [marTop, marRight, marBottom, marLeft] = this.calcMargin(imgWidth, imgHeight, ops);

    // 最终的像素长宽
    const finalXP = imgWidth + marLeft + marRight;
    const finalYP = imgHeight + marTop + marBottom;


    // 画布所在区域的长宽
    const leftWidth = document.querySelector('#settingLeft')?.clientWidth;
    const leftHeight = document.querySelector('#settingLeft')?.clientHeight;

    if (!isNumber(leftHeight) || !isNumber(leftWidth)) {
      return;
    }

    console.log('leftWidth', leftWidth);

    const xrad = finalXP / leftWidth;
    const yrad = finalYP / leftHeight;

    console.log('xrad', xrad);

    console.log('yrad', yrad);

    const finalRad = Math.max(xrad, yrad);

    //  计算所得画布的最大长宽
    const canWid = finalXP/finalRad;
    const canHig = finalYP/finalRad
    console.log('canWid', canWid);

    const imgWid = imgWidth / finalRad;
    const imgHig = imgHeight / finalRad;

    this.setState({
      canvasStyle: {
        width: canWid,
        height: canHig,
        backgroundColor: ops?.background?.color ? ops.background.color : '#fff'
      }
    })

    this.setState({
      imgStyle: {
        width: imgWid,
        height: imgHig,
        position: 'absolute',
        left: marLeft / finalRad,
        top: marTop / finalRad,
        bottom: marBottom / finalRad,
        right: marRight / finalRad,
        borderRadius: isNumber(ops?.radius) ? `${ops.radius}%` : 0,
        ...(
          ops?.shadow?.offsetX || ops?.shadow?.offsetY || ops?.shadow?.spread || ops?.shadow?.blur ? {
            boxShadow: `${ops?.shadow?.offsetX || 0}px ${ops?.shadow?.offsetY || 0}px ${ops?.shadow?.blur || 0}px ${ops?.shadow?.spread || 0}px ${ops?.shadow?.color || '#000'}`
          } : {}
        )
      }
    })

    if (['image', 'blur'].includes(ops?.background?.type)) {
      this.setState({
        showBgImg: true,
        bgStyle: {
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: ops?.background?.size === 'customize' ? `${ops.background.sizeNum || 100}%` : ops.background.size,
          ...(
            ops.background.type === 'blur' && isNumber(ops.background.blur) ? {
              filter: `blur(${ops.background.blur}px)`
            } : {}
          ),
          ...(
            isNumber(ops.background.opacity) ? {
              opacity: Number(ops.background.opacity / 100).toFixed(2),
            } : {}
          ),
          backgroundPositionX: `${isNumber(ops?.background?.positionX) ? ops.background.positionX : 50}%`,
          backgroundPositionY: `${isNumber(ops?.background?.positionY) ? ops.background.positionY : 50}%`,
          ...(
            isNumber(ops.background.blurClear) && ops.background.blurClear ? {
              width: `${100 + ops.background.blurClear}%`,
              height: `${100 + ops.background.blurClear}%`,
              left: `${-(ops.background.blurClear / 2)}%`,
              top: `${-(ops.background.blurClear / 2)}%`
            } : {}
          )
        }
      })
    }
    else {
      this.setState({
        showBgImg: false
      })
    }
  }

  setBaseInfo = (info: imageInfoType) => {
    // 处理照片旋转问题
    if (info?.Orientation && info.Orientation > 4) {
      return {
        imageWidth: info.PixelYDimension,
        imageHeight: info.PixelXDimension
      }
    }
    else {
      return {
        imageWidth: info.PixelXDimension,
        imageHeight: info.PixelYDimension
      }
    }
  }

  drawImage(ops: SettingOption) {
    const {imageInfo} = this.props;
    console.log('drawImagedrawImage', imageInfo)
    const base = this.setBaseInfo(imageInfo);

    this.setCanvasSize(base.imageWidth, base.imageHeight, ops);
  }

  handleSettingChange = (e: SettingOption) => {
    this.setState({
      settingOptions: e
    })
    console.log('handleSettingChange', e)

    this.drawImageThrottle(e)
  }

  handleReset = () => {
    this.setState({
      settingOptions: defaultSetting
    })
    this.props.reUpload()
  }

  render() {
    const {
      imageInfo,
      imageUrl
    } = this.props;

    const {
      canvasStyle,
      showBgImg,
      bgStyle,
      imgStyle,
      settingOptions,
    } = this.state;

    const items = [
      {
        key: '1',
        label: '基础设置',
        children: <BaseOptions setting={this.state.settingOptions} onChange={this.handleSettingChange} />
      },
      {
        key: '2',
        label: '背景设置',
        children: <BackgroundOptions setting={this.state.settingOptions} onChange={this.handleSettingChange} />
      },
      {
        key: '3',
        label: '阴影设置',
        children: <ShadowOptions setting={this.state.settingOptions} onChange={this.handleSettingChange} />
      },
      {
        key: '4',
        label: '参数信息',
        children: <ParamsOptions
          setting={this.state.settingOptions}
          exif={this.props.imageInfo}
          canvasStyle={canvasStyle}
          onChange={this.handleSettingChange}
        />
      }
    ];

    console.log('this.state.showImg', this.state.showImg)
    
    return (
      <>
          <Flex gap='large' justify='flex-end'>
            <Button
              size='large'
              type="text"
              icon={<RollbackOutlined />}
              style={{color: '#1677ff'}}
              onClick={this.handleReset}>重新选择图片</Button>

            <OutputImage
              filename={imageInfo.filename}
              imageSize={canvasStyle}
              settingOptions={settingOptions}
            />
          </Flex>
        <div className='setting'>

          <div className='setting-left background-sd'>
            <div className='setting-left-inner' id='settingLeft'>
              <div className='canvas' id='imageCanvas' style={this.state.showImg ? {} : {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: .7
              } }>
                {
                  showBgImg ? (
                    <div className='canvas-bg' style={bgStyle}></div>
                  ) : null
                }
                <div className='canvas-inner' style={canvasStyle} >
                  <img crossOrigin='anonymous' src={imageUrl} style={imgStyle}></img>

                  {
                    Array.isArray(settingOptions.params) && settingOptions.params.length ? settingOptions.params.map((item, index) => (
                      <div
                        id={'params-id-' + index}
                        key={(Array.isArray(item.content) ? item.content.join('_') : item.content) + '##' + index}
                        style={{
                          position: 'absolute',
                          left: `${item.left * canvasStyle.width / 100}px`,
                          top: `${item.top * canvasStyle.height / 100}px`,
                          fontSize: `${item.fontSize}px`,
                          color: item.color,
                          whiteSpace: 'pre',
                          fontWeight: item.fontWeight || 400,
                          textShadow: item.shadow ? `${item.shadowOffsetX || 0}px ${item.shadowOffsetY || 0}px ${item.shadowBlur || 0}px ${item.shadowColor || '#000'}` : 'none',
                          fontFamily: item.fontFamily || 'unset',
                          fontStyle: item.italic ? 'italic' : 'normal'
                        }}
                      >
                        {
                          item.type && item.type === 'exif' && Array.isArray(item.content) ? (
                            item.content.map((cItem: string, index: number) => (
                              <span
                                key={`${index}-${cItem}`}
                                style={{
                                  marginRight: `${(isNumber(item.contentSpace) ? item.contentSpace : defaultContentSpace) * canvasStyle.width / 1000}px`,
                                }}
                              >{cItem}</span>
                            ))
                          ) : item.content
                        }
                      </div>
                    )) : null
                  }
                </div>
              </div>
            </div>
            <div className='x-center'></div>
            <div className='y-center'></div>
          </div>
          <div className='setting-right'>
            <Tabs defaultActiveKey="1" items={items} />
          </div>
        </div>
      </>
    )
  }
}