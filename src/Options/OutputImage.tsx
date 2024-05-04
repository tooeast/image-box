import { useState } from 'react';

import { Button, Modal, message, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import domtoimage from '../dom-to-image-more';
// import domtoimage from 'dom-to-image-more';
import { sleep, download } from '../tools/exif';
import { isNumber } from 'lodash';
import { SettingOption, SettingState } from '../Setting';

function OutputImage(props: {
  settingOptions: SettingOption,
  imageSize: SettingState['canvasStyle'],
  filename: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [spinning, setSpinning] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    imageSize,
    filename,
    settingOptions
  } = props;
  
  function handleCancel() {

    messageApi.destroy()
    setSpinning(false);
    setIsModalOpen(false);
    setImgSrc('')
  }

  async function calcMaxImgSize() {
    const {width, height} = imageSize;

    // 画布所在区域的长宽
    const leftWidth = document.querySelector('#outputContent')?.clientWidth;
    const leftHeight = document.querySelector('#outputContent')?.clientHeight;

    if (!isNumber(leftHeight) || !isNumber(leftWidth)) {
      return;
    }

    const xrad = width / leftWidth;
    const yrad = height / leftHeight;
    const finalRad = Math.max(xrad, yrad);

    //  计算所得画布的最大长宽
    const canWid = Number(Number(width / finalRad).toFixed(2));
    const canHig = Number(Number(height / finalRad).toFixed(2));

    setImgWidth(canWid);
    setImgHeight(canHig)
  }

  async function handleClickOutput() {
    setSpinning(true);
    messageApi.open({
      type: 'loading',
      content: '图片绘制中...',
      duration: 0,
    });
    setIsModalOpen(true);
    await sleep(20);
    calcMaxImgSize()


    const fonts = settingOptions.params.map(a => a.fontFamily && a.fontFamily !== 'unset' ? a.fontFamily : null).filter(Boolean);

    const res = await domtoimage.toBlob(document.querySelector('#imageCanvas')!, {
      fonts: fonts
    });

    console.log('res', window.URL.createObjectURL(res))

    console.log('domtoimage', domtoimage)

    setImgSrc(window.URL.createObjectURL(res));

    await sleep(100);
    messageApi.destroy()
    setSpinning(false);
  }
  
  async function handleDownload() {
    messageApi.open({
      type: 'loading',
      content: '照片导出中...',
      duration: 0.3,
    });
    await sleep(200);
    download(imgSrc, filename);
    setIsModalOpen(false);
    messageApi.open({
      type: 'success',
      content: ' 图片导出成功！',
      duration: 2,
    });
  }

  return (
    <>
      {contextHolder}
      <Button type="primary" icon={<DownloadOutlined />} size='large' onClick={handleClickOutput}>导出</Button>

      <Modal
        title="导出图片"
        maskClosable={false}
        open={isModalOpen}
        width={1000}
        onCancel={handleCancel}
        onOk={handleDownload}
        okText="下载"
        cancelText="取消"
      >
        <Spin spinning={spinning}  tip="图片生成中...">
          <div className='output-inner background-sd'>
            <div className='output-content' id='outputContent'>
              {
                imgSrc ? (
                  <img src={imgSrc} alt="" style={{
                    width: imgWidth,
                    height: imgHeight
                  }} />
                ) : null
              }
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  )
}

export default OutputImage
