import { useState, ReactNode } from 'react';

import { Modal, Button, Form, Radio, Select, Space, message, Input } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import {defaultParamType} from '../Setting'
import { sleep, imageInfoType } from '../tools/exif';

const { TextArea } = Input;


interface FieldData {
  name: string | number | (string | number)[];
  value?: string;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}
interface FormDataType {
  type: 'exif' | 'customize';
  content?: Array<string> | string;
  exifContent?: string[];
  customContent?: string;
}

const originalFormData: FormDataType = {
  type: 'exif'
}


function setFormDataDefault(data: FormDataType): FormDataType {
  if (data.type === defaultParamType) {
    return {
      type: data.type,
      exifContent: data?.content?.length ? [...data.content] : []
    }
  }
  else {
    return {
      type: data.type,
      customContent: Array.isArray(data.content) ? data.content.join() : data.content
    }
  }
}

function formDataToFields(data: FormDataType) {
  return Object.keys(data).map((key: string) => ({
    name: [key],
    value: data[key]
  }))
}

interface AddParamModal {
  defaultData?: FormDataType,
  options: imageInfoType['common'];
  trigger?: (onClick: () => void) => ReactNode;
  onAdd?: (e: FormDataType) => void;
  [key: string]: unknown;
}

function AddParamModal(props: AddParamModal) {
  const {options, onAdd, nomore, trigger, defaultData} = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(originalFormData);

  const [fields, setFields] = useState<FieldData[]>(formDataToFields(formData));

  const [form] = Form.useForm();


  async function handleAddParams() {
    if (nomore) {
      message.info('至多可添加五条文本');
      return
    }

    const newFormData = defaultData?.type ? setFormDataDefault(defaultData) : originalFormData
    setFormData(newFormData);
    setFields(formDataToFields(newFormData))
    await sleep(100)

    setIsModalOpen(true)
  }

  function handleConfirmAdd() {
    const cloneData = cloneDeep(formData);
    const content = cloneData.type === defaultParamType ? cloneData.exifContent : cloneData.customContent;

    if (isEmpty(content)) {
      
      message.info('内容不可为空');
      return
    }

    onAdd({
      type: cloneData.type,
      content
    })
    handleCancel()
  }

  function handleCancel() {
    setIsModalOpen(false)
    resetFormData()
  }

  function onFormChange(_, data: FieldData[]) {
    const newData: FormDataType ={type: 'exif'};

    data.forEach((item: FieldData) => {
      newData[item.name[0]] = item.value
    });

    setFormData(newData);
    setFields(data)
  }

  function resetFormData() {
    form.resetFields(['content', 'type', 'exifContent', 'customContent']);
    setFormData(originalFormData);
  }

  return (
    <>
      {
        trigger ? trigger(handleAddParams) : <Button onClick={handleAddParams}>按钮</Button>
      }
      

      <Modal
        title="新建文本信息"
        maskClosable={false}
        open={isModalOpen}
        width={1000}
        onOk={handleConfirmAdd}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          initialValues={formData}
          onFieldsChange={onFormChange}
          fields={fields}
          style={{ marginTop: 30}}
        >
          <Form.Item label="内容来源" name="type">
            <Radio.Group>
              <Radio.Button value="exif">照片内置信息</Radio.Button>
              <Radio.Button value="customize">自定义信息</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {
            formData.type === defaultParamType ? (
              <>
                <Form.Item label="内容（可多选）" name="exifContent">
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    options={options}
                    virtual={false}
                    optionLabelProp='name'
                    optionRender={(option) => (
                      <Space>
                        {`${option.data.name}`}
                        {`(${option.value})`}
                      </Space>
                    )}
                  />
                </Form.Item>

                <Form.Item label="参数预览">
                  <div className='addModal-preview-text'>
                    {
                      Array.isArray(formData.exifContent) && formData.exifContent.length ? formData.exifContent.map((item: string) => (
                        <span key={item}>{item}</span>
                      )) : null
                    }
                  </div>
                  <div className='addModal-tips-text'>Tips: 选择后的参数不可编辑，可以点击"转为自定义文案编辑"去自定义编辑</div>
                </Form.Item>
              </>
            ) : (
              <Form.Item label="内容" name="customContent">
                <TextArea style={{
                  height: 200
                }}></TextArea>
              </Form.Item>
            )
          }
        </Form>
      </Modal>
    </>
  )
}

export default AddParamModal
