/* jslint browser: true, node: true, sub: true, esversion: 6 */
'use strict';

const createView = function(template, initializer, patcher) {
	// variable declaration

	var viewObj, renderFunc, patchFunc;

	// basic validations
	
	if (patcher.length !== 2) {
		throw new Error(`[createView] Patcher does not take 2 arguments (now: ${patcher.length}).`);
	}

	// render view at mounting point with initial state, also curries patch function

	renderFunc = function render(mountingPointSelector, initialState) {
		let mountingPoint = document.querySelector(mountingPointSelector); // could throw SYNTAX_ERROR

		if (mountingPoint === null) {
			throw new Error(`[render] Selector (${mountingPointSelector}) does not match any element.`);
		}

		// template must have single root element

		if (mountingPoint.children.length > 1) {
			throw new Error('[render] Template is not wrapped into single element.');
		}

		// TODO: scripts should be stripped
		
		// mount template

		let elemContainer = document.createElement('div');
		elemContainer.innerHTML = template;
		
		let rootElem = elemContainer.firstElementChild;
		
		mountingPoint.parentNode.replaceChild(rootElem, mountingPoint);

		// initialize the view with event handlers, etc.

		initializer.call(undefined, mountingPoint);

		// curry the patch function

		let patchRootElemFunc = patchFunc.bind(undefined, rootElem);

		// render the initial state

		patchRootElemFunc.call(undefined, initialState);
		
		// update view object
		
		viewObj.patch = patchRootElemFunc;
	};
	
	// internal patch function, must be curried

	patchFunc = function patch(rootElem, stateChanges) {
		patcher(rootElem, stateChanges);
	};

	// intermediate object for currying patch function

	viewObj = {
		patch: () => { throw new Error('[patch] View is not rendered thus patching is unavailable.'); },
		render: renderFunc
	};

	return viewObj;
};

module.exports = createView;
