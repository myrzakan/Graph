import { format as formatDate } from 'date-fns';
import ru from 'date-fns/locale/ru';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import './index.css';

const fetchContributionsData = async () => {
  const response = await fetch('https://dpg.gg/test/calendar.json');
  if (!response.ok) {
    console.log('Failed to fetch data');
  }
  return response.json();
};

function App() {
  const { data, isLoading, isError } = useQuery(
    'contributions',
    fetchContributionsData,
  );

  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = event => {
    const contributions = event.target.getAttribute('data-contributions');
    const cellDateStr = event.target.getAttribute('data-date');

    if (contributions !== null && contributions > 0 && cellDateStr) {
      const cellDate = new Date(cellDateStr);
      const formattedDate = formatDate(cellDate, 'EEEE, LLLL d, yyyy', {
        locale: ru,
      });
      setTooltipContent(
        <>
          <div className="tooltip-box">
            <p className="tooltip-contributions">
              {contributions} contributions
            </p>
            <p className="tooltip-date">{formattedDate}</p>
          </div>
        </>,
      );
      setTooltipPosition({
        top: event.clientY + 10 + window.scrollY,
        left: event.clientX + 10 + window.scrollX,
      });
    } else if (contributions === '0') {
      event.target.classList.add('box');
    }
  };

  const handleMouseLeave = event => {
    setTooltipContent('');
    event.target.classList.remove('box');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const rows = [];
  for (let row = 0; row < 7; row++) {
    const cells = [];
    for (let col = 0; col < 51; col++) {
      const cellDate = new Date(currentDate);
      cellDate.setDate(currentDate.getDate() - col - row * 7);
      const cellDateStr = cellDate.toISOString().split('T')[0];
      const contributions = data[cellDateStr] || 0;
      let backgroundColor = '';
      if (contributions === 0) {
        backgroundColor = '#EDEDED';
      } else if (contributions >= 1 && contributions <= 9) {
        backgroundColor = '#ACD5F2';
      } else if (contributions >= 10 && contributions <= 19) {
        backgroundColor = '#7FA8C9';
      } else if (contributions >= 20 && contributions <= 29) {
        backgroundColor = '#527BA0';
      } else {
        backgroundColor = '#254E77';
      }
      cells.push(
        <div
          key={cellDateStr}
          className="contribution-box"
          style={{ backgroundColor }}
          data-contributions={contributions}
          data-date={cellDateStr}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        ></div>,
      );
    }
    rows.push(
      <div key={row} className="contribution-row">
        {cells}
      </div>,
    );
  }

  return (
    <div className="App">
      <div className="contribution-graph">
        <div className="Month">
          <p>Апр.</p>
          <p>Май.</p>
          <p>Июнь.</p>
          <p>Июль.</p>
          <p>Авг.</p>
          <p>Сент.</p>
          <p>Окть.</p>
          <p>Ноя.</p>
          <p>Дек.</p>
          <p>Янв.</p>
          <p>Февр.</p>
          <p>Март.</p>
        </div>
        {rows}
        {tooltipContent && (
          <div
            className="tooltip"
            style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          >
            {tooltipContent}
          </div>
        )}
      </div>
      <div className="Week">
        <p>Пн</p>
        <p>Ср</p>
        <p>Пт</p>
      </div>
    </div>
  );
}

export default App;
