import React from 'react';
import MenuItem from '../menuitem/MenuItem';
import navbarStyles from './Navbar.module.scss';

function Navbar(props) {
	return (
		<div className={`${navbarStyles.TopBar}`}>
			<MenuItem name="Github Home" href="/" />
			<MenuItem name="ScrapMechanic Documentation" href="/smdocs" />
		</div>
	);
}

export default Navbar;
