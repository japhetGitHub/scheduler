import React from "react";
import classNames from "classnames";
import 'components/DayListItem.scss';

export default function DayListItem(props) {
  function formatSpots(spots) {
    if (spots === 0) {
      return 'no spots remaining';
    } else if (spots === 1) {
      return '1 spot remaining';
    } else {
      return `${spots} spots remaining`;
    }
  }
  const liClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });

  return (
    <li className={liClass} onClick={() => props.setDay(props.name)} selected={props.selected} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}