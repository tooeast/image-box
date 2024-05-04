import { cloneDeep, isNumber } from 'lodash';

import {Button, CollapseProps, Popconfirm, Space, message} from 'antd'
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { Empty, Collapse } from 'antd';

import { baseParamInfo, defaultContentSpace, defaultParamType, SettingOption, SettingState } from '../Setting';
import ParamItem from './ParamItem';
import AddParamModal from './AddParamText';
import {numberFix, sleep, imageInfoType} from '../tools/exif';
import { useState } from 'react';

type paramsType = SettingOption['params'][number];

function ParamsOptions(props: {
  exif: imageInfoType,
  setting: SettingOption,
  canvasStyle: SettingState['canvasStyle'],
  onChange: (e: SettingOption) => void
}) {
  const [activeKey, setActiveKey] = useState(['1']);

  const {
    setting,
    exif,
    onChange,
    canvasStyle
  } = props;

  const data = setting.params;

  function handleParamsChange(item: paramsType, index: number) {
    const newSetting = cloneDeep(setting);
    newSetting.params.splice(index, 1, item);
    onChange(newSetting)
  }

  function handleDeleteParam(index: number) {
    const newSetting = cloneDeep(setting);
    newSetting.params.splice(index, 1);
    onChange(newSetting)
  }

  async function handleAddNewText(obj: paramsType, extra: paramsType = baseParamInfo) {
    const newSetting = cloneDeep(setting);
    newSetting.params.push({
      ...extra,
      ...obj,
      ...(obj.type === defaultParamType && !isNumber(obj.contentSpace) ? {contentSpace: defaultContentSpace} : {})
    });
    onChange(newSetting);

    if (data.length) {
      setActiveKey([]);
      await sleep(1);
      setActiveKey([`${data.length + 1}`]);
    }
  }

  async function handleSetCenter(index: number, direction: 'vertical' | 'horizontal') {
    const sizeNum = document.querySelector('#params-id-' + index)![direction === 'vertical' ? 'clientHeight' : 'clientWidth'];
    const parentSize = canvasStyle[direction === 'vertical' ? 'height' : 'width'];

    if (!sizeNum) {
      message.error('无法获取对象位置，请手动调整');
      return;
    }

    handleParamsChange({
      ...cloneDeep(data[index]),
      [direction === 'vertical' ? 'top' : 'left']: numberFix(((parentSize - sizeNum) / 2) / parentSize * 100)
    }, index);
  }

  function getExtra(index: number) {
    return (
      <div onClick={e => e.stopPropagation()}>
        <Space size={'small'}>
          <AddParamModal
            nomore={data.length >= 6}
            options={exif.common}
            onAdd={(e: paramsType) => handleAddNewText(e, data[index])}
            defaultData={data[index]}
            trigger={(onClick) => (
              <div className='paramItem-card-delete' onClick={onClick}>
                <CopyOutlined />
              </div>
            )}
          />
          <Popconfirm
            title="确认删除？"
            description="确认删除这条文本信息吗"
            onConfirm={() => handleDeleteParam(index)}
            okText="删除"
            cancelText="不了"
          >
            <div className='paramItem-card-delete'>
              <DeleteOutlined />
            </div>
          </Popconfirm>
        </Space>
      </div>
    )
  }

  const items: CollapseProps['items'] = data.map((item, index: number) => ({
    key: String(index + 1),
    label: Array.isArray(item.content) ? item.content.join('_') : item.content,
    children: (
      <ParamItem
        key={index}
        data={item}
        onChange={(e: paramsType) => handleParamsChange(e, index)}
        onVerticalCenter={() => handleSetCenter(index, 'vertical')}
        onHorizontalCenter={() => handleSetCenter(index, 'horizontal')}
      ></ParamItem>
    ),
    extra: getExtra(index)
  }))

  return (
    <>
    <div>
      {/* <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <ParamItem key={index} data={item} onChange={(e: ParamKey) => handleParamsChange(e, index)} onDelete={() => handleDeleteParam(index)}></ParamItem>
          </List.Item>
        )}
      /> */}

        <AddParamModal
          nomore={data.length >= 5}
          options={exif.common}
          onAdd={handleAddNewText}
          trigger={(onClick) => (
            <Button block onClick={onClick} style={{marginBottom: 20}}>添加新文本</Button>
          )}
        />
        {
          Array.isArray(items) && items.length ? (
            <Collapse
              accordion
              items={items}
              bordered={false}
              activeKey={activeKey}
              onChange={e => setActiveKey(Array.isArray(e) ? e : [e])}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
          )
        }
      </div>
    </>
  )
}

export default ParamsOptions
