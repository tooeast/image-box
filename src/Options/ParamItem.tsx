import { cloneDeep, isNumber } from 'lodash';

import { Input, Space, ColorPicker, Flex, Tag, Switch, Select, Button } from 'antd';
import { ParamKey, defaultContentSpace, defaultParamType, fontFamilies, SettingOption } from '../Setting';
import { valueType } from 'antd/es/statistic/utils';

import Step from '../components/Step';
type paramType = SettingOption['params'][number];

const { TextArea } = Input;

function ParamItem(props: {
  data: paramType;
  onVerticalCenter: () => void;
  onHorizontalCenter: () => void;
  onChange: (e: paramType) => void;
}) {
  const {
    data,
    onVerticalCenter,
    onHorizontalCenter,
    onChange
  } = props;

  function handleChange(key: ParamKey, val: valueType | boolean | never) {{
    const oldVal = cloneDeep(data);
    onChange({
      ...oldVal,
      [key]: val
    });
  }}

  return (
    <div className='param-item'>
      <Space direction="vertical" size={'small'} className='w-full paramItem-card'>
        <span>文本：</span>
        {
          data?.type === defaultParamType ? (
            Array.isArray(data.content) ? <Space size={0} wrap>{data.content.map((e: string) => <Tag key={e}>{e}</Tag>)}</Space> : <Tag>{data.content}</Tag>
          ) : (
            <TextArea
              value={data.content}
              placeholder="disable resize"
              style={{ height: 120, resize: 'none' }}
              onChange={e => handleChange('content', e.target.value)}
            />
          )
        }
        <Step
          label='上边距'
          labelWidth={60}
          value={data.top}
          min={0}
          max={100}
          step={0.1}
          inputMax={100}
          included={false}
          onChange={e => handleChange('top', e)}
        />
        <Step
          label='左边距'
          labelWidth={60}
          value={data.left}
          min={0}
          max={100}
          step={0.1}
          inputMax={100}
          included={false}
          onChange={e => handleChange('left', e)}
        />
        <Space>
          <Button onClick={onVerticalCenter}>上下居中</Button>
          <Button onClick={onHorizontalCenter}>左右居中</Button>
        </Space>
        <Step
          label='字体大小'
          labelWidth={60}
          value={data.fontSize}
          min={1}
          max={40}
          step={1}
          inputMax={200}
          included={false}
          onChange={e => handleChange('fontSize', e)}
        />

        {
          data?.type === defaultParamType && Array.isArray(data.content) && data.content.length > 1 ? (
            <Step
              label='参数间隔'
              labelWidth={60}
              value={isNumber(data.contentSpace) ? data.contentSpace : defaultContentSpace}
              min={0}
              max={40}
              step={0.1}
              inputMax={100}
              included={false}
              onChange={e => handleChange('contentSpace', e)}
            />
          ) : null
        }

        <Flex wrap="wrap" gap="middle" align='center'>
          <span style={{ width: 60 }}>字体</span>
          <Select
            value={data?.fontFamily ? data?.fontFamily : 'unset'}
            style={{ flex: 1 }}
            onChange={e => handleChange('fontFamily', e)}
            options={fontFamilies}
          />
        </Flex>

        <Flex wrap="wrap" gap="middle" align='center'>
          <span style={{ width: 60 }}>字体颜色</span>
          <ColorPicker
            value={data?.color ? data?.color : '#fff'}
            showText
            format="hex"
            onChange={e => handleChange('color', e.toHexString())}
          />
        </Flex>

        <Step
          label='字体加粗'
          labelWidth={60}
          value={data.fontWeight}
          min={100}
          max={900}
          step={100}
          included={false}
          inputParams={{
            readOnly: true
          }}
          onChange={e => handleChange('fontWeight', e)}
        />

        <Flex wrap="wrap" gap="middle" align='center'>
          <span style={{ width: 60 }}>斜体</span>
          
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={!!data.italic}
            onChange={e => handleChange('italic', e)}
          />
        </Flex>

        <Flex wrap="wrap" gap="middle" align='center'>
          <span style={{ width: 60 }}>字体阴影</span>
          
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={!!data.shadow}
            onChange={e => handleChange('shadow', e)}
          />
        </Flex>
        
        {
          data.shadow ? (
            <>
              <Step
                label='横向偏移'
                labelWidth={60}
                min={0}
                max={20}
                step={1}
                inputMax={200}
                value={data?.shadowOffsetX ? data.shadowOffsetX : 0}
                onChange={e => handleChange('shadowOffsetX', e)}
              ></Step>
              <Step
                label='纵向偏移'
                labelWidth={60}
                min={0}
                max={20}
                step={1}
                inputMax={200}
                value={data?.shadowOffsetY ? data.shadowOffsetY : 0}
                onChange={e => handleChange('shadowOffsetY', e)}
              ></Step>
              <Step
                label='边缘模糊'
                labelWidth={60}
                min={0}
                max={20}
                step={1}
                inputMax={100}
                value={data?.shadowBlur ? data.shadowBlur : 0}
                onChange={e => handleChange('shadowBlur', e)}
              ></Step>

              <Flex wrap="wrap" gap="middle" align='center'>
                <span style={{ width: 60 }}>阴影颜色</span>
                <ColorPicker
                  value={data?.shadowColor ? data?.shadowColor : '#000'}
                  size="large"
                  showText
                  format="rgb"
                  onChange={e => handleChange('shadowColor', e.toHexString())}
                />
              </Flex>
              </>
          ) : null
        }


      </Space>
    </div>
  )
}

export default ParamItem
