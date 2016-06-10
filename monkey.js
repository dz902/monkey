/* jslint browser: true, node: true, sub: true, esversion: 6 */
'use strict';

const createView = function(template, patcher) {
	let mountingPoint = null;

	function patch(stateChanges) {
		patcher.call(mountingPoint, stateChanges);
	}

	function render(selector, state) {
		mountingPoint = document.querySelector(selector); // could throw SYNTAX_ERROR

		if (mountingPoint === null) {
			throw new Error(`[render] Selector (${selector}) does not match any element.`);
		}

		// mount template

		mountingPoint.innerHTML = template;

		// template must have single root element

		if (mountingPoint.children.length > 1) {
			throw new Error('[render] Template is not wrapped into single element.');
		}

		// TODO: scripts should be stripped

		// initialize template

		patch(state);
	}
	
	return {
		patch: patch,
		render: render
	};
};

module.exports = createView;
