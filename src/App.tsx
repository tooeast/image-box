import type {UploadProps} from 'antd'
import { Upload, message, Modal, Layout } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { getImageInfo, sleep, imageTypes, imageInfoType } from './tools/exif';

import './App.scss'
import { useState } from 'react';

import Setting from './Setting';
import { isObject } from 'lodash';
const { confirm } = Modal;

const { Dragger } = Upload;
const { Header, Content, Footer } = Layout;

export interface RcFile extends File {
  uid: string;
}

function App() {
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [imageInfo, setImageInfo] = useState<imageInfoType | object>({});

  const [messageApi, contextHolder] = message.useMessage();

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: async (info) => {
      const fileType = String((info?.file as RcFile)?.type).toLowerCase().replace(/^image\//, '');

      if (!imageTypes.includes(fileType)) {
        messageApi.open({
          type: 'error',
          content: '无法识别的图片格式',
          duration: 2,
        });
        return;
      }

      if (!(info?.file as RcFile)?.uid) {
        messageApi.open({
          type: 'error',
          content: '图片无法识别',
          duration: 2,
        });
        return;
      }

      const filename = (info.file as RcFile)?.name || 'image-' + Date.now() + '.jpg';

      messageApi.open({
        type: 'loading',
        content: '照片分析中...',
        duration: 0,
      });
      
      const exif = await getImageInfo(info.file as File);
      await sleep(300);

      console.log('exif', exif)

      if (!isObject(exif)) {
        messageApi.destroy()
        messageApi.open({
          type: 'error',
          content: exif || '您的照片有问题，无法读取 EXIF 信息',
          duration: 2,
        });
        return;
      }

      setImageUrl(window.URL.createObjectURL(info.file as RcFile));
      setImageInfo({
        ...(exif as imageInfoType),
        filename
      });

      if (exif.unnormal) {
        messageApi.destroy()
        confirm({
          title: '温馨提示',
          icon: <ExclamationCircleFilled />,
          content: '无法读取到照片的 EXIF 信息，但您仍可继续编辑，是否继续?',
          okText: '继续编辑',
          cancelText: '取消',
          async onOk() {

            messageApi.open({
              type: 'loading',
              content: '环境准备中...',
              duration: 1,
            });
            await sleep(1100)
            setStep(2)
          }
        });
        return;
      }

      messageApi.destroy()
      messageApi.open({
        type: 'loading',
        content: '加载编辑环境...',
        duration: 1,
      });
      await sleep(500)

      messageApi.destroy()

      setStep(2)

      return false;
    }
  };

  function handleReUpload() {
    console.log('1')
    setStep(1)
  }

  return (
    <>
      {contextHolder}

      <Header style={{ display: 'flex', alignItems: 'center' }}></Header>

      <Content className='ant-content'>
        <div className='sa-container'>
        {
          step === 1 ? (
            <Dragger {...props} fileList={[]}>
              <p>点击上传或拖拽</p>
            </Dragger>
          ) : (
            <Setting imageInfo={imageInfo as imageInfoType} imageUrl={imageUrl} reUpload={handleReUpload} />
          )
        }
        </div>
      </Content>
      <Footer className='ant-footer'>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </>
  )
}

export default App
