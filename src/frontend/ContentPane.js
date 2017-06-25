import $ from "jquery";

const ShownTabs = '.nav-tabs .tab[style!="display: none;"]';
const HiddenTabs = '.nav-tabs .tab[style*="display: none;"]';

const checkTabSize = () => {
	//Get Tab Area
	const buttonWidth = $('#nav-buttons')
		.width();
	const tabAreaWidth = $('.nav-tabs')
		.width() - buttonWidth;
	let tabWidths = 0;
	let firstHidden;

	//Add Up the Tabs' Widths
	$.each($(ShownTabs), (idx, obj) => {
		tabWidths += $(obj)
			.outerWidth(); //padding
	});

	//Find out which ones to hide
	while (tabWidths > tabAreaWidth) {
		const hider = $(ShownTabs)
			.last();
		tabWidths -= $(hider)
			.outerWidth();
		$(hider)
			.hide();
	}

	//See if we can show any
	firstHidden = $(HiddenTabs)
		.first();
	while (firstHidden.length > 0 && (tabWidths + firstHidden.width()) < tabAreaWidth) {
		tabWidths += $(firstHidden)
			.outerWidth();
		$(firstHidden)
			.show();
		firstHidden = $(HiddenTabs)
			.first();
	}

	//Affect drop-down button
	if ($(HiddenTabs)
		.length === 0) {
		$('#tabDrop')
			.hide();
	} else {
		$('#tabDrop')
			.show();
	}

	//Hide drop-down tabs as necessary
	var shown = $(ShownTabs);

	$.each($('#tabDropdown li'), (idx, obj) => {
		const isInShown = $.grep(shown, (el) => {
				return $(el)
					.find('a')
					.data('target') == $(obj)
					.find('a')
					.data('target');
			})
			.length > 0;
		if (isInShown) {
			$(obj)
				.hide();
		} else {
			$(obj)
				.show();
		}
	});
};

const setActiveTabsYourself = () => {
	$('.nav-tabs li')
		.removeClass('active');
	const activeTab = $('.tab-pane.active');
	if (activeTab.length > 0) {
		const activeID = $(activeTab[0])
			.attr('id');
		$(`.nav-tabs li a[data-target=${activeID}]`)
			.parent()
			.addClass('active');
	}
};


export function init() {
	console.log("Initializing status pane..");
	$('.nav-tabs li')
		.click(() => {
			setTimeout(setActiveTabsYourself, 10);
		});
	window.onresize = () => {
		checkTabSize();
	};
	setTimeout(checkTabSize, 100);
	//setTimeout(setActiveTabsYourself, 100);
}
