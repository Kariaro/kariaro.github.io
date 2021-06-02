import React from 'react';
import styles from './DocsView.module.scss';
import logo from '../images/logo.png';

import DocsFunc from './functions/DocsFunc';
//import DocsConst from './functions/DocsConst';
import DocsJson from '../data/api.0.5.1_658.json';

function class_list_search(elm) {

}

function Namespace(json) {
	console.log(json);
}

function JsonMap(json, func) {
	let result = [];
	let json_keys = Object.keys(json);
	for(let i in json_keys) {
		let ret = func(json_keys[i], json[json_keys[i]]);
		if(ret) result.push(ret);
	}

	return result;
}

function DocsView(props) {
	const DocsContent = DocsJson.content;
	
	return (
		<div className={`${styles.Vertical}`}>
			<div className={`${styles.Horizontal}`}>
				<div className={`${styles.SearchCard}`}>
					<img className={`${styles.Logo}`} src={logo} alt="Logo"/>
				</div>
				<div className={`${styles.DocsCard}`}>
					<p>I'm currently working on making this project more community driven.<br/>
						<a class="pagelink" href="https://github.com/Kariaro/kariaro.github.io" target="blank">[GitHub Repository]</a>
					</p>
					<p>Special thanks to TechnologicNick for helping me with documentation.<br/>
						<a class="pagelink" href="https://github.com/TechnologicNick" target="blank">[GitHub TechnologicNick]</a>
					</p>
					<p>Owner GitHub:<br/>
						<a class="pagelink" href="https://github.com/Kariaro" target="blank">[GitHub HardCoded]</a>
					</p>
				</div>
			</div>
			<div className={`${styles.Horizontal}`}>
				<div className={`${styles.SearchCard}`}>
					<input className={`${styles.SearchBar}`} id="class-search" placeholder="Search" spellCheck="false" onChange={class_list_search} type="text"/>
					<ul id="class-search-list">
						
					</ul>
				</div>
				<div className={`${styles.DocsCard}`}>
					<div id="tabledata">{JsonMap(DocsContent, (key, value) => DocsFunc(key, value, false))}</div>
					{/*<div id="tabledata">{JsonMap(DocsContent, (key, value) => DocsFunc(key, value, false))}</div>*/}
					{/*<div id="constants">{JsonMap(DocsContent, (key, value) => DocsFunc(key, value, false))}</div>*/}
				</div>
			</div>
		</div>
	);
}

export default DocsView;
