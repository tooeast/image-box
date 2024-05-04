import { cloneDeep, set } from 'lodash';

import { ColorPicker } from 'antd';

import { shadowKey, SettingOption } from '../Setting';
import Step from '../components/Step';

function BaseOptions(props: {
  setting: SettingOption,
  onChange: (e: SettingOption) => void
}) {
  const {
    setting,
    onChange
  } = props;


  const shadowSetting = setting.shadow;

  function changeSetting(dir: shadowKey, val: number | string) {
    const settingClone = cloneDeep(setting);
    set(settingClone, `shadow.${dir}`, val);
    onChange(settingClone)
  }

  return (
    <>
      <Step title='横向偏移' inputMax={200} value={shadowSetting?.offsetX ? shadowSetting.offsetX : 0} onChange={e => changeSetting('offsetX', e)}></Step>
      <Step title='纵向偏移' inputMax={200} value={shadowSetting?.offsetY ? shadowSetting.offsetY : 0} onChange={e => changeSetting('offsetY', e)}></Step>
      <Step title='扩散距离' inputMax={200} value={shadowSetting?.spread ? shadowSetting.spread : 0} onChange={e => changeSetting('spread', e)}></Step>
      <Step title='边缘模糊' inputMax={200} value={shadowSetting?.blur ? shadowSetting.blur : 0} onChange={e => changeSetting('blur', e)}></Step>

      <h4>阴影颜色</h4>
      <ColorPicker
        value={shadowSetting?.color ? shadowSetting?.color : '#fff'}
        size="large"
        showText
        format="rgb"
        onChange={e => changeSetting('color', e.toHexString())}
      />
    </>
  )
}

export default BaseOptions
