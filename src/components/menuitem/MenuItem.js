import React from 'react';
import itemStyles from './MenuItem.module.scss';
import common from '../Common.module.scss';

function MenuItem(props) {
	console.log(props.href);
	console.log(window.location);

	let link_enabled = !(window.location.pathname === props.href);
	return (
		<div className={`${link_enabled ? itemStyles.Item:itemStyles.SelectedItem}`}>
			<a className={`${link_enabled ? common.Link:itemStyles.SelectedLink}`} href={props.href} target='blank'>{props.name}</a>
		</div>
	);
}

export default MenuItem;
