
import { Flex, InputNumber, Slider, SliderSingleProps } from 'antd';
import { isNumber } from 'lodash';

interface StepProps {
  title?: string;
  label?: string;
  labelWidth?: number;
  value: number
  min?: number;
  max?: number;
  step?: number
  included?: boolean;
  marks?: SliderSingleProps['marks']
  inputMin?: number;
  inputMax?: number;
  inputStep?: number;
  noInput?: boolean;
  inputParams?: object;
  onChange: (value: number) => void
}

const Step = (props: StepProps) => {

  const {
    title,
    label,
    labelWidth,
    min = 0,
    max = 100,
    step = 0.1,
    inputMin,
    inputMax,
    inputStep,
    included,
    marks,
    value,
    noInput,
    inputParams = {},
    onChange
  } = props;

  return (
    <>
      {title ? (<h4>{title}</h4>) : null}

      <Flex wrap="wrap" gap="middle" align='center'>
          {label ? (
            <span
              style={labelWidth ? {
                width: labelWidth
              } : {}}
            >{label}</span>
          ) : null}
          <Slider
            style={{
              flex: 1
            }}
            min={min}
            max={max}
            step={step}
            included={included}
            marks={marks}
            onChange={onChange}
            value={typeof value === 'number' ? value : 0}
          />
          {
            noInput !== true ? (
              <InputNumber
                min={isNumber(inputMin) ? inputMin : min}
                max={isNumber(inputMax) ? inputMax : max}
                step={isNumber(inputStep) ? inputStep : step}
                value={value}
                controls
                keyboard
                {...inputParams}
                onChange={e => onChange(e || 0)}
              />
            ) : null
          }
      </Flex>

      {/* <Row>
        {label ? (<span>{label}</span>) : null}
        <Col span={17}>
          <Slider
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            value={typeof value === 'number' ? value : 0}
          />
        </Col>
        <Col span={5}>
          <InputNumber
            min={isNumber(inputMin) ? inputMin : min}
            max={isNumber(inputMax) ? inputMax : max}
            step={isNumber(inputStep) ? inputStep : step}
            style={{ margin: '0 16px' }}
            value={value}
            controls
            keyboard
            onChange={e => onChange(e || 0)}
          />
        </Col>
      </Row> */}
    </>
  );
};

export default Step;