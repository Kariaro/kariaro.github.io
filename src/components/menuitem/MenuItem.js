import React from 'react';
import { NavLink } from 'react-router-dom';

import itemStyles from './MenuItem.module.scss';
import common from '../Common.module.scss';

function MenuItem(props) {
	return (
		<NavLink exact to={props.href} activeClassName={`${itemStyles.SelectedItem}`} className={`${itemStyles.Item}`}>
			{props.name}
		</NavLink>
	);
}

export default MenuItem;
