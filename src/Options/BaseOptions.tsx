import { cloneDeep, set } from 'lodash';

import Step from '../components/Step';

import { settingKey, SettingOption } from '../Setting';

function BaseOptions(props: {
  setting: SettingOption,
  onChange: (e: SettingOption) => void
}) {
  const {
    setting,
    onChange
  } = props;

  function changeSetting(dir: settingKey, val: number | string) {
    const settingClone = cloneDeep(setting);
    set(settingClone, dir, val);
    onChange(settingClone)
  }

  return (
    <>
      <Step title='左边宽' inputMax={200} value={setting?.left ? setting.left : 0} onChange={e => changeSetting('left', e)}></Step>
      <Step title='右边宽' inputMax={200} value={setting?.right ? setting.right : 0} onChange={e => changeSetting('right', e)}></Step>
      <Step title='上边宽' inputMax={200} value={setting?.top ? setting.top : 0} onChange={e => changeSetting('top', e)}></Step>
      <Step title='下边宽' inputMax={200} value={setting?.bottom ? setting.bottom : 0} onChange={e => changeSetting('bottom', e)}></Step>
      <Step
        title='照片圆角'
        value={setting?.radius ? setting.radius : 0}
        max={50}
        onChange={e => changeSetting('radius', e)}
      />
    </>
  )
}

export default BaseOptions
