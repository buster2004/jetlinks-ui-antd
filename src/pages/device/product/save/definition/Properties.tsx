import React, { Fragment, useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Form, Card, Button, Table, Divider } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { PropertiesMeta } from '../../component/data.d';

import PropertiesDefin from '../../component/properties';

interface Props extends FormComponentProps {
  save: Function;
  data: any[];
}
interface State {
  data: PropertiesMeta[];
  current: Partial<PropertiesMeta>;
  visible: boolean;
}

const Properties: React.FC<Props> = (props: Props) => {
  const initState: State = {
    data: props.data,
    current: {},
    visible: false,
  };

  const [visible, setVisible] = useState(initState.visible);
  const [data, setData] = useState(initState.data);
  const [current, setCurrent] = useState(initState.current);

  const editItem = (item: any) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (item: any) => {
    setData(data.filter(e => e.id !== item.id));
    props.save(data);
  };

  const columns: ColumnProps<PropertiesMeta>[] = [
    {
      title: '属性标识',
      dataIndex: 'id',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => text.type,
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: text => (text === 'true' ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => editItem(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => deleteItem(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  const savePropertiesData = (item: PropertiesMeta) => {
    if (!item.id) {
      const temp = { ...item, id: (data.length + 1).toString() };
      data.push(temp);
    } else {
      const i = data.findIndex((j: any) => j.id === item.id);
      data[i] = item;
    }
    setVisible(false);
    setData(data);
    props.save(data);
  };
  return (
    <div>
      <Card
        title="属性定义"
        style={{ marginBottom: 20 }}
        extra={
          <Button type="primary" onClick={() => setVisible(true)}>
            添加
          </Button>
        }
      >
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>
      {visible && (
        <PropertiesDefin
          data={current}
          save={(item: PropertiesMeta) => {
            savePropertiesData(item);
          }}
          close={() => {
            setVisible(false);
            setCurrent({});
          }}
        />
      )}
    </div>
  );
};
export default Form.create<Props>()(Properties);
