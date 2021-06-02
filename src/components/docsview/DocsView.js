import React from 'react';
import styles from './DocsView.module.scss';

function class_list_search(elm) {

}

function DocsView(props) {
	return (
		<div className={`${styles.Vertical}`}>
			<div className={`${styles.Horizontal}`}>
				<div className={`${styles.SearchCard}`}>
					<input className={`${styles.SearchBar}`} id="class-search" placeholder="Search" spellcheck="false" onChange={class_list_search} type="text"/>
					<ul id="class-search-list">
						
					</ul>
				</div>
				<div className={`${styles.DocsCard}`}>
					Documentation
				</div>
			</div>
		</div>
	);
}

export default DocsView;
