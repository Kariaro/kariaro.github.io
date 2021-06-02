import React from 'react';
import styles from './Card.module.scss';

function Card(props) {
	if(props.vertical) {
		let type = (props.vertical === 'true');
		return (
			<div className={`${type ? styles.Vertical:styles.Horizontal}`}>
				{props.children}
			</div>
		);
	}
	
	return (
		<div className={`${styles.Card}`}>
			{props.children}
		</div>
	);
}

export default Card;
