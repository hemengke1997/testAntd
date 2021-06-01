import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSetState, useUpdate } from 'ahooks';
import { Button } from 'antd';
import styles from './index.module.less';

const tableHeader = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

const week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

const TimeLine = () => {
  const [rowUnit, setRowUnit] = useState<any[][]>([]); // 单元格

  const [timeSection, setTimeSection] = useState<any[]>([]); // 时间段，可以返回给后台的数据
  const [timeStr, setTimeStr] = useState<any[]>([]); // 时间段，前端显示的数据

  const beginDay = useRef<number>(0);
  const beginTime = useRef<number>(0);
  const timeContent = useRef<any[]>([]); // 选中的时间段原始数据

  const [xy, setXy] = useSetState<{
    x?: number;
    y?: number;
  }>();

  const downEvent = useRef<boolean>(false);

  const update = useUpdate();

  const init = () => {
    for (let i = 0; i < 7; i++) {
      let arr: any[] = [];
      for (let j = 0; j < 48; j++) {
        arr.push({ class: null, timeData: j });
      }

      setRowUnit((t) => [...t, arr]);
      setTimeSection((t) => [...t, []]);
      setTimeStr((t) => [...t, '']);

      timeContent.current.push({ arr: [] });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleMouseDown = (i: number, day: number) => {
    downEvent.current = true; // 按下时鼠标不在范围内则不算
    beginDay.current = day;
    beginTime.current = i;
  };

  const handleMouseUp = (i: number, day: number) => {
    const start = beginTime.current <= i ? beginTime.current : i; // x轴 起点
    const length = Math.abs(beginTime.current - i);
    const end = start + length; // x轴 终点

    const dayStart = beginDay.current <= day ? beginDay.current : day; // y轴 起点
    const dayLength = Math.abs(beginDay.current - day);
    const dayEnd = dayStart + dayLength; // y轴 终点

    // 当框选范围内所有块都是选中状态时,执行反选
    function isAdd() {
      for (let x = dayStart; x < dayEnd + 1; x++) {
        for (let y = start; y < end + 1; y++) {
          if (rowUnit[x][y]?.class === null) return true;
        }
      }
      return false;
    }

    // 当点击事件是在table内才触发选取数据操作

    if (downEvent.current) {
      // 选时间段
      if (isAdd()) {
        for (let x = dayStart; x < dayEnd + 1; x++) {
          for (let y = start; y < end + 1; y++) {
            if (rowUnit[x][y]?.class === null) {
              setRowUnit((t) => {
                const m = [...t];
                m[x][y].class = styles.selected;
                return m;
              });

              timeContent.current[x].arr.push(rowUnit[x][y].timeData);
            }
          }
        }
      } else {
        // 反选
        for (let x = dayStart; x < dayEnd + 1; x++) {
          for (let y = start; y < end + 1; y++) {
            if (rowUnit[x][y]?.class === styles.selected) {
              setRowUnit((t) => {
                const m = [...t];
                m[x][y].class = null;
                return m;
              });
              const c = rowUnit[x][y].timeData;
              let kong: number | '' = '';
              for (let j = 0; j < timeContent.current[x].arr.length; j++) {
                if (c === timeContent.current[x].arr[j]) {
                  kong = j;
                }
              }
              timeContent.current[x].arr.splice(kong, 1);
            }
          }
        }
      }

      // 过滤时间段，将临近的时间段合并
      filterTime(dayStart, dayEnd);
    }
    downEvent.current = false;
    update();
  };

  const filterTime = (start: number, end: number) => {
    // 选中的x,y坐标信息 x:0-47  y:0-6
    function sortCut(arr: any[]) {
      // 提取连续的数据
      let result: any[] = [];
      arr.forEach((v, i) => {
        let temp = result[result.length - 1];
        if (!i) {
          result.push([v]);
        } else if (v % 1 === 0 && v - temp[temp.length - 1] === 1) {
          temp.push(v);
        } else {
          result.push([v]);
        }
      });
      // console.log(result,'arr1')
      return result;
    }

    function toStr(num: number) {
      if (Number.isInteger(num)) {
        let str = num < 10 ? `0${num}` : num.toString();
        return `${str}:00`;
      }
      let str = Math.floor(num) < 10 ? `0${Math.floor(num)}` : Math.floor(num).toString();
      return `${str}:30`;
    }

    function timeToStr(arr: any[]) {
      // 把数组转成方便人看到字符串
      let str = '';
      arr.forEach((item, index) => {
        let str1 = '';
        if (index === 0) {
          str1 = `${toStr(item[0])}~${toStr(item[1])}`;
        } else {
          str1 = ` , ${toStr(item[0])}~${toStr(item[1])}`;
        }
        str += str1;
      });

      return str;
    }

    // 排序,分割
    for (let i = start; i < end + 1; i++) {
      let arr1 = sortCut((timeContent.current[i].arr as any[]).sort((a, b) => a - b));
      let arr2: any[] = [];
      arr1.forEach((arr) => {
        // 转成带小数点的时间段,以及供前端显示的字符串
        let arr3 = [];
        arr3.push(arr[0] / 2);
        arr3.push(arr[arr.length - 1] / 2 + 0.5);
        arr2.push(arr3);
      });
      setTimeStr((t) => {
        const m = [...t];
        m[i] = timeToStr(arr2);
        return m;
      });
      setTimeSection((t) => {
        const m = [...t];
        m[i] = arr2;
        return t;
      });
    }
  };

  const RowDom = (title: string, i: number) => {
    return (
      <tr key={i} onMouseDown={down} onMouseMove={move}>
        <td>{title}</td>
        {rowUnit[i] && rowUnit[i].length
          ? rowUnit[i].map((item, index) => (
              <td
                className={classNames(styles.calendarTime, item.class)}
                key={index}
                onMouseDown={() => handleMouseDown(index, i)}
                onMouseUp={() => handleMouseUp(index, i)}
              ></td>
            ))
          : null}
      </tr>
    );
  };

  const down: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setXy({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const [canvas, setCanvas] = useSetState<
    Partial<{
      left: number;
      top: number;
      background: string;
      height: number;
      width: number;
      opacity: number;
      border: number;
      zIndex: number;
    }>
  >();

  const move: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { x, y } = xy;
    if (x === undefined || y === undefined) {
      return;
    }
    const h = e.pageY - y;
    const w = e.pageX - x;

    setCanvas({
      left: e.pageX,
      top: e.pageY,
      height: h,
      width: w,
      border: 1,
      background: '#91d5ff',
    });

    const hc = -h;
    const wc = -w;

    if (h < 0 && w >= 0) {
      console.log(1);
      setCanvas({
        height: hc,
        left: x,
      });
    } else if (h >= 0 && w < 0) {
      console.log(2);

      setCanvas({
        width: wc,
        top: y,
      });
    } else if (h < 0 && w < 0) {
      console.log(3);

      setCanvas({
        height: hc,
        width: wc,
      });
    } else {
      setCanvas({
        left: x,
        top: y,
      });
    }

    const { width = 0, height = 0 } = canvas;
    if (width < 0) {
      setCanvas((t) => ({
        width: 0 - t.width!,
      }));
    }
    if (height < 0) {
      setCanvas((t) => ({
        height: 0 - t.height!,
      }));
    }
  };

  const up = () => {
    setCanvas({
      left: undefined,
      top: undefined,
      width: undefined,
      height: undefined,
      border: 0,
      background: '',
    });
    setXy({
      x: undefined,
      y: undefined,
    });
  };

  useEffect(() => {
    document.addEventListener('mouseup', up);
    return () => {
      document.removeEventListener('mouseup', up);
    };
  }, []);

  const clear = () => {
    setRowUnit((t) => {
      t.forEach((item: any[]) => {
        item.forEach((item1) => {
          item1.class = null;
        });
      });
      return t;
    });

    timeContent.current.forEach((item) => {
      item.arr = [];
    });

    setTimeSection((t) => {
      t.forEach((item) => {
        item.length = 0;
      });
      return t;
    });

    setTimeStr(() => {
      const m: any[] = [];
      for (let i = 0; i < 7; i++) {
        m.push('');
      }
      return m;
    });
  };

  return (
    <div className={styles.bytedWeektime}>
      <div className={styles.calendar}>
        <table className={styles.calendarTable} style={{ width: 610 }}>
          <thead>
            <tr>
              <th rowSpan={6} className={styles.weekTd}>
                星期/时间
              </th>
              <th colSpan={24}>00:00 - 12:00</th>
              <th colSpan={24}>12:00 - 24:00</th>
            </tr>
            <tr>
              {tableHeader.map((item, index) => (
                <td colSpan={2} key={index}>
                  {item}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {week.map((item, index) => RowDom(item, index))}
            <tr>
              <td colSpan={49} className={styles.tdTableTip}>
                <div className={styles.clearfix}>
                  <span className={classNames(styles.pullLeft)}>请用鼠标框选时间段</span>
                  <Button type="link" className={styles.pullRight} onClick={clear}>
                    清空
                  </Button>
                </div>
              </td>
            </tr>

            {timeStr.some((item) => !!item) ? (
              <tr>
                <td colSpan={49} className={styles.content}>
                  {timeStr.map((item, index) => {
                    return item.length ? (
                      <div key={index} className={styles.timeString}>
                        <span>{week[index]}：</span>
                        <strong>
                          <span>{item}</span>
                        </strong>
                      </div>
                    ) : null;
                  })}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* 鼠标的画框效果 */}
      <div
        onMouseDown={down}
        onMouseMove={move}
        style={{
          backgroundColor: canvas.background || '#91d5ff',
          height: canvas.height,
          width: canvas.width,
          position: 'fixed',
          left: canvas.left,
          top: canvas.top,
          opacity: 0.3,
          border: `${canvas.border}px dashed #000`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      ></div>
    </div>
  );
};

export default TimeLine;
