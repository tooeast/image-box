import { assign, cloneDeep, isNumber, set } from 'lodash';

import { ColorPicker, Segmented, Space } from 'antd';

import { backgroundKey, SettingOption } from '../Setting';
import Step from '../components/Step';

function BackgroundOptions(props: {
  setting: SettingOption,
  onChange: (e: SettingOption) => void
}) {
  const {
    setting,
    onChange
  } = props;

  const bgSetting = setting.background;

  const showBlurSetting = setting?.background.type === 'blur';
  const showImgSetting = setting?.background.type === 'image' || showBlurSetting;

  function changeSetting(dir: backgroundKey, val: number | string) {
    const settingClone = cloneDeep(setting);
    set(settingClone, `background.${dir}`, val);
    onChange(settingClone)
  }

  function batchChangeSetting(obj: {
    [key: string]: string | number
  }) {
    const settingClone = cloneDeep(setting);
    assign(settingClone.background, obj);
    onChange(settingClone)
  }

  return (
    <>
      <h4>背景类型</h4>
      <Segmented
        value={bgSetting?.type ? bgSetting?.type : 'color'}
        options={[
          {
            label: '纯色背景',
            value: 'color'
          },
          {
            label: '半透明图片',
            value: 'image'
          },
          {
            label: '图片毛玻璃',
            value: 'blur'
          }
        ]}
        onChange={e => e === 'blur' ? batchChangeSetting({
          type: e,
          opacity: 100
        }) : changeSetting('type', e)}
      />

      <h4>背景{bgSetting?.type === 'color' ? '颜色' : '底色'}</h4>
      <ColorPicker
        value={bgSetting?.color ? bgSetting?.color : '#fff'}
        size="large"
        showText
        disabledAlpha
        format="hex"
        onChange={e => changeSetting('color', e.toHexString())}
      />

      {
        showImgSetting ? (
          <Step title='背景图透明度'
            value={bgSetting?.opacity ? bgSetting.opacity : 0}
            min={0}
            max={100}
            step={1}
            onChange={e => changeSetting('opacity', e)}
          ></Step>
        ) : null
      }


      {
        showBlurSetting ? (
          <>
            <Step title='毛玻璃程度'
              value={bgSetting?.blur ? bgSetting.blur : 0}
              min={0}
              max={100}
              step={1}
              onChange={e => changeSetting('blur', e)}
            ></Step>
            <Step title='毛玻璃边缘阴影消除'
              value={bgSetting?.blurClear ? bgSetting.blurClear : 0}
              min={0}
              max={100}
              step={1}
              onChange={e => changeSetting('blurClear', e)}
            ></Step>
          </>
        ) : null
      }

      {
        showImgSetting ? (
          <>
            <h4>背景图大小</h4>
            <Space direction="vertical" size="middle" className='w-full'>
              <Segmented
                value={bgSetting?.size ? bgSetting?.size : 'cover'}
                options={[
                  {
                    label: 'Cover',
                    value: 'cover'
                  },
                  {
                    label: 'Contain',
                    value: 'contain'
                  },
                  {
                    label: '自定义',
                    value: 'customize'
                  }
                ]}
                onChange={e => e === 'customize' ? batchChangeSetting({
                  size: e,
                  sizeNum: 100
                }) : changeSetting('size', e)}
              />

              {
                bgSetting?.size === 'customize' ? (
                  <Step
                    value={bgSetting?.sizeNum ? bgSetting.sizeNum : 100}
                    min={1}
                    max={1000}
                    step={1}
                    onChange={e => changeSetting('sizeNum', e)}
                  ></Step>
                ) : null
              }
            </Space>

            <h4>背景图位置（横向）</h4>
            <Space direction="vertical" size="middle" className='w-full'>
              <Segmented
                value={isNumber(bgSetting?.positionX) ? bgSetting?.positionX : 50}
                options={[
                  {
                    label: '靠左',
                    value:  0
                  },
                  {
                    label: '居中',
                    value: 50
                  },
                  {
                    label: '靠右',
                    value: 100
                  }
                ]}
                onChange={e => changeSetting('positionX', e)}
              />

              <Step
                label='自定义'
                value={isNumber(bgSetting?.positionX) ? bgSetting.positionX : 50}
                min={0}
                max={100}
                step={1}
                inputMax={200}
                included={false}
                marks={{
                  50: ''
                }}
                onChange={e => changeSetting('positionX', e)}
              ></Step>
            </Space>


            <h4>背景图位置（纵向）</h4>
            <Space direction="vertical" size="middle" className='w-full'>
              <Segmented
                value={isNumber(bgSetting?.positionY) ? bgSetting?.positionY : 50}
                options={[
                  {
                    label: '靠上',
                    value:  0
                  },
                  {
                    label: '居中',
                    value: 50
                  },
                  {
                    label: '靠下',
                    value: 100
                  }
                ]}
                onChange={e => changeSetting('positionY', e)}
              />

              <Step
                label='自定义'
                value={isNumber(bgSetting?.positionY) ? bgSetting.positionY : 50}
                min={0}
                max={100}
                step={1}
                inputMax={200}
                included={false}
                marks={{
                  50: ''
                }}
                onChange={e => changeSetting('positionY', e)}
              ></Step>
            </Space>
          </>
        ) : null
      }


      {
        
      }



    </>
  )
}

export default BackgroundOptions
